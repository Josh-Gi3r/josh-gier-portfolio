import { canonicalPrepFormulationsV2 } from "./prep-formulations-v2";
import { canonicalDinnerFormulationsV2 } from "./recipe-formulations-v2";
import type { QuantityUnit } from "./food-quantity";

export type MajorAllergenV2="milk"|"egg"|"fish"|"shellfish"|"soy"|"wheat"|"peanut"|"tree-nut"|"sesame"|"mustard";
export type NutritionBindingClassV2="fdc_generic"|"manufacturer_preferred"|"manufacturer_required"|"non_nutritive_or_process";
export type SourcingClassV2="normal-supermarket"|"wet-market"|"indian-grocer"|"thai-sea-grocer"|"japanese-grocer"|"korean-grocer"|"chinese-grocer"|"online-specialty"|"pantry";

export type CanonicalIngredientCatalogV2=Readonly<{
  id:string;
  name:string;
  canonicalUnit:QuantityUnit;
  allergens:readonly MajorAllergenV2[];
  nutritionBindingClass:NutritionBindingClassV2;
  sourcing:readonly SourcingClassV2[];
  specialistRisk:boolean;
}>;

const allergenById:Readonly<Record<string,readonly MajorAllergenV2[]>>={
  "belacan":["shellfish"],"shrimp-paste":["shellfish"],"dried-shrimp":["shellfish"],"prawns":["shellfish"],"oyster-sauce":["shellfish"],
  "fish-sauce":["fish"],"dried-anchovy":["fish"],"katsuobushi":["fish"],"salmon":["fish"],"white-fish":["fish"],
  "soy-sauce":["soy","wheat"],"dark-soy":["soy","wheat"],"japanese-soy":["soy","wheat"],"tofu":["soy"],"white-miso":["soy"],"gochujang":["soy","wheat"],"hoisin":["soy","wheat"],
  "sesame-oil":["sesame"],"sesame-seed":["sesame"],
  "butter-unsalted":["milk"],"cream":["milk"],"yoghurt":["milk"],"parmesan":["milk"],
  "egg-large":["egg"],"peanuts":["peanut"],"cashew":["tree-nut"],"candlenut":["tree-nut"],"pine-nut-or-cashew":["tree-nut"],
  "flour-plain":["wheat"],"dijon":["mustard"],
};

const manufacturerPreferred=new Set([
  "tomato-whole-canned","belacan","shrimp-paste","fish-sauce","oyster-sauce","soy-sauce","dark-soy","japanese-soy","sesame-oil","coconut-milk","white-miso","gochujang","hoisin","dijon","cream","yoghurt","tofu","chipotle-adobo","adobo-sauce","malaysian-meat-curry-powder"
]);
const manufacturerRequired=new Set(["belacan","shrimp-paste","fish-sauce","oyster-sauce","soy-sauce","dark-soy","japanese-soy","white-miso","gochujang","hoisin"]);

const sourcingById:Readonly<Record<string,readonly SourcingClassV2[]>>={
  "kashmiri-chilli":["indian-grocer"],"kasuri-methi":["indian-grocer"],"garam-masala":["indian-grocer","pantry"],"amchur":["indian-grocer"],
  "belacan":["wet-market","thai-sea-grocer"],"gula-melaka":["wet-market","thai-sea-grocer"],"candlenut":["wet-market","thai-sea-grocer"],"galangal":["wet-market","thai-sea-grocer"],"turmeric-fresh":["wet-market","thai-sea-grocer"],"lemongrass":["wet-market","normal-supermarket"],"dried-shrimp":["wet-market","thai-sea-grocer"],
  "thai-green-chilli-hot":["thai-sea-grocer"],"thai-green-chilli-mild":["thai-sea-grocer"],"coriander-root":["thai-sea-grocer"],"makrut-zest":["thai-sea-grocer"],"makrut-lime":["thai-sea-grocer"],"thai-eggplant":["thai-sea-grocer"],"thai-basil":["thai-sea-grocer"],"holy-basil":["thai-sea-grocer"],"shrimp-paste":["thai-sea-grocer"],
  "shaoxing-wine":["chinese-grocer"],"pixian-doubanjiang":["chinese-grocer"],"douchi":["chinese-grocer"],"bamboo-shoots":["chinese-grocer","normal-supermarket"],"gai-lan":["wet-market","chinese-grocer"],
  "kombu":["japanese-grocer"],"katsuobushi":["japanese-grocer"],"mirin":["japanese-grocer"],"sake":["japanese-grocer"],"japanese-soy":["japanese-grocer"],"japanese-curry-powder":["japanese-grocer"],"white-miso":["japanese-grocer"],
  "dried-anchovy":["korean-grocer"],"gochujang":["korean-grocer"],"asian-pear-or-apple":["korean-grocer","normal-supermarket"],
  "chipotle-adobo":["online-specialty","normal-supermarket"],"adobo-sauce":["online-specialty","normal-supermarket"],
};

const specialistRiskIds=new Set(["holy-basil","thai-eggplant","coriander-root","galangal","candlenut","belacan","makrut-zest","makrut-lime","pixian-doubanjiang","douchi","kombu","katsuobushi","japanese-curry-powder","dried-anchovy","gochujang","chipotle-adobo","adobo-sauce","amchur","kasuri-methi"]);

const rows=new Map<string,{name:string;units:Set<QuantityUnit>}>();
function collect(id:string,name:string,unit:QuantityUnit){const current=rows.get(id);if(current){current.units.add(unit);if(current.name.length<name.length)current.name=name}else rows.set(id,{name,units:new Set([unit])})}
for(const formulation of canonicalPrepFormulationsV2)for(const x of formulation.ingredientInputs)collect(x.ingredientId,x.name,x.unit);
for(const recipe of canonicalDinnerFormulationsV2)for(const x of recipe.ingredients)collect(x.ingredientId,x.name,x.unit);

export const canonicalIngredientCatalogV2:readonly CanonicalIngredientCatalogV2[]=[...rows.entries()].map(([id,row])=>{
  const units=[...row.units];
  const canonicalUnit=units[0];
  return {
    id,
    name:row.name,
    canonicalUnit,
    allergens:allergenById[id]??[],
    nutritionBindingClass:manufacturerRequired.has(id)?"manufacturer_required":manufacturerPreferred.has(id)?"manufacturer_preferred":id==="water"?"non_nutritive_or_process":"fdc_generic",
    sourcing:sourcingById[id]??(["normal-supermarket"] as const),
    specialistRisk:specialistRiskIds.has(id),
  };
}).sort((a,b)=>a.id.localeCompare(b.id));

export const canonicalIngredientByIdV2=new Map(canonicalIngredientCatalogV2.map(x=>[x.id,x]));
export function getCanonicalIngredientV2(id:string){return canonicalIngredientByIdV2.get(id)}
export function specialistShoppingRisksV2(){return canonicalIngredientCatalogV2.filter(x=>x.specialistRisk)}

export function validateCanonicalIngredientCatalogV2(){
  const errors:string[]=[];
  for(const [id,row] of rows){if(row.units.size>1)errors.push(`${id} appears with incompatible canonical units: ${[...row.units].join(",")}`)}
  for(const x of canonicalIngredientCatalogV2){if(!x.id||!x.name)errors.push("ingredient missing id/name")}
  return {valid:errors.length===0,errors,count:canonicalIngredientCatalogV2.length};
}
