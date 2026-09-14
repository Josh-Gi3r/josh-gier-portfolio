import {canonicalIngredientCatalogV2,canonicalIngredientKeyV2,getCanonicalIngredientV2,type CanonicalIngredientCatalogV2,type MajorAllergenV2,type NutritionBindingClassV2,type SourcingClassV2} from "./ingredient-catalog-v2";
import {phase2ResearchRecipesV5} from "./phase2-research-registry-v5";
import {pantryFoundationsV3} from "./pantry-foundations-v3";
import type {QuantityUnit} from "./food-quantity";

export type CanonicalIngredientCatalogV7=CanonicalIngredientCatalogV2&Readonly<{source:"v2"|"phase2-v7"}>;

const phaseUnitsByRawId=new Map<string,Set<QuantityUnit>>();
for(const recipe of phase2ResearchRecipesV5)for(const x of recipe.ingredients){const set=phaseUnitsByRawId.get(x.id)??new Set<QuantityUnit>();set.add(x.unit);phaseUnitsByRawId.set(x.id,set)}

/** Preserve distinct measured forms instead of inventing g↔ml/count conversions. */
export function canonicalIngredientKeyV7(id:string,unit:QuantityUnit){
  const v2Key=canonicalIngredientKeyV2(id,unit),existing=getCanonicalIngredientV2(v2Key);
  if(existing?.canonicalUnit===unit)return v2Key;
  const units=phaseUnitsByRawId.get(id);
  if(existing&&existing.canonicalUnit!==unit)return`${v2Key}-${unit}`;
  if(units&&units.size>1)return`${v2Key}-${unit}`;
  return v2Key;
}

const pantryIds=new Set(pantryFoundationsV3.map(x=>x.id));
const manufacturerRequired=new Set(["light-soy","dark-soy","oyster-sauce","fish-sauce","japanese-soy","korean-soy","white-miso","gochujang","doenjang","hoisin"]);
const manufacturerPreferred=new Set(["ketchup","chilli-oil","coconut-milk","coconut-water","mirin","sake","shaoxing-wine","rice-vinegar","chinkiang-vinegar","worcestershire","dijon","wholegrain-mustard","hot-sauce","chipotle-adobo","cooking-caramel","kecap-manis"]);
const chineseSpecialty=new Set(["pixian-doubanjiang","douchi","shaoxing-wine","chinkiang-vinegar","gai-lan","hk-pan-fried-noodles","sichuan-pepper"]);
const indianSpecialty=new Set(["kasuri-methi","amchur","garam-masala","kashmiri-chilli","meat-curry-powder"]);
const seaSpecialty=new Set(["belacan","shrimp-paste","candlenut","galangal","makrut-lime","makrut-zest","coriander-root","thai-eggplant","holy-basil","ikan-bilis"]);
const japaneseSpecialty=new Set(["kombu","katsuobushi","mirin","sake","white-miso","jp-curry","japanese-curry-roux"]);
const koreanSpecialty=new Set(["gochujang","doenjang","korean-soy","kimchi","dangmyeon","gochugaru"]);

