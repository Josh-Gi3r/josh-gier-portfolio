"use client";
import {useMemo,useState} from "react";
import {getComponent,ingredients,recipes} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {recipeAvailability} from "@/data/stock-math";
import {Back,MealCard,PageHead} from "./Primitives";

export function Builder(){
 const h=useHousehold();const[mode,setMode]=useState<"ready"|"prep"|"ingredient">("ready");const[selected,setSelected]=useState<string>("");const[showAll,setShowAll]=useState(false);
 const stockedComponents=useMemo(()=>Array.from(new Set(recipes.flatMap(r=>r.prep.map(p=>p.id)))).filter(id=>(h.componentStock[id]??0)>0),[h.componentStock]);
 const stockedIngredients=useMemo(()=>ingredients.filter(i=>(h.ingredientStock[i.id]??0)>0),[h.ingredientStock]);
 const useSoonIds=useMemo(()=>new Set(Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0)),[h.useSoon,h.ingredientStock]);
 const score=(r:typeof recipes[number])=>{const a=recipeAvailability(r.id,h.componentStock,h.ingredientStock);const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);const soon=r.ingredients.filter(i=>useSoonIds.has(i.id)).length;return a.missingPrep.length*30+a.missingIngredients.length*10+r.minutes-rating*3-soon*16-Number(!!h.favourites[r.id])*6};
 const matches=useMemo(()=>recipes.filter(r=>mode==="ready"?true:mode==="prep"?(selected?r.prep.some(p=>p.id===selected):true):(selected?r.ingredients.some(i=>i.id===selected):true)).sort((a,b)=>score(a)-score(b)),[mode,selected,h.componentStock,h.ingredientStock,h.ratings,h.useSoon,h.favourites]);
 const list=showAll?matches:matches.slice(0,6);
 const chooseMode=(m:"ready"|"prep"|"ingredient")=>{setMode(m);setSelected("");setShowAll(false);feedback("tap")};
 return <div className="hm-page-v5 hm-builder-v5"><Back href="/cook" label="Recipes"/><PageHead eyebrow="FROM WHAT WE HAVE" title="What can we make?" sub="Start with what’s already here."/>
  {!h.kitchenReady&&<div className="hm-inline-warning-v5">Kitchen isn’t checked yet, so “Ready now” is only a recipe ranking. <a href="/kitchen">Check Kitchen</a></div>}
  <div className="hm-segment-v5"><button className={mode==="ready"?"active":""} onClick={()=>chooseMode("ready")}>Ready now</button><button className={mode==="prep"?"active":""} onClick={()=>chooseMode("prep")}>From prep</button><button className={mode==="ingredient"?"active":""} onClick={()=>chooseMode("ingredient")}>From ingredient</button></div>
  {mode==="prep"&&<div className="hm-chip-picker-v5">{stockedComponents.length?stockedComponents.map(id=>{const c=getComponent(id);return c?<button key={id} className={selected===id?"active":""} onClick={()=>{setSelected(selected===id?"":id);feedback("tap")}}>{c.code}</button>:null}):<p>No prep stock logged yet.</p>}</div>}
  {mode==="ingredient"&&<div className="hm-chip-picker-v5">{stockedIngredients.length?stockedIngredients.slice(0,24).map(i=><button key={i.id} className={selected===i.id?"active":""} onClick={()=>{setSelected(selected===i.id?"":i.id);feedback("tap")}}>{h.useSoon[i.id]?`◷ ${i.name}`:i.name}</button>):<p>Kitchen hasn’t been filled in yet.</p>}</div>}
  <div className="hm-builder-summary-v5"><strong>{matches.length}</strong><span>{mode==="ready"?useSoonIds.size?"recipes, with use-soon food first":"recipes ranked by what we already have":"matches"}</span></div>
  <div className="hm-recipe-list-v5">{list.map(r=><MealCard recipe={r} key={r.id}/>)}</div>{matches.length>6&&<button className="hm-secondary-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":"Show all"}</button>}
 </div>
}
