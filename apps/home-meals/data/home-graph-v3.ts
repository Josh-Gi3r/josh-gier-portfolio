// Transitional UI adapter. All data comes from home-data.ts; there is no second recipe/inventory source here.
import {
 boosters, componentConsumption, coverageByMother, defaultWeek, getComponent, getMid, getMother,
 ingredientConsumption, ingredients as canonicalIngredients, initialComponentStock, initialIngredientStock, midBases, midsByCuisine,
 motherBases, prepDemandForWeek, prepNeedsForWeek, recipes, shoppingNeedsForWeek, totalDinnerDirections,
 type CanonicalRecipe, type IngredientRequirement, type IngredientUnit, type MidBase, type MotherBase
} from "./home-data";

export type Requirement=IngredientRequirement;
export type Meal=Omit<CanonicalRecipe,"status">&{status:"approved"|"placeholder"};
export type IngredientDef=(typeof canonicalIngredients)[number]&{defaultUnit:IngredientUnit};
export type {IngredientUnit,MidBase,MotherBase};

export const ingredients:IngredientDef[]=canonicalIngredients.map(x=>({...x,defaultUnit:x.unit}));
export const getIngredient=(id:string)=>ingredients.find(x=>x.id===id)!;
export {motherBases,midBases,boosters,defaultWeek,initialComponentStock,initialIngredientStock,midsByCuisine,totalDinnerDirections,coverageByMother,prepDemandForWeek,prepNeedsForWeek,shoppingNeedsForWeek,componentConsumption,ingredientConsumption,getComponent,getMother,getMid};

export const meals:Meal[]=recipes.map(({status:_status,...r})=>({...r,status:"approved" as const}));
export const getMeal=(id:string)=>meals.find(x=>x.id===id)!;
