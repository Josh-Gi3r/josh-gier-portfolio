import { formatQuantity, quantity } from "./food-quantity";
import { componentStockV12, type HouseholdStateV12 } from "./household-v12";
import { prepDemandForRecipesV2, prepNeedsForRecipesV2, oldestRemainingBatchV2, recipePrepAvailabilityV2 } from "./food-engine-v2";
import { shoppingNeedsForPlanV2, ingredientAvailabilityForRecipeV2 } from "./ingredient-engine-v2";
import { canonicalRecipesV2 } from "./recipe-truth-v2";
import { recipeAllergensV2 } from "./allergen-engine-v2";
import { recipeVariantsForV2 } from "./recipe-variants-v2";
import { approvedSubstitutionsV2 } from "./substitutions-v2";
import { activePrepSummaryV2,missingActivePrepForRecipeV2,prepExpansionCandidatesV2 } from "./prep-repertoire-v2";
import { mealHistorySummaryV2 } from "./meal-history-v2";
import { kcalReferenceForV3 } from "./recipe-kcal-reference-v3";
import { cookScaleSummaryV4 } from "./household-serving-policy-v4";
import { getPrepPortionPolicyV6, packetBreakdownV6 } from "./prep-portioning-v6";
import { prepPacketReferenceKcalV6 } from "./prep-energy-v6";

