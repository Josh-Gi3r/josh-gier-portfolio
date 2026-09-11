"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultWeek, getMeal, getMid, getMother, initialComponentStock, initialIngredientStock, prepNeedsForWeek, shoppingNeedsForWeek } from "@/data/home-graph-v3";

type Rating={josh?:number;g?:number;note?:string};
type CookEvent={mealId:string;at:string};
type HouseholdState={
 week:string[]; componentStock:Record<string,number>; ingredientStock:Record<string,number>; groceryChecked:Record<string,boolean>; ratings:Record<string,Rating>; history:CookEvent[];
 prepNeeds:ReturnType<typeof prepNeedsForWeek>; shoppingNeeds:ReturnType<typeof shoppingNeedsForWeek>;
 setDay:(index:number,mealId:string)=>void; setComponent:(id:string,qty:number)=>void; setIngredient:(id:string,qty:number)=>void; toggleGrocery:(id:string)=>void; makeBatch:(id:string)=>void; cookMeal:(mealId:string)=>void; rateMeal:(mealId:string,who:"josh"|"g",value:number)=>void; resetDemo:()=>void;
};
const Ctx=createContext<HouseholdState|null>(null);
const KEY="home-meals-linked-v3";

export function HouseholdStateProvider({children}:{children:React.ReactNode}){
 const [week,setWeek]=useState<string[]>(defaultWeek);
 const [componentStock,setComponentStock]=useState<Record<string,number>>(initialComponentStock);
 const [ingredientStock,setIngredientStock]=useState<Record<string,number>>(initialIngredientStock);
 const [groceryChecked,setGroceryChecked]=useState<Record<string,boolean>>({});
 const [ratings,setRatings]=useState<Record<string,Rating>>({});
 const [history,setHistory]=useState<CookEvent[]>([]);
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.week)setWeek(s.week);if(s.componentStock)setComponentStock({...initialComponentStock,...s.componentStock});if(s.ingredientStock)setIngredientStock({...initialIngredientStock,...s.ingredientStock});if(s.groceryChecked)setGroceryChecked(s.groceryChecked);if(s.ratings)setRatings(s.ratings);if(s.history)setHistory(s.history)}}catch{}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(!hydrated)return;localStorage.setItem(KEY,JSON.stringify({week,componentStock,ingredientStock,groceryChecked,ratings,history}))},[hydrated,week,componentStock,ingredientStock,groceryChecked,ratings,history]);
 const prepNeeds=useMemo(()=>prepNeedsForWeek(week,componentStock),[week,componentStock]);
 const shoppingNeeds=useMemo(()=>shoppingNeedsForWeek(week,ingredientStock),[week,ingredientStock]);
 const setDay=(index:number,mealId:string)=>setWeek(prev=>prev.map((x,i)=>i===index?mealId:x));
 const setComponent=(id:string,qty:number)=>setComponentStock(prev=>({...prev,[id]:Math.max(0,qty)}));
 const setIngredient=(id:string,qty:number)=>setIngredientStock(prev=>({...prev,[id]:Math.max(0,qty)}));
 const toggleGrocery=(id:string)=>setGroceryChecked(prev=>({...prev,[id]:!prev[id]}));
 const makeBatch=(id:string)=>{const m=getMother(id);const mid=getMid(id);const yieldQty=m?.batchYield??mid?.batchYield??1;setComponentStock(prev=>({...prev,[id]:(prev[id]??0)+yieldQty}));};
 const cookMeal=(mealId:string)=>{const meal=getMeal(mealId);setComponentStock(prev=>{const next={...prev};for(const id of [...meal.motherIds,...meal.midIds])next[id]=Math.max(0,(next[id]??0)-1);return next});setIngredientStock(prev=>{const next={...prev};for(const req of meal.ingredients)next[req.id]=Math.max(0,(next[req.id]??0)-req.qty);return next});setHistory(prev=>[{mealId,at:new Date().toISOString()},...prev].slice(0,100));};
 const rateMeal=(mealId:string,who:"josh"|"g",value:number)=>setRatings(prev=>({...prev,[mealId]:{...(prev[mealId]??{}),[who]:value}}));
 const resetDemo=()=>{setWeek(defaultWeek);setComponentStock(initialComponentStock);setIngredientStock(initialIngredientStock);setGroceryChecked({});setRatings({});setHistory([])};
 const value={week,componentStock,ingredientStock,groceryChecked,ratings,history,prepNeeds,shoppingNeeds,setDay,setComponent,setIngredient,toggleGrocery,makeBatch,cookMeal,rateMeal,resetDemo};
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useHousehold(){const v=useContext(Ctx);if(!v)throw new Error("useHousehold must be inside HouseholdStateProvider");return v}
