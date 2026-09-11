"use client";
import Link from "next/link";
import { useState } from "react";
import { useHousehold } from "./HouseholdState";
import { ingredients, midBases, motherBases } from "@/data/home-graph-v3";
import { FreezerWheel } from "./HomeInfographics";

const tabs=["Fridge","Freezer","Pantry"] as const;
export function KitchenV2(){
 const h=useHousehold();const[tab,setTab]=useState<(typeof tabs)[number]>("Fridge");
 const cats=tab==="Fridge"?["Fresh","Protein","Dairy"]:["Pantry"];
 const visibleIngredients=ingredients.filter(x=>tab==="Freezer"?false:cats.includes(x.category));
 return <div className="hm-screen hm-kitchen-screen hm-v3-screen">
  <header className="hm-mobile-head"><div><span>KITCHEN</span><h1>What do we have?</h1><p>Useful enough to plan. Simple enough to maintain.</p></div><Link href="/scan" className="hm-scan-head">⌁</Link></header>
  <div className="hm-kitchen-tabs">{tabs.map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div>

  {tab==="Freezer"?<>
   <FreezerWheel/>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>MOTHERS</span><h2>Core base stock</h2></div><Link href="/prep">Prep ›</Link></div><div className="hm-stock-shelf">{motherBases.map(x=>{const n=h.componentStock[x.id]??0;return <article key={x.id} className={n<=1?"low":""} style={{"--tone":x.tone} as React.CSSProperties}><i/><div><strong>{x.code}</strong><span>{x.name}</span><small>{n<=1?"make soon":n<=3?"some left":"looking good"}</small></div><div className="hm-stepper"><button onClick={()=>h.setComponent(x.id,n-1)}>−</button><b>{n}</b><button onClick={()=>h.setComponent(x.id,n+1)}>+</button></div></article>})}</div></section>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>MIDS</span><h2>Flavour multipliers</h2></div><Link href="/prep/mids">26 mids ›</Link></div><div className="hm-mid-stock-rail">{midBases.map(x=>{const n=h.componentStock[x.id]??0;return <div key={x.id} style={{"--tone":x.tone} as React.CSSProperties}><i/><strong>{x.code}</strong><span>{n}</span><small>{x.name}</small></div>})}</div></section>
  </>:<>
   <section className="hm-kitchen-pulse"><article><span>AT HOME</span><strong>{visibleIngredients.filter(x=>(h.ingredientStock[x.id]??0)>0).length}</strong><small>tracked {tab.toLowerCase()} items</small></article><article><span>USE SOON</span><strong>{visibleIngredients.filter(x=>(h.ingredientStock[x.id]??0)>0&&(h.ingredientStock[x.id]??0)<250).length}</strong><small>worth checking first</small></article><article><span>THIS WEEK</span><strong>{h.shoppingNeeds.filter(x=>visibleIngredients.some(v=>v.id===x.id)).length}</strong><small>top-ups needed</small></article></section>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>{tab.toUpperCase()}</span><h2>{tab==="Fridge"?"Food that changes dinner":"Decision-relevant staples"}</h2></div><Link href="/scan">Scan ›</Link></div><div className="hm-ingredient-cards-v3">{visibleIngredients.map(x=>{const n=h.ingredientStock[x.id]??0;const state=n===0?"Out":n<150?"Low":n<350?"Some":"Plenty";return <article key={x.id} className={state.toLowerCase()}><div><span>{x.category}</span><strong>{x.name}</strong><small>{state}</small></div><div className="hm-stepper wide"><button onClick={()=>h.setIngredient(x.id,Math.max(0,n-(x.defaultUnit==="count"?1:50)))}>−</button><b>{Math.round(n)}</b><em>{x.defaultUnit}</em><button onClick={()=>h.setIngredient(x.id,n+(x.defaultUnit==="count"?1:50))}>+</button></div></article>})}</div></section>
  </>}
  <section className="hm-kitchen-footer"><span>✦</span><div><strong>Show Home the kitchen later.</strong><p>Camera reconciliation will update this same state instead of creating another list.</p></div><Link href="/scan">Camera ›</Link></section>
 </div>
}
