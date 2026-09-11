"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {getComponent,ingredients,motherBases,prepComponents,getRecipe} from "@/data/home-data";
import {stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {PageHead,SectionHead} from "./Primitives";

const tabs=["Fridge","Freezer","Pantry"] as const;type Tab=typeof tabs[number];
function stepFor(unit:string){return unit==="count"||unit==="portion"?1:unit==="g"||unit==="ml"?50:1}
export function Kitchen(){const h=useHousehold();const[tab,setTab]=useState<Tab>("Fridge");const[q,setQ]=useState("");const[showAll,setShowAll]=useState(false);
 const relevantIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).ingredients.map(x=>x.id))),[h.week]);
 const list=ingredients.filter(i=>tab==="Fridge"?["Fresh","Protein","Dairy"].includes(i.category):tab==="Pantry"&&i.category==="Pantry").filter(i=>!q||i.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(relevantIds.has(b.id))-Number(relevantIds.has(a.id))||Number((h.ingredientStock[b.id]??0)>0)-Number((h.ingredientStock[a.id]??0)>0)||a.name.localeCompare(b.name));
 const priority=list.filter(i=>relevantIds.has(i.id)||(h.ingredientStock[i.id]??0)>0);const shown=q||showAll?list:(priority.length?priority:list).slice(0,14);
 const changeIngredient=(id:string,delta:number)=>{h.setIngredient(id,Math.max(0,(h.ingredientStock[id]??0)+delta));feedback("change")};
 const switchTab=(t:Tab)=>{setTab(t);setQ("");setShowAll(false);feedback("tap")};
 return <div className="hm-page-v5 hm-kitchen-v5"><PageHead eyebrow="KITCHEN" title="Kitchen" sub="Enough detail to plan the week." action={<Link className="hm-round-link-v5" href="/scan" aria-label="Camera">⌁</Link>}/>
  {!h.kitchenReady&&<section className="hm-setup-banner-v5"><div><span>FIRST CHECK</span><h2>What’s actually at home?</h2><p>Start with the things this week uses. Add anything else that matters, then mark the kitchen checked.</p></div><button onClick={()=>{h.confirmKitchen();feedback("success")}}>Kitchen checked</button></section>}
  <div className="hm-segment-v5 hm-kitchen-tabs-v5">{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>switchTab(t)}>{t}</button>)}</div>
  {tab==="Freezer"?<Freezer/>:<>
   <label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Find in ${tab.toLowerCase()}`}/></label>
   <section className="hm-block-v5"><SectionHead eyebrow={tab.toUpperCase()} title={tab==="Fridge"?"Food we care about":"Staples we actually use"}/><div className="hm-stock-list-v5">{shown.map(i=>{const n=h.ingredientStock[i.id]??0;const relevant=relevantIds.has(i.id);return <article key={i.id}><div><strong>{i.name}</strong><span>{relevant&&<b>This week</b>}{i.tracking==="state"?(n>0?"Have it":"Out"):n>0?`${Math.round(n*10)/10} ${i.unit}`:"Out"}</span></div>{i.tracking==="state"?<button className={n>0?"on":""} onClick={()=>{h.setIngredient(i.id,n>0?0:1);feedback("change")}}>{n>0?"Have":"Out"}</button>:<div className="hm-stepper-v5"><button aria-label={`Decrease ${i.name}`} onClick={()=>changeIngredient(i.id,-stepFor(i.unit))}>−</button><b>{n?Math.round(n*10)/10:"0"}</b><span>{i.unit}</span><button aria-label={`Increase ${i.name}`} onClick={()=>changeIngredient(i.id,stepFor(i.unit))}>+</button></div>}</article>})}</div>{!q&&list.length>shown.length&&<button className="hm-text-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show less":`Show all ${list.length}`}</button>}</section>
  </>}
  <div className="hm-kitchen-bottom-v5"><Link href="/scan">Use camera</Link><button onClick={()=>{h.confirmKitchen();feedback("success")}}>Kitchen checked ✓</button></div>
 </div>}

function Freezer(){const h=useHousehold();const[more,setMore]=useState(false);const activeIds=new Set(h.week.flatMap(id=>getRecipe(id).prep.map(x=>x.id)));const other=prepComponents.filter(c=>!motherBases.some(m=>m.id===c.id)).sort((a,b)=>Number(activeIds.has(b.id))-Number(activeIds.has(a.id))||a.code.localeCompare(b.code));const shown=more?other:other.filter(x=>activeIds.has(x.id)||(h.componentStock[x.id]??0)>0).slice(0,14);
 const setByPortion=(id:string,delta:number)=>{const c=getComponent(id);if(!c)return;h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*c.portionMl));feedback("change")};
 return <><section className="hm-block-v5"><SectionHead eyebrow="MOTHERS" title="Core bases" action={<Link href="/prep">Prep</Link>}/><div className="hm-freezer-mothers-v5">{motherBases.map(m=>{const n=stockPortions(m.id,h.componentStock);return <article key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{h.componentStock[m.id]??0} ml</small></div><div className="hm-stepper-v5"><button aria-label={`Decrease ${m.code}`} onClick={()=>setByPortion(m.id,-1)}>−</button><b>{n}</b><button aria-label={`Increase ${m.code}`} onClick={()=>setByPortion(m.id,1)}>+</button></div></article>})}</div></section>
 <section className="hm-block-v5"><SectionHead eyebrow="MIDS + BOOSTERS" title="Other prep" action={<Link href="/prep/mids">Mids</Link>}/><div className="hm-freezer-other-v5">{shown.map(c=>{const n=stockPortions(c.id,h.componentStock);return <article key={c.id} style={{"--tone":c.tone} as React.CSSProperties}><i/><span><strong>{c.code}</strong><small>{c.name}{activeIds.has(c.id)?" · this week":""}</small></span><div className="hm-stepper-v5"><button aria-label={`Decrease ${c.code}`} onClick={()=>setByPortion(c.id,-1)}>−</button><b>{n}</b><button aria-label={`Increase ${c.code}`} onClick={()=>setByPortion(c.id,1)}>+</button></div></article>})}</div><button className="hm-text-button-v5" onClick={()=>{setMore(v=>!v);feedback("tap")}}>{more?"Show less":"Show all prep"}</button></section></>}
}
