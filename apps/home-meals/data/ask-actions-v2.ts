import { quantity } from "./food-quantity";
import { getCanonicalIngredientV2 } from "./ingredient-catalog-v2";
import { getCanonicalPrepV2 } from "./food-truth-v2";
import { setIngredientStockV12, setManualComponentStockV12, type HouseholdStateV12, type RecipeNoteV12 } from "./household-v12";
import { getCanonicalRecipeV2 } from "./recipe-truth-v2";

export type AskMutationV2=Readonly<{
 type:"none"|"set_day"|"set_ingredient"|"set_component"|"set_use_soon"|"add_note"|"set_favourite";
 dayIndex:number|null;mealId:string|null;ingredientId:string|null;componentId:string|null;quantity:number|null;value:boolean|null;note:string|null;author:"josh"|"g"|"home"|null;
}>;

/** Apply only after the UI has explicitly confirmed the proposed mutation. */
export function applyConfirmedAskMutationV2(state:HouseholdStateV12,mutation:AskMutationV2):HouseholdStateV12{
 if(mutation.type==="none")return state;
 if(mutation.type==="set_day"){
  if(mutation.dayIndex==null||mutation.dayIndex<0||mutation.dayIndex>6||!mutation.mealId||!getCanonicalRecipeV2(mutation.mealId))throw new Error("Invalid set_day mutation");
  return {...state,week:state.week.map((id,index)=>index===mutation.dayIndex?mutation.mealId!:id),groceryChecked:{}};
 }
 if(mutation.type==="set_ingredient"){
  if(!mutation.ingredientId||mutation.quantity==null)throw new Error("Invalid set_ingredient mutation");const ingredient=getCanonicalIngredientV2(mutation.ingredientId);if(!ingredient)throw new Error("Unknown ingredient mutation");
  return setIngredientStockV12(state,ingredient.id,quantity(mutation.quantity,ingredient.canonicalUnit));
 }
 if(mutation.type==="set_component"){
  if(!mutation.componentId||mutation.quantity==null)throw new Error("Invalid set_component mutation");const component=getCanonicalPrepV2(mutation.componentId);if(!component)throw new Error("Unknown component mutation");
  return setManualComponentStockV12(state,component.id,quantity(mutation.quantity,component.workingUnit.unit));
 }
 if(mutation.type==="set_use_soon"){
  if(!mutation.ingredientId||mutation.value==null||!getCanonicalIngredientV2(mutation.ingredientId))throw new Error("Invalid set_use_soon mutation");const useSoon={...state.useSoon,[mutation.ingredientId]:mutation.value},useSoonAt={...state.useSoonAt};if(mutation.value)useSoonAt[mutation.ingredientId]=new Date().toISOString();else delete useSoonAt[mutation.ingredientId];return{...state,useSoon,useSoonAt};
 }
 if(mutation.type==="add_note"){
  if(!mutation.mealId||!mutation.note||!getCanonicalRecipeV2(mutation.mealId))throw new Error("Invalid add_note mutation");const note:RecipeNoteV12={author:mutation.author??"home",text:mutation.note.trim().slice(0,500),at:new Date().toISOString()};return{...state,recipeNotes:{...state.recipeNotes,[mutation.mealId]:[note,...(state.recipeNotes[mutation.mealId]??[])].slice(0,20)}};
 }
 if(mutation.type==="set_favourite"){
  if(!mutation.mealId||mutation.value==null||!getCanonicalRecipeV2(mutation.mealId))throw new Error("Invalid set_favourite mutation");return{...state,favourites:{...state.favourites,[mutation.mealId]:mutation.value}};
 }
 return state;
}
