import {canonicalPrepComponentsV2} from "./food-truth-v2";
import {allLiveRecipesV7} from "./recipe-catalog-v7";
import {prepForRecipeAtCookScaleV7} from "./food-engine-v7";
import {activePrepSetV2,prepRelationshipLabelV2,prepStarterSetsV2} from "./prep-repertoire-v2";

export{prepStarterSetsV2,prepRelationshipLabelV2};
export function prepIdsForRecipeV7(recipeId:string){return prepForRecipeAtCookScaleV7(recipeId).map(x=>x.componentId)}
export function missingActivePrepForRecipeV7(recipeId:string,activeIds:readonly string[]){const active=activePrepSetV2(activeIds);return prepIdsForRecipeV7(recipeId).filter(id=>!active.has(id))}
export function recipeSupportedByActivePrepV7(recipeId:string,activeIds:readonly string[]){return missingActivePrepForRecipeV7(recipeId,activeIds).length===0}
export function unlockedRecipesForActivePrepV7(activeIds:readonly string[]){return allLiveRecipesV7.filter(r=>recipeSupportedByActivePrepV7(r.id,activeIds))}
export function activePrepSummaryV7(activeIds:readonly string[]){const active=activePrepSetV2(activeIds),components=canonicalPrepComponentsV2.filter(x=>active.has(x.id)),mothers=components.filter(x=>x.tier==="mother"),mids=components.filter(x=>x.tier==="mid"),boosters=components.filter(x=>x.tier==="booster"),unlocked=unlockedRecipesForActivePrepV7(activeIds);return{componentIds:components.map(x=>x.id),mothers:mothers.map(x=>x.id),mids:mids.map(x=>x.id),boosters:boosters.map(x=>x.id),unlockedRecipeIds:unlocked.map(x=>x.id),unlockedCount:unlocked.length,totalRecipes:allLiveRecipesV7.length}}
export function prepExpansionCandidatesV7(activeIds:readonly string[]){const active=activePrepSetV2(activeIds),before=new Set(unlockedRecipesForActivePrepV7(activeIds).map(x=>x.id));return canonicalPrepComponentsV2.filter(c=>!active.has(c.id)).map(c=>{const next=[...activeIds,c.id],after=unlockedRecipesForActivePrepV7(next),newRecipeIds=after.map(x=>x.id).filter(id=>!before.has(id));return{componentId:c.id,code:c.code,name:c.name,tier:c.tier,newRecipeIds,newDinnerCount:newRecipeIds.length}}).sort((a,b)=>b.newDinnerCount-a.newDinnerCount||a.tier.localeCompare(b.tier)||a.code.localeCompare(b.code))}
