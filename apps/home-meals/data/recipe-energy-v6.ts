import {getRuntimeDinnerFormulationV4} from "./runtime-dinner-v4";
import {canonicalRecipesV2} from "./recipe-truth-v2";
import {phase2ResearchRecipesV5} from "./phase2-research-registry-v5";
import {ingredientReferenceKcalV6,type EnergyConfidenceV6,type EnergyIngredientLikeV6} from "./ingredient-energy-v6";
import {prepEnergyReferenceV6,prepReferenceKcalV6} from "./prep-energy-v6";
import {quantity,type QuantityUnit} from "./food-quantity";

export type MealWeightV6="light"|"balanced"|"hearty"|"rich";
export type RecipeEnergyReferenceV6=Readonly<{
  recipeId:string;
  totalKcal:number;
  kcalPerPerson:number;
  servings:number;
  uncertaintyPct:number;
  mealWeight:MealWeightV6;
  status:"reference_estimate";
  confidence:"B"|"C"|"D";
  methodology:"ingredient_composition_plus_prep_proxy";
  optionalIngredientsExcluded:number;
  processAdjustmentKcal:number;
  ingredientKcal:number;
  prepKcal:number;
  unresolvedIngredientIds:readonly string[];
  unresolvedPrepIds:readonly string[];
}>;

type NormalIngredient=EnergyIngredientLikeV6&Readonly<{ingredientId?:string;id?:string}>;
type NormalPrep=Readonly<{componentId:string;qty:number;unit:QuantityUnit}>;
const deepFryIds=new Set(["falafel-bowl","chicken-karaage","katsu-curry","salt-pepper-prawns"]);
const shallowFryIds=new Set(["chicken-parmigiana"]);

function weightFor(k:number):MealWeightV6{return k<=500?"light":k<=700?"balanced":k<=900?"hearty":"rich"}
function confidenceRank(c:EnergyConfidenceV6|"B"|"C"|"D"){
 const s=String(c);return s.startsWith("D")?3:s.startsWith("C")?2:1;
}
function adjustIngredientKcal(recipeId:string,row:NormalIngredient,kcal:number){
 const s=`${row.ingredientId??row.id??""} ${row.name} ${row.note??""}`.toLowerCase();
 if(/oil/.test(s)&&/not all|fry|frying|shallow/.test(s)){
   const factor=deepFryIds.has(recipeId)?0.15:shallowFryIds.has(recipeId)?0.25:0.2;
   return kcal*factor;
 }
 if(/\b(white wine|red wine|shaoxing|sake)\b/.test(s))return kcal*0.6;
 return kcal;
}

export function estimateRecipeEnergyV6(args:{recipeId:string;servings:number;ingredients:readonly NormalIngredient[];prep:readonly NormalPrep[]}):RecipeEnergyReferenceV6{
 let ingredientKcal=0,prepKcal=0,rawIngredientKcal=0,optionalIngredientsExcluded=0,worst=1;
 const unresolvedIngredientIds:string[]=[],unresolvedPrepIds:string[]=[];
 for(const row of args.ingredients){
   const result=ingredientReferenceKcalV6(row);if(result.excludedOptional){optionalIngredientsExcluded++;continue}
   if(result.kcal==null||!result.reference){unresolvedIngredientIds.push(row.ingredientId??row.id??row.name);continue}
   rawIngredientKcal+=result.kcal;ingredientKcal+=adjustIngredientKcal(args.recipeId,row,result.kcal);worst=Math.max(worst,confidenceRank(result.reference.confidence));
 }
 for(const p of args.prep){const ref=prepEnergyReferenceV6(p.componentId),k=prepReferenceKcalV6(p.componentId,quantity(p.qty,p.unit));if(!ref||k==null){unresolvedPrepIds.push(p.componentId);continue}prepKcal+=k;worst=Math.max(worst,ref.confidence==="D"?3:ref.confidence==="C"?2:1)}
 const total=Math.max(0,ingredientKcal+prepKcal),servings=Math.max(1,args.servings),per=total/servings,confidence=worst>=3?"D":worst===2?"C":"B",uncertaintyPct=confidence==="D"?25:confidence==="C"?18:12;
 return{recipeId:args.recipeId,totalKcal:Math.round(total),kcalPerPerson:Math.round(per/5)*5,servings,uncertaintyPct,mealWeight:weightFor(per),status:"reference_estimate",confidence,methodology:"ingredient_composition_plus_prep_proxy",optionalIngredientsExcluded,processAdjustmentKcal:Math.round((ingredientKcal-rawIngredientKcal)*10)/10,ingredientKcal:Math.round(ingredientKcal),prepKcal:Math.round(prepKcal),unresolvedIngredientIds,unresolvedPrepIds};
}

function liveReference(recipeId:string){const f=getRuntimeDinnerFormulationV4(recipeId);if(!f)return null;return estimateRecipeEnergyV6({recipeId,servings:f.targetServings,ingredients:f.ingredients.map(x=>({ingredientId:x.ingredientId,name:x.name,qty:x.qty,unit:x.unit,optional:x.optional})),prep:f.prep.map(x=>({componentId:x.componentId,qty:x.quantity.qty,unit:x.quantity.unit}))})}
export const liveRecipeEnergyReferencesV6=Object.fromEntries(canonicalRecipesV2.map(r=>[r.id,liveReference(r.id)]).filter((x):x is [string,RecipeEnergyReferenceV6]=>!!x[1]));

export const phase2RecipeEnergyReferencesV6=Object.fromEntries(phase2ResearchRecipesV5.map(r=>[r.id,estimateRecipeEnergyV6({recipeId:r.id,servings:r.targetServings,ingredients:r.ingredients.map(x=>({id:x.id,name:x.name,qty:x.qty,unit:x.unit,optional:x.optional,basis:x.basis,note:x.note})),prep:r.prep.map(x=>({componentId:x.componentId,qty:x.qty,unit:x.unit}))})]));

export const allRecipeEnergyReferencesV6:Readonly<Record<string,RecipeEnergyReferenceV6>>={...liveRecipeEnergyReferencesV6,...phase2RecipeEnergyReferencesV6};
export function recipeEnergyReferenceV6(recipeId:string){return allRecipeEnergyReferencesV6[recipeId]}

export function validateRecipeEnergyReferencesV6(){
 const errors:string[]=[];const ids=Object.keys(allRecipeEnergyReferencesV6);if(Object.keys(liveRecipeEnergyReferencesV6).length!==36)errors.push(`Expected 36 live energy references, found ${Object.keys(liveRecipeEnergyReferencesV6).length}`);if(Object.keys(phase2RecipeEnergyReferencesV6).length!==100)errors.push(`Expected 100 Phase 2 energy references, found ${Object.keys(phase2RecipeEnergyReferencesV6).length}`);if(ids.length!==136)errors.push(`Expected 136 total energy references, found ${ids.length}`);
 for(const r of Object.values(allRecipeEnergyReferencesV6)){if(r.unresolvedIngredientIds.length)errors.push(`${r.recipeId} unresolved ingredients: ${r.unresolvedIngredientIds.join(",")}`);if(r.unresolvedPrepIds.length)errors.push(`${r.recipeId} unresolved prep: ${r.unresolvedPrepIds.join(",")}`);if(!(r.kcalPerPerson>0))errors.push(`${r.recipeId} invalid kcal/person`);if(r.servings!==4)errors.push(`${r.recipeId} is not calculated over four servings`)}
 return{valid:errors.length===0,errors};
}
