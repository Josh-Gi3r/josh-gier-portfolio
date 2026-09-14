import { addQuantity, quantity, shortfallQuantity, subtractQuantity, type Quantity } from "./food-quantity";
import { getDinnerFormulationV2, type RecipeIngredientV2 } from "./recipe-formulations-v2";
import { getRecipeVariantV2 } from "./recipe-variants-v2";
import { canonicalIngredientKeyV7, getCanonicalIngredientV7 } from "./ingredient-catalog-v7";
import { getPhase2LiveRuntimeV7 } from "./phase2-runtime-v7";
import { DEFAULT_COOK_SERVINGS_V4, scaleReferenceIngredientsToCookServingsV4, type SupportedCookServingsV4 } from "./household-serving-policy-v4";

export type IngredientStockV2=Readonly<Record<string,Quantity>>;
export type QualitativeIngredientStockV2=Readonly<Record<string,number>>;
export type PlannedRecipeV2=Readonly<{recipeId:string;variantId?:string;servings?:SupportedCookServingsV4}>;

/** Runtime ingredient truth. Original v2 formulations are two-serving provenance; promoted Phase 2 V7 formulations are locked at four servings. */
export function ingredientsForRecipeV2(recipeId:string,variantId?:string,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):readonly RecipeIngredientV2[]{
  const promoted=getPhase2LiveRuntimeV7(recipeId,servings);if(promoted){if(variantId)throw new Error(`Variants are not yet defined for promoted recipe ${recipeId}`);return promoted.ingredients}
  const base=getDinnerFormulationV2(recipeId);if(!base)throw new Error(`Unknown dinner formulation ${recipeId}`);
  let reference:readonly RecipeIngredientV2[];
  if(!variantId)reference=base.ingredients;
  else{
    const variant=getRecipeVariantV2(variantId);if(!variant||variant.baseRecipeId!==recipeId)throw new Error(`Variant ${variantId} does not belong to ${recipeId}`);
    const removed=new Set(variant.removeIngredientIds);const map=new Map(base.ingredients.filter(x=>!removed.has(x.ingredientId)).map(x=>[x.ingredientId,x]));
    for(const change of variant.upsertIngredients)map.set(change.ingredientId,{...change,optional:false});reference=[...map.values()];
  }
  return scaleReferenceIngredientsToCookServingsV4(reference,servings) as RecipeIngredientV2[];
}

export function ingredientDemandForPlanV2(plan:readonly PlannedRecipeV2[]){
  const demand=new Map<string,Quantity>();
  for(const item of plan)for(const ingredient of ingredientsForRecipeV2(item.recipeId,item.variantId,item.servings??DEFAULT_COOK_SERVINGS_V4)){
    if(ingredient.optional||ingredient.ingredientId==="water")continue;
    const key=canonicalIngredientKeyV7(ingredient.ingredientId,ingredient.unit);const def=getCanonicalIngredientV7(key);if(!def)throw new Error(`Unknown canonical ingredient ${key}`);
    const value=quantity(ingredient.qty,ingredient.unit);const current=demand.get(key)??quantity(0,def.canonicalUnit);demand.set(key,addQuantity(current,value));
  }
  return [...demand].map(([ingredientId,required])=>({ingredientId,required}));
}

function stockValue(stock:IngredientStockV2,ingredientId:string):Quantity{const def=getCanonicalIngredientV7(ingredientId);if(!def)throw new Error(`Unknown canonical ingredient ${ingredientId}`);const value=stock[ingredientId]??quantity(0,def.canonicalUnit);if(value.unit!==def.canonicalUnit)throw new Error(`Ingredient stock unit mismatch for ${ingredientId}: ${value.unit} vs ${def.canonicalUnit}`);return value}
const qualitativeLevel=(stock:QualitativeIngredientStockV2|undefined,id:string)=>Math.max(0,Math.min(3,Number(stock?.[id]??0)));

/** Qualitative pantry stock deliberately means only Out / Low / Some / Plenty. It is never converted into fake ml or grams. */
export function shoppingNeedsForPlanV2(plan:readonly PlannedRecipeV2[],stock:IngredientStockV2,qualitative?:QualitativeIngredientStockV2){
  return ingredientDemandForPlanV2(plan).map(({ingredientId,required})=>{const onHand=stockValue(stock,ingredientId);return{ingredientId,required,onHand,shortfall:shortfallQuantity(required,onHand),qualitativeLevel:qualitativeLevel(qualitative,ingredientId)}}).filter(x=>x.shortfall.qty>0&&x.qualitativeLevel<2)
}

export function ingredientAvailabilityForRecipeV2(recipeId:string,stock:IngredientStockV2,variantId?:string,qualitative?:QualitativeIngredientStockV2,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4){
  const missing=ingredientsForRecipeV2(recipeId,variantId,servings).filter(x=>!x.optional&&x.ingredientId!=="water").map(x=>{const key=canonicalIngredientKeyV7(x.ingredientId,x.unit);const required=quantity(x.qty,x.unit);const onHand=stockValue(stock,key);const shortfall=shortfallQuantity(required,onHand);return{ingredientId:key,required,onHand,shortfall,qualitativeLevel:qualitativeLevel(qualitative,key)}}).filter(x=>x.shortfall.qty>0&&x.qualitativeLevel<=0);return{ready:missing.length===0,missing};
}

export function consumeRecipeIngredientsV2(recipeId:string,stock:IngredientStockV2,variantId?:string,qualitative?:QualitativeIngredientStockV2,servings:SupportedCookServingsV4=DEFAULT_COOK_SERVINGS_V4):IngredientStockV2{
  const availability=ingredientAvailabilityForRecipeV2(recipeId,stock,variantId,qualitative,servings);if(!availability.ready)throw new Error(`Insufficient ingredient stock for ${recipeId}`);const next:Record<string,Quantity>={...stock};
  for(const ingredient of ingredientsForRecipeV2(recipeId,variantId,servings)){
    if(ingredient.optional||ingredient.ingredientId==="water")continue;
    const key=canonicalIngredientKeyV7(ingredient.ingredientId,ingredient.unit);const required=quantity(ingredient.qty,ingredient.unit);const onHand=stockValue(next,key);
    if(onHand.qty>=required.qty)next[key]=subtractQuantity(onHand,required);
    else if(qualitativeLevel(qualitative,key)>0)continue;
    else throw new Error(`Insufficient ingredient stock for ${recipeId}/${key}`);
  }
  return next;
}
export function emptyIngredientStockV2():IngredientStockV2{return{}}
