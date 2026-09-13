import { canonicalPrepComponentsV2, getCanonicalPrepV2 } from "./food-truth-v2";
import { prepNeedsForRecipesV2, type ComponentStockV2 } from "./food-engine-v2";
import type { Quantity } from "./food-quantity";

export type FirstRunTierV2="essential_core"|"high_value_rotational"|"demand_driven"|"fridge_first"|"pantry_fresh_first";

export const firstRunComponentTiersV2:Readonly<Record<FirstRunTierV2,readonly string[]>>={
  essential_core:["gold","sambal","rempah","red","clear"],
  high_value_rotational:["blond","dark","wok-brown","thai-green","duxelles","garlic","chilli"],
  demand_driven:["onion","makhani","saag","korma","rendang","laksa","malaysian-kari","asam-pedas","thai-red","nam-prik-pao","char-siu","douban","dashi","jp-curry","k-anchovy","harissa","chipotle","pesto","ginger-garlic","lemongrass","miso-ginger","bulgogi","gochujang","wok-white"],
  fridge_first:["krapow","nuoc-cham","teriyaki","ginger-scallion"],
  pantry_fresh_first:["massaman-finish"],
};

export type PrepJobV2=Readonly<{
  componentId:string;
  shortfall:Quantity;
  madeFrom:readonly string[];
  storageMode:string;
  phase:"long"|"cooked-paste"|"raw-paste"|"quick-fridge"|"pantry";
  outputMustBeMeasured:true;
  parentQuantityStatus:"explicit_formulation_required"|"not_applicable";
}>;

function phaseFor(id:string):PrepJobV2["phase"]{
  if(["clear","dark","red","onion"].includes(id))return "long";
  if(["gold","sambal","rempah","blond","makhani","rendang","laksa","malaysian-kari","asam-pedas","wok-brown","wok-white","douban","duxelles"].includes(id))return "cooked-paste";
  if(["thai-green","thai-red","harissa","chipotle","pesto","ginger-garlic","garlic","chilli","lemongrass","miso-ginger","bulgogi","char-siu"].includes(id))return "raw-paste";
  if(["krapow","nuoc-cham","teriyaki","ginger-scallion","gochujang"].includes(id))return "quick-fridge";
  return "pantry";
}

/**
 * Plans only what is knowable from dinner demand and current stock.
 * It intentionally does not invent batch counts or parent-input quantities.
 */
export function prepJobsForWeekV2(recipeIds:readonly string[],stock:ComponentStockV2):PrepJobV2[]{
  const needs=prepNeedsForRecipesV2(recipeIds,stock);
  const directIds=new Set(needs.map(x=>x.componentId));
  const expanded=new Set(directIds);
  const visit=(id:string)=>{const c=getCanonicalPrepV2(id);if(!c)return;for(const parent of c.madeFrom){if(!expanded.has(parent)){expanded.add(parent);visit(parent)}}};
  for(const id of [...directIds])visit(id);

  const needById=new Map(needs.map(x=>[x.componentId,x.shortfall]));
  return [...expanded].map(id=>{
    const c=getCanonicalPrepV2(id);if(!c)throw new Error(`Unknown prep component ${id}`);
    const shortfall=needById.get(id)??{qty:0,unit:c.workingUnit.unit};
    return {componentId:id,shortfall,madeFrom:c.madeFrom,storageMode:c.storageMode,phase:phaseFor(id),outputMustBeMeasured:true,parentQuantityStatus:c.madeFrom.length?"explicit_formulation_required":"not_applicable"};
  }).sort((a,b)=>{
    const order={long:0,"cooked-paste":1,"raw-paste":2,"quick-fridge":3,pantry:4};
    const pa=order[a.phase],pb=order[b.phase];if(pa!==pb)return pa-pb;
    const ac=getCanonicalPrepV2(a.componentId),bc=getCanonicalPrepV2(b.componentId);
    if(ac&&bc&&bc.madeFrom.includes(ac.id))return -1;
    if(ac&&bc&&ac.madeFrom.includes(bc.id))return 1;
    return a.componentId.localeCompare(b.componentId);
  });
}

export function validateFirstRunTiersV2(){
  const seen=new Set<string>();
  const missing:string[]=[];const duplicates:string[]=[];
  for(const ids of Object.values(firstRunComponentTiersV2))for(const id of ids){if(seen.has(id))duplicates.push(id);seen.add(id)}
  for(const c of canonicalPrepComponentsV2)if(!seen.has(c.id))missing.push(c.id);
  return {valid:missing.length===0&&duplicates.length===0,missing,duplicates,covered:seen.size};
}
