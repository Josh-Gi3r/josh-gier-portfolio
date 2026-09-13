import { formatQuantity, type Quantity } from "./food-quantity";
import { canonicalPrepComponentsV2, componentUnlocksV2, getCanonicalPrepV2, recipePrepV2 } from "./food-truth-v2";
import {
  oldestRemainingBatchV2,
  prepDemandForRecipesV2,
  prepNeedsForRecipesV2,
  recipePrepAvailabilityV2,
  type ComponentStockV2,
  type PrepBatchV2,
} from "./food-engine-v2";
import { canonicalRecipesV2 } from "./recipe-truth-v2";

export type TruthAnswerV2<T>=Readonly<{
  status:"known"|"unknown"|"not_applicable";
  value:T|null;
  reason?:string;
}>;

export function componentStockAnswerV2(componentId:string,stock:ComponentStockV2):TruthAnswerV2<Quantity>{
  const component=getCanonicalPrepV2(componentId);
  if(!component)return {status:"unknown",value:null,reason:"Unknown prep component"};
  const value=stock[componentId]??{qty:0,unit:component.workingUnit.unit};
  if(value.unit!==component.workingUnit.unit)return {status:"unknown",value:null,reason:"Stored unit does not match canonical unit"};
  return {status:"known",value};
}

export function canCookFromPrepV2(recipeId:string,stock:ComponentStockV2){
  const recipe=canonicalRecipesV2.find(x=>x.id===recipeId);
  if(!recipe)return {status:"unknown" as const,value:null,reason:"Unknown recipe"};
  const result=recipePrepAvailabilityV2(recipeId,stock);
  return {status:"known" as const,value:{ready:result.ready,missing:result.missing}};
}

export function weekPrepCoverageV2(recipeIds:readonly string[],stock:ComponentStockV2){
  const demand=prepDemandForRecipesV2(recipeIds);
  const missing=prepNeedsForRecipesV2(recipeIds,stock);
  return {
    status:"known" as const,
    value:{
      demand,
      missing,
      fullyCovered:missing.length===0,
    },
  };
}

export function componentNeededForRecipesV2(componentId:string,recipeIds:readonly string[]):TruthAnswerV2<Quantity>{
  const component=getCanonicalPrepV2(componentId);
  if(!component)return {status:"unknown",value:null,reason:"Unknown prep component"};
  const demand=prepDemandForRecipesV2(recipeIds).find(x=>x.componentId===componentId)?.required;
  return {status:"known",value:demand??{qty:0,unit:component.workingUnit.unit}};
}

export function componentUnlocksAnswerV2(componentId:string):TruthAnswerV2<readonly string[]>{
  if(!getCanonicalPrepV2(componentId))return {status:"unknown",value:null,reason:"Unknown prep component"};
  return {status:"known",value:componentUnlocksV2(componentId)};
}

export function oldestPrepAnswerV2(componentId:string,batches:readonly PrepBatchV2[]):TruthAnswerV2<PrepBatchV2>{
  if(!getCanonicalPrepV2(componentId))return {status:"unknown",value:null,reason:"Unknown prep component"};
  const batch=oldestRemainingBatchV2(componentId,batches);
  return batch?{status:"known",value:batch}:{status:"not_applicable",value:null,reason:"No measured batch remains"};
}

export function recipesUsingAvailablePrepV2(componentId:string,stock:ComponentStockV2){
  const ids=componentUnlocksV2(componentId);
  return ids.map(id=>({id,availability:recipePrepAvailabilityV2(id,stock)}));
}

export function prepQuestionContextV2(recipeIds:readonly string[],stock:ComponentStockV2,batches:readonly PrepBatchV2[]){
  const week=weekPrepCoverageV2(recipeIds,stock).value;
  return {
    recipes:recipeIds.map(id=>({id,prep:recipePrepV2(id).map(x=>({id:x.componentId,quantity:formatQuantity(x.quantity)}))})),
    demand:week.demand.map(x=>({id:x.componentId,quantity:formatQuantity(x.required)})),
    missing:week.missing.map(x=>({id:x.componentId,quantity:formatQuantity(x.shortfall)})),
    oldest:canonicalPrepComponentsV2.map(c=>{const b=oldestRemainingBatchV2(c.id,batches);return b?{id:c.id,batchId:b.batchId,producedAt:b.producedAt,remaining:formatQuantity(b.remaining)}:null}).filter(Boolean),
  };
}
