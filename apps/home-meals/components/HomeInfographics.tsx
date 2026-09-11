"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getMeal, midBases, motherBases } from "@/data/home-graph-v3";

export function BaseMultiplierMap(){
 const [selected,setSelected]=useState("gold");
 const mother=motherBases.find(x=>x.id===selected)??motherBases[0];
 const mids=midBases.filter(x=>x.parentMotherIds.includes(mother.id));
 const dinners=useMemo(()=>{
  const ids=new Set<string>();
  for(const mid of mids) mid.examples.forEach(x=>ids.add(x));
  mother.examples.forEach(x=>ids.add(x));
  return [...ids].slice(0,8);
 },[mother,mids]);
 return <section className="hm-viz-card hm-base-map">
  <header><div><span className="hm-viz-kicker">BASE MULTIPLIER</span><h3>One base, many directions.</h3></div><strong>{mids.length} mids · {dinners.length}+ ideas</strong></header>
  <div className="hm-base-selector">{motherBases.map(x=><button key={x.id} className={selected===x.id?"active":""} style={{"--tone":x.tone} as React.CSSProperties} onClick={()=>setSelected(x.id)}><i/><span>{x.code}</span></button>)}</div>
  <div className="hm-base-map-stage">
   <div className="hm-base-node" style={{"--tone":mother.tone} as React.CSSProperties}><i/><strong>{mother.code}</strong><small>{mother.name}</small></div>
   <div className="hm-base-map-lines" aria-hidden="true"><span/><span/><span/></div>
   <div className="hm-mid-node-stack">{mids.length?mids.map((mid,i)=><Link href={`/prep/mids/${mid.id}`} key={mid.id} className="hm-mid-node" style={{animationDelay:`${i*60}ms`}}><strong>{mid.code}</strong><small>{mid.name}</small></Link>):<div className="hm-mid-node standalone"><strong>DIRECT</strong><small>No mid required</small></div>}</div>
  </div>
  <div className="hm-dinner-bubbles">{dinners.map((x,i)=><span key={x} style={{animationDelay:`${i*45}ms`}}>{x}</span>)}</div>
 </section>
}

export function FreezerWheel(){
 const h=useHousehold();
 const total=motherBases.reduce((n,x)=>n+(h.componentStock[x.id]??0),0);
 const max=Math.max(1,...motherBases.map(x=>h.componentStock[x.id]??0));
 const low=motherBases.filter(x=>(h.componentStock[x.id]??0)<=1);
 return <section className="hm-freezer-pulse-v4">
  <header><div><span>FREEZER PULSE</span><h3>{low.length?`${low.length} foundations running low`:"Foundations look good ✦"}</h3></div><Link href="/prep">Prep ›</Link></header>
  <div className="hm-freezer-summary-v4"><div className="hm-freezer-total-v4"><b>❄</b><strong>{total}</strong><small>mother portions</small><i/></div><div className="hm-freezer-bars-v4">{motherBases.map((x,i)=>{const stock=h.componentStock[x.id]??0;const pct=Math.max(8,Math.round((stock/max)*100));return <Link href={`/prep/${x.id}`} key={x.id} className={stock<=1?"low":""} style={{"--tone":x.tone,"--delay":`${i*55}ms`} as React.CSSProperties}><div><span>{x.code}</span><b>{stock}</b></div><em><i style={{width:`${pct}%`}}/></em></Link>})}</div></div>
  <footer><span className={low.length?"warn":"good"}>{low.length?`Next up: ${low.slice(0,3).map(x=>x.code).join(" · ")}`:"No emergency batch needed"}</span><small>Tap a bar to open its prep page</small></footer>
 </section>
}

export function GroceryDelta(){
 const h=useHousehold();
 const requiredIds=useMemo(()=>{const ids=new Set<string>();h.week.forEach(mealId=>getMeal(mealId).ingredients.forEach(x=>ids.add(x.id)));return [...ids]},[h.week]);
 const totalItems=requiredIds.length;
 const topUpItems=h.shoppingNeeds.length;
 const coveredItems=Math.max(0,totalItems-topUpItems);
 const coveredPct=totalItems?Math.round((coveredItems/totalItems)*100):100;
 return <section className="hm-viz-card hm-grocery-delta">
  <header><div><span className="hm-viz-kicker">THIS WEEK'S DELTA</span><h3>Only buy the gap.</h3></div><Link href="/plan">shopping list →</Link></header>
  <div className="hm-delta-flow"><div><strong>{totalItems}</strong><span>ingredients needed</span></div><b>−</b><div><strong>{coveredItems}</strong><span>already covered</span></div><b>=</b><div className="buy"><strong>{topUpItems}</strong><span>top-ups</span></div></div>
  <div className="hm-delta-bar"><span style={{width:`${coveredPct}%`}}/><i style={{left:`${coveredPct}%`}}/></div>
 </section>
}

export function WeekDependencyMap(){
 const h=useHousehold();
 const components=useMemo(()=>{
  const map=new Map<string,{label:string,count:number,tone:string}>();
  h.week.forEach(id=>{const m=getMeal(id);[...m.motherIds,...m.midIds].forEach(cid=>{const item=motherBases.find(x=>x.id===cid)??midBases.find(x=>x.id===cid);if(!item)return;const current=map.get(cid);map.set(cid,{label:item.code,count:(current?.count??0)+1,tone:item.tone})})});
  return [...map.values()].sort((a,b)=>b.count-a.count);
 },[h.week]);
 return <section className="hm-viz-card hm-week-deps">
  <header><div><span className="hm-viz-kicker">WEEKLY REUSE</span><h3>Seven meals, shared prep.</h3></div><strong>{components.length} shared components</strong></header>
  <div className="hm-week-dep-meals">{h.week.map((id,i)=>{const m=getMeal(id);return <div key={`${id}-${i}`}><span>{["M","T","W","T","F","S","S"][i]}</span><strong>{m.title}</strong></div>})}</div>
  <div className="hm-week-dep-lines"/>
  <div className="hm-week-dep-components">{components.map((x,i)=><div key={x.label} style={{"--tone":x.tone,animationDelay:`${i*70}ms`} as React.CSSProperties}><i/><strong>{x.label}</strong><span>used {x.count}×</span></div>)}</div>
 </section>
}

export function PrepPipeline(){
 const steps=["Chop","Cook","Cue","Cool","Portion","Label","Freeze"];
 return <section className="hm-viz-card hm-prep-pipeline">
  <header><div><span className="hm-viz-kicker">PREP FLOW</span><h3>From chopping board to freezer.</h3></div><span>follow the cue, not just the clock</span></header>
  <div className="hm-pipeline-track">{steps.map((x,i)=><div key={x}><span>{i+1}</span><strong>{x}</strong>{i<steps.length-1&&<i/>}</div>)}</div>
 </section>
}
