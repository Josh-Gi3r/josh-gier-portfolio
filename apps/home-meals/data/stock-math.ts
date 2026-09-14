import {getIngredient,getRecipe,type IngredientRequirement} from "./home-data";
import {quantity,type QuantityUnit} from "./food-quantity";
import {canonicalPrepComponentsV2,getCanonicalPrepV2,recipePrepV2} from "./food-truth-v2";
import {prepDemandForRecipesV2,prepNeedsForRecipesV2,recipePrepAvailabilityV2,type ComponentStockV2} from "./food-engine-v2";
import {canonicalIngredientCatalogV2,canonicalIngredientKeyV2} from "./ingredient-catalog-v2";
import {ingredientAvailabilityForRecipeV2,type IngredientStockV2,type QualitativeIngredientStockV2} from "./ingredient-engine-v2";

export type PrepDemand={id:string;unit:QuantityUnit;neededQty:number;neededMl:number;neededPortions:number};
export type PrepNeed={id:string;unit:QuantityUnit;neededQty:number;onHandQty:number;shortQty:number;neededMl:number;onHandMl:number;shortMl:number;needed:number;onHand:number;short:number;batches:number};
const canonicalToLegacy:Record<string,string>={"egg-large":"eggs","basmati-rice-dry":"basmati-rice","jasmine-rice-dry":"jasmine-rice","beef-sirloin":"beef","ground-chicken":"ground-meat",mushroom:"mushrooms","onion-yellow":"onion",potato:"potatoes","chickpeas-drained":"chickpeas",tortilla:"tortillas","butter-unsalted":"butter"};
const legacyToCanonical:Record<string,string>=Object.fromEntries(Object.entries(canonicalToLegacy).map(([canonical,legacy])=>[legacy,canonical]));
const uiId=(id:string)=>canonicalToLegacy[id]??id;

function componentStockV2FromNumbers(stock:Record<string,number>):ComponentStockV2{return Object.fromEntries(canonicalPrepComponentsV2.map(c=>[c.id,quantity(Math.max(0,stock[c.id]??0),c.workingUnit.unit)]))}
function ingredientStocksV2FromNumbers(stock:Record<string,number>):{exact:IngredientStockV2;qualitative:QualitativeIngredientStockV2}{
 const exact:Record<string,ReturnType<typeof quantity>>={},qualitative:Record<string,number>={};
 for(const def of canonicalIngredientCatalogV2){const legacy=uiId(def.id),item=getIngredient(legacy);if(item?.tracking==="state"){qualitative[def.id]=Math.max(0,Math.min(3,stock[legacy]??0));exact[def.id]=quantity(0,def.canonicalUnit)}else exact[def.id]=quantity(Math.max(0,stock[legacy]??stock[def.id]??0),def.canonicalUnit)}
 for(const [id,value] of Object.entries(stock)){const item=getIngredient(id);if(item?.tracking==="state")qualitative[legacyToCanonical[id]??id]=Math.max(0,Math.min(3,value))}
 return{exact,qualitative};
}

export function prepDemandForWeekMl(week:string[]):PrepDemand[]{return prepDemandForRecipesV2(week).map(d=>{const c=getCanonicalPrepV2(d.componentId);const standard=Math.max(1,c?.workingUnit.qty??1);return{id:d.componentId,unit:d.required.unit,neededQty:d.required.qty,neededMl:d.required.qty,neededPortions:Math.ceil(d.required.qty/standard)}})}
export function prepNeedsForWeekMl(week:string[],stock:Record<string,number>):PrepNeed[]{return prepNeedsForRecipesV2(week,componentStockV2FromNumbers(stock)).map(n=>{const c=getCanonicalPrepV2(n.componentId);const standard=Math.max(1,c?.workingUnit.qty??1);return{id:n.componentId,unit:n.shortfall.unit,neededQty:n.required.qty,onHandQty:n.onHand.qty,shortQty:n.shortfall.qty,neededMl:n.required.qty,onHandMl:n.onHand.qty,shortMl:n.shortfall.qty,needed:Math.ceil(n.required.qty/standard),onHand:Math.floor(n.onHand.qty/standard),short:Math.ceil(n.shortfall.qty/standard),batches:n.shortfall.qty>0?1:0}})}

/** Deprecated compatibility stub. v2 never assumes a physical batch output before measurement. */
export function batchOutputMl(_id:string){return 0}
export function componentConsumptionMl(recipeId:string){return recipePrepV2(recipeId).map(x=>({id:x.componentId,ml:x.quantity.qty,qty:x.quantity.qty,unit:x.quantity.unit}))}
export function ingredientConsumptionExact(recipeId:string):IngredientRequirement[]{return getRecipe(recipeId)?.ingredients.filter(x=>!x.optional)??[]}
export function stockPortions(id:string,stock:Record<string,number>){const c=getCanonicalPrepV2(id);if(!c)return 0;return Math.floor(Math.max(0,stock[id]??0)/Math.max(1,c.workingUnit.qty))}
export function formatStock(id:string,stock:Record<string,number>){const c=getCanonicalPrepV2(id);const qty=Math.max(0,stock[id]??0);if(!c)return String(qty);const portions=stockPortions(id,stock);return portions>0?`${portions} ${portions===1?"portion":"portions"} · ${qty} ${c.workingUnit.unit}`:`${qty} ${c.workingUnit.unit}`}

export function ingredientRequirementMissing(req:IngredientRequirement,stock:Record<string,number>){if(req.optional)return false;const def=getIngredient(req.id);const onHand=Math.max(0,stock[req.id]??0);return def?.tracking==="state"?onHand<=0:onHand<req.qty}
export function recipeAvailability(recipeId:string,componentStock:Record<string,number>,ingredientStock:Record<string,number>){
 const prep=recipePrepAvailabilityV2(recipeId,componentStockV2FromNumbers(componentStock));const converted=ingredientStocksV2FromNumbers(ingredientStock);const ing=ingredientAvailabilityForRecipeV2(recipeId,converted.exact,undefined,converted.qualitative);
 return{ready:prep.ready&&ing.ready,missingPrep:prep.missing.map(x=>({id:x.componentId,quantity:x.shortfall})),missingIngredients:ing.missing.map(x=>({id:uiId(x.ingredientId),quantity:x.shortfall}))};
}
