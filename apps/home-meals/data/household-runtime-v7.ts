import {quantity,type Quantity} from "./food-quantity";
import {getCanonicalIngredientV7} from "./ingredient-catalog-v7";
import {ingredientAvailabilityForRecipeV7,consumeRecipeIngredientsV7} from "./ingredient-engine-v7";
import {prepForRecipeAtCookScaleV7} from "./food-engine-v7";
import {consumeComponentV12,type HouseholdStateV12} from "./household-v12";

/** Household-state operations that admit promoted V7 recipes without changing the persisted v12 schema. */
export function setIngredientStockV7(state:HouseholdStateV12,ingredientId:string,observed:Quantity):HouseholdStateV12{
  const ingredient=getCanonicalIngredientV7(ingredientId);if(!ingredient)throw new Error(`Unknown ingredient: ${ingredientId}`);if(observed.qty<0)throw new Error(`Ingredient stock cannot be negative for ${ingredientId}`);if(observed.unit!==ingredient.canonicalUnit)throw new Error(`Ingredient stock unit mismatch for ${ingredientId}`);return{...state,ingredientStock:{...state.ingredientStock,[ingredientId]:observed},kitchenReady:true};
}
export function consumeRecipePrepStateV7(state:HouseholdStateV12,recipeId:string):HouseholdStateV12{let next=state;for(const requirement of prepForRecipeAtCookScaleV7(recipeId))next=consumeComponentV12(next,requirement.componentId,requirement.quantity);return next}
export function cookRecipeStateV7(state:HouseholdStateV12,recipeId:string,variantId?:string,at=new Date().toISOString()):HouseholdStateV12{
  const qualitative=state.qualitativeIngredientStock??{},availability=ingredientAvailabilityForRecipeV7(recipeId,state.ingredientStock,variantId,qualitative);if(!availability.ready)throw new Error(`Insufficient ingredient stock for ${recipeId}`);
  const afterPrep=consumeRecipePrepStateV7(state,recipeId),ingredientStock=consumeRecipeIngredientsV7(recipeId,afterPrep.ingredientStock,variantId,qualitative);return{...afterPrep,ingredientStock,history:[{mealId:recipeId,variantId,at},...afterPrep.history].slice(0,100),kitchenReady:true};
}
export function ingredientStockObservedV7(state:HouseholdStateV12,ingredientId:string,qty:number,unit:Quantity["unit"]){return setIngredientStockV7(state,ingredientId,quantity(qty,unit))}
