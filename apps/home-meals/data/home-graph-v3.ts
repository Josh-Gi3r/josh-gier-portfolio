// Transitional UI adapter. All data comes from home-data.ts; there is no second recipe/inventory source here.
import {
 boosters, componentConsumption, coverageByMother, defaultWeek, getComponent, getIngredient, getMeal as getCanonicalMeal,
 getMid, getMother, ingredientConsumption, ingredients, initialComponentStock, initialIngredientStock, midBases, midsByCuisine,
 motherBases, prepDemandForWeek, prepNeedsForWeek, recipes, shoppingNeedsForWeek, totalDinnerDirections,
 type CanonicalRecipe, type IngredientDef, type IngredientRequirement, type IngredientUnit, type MidBase, type MotherBase
} from "./home-data";

export type Requirement=IngredientRequirement;
export type Meal=Omit<CanonicalRecipe,"status">&{status:"approved"};
export type {IngredientDef,IngredientUnit,MidBase,MotherBase};
export {motherBases,midBases,boosters,ingredients,defaultWeek,initialComponentStock,initialIngredientStock,midsByCuisine,totalDinnerDirections,coverageByMother,prepDemandForWeek,prepNeedsForWeek,shoppingNeedsForWeek,componentConsumption,ingredientConsumption,getComponent,getIngredient,getMother,getMid};

export const meals:Meal[]=recipes.map(({status:_status,...r})=>({...r,status:"approved" as const}));
export const getMeal=(id:string)=>meals.find(x=>x.id===id)!;
