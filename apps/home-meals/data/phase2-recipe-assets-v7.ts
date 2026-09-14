import {livePhase2RecipeIdsV7} from "./phase2-promotion-registry-v7";

/** Final dish-faithful hero images for recipes that have passed visual production. */
export const phase2RecipeAssetsV7:Readonly<Record<string,string>>={
  "mapo-tofu":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201406_31650a32-2bd2-411f-8975-97a9f1cda038_min.webp",
  "kung-pao-chicken":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201418_66116456-b563-4127-a439-af4493d9c7e9_min.webp",
  "black-pepper-beef":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201424_efbc91b6-b10d-4195-befd-8d9b729c31a1_min.webp",
  "tomato-egg-stir-fry":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201432_bf2edce9-344f-4ba7-841b-d4e537637632_min.webp",
  "char-siu-pork":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201440_a44e46c6-b76a-402c-8655-4fac85db4584_min.webp",
  "char-siu-chicken":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201449_90eaf8b6-d977-49d8-b8bf-0b3a92478ff4_min.webp",
  "steamed-fish-ginger-scallion":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201458_6db9c8e5-68a6-44a9-95b4-c54ca2b624a9_min.webp",
  "ginger-scallion-chicken":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201507_e08f4e83-202f-4e0c-997e-894d74c5baf1_min.webp",
  "sweet-sour-chicken":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201514_83e6a9ae-2c9f-4322-b2a6-73aa5278aa99_min.webp",
  "garlic-aubergine":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201524_8872ee21-8adb-4cc6-9b37-576894fb27b9_min.webp",
  "dan-dan-noodles":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201534_7073a447-89b2-4426-95ba-a40abeb0664c_min.webp",
  "beef-chow-fun":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201544_1d2f841f-e5b8-4bee-a6c6-81d88212de1a_min.webp",
  "chicken-chow-mein":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201556_31753eb1-1768-4da8-8d03-45e5ad67d019_min.webp",
  "egg-fried-rice":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201604_037949b7-3a34-4e98-91a4-a30a16a37594_min.webp",
  "salt-pepper-prawns":"https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_20260914_201610_33803932-a638-4acf-8900-b93cca8b7cf1_min.webp"
};
export function getPhase2RecipeAssetV7(recipeId:string){return phase2RecipeAssetsV7[recipeId]}
export function validatePhase2RecipeAssetsV7(){const errors:string[]=[];for(const id of livePhase2RecipeIdsV7){const url=phase2RecipeAssetsV7[id];if(!url)errors.push(`${id}: live recipe has no hero image`);else if(!/^https:\/\//.test(url)&&!url.startsWith("/"))errors.push(`${id}: invalid hero image URL`)}return{valid:errors.length===0,errors,liveRequired:livePhase2RecipeIdsV7.length,assets:Object.keys(phase2RecipeAssetsV7).length}}
