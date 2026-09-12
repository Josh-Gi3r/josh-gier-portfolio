"use client";
import Link from "next/link";
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
 const daysSinceCooked=(id:string)=>{const event=h.history.find(x=>x.mealId===id);return event?Math.max(0,Math.floor((Date.now()-new Date(event.at).getTime())/86400000)):9999};
 const recentPenalty=(id:string)=>{const age=daysSinceCooked(id);return age<3?60:age<7?36:age<14?16:age<28?6:0};
 const score=(r:typeof recipes[number])=>{const a=recipeAvailability(r.id,h.componentStock,h.ingredientStock);const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);const soon=r.ingredients.filter(i=>useSoonIds.has(i.id)).length;return a.missingPrep.length*30+a.missingIngredients.length*10+r.minutes-rating*3-soon*18-Number(!!h.favourites[r.id])*6+recentPenalty(r.id)};
 const matches=useMemo(()=>recipes.filter(r=>mode==="ready"?(!h.kitchenReady||recipeAvailability(r.id,h.componentStock,h.ingredientStock).ready):mode==="prep"?(selected?r.prep.some(p=>p.id===selected):true):(selected?r.ingredients.some(i=>i.id===selected):true)).sort((a,b)=>score(a)-score(b)),[mode,selected,h.componentStock,h.ingredientStock,h.ratings,h.useSoon,h.favourites,h.kitchenReady,h.history]);
 const list=showAll?matches:matches.slice(0,6);
 const chooseMode=(m:"ready"|"prep"|"ingredient")=>{setMode(m);setSelected("");setShowAll(false);feedback("tap")};
 const why=(r:typeof recipes[number])=>{const parts:string[]=[];const soon=r.ingredients.filter(i=>useSoonIds.has(i.id)).length;const age=daysSinceCooked(r.id);if(soon)parts.push(`uses ${soon} use-soon ${soon===1?"item":"items"}`);if(h.favourites[r.id])parts.push("favourite");else{const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);if(rating>=4)parts.push(`${rating}★ at home`)}if(age<28)parts.push(age===0?"had today":`had ${age}d ago`);else if(age!==9999)parts.push("not had lately");else parts.push("not cooked yet");return parts.slice(0,2)};
 return <div className="hm-page-v5 hm-builder-v5"><Back href="/cook" label="Recipes"/><PageHead eyebrow="FROM WHAT WE HAVE" title="What can we make?" sub="Start with what’s already here, without forgetting what we just ate."/>
  {!h.kitchenReady&&<div className="hm-inline-warning-v5">Kitchen isn’t checked yet, so “Ready now” is only a recipe ranking. <a href="/kitchen">Check Kitchen</a></div>}
  <div className="hm-segment-v5"><button className={mode==="ready"?"active":""} onClick={()=>chooseMode("ready")}>Ready now</button><button className={mode==="prep"?"active":""} onClick={()=>chooseMode("prep")}>From prep</button><button className={mode==="ingredient"?"active":""} onClick={()=>chooseMode("ingredient")}>From ingredient</button></div>
  {mode==="prep"&&<div className="hm-chip-picker-v5">{stockedComponents.length?stockedComponents.map(id=>{const c=getComponent(id);return c?<button key={id} className={selected===id?"active":""} onClick={()=>{setSelected(selected===id?"":id);feedback("tap")}}>{c.code}</button>:null}):<p>No prep stock logged yet.</p>}</div>}
  {mode==="ingredient"&&<div className="hm-chip-picker-v5">{stockedIngredients.length?stockedIngredients.slice(0,24).map(i=><button key={i.id} className={selected===i.id?"active":""} onClick={()=>{setSelected(selected===i.id?"":i.id);feedback("tap")}}>{h.useSoon[i.id]?`◷ ${i.name}`:i.name}</button>):<p>Kitchen hasn’t been filled in yet.</p>}</div>}
  <div className="hm-builder-summary-v5"><strong>{matches.length}</strong><span>{mode==="ready"?(h.kitchenReady?matches.length===1?"recipe ready now":"recipes ready now":"recipes ranked until Kitchen is checked"):"matches"}</span></div>
  {list.length?<div className="hm-builder-results-v32">{list.map(r=><article key={r.id}><MealCard recipe={r}/><div className="hm-builder-why-v32">{why(r).map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div>:<div className="hm-empty-v5"><strong>Nothing is fully covered right now.</strong><p>Check Kitchen stock or choose the week before we decide what to cook.</p><div className="hm-help-links-v5"><Link href="/kitchen">Kitchen</Link><Link href="/plan">Plan</Link></div></div>}{matches.length>6&&<button className="hm-secondary-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":"Show all"}</button>}
 </div>
}
