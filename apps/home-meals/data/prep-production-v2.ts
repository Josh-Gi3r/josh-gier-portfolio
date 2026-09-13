import { type Quantity } from "./food-quantity";
import { getCanonicalPrepV2 } from "./food-truth-v2";
import { consumeBatchesFifoV2, createMeasuredPrepBatchV2, type PrepBatchV2 } from "./food-engine-v2";

export type ParentConsumptionV2=Readonly<{
  componentId:string;
  quantity:Quantity;
}>;

export type PrepProductionResultV2=Readonly<{
  produced:PrepBatchV2;
  batches:readonly PrepBatchV2[];
  consumedParents:readonly ParentConsumptionV2[];
}>;

/**
 * Completes a child-prep production transaction only after the real finished output has been measured.
 * Parent quantities are explicit formulation inputs supplied by the canonical component recipe; this
 * function never invents them from a guessed child yield.
 */
export function completeMeasuredPrepProductionV2(input:{
  componentId:string;
  parentConsumption:readonly ParentConsumptionV2[];
  measuredOutput:Quantity;
  batchId:string;
  producedAt:string;
  recipeVersion:string;
  batches:readonly PrepBatchV2[];
  calibrated?:boolean;
}):PrepProductionResultV2{
  const component=getCanonicalPrepV2(input.componentId);
  if(!component)throw new Error(`Unknown prep component: ${input.componentId}`);

  const expectedParents=[...component.madeFrom].sort();
  const suppliedParents=input.parentConsumption.map(x=>x.componentId).sort();
  if(JSON.stringify(expectedParents)!==JSON.stringify(suppliedParents)){
    throw new Error(`Production parents for ${component.id} must exactly match madeFrom [${expectedParents.join(", ")}]`);
  }

  let next=[...input.batches];
  for(const parentInput of input.parentConsumption){
    const parent=getCanonicalPrepV2(parentInput.componentId);
    if(!parent)throw new Error(`Unknown parent prep component: ${parentInput.componentId}`);
    if(parentInput.quantity.qty<=0)throw new Error(`Parent consumption must be positive: ${parentInput.componentId}`);
    if(parentInput.quantity.unit!==parent.workingUnit.unit){
      throw new Error(`Parent consumption unit mismatch for ${parent.id}: ${parentInput.quantity.unit} vs ${parent.workingUnit.unit}`);
    }
    next=consumeBatchesFifoV2(parent.id,parentInput.quantity,next);
  }

  const produced=createMeasuredPrepBatchV2({
    batchId:input.batchId,
    componentId:component.id,
    measuredOutput:input.measuredOutput,
    producedAt:input.producedAt,
    recipeVersion:input.recipeVersion,
    calibrated:input.calibrated,
  });

  return {
    produced,
    batches:[produced,...next],
    consumedParents:input.parentConsumption,
  };
}

/**
 * Mothers/standalone prep have no madeFrom parents. They still require a real measured output.
 */
export function completeMeasuredStandalonePrepV2(input:{
  componentId:string;
  measuredOutput:Quantity;
  batchId:string;
  producedAt:string;
  recipeVersion:string;
  batches:readonly PrepBatchV2[];
  calibrated?:boolean;
}):PrepProductionResultV2{
  const component=getCanonicalPrepV2(input.componentId);
  if(!component)throw new Error(`Unknown prep component: ${input.componentId}`);
  if(component.madeFrom.length)throw new Error(`${component.id} has madeFrom parents and must use completeMeasuredPrepProductionV2`);
  const produced=createMeasuredPrepBatchV2({
    batchId:input.batchId,
    componentId:component.id,
    measuredOutput:input.measuredOutput,
    producedAt:input.producedAt,
    recipeVersion:input.recipeVersion,
    calibrated:input.calibrated,
  });
  return {produced,batches:[produced,...input.batches],consumedParents:[]};
}
