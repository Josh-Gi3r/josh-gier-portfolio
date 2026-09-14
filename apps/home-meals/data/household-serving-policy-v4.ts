import { quantity, type Quantity, type QuantityUnit } from "./food-quantity";

/**
 * Household cook-scale truth.
 *
 * Josh + G are usually two diners, but the normal cook batch is four servings so dinner
 * naturally creates leftovers. Three servings is the supported smaller batch.
 *
 * The legacy v2 dinner formulations were authored around two servings. We retain those
 * records as research/reference provenance, then scale them through this policy before
 * grocery, readiness, cooking, stock consumption or UI presentation.
 *
 * This is deliberately not a blind x2 rule: bulk food scales linearly, while cooking fat,
 * strong seasonings, aromatics, finishing herbs and reduction liquid scale more slowly.
 * Wok recipes may also require two physical wok batches even though ingredient truth is
 * for one four-serving cook.
 */
export const TYPICAL_DINERS_V4=2 as const;
export const DEFAULT_COOK_SERVINGS_V4=4 as const;
export const MIN_COOK_SERVINGS_V4=3 as const;
export const REFERENCE_SERVINGS_V2=2 as const;
export const DEFAULT_LEFTOVER_SERVINGS_V4=DEFAULT_COOK_SERVINGS_V4-TYPICAL_DINERS_V4;

export type SupportedCookServingsV4=3|4;
export type ScalableIngredientV4=Readonly<{
  ingredientId:string;
  name:string;
  qty:number;
  unit:QuantityUnit;
  optional?:boolean;
}>;
export type ScalablePrepRequirementV4=Readonly<{componentId:string;quantity:Quantity}>;

const cookingFatIds=new Set(["neutral-oil","olive-oil","sesame-oil","butter-unsalted","ghee"]);
const waterIds=new Set(["water","water-slurry","water-or-low-sodium-stock"]);
const strongSeasoningIds=new Set([
  "salt-fine","sugar","palm-sugar","gula-melaka","fish-sauce","soy-sauce","light-soy","dark-soy","oyster-sauce","hoisin","shaoxing-wine","mirin","sake","rice-vinegar","chinkiang-vinegar","tamarind","tamarind-pulp","dijon","wholegrain-mustard","gochujang","miso","white-miso","chilli-oil","hot-sauce","worcestershire",
  "garam-masala","cumin-seed","cumin-ground","roasted-cumin","coriander-ground","turmeric-ground","kashmiri-chilli","paprika","chilli-flake","five-spice","white-pepper","black-pepper","sichuan-pepper","amchur","kasuri-methi"
]);
const aromaticIds=new Set(["garlic-fresh","ginger-fresh","green-chilli","dried-red-chilli","scallion-white","scallion","lemongrass","galangal"]);
const finishingHerbIds=new Set(["coriander","thai-basil","holy-basil","makrut-lime"]);

function fourServingFactor(input:ScalableIngredientV4):number{
  const id=input.ingredientId;
  if(cookingFatIds.has(id)||/\boil\b/i.test(input.name)&&/oil/i.test(input.name))return 1.5;
  if(waterIds.has(id))return 1.75;
  if(strongSeasoningIds.has(id))return 1.75;
  if(aromaticIds.has(id))return 1.75;
  if(finishingHerbIds.has(id))return 1.5;
  return 2;
}

function roundQty(qty:number,unit:QuantityUnit):number{
  if(unit==="count")return Math.max(1,Math.round(qty));
  if(qty>=100)return Math.round(qty/5)*5;
  if(qty>=20)return Math.round(qty);
  return Math.round(qty*2)/2;
}

export function scaleReferenceIngredientToCookServingsV4<T extends ScalableIngredientV4>(input:T,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):T{
  const factor4=fourServingFactor(input);
  const factor=servings===4?factor4:1+(factor4-1)*0.5;
  return {...input,qty:roundQty(input.qty*factor,input.unit)};
}

export function scaleReferenceIngredientsToCookServingsV4<T extends ScalableIngredientV4>(items:readonly T[],servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):T[]{
  return items.map(item=>scaleReferenceIngredientToCookServingsV4(item,servings));
}

/**
 * Exact four-serving prep-consumption targets for the 36 live dinners plus the first
 * Chinese research batch. These quantities were reviewed as practical cook-batch amounts;
 * sauces/boosters intentionally do not all double from the old two-serving contract.
 */
