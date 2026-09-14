import {phase2ChineseRecipesV4,type Phase2IngredientV4,type Phase2RecipeResearchV4} from "./phase2-chinese-recipes-v4";
import {quantity} from "./food-quantity";
import {prepRequirementsForCookServingsV4,scaleReferenceIngredientToCookServingsV4} from "./household-serving-policy-v4";

export type Phase2RecipeResearchV5=Omit<Phase2RecipeResearchV4,"targetServings"|"ingredients"|"prep"|"referenceMinutes"|"researchDecision">&Readonly<{
  targetServings:4;
  ingredients:readonly Phase2IngredientV4[];
  prep:readonly {componentId:string;qty:number;unit:"g"|"ml"|"count"}[];
  referenceMinutes:number;
  cookScaleNote:string;
  researchDecision:string;
  status:"formulation_locked";
}>;

const timeAdjust:Readonly<Record<string,number>>={
  "mapo-tofu":5,"kung-pao-chicken":5,"black-pepper-beef":5,"tomato-egg-stir-fry":5,
  "char-siu-pork":0,"char-siu-chicken":0,"steamed-fish-ginger-scallion":5,"ginger-scallion-chicken":10,
  "sweet-sour-chicken":10,"garlic-aubergine":10,
};

function cookScaleNote(r:Phase2RecipeResearchV4){
  if(r.format==="wok")return "Four-serving ingredient truth. Use two wok batches whenever the food cannot sit in one uncrowded layer; combine only for the final sauce/finish so searing and wok hei are not lost.";
  if(r.format==="roast")return "Four-serving ingredient truth. Use one large tray/rack with real airflow; split across two trays if pieces would touch or steam.";
  if(r.format==="steam")return "Four-serving ingredient truth. Steam fish in a vessel that fits without folding or crowding; use two fish/steam rounds if needed rather than forcing one oversized batch.";
  return "Four-serving ingredient truth for two diners plus leftovers. Keep the same culinary endpoint rather than extending time mechanically.";
}

function scaleResearchIngredient(input:Phase2IngredientV4):Phase2IngredientV4{
  const scaled=scaleReferenceIngredientToCookServingsV4({ingredientId:input.id,name:input.name,qty:input.qty,unit:input.unit,optional:input.optional});
  return {...input,qty:scaled.qty};
}

export const phase2ChineseRecipesV5:readonly Phase2RecipeResearchV5[]=phase2ChineseRecipesV4.map(r=>{
  const referencePrep=r.prep.map(p=>({componentId:p.componentId,quantity:quantity(p.qty,p.unit)}));
  const prep=prepRequirementsForCookServingsV4(r.id,referencePrep).map(p=>({componentId:p.componentId,qty:p.quantity.qty,unit:p.quantity.unit}));
  return {
    ...r,
    targetServings:4 as const,
    ingredients:r.ingredients.map(scaleResearchIngredient),
    prep,
    referenceMinutes:r.referenceMinutes+(timeAdjust[r.id]??5),
    cookScaleNote:cookScaleNote(r),
    researchDecision:`${r.researchDecision} Serving rebase: this is now a four-serving cook batch for Josh + G plus leftovers. Bulk food scales to the full batch; fat, strong seasonings, aromatics and liquids follow the reviewed household scaling policy rather than a blind 2× multiplier.`,
    status:"formulation_locked" as const,
  };
});

export const phase2ChineseRecipeByIdV5=new Map(phase2ChineseRecipesV5.map(r=>[r.id,r]));
export function getPhase2ChineseRecipeV5(id:string){return phase2ChineseRecipeByIdV5.get(id)}