function allergensFor(id:string):readonly MajorAllergenV2[]{
 const s=id.toLowerCase(),out=new Set<MajorAllergenV2>();
 if(/egg/.test(s))out.add("egg");
 if(/milk|cream|butter|ghee|yogh|yogurt|cheese|paneer|halloumi|feta|parmesan|pecorino|mozzarella|gruy/.test(s))out.add("milk");
 if(/tofu|soy|miso|gochujang|doenjang|hoisin/.test(s))out.add("soy");
 if(/fish|salmon|tuna|anchov|ikan-bilis|katsuobushi|fish-sauce/.test(s))out.add("fish");
 if(/prawn|shrimp|oyster-sauce|belacan/.test(s))out.add("shellfish");
 if(/peanut/.test(s))out.add("peanut");
 if(/cashew|almond|walnut|pine-nut|macadamia|candlenut/.test(s))out.add("tree-nut");
 if(/sesame/.test(s))out.add("sesame");
 if(/dijon|mustard/.test(s))out.add("mustard");
 if(!/corn-tortilla/.test(s)&&/wheat|flour|bread|baguette|roti|wrap|pasta|spaghetti|bucatini|egg-noodle|wheat-noodle|hk-pan-fried-noodles/.test(s))out.add("wheat");
 if(/light-soy|dark-soy|japanese-soy|korean-soy|gochujang|hoisin/.test(s))out.add("wheat");
 return [...out];
}
function bindingFor(id:string):NutritionBindingClassV2{
 if(/^(water|ice-water|water-slurry|poaching-liquid)$/.test(id))return"non_nutritive_or_process";
 if(manufacturerRequired.has(id))return"manufacturer_required";
 if(manufacturerPreferred.has(id)||pantryIds.has(id)||/sauce|paste|roux|ketchup|kimchi|noodle|bread|baguette|wrap|tortilla/.test(id))return"manufacturer_preferred";
 return"fdc_generic";
}
function sourcingFor(id:string):readonly SourcingClassV2[]{
 if(chineseSpecialty.has(id))return["chinese-grocer"];
 if(indianSpecialty.has(id))return["indian-grocer"];
 if(seaSpecialty.has(id))return["wet-market","thai-sea-grocer"];
 if(japaneseSpecialty.has(id))return["japanese-grocer"];
 if(koreanSpecialty.has(id))return["korean-grocer"];
 if(pantryIds.has(id))return["pantry","normal-supermarket"];
 return["normal-supermarket"];
}
function specialistFor(id:string){return chineseSpecialty.has(id)||indianSpecialty.has(id)||seaSpecialty.has(id)||japaneseSpecialty.has(id)||koreanSpecialty.has(id)}

const rows=new Map<string,CanonicalIngredientCatalogV7>(canonicalIngredientCatalogV2.map(x=>[x.id,{...x,source:"v2" as const}]));
for(const recipe of phase2ResearchRecipesV5)for(const x of recipe.ingredients){
 const id=canonicalIngredientKeyV7(x.id,x.unit),existing=rows.get(id);
 if(existing){if(existing.canonicalUnit!==x.unit)continue;continue}
 rows.set(id,{id,name:x.name,canonicalUnit:x.unit,allergens:allergensFor(id),nutritionBindingClass:bindingFor(id),sourcing:sourcingFor(id),specialistRisk:specialistFor(id),source:"phase2-v7"});
}

export const canonicalIngredientCatalogV7:readonly CanonicalIngredientCatalogV7[]=[...rows.values()].sort((a,b)=>a.id.localeCompare(b.id));
export const canonicalIngredientByIdV7=new Map(canonicalIngredientCatalogV7.map(x=>[x.id,x]));
export function getCanonicalIngredientV7(id:string,unit?:QuantityUnit){return canonicalIngredientByIdV7.get(unit?canonicalIngredientKeyV7(id,unit):id)}

export function validateCanonicalIngredientCatalogV7(){
 const errors:string[]=[];
 const seen=new Set<string>();for(const x of canonicalIngredientCatalogV7){if(seen.has(x.id))errors.push(`Duplicate canonical ingredient ${x.id}`);seen.add(x.id);if(!x.id||!x.name)errors.push("Ingredient missing id/name")}
 for(const recipe of phase2ResearchRecipesV5)for(const x of recipe.ingredients){const key=canonicalIngredientKeyV7(x.id,x.unit),def=canonicalIngredientByIdV7.get(key);if(!def)errors.push(`${recipe.id}: unresolved ingredient ${x.id}/${x.unit} -> ${key}`);else if(def.canonicalUnit!==x.unit)errors.push(`${recipe.id}: unit collision ${key} ${x.unit} vs ${def.canonicalUnit}`)}
 return{valid:errors.length===0,errors,count:canonicalIngredientCatalogV7.length,v2Count:canonicalIngredientCatalogV2.length,phase2Added:canonicalIngredientCatalogV7.length-canonicalIngredientCatalogV2.length};
}
