"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getRecipe,midBases,motherBases,recipes} from "@/data/home-data";
import {prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {PageHead,SectionHead} from "./Primitives";

export function Prep(){
 const h=useHousehold();const demand=prepDemandForWeekMl(h.week);const activeNeeds=h.kitchenReady?h.prepNeeds:demand.map(x=>({id:x.id,neededMl:x.neededMl,onHandMl:0,shortMl:x.neededMl,needed:x.neededPortions,onHand:0,short:x.neededPortions,batches:0}));
 const lowMothers=motherBases.filter(m=>h.kitchenReady&&(h.componentStock[m.id]??0)<m.portionMl*2);
 const weeklyMidIds=new Set(h.week.flatMap(id=>getRecipe(id).midIds));
 return <div className="hm-page-v5 hm-prep-v5 hm-prep-v6 hm-prep-v11">
  <PageHead title="Prep" sub="Make only what the week is short of." action={<Link className="hm-round-link-v5" href="/learn/prep-day" aria-label="Prep help">?</Link>}/>

  <section className="hm-prep-hero-v6 hm-prep-hero-v11" style={{backgroundImage:`linear-gradient(90deg,rgba(22,24,18,.78),rgba(22,24,18,.24)),url(${foundationImages.prepDay})`}}><div><span>FOUNDATIONS</span><h2>Do the slow work once.</h2><p>Keep the freezer ready, then let the week stay flexible.</p></div><div className="hm-prep-hero-metrics-v6"><b>❧ <span>Less waste</span></b><b>◷ <span>More time</span></b><b>♡ <span>Better dinners</span></b></div></section>

  <section className="hm-prep-week-v5 hm-prep-week-v6"><div><span>THIS WEEK</span><h2>{h.kitchenReady?(h.prepNeeds.length?`${h.prepNeeds.length} ${h.prepNeeds.length===1?"thing needs":"things need"} topping up`:"We’re covered"):`${demand.length} prep ${demand.length===1?"item":"items"} in the plan`}</h2><p>{h.kitchenReady?(h.prepNeeds.length?"Only make what the week is short of.":"Nothing needs making for the current plan."):"Check the freezer to turn this into a real shortfall list."}</p></div><div>{h.kitchenReady?<Link href={h.prepNeeds.length?"/prep/day":"/kitchen"}>{h.prepNeeds.length?"Start Prep Day":"Freezer"}</Link>:<Link href="/kitchen">Check freezer</Link>}</div></section>
  {activeNeeds.length>0&&<><div className="hm-prep-needs-v5">{activeNeeds.slice(0,4).map(n=>{const c=getComponent(n.id);if(!c)return null;return <article key={n.id} style={{"--tone":c.tone} as React.CSSProperties}><i/><div><strong>{c.code}</strong><span>{c.name}</span><small>{h.kitchenReady?`${n.shortMl} ml short`:`${n.neededMl} ml used this week`}</small></div>{h.kitchenReady&&<b>{n.batches} {n.batches===1?"batch":"batches"}</b>}</article>})}</div>{activeNeeds.length>4&&<Link className="hm-text-button-v5" href="/prep/day">{activeNeeds.length-4} more in Prep Day</Link>}</>}

  <nav className="hm-prep-shortcuts-v11" aria-label="Prep tools"><Link href="/prep/day"><b>01</b><span><strong>Prep Day</strong><small>Cook · cool · label · freeze</small></span><em>›</em></Link><Link href="/prep/mids"><b>02</b><span><strong>Mid-bases</strong><small>Mother → mid → dinner</small></span><em>›</em></Link><Link href="/learn/portions"><b>03</b><span><strong>Portion guide</strong><small>30 · 60 · 120 · 250 ml</small></span><em>›</em></Link></nav>

  <section className="hm-block-v5 hm-mothers-v6"><SectionHead title="Mother bases" action={<span>{motherBases.length} foundations</span>}/><div className="hm-mother-grid-v6">{motherBases.map(m=>{const count=stockPortions(m.id,h.componentStock);const planned=h.week.filter(id=>getRecipe(id).motherIds.includes(m.id)).length;const photo=motherProcessImages[m.id]?.at(-1)?.url;return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><div className="hm-mother-object-v6">{photo?<img src={photo} alt={`${m.name} freezer portions`} loading="lazy"/>:<div className="hm-base-cube-v5"><i/><b>{m.code}</b></div>}<span>{m.code}</span></div><strong>{m.name}</strong><small>{h.kitchenReady?count?`${count} ${count===1?"portion":"portions"}`:"Out":"not checked"}{planned>0?` · ${planned} this week`:""}</small></Link>})}</div>{lowMothers.length>0&&<div className="hm-inline-note-v5"><strong>Low:</strong> {lowMothers.map(x=>x.code).join(" · ")}</div>}</section>

  {h.prepBatches.length>0&&<section className="hm-block-v5"><SectionHead title="Recent batches"/><div className="hm-batch-history-v5">{h.prepBatches.slice(0,6).map((b,i)=>{const c=getComponent(b.componentId);const left=b.remainingMl??b.outputMl;return <div key={`${b.at}-${i}`} className={left<=0?"used":""}><i style={{background:c?.tone}}/><span><strong>{c?.code}</strong><small>{new Date(b.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {left>0?`${left} ml left`:"used up"}</small></span><b>{b.outputMl} ml made</b></div>})}</div></section>}

  <section className="hm-block-v5 hm-mids-v6"><SectionHead title="Mid-bases" action={<Link href="/prep/mids">Explore ›</Link>}/><p className="hm-section-deck-v6">Turn a foundation in a different direction without starting dinner from zero.</p><div className="hm-mid-quick-v5">{midBases.filter(m=>weeklyMidIds.has(m.id)||recipes.some(r=>r.midIds.includes(m.id))).slice(0,8).map(m=>{const used=recipes.filter(r=>r.midIds.includes(m.id)).length;return <Link href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{weeklyMidIds.has(m.id)?"used this week":used?`${used} ${used===1?"recipe":"recipes"}`:"not in our rotation yet"}</small></div></Link>})}</div></section>
 </div>}
