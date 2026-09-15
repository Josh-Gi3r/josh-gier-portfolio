import {getRuntimeDinnerFormulationV4,type RuntimeDinnerFormulationV4} from "./runtime-dinner-v4";
import type {SupportedCookServingsV4} from "./household-serving-policy-v4";
import {quantity} from "./food-quantity";

function q(n:number,servings:SupportedCookServingsV4){return servings===4?n:Math.round(n*.75*2)/2}
export function getOriginalRuntimeDinnerV8(recipeId:string,servings:SupportedCookServingsV4=4):RuntimeDinnerFormulationV4|undefined{
 const base=getRuntimeDinnerFormulationV4(recipeId,servings);if(!base||recipeId!=="massaman-beef")return base;
 return{...base,ingredients:[
  {ingredientId:"beef-chuck",name:"Beef chuck, 4 cm cubes",qty:q(700,servings),unit:"g",basis:"raw"},
  {ingredientId:"coconut-milk",name:"Coconut milk",qty:q(400,servings),unit:"ml",basis:"prepared"},
  {ingredientId:"water",name:"Water / low-sodium beef stock",qty:q(500,servings),unit:"ml",basis:"raw"},
  {ingredientId:"potato",name:"Potatoes",qty:q(400,servings),unit:"g",basis:"raw"},
  {ingredientId:"onion-yellow",name:"Onion",qty:q(200,servings),unit:"g",basis:"raw"},
  {ingredientId:"peanuts",name:"Roasted peanuts",qty:q(40,servings),unit:"g",basis:"raw"},
  {ingredientId:"tamarind",name:"Tamarind",qty:q(16,servings),unit:"ml",basis:"prepared"},
  {ingredientId:"fish-sauce",name:"Fish sauce",qty:q(24,servings),unit:"ml",basis:"prepared"},
  {ingredientId:"palm-sugar",name:"Palm sugar",qty:q(16,servings),unit:"g",basis:"raw"},
  {ingredientId:"jasmine-rice-dry",name:"Jasmine rice",qty:q(240,servings),unit:"g",basis:"dry"},
 ],prep:base.prep.map(x=>({componentId:x.componentId,quantity:quantity(x.quantity.qty,x.quantity.unit)}))};
}
