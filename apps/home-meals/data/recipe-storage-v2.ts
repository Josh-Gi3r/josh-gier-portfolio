import { canonicalDinnerFormulationsV2 } from "./recipe-formulations-v2";

export type FreezeSuitabilityV2="yes"|"partial"|"not_preferred"|"unknown";
export type RecipeStorageV2=Readonly<{
  recipeId:string;
  refrigeratorMaxC:4;
  homeFridgeDays:3;
  reheatTargetC:74;
  freezeSuitability:FreezeSuitabilityV2;
  lunchSuitability:"good"|"okay"|"best_fresh";
  separateStarch:boolean;
  qualityNote:string;
}>;

const quality:Readonly<Record<string,Partial<RecipeStorageV2>>>={
  "sambal-udang":{freezeSuitability:"not_preferred",lunchSuitability:"best_fresh",separateStarch:true,qualityNote:"Prawns are best freshly cooked; freeze SAMBAL rather than the plated meal."},
  "beef-broccoli":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:true,qualityNote:"Broccoli quality declines quickly; keep WOK-B as the freezer/fridge asset."},
  "brown-chicken-mushroom":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:true,qualityNote:"Chicken/sauce reheat better than rice; mushrooms soften."},
  "moo-goo-gai-pan":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:false,qualityNote:"Crisp vegetables are a quality-sensitive part of the dish."},
  "white-sauce-prawns":{freezeSuitability:"not_preferred",lunchSuitability:"best_fresh",separateStarch:false,qualityNote:"Seafood and crisp greens are better cooked fresh."},
  "wok-tofu-greenbeans":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:true,qualityNote:"Crisp tofu/beans lose texture after freezing."},
  "pad-kra-pao":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:true,qualityNote:"Seasoned meat can be reheated; basil and fried egg are best fresh."},
  "pad-see-ew":{freezeSuitability:"not_preferred",lunchSuitability:"best_fresh",separateStarch:false,qualityNote:"Wide rice noodles lose their wok-char texture on storage."},
  "thai-green-chicken":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:true,qualityNote:"Curry base freezes; fresh basil and tender vegetables are better refreshed after reheating."},
  "thai-red-chicken":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:false,qualityNote:"Curry freezes better than basil; pumpkin will soften further."},
  "massaman-beef":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:false,qualityNote:"Braise is freezer-friendly; potato texture may soften."},
  "rempah-chicken-rendang":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:false,qualityNote:"Reduced braise reheats well when chilled promptly."},
  "curry-laksa":{freezeSuitability:"partial",lunchSuitability:"okay",separateStarch:true,qualityNote:"Freeze broth separately; noodles, sprouts and fresh garnish should be assembled fresh."},
  "teriyaki-salmon":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:true,qualityNote:"Salmon and glaze are better fresh; TERI is the make-ahead asset."},
  "miso-salmon":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:true,qualityNote:"Freeze MISO-G rather than the finished fish."},
  "pesto-salmon":{freezeSuitability:"not_preferred",lunchSuitability:"okay",separateStarch:false,qualityNote:"Freeze PESTO, not the finished salmon/roast-vegetable plate."},
  "mustard-mushroom-chicken":{freezeSuitability:"not_preferred",lunchSuitability:"good",separateStarch:true,qualityNote:"Cream sauce can split; freeze the prep modules and make the cream finish fresh."},
  "chicken-cacciatore":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:true,qualityNote:"Chicken and sauce freeze well; keep potatoes/pasta separate when possible."},
  "beef-ragu":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:true,qualityNote:"Freeze ragù separately from pasta for better texture."},
  "red-shakshuka":{freezeSuitability:"partial",lunchSuitability:"okay",separateStarch:true,qualityNote:"Freeze the tomato/harissa base; cook eggs fresh."},
  "harissa-chicken-traybake":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:false,qualityNote:"Chicken reheats well; peppers/onion soften."},
  "harissa-chickpeas":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:true,qualityNote:"Freeze chickpea/harissa mixture; yoghurt remains fresh."},
  "chipotle-chicken-bowl":{freezeSuitability:"partial",lunchSuitability:"good",separateStarch:true,qualityNote:"Freeze chicken/sauce; keep yoghurt, lime and rice separate."},
  "chipotle-bean-skillet":{freezeSuitability:"yes",lunchSuitability:"good",separateStarch:true,qualityNote:"Bean mixture freezes well; tortillas/rice are separate."},
};

export const recipeStorageV2:readonly RecipeStorageV2[]=canonicalDinnerFormulationsV2.map(recipe=>{
  const override=quality[recipe.recipeId]??{};
  return {
    recipeId:recipe.recipeId,
    refrigeratorMaxC:4,
    homeFridgeDays:3,
    reheatTargetC:74,
    freezeSuitability:"unknown",
    lunchSuitability:"okay",
    separateStarch:recipe.ingredients.some(x=>/rice|pasta|couscous|tortilla|potato/.test(x.ingredientId)),
    qualityNote:"Home applies a conservative three-day refrigerated-leftover policy. Freezer quality is not asserted until researched or household-tested.",
    ...override,
  } as RecipeStorageV2;
});

export const recipeStorageByIdV2=new Map(recipeStorageV2.map(x=>[x.recipeId,x]));
export function getRecipeStorageV2(recipeId:string){return recipeStorageByIdV2.get(recipeId)}
