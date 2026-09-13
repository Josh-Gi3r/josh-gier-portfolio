import {
  addQuantity,
  assertCompatibleQuantity,
  quantity,
  shortfallQuantity,
  subtractQuantity,
  type Quantity,
} from "./food-quantity";
import { getCanonicalPrepV2, recipePrepV2 } from "./food-truth-v2";

export type ComponentStockV2 = Readonly<Record<string, Quantity>>;

export type PrepDemandV2 = Readonly<{
  componentId: string;
  required: Quantity;
}>;

export type PrepNeedV2 = Readonly<{
  componentId: string;
  required: Quantity;
  onHand: Quantity;
  shortfall: Quantity;
}>;

export type PrepBatchV2 = Readonly<{
  batchId: string;
  componentId: string;
  initial: Quantity;
  remaining: Quantity;
  producedAt: string;
  recipeVersion: string;
  measurementStatus: "household_measured" | "household_calibrated";
}>;

function canonicalZero(componentId: string): Quantity {
  const component = getCanonicalPrepV2(componentId);
  if (!component) throw new Error(`Unknown prep component: ${componentId}`);
  return quantity(0, component.workingUnit.unit);
}

function stockValue(stock: ComponentStockV2, componentId: string): Quantity {
  const component = getCanonicalPrepV2(componentId);
  if (!component) throw new Error(`Unknown prep component: ${componentId}`);
  const value = stock[componentId];
  if (!value) return canonicalZero(componentId);
  if (value.unit !== component.workingUnit.unit) throw new Error(`Stock unit mismatch for ${componentId}: ${value.unit} vs ${component.workingUnit.unit}`);
  return value;
}

export function emptyComponentStockV2(): ComponentStockV2 {
  return {};
}

export function prepDemandForRecipesV2(recipeIds: readonly string[]): PrepDemandV2[] {
  const demand = new Map<string, Quantity>();
  for (const recipeId of recipeIds) {
    for (const requirement of recipePrepV2(recipeId)) {
      const current = demand.get(requirement.componentId) ?? canonicalZero(requirement.componentId);
      demand.set(requirement.componentId, addQuantity(current, requirement.quantity));
    }
  }
  return [...demand].map(([componentId, required]) => ({ componentId, required }));
}

export function prepNeedsForRecipesV2(recipeIds: readonly string[], stock: ComponentStockV2): PrepNeedV2[] {
  return prepDemandForRecipesV2(recipeIds)
    .map(({ componentId, required }) => {
      const onHand = stockValue(stock, componentId);
      return { componentId, required, onHand, shortfall: shortfallQuantity(required, onHand) };
    })
    .filter(need => need.shortfall.qty > 0);
}

export function recipePrepAvailabilityV2(recipeId: string, stock: ComponentStockV2) {
  const missing = recipePrepV2(recipeId)
    .map(requirement => {
      const onHand = stockValue(stock, requirement.componentId);
      const shortfall = shortfallQuantity(requirement.quantity, onHand);
      return { componentId: requirement.componentId, required: requirement.quantity, onHand, shortfall };
    })
    .filter(item => item.shortfall.qty > 0);
  return { ready: missing.length === 0, missing };
}

export function consumeRecipePrepV2(recipeId: string, stock: ComponentStockV2): ComponentStockV2 {
  const availability = recipePrepAvailabilityV2(recipeId, stock);
  if (!availability.ready) {
    const summary = availability.missing.map(x => `${x.componentId}:${x.shortfall.qty}${x.shortfall.unit}`).join(", ");
    throw new Error(`Insufficient prep stock for ${recipeId}: ${summary}`);
  }
  const next: Record<string, Quantity> = { ...stock };
  for (const requirement of recipePrepV2(recipeId)) {
    const onHand = stockValue(next, requirement.componentId);
    next[requirement.componentId] = subtractQuantity(onHand, requirement.quantity);
  }
  return next;
}

