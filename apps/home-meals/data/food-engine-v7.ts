import {addQuantity,quantity,shortfallQuantity,subtractQuantity,type Quantity} from "./food-quantity";
import {getCanonicalPrepV2} from "./food-truth-v2";
import {getPhase2LiveRuntimeV7} from "./phase2-runtime-v7";
import {
  componentStockFromBatchesV2,
  consumeBatchesFifoV2,
  createMeasuredPrepBatchV2,
  prepForRecipeAtCookScaleV4,
  type ComponentStockV2,
  type PrepBatchV2,
  type PrepDemandV2,
  type PrepNeedV2,
} from "./food-engine-v2";
import {DEFAULT_COOK_SERVINGS_V4,type SupportedCookServingsV4} from "./household-serving-policy-v4";

export type ComponentStockV7=ComponentStockV2;
export type PrepBatchV7=PrepBatchV2;
export type PrepDemandV7=PrepDemandV2;
export type PrepNeedV7=PrepNeedV2;
export{componentStockFromBatchesV2 as componentStockFromBatchesV7,consumeBatchesFifoV2 as consumeBatchesFifoV7,createMeasuredPrepBatchV2 as createMeasuredPrepBatchV7};

function canonicalZero(componentId:string):Quantity{const c=getCanonicalPrepV2(componentId);if(!c)throw new Error(`Unknown prep component: ${componentId}`);return quantity(0,c.workingUnit.unit)}
function stockValue(stock:ComponentStockV7,componentId:string):Quantity{const c=getCanonicalPrepV2(componentId);if(!c)throw new Error(`Unknown prep component: ${componentId}`);const value=stock[componentId]??canonicalZero(componentId);if(value.unit!==c.workingUnit.unit)throw new Error(`Stock unit mismatch for ${componentId}: ${value.unit} vs ${c.workingUnit.unit}`);return value}

/** V7 sits above the proven V2 prep engine. V2 never imports V7. */
export function prepForRecipeAtCookScaleV7(recipeId:string,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4){
  const promoted=getPhase2LiveRuntimeV7(recipeId,servings);return promoted?promoted.prep:prepForRecipeAtCookScaleV4(recipeId,servings);
}

export function prepDemandForRecipesV7(recipeIds:readonly string[],servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):PrepDemandV7[]{
  const demand=new Map<string,Quantity>();for(const recipeId of recipeIds)for(const requirement of prepForRecipeAtCookScaleV7(recipeId,servings)){const current=demand.get(requirement.componentId)??canonicalZero(requirement.componentId);demand.set(requirement.componentId,addQuantity(current,requirement.quantity))}return[...demand].map(([componentId,required])=>({componentId,required}));
}
export function prepNeedsForRecipesV7(recipeIds:readonly string[],stock:ComponentStockV7,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):PrepNeedV7[]{return prepDemandForRecipesV7(recipeIds,servings).map(({componentId,required})=>{const onHand=stockValue(stock,componentId);return{componentId,required,onHand,shortfall:shortfallQuantity(required,onHand)}}).filter(x=>x.shortfall.qty>0)}
export function recipePrepAvailabilityV7(recipeId:string,stock:ComponentStockV7,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4){const missing=prepForRecipeAtCookScaleV7(recipeId,servings).map(requirement=>{const onHand=stockValue(stock,requirement.componentId),shortfall=shortfallQuantity(requirement.quantity,onHand);return{componentId:requirement.componentId,required:requirement.quantity,onHand,shortfall}}).filter(x=>x.shortfall.qty>0);return{ready:missing.length===0,missing}}
export function consumeRecipePrepV7(recipeId:string,stock:ComponentStockV7,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):ComponentStockV7{const availability=recipePrepAvailabilityV7(recipeId,stock,servings);if(!availability.ready)throw new Error(`Insufficient prep stock for ${recipeId}`);const next:Record<string,Quantity>={...stock};for(const requirement of prepForRecipeAtCookScaleV7(recipeId,servings)){next[requirement.componentId]=subtractQuantity(stockValue(next,requirement.componentId),requirement.quantity)}return next}
export function consumeRecipeBatchesFifoV7(recipeId:string,batches:readonly PrepBatchV7[],servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):PrepBatchV7[]{const stock=componentStockFromBatchesV2(batches),availability=recipePrepAvailabilityV7(recipeId,stock,servings);if(!availability.ready)throw new Error(`Insufficient measured batches for ${recipeId}`);let next=[...batches];for(const requirement of prepForRecipeAtCookScaleV7(recipeId,servings))next=consumeBatchesFifoV2(requirement.componentId,requirement.quantity,next);return next}
export function oldestRecipeBatchV7(recipeId:string,batches:readonly PrepBatchV7[],servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):PrepBatchV7|undefined{const needed=new Set(prepForRecipeAtCookScaleV7(recipeId,servings).map(x=>x.componentId));return[...batches].filter(b=>needed.has(b.componentId)&&b.remaining.qty>0).sort((a,b)=>Date.parse(a.producedAt)-Date.parse(b.producedAt))[0]}
