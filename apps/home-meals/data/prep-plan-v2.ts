import { canonicalPrepComponentsV2, getCanonicalPrepV2 } from "./food-truth-v2";
import { prepDemandForRecipesV2, type ComponentStockV2 } from "./food-engine-v2";
import { getPrepFormulationV2 } from "./prep-formulations-v2";
import { addQuantity, quantity, shortfallQuantity, type Quantity } from "./food-quantity";

export type FirstRunTierV2="essential_core"|"high_value_rotational"|"demand_driven"|"fridge_first"|"pantry_fresh_first";
export const firstRunComponentTiersV2:Readonly<Record<FirstRunTierV2,readonly string[]>>={
 essential_core:["gold","sambal","rempah","red","clear"],
 high_value_rotational:["blond","dark","wok-brown","thai-green","duxelles","garlic","chilli"],
 demand_driven:["onion","makhani","saag","korma","rendang","laksa","malaysian-kari","asam-pedas","thai-red","nam-prik-pao","char-siu","douban","dashi","jp-curry","k-anchovy","harissa","chipotle","pesto","ginger-garlic","lemongrass","miso-ginger","bulgogi","gochujang","wok-white"],
 fridge_first:["krapow","nuoc-cham","teriyaki","ginger-scallion"],pantry_fresh_first:["massaman-finish"],
};
export type PrepJobV2=Readonly<{componentId:string;shortfall:Quantity;required:Quantity;onHand:Quantity;madeFrom:readonly string[];storageMode:string;phase:"long"|"cooked-paste"|"raw-paste"|"quick-fridge"|"pantry";outputMustBeMeasured:true;parentQuantityStatus:"explicit_formulation_required"|"not_applicable"}>;
function phaseFor(id:string):PrepJobV2["phase"]{if(["clear","dark","red","onion"].includes(id))return"long";if(["gold","sambal","rempah","blond","makhani","rendang","laksa","malaysian-kari","asam-pedas","wok-brown","wok-white","douban","duxelles"].includes(id))return"cooked-paste";if(["thai-green","thai-red","harissa","chipotle","pesto","ginger-garlic","garlic","chilli","lemongrass","miso-ginger","bulgogi","char-siu"].includes(id))return"raw-paste";if(["krapow","nuoc-cham","teriyaki","ginger-scallion","gochujang"].includes(id))return"quick-fridge";return"pantry"}
function zeroFor(id:string){const c=getCanonicalPrepV2(id);if(!c)throw new Error(`Unknown prep component ${id}`);return quantity(0,c.workingUnit.unit)}
function stockFor(stock:ComponentStockV2,id:string){const c=getCanonicalPrepV2(id);if(!c)throw new Error(`Unknown prep component ${id}`);const value=stock[id]??zeroFor(id);if(value.unit!==c.workingUnit.unit)throw new Error(`Stock unit mismatch for ${id}`);return value}

/**
 * Prep Day expands the week's dinner demand through actual `madeFrom` formulation inputs.
 * A job means "make one canonical formulation run, measure the output, then re-check".
 * It never guesses how many physical batches a shortfall will require because finished yield is household-measured truth.
 */
export function prepJobsForWeekV2(recipeIds:readonly string[],stock:ComponentStockV2):PrepJobV2[]{
 const demand=new Map<string,Quantity>();
 for(const row of prepDemandForRecipesV2(recipeIds))demand.set(row.componentId,row.required);
 const queue:string[]=[];
 for(const [id,required] of demand)if(shortfallQuantity(required,stockFor(stock,id)).qty>0)queue.push(id);
 const expanded=new Set<string>();
 while(queue.length){
  const childId=queue.shift()!;if(expanded.has(childId))continue;expanded.add(childId);
  const formulation=getPrepFormulationV2(childId);if(!formulation)throw new Error(`Missing canonical prep formulation ${childId}`);
  for(const parentInput of formulation.componentInputs){
   const parent=getCanonicalPrepV2(parentInput.componentId);if(!parent)throw new Error(`Unknown parent prep ${parentInput.componentId}`);
   const input=quantity(parentInput.qty,parentInput.unit);const current=demand.get(parent.id)??zeroFor(parent.id);const next=addQuantity(current,input);demand.set(parent.id,next);
   if(shortfallQuantity(next,stockFor(stock,parent.id)).qty>0&&!expanded.has(parent.id))queue.push(parent.id);
  }
 }
 const jobs:PrepJobV2[]=[];
 for(const [id,required] of demand){const c=getCanonicalPrepV2(id);if(!c)throw new Error(`Unknown prep component ${id}`);const onHand=stockFor(stock,id),shortfall=shortfallQuantity(required,onHand);if(shortfall.qty<=0)continue;jobs.push({componentId:id,shortfall,required,onHand,madeFrom:c.madeFrom,storageMode:c.storageMode,phase:phaseFor(id),outputMustBeMeasured:true,parentQuantityStatus:c.madeFrom.length?"explicit_formulation_required":"not_applicable"})}
 const order:Record<PrepJobV2["phase"],number>={long:0,"cooked-paste":1,"raw-paste":2,"quick-fridge":3,pantry:4};
 return jobs.sort((a,b)=>{if(b.madeFrom.includes(a.componentId))return-1;if(a.madeFrom.includes(b.componentId))return 1;const pa=order[a.phase],pb=order[b.phase];return pa!==pb?pa-pb:a.componentId.localeCompare(b.componentId)})
}
export function validateFirstRunTiersV2(){const seen=new Set<string>(),missing:string[]=[],duplicates:string[]=[];for(const ids of Object.values(firstRunComponentTiersV2))for(const id of ids){if(seen.has(id))duplicates.push(id);seen.add(id)}for(const c of canonicalPrepComponentsV2)if(!seen.has(c.id))missing.push(c.id);return{valid:missing.length===0&&duplicates.length===0,missing,duplicates,covered:seen.size}}
