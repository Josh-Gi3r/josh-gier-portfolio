import type { QuantityUnit } from "./food-quantity";
import { getDinnerFormulationV2 } from "./recipe-formulations-v2";

export type VariantIngredientChangeV2=Readonly<{
  ingredientId:string;
  qty:number;
  unit:QuantityUnit;
  basis:"raw"|"dry"|"drained"|"fresh"|"prepared";
  name:string;
}>;
export type RecipeVariantV2=Readonly<{
  id:string;
  baseRecipeId:string;
  name:string;
  removeIngredientIds:readonly string[];
  upsertIngredients:readonly VariantIngredientChangeV2[];
  note:string;
  safetyClass?:"poultry"|"ground-meat"|"whole-beef"|"fish-shellfish"|"none";
}>;

const up=(ingredientId:string,name:string,qty:number,unit:QuantityUnit,basis:VariantIngredientChangeV2["basis"]):VariantIngredientChangeV2=>({ingredientId,name,qty,unit,basis});
const V=(value:RecipeVariantV2)=>value;

const riceDefaults=[
  ["gold-chicken-curry","basmati-rice-dry","Basmati rice",120],
  ["sambal-udang","jasmine-rice-dry","Jasmine rice",120],
  ["rempah-coconut-fish","jasmine-rice-dry","Jasmine rice",120],
  ["thai-green-chicken","jasmine-rice-dry","Jasmine rice",120],
  ["pad-kra-pao","jasmine-rice-dry","Jasmine rice",120],
  ["beef-broccoli","jasmine-rice-dry","Jasmine rice",120],
  ["brown-chicken-mushroom","jasmine-rice-dry","Jasmine rice",120],
  ["wok-tofu-greenbeans","jasmine-rice-dry","Jasmine rice",120],
  ["teriyaki-salmon","jasmine-rice-dry","Rice",120],
  ["teriyaki-chicken","jasmine-rice-dry","Rice",120],
  ["miso-salmon","jasmine-rice-dry","Rice",120],
  ["miso-aubergine-tofu","jasmine-rice-dry","Rice",100],
  ["bulgogi-beef","jasmine-rice-dry","Rice",120],
  ["gochujang-tofu","jasmine-rice-dry","Rice",100],
  ["chipotle-chicken-bowl","jasmine-rice-dry","Rice",120],
] as const;

const riceVariants:RecipeVariantV2[]=riceDefaults.flatMap(([recipeId,id,name,qty])=>[
  V({id:`${recipeId}--no-rice`,baseRecipeId:recipeId,name:"No rice",removeIngredientIds:[id],upsertIngredients:[],note:"Remove the rice component entirely; nutrition is recalculated from the deterministic ingredient graph."}),
  V({id:`${recipeId}--half-rice`,baseRecipeId:recipeId,name:"Half rice",removeIngredientIds:[],upsertIngredients:[up(id,name,qty/2,"g","dry")],note:"Use half of the canonical dry-rice quantity. This is an explicit variant, not an AI estimate."}),
]);

