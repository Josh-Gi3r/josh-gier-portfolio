"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {getComponent,getIngredient,ingredients,recipes} from "@/data/home-data";
import {quantity,type QuantityUnit} from "@/data/food-quantity";
import {getCanonicalPrepV2} from "@/data/food-truth-v2";
import {canonicalIngredientKeyV2,getCanonicalIngredientV2} from "@/data/ingredient-catalog-v2";
import type {PrepBatchV2} from "@/data/food-engine-v2";
import type {RecipeCookObservationV2} from "@/data/calibration-v2";
import {HouseholdStateV12Provider,useHouseholdV12} from "./HouseholdStateV12";

export type Rating={josh?:number;g?:number;note?:string};
export type RecipeNote={author:"josh"|"g"|"home";text:string;at:string};
export type RecipeVersion={number:number;summary:string;author:"josh"|"g"|"home";at:string};
export type MealPhoto={mealId:string;dataUrl:string;at:string};
export type PrepBatchUi=PrepBatchV2&{outputMl:number;remainingMl:number;at:string;unit:QuantityUnit};
export type PrepNeedCompat={id:string;unit:QuantityUnit;neededQty:number;onHandQty:number;shortQty:number;needed:number;onHand:number;short:number;runs:number;neededMl:number;onHandMl:number;shortMl:number;batches:number};
export type ShoppingNeedCompat={id:string;canonicalId:string;qty:number;unit:QuantityUnit|"have";requiredQty:number;onHandQty:number};

const PHOTOS_KEY="home-meals-meal-photos-v1";
const validRecipeIds=new Set(recipes.map(x=>x.id));
const legacyToCanonical:Record<string,string>={eggs:"egg-large","basmati-rice":"basmati-rice-dry","jasmine-rice":"jasmine-rice-dry",rice:"jasmine-rice-dry",beef:"beef-sirloin","ground-meat":"ground-chicken",mushrooms:"mushroom",onion:"onion-yellow",potatoes:"potato",chickpeas:"chickpeas-drained",tortillas:"tortilla",butter:"butter-unsalted","spring-onion":"spring-onion"};
const canonicalToLegacy:Record<string,string>={"egg-large":"eggs","basmati-rice-dry":"basmati-rice","jasmine-rice-dry":"jasmine-rice","beef-sirloin":"beef","ground-chicken":"ground-meat",mushroom:"mushrooms","onion-yellow":"onion",potato:"potatoes","chickpeas-drained":"chickpeas",tortilla:"tortillas","butter-unsalted":"butter"};
function canonicalIdForUi(id:string,unit?:string){const mapped=legacyToCanonical[id]??id;if(unit==="g"||unit==="ml"||unit==="count")return canonicalIngredientKeyV2(mapped,unit);return mapped}
function uiIdForCanonical(id:string){return canonicalToLegacy[id]??id}
function safePhotos(raw:string|null):MealPhoto[]{if(!raw)return[];try{const value=JSON.parse(raw);if(!Array.isArray(value))return[];const seen=new Set<string>();return value.filter((p:any)=>p&&validRecipeIds.has(p.mealId)&&typeof p.dataUrl==="string"&&p.dataUrl.startsWith("data:image/")&&p.dataUrl.length<900000).map((p:any)=>({mealId:p.mealId,dataUrl:p.dataUrl,at:p.at||new Date().toISOString()})).filter((p:MealPhoto)=>{if(seen.has(p.mealId))return false;seen.add(p.mealId);return true}).slice(0,8)}catch{return[]}}

