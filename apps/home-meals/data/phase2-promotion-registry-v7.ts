import {phase2ResearchRecipesV5} from "./phase2-research-registry-v5";

export type PromotionWaveStateV7="formulation_locked"|"promotion_ready"|"live";
export type PromotionWaveIdV7="chinese"|"indian"|"thai"|"malaysia-sg-id"|"vietnamese"|"japanese"|"korean"|"middle-east-med"|"italian-european"|"mexican-latin"|"everyday";

const specs:readonly {id:PromotionWaveIdV7;label:string;count:number}[]=[
 {id:"chinese",label:"Chinese",count:15},
 {id:"indian",label:"Indian",count:10},
 {id:"thai",label:"Thai",count:8},
 {id:"malaysia-sg-id",label:"Malaysia / Singapore / Indonesia",count:10},
 {id:"vietnamese",label:"Vietnamese",count:6},
 {id:"japanese",label:"Japanese",count:8},
 {id:"korean",label:"Korean",count:8},
 {id:"middle-east-med",label:"Middle Eastern / Mediterranean",count:8},
 {id:"italian-european",label:"Italian / European",count:8},
 {id:"mexican-latin",label:"Mexican / Latin",count:6},
 {id:"everyday",label:"Breakfast / lunch / everyday",count:13},
] as const;

/** Machine-readable promotion ledger. A wave is live only after its complete gate, including final imagery, passes. */
export const promotionWaveStateV7:Readonly<Record<PromotionWaveIdV7,PromotionWaveStateV7>>={
 chinese:"live",
 indian:"formulation_locked",
 thai:"formulation_locked",
 "malaysia-sg-id":"formulation_locked",
 vietnamese:"formulation_locked",
 japanese:"formulation_locked",
 korean:"formulation_locked",
 "middle-east-med":"formulation_locked",
 "italian-european":"formulation_locked",
 "mexican-latin":"formulation_locked",
 everyday:"formulation_locked",
} as const;

let offset=0;
export const promotionWavesV7=specs.map(spec=>{const recipes=phase2ResearchRecipesV5.slice(offset,offset+spec.count);offset+=spec.count;return{...spec,recipeIds:recipes.map(x=>x.id),state:promotionWaveStateV7[spec.id]} as const});
export const phase2PromotionWaveByRecipeIdV7=new Map(promotionWavesV7.flatMap(w=>w.recipeIds.map(id=>[id,w] as const)));
export function promotionStatusForPhase2RecipeV7(recipeId:string):PromotionWaveStateV7|undefined{return phase2PromotionWaveByRecipeIdV7.get(recipeId)?.state}
export function isPhase2LiveV7(recipeId:string){return promotionStatusForPhase2RecipeV7(recipeId)==="live"}
export const livePhase2RecipeIdsV7=promotionWavesV7.filter(w=>w.state==="live").flatMap(w=>w.recipeIds);
export const promotionReadyPhase2RecipeIdsV7=promotionWavesV7.filter(w=>w.state==="promotion_ready").flatMap(w=>w.recipeIds);

export function validatePromotionRegistryV7(){
 const errors:string[]=[];const ids=promotionWavesV7.flatMap(x=>x.recipeIds),unique=new Set(ids);
 if(offset!==100)errors.push(`Wave counts total ${offset}, expected 100`);if(ids.length!==100)errors.push(`Wave registry contains ${ids.length}, expected 100`);if(unique.size!==100)errors.push(`Wave registry has duplicate recipe IDs`);
 const researchIds=new Set(phase2ResearchRecipesV5.map(x=>x.id));for(const id of ids)if(!researchIds.has(id))errors.push(`Unknown research recipe ${id}`);for(const id of researchIds)if(!unique.has(id))errors.push(`Research recipe missing from promotion waves: ${id}`);
 return{valid:errors.length===0,errors,total:ids.length,live:livePhase2RecipeIdsV7.length,promotionReady:promotionReadyPhase2RecipeIdsV7.length};
}
