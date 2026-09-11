"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getRecipe,midBases,motherBases,recipes} from "@/data/home-data";
import {prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {PageHead,SectionHead} from "./Primitives";
import {BaseExplorer} from "./BaseExplorer";

export function Prep(){
 const h=useHousehold();const demand=prepDemandForWeekMl(h.week);const activeNeeds=h.kitchenReady?h.prepNeeds:demand.map(x=>({id:x.id,neededMl:x.neededMl,onHandMl:0,shortMl:x.neededMl,needed:x.neededPortions,onHand:0,short:x.neededPortions,batches:0}));
 const lowMothers=motherBases.filter(m=>h.kitchenReady&&(h.componentStock[m.id]??0)<m.portionMl*2);
 const weeklyMidIds=new Set(h.week.flatMap(id=>getRecipe(id).midIds));
 return <div className="hm-page-v5 hm-prep-v5">
  <PageHead eyebrow="PREP" title="Prep" sub="Make the slow bits once." action={<Link className="hm-round-link-v5" href="/learn/prep-day" aria-label="Prep help">?</Link>}/>
  <section className="hm-prep-week-v5"><div><span>THIS WEEK</span><h2>{h.kitchenReady?(h.prepNeeds.length?`${h.prepNeeds.length} things need topping up`:"We’re covered"):`${demand.length} prep items in the plan`}</h2><p>{h.kitchenReady?(h.prepNeeds.length?"Only make what the week is short of.":"Nothing needs making for the current plan."):"Check the freezer to turn this into a real shortfall list."}</p></div><div>{h.kitchenReady?<Link href={h.prepNeeds.length?"/prep/day":"/kitchen"}>{h.prepNeeds.length?"Start prep":"Freezer"}</Link>:<Link href="/kitchen">Check freezer</Link>}</div></section>
  {activeNeeds.length>0&&<div className="hm-prep-needs-v5">{activeNeeds.slice(0,8).map(n=>{const c=getComponent(n.id);if(!c)return null;return <article key={n.id} style={{"--tone":c.tone} as React.CSSProperties}><i/><div><strong>{c.code}</strong><span>{c.name}</span><small>{h.kitchenReady?`${n.shortMl} ml short`:`${n.neededMl} ml used this week`}</small></div>{h.kitchenReady&&<b>{n.batches} {n.batches===1?"batch":"batches"}</b>}</article>})}</div>}
  <section className="hm-block-v5"><SectionHead eyebrow="MOTHER BASES" title="Freezer foundations" action={<Link href="/kitchen">Stock</Link>}/><div className="hm-mother-rail-v5">{motherBases.map(m=>{const count=stockPortions(m.id,h.componentStock);const planned=h.week.filter(id=>getRecipe(id).motherIds.includes(m.id)).length;return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><div className="hm-base-cube-v5"><i/><b>{m.code}</b></div><strong>{m.name}</strong><span>{h.kitchenReady?count?`${count} ${count===1?"portion":"portions"}`:"Out":"not checked"}</span>{planned>0&&<small>{planned} planned {planned===1?"meal":"meals"}</small>}</Link>})}</div>{lowMothers.length>0&&<div className="hm-inline-note-v5"><strong>Low:</strong> {lowMothers.map(x=>x.code).join(" · ")}</div>}</section>
  <BaseExplorer/>
  {h.prepBatches.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="RECENT" title="Prep batches"/><div className="hm-batch-history-v5">{h.prepBatches.slice(0,6).map((b,i)=>{const c=getComponent(b.componentId);const left=b.remainingMl??b.outputMl;return <div key={`${b.at}-${i}`} className={left<=0?"used":""}><i style={{background:c?.tone}}/><span><strong>{c?.code}</strong><small>{new Date(b.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {left>0?`${left} ml left`:"used up"}</small></span><b>{b.outputMl} ml made</b></div>})}</div></section>}
  <section className="hm-block-v5"><SectionHead eyebrow="MIDS" title="Extra directions" action={<Link href="/prep/mids">All mids</Link>}/><div className="hm-mid-quick-v5">{midBases.filter(m=>weeklyMidIds.has(m.id)||recipes.some(r=>r.midIds.includes(m.id))).slice(0,8).map(m=>{const used=recipes.filter(r=>r.midIds.includes(m.id)).length;return <Link href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{weeklyMidIds.has(m.id)?"used this week":used?`${used} ${used===1?"recipe":"recipes"}`:"not in our rotation yet"}</small></div></Link>})}</div></section>
  <div className="hm-help-links-v5"><Link href="/learn/portions">Portion sizes</Link><Link href="/learn/freezer">Freezer layout</Link></div>
 </div>
}
