import {livePhase2RecipeIdsV7} from "./phase2-promotion-registry-v7";

/**
 * Final hero-image registry for promoted Phase 2 recipes.
 * Keep empty until an actual dish-faithful asset exists; a recipe cannot be live without one.
 */
export const phase2RecipeAssetsV7:Readonly<Record<string,string>>={};
export function getPhase2RecipeAssetV7(recipeId:string){return phase2RecipeAssetsV7[recipeId]}
export function validatePhase2RecipeAssetsV7(){const errors:string[]=[];for(const id of livePhase2RecipeIdsV7){const url=phase2RecipeAssetsV7[id];if(!url)errors.push(`${id}: live recipe has no hero image`);else if(!/^https:\/\//.test(url)&&!url.startsWith("/"))errors.push(`${id}: invalid hero image URL`)}return{valid:errors.length===0,errors,liveRequired:livePhase2RecipeIdsV7.length,assets:Object.keys(phase2RecipeAssetsV7).length}}