const fourServingPrep:Readonly<Record<string,Readonly<Record<string,Quantity>>>>={
  "gold-chicken-curry":{gold:quantity(240,"g")},
  "gold-chana-masala":{gold:quantity(240,"g")},
  "gold-punjabi-egg-curry":{gold:quantity(240,"g")},
  "gold-saag-chicken":{gold:quantity(220,"g"),saag:quantity(240,"g")},
  "gold-aloo-matar":{gold:quantity(240,"g")},
  "sambal-udang":{sambal:quantity(120,"g")},
  "sambal-telur":{sambal:quantity(120,"g")},
  "curry-laksa":{laksa:quantity(220,"g"),clear:quantity(800,"ml")},
  "rempah-coconut-fish":{rempah:quantity(220,"g"),lemongrass:quantity(25,"g")},
  "rempah-chicken-rendang":{rendang:quantity(220,"g"),lemongrass:quantity(25,"g")},
  "thai-green-chicken":{"thai-green":quantity(55,"g")},
  "thai-red-chicken":{"thai-red":quantity(55,"g")},
  "massaman-beef":{"thai-red":quantity(55,"g"),"massaman-finish":quantity(12,"g")},
  "pad-kra-pao":{garlic:quantity(25,"g"),chilli:quantity(25,"g"),krapow:quantity(75,"ml")},
  "pad-see-ew":{garlic:quantity(25,"g")},
  "beef-broccoli":{"wok-brown":quantity(225,"ml")},
  "brown-chicken-mushroom":{"wok-brown":quantity(225,"ml")},
  "moo-goo-gai-pan":{"wok-white":quantity(225,"ml")},
  "white-sauce-prawns":{"wok-white":quantity(225,"ml")},
  "wok-tofu-greenbeans":{"wok-brown":quantity(225,"ml"),chilli:quantity(25,"g")},
  "teriyaki-salmon":{teriyaki:quantity(100,"ml")},
  "teriyaki-chicken":{teriyaki:quantity(100,"ml")},
  "miso-salmon":{"miso-ginger":quantity(140,"g")},
  "miso-aubergine-tofu":{},
  "bulgogi-beef":{bulgogi:quantity(175,"g")},
  "gochujang-chicken":{gochujang:quantity(100,"g")},
  "gochujang-tofu":{gochujang:quantity(55,"g")},
  "beef-ragu":{red:quantity(320,"g"),blond:quantity(100,"g"),dark:quantity(50,"g")},
  "chicken-cacciatore":{red:quantity(320,"g"),dark:quantity(50,"g")},
  "mustard-mushroom-chicken":{blond:quantity(200,"g"),duxelles:quantity(100,"g"),dark:quantity(50,"g")},
  "pesto-salmon":{pesto:quantity(55,"g")},
  "red-shakshuka":{red:quantity(320,"g"),harissa:quantity(50,"g")},
  "harissa-chicken-traybake":{harissa:quantity(100,"g")},
  "harissa-chickpeas":{harissa:quantity(50,"g")},
  "chipotle-chicken-bowl":{red:quantity(160,"g"),chipotle:quantity(100,"g")},
  "chipotle-bean-skillet":{red:quantity(160,"g"),chipotle:quantity(50,"g")},

  "mapo-tofu":{douban:quantity(50,"g")},
  "char-siu-pork":{"char-siu":quantity(110,"g")},
  "char-siu-chicken":{"char-siu":quantity(100,"g")},
  "ginger-scallion-chicken":{"ginger-scallion":quantity(30,"g")},
} as const;

export function prepRequirementsForCookServingsV4(recipeId:string,reference:readonly ScalablePrepRequirementV4[],servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):ScalablePrepRequirementV4[]{
  const exact=fourServingPrep[recipeId];
  if(servings===4&&exact){
    return reference.map(req=>({componentId:req.componentId,quantity:exact[req.componentId]??quantity(roundQty(req.quantity.qty*1.75,req.quantity.unit),req.quantity.unit)}));
  }
  const four=exact?reference.map(req=>({componentId:req.componentId,quantity:exact[req.componentId]??quantity(roundQty(req.quantity.qty*1.75,req.quantity.unit),req.quantity.unit)})):reference.map(req=>({componentId:req.componentId,quantity:quantity(roundQty(req.quantity.qty*1.75,req.quantity.unit),req.quantity.unit)}));
  if(servings===4)return four;
  return four.map(req=>({componentId:req.componentId,quantity:quantity(roundQty(req.quantity.qty*0.75,req.quantity.unit),req.quantity.unit)}));
}

export function cookScaleSummaryV4(){return{typicalDiners:TYPICAL_DINERS_V4,defaultCookServings:DEFAULT_COOK_SERVINGS_V4,minCookServings:MIN_COOK_SERVINGS_V4,defaultLeftovers:DEFAULT_LEFTOVER_SERVINGS_V4}}
