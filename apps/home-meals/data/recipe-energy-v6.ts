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
type FallbackReference=Readonly<{unit:QuantityUnit;kcalPerUnit:number;confidence:EnergyConfidenceV6;source:string;note:string}>;
const deepFryIds=new Set(["falafel-bowl","chicken-karaage","katsu-curry","salt-pepper-prawns"]);
const shallowFryIds=new Set(["chicken-parmigiana"]);
const FALLBACK_SOURCE="V6 explicit generic-food / packaged-food proxy for a recipe identity not covered by the broad resolver; exact household labels supersede where applicable";
const F=(unit:QuantityUnit,kcalPerUnit:number,note:string,confidence:EnergyConfidenceV6="D_ANALOGUE_PROXY"):FallbackReference=>({unit,kcalPerUnit,confidence,source:FALLBACK_SOURCE,note});

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

/**
 * Exact fallbacks discovered by the deterministic 136-recipe graph audit. Every value is
 * native to the row's declared unit; no gram↔millilitre conversion is performed here.
 */
function explicitEnergyFallbackV6(row:NormalIngredient):FallbackReference|null{
 const id=(row.ingredientId??row.id??"").toLowerCase(),u=row.unit;
 switch(id){
  case "lemon":return u==="g"?F("g",0.29,"Raw lemon edible-portion reference.","B_DATABASE"):u==="count"?F("count",20,"Whole lemon unit proxy."):null;
  case "tofu-puffs":return u==="count"?F("count",35,"Fried tofu-puff unit proxy; size/brand varies."):u==="g"?F("g",2.7,"Fried tofu-puff weight proxy."):null;
  case "gai-lan":return u==="g"?F("g",0.26,"Chinese broccoli/gai-lan reference.","B_DATABASE"):null;
  case "baking-soda":return u==="g"?F("g",0,"Sodium bicarbonate contributes no material energy.","B_DATABASE"):null;
  case "bok-choy":return u==="g"?F("g",0.13,"Raw bok choy reference.","B_DATABASE"):null;
  case "bamboo-shoots":return u==="g"?F("g",0.27,"Bamboo-shoot generic reference.","B_DATABASE"):null;
  case "water-chestnuts":return u==="g"?F("g",0.97,"Water-chestnut reference.","B_DATABASE"):null;
  case "rosemary":return u==="g"?F("g",1.31,"Fresh rosemary reference; contribution is small.","B_DATABASE"):null;
  case "kalamata-olives":case "kalamata-olive":return u==="g"?F("g",2.39,"Kalamata/ripe-olive proxy; brine and brand vary."):null;
  case "dijon":return u==="g"?F("g",0.66,"Dijon mustard packaged-food proxy."):null;
  case "wholegrain-mustard":return u==="g"?F("g",1.0,"Wholegrain mustard packaged-food proxy."):null;
  case "scallion":return u==="g"?F("g",0.32,"Raw scallion reference.","B_DATABASE"):u==="count"?F("count",5,"Scallion unit proxy; stalk/bunch size varies."):null;
  case "poaching-liquid":return u==="ml"?F("ml",0,"Generated from already-counted chicken/water in the same recipe; zero incremental energy prevents double counting."):null;
  case "ketchup":case "ketchup-finish":return u==="ml"?F("ml",1.0,"Tomato-ketchup volume proxy; label-sensitive."):u==="g"?F("g",1.12,"Tomato-ketchup weight proxy; label-sensitive."):null;
  case "neutral-oil-absorbed":return u==="ml"?F("ml",8.28,"Explicit retained-oil row, not fryer-reservoir oil."):u==="g"?F("g",8.84,"Explicit retained-oil row, not fryer-reservoir oil."):null;
  case "chilli-oil":return u==="ml"?F("ml",8.28,"Oil-dominant chilli-oil proxy; product recipes vary."):null;
  case "five-spice":return u==="g"?F("g",3.0,"Dry five-spice blend proxy; contribution is small."):null;
  case "hk-pan-fried-noodles":return u==="g"?F("g",1.7,"Fresh Hong Kong pan-fried noodle hydrated-weight proxy."):null;
  case "neutral-oil":return u==="ml"?F("ml",8.28,"Neutral edible-oil volume reference.","B_DATABASE"):u==="g"?F("g",8.84,"Neutral edible-oil weight reference.","B_DATABASE"):null;
  case "whole-wheat-roti":return u==="count"?F("count",120,"Small whole-wheat roti/chapati unit proxy; household size will refine."):null;
  case "toasted-rice-powder":return u==="g"?F("g",3.65,"Dry toasted-rice-powder proxy."):null;
  case "ikan-bilis":return u==="g"?F("g",2.9,"Dried anchovy/ikan-bilis proxy; frying and brand change final energy."):null;
  case "choy-sum":return u==="g"?F("g",0.22,"Choy-sum leafy-vegetable proxy.","B_DATABASE"):null;
  case "dried-red-chilli":return u==="g"?F("g",2.82,"Dried chilli reference proxy."):u==="count"?F("count",2,"Dried chilli unit proxy."):null;
  case "chicken-fat":return u==="g"?F("g",9.0,"Rendered chicken-fat proxy; retained amount is recipe-specific."):null;
  case "red-chilli":return u==="g"?F("g",0.4,"Fresh red chilli reference.","B_DATABASE"):u==="count"?F("count",4,"Fresh red chilli unit proxy."):null;
  case "okra":return u==="g"?F("g",0.33,"Raw okra reference.","B_DATABASE"):null;
  case "meat-curry-powder":return u==="g"?F("g",3.0,"Dry meat-curry-powder blend proxy; contribution is small."):null;
  case "curry-leaf":return u==="g"?F("g",1.0,"Fresh curry-leaf proxy; nutritionally minor."):null;
  case "firm-fish-steaks":return u==="g"?F("g",1.3,"Firm fish-steak edible-portion proxy; species varies."):null;
  case "lime-juice":return u==="ml"?F("ml",0.25,"Fresh lime-juice reference.","B_DATABASE"):null;
  case "small-baguette":return u==="count"?F("count",260,"Small baguette/bánh-mì roll unit proxy; bakery size varies."):null;
  case "cooked-chicken":return u==="g"?F("g",1.8,"Cooked shredded-chicken proxy; cut/skin varies."):null;
  case "lemon-zest":return u==="g"?F("g",0.47,"Fresh lemon peel/zest reference.","B_DATABASE"):null;
  case "capers":return u==="g"?F("g",0.23,"Drained caper reference.","B_DATABASE"):null;
  case "jalapeno":return u==="g"?F("g",0.29,"Raw jalapeño reference.","B_DATABASE"):u==="count"?F("count",4,"Jalapeño unit proxy."):null;
  case "celery":return u==="g"?F("g",0.14,"Raw celery reference.","B_DATABASE"):null;
  case "large-wrap":return u==="count"?F("count",210,"Large flour-wrap unit proxy; exact label will refine."):null;
  default:return null;
 }
}

