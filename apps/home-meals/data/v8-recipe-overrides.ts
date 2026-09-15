import {phase2ResearchRecipesV5} from "./phase2-research-registry-v5";

export type Phase2ResearchRecipeV8=(typeof phase2ResearchRecipesV5)[number];
const clone=(r:Phase2ResearchRecipeV8):any=>({...r,ingredients:r.ingredients.map(x=>({...x})),prep:r.prep.map(x=>({...x})),steps:r.steps.map(x=>({...x})),evidence:r.evidence.map(x=>({...x}))});
const setQty=(r:any,id:string,qty:number)=>{const x=r.ingredients.find((x:any)=>x.id===id);if(x)x.qty=qty};
const removeIngredient=(r:any,id:string)=>{r.ingredients=r.ingredients.filter((x:any)=>x.id!==id)};
const addPrep=(r:any,componentId:string,qty:number,unit:"g"|"ml"|"count")=>{if(!r.prep.some((x:any)=>x.componentId===componentId))r.prep.push({componentId,qty,unit})};

export function phase2RecipeV8(recipe:Phase2ResearchRecipeV8):Phase2ResearchRecipeV8{
 const r=clone(recipe);
 if(["butter-chicken","chicken-korma","chicken-tikka-masala"].includes(r.id)){
  removeIngredient(r,"ginger-garlic-paste");addPrep(r,"ginger-garlic",20,"g");
  r.steps=r.steps.map((x:any)=>({...x,instruction:String(x.instruction).replace(/ginger-garlic/gi,"measured GG")}));
 }
 if(r.id==="beef-rendang"){
  setQty(r,"beef-chuck",700);setQty(r,"coconut-milk",300);setQty(r,"tamarind-paste",25);setQty(r,"palm-sugar",20);setQty(r,"kerisik",60);
  if(!r.evidence.some((x:any)=>/rasamalaysia/.test(x.url)))r.evidence.push({label:"Rasa Malaysia — Beef Rendang",url:"https://rasamalaysia.com/beef-rendang-recipe-rendang-daging/",role:"culinary_reference"});
 }
 if(r.id==="kari-ayam-malaysia"){setQty(r,"chicken-thigh",750);setQty(r,"coconut-milk",300)}
 if(r.id==="hainanese-chicken-rice")setQty(r,"jasmine-rice-dry",320);
 if(r.id==="thit-kho")setQty(r,"pork-belly",750);
 return r as Phase2ResearchRecipeV8;
}

export const phase2OperationalResearchRecipesV8:readonly Phase2ResearchRecipeV8[]=phase2ResearchRecipesV5.map(phase2RecipeV8);
export const phase2OperationalResearchRecipeByIdV8=new Map(phase2OperationalResearchRecipesV8.map(x=>[x.id,x]));
export function getPhase2OperationalResearchRecipeV8(id:string){return phase2OperationalResearchRecipeByIdV8.get(id)}
