import {formatQuantity} from "./food-quantity";
import {componentStockV12,type HouseholdStateV12} from "./household-v12";
import {buildAssistantContextV2} from "./assistant-context-v2";
import {allLiveRecipesV7} from "./recipe-catalog-v7";
import {prepDemandForRecipesV7,prepNeedsForRecipesV7,recipePrepAvailabilityV7} from "./food-engine-v7";
import {shoppingNeedsForPlanV7,ingredientAvailabilityForRecipeV7} from "./ingredient-engine-v7";
import {activePrepSummaryV7,missingActivePrepForRecipeV7,prepExpansionCandidatesV7} from "./prep-repertoire-v7";
import {mealHistorySummaryV7} from "./meal-history-v7";
import {getPhase2LiveCandidateV7} from "./phase2-live-candidates-v7";
import {livePhase2RecipeIdsV7} from "./phase2-promotion-registry-v7";
import {recipeAllergensV2} from "./allergen-engine-v2";
import {recipeVariantsForV2} from "./recipe-variants-v2";
import {kcalReferenceForV3} from "./recipe-kcal-reference-v3";

const phase2Live=new Set(livePhase2RecipeIdsV7);

/** V7 assistant context keeps V2 truth rules/provenance but expands deterministic planning over the gated live catalogue. */
export function buildAssistantContextV7(state:HouseholdStateV12){
 const base=buildAssistantContextV2(state),componentStock=componentStockV12(state),qualitative=state.qualitativeIngredientStock??{},activePrep=state.activePrepIds??[];
 const planningWeek=state.weekStatus==="suggested"&&state.suggestedWeek?.length===7?state.suggestedWeek:state.week,weekPrepDemand=prepDemandForRecipesV7(planningWeek),weekPrepMissing=prepNeedsForRecipesV7(planningWeek,componentStock),shopping=shoppingNeedsForPlanV7(planningWeek.map(recipeId=>({recipeId})),state.ingredientStock,qualitative),history=mealHistorySummaryV7({history:state.history,favourites:state.favourites,ratings:state.ratings}),repertoire=activePrepSummaryV7(activePrep),expansions=prepExpansionCandidatesV7(activePrep).filter(x=>x.newDinnerCount>0).slice(0,8);
 const recipes=allLiveRecipesV7.map(recipe=>{
  const prep=recipePrepAvailabilityV7(recipe.id,componentStock),ingredients=ingredientAvailabilityForRecipeV7(recipe.id,state.ingredientStock,undefined,qualitative),outside=missingActivePrepForRecipeV7(recipe.id,activePrep),energy=kcalReferenceForV3(recipe.id),candidate=phase2Live.has(recipe.id)?getPhase2LiveCandidateV7(recipe.id):undefined;
  const allergens=candidate?.allergens??recipeAllergensV2(recipe.id).allergens,variants=candidate?[]:recipeVariantsForV2(recipe.id).map(x=>({id:x.id,name:x.name}));
  return{id:recipe.id,title:recipe.title,cuisine:recipe.cuisine,servings:4,reportedMinutes:recipe.minutes,kcalReferencePerPerson:energy?.kcalPerPerson??candidate?.nutrition?.kcalPerPerson??null,kcalUncertaintyPct:energy?.uncertaintyPct??candidate?.nutrition?.uncertaintyPct??null,kcalConfidence:energy?.confidence??candidate?.nutrition?.confidence??null,kcalMethodology:energy?.methodology??candidate?.nutrition?.methodology??null,mealWeight:energy?.mealWeight??candidate?.mealWeight??null,prepReady:prep.ready,ingredientReady:ingredients.ready,activePrepFit:outside.length===0,missingActivePrep:outside,history:history.recipes[recipe.id],missingPrep:prep.missing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),missingIngredients:ingredients.missing.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall)})),allergens,variants,phase2:!!candidate};
 });
 const phase2Substitutions=livePhase2RecipeIdsV7.flatMap(id=>(getPhase2LiveCandidateV7(id)?.substitutions??[]).map(x=>({recipeId:id,from:x.from,to:x.to,grade:x.grade,note:x.note})));
 const prepInventory=Object.entries(componentStock).filter(([,q])=>q.qty>0).map(([id,q])=>({id,qty:formatQuantity(q)}));
 return{...base,prepInventory,planning:{weekStatus:state.weekStatus,planMode:state.planMode,allowExtraPrep:state.allowExtraPrep,displayWeek:planningWeek},liveCatalogue:{total:allLiveRecipesV7.length,phase2Live:livePhase2RecipeIdsV7.length},activePrep:{ids:activePrep,summary:repertoire,expansionCandidates:expansions},week:planningWeek,weekPrepDemand:weekPrepDemand.map(x=>({id:x.componentId,required:formatQuantity(x.required)})),weekPrepMissing:weekPrepMissing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),shopping:shopping.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall),qualitativeLevel:x.qualitativeLevel})),recipes,mealHistory:{recent7:history.recent7,recent14:history.recent14,recent30:history.recent30,cuisines30:history.cuisines30,forgottenFavourites:history.forgottenFavourites,totalCookEvents:history.totalCookEvents},substitutions:[...base.substitutions,...phase2Substitutions],truthRules:{...base.truthRules,catalogue:"Only recipes in the V7 live catalogue may be recommended as cookable saved recipes. Formulation-locked Phase 2 research that has not passed its promotion gate is not live and must not be suggested by ID."}};
}
