"use client";
import {useMemo,useState} from "react";
import {getComponent,ingredients,recipes} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {Back,MealCard,PageHead} from "./Primitives";

export function Builder(){
 const h=useHousehold();const[mode,setMode]=useState<"ready"|"prep"|"ingredient">("ready");const[selected,setSelected]=useState<string>("");const[showAll,setShowAll]=useState(false);
 const stockedComponents=useMemo(()=>Array.from(new Set(recipes.flatMap(r=>r.prep.map(p=>p.id)))).filter(id=>(h.componentStock[id]??0)>0),[h.componentStock]);
 const stockedIngredients=useMemo(()=>ingredients.filter(i=>(h.ingredientStock[i.id]??0)>0),[h.ingredientStock]);
 const score=(r:typeof recipes[number])=>{const missingPrep=r.prep.filter(p=>(h.componentStock[p.id]??0)<p.totalMl).length;const missingIng=r.ingredients.filter(i=>i.unit!=="have"&&(h.ingredientStock[i.id]??0)<i.qty).length;const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);return missingPrep*30+missingIng*10+r.minutes-rating*3};
 const matches=useMemo(()=>recipes.filter(r=>mode==="ready"?true:mode==="prep"?(selected?r.prep.some(p=>p.id===selected):true):(selected?r.ingredients.some(i=>i.id===selected):true)).sort((a,b)=>score(a)-score(b)),[mode,selected,h.componentStock,h.ingredientStock,h.ratings]);
 const list=showAll?matches:matches.slice(0,6);
 return <div className="hm-page-v5 hm-builder-v5"><Back href="/cook" label="Recipes"/><PageHead eyebrow="FROM WHAT WE HAVE" title="What can we make?" sub="Start with what’s already here."/>
  {!h.kitchenReady&&<div className="hm-inline-warning-v5">Kitchen isn’t checked yet, so “Ready now” is only a recipe ranking. <a href="/kitchen">Check Kitchen</a></div>}
  <div className="hm-segment-v5"><button className={mode==="ready"?"active":""} onClick={()=>{setMode("ready");setSelected("")}}>Ready now</button><button className={mode==="prep"?"active":""} onClick={()=>{setMode("prep");setSelected("")}}>From prep</button><button className={mode==="ingredient"?"active":""} onClick={()=>{setMode("ingredient");setSelected("")}}>From ingredient</button></div>
  {mode==="prep"&&<div className="hm-chip-picker-v5">{stockedComponents.length?stockedComponents.map(id=>{const c=getComponent(id);return c?<button key={id} className={selected===id?"active":""} onClick={()=>setSelected(selected===id?"":id)}>{c.code}</button>:null}):<p>No prep stock logged yet.</p>}</div>}
  {mode==="ingredient"&&<div className="hm-chip-picker-v5">{stockedIngredients.length?stockedIngredients.slice(0,24).map(i=><button key={i.id} className={selected===i.id?"active":""} onClick={()=>setSelected(selected===i.id?"":i.id)}>{i.name}</button>):<p>Kitchen hasn’t been filled in yet.</p>}</div>}
  <div className="hm-builder-summary-v5"><strong>{matches.length}</strong><span>{mode==="ready"?"recipes ranked by what we already have":"matches"}</span></div>
  <div className="hm-recipe-list-v5">{list.map(r=><MealCard recipe={r} key={r.id}/>)}</div>{matches.length>6&&<button className="hm-secondary-button-v5" onClick={()=>setShowAll(v=>!v)}>{showAll?"Show fewer":"Show all"}</button>}
 </div>
}
