"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getRecipe,midBases,motherBases,recipes} from "@/data/home-data";
import {prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {PageHead,SectionHead} from "./Primitives";

const portionGuide=[{ml:30,label:"Small hits",note:"1 portion",w:34},{ml:60,label:"Everyday meals",note:"1–2 portions",w:46},{ml:90,label:"Family meals",note:"2–3 portions",w:58},{ml:250,label:"Batch cooking",note:"4+ portions",w:92}];

export function Prep(){
 const h=useHousehold();const demand=prepDemandForWeekMl(h.week);const activeNeeds=h.kitchenReady?h.prepNeeds:demand.map(x=>({id:x.id,neededMl:x.neededMl,onHandMl:0,shortMl:x.neededMl,needed:x.neededPortions,onHand:0,short:x.neededPortions,batches:0}));
 const lowMothers=motherBases.filter(m=>h.kitchenReady&&(h.componentStock[m.id]??0)<m.portionMl*2);
 const weeklyMidIds=new Set(h.week.flatMap(id=>getRecipe(id).midIds));
 const weekMidCount=midBases.filter(m=>weeklyMidIds.has(m.id)).length;
 const weekMotherCount=new Set(h.week.flatMap(id=>getRecipe(id).motherIds)).size;
 return <div className="hm-page-v5 hm-prep-v5 hm-prep-v6">
  <PageHead title="Prep Day" sub="Base system" action={<Link className="hm-round-link-v5" href="/learn/prep-day" aria-label="Prep help">?</Link>}/>

  <section className="hm-prep-hero-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(22,24,18,.78),rgba(22,24,18,.24)),url(${foundationImages.prepDay})`}}><div><span>A SMARTER WAY TO COOK</span><h2>Prep once.<br/>Amazing meals<br/>all week.</h2><p>Make the slow flavour once. Keep dinner flexible.</p></div><div className="hm-prep-hero-metrics-v6"><b>❧ <span>Less waste</span></b><b>◷ <span>More time</span></b><b>♡ <span>Happier meals</span></b></div><em>Small cubes.<br/>Big freedom. ♥</em></section>

  <section className="hm-prep-flow-v6" aria-label="How Home Meals prep becomes dinner"><Link href="/prep"><img src={foundationImages.cubes} alt=""/><span>Mother<br/>bases</span></Link><i>→</i><Link href="/prep/mids"><div className="hm-flow-stack-v6"><b/><b/><b/></div><span>Mid<br/>bases</span></Link><i>→</i><div><div className="hm-flow-protein-v6">◒</div><span>Protein</span></div><i>→</i><div><div className="hm-flow-veg-v6">❧</div><span>Vegetables</span></div><i>→</i><div><div className="hm-flow-bowl-v6">◡</div><span>Dinner</span></div></section>

  <section className="hm-prep-week-v5 hm-prep-week-v6"><div><span>THIS WEEK</span><h2>{h.kitchenReady?(h.prepNeeds.length?`${h.prepNeeds.length} ${h.prepNeeds.length===1?"thing needs":"things need"} topping up`:"We’re covered"):`${demand.length} prep ${demand.length===1?"item":"items"} in the plan`}</h2><p>{h.kitchenReady?(h.prepNeeds.length?"Only make what the week is short of.":"Nothing needs making for the current plan."):"Check the freezer to turn this into a real shortfall list."}</p></div><div>{h.kitchenReady?<Link href={h.prepNeeds.length?"/prep/day":"/kitchen"}>{h.prepNeeds.length?"Start prep":"Freezer"}</Link>:<Link href="/kitchen">Check freezer</Link>}</div></section>
  {activeNeeds.length>0&&<><div className="hm-prep-needs-v5">{activeNeeds.slice(0,4).map(n=>{const c=getComponent(n.id);if(!c)return null;return <article key={n.id} style={{"--tone":c.tone} as React.CSSProperties}><i/><div><strong>{c.code}</strong><span>{c.name}</span><small>{h.kitchenReady?`${n.shortMl} ml short`:`${n.neededMl} ml used this week`}</small></div>{h.kitchenReady&&<b>{n.batches} {n.batches===1?"batch":"batches"}</b>}</article>})}</div>{activeNeeds.length>4&&<Link className="hm-text-button-v5" href="/prep/day">{activeNeeds.length-4} more in Prep Day</Link>}</>}

  <section className="hm-block-v5 hm-mothers-v6"><SectionHead title="Mother Bases" action={<span>{motherBases.length} bases. Endless meals. ❧</span>}/><div className="hm-mother-grid-v6">{motherBases.map(m=>{const count=stockPortions(m.id,h.componentStock);const planned=h.week.filter(id=>getRecipe(id).motherIds.includes(m.id)).length;const photo=motherProcessImages[m.id]?.at(-1)?.url;return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><div className="hm-mother-object-v6">{photo?<img src={photo} alt="" loading="lazy"/>:<div className="hm-base-cube-v5"><i/><b>{m.code}</b></div>}<span>{m.code}</span></div><strong>{m.name}</strong><small>{h.kitchenReady?count?`${count} ${count===1?"portion":"portions"}`:"Out":"not checked"}{planned>0?` · ${planned} this week`:""}</small></Link>})}</div>{lowMothers.length>0&&<div className="hm-inline-note-v5"><strong>Low:</strong> {lowMothers.map(x=>x.code).join(" · ")}</div>}</section>

  <section className="hm-block-v5 hm-portion-guide-v6"><SectionHead title="Cube sizes" action={<span>Same bases. Multiple uses. ❧</span>}/><div>{portionGuide.map(p=><article key={p.ml}><strong>{p.ml} ml</strong><span>{p.label}</span><small>{p.note}</small><div className="hm-container-shape-v6" style={{width:`${p.w}%`}}><i/><b>{p.ml}</b></div></article>)}</div></section>

  <section className="hm-prep-relationships-v6"><div><span>THIS WEEK’S SYSTEM</span><strong>{weekMotherCount} mothers → {weekMidCount} mids → 7 dinners</strong><p>Change the week and the prep plan changes with it.</p></div><Link href="/prep/mids">Explore the links <b>→</b></Link></section>

  {h.prepBatches.length>0&&<section className="hm-block-v5"><SectionHead title="Recent prep batches"/><div className="hm-batch-history-v5">{h.prepBatches.slice(0,6).map((b,i)=>{const c=getComponent(b.componentId);const left=b.remainingMl??b.outputMl;return <div key={`${b.at}-${i}`} className={left<=0?"used":""}><i style={{background:c?.tone}}/><span><strong>{c?.code}</strong><small>{new Date(b.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {left>0?`${left} ml left`:"used up"}</small></span><b>{b.outputMl} ml made</b></div>})}</div></section>}

  <section className="hm-block-v5 hm-mids-v6"><SectionHead title="Mid-bases" action={<Link href="/prep/mids">See all ›</Link>}/><p className="hm-section-deck-v6">Direction without starting over. One mother can branch many ways.</p><div className="hm-mid-quick-v5">{midBases.filter(m=>weeklyMidIds.has(m.id)||recipes.some(r=>r.midIds.includes(m.id))).slice(0,8).map(m=>{const used=recipes.filter(r=>r.midIds.includes(m.id)).length;return <Link href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{weeklyMidIds.has(m.id)?"used this week":used?`${used} ${used===1?"recipe":"recipes"}`:"not in our rotation yet"}</small></div></Link>})}</div></section>

  <aside className="hm-prep-banner-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(35,27,20,.78),rgba(35,27,20,.18)),url(${foundationImages.freezer})`}}><strong>Prep today. A tastier, easier tomorrow.</strong><span>Simple habits. Better meals. A happier us.</span><em>Future you will be so glad ♥</em></aside>
 </div>}
