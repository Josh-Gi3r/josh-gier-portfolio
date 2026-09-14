import {getIngredient} from "./home-data";
import {quantity,type QuantityUnit} from "./food-quantity";
import {canonicalPrepComponentsV2,getCanonicalPrepV2} from "./food-truth-v2";
import {prepDemandForRecipesV2,recipePrepAvailabilityV2,type ComponentStockV2} from "./food-engine-v2";
import {canonicalIngredientCatalogV2} from "./ingredient-catalog-v2";
import {ingredientAvailabilityForRecipeV2,type IngredientStockV2,type QualitativeIngredientStockV2} from "./ingredient-engine-v2";

export type PrepDemand={id:string;unit:QuantityUnit;neededQty:number;neededPortions:number};
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

export function prepDemandForWeek(week:string[]):PrepDemand[]{return prepDemandForRecipesV2(week).map(d=>{const c=getCanonicalPrepV2(d.componentId);const standard=Math.max(1,c?.workingUnit.qty??1);return{id:d.componentId,unit:d.required.unit,neededQty:d.required.qty,neededPortions:Math.ceil(d.required.qty/standard)}})}
export function stockPortions(id:string,stock:Record<string,number>){const c=getCanonicalPrepV2(id);if(!c)return 0;return Math.floor(Math.max(0,stock[id]??0)/Math.max(1,c.workingUnit.qty))}
export function recipeAvailability(recipeId:string,componentStock:Record<string,number>,ingredientStock:Record<string,number>){
 const prep=recipePrepAvailabilityV2(recipeId,componentStockV2FromNumbers(componentStock));const converted=ingredientStocksV2FromNumbers(ingredientStock);const ing=ingredientAvailabilityForRecipeV2(recipeId,converted.exact,undefined,converted.qualitative);
 return{ready:prep.ready&&ing.ready,missingPrep:prep.missing.map(x=>({id:x.componentId,quantity:x.shortfall})),missingIngredients:ing.missing.map(x=>({id:uiId(x.ingredientId),quantity:x.shortfall}))};
}
