import {phase2OperationalResearchRecipesV8} from "./v8-recipe-overrides";
import {recipeEnergyReferenceV6} from "./recipe-energy-v6";
import {prepRequirementPacketTextV6} from "./prep-portioning-v6";
import {quantity} from "./food-quantity";

/**
 * Operational overlay for the 100 formulation-locked Phase 2 recipes.
 * Research provenance stays immutable; this layer adds V6 packet language and the
 * methodology-derived nutrition estimate that Live Promotion will consume.
 */
export const phase2OperationalRecipesV6=phase2OperationalResearchRecipesV8.map(recipe=>({
  recipeId:recipe.id,
  targetServings:recipe.targetServings,
  prep:recipe.prep.map(p=>({componentId:p.componentId,quantity:quantity(p.qty,p.unit),display:prepRequirementPacketTextV6(p.componentId,quantity(p.qty,p.unit))})),
  nutrition:recipeEnergyReferenceV6(recipe.id),
  status:"operationally_reconciled_not_live" as const,
}));

export const phase2OperationalRecipeByIdV6=new Map(phase2OperationalRecipesV6.map(x=>[x.recipeId,x]));
export function getPhase2OperationalRecipeV6(recipeId:string){return phase2OperationalRecipeByIdV6.get(recipeId)}
