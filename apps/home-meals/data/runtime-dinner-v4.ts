import {getDinnerFormulationV2,type CanonicalDinnerFormulationV2,type RecipeIngredientV2} from "./recipe-formulations-v2";
import {prepForRecipeAtCookScaleV4} from "./food-engine-v2";
import {ingredientsForRecipeV2} from "./ingredient-engine-v2";
import {DEFAULT_COOK_SERVINGS_V4,type SupportedCookServingsV4} from "./household-serving-policy-v4";
import {getPhase2LiveRuntimeV7,type Phase2RuntimeDinnerV7} from "./phase2-runtime-v7";

export type OriginalRuntimeDinnerFormulationV4=Omit<CanonicalDinnerFormulationV2,"targetServings"|"prep"|"ingredients">&{
  targetServings:SupportedCookServingsV4;
  prep:ReturnType<typeof prepForRecipeAtCookScaleV4>;
  ingredients:readonly RecipeIngredientV2[];
  source?:"v2";
};
export type RuntimeDinnerFormulationV4=OriginalRuntimeDinnerFormulationV4|Phase2RuntimeDinnerV7;

/**
 * One authoritative runtime recipe contract. The original 36 derive 3/4-serving amounts
 * from their v2 two-person provenance; promoted Phase 2 recipes use their locked V7
 * four-serving formulation directly (and the V7 supported three-serving adapter).
 */
export function getRuntimeDinnerFormulationV4(recipeId:string,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):RuntimeDinnerFormulationV4|undefined{
  const promoted=getPhase2LiveRuntimeV7(recipeId,servings);if(promoted)return promoted;
  const reference=getDinnerFormulationV2(recipeId);if(!reference)return undefined;
  return{
    ...reference,
    targetServings:servings,
    prep:prepForRecipeAtCookScaleV4(recipeId,servings),
    ingredients:ingredientsForRecipeV2(recipeId,undefined,servings),
    source:"v2",
  };
}