/** Precomputes arithmetic/facts so the language model explains truth instead of doing hidden food math. */
export function buildAssistantContextV2(state:HouseholdStateV12){
  const componentStock=componentStockV12(state),qualitative=state.qualitativeIngredientStock??{},activePrep=state.activePrepIds??[];
  const weekPrepDemand=prepDemandForRecipesV2(state.week),weekPrepMissing=prepNeedsForRecipesV2(state.week,componentStock);
  const shopping=shoppingNeedsForPlanV2(state.week.map(recipeId=>({recipeId})),state.ingredientStock,qualitative);
  const history=mealHistorySummaryV2({history:state.history,favourites:state.favourites,ratings:state.ratings});
  const repertoire=activePrepSummaryV2(activePrep),expansions=prepExpansionCandidatesV2(activePrep).filter(x=>x.newDinnerCount>0).slice(0,8);
  const recipes=canonicalRecipesV2.map(recipe=>{
    const prep=recipePrepAvailabilityV2(recipe.id,componentStock),ingredients=ingredientAvailabilityForRecipeV2(recipe.id,state.ingredientStock,undefined,qualitative),allergens=recipeAllergensV2(recipe.id),hx=history.recipes[recipe.id],outside=missingActivePrepForRecipeV2(recipe.id,activePrep),energy=kcalReferenceForV3(recipe.id);
    return {id:recipe.id,title:recipe.title,cuisine:recipe.cuisine,servings:recipe.servings,reportedMinutes:recipe.reportedTotalMinutes,kcalReferencePerPerson:energy?.kcalPerPerson??null,kcalUncertaintyPct:energy?.uncertaintyPct??null,kcalConfidence:energy?.confidence??null,kcalMethodology:energy?.methodology??null,mealWeight:energy?.mealWeight??null,prepReady:prep.ready,ingredientReady:ingredients.ready,activePrepFit:outside.length===0,missingActivePrep:outside,history:hx,missingPrep:prep.missing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),missingIngredients:ingredients.missing.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall)})),allergens:allergens.allergens,variants:recipeVariantsForV2(recipe.id).map(x=>({id:x.id,name:x.name}))};
  });
  const componentPackets=Object.fromEntries(Object.entries(componentStock).map(([id,q])=>{const policy=getPrepPortionPolicyV6(id);if(!policy||policy.packet.unit!==q.unit)return[id,{exact:formatQuantity(q),packet:null}];const split=packetBreakdownV6(id,q);return[id,{exact:formatQuantity(q),fullPackets:split.fullPackets,remainder:formatQuantity(split.remainder),packet:formatQuantity(policy.packet),kind:policy.kind,referenceKcalPerPacket:prepPacketReferenceKcalV6(id)}]}));
  const oldestBatches=[...new Set(state.componentBatches.map(x=>x.componentId))].map(componentId=>{const b=oldestRemainingBatchV2(componentId,state.componentBatches);if(!b)return null;const policy=getPrepPortionPolicyV6(componentId),split=policy&&policy.packet.unit===b.remaining.unit?packetBreakdownV6(componentId,b.remaining):null;return{componentId,batchId:b.batchId,producedAt:b.producedAt,remaining:formatQuantity(b.remaining),fullPackets:split?.fullPackets??null,remainder:split?formatQuantity(split.remainder):null}}).filter(Boolean);
  const qualitativeStock=Object.entries(qualitative).filter(([,level])=>level>0).map(([id,level])=>({id,level,label:["Out","Low","Some","Plenty"][Math.max(0,Math.min(3,level))]}));
  return {
    version:12,
    cookScale:cookScaleSummaryV4(),
    kitchenReady:state.kitchenReady,
    activePrep:{ids:activePrep,summary:repertoire,expansionCandidates:expansions},
    week:state.week,
    componentStock:Object.fromEntries(Object.entries(componentStock).map(([id,q])=>[id,formatQuantity(q)])),
    componentPackets,
    ingredientStock:Object.fromEntries(Object.entries(state.ingredientStock).filter(([,q])=>q.qty>0).map(([id,q])=>[id,formatQuantity(q)])),
    qualitativeStock,
    useSoon:Object.entries(state.useSoon).filter(([,v])=>v).map(([id])=>({id,markedAt:state.useSoonAt[id]??null})),
    weekPrepDemand:weekPrepDemand.map(x=>({id:x.componentId,required:formatQuantity(x.required)})),
    weekPrepMissing:weekPrepMissing.map(x=>({id:x.componentId,shortfall:formatQuantity(x.shortfall)})),
    shopping:shopping.map(x=>({id:x.ingredientId,shortfall:formatQuantity(x.shortfall),qualitativeLevel:x.qualitativeLevel})),
    recipes,
    mealHistory:{recent7:history.recent7,recent14:history.recent14,recent30:history.recent30,cuisines30:history.cuisines30,forgottenFavourites:history.forgottenFavourites,totalCookEvents:history.totalCookEvents},
    oldestBatches,
    favourites:Object.entries(state.favourites).filter(([,v])=>v).map(([id])=>id),
    ratings:state.ratings,
    recent:state.history.slice(0,20),
    notes:state.recipeNotes,
    cookObservations:state.cookObservations.slice(0,20),
    substitutions:approvedSubstitutionsV2.map(x=>({from:x.fromIngredientId,to:x.toIngredientId,grade:x.grade,note:x.note})),
    truthRules:{inventory:"kitchenReady=false means unknown, not empty. A confirmed empty kitchen has kitchenReady=true with zero stock.",cookScale:"Josh and G are normally two diners but the default cook batch is four servings, usually creating two leftover portions. Three servings is the supported smaller cook. Grocery, prep readiness and stock consumption are already calculated for the selected cook batch; never collapse cook servings to diner count or redo the scaling in language-model arithmetic.",repertoire:"The 41 prep components are a capability library and rotation, not a checklist to keep permanently stocked. Prefer activePrepIds and current week demand.",history:"Use deterministic cook history to avoid boring repetition and answer what was eaten recently.",nutrition:"kcalReferencePerPerson is now a V6 methodology-based reference estimate from ingredient composition plus prep proxies, with confidence and uncertainty. Exact household product labels and measured finished prep output can refine it. Strained stocks use finished-food proxies; frying/rendering uses stated process assumptions. Never present a reference estimate as laboratory analysis or household-calibrated truth.",safety:"Use structured safety targets; visual appearance never proves safe internal temperature.",prepStock:"Production batch, storage packet and exact recipe requirement are separate quantities. After making prep, Home records the actual measured finished g/ml and derives full packets plus a labelled remainder. Recipe requirements always preserve exact g/ml. Never treat the legacy workingUnit or a silicone cavity volume as the food quantity.",qualitative:"Out/Low/Some/Plenty is presence-level truth only; never translate it into grams or millilitres.",units:"Never convert g and ml without an explicit measured conversion. Gram-defined prep is weighed; container ml is fit/capacity guidance only."},
  };
}
