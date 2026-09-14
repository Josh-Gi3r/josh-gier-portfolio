import {getDinnerFormulationV2,type CanonicalDinnerFormulationV2} from "./recipe-formulations-v2";
import {ingredientsForRecipeV2} from "./ingredient-engine-v2";
import {prepForRecipeAtCookScaleV4} from "./food-engine-v2";
import {DEFAULT_COOK_SERVINGS_V4,type SupportedCookServingsV4} from "./household-serving-policy-v4";

export type RuntimeDinnerFormulationV4=Omit<CanonicalDinnerFormulationV2,"targetServings"|"prep"|"ingredients">&Readonly<{
  targetServings:SupportedCookServingsV4;
  prep:ReturnType<typeof prepForRecipeAtCookScaleV4>;
  ingredients:ReturnType<typeof ingredientsForRecipeV2>;
}>;

/**
 * Live recipe/cooking screens must use this runtime view, not the historical two-serving
 * v2 reference object. Methods/equipment stay source-anchored; quantities are rebased to
 * the household's 3-or-4-serving cook policy, defaulting to four.
 */
export function getRuntimeDinnerFormulationV4(recipeId:string,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):RuntimeDinnerFormulationV4|undefined{
  const reference=getDinnerFormulationV2(recipeId);if(!reference)return undefined;
  return {...reference,targetServings:servings,prep:prepForRecipeAtCookScaleV4(recipeId,servings),ingredients:ingredientsForRecipeV2(recipeId,undefined,servings)};
}
