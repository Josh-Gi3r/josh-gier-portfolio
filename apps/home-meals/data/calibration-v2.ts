import type { Quantity } from "./food-quantity";
import type { PrepBatchV2 } from "./food-engine-v2";

export type ComponentCalibrationV2=Readonly<{
  componentId:string;
  status:"unmeasured"|"measured_once"|"household_calibrated";
  observationCount:number;
  observedOutputs:readonly Quantity[];
  observedMean:Quantity|null;
  observedRange:{min:Quantity;max:Quantity}|null;
  relativeSpreadPct:number|null;
}>;

/**
 * Calibration is derived only from actual household batch observations.
 * No research target is used. Two or more same-version outputs within maxSpreadPct
 * may be promoted to household_calibrated.
 */
export function componentCalibrationFromBatchesV2(componentId:string,batches:readonly PrepBatchV2[],maxSpreadPct=5):ComponentCalibrationV2{
  const observations=batches.filter(b=>b.componentId===componentId&&b.initial.qty>0);
  if(!observations.length)return{componentId,status:"unmeasured",observationCount:0,observedOutputs:[],observedMean:null,observedRange:null,relativeSpreadPct:null};
  const unit=observations[0].initial.unit;
  if(observations.some(b=>b.initial.unit!==unit))throw new Error(`Calibration unit mismatch for ${componentId}`);
  const values=observations.map(b=>b.initial.qty),min=Math.min(...values),max=Math.max(...values),mean=values.reduce((a,b)=>a+b,0)/values.length;
  const spread=mean>0?((max-min)/mean)*100:0;
  return{componentId,status:observations.length>=2&&spread<=maxSpreadPct?"household_calibrated":"measured_once",observationCount:observations.length,observedOutputs:observations.map(b=>b.initial),observedMean:{qty:mean,unit},observedRange:{min:{qty:min,unit},max:{qty:max,unit}},relativeSpreadPct:spread};
}

export type RecipeCookObservationV2=Readonly<{
  observationId:string;
  recipeId:string;
  variantId?:string;
  cookedAt:string;
  activeMinutes:number|null;
  totalMinutes:number|null;
  finishedWeightG:number|null;
  joshPlateWeightG:number|null;
  gPlateWeightG:number|null;
  leftoverWeightG:number|null;
  joshRating:number|null;
  gRating:number|null;
  heatFeedback:{josh?:number;g?:number}|null;
  note?:string;
}>;

export function validateCookObservationV2(value:RecipeCookObservationV2){
  const errors:string[]=[];
  if(!value.observationId.trim())errors.push("observationId required");
  if(!value.recipeId.trim())errors.push("recipeId required");
  if(Number.isNaN(Date.parse(value.cookedAt)))errors.push("valid cookedAt required");
  for(const [label,n] of [["activeMinutes",value.activeMinutes],["totalMinutes",value.totalMinutes],["finishedWeightG",value.finishedWeightG],["joshPlateWeightG",value.joshPlateWeightG],["gPlateWeightG",value.gPlateWeightG],["leftoverWeightG",value.leftoverWeightG]] as const)if(n!=null&&(!(n>=0)||!Number.isFinite(n)))errors.push(`${label} must be non-negative`);
  for(const [label,n] of [["joshRating",value.joshRating],["gRating",value.gRating]] as const)if(n!=null&&(n<1||n>5))errors.push(`${label} must be 1–5`);
  const knownWeights=[value.joshPlateWeightG,value.gPlateWeightG,value.leftoverWeightG].filter((x):x is number=>x!=null);
  if(value.finishedWeightG!=null&&knownWeights.length===3&&Math.abs(knownWeights.reduce((a,b)=>a+b,0)-value.finishedWeightG)>5)errors.push("plate + leftover weights do not reconcile with finished weight");
  return{valid:errors.length===0,errors};
}

export function recipeObservationSummaryV2(recipeId:string,observations:readonly RecipeCookObservationV2[]){
  const rows=observations.filter(x=>x.recipeId===recipeId);
  const mean=(values:(number|null)[])=>{const clean=values.filter((x):x is number=>x!=null);return clean.length?clean.reduce((a,b)=>a+b,0)/clean.length:null};
  return{recipeId,cookCount:rows.length,meanTotalMinutes:mean(rows.map(x=>x.totalMinutes)),meanFinishedWeightG:mean(rows.map(x=>x.finishedWeightG)),meanJoshPlateWeightG:mean(rows.map(x=>x.joshPlateWeightG)),meanGPlateWeightG:mean(rows.map(x=>x.gPlateWeightG)),meanLeftoverWeightG:mean(rows.map(x=>x.leftoverWeightG)),meanJoshRating:mean(rows.map(x=>x.joshRating)),meanGRating:mean(rows.map(x=>x.gRating))};
}
