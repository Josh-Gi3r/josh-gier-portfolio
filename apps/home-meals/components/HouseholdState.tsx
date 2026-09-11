"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultWeek, getIngredient, initialComponentStock, initialIngredientStock, recipes, shoppingNeedsForWeek } from "@/data/home-data";
import { batchOutputMl, componentConsumptionMl, ingredientConsumptionExact, prepNeedsForWeekMl } from "@/data/stock-math";

type Rating={josh?:number;g?:number;note?:string};
type RecipeNote={author:"josh"|"g"|"home";text:string;at:string};
type CookEvent={mealId:string;at:string};
type HouseholdState={
 week:string[]; componentStock:Record<string,number>; ingredientStock:Record<string,number>; groceryChecked:Record<string,boolean>; ratings:Record<string,Rating>; recipeNotes:Record<string,RecipeNote[]>; history:CookEvent[]; kitchenReady:boolean;
 prepNeeds:ReturnType<typeof prepNeedsForWeekMl>; shoppingNeeds:ReturnType<typeof shoppingNeedsForWeek>;
 setDay:(index:number,mealId:string)=>void; setComponent:(id:string,ml:number)=>void; setIngredient:(id:string,qty:number)=>void; toggleGrocery:(id:string)=>void; makeBatch:(id:string)=>void; cookMeal:(mealId:string)=>void; rateMeal:(mealId:string,who:"josh"|"g",value:number)=>void; noteMeal:(mealId:string,note:string,author?:"josh"|"g"|"home")=>void; confirmKitchen:()=>void; resetDemo:()=>void;
};
const Ctx=createContext<HouseholdState|null>(null);
const KEY="home-meals-household-v6";
const LEGACY_KEYS=["home-meals-household-v5","home-meals-household-v4","home-meals-linked-v3"];
const validRecipeIds=new Set(recipes.map(x=>x.id));

export function HouseholdStateProvider({children}:{children:React.ReactNode}){
 const [week,setWeek]=useState<string[]>(defaultWeek);
 const [componentStock,setComponentStock]=useState<Record<string,number>>(initialComponentStock); // millilitres
 const [ingredientStock,setIngredientStock]=useState<Record<string,number>>(initialIngredientStock);
 const [groceryChecked,setGroceryChecked]=useState<Record<string,boolean>>({});
 const [ratings,setRatings]=useState<Record<string,Rating>>({});
 const [recipeNotes,setRecipeNotes]=useState<Record<string,RecipeNote[]>>({});
 const [history,setHistory]=useState<CookEvent[]>([]);
 const [kitchenReady,setKitchenReady]=useState(false);
 const [hydrated,setHydrated]=useState(false);

 useEffect(()=>{try{
  const exact=localStorage.getItem(KEY);const legacy=!exact?LEGACY_KEYS.map(k=>localStorage.getItem(k)).find(Boolean):null;const raw=exact??legacy;
  if(raw){const s=JSON.parse(raw);
   if(Array.isArray(s.week)){const migrated=s.week.filter((x:string)=>validRecipeIds.has(x));setWeek(migrated.length===7?migrated:defaultWeek)}
   // Only V6 stock is trusted: older versions stored fake demo counts, not real ml.
   if(exact){if(s.componentStock)setComponentStock({...initialComponentStock,...s.componentStock});if(s.ingredientStock)setIngredientStock({...initialIngredientStock,...s.ingredientStock});setKitchenReady(!!s.kitchenReady)}
   if(s.groceryChecked)setGroceryChecked(s.groceryChecked);
   if(s.ratings){setRatings(s.ratings);const notes:Record<string,RecipeNote[]>={};for(const [id,r] of Object.entries(s.ratings as Record<string,Rating>)){if(r.note)notes[id]=[{author:"home",text:r.note,at:new Date().toISOString()}]}setRecipeNotes(s.recipeNotes??notes)}
   if(s.recipeNotes)setRecipeNotes(s.recipeNotes);
   if(s.history)setHistory((s.history as CookEvent[]).filter(x=>validRecipeIds.has(x.mealId)));
  }
 }catch{}finally{setHydrated(true)}},[]);

 useEffect(()=>{if(!hydrated)return;localStorage.setItem(KEY,JSON.stringify({version:6,week,componentStock,ingredientStock,groceryChecked,ratings,recipeNotes,history,kitchenReady}))},[hydrated,week,componentStock,ingredientStock,groceryChecked,ratings,recipeNotes,history,kitchenReady]);

 const prepNeeds=useMemo(()=>prepNeedsForWeekMl(week,componentStock),[week,componentStock]);
 const shoppingNeeds=useMemo(()=>shoppingNeedsForWeek(week,ingredientStock),[week,ingredientStock]);
 const setDay=(index:number,mealId:string)=>{if(!validRecipeIds.has(mealId))return;setWeek(prev=>prev.map((x,i)=>i===index?mealId:x));setGroceryChecked({})};
 const setComponent=(id:string,ml:number)=>{setComponentStock(prev=>({...prev,[id]:Math.max(0,ml)}));setKitchenReady(true)};
 const setIngredient=(id:string,qty:number)=>{setIngredientStock(prev=>({...prev,[id]:Math.max(0,qty)}));setKitchenReady(true)};
 const toggleGrocery=(id:string)=>setGroceryChecked(prev=>({...prev,[id]:!prev[id]}));
 const makeBatch=(id:string)=>{const ml=batchOutputMl(id);if(!ml)return;setComponentStock(prev=>({...prev,[id]:(prev[id]??0)+ml}));setKitchenReady(true)};
 const cookMeal=(mealId:string)=>{if(!validRecipeIds.has(mealId))return;setComponentStock(prev=>{const next={...prev};for(const req of componentConsumptionMl(mealId))next[req.id]=Math.max(0,(next[req.id]??0)-req.ml);return next});setIngredientStock(prev=>{const next={...prev};for(const req of ingredientConsumptionExact(mealId)){const def=getIngredient(req.id);if(def?.tracking==="state")continue;next[req.id]=Math.max(0,(next[req.id]??0)-req.qty)}return next});setHistory(prev=>[{mealId,at:new Date().toISOString()},...prev].slice(0,100));setKitchenReady(true)};
 const rateMeal=(mealId:string,who:"josh"|"g",value:number)=>setRatings(prev=>({...prev,[mealId]:{...(prev[mealId]??{}),[who]:value}}));
 const noteMeal=(mealId:string,note:string,author:"josh"|"g"|"home"="home")=>{const clean=note.trim();setRatings(prev=>({...prev,[mealId]:{...(prev[mealId]??{}),note:clean}}));if(clean)setRecipeNotes(prev=>({...prev,[mealId]:[{author,text:clean,at:new Date().toISOString()},...(prev[mealId]??[])].slice(0,20)}))};
 const confirmKitchen=()=>setKitchenReady(true);
 const resetDemo=()=>{setWeek(defaultWeek);setComponentStock(initialComponentStock);setIngredientStock(initialIngredientStock);setGroceryChecked({});setRatings({});setRecipeNotes({});setHistory([]);setKitchenReady(false)};
 const value={week,componentStock,ingredientStock,groceryChecked,ratings,recipeNotes,history,kitchenReady,prepNeeds,shoppingNeeds,setDay,setComponent,setIngredient,toggleGrocery,makeBatch,cookMeal,rateMeal,noteMeal,confirmKitchen,resetDemo};
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useHousehold(){const v=useContext(Ctx);if(!v)throw new Error("useHousehold must be inside HouseholdStateProvider");return v}
