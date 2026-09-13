import { quantity, type Quantity } from "./food-quantity";
import { canonicalPrepComponentsV2, getCanonicalPrepV2, recipePrepV2 } from "./food-truth-v2";
import { componentStockFromBatchesV2, type ComponentStockV2, type PrepBatchV2 } from "./food-engine-v2";

export type ArchivedLegacyPrepBatchV11 = Readonly<{
  componentId:string;
  outputMl:number;
  remainingMl:number;
  at:string;
}>;

export type HouseholdStateV12 = {
  version:12;
  week:string[];
  monthlyPool:string[];
  componentBatches:PrepBatchV2[];
  manualComponentStock:Record<string,Quantity>;
  ingredientStock:Record<string,number>;
  ingredientStockStatus:"verified"|"legacy_unverified";
  groceryChecked:Record<string,boolean>;
  ratings:Record<string,unknown>;
  recipeNotes:Record<string,unknown>;
  recipeVersions:Record<string,unknown>;
  history:unknown[];
  useSoon:Record<string,boolean>;
  useSoonAt:Record<string,string>;
  favourites:Record<string,boolean>;
  kitchenReady:boolean;
  legacyArchive?:{
    componentStockV11?:Record<string,number>;
    prepBatchesV11?:ArchivedLegacyPrepBatchV11[];
  };
  migrationWarnings:string[];
};

type LegacyHouseholdV11 = Partial<{
  week:string[];
  monthlyPool:string[];
  componentStock:Record<string,number>;
  ingredientStock:Record<string,number>;
  groceryChecked:Record<string,boolean>;
  ratings:Record<string,unknown>;
  recipeNotes:Record<string,unknown>;
  recipeVersions:Record<string,unknown>;
  history:unknown[];
  prepBatches:ArchivedLegacyPrepBatchV11[];
  useSoon:Record<string,boolean>;
  useSoonAt:Record<string,string>;
  favourites:Record<string,boolean>;
  kitchenReady:boolean;
}>;

function safeRecord<T=unknown>(value:unknown):Record<string,T>{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,T>:{};
}

export function emptyManualComponentStockV12():Record<string,Quantity>{
  return Object.fromEntries(canonicalPrepComponentsV2.map(c=>[c.id,quantity(0,c.workingUnit.unit)]));
}

export function migrateHouseholdV11ToV12(
  legacy:LegacyHouseholdV11,
  defaults:{week:string[];monthlyPool:string[]}
):HouseholdStateV12 {
  const componentStockV11=safeRecord<number>(legacy.componentStock);
  const nonZeroLegacy=Object.entries(componentStockV11).filter(([,v])=>Number(v)>0);
  const prepBatches=Array.isArray(legacy.prepBatches)?legacy.prepBatches.filter(x=>x&&typeof x.componentId==="string"):[];
  const warnings:string[]=[];
  if(nonZeroLegacy.length){
    warnings.push("Legacy component stock was ml-only and has not been silently converted into g/ml v12 stock. Recount or remeasure those prep items.");
  }
  if(prepBatches.length){
    warnings.push("Legacy prep batches used outputMl/remainingMl for every component. They are archived but excluded from v12 stock until explicitly reconciled.");
  }
  const ingredientStock=safeRecord<number>(legacy.ingredientStock);
  if(Object.keys(ingredientStock).length){
    warnings.push("Ingredient stock was preserved but marked legacy_unverified because some old recipes used vague portion/choice units.");
  }
  return {
    version:12,
    week:Array.isArray(legacy.week)?legacy.week:[...defaults.week],
    monthlyPool:Array.isArray(legacy.monthlyPool)?legacy.monthlyPool:[...defaults.monthlyPool],
    componentBatches:[],
    manualComponentStock:emptyManualComponentStockV12(),
    ingredientStock,
    ingredientStockStatus:Object.keys(ingredientStock).length?"legacy_unverified":"verified",
    groceryChecked:safeRecord<boolean>(legacy.groceryChecked),
    ratings:safeRecord(legacy.ratings),
    recipeNotes:safeRecord(legacy.recipeNotes),
    recipeVersions:safeRecord(legacy.recipeVersions),
    history:Array.isArray(legacy.history)?legacy.history:[],
    useSoon:safeRecord<boolean>(legacy.useSoon),
    useSoonAt:safeRecord<string>(legacy.useSoonAt),
    favourites:safeRecord<boolean>(legacy.favourites),
    kitchenReady:!!legacy.kitchenReady,
    legacyArchive:{componentStockV11,prepBatchesV11:prepBatches},
    migrationWarnings:warnings,
  };
}

