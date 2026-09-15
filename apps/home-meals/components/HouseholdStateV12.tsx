"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {defaultWeek} from "@/data/home-data";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {quantity,type Quantity} from "@/data/food-quantity";
import {createMeasuredPrepBatchV2} from "@/data/food-engine-v2";
import {prepNeedsForRecipesV7} from "@/data/food-engine-v7";
import {shoppingNeedsForPlanV7} from "@/data/ingredient-engine-v7";
import {cookRecipeStateV7,setIngredientStockV7} from "@/data/household-runtime-v7";
import {getHouseholdPrepFormulationV6,getPrepPortionPolicyV6} from "@/data/prep-portioning-v6";
import type {RecipeCookObservationV2} from "@/data/calibration-v2";
import {
 addMeasuredBatchV12,componentStockV12,confirmEmptyKitchenV12,consumeComponentV12,migrateHouseholdV11ToV12,recordCookObservationV12,
 confirmSuggestedWeekV12,clearSuggestedWeekV12,proposeWeekV12,setActivePrepSetV12,setConfirmedWeekV12,setManualComponentStockV12,setPlanPreferencesV12,setQualitativeIngredientLevelV12,toggleActivePrepV12,type HouseholdStateV12,type PlanModeV12,type RatingV12,type RecipeNoteV12,type RecipeVersionV12
} from "@/data/household-v12";

const KEY="home-meals-household-v12",LEGACY_KEY="home-meals-household-v11";
const validRecipeIds=new Set(recipes.map(x=>x.id));
const defaultMonthPool=[...defaultWeek,"gold-chana-masala","curry-laksa","rempah-chicken-rendang","teriyaki-salmon","gochujang-chicken","beef-ragu","pesto-salmon","harissa-chicken-traybake","chipotle-chicken-bowl"].filter((id,i,a)=>validRecipeIds.has(id)&&a.indexOf(id)===i);
const defaults={week:defaultWeek,monthlyPool:defaultMonthPool};

export type HouseholdStateV12Context={
 state:HouseholdStateV12;
 componentStock:ReturnType<typeof componentStockV12>;
 prepNeeds:ReturnType<typeof prepNeedsForRecipesV7>;
 shoppingNeeds:ReturnType<typeof shoppingNeedsForPlanV7>;
 setDay:(index:number,recipeId:string)=>void;
 proposeWeek:(recipeIds:readonly string[])=>void;
 confirmSuggestedWeek:()=>void;
 clearSuggestedWeek:()=>void;
 setConfirmedWeek:(recipeIds:readonly string[])=>void;
 setPlanPreferences:(mode:PlanModeV12,allowExtraPrep?:boolean)=>void;
 toggleMonthlyPool:(recipeId:string)=>void;
 setActivePrepSet:(componentIds:readonly string[])=>void;
 toggleActivePrep:(componentId:string,active?:boolean)=>void;
 setComponentObserved:(componentId:string,value:Quantity)=>void;
 reconcileComponentTotal:(componentId:string,value:Quantity)=>void;
 setIngredientObserved:(ingredientId:string,value:Quantity)=>void;
 setQualitativeIngredientLevel:(ingredientId:string,level:number)=>void;
 recordMeasuredBatch:(componentId:string,measuredOutput:Quantity,recipeVersion:string)=>void;
 recordMeasuredProduction:(componentId:string,measuredOutput:Quantity,recipeVersion:string)=>void;
 /** Legacy convenience for counting already-standardised stored packets. New production UI records measured output directly. */
 recordPortionedProduction:(componentId:string,storagePackets:number,recipeVersion:string)=>void;
 cookMeal:(recipeId:string,variantId?:string)=>boolean;
 logMealWithoutStock:(recipeId:string,variantId?:string)=>void;
 recordCookObservation:(observation:RecipeCookObservationV2)=>void;
 rateMeal:(recipeId:string,who:"josh"|"g",value:number)=>void;
 noteMeal:(recipeId:string,text:string,author?:"josh"|"g"|"home")=>void;
 promoteRecipeVersion:(recipeId:string,summary:string,author?:"josh"|"g"|"home")=>void;
 toggleUseSoon:(ingredientId:string)=>void;
 toggleFavourite:(recipeId:string)=>void;
 toggleGrocery:(ingredientId:string)=>void;
 confirmKitchen:()=>void;
 confirmEmptyKitchen:()=>void;
 clearMigrationWarnings:()=>void;
 resetV12:()=>void;
};