export type HouseholdUiState={
 week:string[];monthlyPool:string[];componentStock:Record<string,number>;ingredientStock:Record<string,number>;groceryChecked:Record<string,boolean>;ratings:Record<string,Rating>;recipeNotes:Record<string,RecipeNote[]>;recipeVersions:Record<string,RecipeVersion[]>;mealPhotos:MealPhoto[];history:{mealId:string;variantId?:string;at:string}[];prepBatches:PrepBatchUi[];kitchenReady:boolean;useSoon:Record<string,boolean>;useSoonAt:Record<string,string>;favourites:Record<string,boolean>;storageIssue:boolean;migrationWarnings:string[];
 prepNeeds:PrepNeedCompat[];shoppingNeeds:ShoppingNeedCompat[];
 setDay:(index:number,mealId:string)=>void;toggleMonthlyPool:(recipeId:string)=>void;setComponent:(id:string,qty:number)=>void;setIngredient:(id:string,qty:number)=>void;toggleGrocery:(id:string)=>void;makeBatch:(id:string)=>void;recordMeasuredProduction:(id:string,qty:number,unit?:QuantityUnit)=>void;cookMeal:(mealId:string,variantId?:string)=>void;recordCookObservation:(observation:RecipeCookObservationV2)=>void;rateMeal:(mealId:string,who:"josh"|"g",value:number)=>void;noteMeal:(mealId:string,note:string,author?:"josh"|"g"|"home")=>void;promoteRecipeVersion:(mealId:string,summary:string,author?:"josh"|"g"|"home")=>void;saveMealPhoto:(mealId:string,dataUrl:string)=>void;confirmKitchen:()=>void;toggleUseSoon:(id:string)=>void;toggleFavourite:(recipeId:string)=>void;clearStorageIssue:()=>void;resetDemo:()=>void;
};
const Ctx=createContext<HouseholdUiState|null>(null);

