import { boosters, getComponent, getIngredient, getRecipe, ingredients, midBases, motherBases, recipes, type CanonicalRecipe } from "./home-model";
import { midsByCuisine } from "./home-graph-v3";

const motherSet=new Set(motherBases.map(x=>x.id));
const midSet=new Set(midBases.map(x=>x.id));
const boosterSet=new Set(boosters.map(x=>x.id));

export type UIMeal=CanonicalRecipe&{
 motherIds:string[];
 midIds:string[];
 boosterIds:string[];
 status:"approved";
};

export const meals:UIMeal[]=recipes.map(recipe=>({
 ...recipe,
 motherIds:recipe.prep.filter(x=>motherSet.has(x.id)).map(x=>x.id),
 midIds:recipe.prep.filter(x=>midSet.has(x.id)).map(x=>x.id),
 boosterIds:recipe.prep.filter(x=>boosterSet.has(x.id)).map(x=>x.id),
 status:"approved"
}));

export const getMeal=(id:string)=>meals.find(x=>x.id===id)!;
export { motherBases, midBases, boosters, ingredients, getIngredient, getComponent, getRecipe, midsByCuisine };
export const getMother=(id:string)=>motherBases.find(x=>x.id===id);
export const getMid=(id:string)=>midBases.find(x=>x.id===id);
export const coverageByMother=motherBases.map(mother=>({
 mother,
 mids:midBases.filter(mid=>mid.parentMotherIds.includes(mother.id)),
 meals:meals.filter(meal=>meal.motherIds.includes(mother.id))
}));
export const totalDinnerDirections=150;