const Ctx=createContext<HouseholdStateV12Context|null>(null);
function freshState(){return migrateHouseholdV11ToV12({},defaults)}
function restoreV12(raw:string):HouseholdStateV12|null{try{const parsed=JSON.parse(raw);if(parsed?.version!==12||!Array.isArray(parsed.week)||!parsed.manualComponentStock||!parsed.ingredientStock)return null;return{...parsed,weekStatus:parsed.weekStatus==="suggested"||parsed.weekStatus==="confirmed"?parsed.weekStatus:"unplanned",suggestedWeek:Array.isArray(parsed.suggestedWeek)&&parsed.suggestedWeek.length===7?parsed.suggestedWeek:null,planMode:["stock","repertoire","both","free"].includes(parsed.planMode)?parsed.planMode:"both",allowExtraPrep:typeof parsed.allowExtraPrep==="boolean"?parsed.allowExtraPrep:true,activePrepIds:Array.isArray(parsed.activePrepIds)?parsed.activePrepIds:[],qualitativeIngredientStock:parsed.qualitativeIngredientStock&&typeof parsed.qualitativeIngredientStock==="object"?parsed.qualitativeIngredientStock:{},cookObservations:Array.isArray(parsed.cookObservations)?parsed.cookObservations:[]} as HouseholdStateV12}catch{return null}}
function uid(prefix:string){return`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}
function historyOnly(prev:HouseholdStateV12,recipeId:string,variantId?:string){return{...prev,history:[{mealId:recipeId,variantId,at:new Date().toISOString()},...prev.history].slice(0,100)}}

export function HouseholdStateV12Provider({children}:{children:React.ReactNode}){
 const[state,setState]=useState<HouseholdStateV12>(freshState),[hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const exact=localStorage.getItem(KEY),restored=exact?restoreV12(exact):null;if(restored)setState(restored);else{const legacyRaw=localStorage.getItem(LEGACY_KEY),legacy=legacyRaw?JSON.parse(legacyRaw):{},migrated=migrateHouseholdV11ToV12(legacy,defaults);setState(migrated);localStorage.setItem(KEY,JSON.stringify(migrated))}}catch{setState(freshState())}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(hydrated)localStorage.setItem(KEY,JSON.stringify(state))},[hydrated,state]);

 const componentStock=useMemo(()=>componentStockV12(state),[state.componentBatches,state.manualComponentStock]);
 const planningWeek=state.weekStatus==="suggested"&&state.suggestedWeek?.length===7?state.suggestedWeek:state.week;
 const prepNeeds=useMemo(()=>prepNeedsForRecipesV7(planningWeek,componentStock),[planningWeek,componentStock]);
 const shoppingNeeds=useMemo(()=>shoppingNeedsForPlanV7(planningWeek.map(recipeId=>({recipeId})),state.ingredientStock,state.qualitativeIngredientStock),[planningWeek,state.ingredientStock,state.qualitativeIngredientStock]);

 const setDay=(index:number,recipeId:string)=>{if(index<0||index>6||!validRecipeIds.has(recipeId))return;setState(prev=>{const base=prev.weekStatus==="suggested"&&prev.suggestedWeek?.length===7?prev.suggestedWeek:prev.week,next=base.map((x,i)=>i===index?recipeId:x);return prev.weekStatus==="confirmed"?setConfirmedWeekV12(prev,next):proposeWeekV12(prev,next)})};
 const proposeWeek=(recipeIds:readonly string[])=>{if(recipeIds.length!==7||recipeIds.some(id=>!validRecipeIds.has(id)))return;setState(prev=>proposeWeekV12(prev,recipeIds))};
 const confirmSuggestedWeek=()=>setState(prev=>confirmSuggestedWeekV12(prev));
 const clearSuggestedWeek=()=>setState(prev=>clearSuggestedWeekV12(prev));
 const setConfirmedWeek=(recipeIds:readonly string[])=>{if(recipeIds.length!==7||recipeIds.some(id=>!validRecipeIds.has(id)))return;setState(prev=>setConfirmedWeekV12(prev,recipeIds))};
 const setPlanPreferences=(mode:PlanModeV12,allowExtraPrep?:boolean)=>setState(prev=>setPlanPreferencesV12(prev,mode,allowExtraPrep??prev.allowExtraPrep));
 const toggleMonthlyPool=(recipeId:string)=>{if(!validRecipeIds.has(recipeId))return;setState(prev=>({...prev,monthlyPool:prev.monthlyPool.includes(recipeId)?prev.monthlyPool.filter(id=>id!==recipeId):[...prev.monthlyPool,recipeId]}))};
 const setActivePrepSet=(componentIds:readonly string[])=>setState(prev=>setActivePrepSetV12(prev,componentIds));
 const toggleActivePrep=(componentId:string,active?:boolean)=>setState(prev=>toggleActivePrepV12(prev,componentId,active));
 const setComponentObserved=(componentId:string,value:Quantity)=>setState(prev=>setManualComponentStockV12(prev,componentId,value));
 const reconcileComponentTotal=(componentId:string,value:Quantity)=>setState(prev=>{const current=componentStockV12(prev)[componentId];if(!current)throw new Error(`Unknown component ${componentId}`);if(current.unit!==value.unit)throw new Error(`Observed unit mismatch for ${componentId}`);if(value.qty<0)throw new Error(`Observed stock cannot be negative for ${componentId}`);if(value.qty<current.qty)return consumeComponentV12(prev,componentId,quantity(current.qty-value.qty,current.unit));const manual=prev.manualComponentStock[componentId]??quantity(0,current.unit);return setManualComponentStockV12(prev,componentId,quantity(manual.qty+(value.qty-current.qty),current.unit))});
 const setIngredientObserved=(ingredientId:string,value:Quantity)=>setState(prev=>{let next=setIngredientStockV7(prev,ingredientId,value);if(value.qty<=0&&next.useSoon[ingredientId]){const useSoon={...next.useSoon,[ingredientId]:false},useSoonAt={...next.useSoonAt};delete useSoonAt[ingredientId];next={...next,useSoon,useSoonAt}}return next});
 const setQualitativeIngredientLevel=(ingredientId:string,level:number)=>setState(prev=>setQualitativeIngredientLevelV12(prev,ingredientId,level));

 const recordMeasuredBatch=(componentId:string,measuredOutput:Quantity,recipeVersion:string)=>setState(prev=>addMeasuredBatchV12(prev,createMeasuredPrepBatchV2({batchId:uid(componentId),componentId,measuredOutput,producedAt:new Date().toISOString(),recipeVersion})));
 const recordMeasuredProduction=(componentId:string,measuredOutput:Quantity,recipeVersion:string)=>setState(prev=>{const formulation=getHouseholdPrepFormulationV6(componentId);if(!formulation)throw new Error(`Missing household prep formulation for ${componentId}`);if(formulation.outputUnit!==measuredOutput.unit)throw new Error(`Measured output unit for ${componentId} must be ${formulation.outputUnit}`);if(!Number.isFinite(measuredOutput.qty)||measuredOutput.qty<=0)throw new Error(`Measured output for ${componentId} must be positive`);let next=prev;for(const parent of formulation.componentInputs)next=consumeComponentV12(next,parent.componentId,quantity(parent.qty,parent.unit));return addMeasuredBatchV12(next,createMeasuredPrepBatchV2({batchId:uid(componentId),componentId,measuredOutput,producedAt:new Date().toISOString(),recipeVersion}))});
 const recordPortionedProduction=(componentId:string,storagePackets:number,recipeVersion:string)=>{const policy=getPrepPortionPolicyV6(componentId);if(!policy||!Number.isFinite(storagePackets)||storagePackets<=0)throw new Error(`Invalid storage packets for ${componentId}`);const packets=Math.max(1,Math.round(storagePackets));recordMeasuredProduction(componentId,quantity(packets*policy.packet.qty,policy.packet.unit),recipeVersion)};
 const cookMeal=(recipeId:string,variantId?:string):boolean=>{if(!validRecipeIds.has(recipeId))return false;try{const next=cookRecipeStateV7(state,recipeId,variantId);setState(next);return true}catch{return false}};
 const logMealWithoutStock=(recipeId:string,variantId?:string)=>{if(validRecipeIds.has(recipeId))setState(prev=>historyOnly(prev,recipeId,variantId))};
 const recordCookObservation=(observation:RecipeCookObservationV2)=>setState(prev=>recordCookObservationV12(prev,observation));

 const rateMeal=(recipeId:string,who:"josh"|"g",value:number)=>{if(!validRecipeIds.has(recipeId)||!Number.isFinite(value))return;setState(prev=>{const rating:RatingV12={...(prev.ratings[recipeId]??{}),[who]:Math.max(1,Math.min(5,value))};return{...prev,ratings:{...prev.ratings,[recipeId]:rating}}})};
 const noteMeal=(recipeId:string,text:string,author:"josh"|"g"|"home"="home")=>{const clean=text.trim();if(!validRecipeIds.has(recipeId)||!clean)return;setState(prev=>{const note:RecipeNoteV12={author,text:clean.slice(0,500),at:new Date().toISOString()};return{...prev,ratings:{...prev.ratings,[recipeId]:{...(prev.ratings[recipeId]??{}),note:clean.slice(0,500)}},recipeNotes:{...prev.recipeNotes,[recipeId]:[note,...(prev.recipeNotes[recipeId]??[])].slice(0,20)}}})};
 const promoteRecipeVersion=(recipeId:string,summary:string,author:"josh"|"g"|"home"="home")=>{const clean=summary.trim();if(!validRecipeIds.has(recipeId)||!clean)return;setState(prev=>{const current=prev.recipeVersions[recipeId]??[];if(current[0]?.summary===clean)return prev;const version:RecipeVersionV12={number:(current[0]?.number??1)+1,summary:clean.slice(0,500),author,at:new Date().toISOString()};return{...prev,recipeVersions:{...prev.recipeVersions,[recipeId]:[version,...current].slice(0,20)}}})};
 const toggleUseSoon=(ingredientId:string)=>setState(prev=>{const next=!prev.useSoon[ingredientId],useSoon={...prev.useSoon,[ingredientId]:next},useSoonAt={...prev.useSoonAt};if(next)useSoonAt[ingredientId]=new Date().toISOString();else delete useSoonAt[ingredientId];return{...prev,useSoon,useSoonAt}});
 const toggleFavourite=(recipeId:string)=>{if(validRecipeIds.has(recipeId))setState(prev=>({...prev,favourites:{...prev.favourites,[recipeId]:!prev.favourites[recipeId]}}))};
 const toggleGrocery=(ingredientId:string)=>setState(prev=>({...prev,groceryChecked:{...prev.groceryChecked,[ingredientId]:!prev.groceryChecked[ingredientId]}}));
 const confirmKitchen=()=>setState(prev=>({...prev,kitchenReady:true}));
 const confirmEmptyKitchen=()=>setState(prev=>confirmEmptyKitchenV12(prev));
 const clearMigrationWarnings=()=>setState(prev=>({...prev,migrationWarnings:[]}));
 const resetV12=()=>setState(freshState());

 const value:HouseholdStateV12Context={state,componentStock,prepNeeds,shoppingNeeds,setDay,proposeWeek,confirmSuggestedWeek,clearSuggestedWeek,setConfirmedWeek,setPlanPreferences,toggleMonthlyPool,setActivePrepSet,toggleActivePrep,setComponentObserved,reconcileComponentTotal,setIngredientObserved,setQualitativeIngredientLevel,recordMeasuredBatch,recordMeasuredProduction,recordPortionedProduction,cookMeal,logMealWithoutStock,recordCookObservation,rateMeal,noteMeal,promoteRecipeVersion,toggleUseSoon,toggleFavourite,toggleGrocery,confirmKitchen,confirmEmptyKitchen,clearMigrationWarnings,resetV12};
 if(!hydrated)return<div aria-label="Loading Home Meals"/>;
 return<Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useHouseholdV12(){const value=useContext(Ctx);if(!value)throw new Error("useHouseholdV12 must be inside HouseholdStateV12Provider");return value}
export{quantity};
