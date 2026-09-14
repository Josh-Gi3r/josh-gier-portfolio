import { addNutrition, scaleNutrition, type NutritionSnapshot } from "./nutrition-v2";
import { quantity, type Quantity, type QuantityUnit } from "./food-quantity";
import { getPrepFormulationV2 } from "./prep-formulations-v2";
import { recipePrepV2 } from "./food-truth-v2";
import { ingredientsForRecipeV2 } from "./ingredient-engine-v2";
import { canonicalIngredientKeyV2 } from "./ingredient-catalog-v2";

export type NutrientDensityV2=Readonly<{reference:Quantity;nutrients:NutritionSnapshot;sourceType:"fdc"|"manufacturer"|"measured_component"|"analyzed_proxy";sourceId:string}>;
export type NutritionRegistryV2=Readonly<Record<string,NutrientDensityV2|undefined>>;
export type ComponentNutritionRegistryV2=Readonly<Record<string,NutrientDensityV2|undefined>>;
const ZERO:NutritionSnapshot={kcal:0,proteinG:0,carbohydrateG:0,fatG:0,saturatedFatG:0,fibreG:0,sugarsG:0,sodiumMg:0};
const extractionSensitive=new Set(["clear","dark","dashi","k-anchovy"]);
function contribution(density:NutrientDensityV2,amount:Quantity):NutritionSnapshot{if(density.reference.unit!==amount.unit)throw new Error(`Nutrition unit mismatch: ${density.reference.unit} vs ${amount.unit}`);if(!(density.reference.qty>0))throw new Error("Nutrition density reference quantity must be positive");return scaleNutrition(density.nutrients,amount.qty/density.reference.qty)}

export type ComponentNutritionCalculationV2=Readonly<{componentId:string;complete:boolean;status:"complete_engineering_estimate"|"missing_ingredient_bindings"|"missing_parent_density"|"requires_finished_food_proxy";wholeBatch:NutritionSnapshot|null;densityPerOutputUnit:NutrientDensityV2|null;missingIngredientIds:readonly string[];missingComponentIds:readonly string[];note?:string}>;

export function calculateMeasuredComponentNutritionV2(input:{componentId:string;measuredOutput:Quantity;ingredientNutrition:NutritionRegistryV2;componentNutrition?:ComponentNutritionRegistryV2}):ComponentNutritionCalculationV2{
  const formulation=getPrepFormulationV2(input.componentId);if(!formulation)throw new Error(`Missing prep formulation ${input.componentId}`);if(input.measuredOutput.unit!==formulation.outputUnit||!(input.measuredOutput.qty>0))throw new Error(`Invalid measured output for ${input.componentId}`);
  if(extractionSensitive.has(input.componentId))return{componentId:input.componentId,complete:false,status:"requires_finished_food_proxy",wholeBatch:null,densityPerOutputUnit:null,missingIngredientIds:[],missingComponentIds:[],note:"This component strains/discards solids, so raw ingredient totals cannot honestly represent finished stock nutrition. Bind an analyzed finished-stock proxy instead."};
  const ingredientRows=formulation.ingredientInputs.filter(x=>x.ingredientId!=="water").map(x=>({x,key:canonicalIngredientKeyV2(x.ingredientId,x.unit)}));
  const missingIngredientIds=ingredientRows.filter(({key})=>!input.ingredientNutrition[key]).map(({key})=>key);const componentNutrition=input.componentNutrition??{};const missingComponentIds=formulation.componentInputs.filter(x=>!componentNutrition[x.componentId]).map(x=>x.componentId);
  if(missingIngredientIds.length)return{componentId:input.componentId,complete:false,status:"missing_ingredient_bindings",wholeBatch:null,densityPerOutputUnit:null,missingIngredientIds,missingComponentIds};if(missingComponentIds.length)return{componentId:input.componentId,complete:false,status:"missing_parent_density",wholeBatch:null,densityPerOutputUnit:null,missingIngredientIds,missingComponentIds};
  let total={...ZERO};for(const {x,key} of ingredientRows){const density=input.ingredientNutrition[key]!;total=addNutrition(total,contribution(density,quantity(x.qty,x.unit)))}for(const x of formulation.componentInputs){const density=componentNutrition[x.componentId]!;total=addNutrition(total,contribution(density,quantity(x.qty,x.unit)))}
  return{componentId:input.componentId,complete:true,status:"complete_engineering_estimate",wholeBatch:total,densityPerOutputUnit:{reference:quantity(input.measuredOutput.qty,input.measuredOutput.unit),nutrients:total,sourceType:"measured_component",sourceId:`${input.componentId}:measured-batch`},missingIngredientIds:[],missingComponentIds:[],note:"Ingredient/label arithmetic over a measured household output. This is a deterministic estimate, not laboratory analysis."};
}

export type DinnerNutritionCalculationV2=Readonly<{recipeId:string;variantId?:string;complete:boolean;wholeRecipe:NutritionSnapshot|null;perTargetServing:NutritionSnapshot|null;missingIngredientIds:readonly string[];missingComponentIds:readonly string[]}>;
export function calculateDinnerNutritionV2(input:{recipeId:string;variantId?:string;ingredientNutrition:NutritionRegistryV2;componentNutrition:ComponentNutritionRegistryV2}):DinnerNutritionCalculationV2{
  const direct=ingredientsForRecipeV2(input.recipeId,input.variantId).filter(x=>!x.optional&&x.ingredientId!=="water").map(x=>({x,key:canonicalIngredientKeyV2(x.ingredientId,x.unit)}));const prep=recipePrepV2(input.recipeId);
  const missingIngredientIds=direct.filter(({key})=>!input.ingredientNutrition[key]).map(({key})=>key);const missingComponentIds=prep.filter(x=>!input.componentNutrition[x.componentId]).map(x=>x.componentId);if(missingIngredientIds.length||missingComponentIds.length)return{recipeId:input.recipeId,variantId:input.variantId,complete:false,wholeRecipe:null,perTargetServing:null,missingIngredientIds,missingComponentIds};
  let total={...ZERO};for(const {x,key} of direct)total=addNutrition(total,contribution(input.ingredientNutrition[key]!,quantity(x.qty,x.unit)));for(const x of prep)total=addNutrition(total,contribution(input.componentNutrition[x.componentId]!,x.quantity));return{recipeId:input.recipeId,variantId:input.variantId,complete:true,wholeRecipe:total,perTargetServing:scaleNutrition(total,0.5),missingIngredientIds:[],missingComponentIds:[]};
}
export function makeDensityV2(referenceQty:number,unit:QuantityUnit,nutrients:NutritionSnapshot,sourceType:NutrientDensityV2["sourceType"],sourceId:string):NutrientDensityV2{return{reference:quantity(referenceQty,unit),nutrients,sourceType,sourceId}}
