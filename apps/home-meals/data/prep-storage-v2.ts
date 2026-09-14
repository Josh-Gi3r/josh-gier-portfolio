import { canonicalPrepComponentsV2 } from "./food-truth-v2";

export type StorageEvidenceV2=Readonly<{
  label:string;
  url:string;
  role:"safety"|"quality";
}>;

export type PrepStorageV2=Readonly<{
  componentId:string;
  refrigeratorMaxC:4;
  freezerMaxC:-18;
  fridgeDays:number|null;
  fridgeRule:"household_conservative_policy"|"source_specific"|"not_applicable";
  freezerAllowed:boolean;
  freezerQualityDays:number|null;
  pantryAllowed:boolean;
  coolBeforeStorage:boolean;
  thawMethods:readonly ("refrigerator"|"direct_to_pan"|"microwave")[];
  evidence:readonly StorageEvidenceV2[];
  note?:string;
}>;

const SFA:StorageEvidenceV2={label:"Singapore Food Agency — Food Safety Tips",url:"https://www.sfa.gov.sg/food-safety-tips/safe-food-practices/food-safety-tips",role:"safety"};
const NCHFP_GARLIC:StorageEvidenceV2={label:"National Center for Home Food Preservation — Garlic in Oil",url:"https://nchfp.uga.edu/how/freeze/vegetable/freezing-garlic-in-oil/",role:"safety"};
const NCHFP_PESTO:StorageEvidenceV2={label:"National Center for Home Food Preservation — Pesto",url:"https://nchfp.uga.edu/how/freeze/vegetable/freezing-pesto/",role:"safety"};
const JOC_TERI:StorageEvidenceV2={label:"Just One Cookbook — Teriyaki Sauce",url:"https://www.justonecookbook.com/teriyaki-sauce/",role:"quality"};
const ANDREA_NUOC:StorageEvidenceV2={label:"Andrea Nguyen / Saveur — Classic Vietnamese Dipping Sauce",url:"https://www.saveur.com/article/Recipes/Classic-Vietnamese-Dipping-Sauce/",role:"quality"};

const sourceSpecific:Readonly<Record<string,Partial<PrepStorageV2>>>={
  "garlic":{fridgeDays:4,fridgeRule:"source_specific",evidence:[NCHFP_GARLIC,SFA],note:"Garlic-in-oil mixtures are refrigerated no more than four days; freeze for longer storage."},
  "ginger-garlic":{fridgeDays:4,fridgeRule:"source_specific",evidence:[NCHFP_GARLIC,SFA],note:"Conservative garlic-in-oil rule applied because the formulation contains garlic and oil."},
  "pesto":{fridgeDays:3,fridgeRule:"source_specific",evidence:[NCHFP_PESTO,SFA],note:"Fresh pesto has a short refrigerator window; freeze promptly for longer keeping."},
  "ginger-scallion":{fridgeDays:4,fridgeRule:"source_specific",evidence:[NCHFP_GARLIC,SFA],note:"Home applies the conservative raw-aromatic-in-oil refrigerator rule."},
  "teriyaki":{fridgeDays:21,fridgeRule:"source_specific",evidence:[JOC_TERI,SFA],note:"Just One Cookbook gives a 2–3 week refrigerator window for its cooked teriyaki sauce."},
  "nuoc-cham":{fridgeDays:14,fridgeRule:"source_specific",evidence:[ANDREA_NUOC,SFA],note:"This is the make-ahead fish-sauce/sugar/water base; fresh lime, garlic and chilli are added at service."},
  "massaman-finish":{fridgeDays:null,fridgeRule:"not_applicable",freezerAllowed:false,pantryAllowed:true,coolBeforeStorage:false,thawMethods:[],evidence:[],note:"Dry spice blend; store airtight in the pantry. Household best-quality duration is not asserted here."},
};

export const prepStorageV2:readonly PrepStorageV2[]=canonicalPrepComponentsV2.map(component=>{
  const override=sourceSpecific[component.id]??{};
  const pantry=component.storageMode==="pantry-first";
  const freezerAllowed=!pantry&&component.storageMode!=="fridge-first"?true:component.id==="teriyaki"||component.id==="nuoc-cham"?false:true;
  const base:PrepStorageV2={
    componentId:component.id,
    refrigeratorMaxC:4,
    freezerMaxC:-18,
    fridgeDays:pantry?null:3,
    fridgeRule:pantry?"not_applicable":"household_conservative_policy",
    freezerAllowed,
    freezerQualityDays:null,
    pantryAllowed:pantry,
    coolBeforeStorage:!pantry,
    thawMethods:pantry?[]:["refrigerator","direct_to_pan"],
    evidence:pantry?[]:[SFA],
    note:pantry?"Pantry item; do not invent a refrigerator/freezer life.":"Home uses a conservative three-day refrigerator policy unless a stronger component-specific source overrides it. Freezer best-quality duration remains unknown until validated.",
  };
  return {...base,...override,componentId:component.id,refrigeratorMaxC:4,freezerMaxC:-18} as PrepStorageV2;
});

export const prepStorageByIdV2=new Map(prepStorageV2.map(x=>[x.componentId,x]));
export function getPrepStorageV2(componentId:string){return prepStorageByIdV2.get(componentId)}

export function validatePrepStorageV2(){
  const errors:string[]=[];
  if(prepStorageV2.length!==41)errors.push(`expected 41 storage records, found ${prepStorageV2.length}`);
  const ids=new Set(prepStorageV2.map(x=>x.componentId));if(ids.size!==prepStorageV2.length)errors.push("duplicate storage record");
  for(const record of prepStorageV2){
    if(record.fridgeDays!=null&&record.fridgeDays<0)errors.push(`${record.componentId} has invalid fridgeDays`);
    if(record.freezerQualityDays!=null&&record.freezerQualityDays<0)errors.push(`${record.componentId} has invalid freezerQualityDays`);
    if(record.freezerQualityDays!=null&&!record.evidence.some(x=>x.role==="quality"))errors.push(`${record.componentId} has unsourced freezer quality duration`);
  }
  return {valid:errors.length===0,errors};
}