export function createMeasuredPrepBatchV2(input: {
  batchId: string;
  componentId: string;
  measuredOutput: Quantity;
  producedAt: string;
  recipeVersion: string;
  calibrated?: boolean;
}): PrepBatchV2 {
  const component = getCanonicalPrepV2(input.componentId);
  if (!component) throw new Error(`Unknown prep component: ${input.componentId}`);
  if (input.measuredOutput.qty <= 0) throw new Error(`Measured batch output must be positive for ${input.componentId}`);
  if (input.measuredOutput.unit !== component.workingUnit.unit) {
    throw new Error(`Measured batch unit mismatch for ${input.componentId}: ${input.measuredOutput.unit} vs ${component.workingUnit.unit}`);
  }
  if (!input.batchId.trim()) throw new Error("Prep batch requires a batchId");
  if (!input.recipeVersion.trim()) throw new Error("Prep batch requires a recipeVersion");
  if (Number.isNaN(Date.parse(input.producedAt))) throw new Error("Prep batch requires a valid producedAt timestamp");
  return {
    batchId: input.batchId,
    componentId: input.componentId,
    initial: input.measuredOutput,
    remaining: input.measuredOutput,
    producedAt: input.producedAt,
    recipeVersion: input.recipeVersion,
    measurementStatus: input.calibrated ? "household_calibrated" : "household_measured",
  };
}

export function componentStockFromBatchesV2(batches: readonly PrepBatchV2[]): ComponentStockV2 {
  const result: Record<string, Quantity> = {};
  for (const batch of batches) {
    const component = getCanonicalPrepV2(batch.componentId);
    if (!component) throw new Error(`Unknown prep component in batch: ${batch.componentId}`);
    if (batch.remaining.unit !== component.workingUnit.unit) throw new Error(`Batch unit mismatch for ${batch.componentId}`);
    const current = result[batch.componentId] ?? canonicalZero(batch.componentId);
    result[batch.componentId] = addQuantity(current, batch.remaining);
  }
  return result;
}

export function consumeBatchesFifoV2(componentId: string, required: Quantity, batches: readonly PrepBatchV2[]): PrepBatchV2[] {
  const component = getCanonicalPrepV2(componentId);
  if (!component) throw new Error(`Unknown prep component: ${componentId}`);
  if (required.unit !== component.workingUnit.unit) throw new Error(`FIFO consumption unit mismatch for ${componentId}`);
  const available = componentStockFromBatchesV2(batches)[componentId] ?? canonicalZero(componentId);
  if (available.qty < required.qty) throw new Error(`Insufficient measured batches for ${componentId}`);

  let left = required.qty;
  const next = batches.map(batch => ({ ...batch }));
  const order = next
    .map((batch, index) => ({ batch, index }))
    .filter(x => x.batch.componentId === componentId && x.batch.remaining.qty > 0)
    .sort((a, b) => Date.parse(a.batch.producedAt) - Date.parse(b.batch.producedAt));

  for (const { index } of order) {
    if (left <= 0) break;
    const batch = next[index];
    assertCompatibleQuantity(batch.remaining, required);
    const used = Math.min(batch.remaining.qty, left);
    next[index] = { ...batch, remaining: quantity(batch.remaining.qty - used, batch.remaining.unit) };
    left -= used;
  }
  return next;
}

export function consumeRecipeBatchesFifoV2(recipeId:string,batches:readonly PrepBatchV2[]):PrepBatchV2[]{
  const stock=componentStockFromBatchesV2(batches);
  const availability=recipePrepAvailabilityV2(recipeId,stock);
  if(!availability.ready){
    const summary=availability.missing.map(x=>`${x.componentId}:${x.shortfall.qty}${x.shortfall.unit}`).join(", ");
    throw new Error(`Insufficient measured batches for ${recipeId}: ${summary}`);
  }
  let next=[...batches];
  for(const requirement of recipePrepV2(recipeId)){
    next=consumeBatchesFifoV2(requirement.componentId,requirement.quantity,next);
  }
  return next;
}

export function oldestRemainingBatchV2(componentId:string,batches:readonly PrepBatchV2[]):PrepBatchV2|undefined{
  return [...batches]
    .filter(b=>b.componentId===componentId&&b.remaining.qty>0)
    .sort((a,b)=>Date.parse(a.producedAt)-Date.parse(b.producedAt))[0];
}

export function oldestRecipeBatchV2(recipeId:string,batches:readonly PrepBatchV2[]):PrepBatchV2|undefined{
  const needed=new Set(recipePrepV2(recipeId).map(x=>x.componentId));
  return [...batches]
    .filter(b=>needed.has(b.componentId)&&b.remaining.qty>0)
    .sort((a,b)=>Date.parse(a.producedAt)-Date.parse(b.producedAt))[0];
}
