// Household-facing nutrition is intentionally blank until the v2 nutrition engine can
// derive it from authoritative ingredient bindings plus measured prep-component yield.
// Do not replace this with recipe-blog estimates or design placeholder numbers.
export type RecipeNutrition={kcal:number;protein:number};
export const recipeNutrition:Record<string,RecipeNutrition>={};
export const nutritionFor=(_id:string):RecipeNutrition|undefined=>undefined;