export const recipeVariantsV2:readonly RecipeVariantV2[]=[
  ...riceVariants,
  V({id:"gold-chana-masala--with-rice",baseRecipeId:"gold-chana-masala",name:"With rice",removeIngredientIds:[],upsertIngredients:[up("basmati-rice-dry","Basmati rice",120,"g","dry")],note:"Adds a measured two-person rice side."}),
  V({id:"gold-punjabi-egg-curry--with-rice",baseRecipeId:"gold-punjabi-egg-curry",name:"With rice",removeIngredientIds:[],upsertIngredients:[up("basmati-rice-dry","Basmati rice",120,"g","dry")],note:"Adds a measured two-person rice side."}),
  V({id:"thai-red-chicken--with-rice",baseRecipeId:"thai-red-chicken",name:"With rice",removeIngredientIds:[],upsertIngredients:[up("jasmine-rice-dry","Jasmine rice",120,"g","dry")],note:"Adds rice explicitly instead of assuming an invisible side."}),
  V({id:"curry-laksa--chicken",baseRecipeId:"curry-laksa",name:"Chicken laksa",removeIngredientIds:["prawns"],upsertIngredients:[up("chicken-thigh","Boneless skinless chicken thigh",300,"g","raw")],note:"Protein branch is explicit so shopping, allergens, safety and nutrition can differ correctly.",safetyClass:"poultry"}),
  V({id:"pad-kra-pao--pork",baseRecipeId:"pad-kra-pao",name:"Pork pad kra pao",removeIngredientIds:["ground-chicken"],upsertIngredients:[up("ground-pork","Ground pork",350,"g","raw")],note:"Named protein variant; do not collapse chicken and pork into one ingredient record.",safetyClass:"ground-meat"}),
  V({id:"pad-kra-pao--beef",baseRecipeId:"pad-kra-pao",name:"Beef pad kra pao",removeIngredientIds:["ground-chicken"],upsertIngredients:[up("ground-beef","Ground beef",350,"g","raw")],note:"Named protein variant with ground-meat safety target.",safetyClass:"ground-meat"}),
  V({id:"pad-see-ew--beef",baseRecipeId:"pad-see-ew",name:"Beef pad see ew",removeIngredientIds:["chicken-thigh"],upsertIngredients:[up("beef-sirloin","Thinly sliced beef",225,"g","raw")],note:"Explicit beef branch; cooking method and safety differ from chicken.",safetyClass:"whole-beef"}),
  V({id:"bulgogi-beef--lettuce-wrap",baseRecipeId:"bulgogi-beef",name:"Lettuce-wrap bulgogi",removeIngredientIds:["jasmine-rice-dry"],upsertIngredients:[up("lettuce","Lettuce leaves",250,"g","fresh")],note:"Replaces rice with a measured lettuce component instead of storing 'lettuce or rice'."}),
  V({id:"chicken-cacciatore--alcohol-free",baseRecipeId:"chicken-cacciatore",name:"Alcohol-free cacciatore",removeIngredientIds:["red-wine"],upsertIngredients:[up("water","Water",60,"ml","prepared"),up("red-wine-vinegar","Red wine vinegar",5,"ml","prepared")],note:"Tested-formulation branch for avoiding wine; acidity is added deliberately rather than pretending water is equivalent."}),
  V({id:"beef-ragu--alcohol-free",baseRecipeId:"beef-ragu",name:"Alcohol-free ragù",removeIngredientIds:["red-wine"],upsertIngredients:[up("water","Water",80,"ml","prepared")],note:"Deglaze with water; this is a household adaptation and not flavour-equivalent to wine."}),
  V({id:"chicken-cacciatore--pasta",baseRecipeId:"chicken-cacciatore",name:"Cacciatore with pasta",removeIngredientIds:["potato"],upsertIngredients:[up("pasta","Dry pasta",160,"g","dry")],note:"Explicit side variant; never store 'potatoes or pasta' as one nutrient record."}),
  V({id:"mustard-mushroom-chicken--pasta",baseRecipeId:"mustard-mushroom-chicken",name:"Mustard chicken with pasta",removeIngredientIds:["potato"],upsertIngredients:[up("pasta","Dry pasta",160,"g","dry")],note:"Explicit starch variant with green beans retained."}),
  V({id:"harissa-chickpeas--with-couscous",baseRecipeId:"harissa-chickpeas",name:"With couscous",removeIngredientIds:[],upsertIngredients:[up("couscous","Couscous",120,"g","dry")],note:"Promotes the optional couscous to an explicit planned side."}),
  V({id:"chipotle-bean-skillet--rice",baseRecipeId:"chipotle-bean-skillet",name:"With rice",removeIngredientIds:["tortilla"],upsertIngredients:[up("jasmine-rice-dry","Rice",120,"g","dry")],note:"Explicit starch branch; tortilla and rice no longer share one ambiguous recipe value."}),
];

export const recipeVariantByIdV2=new Map(recipeVariantsV2.map(x=>[x.id,x]));
export function getRecipeVariantV2(id:string){return recipeVariantByIdV2.get(id)}
export function recipeVariantsForV2(recipeId:string){return recipeVariantsV2.filter(x=>x.baseRecipeId===recipeId)}

export function validateRecipeVariantsV2(){
  const errors:string[]=[];const ids=new Set<string>();
  for(const v of recipeVariantsV2){
    if(ids.has(v.id))errors.push(`duplicate variant ${v.id}`);ids.add(v.id);
    if(!getDinnerFormulationV2(v.baseRecipeId))errors.push(`${v.id} references unknown base recipe ${v.baseRecipeId}`);
    for(const x of v.upsertIngredients)if(!(x.qty>0))errors.push(`${v.id}/${x.ingredientId} has invalid quantity`);
  }
  return {valid:errors.length===0,errors};
}
