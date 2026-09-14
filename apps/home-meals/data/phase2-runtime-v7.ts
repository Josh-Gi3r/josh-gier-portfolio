import {quantity,type QuantityUnit} from "./food-quantity";
import {phase2LiveCandidatesV7,getPhase2LiveCandidateV7,type Phase2LiveCandidateV7} from "./phase2-live-candidates-v7";
import {isPhase2LiveV7} from "./phase2-promotion-registry-v7";
import type {RecipeIngredientV2,RecipeStepV2} from "./recipe-formulations-v2";
import type {SupportedCookServingsV4} from "./household-serving-policy-v4";

const cookingFatIds=new Set(["neutral-oil","olive-oil","sesame-oil","butter-unsalted","ghee","chicken-fat"]);
const waterIds=new Set(["water","water-slurry","poaching-liquid","coconut-water"]);
const strongSeasoningIds=new Set(["salt-fine","sugar","palm-sugar","fish-sauce","light-soy","dark-soy","oyster-sauce","hoisin","shaoxing-wine","mirin","sake","rice-vinegar","chinkiang-vinegar","tamarind","dijon","wholegrain-mustard","gochujang","doenjang","white-miso","chilli-oil","hot-sauce","worcestershire","garam-masala","cumin-seed","cumin-ground","roasted-cumin","coriander-ground","turmeric-ground","kashmiri-chilli","paprika","chilli-flake","five-spice","white-pepper","black-pepper","sichuan-pepper","amchur","kasuri-methi"]);
const aromaticIds=new Set(["garlic-fresh","ginger-fresh","green-chilli","dried-red-chilli","scallion","lemongrass","galangal","curry-leaf"]);
const finishingIds=new Set(["coriander","thai-basil","holy-basil","makrut-lime","parsley","mint"]);

function roundQty(qty:number,unit:QuantityUnit){if(unit==="count")return Math.max(1,Math.round(qty));if(qty>=100)return Math.round(qty/5)*5;if(qty>=20)return Math.round(qty);return Math.round(qty*2)/2}
function ratioForIngredient(id:string){return (cookingFatIds.has(id)||waterIds.has(id)||strongSeasoningIds.has(id)||aromaticIds.has(id)||finishingIds.has(id)) ? 0.83 : 0.75}
function scaleIngredient(candidate:Phase2LiveCandidateV7["ingredients"][number],servings:SupportedCookServingsV4):RecipeIngredientV2{
 const ratio=servings===4?1:ratioForIngredient(candidate.ingredientId);
 return{ingredientId:candidate.canonicalIngredientId,name:candidate.name,qty:roundQty(candidate.qty*ratio,candidate.unit),unit:candidate.unit,basis:candidate.basis,optional:candidate.optional,note:candidate.note};
}
function scalePrep(candidate:Phase2LiveCandidateV7["prep"][number],servings:SupportedCookServingsV4){const ratio=servings===4?1:.75;return{componentId:candidate.componentId,quantity:quantity(roundQty(candidate.qty*ratio,candidate.unit),candidate.unit)}}
function stepFor(candidate:Phase2LiveCandidateV7["steps"][number]):RecipeStepV2{return{instruction:candidate.instruction,visualCue:candidate.cue,warningCue:candidate.warning,safetyTargetC:candidate.safetyTargetC,cameraAssessable:!!candidate.cue}}

export type Phase2RuntimeDinnerV7=Readonly<{
 recipeId:string;
 targetServings:SupportedCookServingsV4;
 prep:readonly {componentId:string;quantity:ReturnType<typeof quantity>}[];
 ingredients:readonly RecipeIngredientV2[];
 equipment:readonly string[];
 steps:readonly RecipeStepV2[];
 actualFinishedWeightG:null;
 actualServings:null;
 actualCookMinutes:null;
 source:"phase2-v7";
}>;

export function getPhase2CandidateRuntimeV7(recipeId:string,servings:SupportedCookServingsV4=4):Phase2RuntimeDinnerV7|undefined{
 const c=getPhase2LiveCandidateV7(recipeId);if(!c||!c.structuralReady)return undefined;
 return{recipeId:c.id,targetServings:servings,prep:c.prep.map(x=>scalePrep(x,servings)),ingredients:c.ingredients.map(x=>scaleIngredient(x,servings)),equipment:c.equipment,steps:c.steps.map(stepFor),actualFinishedWeightG:null,actualServings:null,actualCookMinutes:null,source:"phase2-v7"};
}
export function getPhase2LiveRuntimeV7(recipeId:string,servings:SupportedCookServingsV4=4){if(!isPhase2LiveV7(recipeId))return undefined;return getPhase2CandidateRuntimeV7(recipeId,servings)}

export function validatePhase2RuntimeV7(){
 const errors:string[]=[];
 for(const candidate of phase2LiveCandidatesV7){
   const four=getPhase2CandidateRuntimeV7(candidate.id,4),three=getPhase2CandidateRuntimeV7(candidate.id,3);if(!four||!three){errors.push(`${candidate.id}: runtime adapter missing`);continue}
   if(four.targetServings!==4||three.targetServings!==3)errors.push(`${candidate.id}: target servings mismatch`);
   if(four.ingredients.length!==candidate.ingredients.length||three.ingredients.length!==candidate.ingredients.length)errors.push(`${candidate.id}: ingredient count mismatch`);
   if(four.prep.length!==candidate.prep.length||three.prep.length!==candidate.prep.length)errors.push(`${candidate.id}: prep count mismatch`);
   for(let i=0;i<candidate.ingredients.length;i++){const src=candidate.ingredients[i],f=four.ingredients[i],t=three.ingredients[i];if(f.ingredientId!==src.canonicalIngredientId||f.qty!==src.qty||f.unit!==src.unit)errors.push(`${candidate.id}: four-serving ingredient drift ${src.ingredientId}`);if(t.unit!==src.unit||!(t.qty>0)||t.qty>f.qty)errors.push(`${candidate.id}: invalid three-serving ingredient ${src.ingredientId}`)}
   for(let i=0;i<candidate.prep.length;i++){const src=candidate.prep[i],f=four.prep[i],t=three.prep[i];if(f.componentId!==src.componentId||f.quantity.qty!==src.qty||f.quantity.unit!==src.unit)errors.push(`${candidate.id}: four-serving prep drift ${src.componentId}`);if(t.quantity.unit!==src.unit||!(t.quantity.qty>0)||t.quantity.qty>f.quantity.qty)errors.push(`${candidate.id}: invalid three-serving prep ${src.componentId}`)}
 }
 return{valid:errors.length===0,errors,count:phase2LiveCandidatesV7.length};
}
