export type HouseholdPerson="josh"|"g";
export type RecipePromotionState="researched"|"source_verified"|"kitchen_calibrated"|"household_tested"|"household_approved";
export type PreferenceDimension="heat"|"salt"|"sweetness"|"acidity"|"portion"|"ingredient"|"texture";

export type PreferenceEvidenceV2=Readonly<{
  person:HouseholdPerson;
  recipeId:string;
  dimension:PreferenceDimension;
  value:number;
  note?:string;
  observedAt:string;
}>;

export type HouseholdRecipeMemoryV2=Readonly<{
  recipeId:string;
  joshRating?:number;
  gRating?:number;
  favourite?:boolean;
  promotionState:RecipePromotionState;
  activeVersion:number;
  evidence:readonly PreferenceEvidenceV2[];
}>;

const promotionOrder:RecipePromotionState[]=["researched","source_verified","kitchen_calibrated","household_tested","household_approved"];

export function promoteRecipeStateV2(current:RecipePromotionState,next:RecipePromotionState):RecipePromotionState{
  if(promotionOrder.indexOf(next)<promotionOrder.indexOf(current))throw new Error(`Cannot demote recipe state from ${current} to ${next}`);
  return next;
}

export function combinedCoupleRatingV2(memory:HouseholdRecipeMemoryV2):number|null{
  const values=[memory.joshRating,memory.gRating].filter((x):x is number=>Number.isFinite(x));
  return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
}

export function preferenceEvidenceSummaryV2(memory:HouseholdRecipeMemoryV2,person:HouseholdPerson,dimension:PreferenceDimension){
  const rows=memory.evidence.filter(x=>x.person===person&&x.dimension===dimension);
  if(!rows.length)return {evidenceCount:0,mean:null,lastObservedAt:null};
  return {
    evidenceCount:rows.length,
    mean:rows.reduce((sum,row)=>sum+row.value,0)/rows.length,
    lastObservedAt:[...rows].sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt))[0]?.observedAt??null,
  };
}

export function addPreferenceEvidenceV2(memory:HouseholdRecipeMemoryV2,evidence:PreferenceEvidenceV2):HouseholdRecipeMemoryV2{
  if(evidence.recipeId!==memory.recipeId)throw new Error("Preference evidence recipe mismatch");
  if(!Number.isFinite(evidence.value))throw new Error("Preference evidence value must be finite");
  if(Number.isNaN(Date.parse(evidence.observedAt)))throw new Error("Preference evidence requires a valid observedAt timestamp");
  return {...memory,evidence:[evidence,...memory.evidence].slice(0,100)};
}

export function shouldApplyPreferenceAutomaticallyV2(memory:HouseholdRecipeMemoryV2,person:HouseholdPerson,dimension:PreferenceDimension):boolean{
  const summary=preferenceEvidenceSummaryV2(memory,person,dimension);
  return summary.evidenceCount>=2;
}
