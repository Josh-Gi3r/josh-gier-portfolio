import { addQuantity, quantity, shortfallQuantity, subtractQuantity, type Quantity } from "./food-quantity";
import { getDinnerFormulationV2, type RecipeIngredientV2 } from "./recipe-formulations-v2";
import { getRecipeVariantV2 } from "./recipe-variants-v2";
import { canonicalIngredientKeyV2, getCanonicalIngredientV2 } from "./ingredient-catalog-v2";

export type IngredientStockV2=Readonly<Record<string,Quantity>>;
export type PlannedRecipeV2=Readonly<{recipeId:string;variantId?:string}>;

export function ingredientsForRecipeV2(recipeId:string,variantId?:string):readonly RecipeIngredientV2[]{
  const base=getDinnerFormulationV2(recipeId);if(!base)throw new Error(`Unknown dinner formulation ${recipeId}`);
  if(!variantId)return base.ingredients;
  const variant=getRecipeVariantV2(variantId);if(!variant||variant.baseRecipeId!==recipeId)throw new Error(`Variant ${variantId} does not belong to ${recipeId}`);
  const removed=new Set(variant.removeIngredientIds);const map=new Map(base.ingredients.filter(x=>!removed.has(x.ingredientId)).map(x=>[x.ingredientId,x]));
  for(const change of variant.upsertIngredients)map.set(change.ingredientId,{...change,optional:false});return [...map.values()];
}

export function ingredientDemandForPlanV2(plan:readonly PlannedRecipeV2[]){
  const demand=new Map<string,Quantity>();
  for(const item of plan)for(const ingredient of ingredientsForRecipeV2(item.recipeId,item.variantId)){
    if(ingredient.optional||ingredient.ingredientId==="water")continue;
    const key=canonicalIngredientKeyV2(ingredient.ingredientId,ingredient.unit);const def=getCanonicalIngredientV2(key);if(!def)throw new Error(`Unknown canonical ingredient ${key}`);
    const value=quantity(ingredient.qty,ingredient.unit);const current=demand.get(key)??quantity(0,def.canonicalUnit);demand.set(key,addQuantity(current,value));
  }
  return [...demand].map(([ingredientId,required])=>({ingredientId,required}));
}

function stockValue(stock:IngredientStockV2,ingredientId:string):Quantity{const def=getCanonicalIngredientV2(ingredientId);if(!def)throw new Error(`Unknown canonical ingredient ${ingredientId}`);const value=stock[ingredientId]??quantity(0,def.canonicalUnit);if(value.unit!==def.canonicalUnit)throw new Error(`Ingredient stock unit mismatch for ${ingredientId}: ${value.unit} vs ${def.canonicalUnit}`);return value}

export function shoppingNeedsForPlanV2(plan:readonly PlannedRecipeV2[],stock:IngredientStockV2){return ingredientDemandForPlanV2(plan).map(({ingredientId,required})=>{const onHand=stockValue(stock,ingredientId);return{ingredientId,required,onHand,shortfall:shortfallQuantity(required,onHand)}}).filter(x=>x.shortfall.qty>0)}

export function ingredientAvailabilityForRecipeV2(recipeId:string,stock:IngredientStockV2,variantId?:string){
  const missing=ingredientsForRecipeV2(recipeId,variantId).filter(x=>!x.optional&&x.ingredientId!=="water").map(x=>{const key=canonicalIngredientKeyV2(x.ingredientId,x.unit);const required=quantity(x.qty,x.unit);const onHand=stockValue(stock,key);return{ingredientId:key,required,onHand,shortfall:shortfallQuantity(required,onHand)}}).filter(x=>x.shortfall.qty>0);return{ready:missing.length===0,missing};
}

export function consumeRecipeIngredientsV2(recipeId:string,stock:IngredientStockV2,variantId?:string):IngredientStockV2{
  const availability=ingredientAvailabilityForRecipeV2(recipeId,stock,variantId);if(!availability.ready)throw new Error(`Insufficient ingredient stock for ${recipeId}`);const next:Record<string,Quantity>={...stock};
  for(const ingredient of ingredientsForRecipeV2(recipeId,variantId)){if(ingredient.optional||ingredient.ingredientId==="water")continue;const key=canonicalIngredientKeyV2(ingredient.ingredientId,ingredient.unit);const onHand=stockValue(next,key);next[key]=subtractQuantity(onHand,quantity(ingredient.qty,ingredient.unit))}return next;
}
export function emptyIngredientStockV2():IngredientStockV2{return{}}
