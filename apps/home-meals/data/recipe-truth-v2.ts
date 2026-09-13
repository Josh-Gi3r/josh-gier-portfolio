import { recipes } from "./home-data";
import { recipePrepV2, type RecipePrepRequirementV2 } from "./food-truth-v2";
import { safetyProfileV2, type RecipeSafetyProfileV2 } from "./food-safety-v2";
import { getIngredientTruthV2 } from "./ingredient-truth-v2";

export type RecipeIdentityClass =
  | "close_reference"
  | "household_adaptation"
  | "cuisine_inspired"
  | "legacy_researched"
  | "needs_source_upgrade";

export type RecipeTruthStatus =
  | "source_verified"
  | "formulation_locked"
  | "needs_variant_split"
  | "needs_exact_starch"
  | "kitchen_validation_required";

export type StarchDefinitionV2 = Readonly<{
  id:string;
  qty:number;
  unit:"g"|"count";
  basis:"dry"|"raw"|"fresh";
  optional?:boolean;
}>;

export type CanonicalRecipeV2 = Readonly<{
  id:string;
  title:string;
  cuisine:string;
  servings:2;
  identityClass:RecipeIdentityClass;
  truthStatus:readonly RecipeTruthStatus[];
  reportedTotalMinutes:number;
  prepMinutes:number|null;
  activeMinutes:number|null;
  passiveMinutes:number|null;
  marinationMinutes:number|null;
  prep:readonly RecipePrepRequirementV2[];
  ingredientIds:readonly string[];
  rawIngredients:readonly string[];
  explicitStarch:StarchDefinitionV2|null;
  source:{label:string;url:string};
  sourceStatus:"specific"|"generic_or_wrong"|"adaptation_reference";
  safety:RecipeSafetyProfileV2|undefined;
  finishedWeightG:null;
  actualServings:null;
}>;

const identityOverrides:Readonly<Record<string,RecipeIdentityClass>> = {
  "gold-chicken-curry":"household_adaptation",
  "sambal-udang":"close_reference",
  "pad-kra-pao":"close_reference",
  "beef-broccoli":"close_reference",
  "thai-green-chicken":"close_reference",
  "chicken-cacciatore":"household_adaptation",
  "mustard-mushroom-chicken":"household_adaptation",
  "miso-aubergine-tofu":"cuisine_inspired",
  "gochujang-chicken":"cuisine_inspired",
  "gochujang-tofu":"cuisine_inspired",
  "beef-ragu":"household_adaptation",
  "pesto-salmon":"cuisine_inspired",
  "harissa-chickpeas":"cuisine_inspired",
  "chipotle-chicken-bowl":"cuisine_inspired",
  "chipotle-bean-skillet":"cuisine_inspired",
};

const explicitStarches:Readonly<Record<string,StarchDefinitionV2>> = {
  "gold-chicken-curry":{id:"basmati-rice",qty:120,unit:"g",basis:"dry"},
  "sambal-udang":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "curry-laksa":{id:"rice-noodles",qty:240,unit:"g",basis:"fresh"},
  "pad-kra-pao":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "pad-see-ew":{id:"rice-noodles",qty:450,unit:"g",basis:"fresh"},
  "beef-broccoli":{id:"rice",qty:120,unit:"g",basis:"dry"},
  "chicken-cacciatore":{id:"potatoes",qty:300,unit:"g",basis:"raw"},
  "mustard-mushroom-chicken":{id:"potatoes",qty:300,unit:"g",basis:"raw"},
  "beef-ragu":{id:"pasta",qty:180,unit:"g",basis:"dry"},
  "harissa-chickpeas":{id:"couscous",qty:120,unit:"g",basis:"dry",optional:true},
};

function sourceStatus(url:string):CanonicalRecipeV2["sourceStatus"] {
  if(/sfa\.gov\.sg\/food-safety-tips|seriouseats\.com\/one-pot-chicken-dinners|maangchi\.com\/recipes\/BBQ/i.test(url))return "generic_or_wrong";
  if(/youtube\.com/i.test(url))return "adaptation_reference";
  return "specific";
}

function statuses(recipe:typeof recipes[number]):RecipeTruthStatus[] {
  const out:RecipeTruthStatus[]=["formulation_locked","kitchen_validation_required"];
  const ingredientTruth=recipe.ingredients.map(x=>getIngredientTruthV2(x.id)).filter(Boolean);
  if(ingredientTruth.some(x=>x?.truthStatus==="needs_variant_split"))out.push("needs_variant_split");
  const hasLegacyPortion=recipe.ingredients.some(x=>x.unit==="portion");
  if(hasLegacyPortion&&!explicitStarches[recipe.id])out.push("needs_exact_starch");
  if(sourceStatus(recipe.source.url)==="specific")out.unshift("source_verified");
  return [...new Set(out)];
}

export const canonicalRecipesV2:readonly CanonicalRecipeV2[] = recipes.map(recipe=>({
  id:recipe.id,
  title:recipe.title,
  cuisine:recipe.cuisine,
  servings:2,
  identityClass:identityOverrides[recipe.id]??(sourceStatus(recipe.source.url)==="generic_or_wrong"?"needs_source_upgrade":"legacy_researched"),
  truthStatus:statuses(recipe),
  reportedTotalMinutes:recipe.minutes,
  prepMinutes:null,
  activeMinutes:null,
  passiveMinutes:null,
  marinationMinutes:null,
  prep:recipePrepV2(recipe.id),
  ingredientIds:recipe.ingredients.filter(x=>!x.optional).map(x=>x.id),
  rawIngredients:recipe.rawIngredients,
  explicitStarch:explicitStarches[recipe.id]??null,
  source:recipe.source,
  sourceStatus:sourceStatus(recipe.source.url),
  safety:safetyProfileV2(recipe.id),
  finishedWeightG:null,
  actualServings:null,
}));

export const canonicalRecipeByIdV2=new Map(canonicalRecipesV2.map(x=>[x.id,x]));
export function getCanonicalRecipeV2(id:string):CanonicalRecipeV2|undefined{return canonicalRecipeByIdV2.get(id)}
