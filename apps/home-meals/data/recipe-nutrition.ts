// Per-portion nutrition shown on meal cards and the recipe page.
// Keyed by recipe slug; values are per single serving of the two-portion recipe.
export type RecipeNutrition={kcal:number;protein:number};

export const recipeNutrition:Record<string,RecipeNutrition>={
 "pad-kra-pao":{kcal:610,protein:38},
 "beef-broccoli":{kcal:540,protein:41},
 "gold-chicken-curry":{kcal:680,protein:44},
 "sambal-udang":{kcal:470,protein:36},
 "chicken-cacciatore":{kcal:720,protein:46},
 "thai-green-chicken":{kcal:650,protein:39},
 "mustard-mushroom-chicken":{kcal:690,protein:42},
 "gold-chana-masala":{kcal:560,protein:22},
 "gold-punjabi-egg-curry":{kcal:520,protein:26},
 "gold-saag-chicken":{kcal:640,protein:43},
 "gold-aloo-matar":{kcal:480,protein:14},
 "sambal-telur":{kcal:430,protein:20},
 "curry-laksa":{kcal:720,protein:32},
 "rempah-coconut-fish":{kcal:540,protein:38},
 "rempah-chicken-rendang":{kcal:760,protein:45},
 "thai-red-chicken":{kcal:660,protein:40},
 "massaman-beef":{kcal:820,protein:48},
 "pad-see-ew":{kcal:640,protein:28},
 "brown-chicken-mushroom":{kcal:560,protein:42},
 "moo-goo-gai-pan":{kcal:480,protein:40},
 "white-sauce-prawns":{kcal:420,protein:34},
 "wok-tofu-greenbeans":{kcal:520,protein:24},
 "teriyaki-salmon":{kcal:590,protein:40},
 "teriyaki-chicken":{kcal:620,protein:44},
 "miso-salmon":{kcal:580,protein:41},
 "miso-aubergine-tofu":{kcal:460,protein:20},
 "bulgogi-beef":{kcal:600,protein:40},
 "gochujang-chicken":{kcal:700,protein:45},
 "gochujang-tofu":{kcal:500,protein:26},
 "beef-ragu":{kcal:780,protein:44},
 "pesto-salmon":{kcal:640,protein:42},
 "red-shakshuka":{kcal:520,protein:24},
 "harissa-chicken-traybake":{kcal:690,protein:46},
 "harissa-chickpeas":{kcal:540,protein:22},
 "chipotle-chicken-bowl":{kcal:680,protein:44},
 "chipotle-bean-skillet":{kcal:520,protein:20}
};

export const nutritionFor=(id:string):RecipeNutrition|undefined=>recipeNutrition[id];
