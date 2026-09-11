import { getComponent, getIngredient, getRecipe, type IngredientRequirement } from "./home-data";

export type PrepDemand={id:string;neededMl:number;neededPortions:number};
export type PrepNeed={id:string;neededMl:number;onHandMl:number;shortMl:number;needed:number;onHand:number;short:number;batches:number};

export function prepDemandForWeekMl(week:string[]):PrepDemand[]{
 const map=new Map<string,{neededMl:number;neededPortions:number}>();
 for(const recipeId of week){const recipe=getRecipe(recipeId);if(!recipe)continue;for(const req of recipe.prep){const cur=map.get(req.id)??{neededMl:0,neededPortions:0};cur.neededMl+=req.totalMl;cur.neededPortions+=req.portions;map.set(req.id,cur)}}
 return [...map].map(([id,v])=>({id,...v}));
}

export function prepNeedsForWeekMl(week:string[],stockMl:Record<string,number>):PrepNeed[]{
 return prepDemandForWeekMl(week).map(d=>{
  const component=getComponent(d.id);const standard=Math.max(1,component?.portionMl??1);const batchMl=standard*Math.max(1,component?.batchYield??1);const onHandMl=Math.max(0,stockMl[d.id]??0);const shortMl=Math.max(0,d.neededMl-onHandMl);
  return {id:d.id,neededMl:d.neededMl,onHandMl,shortMl,needed:d.neededPortions,onHand:Math.floor(onHandMl/standard),short:Math.ceil(shortMl/standard),batches:shortMl?Math.ceil(shortMl/batchMl):0};
 }).filter(x=>x.shortMl>0);
}

export function batchOutputMl(id:string){const c=getComponent(id);return c?c.portionMl*c.batchYield:0}
export function componentConsumptionMl(recipeId:string){const recipe=getRecipe(recipeId);return recipe?.prep.map(x=>({id:x.id,ml:x.totalMl}))??[]}
export function ingredientConsumptionExact(recipeId:string):IngredientRequirement[]{return getRecipe(recipeId)?.ingredients??[]}
export function stockPortions(id:string,stockMl:Record<string,number>){const c=getComponent(id);if(!c)return 0;return stockMl[id]?Math.floor(stockMl[id]/Math.max(1,c.portionMl)):0}
export function formatStock(id:string,stockMl:Record<string,number>){const c=getComponent(id);const ml=Math.max(0,stockMl[id]??0);if(!c)return `${ml} ml`;const portions=stockPortions(id,stockMl);return portions>0?`${portions} ${portions===1?"portion":"portions"} · ${ml} ml`:`${ml} ml`}

export function ingredientRequirementMissing(req:IngredientRequirement,stock:Record<string,number>){const def=getIngredient(req.id);const onHand=Math.max(0,stock[req.id]??0);return def?.tracking==="state"?onHand<=0:onHand<req.qty}
export function recipeAvailability(recipeId:string,componentStock:Record<string,number>,ingredientStock:Record<string,number>){const recipe=getRecipe(recipeId);const missingPrep=recipe?.prep.filter(x=>(componentStock[x.id]??0)<x.totalMl)??[];const missingIngredients=recipe?.ingredients.filter(x=>ingredientRequirementMissing(x,ingredientStock))??[];return{ready:!!recipe&&missingPrep.length===0&&missingIngredients.length===0,missingPrep,missingIngredients}}
