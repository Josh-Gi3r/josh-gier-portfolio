import {phase2ChineseRecipesV5} from "./phase2-chinese-recipes-v5";
import {phase2ChineseWave1BRecipesV5} from "./phase2-chinese-wave1b-v5";
import {phase2IndianRecipesV5} from "./phase2-indian-recipes-v5";
import {phase2ThaiRecipesV5} from "./phase2-thai-recipes-v5";
import {phase2MalaysiaRecipesV5} from "./phase2-malaysia-recipes-v5";
import {phase2VietnameseRecipesV5} from "./phase2-vietnamese-recipes-v5";
import {phase2JapaneseRecipesV5} from "./phase2-japanese-recipes-v5";
import {phase2KoreanRecipesV5} from "./phase2-korean-recipes-v5";
import {phase2MediterraneanRecipesV5} from "./phase2-mediterranean-recipes-v5";
import {phase2ItalianEuropeanRecipesV5} from "./phase2-italian-european-recipes-v5";
import {phase2MexicanRecipesV5} from "./phase2-mexican-recipes-v5";
import {phase2EverydayRecipesV5} from "./phase2-everyday-recipes-v5";

/**
 * Research registry only. These records are FORMULATION_LOCKED but deliberately not live
 * Cook/Plan catalogue entries until image, ingredient-catalogue, grocery/stock and route
 * promotion is completed in the separate live-integration phase.
 */
export const phase2ResearchRecipesV5=[
 ...phase2ChineseRecipesV5,
 ...phase2ChineseWave1BRecipesV5,
 ...phase2IndianRecipesV5,
 ...phase2ThaiRecipesV5,
 ...phase2MalaysiaRecipesV5,
 ...phase2VietnameseRecipesV5,
 ...phase2JapaneseRecipesV5,
 ...phase2KoreanRecipesV5,
 ...phase2MediterraneanRecipesV5,
 ...phase2ItalianEuropeanRecipesV5,
 ...phase2MexicanRecipesV5,
 ...phase2EverydayRecipesV5,
] as const;

export const phase2ResearchCountsV5={
 chinese:phase2ChineseRecipesV5.length+phase2ChineseWave1BRecipesV5.length,
 indian:phase2IndianRecipesV5.length,
 thai:phase2ThaiRecipesV5.length,
 malaysiaSingaporeIndonesia:phase2MalaysiaRecipesV5.length,
 vietnamese:phase2VietnameseRecipesV5.length,
 japanese:phase2JapaneseRecipesV5.length,
 korean:phase2KoreanRecipesV5.length,
 middleEasternMediterranean:phase2MediterraneanRecipesV5.length,
 italianEuropean:phase2ItalianEuropeanRecipesV5.length,
 mexicanLatin:phase2MexicanRecipesV5.length,
 everyday:phase2EverydayRecipesV5.length,
 total:phase2ResearchRecipesV5.length,
} as const;

export const phase2ResearchRecipeByIdV5=new Map(phase2ResearchRecipesV5.map(recipe=>[recipe.id,recipe]));
export function getPhase2ResearchRecipeV5(id:string){return phase2ResearchRecipeByIdV5.get(id)}
