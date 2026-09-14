import {recipes as existingRecipes,type Recipe} from "./home-data";
import {getPhase2LiveCandidateV7} from "./phase2-live-candidates-v7";
import {livePhase2RecipeIdsV7} from "./phase2-promotion-registry-v7";
import {getPhase2RecipeAssetV7} from "./phase2-recipe-assets-v7";

const clean=(s:string)=>s.replace(/[-_]/g," ").replace(/\s+/g," ").trim();
const titleCase=(s:string)=>clean(s).replace(/\b\w/g,c=>c.toUpperCase());
function toDisplayRecipeV7(recipeId:string):Recipe{
  const c=getPhase2LiveCandidateV7(recipeId),image=getPhase2RecipeAssetV7(recipeId);if(!c)throw new Error(`Missing V7 live candidate ${recipeId}`);if(!image)throw new Error(`Missing V7 live recipe image ${recipeId}`);
  const format=titleCase(c.format),occasion=titleCase(c.occasion),weight=titleCase(c.mealWeight);
  return{id:c.id,title:c.title,subtitle:`${c.cuisine} · ${format}`,why:`A ${clean(c.mealWeight)} ${clean(c.format)} built for our normal four-serving cook.`,balance:`${weight} · ${occasion}`,servings:4,time:c.referenceMinutes,image,tags:[c.cuisine,c.occasion,c.format,c.mealWeight].map(clean),source:c.evidence[0]?.url??""};
}

export const livePhase2DisplayRecipesV7:readonly Recipe[]=livePhase2RecipeIdsV7.map(toDisplayRecipeV7);
export const allLiveRecipesV7:readonly Recipe[]=[...existingRecipes,...livePhase2DisplayRecipesV7];
export const liveRecipeByIdV7=new Map(allLiveRecipesV7.map(x=>[x.id,x]));
export function getLiveRecipeV7(id:string){return liveRecipeByIdV7.get(id)}
export function validateLiveRecipeCatalogV7(){const errors:string[]=[];const ids=new Set<string>();for(const recipe of allLiveRecipesV7){if(ids.has(recipe.id))errors.push(`Duplicate live recipe ${recipe.id}`);ids.add(recipe.id);if(!recipe.title||!recipe.image)errors.push(`${recipe.id}: incomplete display recipe`)}if(allLiveRecipesV7.length!==36+livePhase2RecipeIdsV7.length)errors.push(`Live catalogue count ${allLiveRecipesV7.length} != 36 + ${livePhase2RecipeIdsV7.length}`);return{valid:errors.length===0,errors,total:allLiveRecipesV7.length,phase2:livePhase2DisplayRecipesV7.length}}
