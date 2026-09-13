import { formatQuantity } from "./food-quantity";
import { componentStockV12, type HouseholdStateV12 } from "./household-v12";
import { prepDemandForRecipesV2, prepNeedsForRecipesV2, oldestRemainingBatchV2 } from "./food-engine-v2";
import { shoppingNeedsForPlanV2, ingredientAvailabilityForRecipeV2 } from "./ingredient-engine-v2";
import { canonicalRecipesV2 } from "./recipe-truth-v2";
import { recipePrepAvailabilityV2 } from "./food-engine-v2";
import { recipeAllergensV2 } from "./allergen-engine-v2";
import { recipeVariantsForV2 } from "./recipe-variants-v2";
import { approvedSubstitutionsV2 } from "./substitutions-v2";

/** Precomputes arithmetic/facts so the language model explains truth instead of doing hidden food math. */
export function buildAssistantContextV2(state:HouseholdStateV12){
  const componentStock=componentStockV12(state);
  const weekPrepDemand=prepDemandForRecipesV2(state.week),weekPrepMissing=prepNeedsForRecipesV2(state.week,componentStock);
  const shopping=shoppingNeedsForPlanV2(state.week.map(recipeId=>({recipeId})),state.ingredientStock);
  const recipes=canonicalRecipesV2.map(recipe=>{
    const prep=recipePrepAvailabilityV2(recipe.id,componentStock),ingredients=ingredientAvailabilityForRecipeV2(recipe.id,state.ingredientStock),allergens=recipeAllergensV2(recipe.id);
    return {id:recipe.id,title:recipe.title,cuisine:recipe.cuisine,reportedMinutes:recipe.reportedTotalMinutes,prepReady:prep.ready,ingredientReady:ingredients.ready,missingPrep:prep.missing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),missingIngredients:ingredients.missing.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall)})),allergens:allergens.allergens,variants:recipeVariantsForV2(recipe.id).map(x=>({id:x.id,name:x.name}))};
  });
  const oldestBatches=[...new Set(state.componentBatches.map(x=>x.componentId))].map(componentId=>{const b=oldestRemainingBatchV2(componentId,state.componentBatches);return b?{componentId,batchId:b.batchId,producedAt:b.producedAt,remaining:formatQuantity(b.remaining)}:null}).filter(Boolean);
  return {
    version:12,
    week:state.week,
    componentStock:Object.fromEntries(Object.entries(componentStock).map(([id,q])=>[id,formatQuantity(q)])),
    ingredientStock:Object.fromEntries(Object.entries(state.ingredientStock).filter(([,q])=>q.qty>0).map(([id,q])=>[id,formatQuantity(q)])),
    weekPrepDemand:weekPrepDemand.map(x=>({id:x.componentId,required:formatQuantity(x.required)})),
    weekPrepMissing:weekPrepMissing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),
    shopping:shopping.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall)})),
    recipes,
    oldestBatches,
    favourites:Object.entries(state.favourites).filter(([,v])=>v).map(([id])=>id),
    ratings:state.ratings,
    recent:state.history.slice(0,12),
    notes:state.recipeNotes,
    substitutions:approvedSubstitutionsV2.map(x=>({from:x.fromIngredientId,to:x.toIngredientId,grade:x.grade,note:x.note})),
    truthRules:{nutrition:"Only state a number supplied by the deterministic nutrition engine.",safety:"Use structured safety targets; visual appearance never proves safe internal temperature.",yield:"Only measured household batch output is stock truth.",units:"Never convert g and ml without an explicit measured conversion, which Home Meals currently does not define."},
  };
}
