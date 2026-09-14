import { canonicalRecipesV2 } from "./recipe-truth-v2";
import { recipePrepAvailabilityV2, type ComponentStockV2 } from "./food-engine-v2";

export type PersonRatingsV2 = Readonly<Record<string,{josh?:number;g?:number}>>;
export type PlannerContextV2 = Readonly<{
  componentStock:ComponentStockV2;
  hardAllowedRecipeIds?:readonly string[];
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

/**
 * Constraints first, preferences second.
 * This intentionally does not invent ingredient availability, nutrition or expiry.
 * Callers may provide those as deterministic signals only when they actually exist.
 */
export function rankRecipesV2(context:PlannerContextV2):PlannerCandidateV2[]{
  const allowedSet=context.hardAllowedRecipeIds?new Set(context.hardAllowedRecipeIds):null;
  const priority=new Set(context.explicitPriorityRecipeIds??[]);
  const recent=new Set(context.recentRecipeIds??[]);
  return canonicalRecipesV2.map(recipe=>{
    const allowed=!allowedSet||allowedSet.has(recipe.id);
    const availability=recipePrepAvailabilityV2(recipe.id,context.componentStock);
    const reasons:string[]=[];
    let score=0;
    if(!allowed)return {recipeId:recipe.id,allowed:false,prepReady:false,score:-999,reasons:["hard constraint"]};

    if(availability.ready){score+=8;reasons.push("prep ready")}
    else score-=Math.min(8,availability.missing.length*2);

    if(priority.has(recipe.id)){score+=20;reasons.push("explicit household priority")}
    if(context.favourites?.[recipe.id]){score+=4;reasons.push("favourite")}

    const pref=couplePreference(recipe.id,context.ratings);
    score+=pref;
    if(pref>=2)reasons.push("rated well by the household");

    if(recent.has(recipe.id)){score-=5;reasons.push("recent repeat")}
    const useSoon=clamp(context.useSoonRecipeHits?.[recipe.id]??0,0,5);
    if(useSoon){score+=useSoon*3;reasons.push("uses use-soon food")}

    const leftover=clamp(context.leftoverValue?.[recipe.id]??0,-2,2);
    const prepReuse=clamp(context.prepReuseValue?.[recipe.id]??0,-3,3);
    const nutrition=clamp(context.nutritionFit?.[recipe.id]??0,-3,3);
    score+=leftover+prepReuse+nutrition;

    return {recipeId:recipe.id,allowed:true,prepReady:availability.ready,score,reasons};
  }).sort((a,b)=>b.score-a.score||a.recipeId.localeCompare(b.recipeId));
}
