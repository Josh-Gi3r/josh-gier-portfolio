import { canonicalDinnerFormulationsV2 } from "./recipe-formulations-v2";

export type EquipmentTokenV2="wok"|"skillet"|"saucepan"|"dutch-oven"|"oven"|"air-fryer"|"sheet-pan"|"rice-cooker"|"thermometer"|"grill"|"steamer"|"pot";
export type EquipmentRequirementGroupV2=Readonly<{source:string;anyOf:readonly EquipmentTokenV2[]}>;

function tokensFor(text:string):EquipmentTokenV2[]{
 const x=text.toLowerCase(),tokens=new Set<EquipmentTokenV2>();
 if(/\bwok\b/.test(x))tokens.add("wok");if(/skillet|frying pan|sauté pan|saute pan/.test(x))tokens.add("skillet");if(/saucepan/.test(x))tokens.add("saucepan");if(/dutch oven|heavy pan/.test(x))tokens.add("dutch-oven");if(/\boven\b|broiler/.test(x))tokens.add("oven");if(/air fryer/.test(x))tokens.add("air-fryer");if(/sheet pan/.test(x))tokens.add("sheet-pan");if(/rice cooker/.test(x))tokens.add("rice-cooker");if(/thermometer/.test(x))tokens.add("thermometer");if(/grill/.test(x))tokens.add("grill");if(/steamer/.test(x))tokens.add("steamer");if(/\bpot\b/.test(x))tokens.add("pot");
 return [...tokens];
}
export function recipeEquipmentGroupsV2(recipeId:string):readonly EquipmentRequirementGroupV2[]{
 const recipe=canonicalDinnerFormulationsV2.find(x=>x.recipeId===recipeId);if(!recipe)throw new Error(`Unknown recipe ${recipeId}`);
 return recipe.equipment.map(source=>({source,anyOf:tokensFor(source)})).filter(x=>x.anyOf.length>0);
}
export function equipmentCompatibilityV2(recipeId:string,available:ReadonlySet<EquipmentTokenV2>){
 const groups=recipeEquipmentGroupsV2(recipeId),missing=groups.filter(group=>!group.anyOf.some(token=>available.has(token)));
 return{compatible:missing.length===0,missing};
}
export function allEquipmentTokensV2(){return [...new Set(canonicalDinnerFormulationsV2.flatMap(x=>x.equipment.flatMap(tokensFor)))].sort() as EquipmentTokenV2[]}
