import { recipes } from "./home-data";
import { recipePrepV2, type RecipePrepRequirementV2 } from "./food-truth-v2";
import { safetyProfileV2, type RecipeSafetyProfileV2 } from "./food-safety-v2";
import { getIngredientTruthV2 } from "./ingredient-truth-v2";

type LegacyRecipe=(typeof recipes)[number];

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

export type RecipeEvidenceV2=Readonly<{
  label:string;
  url:string;
  role:"culinary_reference"|"adaptation_reference"|"safety";
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
  evidenceSources:readonly RecipeEvidenceV2[];
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

// Explicit starch truth mirrors the current dinner formulations so the legacy display layer can never make starch demand ambiguous.
const explicitStarches:Readonly<Record<string,StarchDefinitionV2>> = {
  "gold-chicken-curry":{id:"basmati-rice",qty:120,unit:"g",basis:"dry"},
  "sambal-udang":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "sambal-telur":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "curry-laksa":{id:"rice-noodles",qty:240,unit:"g",basis:"fresh"},
  "rempah-coconut-fish":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "thai-green-chicken":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "pad-kra-pao":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "pad-see-ew":{id:"rice-noodles",qty:450,unit:"g",basis:"fresh"},
  "beef-broccoli":{id:"rice",qty:120,unit:"g",basis:"dry"},
  "brown-chicken-mushroom":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "wok-tofu-greenbeans":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "teriyaki-salmon":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "teriyaki-chicken":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "miso-salmon":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
  "miso-aubergine-tofu":{id:"jasmine-rice",qty:100,unit:"g",basis:"dry"},
  "gochujang-tofu":{id:"jasmine-rice",qty:100,unit:"g",basis:"dry"},
  "beef-ragu":{id:"pasta",qty:180,unit:"g",basis:"dry"},
  "chicken-cacciatore":{id:"potatoes",qty:300,unit:"g",basis:"raw"},
  "mustard-mushroom-chicken":{id:"potatoes",qty:300,unit:"g",basis:"raw"},
  "harissa-chickpeas":{id:"couscous",qty:120,unit:"g",basis:"dry",optional:true},
  "chipotle-chicken-bowl":{id:"jasmine-rice",qty:120,unit:"g",basis:"dry"},
};

const sourceOverrides:Readonly<Record<string,{source:{label:string;url:string};status:"specific"|"adaptation_reference";supporting?:readonly RecipeEvidenceV2[]}>>={
  "beef-ragu":{source:{label:"GialloZafferano — Ragù alla Bolognese technique",url:"https://www.giallozafferano.com/recipes/Ragu-alla-bolognese.html"},status:"adaptation_reference"},
  "mustard-mushroom-chicken":{source:{label:"RecipeTin Eats — Chicken in Creamy Mustard Sauce",url:"https://www.recipetineats.com/chicken-in-creamy-mustard-sauce/"},status:"adaptation_reference",supporting:[{label:"RecipeTin Eats — Chicken Breast in Creamy Mushroom Sauce",url:"https://www.recipetineats.com/chicken-breast-in-creamy-mushroom-sauce/",role:"adaptation_reference"}]},
  "pesto-salmon":{source:{label:"The Mediterranean Dish — Pesto Salmon",url:"https://www.themediterraneandish.com/pesto-salmon/"},status:"specific"},
  "miso-aubergine-tofu":{source:{label:"Just One Cookbook — Miso Dengaku (tofu and eggplant)",url:"https://www.justonecookbook.com/miso-dengaku/"},status:"adaptation_reference"},
  "gochujang-chicken":{source:{label:"Maangchi — Spicy Korean chicken skewers / gochujang sauce",url:"https://www.maangchi.com/recipe/dak-kkochi"},status:"adaptation_reference"},
  "gochujang-tofu":{source:{label:"Korean Bapsang — Korean-style Mapo Tofu",url:"https://www.koreanbapsang.com/mapo-tofu-korean-style/"},status:"adaptation_reference"},
  "chipotle-chicken-bowl":{source:{label:"Rick Bayless — Chicken Tinga",url:"https://www.rickbayless.com/recipe/chicken-tinga-tacos/"},status:"adaptation_reference"},
  "chipotle-bean-skillet":{source:{label:"Rick Bayless — Black Bean-Bathed Enchiladas with Chipotle",url:"https://www.rickbayless.com/recipe/black-bean-bathed-enchiladas-with-chorizo/"},status:"adaptation_reference"},
};

function legacySourceStatus(url:string):CanonicalRecipeV2["sourceStatus"] {
  if(/sfa\.gov\.sg\/food-safety-tips|seriouseats\.com\/one-pot-chicken-dinners|maangchi\.com\/recipes\/BBQ/i.test(url))return "generic_or_wrong";
  if(/youtube\.com/i.test(url))return "adaptation_reference";
  return "specific";
}
function canonicalSource(recipe:LegacyRecipe){
  const override=sourceOverrides[recipe.id];
  return override?{source:override.source,status:override.status,evidence:[{...override.source,role:override.status==="specific"?"culinary_reference" as const:"adaptation_reference" as const},...(override.supporting??[])]}:{source:recipe.source,status:legacySourceStatus(recipe.source.url),evidence:[{...recipe.source,role:legacySourceStatus(recipe.source.url)==="specific"?"culinary_reference" as const:"adaptation_reference" as const}]};
}
function statuses(recipe:LegacyRecipe):RecipeTruthStatus[] {
  const out:RecipeTruthStatus[]=["formulation_locked","kitchen_validation_required"];
  const ingredientTruth=recipe.ingredients.map(x=>getIngredientTruthV2(x.id)).filter(Boolean);
  if(ingredientTruth.some(x=>x?.truthStatus==="needs_variant_split"))out.push("needs_variant_split");
  const hasLegacyPortion=recipe.ingredients.some(x=>x.unit==="portion");
  if(hasLegacyPortion&&!explicitStarches[recipe.id])out.push("needs_exact_starch");
  if(canonicalSource(recipe).status==="specific")out.unshift("source_verified");
  return [...new Set(out)];
}

export const canonicalRecipesV2:readonly CanonicalRecipeV2[] = recipes.map(recipe=>{
  const source=canonicalSource(recipe);
  return {
    id:recipe.id,title:recipe.title,cuisine:recipe.cuisine,servings:2,
    identityClass:identityOverrides[recipe.id]??(source.status==="generic_or_wrong"?"needs_source_upgrade":"legacy_researched"),
    truthStatus:statuses(recipe),reportedTotalMinutes:recipe.minutes,prepMinutes:null,activeMinutes:null,passiveMinutes:null,marinationMinutes:null,
    prep:recipePrepV2(recipe.id),ingredientIds:recipe.ingredients.filter(x=>!x.optional).map(x=>x.id),rawIngredients:recipe.rawIngredients,
    explicitStarch:explicitStarches[recipe.id]??null,source:source.source,evidenceSources:source.evidence,sourceStatus:source.status,
    safety:safetyProfileV2(recipe.id),finishedWeightG:null,actualServings:null,
  };
});

export const canonicalRecipeByIdV2=new Map(canonicalRecipesV2.map(x=>[x.id,x]));
export function getCanonicalRecipeV2(id:string):CanonicalRecipeV2|undefined{return canonicalRecipeByIdV2.get(id)}