function ingredientKcalV6(row:NormalIngredient){
 const base=ingredientReferenceKcalV6(row);if(base.excludedOptional||base.kcal!=null&&base.reference)return base;
 const fallback=explicitEnergyFallbackV6(row);if(!fallback||fallback.unit!==row.unit)return base;
 return{kcal:Math.round(row.qty*fallback.kcalPerUnit*10)/10,reference:fallback,excludedOptional:false};
}

export function estimateRecipeEnergyV6(args:{recipeId:string;servings:number;ingredients:readonly NormalIngredient[];prep:readonly NormalPrep[]}):RecipeEnergyReferenceV6{
 let ingredientKcal=0,prepKcal=0,rawIngredientKcal=0,optionalIngredientsExcluded=0,worst=1;
 const unresolvedIngredientIds:string[]=[],unresolvedPrepIds:string[]=[];
 for(const row of args.ingredients){
   const result=ingredientKcalV6(row);if(result.excludedOptional){optionalIngredientsExcluded++;continue}
   if(result.kcal==null||!result.reference){unresolvedIngredientIds.push(row.ingredientId??row.id??row.name);continue}
   rawIngredientKcal+=result.kcal;ingredientKcal+=adjustIngredientKcal(args.recipeId,row,result.kcal);worst=Math.max(worst,confidenceRank(result.reference.confidence));
 }
 for(const p of args.prep){const ref=prepEnergyReferenceV6(p.componentId),k=prepReferenceKcalV6(p.componentId,quantity(p.qty,p.unit));if(!ref||k==null){unresolvedPrepIds.push(p.componentId);continue}prepKcal+=k;worst=Math.max(worst,ref.confidence==="D"?3:ref.confidence==="C"?2:1)}
 const total=Math.max(0,ingredientKcal+prepKcal),servings=Math.max(1,args.servings),per=total/servings,confidence=worst>=3?"D":worst===2?"C":"B",uncertaintyPct=confidence==="D"?25:confidence==="C"?18:12;
 return{recipeId:args.recipeId,totalKcal:Math.round(total),kcalPerPerson:Math.round(per/5)*5,servings,uncertaintyPct,mealWeight:weightFor(per),status:"reference_estimate",confidence,methodology:"ingredient_composition_plus_prep_proxy",optionalIngredientsExcluded,processAdjustmentKcal:Math.round((ingredientKcal-rawIngredientKcal)*10)/10,ingredientKcal:Math.round(ingredientKcal),prepKcal:Math.round(prepKcal),unresolvedIngredientIds,unresolvedPrepIds};
}

