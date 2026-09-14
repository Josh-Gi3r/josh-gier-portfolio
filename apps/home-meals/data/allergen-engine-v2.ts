import { canonicalIngredientKeyV2, getCanonicalIngredientV2, type MajorAllergenV2 } from "./ingredient-catalog-v2";
import { getPrepFormulationV2 } from "./prep-formulations-v2";
import { ingredientsForRecipeV2 } from "./ingredient-engine-v2";
import { recipePrepV2 } from "./food-truth-v2";

export type AllergenResultV2=Readonly<{
  allergens:readonly MajorAllergenV2[];
  unresolvedIngredientIds:readonly string[];
}>;

export function componentAllergensV2(componentId:string,seen=new Set<string>()):AllergenResultV2{
  if(seen.has(componentId))throw new Error(`Component allergen cycle at ${componentId}`);seen.add(componentId);
  const formulation=getPrepFormulationV2(componentId);if(!formulation)throw new Error(`Missing prep formulation ${componentId}`);
  const allergens=new Set<MajorAllergenV2>(),unresolved=new Set<string>();
  for(const x of formulation.ingredientInputs){const key=canonicalIngredientKeyV2(x.ingredientId,x.unit);const ingredient=getCanonicalIngredientV2(key);if(!ingredient){unresolved.add(key);continue}for(const allergen of ingredient.allergens)allergens.add(allergen)}
  for(const parent of formulation.componentInputs){const nested=componentAllergensV2(parent.componentId,new Set(seen));for(const allergen of nested.allergens)allergens.add(allergen);for(const id of nested.unresolvedIngredientIds)unresolved.add(id)}
  return{allergens:[...allergens].sort(),unresolvedIngredientIds:[...unresolved].sort()};
}

export function recipeAllergensV2(recipeId:string,variantId?:string):AllergenResultV2{
  const allergens=new Set<MajorAllergenV2>(),unresolved=new Set<string>();
  for(const x of ingredientsForRecipeV2(recipeId,variantId)){if(x.optional)continue;const key=canonicalIngredientKeyV2(x.ingredientId,x.unit);const ingredient=getCanonicalIngredientV2(key);if(!ingredient){unresolved.add(key);continue}for(const allergen of ingredient.allergens)allergens.add(allergen)}
  for(const prep of recipePrepV2(recipeId)){const nested=componentAllergensV2(prep.componentId);for(const allergen of nested.allergens)allergens.add(allergen);for(const id of nested.unresolvedIngredientIds)unresolved.add(id)}
  return{allergens:[...allergens].sort(),unresolvedIngredientIds:[...unresolved].sort()};
}