export function setManualComponentStockV12(state:HouseholdStateV12,componentId:string,observed:Quantity):HouseholdStateV12 {
  const component=getCanonicalPrepV2(componentId);
  if(!component)throw new Error(`Unknown prep component: ${componentId}`);
  if(observed.qty<0)throw new Error(`Manual stock cannot be negative for ${componentId}`);
  if(observed.unit!==component.workingUnit.unit)throw new Error(`Manual stock unit mismatch for ${componentId}`);
  return {...state,manualComponentStock:{...state.manualComponentStock,[componentId]:observed},kitchenReady:true};
}

export function componentStockV12(state:HouseholdStateV12):ComponentStockV2 {
  const batchStock=componentStockFromBatchesV2(state.componentBatches);
  const out:Record<string,Quantity>={};
  for(const component of canonicalPrepComponentsV2){
    const manual=state.manualComponentStock[component.id]??quantity(0,component.workingUnit.unit);
    const measured=batchStock[component.id]??quantity(0,component.workingUnit.unit);
    if(manual.unit!==measured.unit)throw new Error(`Stock unit mismatch for ${component.id}`);
    out[component.id]=quantity(manual.qty+measured.qty,manual.unit);
  }
  return out;
}

export function addMeasuredBatchV12(state:HouseholdStateV12,batch:PrepBatchV2):HouseholdStateV12{
  return {...state,componentBatches:[batch,...state.componentBatches],kitchenReady:true};
}

export function consumeComponentV12(state:HouseholdStateV12,componentId:string,required:Quantity):HouseholdStateV12{
  const component=getCanonicalPrepV2(componentId);
  if(!component)throw new Error(`Unknown prep component: ${componentId}`);
  if(required.qty<0||required.unit!==component.workingUnit.unit)throw new Error(`Invalid consumption quantity for ${componentId}`);
  const total=componentStockV12(state)[componentId]??quantity(0,component.workingUnit.unit);
  if(total.qty<required.qty)throw new Error(`Insufficient prep stock for ${componentId}: need ${required.qty}${required.unit}, have ${total.qty}${total.unit}`);

  let left=required.qty;
  const batches=state.componentBatches.map(b=>({...b}));
  const order=batches.map((batch,index)=>({batch,index}))
    .filter(x=>x.batch.componentId===componentId&&x.batch.remaining.qty>0)
    .sort((a,b)=>Date.parse(a.batch.producedAt)-Date.parse(b.batch.producedAt));
  for(const {index} of order){
    if(left<=0)break;
    const batch=batches[index];
    if(batch.remaining.unit!==required.unit)throw new Error(`Batch unit mismatch for ${componentId}`);
    const used=Math.min(batch.remaining.qty,left);
    batches[index]={...batch,remaining:quantity(batch.remaining.qty-used,batch.remaining.unit)};
    left-=used;
  }
  const manual=state.manualComponentStock[componentId]??quantity(0,component.workingUnit.unit);
  if(left>manual.qty)throw new Error(`Manual stock reconciliation failed for ${componentId}`);
  const manualComponentStock={...state.manualComponentStock,[componentId]:quantity(manual.qty-left,manual.unit)};
  return {...state,componentBatches:batches,manualComponentStock};
}

export function consumeRecipePrepV12(state:HouseholdStateV12,recipeId:string):HouseholdStateV12{
  let next=state;
  for(const requirement of recipePrepV2(recipeId))next=consumeComponentV12(next,requirement.componentId,requirement.quantity);
  return next;
}
