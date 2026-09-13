import { ingredients, type IngredientDef } from "./home-data";

export type IngredientTruthStatus =
  | "canonical"
  | "needs_exact_quantity"
  | "needs_variant_split"
  | "state_only";

export type NutritionBindingRequirement =
  | "fdc_generic"
  | "manufacturer_preferred"
  | "manufacturer_required"
  | "not_nutrition_bearing";

export type CanonicalIngredientV2 = Readonly<{
  id:string;
  name:string;
  category:IngredientDef["category"];
  unit:IngredientDef["unit"];
  tracking:IngredientDef["tracking"];
  truthStatus:IngredientTruthStatus;
  nutritionBinding:NutritionBindingRequirement;
  note?:string;
}>;

const ambiguousChoices = new Set([
  "ground-meat",
  "chicken-or-beef",
  "prawns-or-chicken",
  "starch-side",
]);

const vaguePortionIds = new Set([
  "rice",
  "jasmine-rice",
  "basmati-rice",
]);

const manufacturerPreferred = new Set([
  "coconut-milk","fish-sauce","oyster-sauce","soy-sauce","dark-soy","sesame-oil",
  "dijon","cream","yoghurt","tofu"
]);

export const canonicalIngredientsV2:readonly CanonicalIngredientV2[] = ingredients.map(i=>{
  const truthStatus:IngredientTruthStatus =
    ambiguousChoices.has(i.id) ? "needs_variant_split" :
    vaguePortionIds.has(i.id) || i.unit==="portion" ? "needs_exact_quantity" :
    i.tracking==="state" ? "state_only" :
    "canonical";
  const nutritionBinding:NutritionBindingRequirement =
    i.tracking==="state" ? "not_nutrition_bearing" :
    manufacturerPreferred.has(i.id) ? "manufacturer_preferred" :
    "fdc_generic";
  return {
    id:i.id,
    name:i.name,
    category:i.category,
    unit:i.unit,
    tracking:i.tracking,
    truthStatus,
    nutritionBinding,
    note: truthStatus==="needs_variant_split"
      ? "Legacy ingredient combines mutually exclusive recipe variants; split before nutrition can be final."
      : truthStatus==="needs_exact_quantity"
        ? "Legacy recipe uses an imprecise serving/portion quantity; replace with g/ml/count in the canonical recipe."
        : undefined,
  };
});

export const ingredientTruthByIdV2 = new Map(canonicalIngredientsV2.map(x=>[x.id,x]));

export function getIngredientTruthV2(id:string):CanonicalIngredientV2|undefined {
  return ingredientTruthByIdV2.get(id);
}
