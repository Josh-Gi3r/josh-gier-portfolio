import { canonicalRecipesV2 } from "./recipe-truth-v2";
import { recipePrepAvailabilityV2, type ComponentStockV2 } from "./food-engine-v2";
import { missingActivePrepForRecipeV2 } from "./prep-repertoire-v2";

export type PersonRatingsV2 = Readonly<Record<string,{josh?:number;g?:number}>>;
export type PlannerContextV2 = Readonly<{
  componentStock:ComponentStockV2;
  hardAllowedRecipeIds?:readonly string[];
  activePrepIds?:readonly string[];
  favourites?:Readonly<Record<string,boolean>>;
  ratings?:PersonRatingsV2;
  recentRecipeIds?:readonly string[];
  useSoonRecipeHits?:Readonly<Record<string,number>>;
  leftoverValue?:Readonly<Record<string,number>>;
  prepReuseValue?:Readonly<Record<string,number>>;
  nutritionFit?:Readonly<Record<string,number>>;
  explicitPriorityRecipeIds?:readonly string[];
}>;

export type PlannerCandidateV2 = Readonly<{
  recipeId:string;
  allowed:boolean;
  prepReady:boolean;
  activePrepFit:boolean;
  score:number;
  reasons:readonly string[];
}>;

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

function couplePreference(recipeId:string,ratings:PersonRatingsV2|undefined):number{
  const r=ratings?.[recipeId];if(!r)return 0;
  const vals=[r.josh,r.g].filter((x):x is number=>Number.isFinite(x));
  if(!vals.length)return 0;
  return (vals.reduce((a,b)=>a+b,0)/vals.length-3)*2;
}

/** Constraints first, then prep repertoire, recency and household preference. */
export function rankRecipesV2(context:PlannerContextV2):PlannerCandidateV2[]{
  const allowedSet=context.hardAllowedRecipeIds?new Set(context.hardAllowedRecipeIds):null;
  const priority=new Set(context.explicitPriorityRecipeIds??[]),recent=new Set(context.recentRecipeIds??[]),active=context.activePrepIds??[];
  return canonicalRecipesV2.map(recipe=>{
    const allowed=!allowedSet||allowedSet.has(recipe.id),availability=recipePrepAvailabilityV2(recipe.id,context.componentStock),outside=active.length?missingActivePrepForRecipeV2(recipe.id,active):[],activePrepFit=outside.length===0,reasons:string[]=[];
    let score=0;
    if(!allowed)return {recipeId:recipe.id,allowed:false,prepReady:false,activePrepFit:false,score:-999,reasons:["hard constraint"]};
    if(active.length){if(activePrepFit){score+=10;reasons.push("fits active prep repertoire")}else{score-=outside.length*7;reasons.push(`needs ${outside.length} prep addition${outside.length===1?"":"s"}`)}}
    if(availability.ready){score+=8;reasons.push("prep ready")}else score-=Math.min(8,availability.missing.length*2);
    if(priority.has(recipe.id)){score+=20;reasons.push("explicit household priority")}
    if(context.favourites?.[recipe.id]){score+=4;reasons.push("favourite")}
    const pref=couplePreference(recipe.id,context.ratings);score+=pref;if(pref>=2)reasons.push("rated well by the household");
    if(recent.has(recipe.id)){score-=6;reasons.push("recent repeat")}
    const useSoon=clamp(context.useSoonRecipeHits?.[recipe.id]??0,0,5);if(useSoon){score+=useSoon*3;reasons.push("uses use-soon food")}
    const leftover=clamp(context.leftoverValue?.[recipe.id]??0,-2,2),prepReuse=clamp(context.prepReuseValue?.[recipe.id]??0,-3,3),nutrition=clamp(context.nutritionFit?.[recipe.id]??0,-3,3);score+=leftover+prepReuse+nutrition;
    return {recipeId:recipe.id,allowed:true,prepReady:availability.ready,activePrepFit,score,reasons};
  }).sort((a,b)=>b.score-a.score||a.recipeId.localeCompare(b.recipeId));
}
