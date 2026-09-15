import { canonicalPrepComponentsV2,recipePrepV2 } from "./food-truth-v2";
import { recipes } from "./home-data";

export const optionalPrepIdsV2=new Set(["onion"] as const);
export const coreMotherIdsV2=canonicalPrepComponentsV2.filter(x=>x.tier==="mother"&&!optionalPrepIdsV2.has(x.id as "onion")).map(x=>x.id);

export const prepStarterSetsV2={
  small:{id:"small",label:"Start small",description:"Three flexible mothers with broad cuisine coverage.",componentIds:["gold","sambal","red"] as const},
  balanced:{id:"balanced",label:"Balanced",description:"Five mothers spanning Indian, Malaysian, Western and stock-led dinners.",componentIds:["gold","sambal","red","rempah","clear"] as const},
  fullMothers:{id:"full-mothers",label:"All core bases",description:"All seven core bases active; mids, boosters and optional foundations stay demand-led.",componentIds:coreMotherIdsV2},
} as const;

export function prepIdsForRecipeV2(recipeId:string){return recipePrepV2(recipeId).map(x=>x.componentId)}
export function activePrepSetV2(ids:readonly string[]){return new Set(ids.filter(id=>canonicalPrepComponentsV2.some(x=>x.id===id)))}
export function missingActivePrepForRecipeV2(recipeId:string,activeIds:readonly string[]){const active=activePrepSetV2(activeIds);return prepIdsForRecipeV2(recipeId).filter(id=>!active.has(id))}
export function recipeSupportedByActivePrepV2(recipeId:string,activeIds:readonly string[]){return missingActivePrepForRecipeV2(recipeId,activeIds).length===0}
export function unlockedRecipesForActivePrepV2(activeIds:readonly string[]){return recipes.filter(r=>recipeSupportedByActivePrepV2(r.id,activeIds))}

export function activePrepSummaryV2(activeIds:readonly string[]){
  const active=activePrepSetV2(activeIds),components=canonicalPrepComponentsV2.filter(x=>active.has(x.id));
  const mothers=components.filter(x=>x.tier==="mother"),mids=components.filter(x=>x.tier==="mid"),boosters=components.filter(x=>x.tier==="booster"),unlocked=unlockedRecipesForActivePrepV2(activeIds);
  return {componentIds:components.map(x=>x.id),mothers:mothers.map(x=>x.id),mids:mids.map(x=>x.id),boosters:boosters.map(x=>x.id),unlockedRecipeIds:unlocked.map(x=>x.id),unlockedCount:unlocked.length,totalRecipes:recipes.length};
}

export function prepExpansionCandidatesV2(activeIds:readonly string[]){
  const active=activePrepSetV2(activeIds),before=new Set(unlockedRecipesForActivePrepV2(activeIds).map(x=>x.id));
  return canonicalPrepComponentsV2.filter(c=>!active.has(c.id)).map(c=>{
    const next=[...activeIds,c.id],after=unlockedRecipesForActivePrepV2(next),newRecipeIds=after.map(x=>x.id).filter(id=>!before.has(id));
    return {componentId:c.id,code:c.code,name:c.name,tier:c.tier,newRecipeIds,newDinnerCount:newRecipeIds.length};
  }).sort((a,b)=>b.newDinnerCount-a.newDinnerCount||a.tier.localeCompare(b.tier)||a.code.localeCompare(b.code));
}

export function prepRelationshipLabelV2(componentId:string){
  const c=canonicalPrepComponentsV2.find(x=>x.id===componentId);if(!c)return null;
  const made=c.madeFrom.map(id=>canonicalPrepComponentsV2.find(x=>x.id===id)?.code??id),withIds=c.usedWith.map(id=>canonicalPrepComponentsV2.find(x=>x.id===id)?.code??id);
  if(made.length)return `Made from ${made.join(" + ")}`;
  if(withIds.length)return `Pairs with ${withIds.join(" + ")}`;
  if(optionalPrepIdsV2.has(componentId as "onion"))return "Optional foundation";
  return c.tier==="mother"?"Core base":"Standalone";
}
