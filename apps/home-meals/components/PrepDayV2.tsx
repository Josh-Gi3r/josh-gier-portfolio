"use client";
import Link from "next/link";
import { useState } from "react";
import { useHousehold } from "./HouseholdState";
import { midBases, motherBases } from "@/data/home-graph-v3";
import { foundationImages } from "@/data/foundation-assets";
import { PrepPipeline } from "./HomeInfographics";

export function PrepDayV2(){
 const h=useHousehold();const[done,setDone]=useState<Record<string,boolean>>({});
 const item=(id:string)=>motherBases.find(x=>x.id===id)??midBases.find(x=>x.id===id);
 const total=h.prepNeeds.length;const completed=Object.values(done).filter(Boolean).length;
 const pct=total?Math.round((completed/total)*100):100;
 const finish=(id:string)=>{if(done[id])return;h.makeBatch(id);setDone(v=>({...v,[id]:true}))};
 return <div className="hm-screen hm-prepday-screen hm-v3-screen">
  <header className="hm-mobile-head"><div><span>PREP DAY</span><h1>Let's make future us happy.</h1><p>Only the jobs this week actually needs.</p></div><Link href="/prep" className="hm-head-help">‹</Link></header>

  <section className="hm-prepday-v3-hero">{foundationImages.prepDay&&<img src={foundationImages.prepDay} alt="Prep day"/>}<div className="shade"/><div className="copy"><span>THIS SESSION</span><h2>{total?`${total} linked prep jobs`:"You're already covered ✦"}</h2><p>{total?"Do the work once, then put the week on easy mode.":"Close the app. Go enjoy Sunday."}</p><div className="progress"><i style={{width:`${pct}%`}}/><b>{pct}%</b></div></div></section>

  {total>0?<section className="hm-prepday-jobs-v3">{h.prepNeeds.map((x,i)=>{const p=item(x.id)!;const isDone=!!done[x.id];return <article key={x.id} className={isDone?"done":""} style={{"--tone":p.tone,"--delay":`${i*70}ms`} as React.CSSProperties}><div className="num">{isDone?"✓":String(i+1).padStart(2,"0")}</div><i/><div className="copy"><span>{p.code}</span><strong>{p.name}</strong><small>{x.onHand} on hand · need {x.needed} · short {x.short}</small><p>Make one batch → +{p.batchYield} portions</p></div><button onClick={()=>finish(x.id)} disabled={isDone}>{isDone?"Added":"Batch done"}</button></article>})}</section>:<div className="hm-celebrate-card">✓ Current freezer stock covers the week. Prep only when the plan creates a real gap.</div>}

  <PrepPipeline/>

  <section className="hm-prepday-tips-v3"><article><i>🔥</i><div><strong>Long cooks first</strong><p>Stocks, tomato and onion work can run while you do faster pastes.</p></div></article><article><i>🧊</i><div><strong>Cool before freezing</strong><p>Shallow containers first. Portion once the batch has cooled safely.</p></div></article><article><i>🏷</i><div><strong>Label everything</strong><p>NAME / PORTION / DATE. Future you should never guess.</p></div></article></section>
 </div>
}
