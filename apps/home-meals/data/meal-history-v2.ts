import { recipes } from "./home-data";

export type CookEventV2=Readonly<{mealId:string;variantId?:string;at:string}>;
export type RatingLike=Readonly<Record<string,{josh?:number;g?:number}>>;

export type RecipeHistoryV2=Readonly<{
  recipeId:string;
  cookCount:number;
  lastCookedAt:string|null;
  daysSince:number|null;
  cookedLast7:number;
  cookedLast30:number;
  neverCooked:boolean;
}>;

const DAY=86_400_000;
function ageDays(at:string,now:number){const t=Date.parse(at);return Number.isFinite(t)?Math.max(0,Math.floor((now-t)/DAY)):null}

export function recipeHistoryV2(history:readonly CookEventV2[],now=Date.now()):Readonly<Record<string,RecipeHistoryV2>>{
  const out:Record<string,RecipeHistoryV2>={};
  for(const recipe of recipes){
    const events=history.filter(x=>x.mealId===recipe.id).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
    const ages=events.map(x=>ageDays(x.at,now)).filter((x):x is number=>x!=null);
    out[recipe.id]={recipeId:recipe.id,cookCount:events.length,lastCookedAt:events[0]?.at??null,daysSince:ages[0]??null,cookedLast7:ages.filter(x=>x<7).length,cookedLast30:ages.filter(x=>x<30).length,neverCooked:events.length===0};
  }
  return out;
}

export function recentRecipeIdsV2(history:readonly CookEventV2[],days=14,now=Date.now()):string[]{
  const seen=new Set<string>(),out:string[]=[];
  for(const event of [...history].sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))){const age=ageDays(event.at,now);if(age==null||age>=days||seen.has(event.mealId))continue;seen.add(event.mealId);out.push(event.mealId)}
  return out;
}

export function recentPenaltyV2(recipeId:string,history:readonly CookEventV2[],now=Date.now()):number{
  const h=recipeHistoryV2(history,now)[recipeId];if(!h||h.daysSince==null)return 0;
  if(h.daysSince<3)return 80;
  if(h.daysSince<7)return 48;
  if(h.daysSince<14)return 24;
  if(h.daysSince<28)return 8;
  return 0;
}

export function cuisineHistoryV2(history:readonly CookEventV2[],days=30,now=Date.now()){
  const byId=new Map(recipes.map(r=>[r.id,r]));const counts:Record<string,number>={};
  for(const event of history){const age=ageDays(event.at,now),r=byId.get(event.mealId);if(age==null||age>=days||!r)continue;counts[r.cuisine]=(counts[r.cuisine]??0)+1}
  return Object.entries(counts).map(([cuisine,count])=>({cuisine,count})).sort((a,b)=>b.count-a.count||a.cuisine.localeCompare(b.cuisine));
}

export function forgottenFavouritesV2(input:{history:readonly CookEventV2[];favourites?:Readonly<Record<string,boolean>>;ratings?:RatingLike;days?:number;now?:number}){
  const days=input.days??28,summary=recipeHistoryV2(input.history,input.now??Date.now());
  return recipes.filter(r=>{const h=summary[r.id],rating=Math.max(input.ratings?.[r.id]?.josh??0,input.ratings?.[r.id]?.g??0);return (!!input.favourites?.[r.id]||rating>=4)&&(h.daysSince==null||h.daysSince>=days)}).sort((a,b)=>(summary[b.id].daysSince??9999)-(summary[a.id].daysSince??9999)||a.title.localeCompare(b.title));
}

export function mealHistorySummaryV2(input:{history:readonly CookEventV2[];favourites?:Readonly<Record<string,boolean>>;ratings?:RatingLike;now?:number}){
  const now=input.now??Date.now(),recipesById=recipeHistoryV2(input.history,now),recent7=recentRecipeIdsV2(input.history,7,now),recent14=recentRecipeIdsV2(input.history,14,now),recent30=recentRecipeIdsV2(input.history,30,now),cuisines30=cuisineHistoryV2(input.history,30,now),forgotten=forgottenFavouritesV2({...input,now}).map(r=>r.id);
  return {recipes:recipesById,recent7,recent14,recent30,cuisines30,forgottenFavourites:forgotten,totalCookEvents:input.history.length};
}
