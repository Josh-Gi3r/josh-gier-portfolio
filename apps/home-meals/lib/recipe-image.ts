import {normalizeJoshText} from "./josh-conversation";

export type RecipeImageMode="initial"|"replace"|"candidate";
export type RecipeImageActionType="none"|"suggest_generate_recipe_image"|"generate_recipe_image"|"regenerate_recipe_image";
export type RecipeImageAction={type:RecipeImageActionType;lookHint:string|null};
export type WorkingRecipeForImage={title:string;servings?:number|null;ingredients?:{name:string;quantity?:number|null;unit?:string|null}[];method?:string[];notes?:string[]};

export const RECIPE_IMAGE_MODEL=process.env.OPENAI_RECIPE_IMAGE_MODEL?.trim()||"gpt-image-2.5-sunburst";
export const RECIPE_IMAGE_QUALITY=process.env.OPENAI_RECIPE_IMAGE_QUALITY?.trim()||"max";
export const RECIPE_IMAGE_SIZE="1536x1024";
export const RECIPE_IMAGE_FORMAT="webp";

function amount(x:{quantity?:number|null;unit?:string|null}){if(x.quantity==null)return"";return `${x.quantity}${x.unit?` ${x.unit}`:""}`}
export function buildRecipeImagePrompt(recipe:WorkingRecipeForImage,lookHint?:string|null,alternate=false){
 const title=normalizeJoshText(recipe.title).slice(0,180);
 const ingredients=(recipe.ingredients??[]).slice(0,24).map(x=>`${amount(x)} ${normalizeJoshText(x.name)}`.trim()).filter(Boolean);
 const method=(recipe.method??[]).slice(0,10).map(normalizeJoshText).filter(Boolean);
 const notes=(recipe.notes??[]).slice(0,8).map(normalizeJoshText).filter(Boolean);
 const look=lookHint?normalizeJoshText(lookHint).slice(0,240):null;
 return [
  `Create a high-end but believable food photograph for a private home recipe called "${title}".`,
  "This is a generated recipe illustration, not documentary evidence of a real cook.",
  `Recipe ingredients: ${ingredients.join("; ")||"use the dish name and method as the visual source of truth"}.`,
  method.length?`Method cues: ${method.join(" ")}`:"",
  notes.length?`Recipe notes: ${notes.join(" ")}`:"",
  "Show the finished dish accurately. Make the main ingredients visually plausible and consistent with the recipe. Do not add conspicuous ingredients that are not in the recipe.",
  "Natural appetising food photography, warm daylight, realistic texture, home-cooked but beautifully plated, restrained garnish, no excessive styling.",
  "Landscape 3:2 hero composition with the plated food as the clear subject and enough breathing room for responsive card crops.",
  "No text, labels, typography, logos, packaging, people or hands.",
  alternate?"Use a clearly different composition and camera angle from a typical first hero image while preserving the exact dish identity.":"",
  look?`Requested visual direction: ${look}.`:""
 ].filter(Boolean).join("\n");
}
