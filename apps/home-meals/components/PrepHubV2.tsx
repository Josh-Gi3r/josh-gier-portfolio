"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { coverageByMother, getMeal, midBases, motherBases, totalDinnerDirections } from "@/data/home-graph-v3";
import { foundationImages } from "@/data/foundation-assets";
import { BaseMultiplierMap, PrepPipeline, WeekDependencyMap } from "./HomeInfographics";
import { PortionScale } from "./PortionScale";

export function PrepHubV2(){
 const h=useHousehold();
 const label=(id:string)=>(motherBases.find(x=>x.id===id)??midBases.find(x=>x.id===id));
 const low=motherBases.filter(x=>(h.componentStock[x.id]??0)<=1);
 return <div className="hm-screen hm-prep-screen hm-v3-screen">
  <header className="hm-mobile-head"><div><span>PREP</span><h1>Make future dinners easier.</h1><p>Only prep what earns its freezer space.</p></div><Link href="/learn/system" className="hm-head-help">?</Link></header>

  <section className={`hm-prep-now ${h.prepNeeds.length?"needs":"covered"}`}>
   <div className="hm-prep-now-photo">{foundationImages.cubes&&<img src={foundationImages.cubes} alt="Prepared freezer bases"/>}<span/></div>
   <div className="hm-prep-now-copy"><small>THIS WEEK</small><h2>{h.prepNeeds.length?`${h.prepNeeds.length} prep jobs`:"You're covered ✦"}</h2><p>{h.prepNeeds.length?"These are the only batches this week's meals actually need.":"Freezer stock covers every planned dinner. No Sunday busywork."}</p><div className="hm-prep-now-actions">{h.prepNeeds.length?<Link href="/prep/day">Start prep mode</Link>:<Link href="/plan">See this week</Link>}<Link href="/kitchen">Freezer stock</Link></div></div>
  </section>

  {h.prepNeeds.length>0&&<section className="hm-prep-job-list">{h.prepNeeds.map((x,i)=>{const item=label(x.id);return <article key={x.id} style={{"--tone":item?.tone,animationDelay:`${i*60}ms`} as React.CSSProperties}><i/><div><span>{item?.code}</span><strong>{item?.name}</strong><small>{x.onHand} on hand · {x.needed} needed</small></div><b>short {x.short}</b><button onClick={()=>h.makeBatch(x.id)}>+ batch</button></article>})}</section>}

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>CORE BASES</span><h2>Your eight mothers</h2></div><small>{totalDinnerDirections} dinner directions</small></div><div className="hm-mother-shelf">{coverageByMother.map(({mother,mids,meals})=>{const stock=h.componentStock[mother.id]??0;return <Link href={`/prep/${mother.id}`} key={mother.id} style={{"--tone":mother.tone} as React.CSSProperties} className={stock<=1?"low":""}><div className="hm-mother-cube"><i/><b>{mother.code}</b></div><strong>{mother.name}</strong><span>{stock} portions</span><small>{mids.length} mids · {meals.length || mother.approxMeals} dinners</small>{stock<=1&&<em>make soon</em>}</Link>})}</div></section>

  <section className="hm-prep-alert-row">{low.length>0?<><div><span>LOW STOCK</span><strong>{low.map(x=>x.code).join(" · ")}</strong><small>Only top these up if the coming meals need them.</small></div><Link href="/kitchen">Adjust stock ›</Link></>:<><div><span>FREEZER</span><strong>Foundations look healthy.</strong><small>Nothing urgent across the eight core bases.</small></div><Link href="/kitchen">Open freezer ›</Link></>}</section>

  <BaseMultiplierMap/>
  <WeekDependencyMap/>
  <PrepPipeline/>
  <PortionScale/>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>MID-BASES</span><h2>26 flavour multipliers</h2></div><Link href="/prep/mids">Explore all ›</Link></div><div className="hm-mid-teaser">{midBases.slice(0,10).map(x=><Link href={`/prep/mids/${x.id}`} key={x.id} style={{"--tone":x.tone} as React.CSSProperties}><i/><div><strong>{x.code}</strong><span>{x.name}</span><small>{x.parentMotherIds.length?x.parentMotherIds.map(id=>motherBases.find(m=>m.id===id)?.code).join(" + "):"standalone"}</small></div></Link>)}</div></section>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>WHY WE PREP</span><h2>This week's meals</h2></div><Link href="/plan">Change week ›</Link></div><div className="hm-prep-meal-rail">{h.week.map((id,i)=>{const m=getMeal(id);const parts=[...m.motherIds.map(x=>motherBases.find(b=>b.id===x)?.code),...m.midIds.map(x=>midBases.find(b=>b.id===x)?.code)].filter(Boolean);return <Link href={`/cook/${id}`} key={`${id}-${i}`}>{m.image&&<img src={m.image} alt=""/>}<span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span><strong>{m.title}</strong><small>{parts.join(" + ")||"fresh"}</small></Link>})}</div></section>
 </div>
}