function Bridge({children}:{children:React.ReactNode}){
 const v=useHouseholdV12();const[mealPhotos,setMealPhotos]=useState<MealPhoto[]>([]);const[storageIssue,setStorageIssue]=useState(false);
 useEffect(()=>{try{setMealPhotos(safePhotos(localStorage.getItem(PHOTOS_KEY)))}catch{setStorageIssue(true)}},[]);
 useEffect(()=>{try{localStorage.setItem(PHOTOS_KEY,JSON.stringify(mealPhotos));setStorageIssue(false)}catch{setStorageIssue(true)}},[mealPhotos]);
 const componentStock=useMemo(()=>Object.fromEntries(Object.entries(v.componentStock).map(([id,q])=>[id,q.qty])),[v.componentStock]);
 const ingredientStock=useMemo(()=>{const out:Record<string,number>={};for(const[id,q]of Object.entries(v.state.ingredientStock))out[uiIdForCanonical(id)]=q.qty;for(const item of ingredients){if(item.tracking==="state")out[item.id]=v.state.qualitativeIngredientStock?.[item.id]??0;else{const key=canonicalIdForUi(item.id,item.unit),q=v.state.ingredientStock[key];if(q)out[item.id]=q.qty}}return out},[v.state.ingredientStock,v.state.qualitativeIngredientStock]);
 const useSoon=useMemo(()=>Object.fromEntries(Object.entries(v.state.useSoon).map(([id,value])=>[uiIdForCanonical(id),value])),[v.state.useSoon]);
 const useSoonAt=useMemo(()=>Object.fromEntries(Object.entries(v.state.useSoonAt).map(([id,value])=>[uiIdForCanonical(id),value])),[v.state.useSoonAt]);
 const groceryChecked=useMemo(()=>Object.fromEntries(Object.entries(v.state.groceryChecked).map(([id,value])=>[uiIdForCanonical(id),value])),[v.state.groceryChecked]);
 const prepNeeds=useMemo<PrepNeedCompat[]>(()=>v.prepNeeds.map(n=>{const c=getCanonicalPrepV2(n.componentId),standard=Math.max(1,c?.workingUnit.qty??1);return{id:n.componentId,unit:n.shortfall.unit,neededQty:n.required.qty,onHandQty:n.onHand.qty,shortQty:n.shortfall.qty,needed:Math.ceil(n.required.qty/standard),onHand:Math.floor(n.onHand.qty/standard),short:Math.ceil(n.shortfall.qty/standard),runs:n.shortfall.qty>0?1:0,neededMl:n.required.qty,onHandMl:n.onHand.qty,shortMl:n.shortfall.qty,batches:n.shortfall.qty>0?1:0}}),[v.prepNeeds]);
 const shoppingNeeds=useMemo<ShoppingNeedCompat[]>(()=>v.shoppingNeeds.map(n=>({id:uiIdForCanonical(n.ingredientId),canonicalId:n.ingredientId,qty:n.shortfall.qty,unit:n.shortfall.unit,requiredQty:n.required.qty,onHandQty:n.onHand.qty})),[v.shoppingNeeds]);
 const prepBatches=useMemo<PrepBatchUi[]>(()=>v.state.componentBatches.map(b=>({...b,outputMl:b.initial.qty,remainingMl:b.remaining.qty,at:b.producedAt,unit:b.initial.unit})),[v.state.componentBatches]);

 const setComponent=(id:string,requested:number)=>{const c=getCanonicalPrepV2(id);if(!c)return;const current=componentStock[id]??0,legacyStep=getComponent(id)?.portionMl??c.workingUnit.qty,delta=requested-current;const normalized=Math.abs(Math.abs(delta)-legacyStep)<1e-9&&legacyStep!==c.workingUnit.qty?current+Math.sign(delta)*c.workingUnit.qty:requested;v.reconcileComponentTotal(id,quantity(Math.max(0,normalized),c.workingUnit.unit))};
 const setIngredient=(id:string,qty:number)=>{const item=getIngredient(id);if(item?.tracking==="state"){v.setQualitativeIngredientLevel(id,qty);return}const key=canonicalIdForUi(id,item?.unit),def=getCanonicalIngredientV2(key);if(!def){setStorageIssue(true);return}v.setIngredientObserved(key,quantity(Math.max(0,qty),def.canonicalUnit))};
 const toggleGrocery=(id:string)=>v.toggleGrocery(canonicalIdForUi(id,getIngredient(id)?.unit));
 const toggleUseSoon=(id:string)=>v.toggleUseSoon(canonicalIdForUi(id,getIngredient(id)?.unit));
 const makeBatch=(_id:string)=>{console.warn("Home Meals v12 requires a measured finished output before prep enters Kitchen stock.")};
 const recordMeasuredProduction=(id:string,qty:number,unit?:QuantityUnit)=>{const c=getCanonicalPrepV2(id);if(!c||!(qty>0))return;v.recordMeasuredProduction(id,quantity(qty,unit??c.workingUnit.unit),"culinary-verified-v2")};
 const saveMealPhoto=(mealId:string,dataUrl:string)=>{if(!validRecipeIds.has(mealId)||!dataUrl.startsWith("data:image/")||dataUrl.length>=900000){setStorageIssue(true);return}setMealPhotos(prev=>[{mealId,dataUrl,at:new Date().toISOString()},...prev.filter(p=>p.mealId!==mealId)].slice(0,8))};
 const resetDemo=()=>{v.resetV12();setMealPhotos([]);try{localStorage.removeItem(PHOTOS_KEY)}catch{}setStorageIssue(false)};const clearStorageIssue=()=>setStorageIssue(false);
 const value:HouseholdUiState={week:v.state.week,monthlyPool:v.state.monthlyPool,componentStock,ingredientStock,groceryChecked,ratings:v.state.ratings,recipeNotes:v.state.recipeNotes,recipeVersions:v.state.recipeVersions,mealPhotos,history:v.state.history,prepBatches,kitchenReady:v.state.kitchenReady,useSoon,useSoonAt,favourites:v.state.favourites,storageIssue,migrationWarnings:v.state.migrationWarnings,prepNeeds,shoppingNeeds,setDay:v.setDay,toggleMonthlyPool:v.toggleMonthlyPool,setComponent,setIngredient,toggleGrocery,makeBatch,recordMeasuredProduction,cookMeal:v.cookMeal,recordCookObservation:v.recordCookObservation,rateMeal:v.rateMeal,noteMeal:v.noteMeal,promoteRecipeVersion:v.promoteRecipeVersion,saveMealPhoto,confirmKitchen:v.confirmKitchen,toggleUseSoon,toggleFavourite:v.toggleFavourite,clearStorageIssue,resetDemo};
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function HouseholdStateProvider({children}:{children:React.ReactNode}){return <HouseholdStateV12Provider><Bridge>{children}</Bridge></HouseholdStateV12Provider>}
export function useHousehold(){const v=useContext(Ctx);if(!v)throw new Error("useHousehold must be inside HouseholdStateProvider");return v}
