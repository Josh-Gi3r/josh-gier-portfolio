import {getRuntimeDinnerFormulationV4,type RuntimeDinnerFormulationV4} from "./runtime-dinner-v4";
import {getPhase2LiveRuntimeV7,type Phase2RuntimeDinnerV7} from "./phase2-runtime-v7";
import {DEFAULT_COOK_SERVINGS_V4,type SupportedCookServingsV4} from "./household-serving-policy-v4";

export type RuntimeDinnerFormulationV7=RuntimeDinnerFormulationV4|Phase2RuntimeDinnerV7;

/** Unified runtime gate. Existing 36 stay on the proven V4 path; promoted Phase 2 recipes enter only through the promotion registry. */
export function getRuntimeDinnerFormulationV7(recipeId:string,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):RuntimeDinnerFormulationV7|undefined{
  return getPhase2LiveRuntimeV7(recipeId,servings)??getRuntimeDinnerFormulationV4(recipeId,servings);
}
