import {getIngredient} from "./home-data";
import {quantity,type QuantityUnit} from "./food-quantity";
import {canonicalPrepComponentsV2,getCanonicalPrepV2} from "./food-truth-v2";
import {getPrepPortionPolicyV6,packetCountV6} from "./prep-portioning-v6";
import {prepDemandForRecipesV7,recipePrepAvailabilityV7,type ComponentStockV7} from "./food-engine-v7";
import {canonicalIngredientCatalogV7,getCanonicalIngredientV7} from "./ingredient-catalog-v7";
import {ingredientAvailabilityForRecipeV7,type IngredientStockV7,type QualitativeIngredientStockV7} from "./ingredient-engine-v7";

export type PrepDemandV7Ui={id:string;unit:QuantityUnit;neededQty:number;neededPortions:number};
const canonicalToLegacy:Record<string,string>={"egg-large":"eggs","basmati-rice-dry":"basmati-rice","jasmine-rice-dry":"jasmine-rice","beef-sirloin":"beef","ground-chicken":"ground-meat",mushroom:"mushrooms","onion-yellow":"onion",potato:"potatoes","chickpeas-drained":"chickpeas",tortilla:"tortillas","butter-unsalted":"butter"};
const legacyToCanonical:Record<string,string>=Object.fromEntries(Object.entries(canonicalToLegacy).map(([canonical,legacy])=>[legacy,canonical]));
const uiIdV7=(id:string)=>canonicalToLegacy[id]??id;

function componentStockV7FromNumbers(stock:Record<string,number>):ComponentStockV7{return Object.fromEntries(canonicalPrepComponentsV2.map(c=>[c.id,quantity(Math.max(0,stock[c.id]??0),c.workingUnit.unit)]))}
function ingredientStocksV7FromNumbers(stock:Record<string,number>):{exact:IngredientStockV7;qualitative:QualitativeIngredientStockV7}{
 const exact:Record<string,ReturnType<typeof quantity>>={},qualitative:Record<string,number>={};
 for(const def of canonicalIngredientCatalogV7){const legacy=uiIdV7(def.id),item=getIngredient(legacy);if(item?.tracking==="state"){qualitative[def.id]=Math.max(0,Math.min(3,stock[legacy]??stock[def.id]??0));exact[def.id]=quantity(0,def.canonicalUnit)}else exact[def.id]=quantity(Math.max(0,stock[def.id]??stock[legacy]??0),def.canonicalUnit)}
 for(const [id,value] of Object.entries(stock)){const item=getIngredient(id);if(item?.tracking==="state")qualitative[legacyToCanonical[id]??id]=Math.max(0,Math.min(3,value))}
 return{exact,qualitative};
}

export function prepDemandForWeekV7(week:string[]):PrepDemandV7Ui[]{return prepDemandForRecipesV7(week).map(d=>{const p=getPrepPortionPolicyV6(d.componentId),standard=Math.max(1,p?.packet.qty??getCanonicalPrepV2(d.componentId)?.workingUnit.qty??1);return{id:d.componentId,unit:d.required.unit,neededQty:d.required.qty,neededPortions:Math.ceil(d.required.qty/standard)}})}
export function stockPortionsV7(id:string,stock:Record<string,number>){const p=getPrepPortionPolicyV6(id),c=getCanonicalPrepV2(id);if(!p||!c)return 0;return Math.floor(Math.max(0,stock[id]??0)/Math.max(1,p.packet.qty))}
export function stockPacketCountExactV7(id:string,stock:Record<string,number>){const p=getPrepPortionPolicyV6(id);if(!p)return 0;return packetCountV6(id,quantity(Math.max(0,stock[id]??0),p.packet.unit))}
export function recipeAvailabilityV7(recipeId:string,componentStock:Record<string,number>,ingredientStock:Record<string,number>){
 const prep=recipePrepAvailabilityV7(recipeId,componentStockV7FromNumbers(componentStock)),converted=ingredientStocksV7FromNumbers(ingredientStock),ing=ingredientAvailabilityForRecipeV7(recipeId,converted.exact,undefined,converted.qualitative);
 return{ready:prep.ready&&ing.ready,missingPrep:prep.missing.map(x=>({id:x.componentId,quantity:x.shortfall})),missingIngredients:ing.missing.map(x=>({id:uiIdV7(x.ingredientId),canonicalId:x.ingredientId,name:getCanonicalIngredientV7(x.ingredientId)?.name??x.ingredientId,quantity:x.shortfall}))};
}