function liveReference(recipeId:string){const f=getRuntimeDinnerFormulationV4(recipeId);if(!f)throw new Error(`Missing four-serving runtime formulation for ${recipeId}`);return estimateRecipeEnergyV6({recipeId,servings:f.targetServings,ingredients:f.ingredients.map(x=>({ingredientId:x.ingredientId,name:x.name,qty:x.qty,unit:x.unit,optional:x.optional})),prep:f.prep.map(x=>({componentId:x.componentId,qty:x.quantity.qty,unit:x.quantity.unit}))})}
export const liveRecipeEnergyReferencesV6:Readonly<Record<string,RecipeEnergyReferenceV6>>=Object.fromEntries(canonicalRecipesV2.map(r=>[r.id,liveReference(r.id)] as const));

export const phase2RecipeEnergyReferencesV6:Readonly<Record<string,RecipeEnergyReferenceV6>>=Object.fromEntries(phase2ResearchRecipesV5.map(r=>[r.id,estimateRecipeEnergyV6({recipeId:r.id,servings:r.targetServings,ingredients:r.ingredients.map(x=>({id:x.id,name:x.name,qty:x.qty,unit:x.unit,optional:x.optional,basis:x.basis,note:x.note})),prep:r.prep.map(x=>({componentId:x.componentId,qty:x.qty,unit:x.unit}))})] as const));

export const allRecipeEnergyReferencesV6:Readonly<Record<string,RecipeEnergyReferenceV6>>={...liveRecipeEnergyReferencesV6,...phase2RecipeEnergyReferencesV6};
export function recipeEnergyReferenceV6(recipeId:string){return allRecipeEnergyReferencesV6[recipeId]}

export function validateRecipeEnergyReferencesV6(){
 const errors:string[]=[];const ids=Object.keys(allRecipeEnergyReferencesV6);if(Object.keys(liveRecipeEnergyReferencesV6).length!==36)errors.push(`Expected 36 live energy references, found ${Object.keys(liveRecipeEnergyReferencesV6).length}`);if(Object.keys(phase2RecipeEnergyReferencesV6).length!==100)errors.push(`Expected 100 Phase 2 energy references, found ${Object.keys(phase2RecipeEnergyReferencesV6).length}`);if(ids.length!==136)errors.push(`Expected 136 total energy references, found ${ids.length}`);
 for(const r of Object.values(allRecipeEnergyReferencesV6)){if(r.unresolvedIngredientIds.length)errors.push(`${r.recipeId} unresolved ingredients: ${r.unresolvedIngredientIds.join(",")}`);if(r.unresolvedPrepIds.length)errors.push(`${r.recipeId} unresolved prep: ${r.unresolvedPrepIds.join(",")}`);if(!(r.kcalPerPerson>0))errors.push(`${r.recipeId} invalid kcal/person`);if(r.servings!==4)errors.push(`${r.recipeId} is not calculated over four servings`)}
 return{valid:errors.length===0,errors};
}
