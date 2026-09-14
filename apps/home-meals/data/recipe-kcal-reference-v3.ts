export type MealWeightV3="light"|"balanced"|"hearty"|"rich";
export type RecipeKcalReferenceV3=Readonly<{
  kcalPerPerson:number;
  uncertaintyPct:15;
  mealWeight:MealWeightV3;
  status:"planning_reference";
}>;

/**
 * Rounded energy references for meal planning, derived from the current canonical
 * two-person formulations using standard food-composition values. These are deliberately
 * marked as references rather than calibrated household nutrition.
 *
 * Why the distinction matters: prep-component kcal density depends on the actual measured
 * finished output of Josh/G's batch. CLEAR, DARK, DASHI and K-STOCK also strain/discard
 * solids and require a finished-food proxy. Once those observations/bindings exist, the
 * v2 nutrition engine remains the authority for calibrated nutrition.
 */
const R=(kcalPerPerson:number,mealWeight:MealWeightV3):RecipeKcalReferenceV3=>({kcalPerPerson,uncertaintyPct:15,mealWeight,status:"planning_reference"});

export const recipeKcalReferenceV3:Readonly<Record<string,RecipeKcalReferenceV3>>={
  "gold-chicken-curry":R(725,"hearty"),
  "gold-chana-masala":R(350,"light"),
  "gold-punjabi-egg-curry":R(475,"light"),
  "gold-saag-chicken":R(550,"balanced"),
  "gold-aloo-matar":R(375,"light"),
  "sambal-udang":R(500,"balanced"),
  "sambal-telur":R(525,"balanced"),
  "curry-laksa":R(1025,"rich"),
  "rempah-coconut-fish":R(825,"hearty"),
  "rempah-chicken-rendang":R(1075,"rich"),
  "thai-green-chicken":R(850,"hearty"),
  "thai-red-chicken":R(1000,"rich"),
  "massaman-beef":R(1325,"rich"),
  "pad-kra-pao":R(775,"hearty"),
  "pad-see-ew":R(850,"hearty"),
  "beef-broccoli":R(725,"hearty"),
  "brown-chicken-mushroom":R(700,"balanced"),
  "moo-goo-gai-pan":R(475,"light"),
  "white-sauce-prawns":R(300,"light"),
  "wok-tofu-greenbeans":R(675,"balanced"),
  "teriyaki-salmon":R(775,"hearty"),
  "teriyaki-chicken":R(700,"balanced"),
  "miso-salmon":R(700,"balanced"),
  "miso-aubergine-tofu":R(675,"balanced"),
  "bulgogi-beef":R(675,"balanced"),
  "gochujang-chicken":R(675,"balanced"),
  "gochujang-tofu":R(575,"balanced"),
  "beef-ragu":R(975,"rich"),
  "chicken-cacciatore":R(725,"hearty"),
  "mustard-mushroom-chicken":R(775,"hearty"),
  "pesto-salmon":R(500,"balanced"),
  "red-shakshuka":R(425,"light"),
  "harissa-chicken-traybake":R(825,"hearty"),
  "harissa-chickpeas":R(425,"light"),
  "chipotle-chicken-bowl":R(850,"hearty"),
  "chipotle-bean-skillet":R(625,"balanced")
};

export function kcalReferenceForV3(recipeId:string){return recipeKcalReferenceV3[recipeId]}

const extractionSensitive=new Set(["clear","dark","dashi","k-anchovy"]);
export function prepKcalStatusV3(componentId:string):"finished_food_proxy_required"|"measured_output_required"{
  return extractionSensitive.has(componentId)?"finished_food_proxy_required":"measured_output_required";
}
