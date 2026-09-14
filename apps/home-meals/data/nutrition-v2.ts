import { recipePrepV2, getCanonicalPrepV2 } from "./food-truth-v2";

export type NutritionSnapshot = Readonly<{
  kcal:number;
  proteinG:number;
  carbohydrateG:number;
  fatG:number;
  saturatedFatG:number;
  fibreG:number;
  sugarsG:number;
  sodiumMg:number;
  potassiumMg?:number;
  calciumMg?:number;
  ironMg?:number;
}>;

export type NutrientBinding =
  | Readonly<{
      kind:"fdc";
      fdcId:number;
      sourceLabel:string;
      per100:NutritionSnapshot;
    }>
  | Readonly<{
      kind:"manufacturer";
      brand:string;
      product:string;
      sku?:string;
      servingQty:number;
      servingUnit:"g"|"ml";
      perServing:NutritionSnapshot;
    }>;

export type NutritionTruthStatus =
  | "unavailable"
  | "awaiting_ingredient_binding"
  | "awaiting_component_measurement"
  | "provisional"
  | "household_calibrated";

export type NutritionReadinessV2 = Readonly<{
  recipeId:string;
  status:NutritionTruthStatus;
  blockingComponents:readonly string[];
  blockingIngredients:readonly string[];
  labelSensitiveIngredients:readonly string[];
}>;

export const labelSensitiveIngredientIdsV2 = new Set([
  "coconut-milk",
  "fish-sauce",
  "oyster-sauce",
  "soy-sauce",
  "dark-soy",
  "dijon",
  "cream",
  "yoghurt",
  "miso",
  "gochujang",
  "hoisin",
  "tofu",
]);

export function addNutrition(a:NutritionSnapshot,b:NutritionSnapshot):NutritionSnapshot {
  return {
    kcal:a.kcal+b.kcal,
    proteinG:a.proteinG+b.proteinG,
    carbohydrateG:a.carbohydrateG+b.carbohydrateG,
    fatG:a.fatG+b.fatG,
    saturatedFatG:a.saturatedFatG+b.saturatedFatG,
    fibreG:a.fibreG+b.fibreG,
    sugarsG:a.sugarsG+b.sugarsG,
    sodiumMg:a.sodiumMg+b.sodiumMg,
    potassiumMg:(a.potassiumMg??0)+(b.potassiumMg??0),
    calciumMg:(a.calciumMg??0)+(b.calciumMg??0),
    ironMg:(a.ironMg??0)+(b.ironMg??0),
  };
}

export function scaleNutrition(value:NutritionSnapshot,factor:number):NutritionSnapshot {
  if(!Number.isFinite(factor)||factor<0)throw new Error(`Invalid nutrition scale: ${factor}`);
  return {
    kcal:value.kcal*factor,
    proteinG:value.proteinG*factor,
    carbohydrateG:value.carbohydrateG*factor,
    fatG:value.fatG*factor,
    saturatedFatG:value.saturatedFatG*factor,
    fibreG:value.fibreG*factor,
    sugarsG:value.sugarsG*factor,
    sodiumMg:value.sodiumMg*factor,
    potassiumMg:value.potassiumMg==null?undefined:value.potassiumMg*factor,
    calciumMg:value.calciumMg==null?undefined:value.calciumMg*factor,
    ironMg:value.ironMg==null?undefined:value.ironMg*factor,
  };
}

export function roundNutritionForDisplay(value:NutritionSnapshot):NutritionSnapshot {
  const r=(n:number,step:number)=>Math.round(n/step)*step;
  return {
    kcal:r(value.kcal,5),
    proteinG:r(value.proteinG,1),
    carbohydrateG:r(value.carbohydrateG,1),
    fatG:r(value.fatG,1),
    saturatedFatG:r(value.saturatedFatG,1),
    fibreG:r(value.fibreG,1),
    sugarsG:r(value.sugarsG,1),
    sodiumMg:r(value.sodiumMg,10),
    potassiumMg:value.potassiumMg==null?undefined:r(value.potassiumMg,10),
    calciumMg:value.calciumMg==null?undefined:r(value.calciumMg,10),
    ironMg:value.ironMg==null?undefined:Math.round(value.ironMg*10)/10,
  };
}

/**
 * Nutrition must not become final simply because a recipe has ingredient quantities.
 * Any consumed cooked prep component with an unmeasured finished yield blocks exact nutrient density.
 */
export function nutritionReadinessV2(
  recipeId:string,
  ingredientIds:readonly string[],
  bindings:Readonly<Record<string,NutrientBinding|undefined>>
):NutritionReadinessV2 {
  const blockingComponents = recipePrepV2(recipeId)
    .map(x=>getCanonicalPrepV2(x.componentId))
    .filter((x):x is NonNullable<typeof x>=>!!x)
    .filter(x=>x.measurementStatus==="unmeasured")
    .map(x=>x.id);

  const blockingIngredients=ingredientIds.filter(id=>!bindings[id]);
  const labelSensitiveIngredients=ingredientIds.filter(id=>labelSensitiveIngredientIdsV2.has(id));

  let status:NutritionTruthStatus="provisional";
  if(blockingComponents.length)status="awaiting_component_measurement";
  else if(blockingIngredients.length)status="awaiting_ingredient_binding";
  return {recipeId,status,blockingComponents,blockingIngredients,labelSensitiveIngredients};
}

export function canPublishExactNutritionV2(readiness:NutritionReadinessV2):boolean {
  return readiness.status==="household_calibrated";
}
