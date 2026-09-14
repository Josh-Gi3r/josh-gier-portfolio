"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {midBases,motherBases,recipes,getRecipe} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead} from "./Primitives";

// Mid-bases explorer: tap a base, its mids fan out, then the dinners they unlock.
export function Mids(){
 const h=useHousehold();
 const[selected,setSelected]=useState(motherBases.find(m=>m.id==="gold")?.id??motherBases[0].id);const[q,setQ]=useState("");const[showAll,setShowAll]=useState(false);
 const mother=motherBases.find(x=>x.id===selected)??motherBases[0];
 const counts=useMemo(()=>Object.fromEntries(midBases.map(m=>[m.id,recipes.filter(r=>r.midIds.includes(m.id)).length])),[]);
 const weekIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).midIds)),[h.week]);
 const mids=useMemo(()=>midBases.filter(x=>x.parentMotherIds.includes(mother.id)),[mother.id]);
 const dinners=useMemo(()=>{const viaMid=new Set(mids.map(m=>m.id));return recipes.filter(r=>r.motherIds.includes(mother.id)||r.midIds.some(id=>viaMid.has(id)))},[mother.id,mids]);
 const standalone=midBases.filter(m=>m.standalone);
 const all=midBases.filter(m=>!q||`${m.code} ${m.name} ${m.examples.join(" ")}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(weekIds.has(b.id))-Number(weekIds.has(a.id))||(counts[b.id]??0)-(counts[a.id]??0)||a.name.localeCompare(b.name));
 const shownAll=q||showAll?all:all.slice(0,8);
 const weekMid=midBases.find(m=>weekIds.has(m.id));
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">What a base becomes</h1></div>
  <p className="hm-lead hm-gut" style={{marginTop:10,fontSize:14}}>Tap a base. Its mid‑bases fan out, then the dinners they unlock.</p>
  <div className="hm-mothers-rail" aria-label="Choose a base">{motherBases.map(m=>{const on=m.id===mother.id;const hero=motherHero(m.id);return <button key={m.id} className={on?"on":""} aria-pressed={on} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties} onClick={()=>{setSelected(m.id);feedback("tap")}}><span className="ball">{hero?<img src={hero} alt=""/>:m.code}</span><small>{m.code}</small></button>})}</div>
  <div className="hm-card lg hm-explore" style={{"--tone":toneFor(mother.id)} as CSSProperties}>
   <div className="head"><h3>{mother.code} → {mids.length?"mids":"dinner"}</h3><span>{dinners.length} {dinners.length===1?"dinner":"dinners"}</span></div>
   {mids.length?<div className="hm-chiplist" style={{marginTop:14}}>{mids.map(x=><Link key={x.id} href={`/prep/mids/${x.id}`} className="tinted" style={{"--tone":toneFor(x.id)} as CSSProperties}><i/>{x.code}<small>{x.name}</small></Link>)}</div>
   :<p className="hm-lead" style={{marginTop:12,fontSize:14}}>{mother.code} goes straight into dinner — no mid needed.</p>}
   {dinners.length?<div className="hm-rail sm">{dinners.slice(0,10).map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist" style={{marginTop:14}}>{mother.examples.slice(0,6).map(x=><span key={x}>{x}</span>)}</div>}
  </div>
  <HomeSays className="tight">{weekMid?<>This week uses <b>{weekMid.code}</b>{weekIds.size>1?` and ${weekIds.size-1} other ${weekIds.size===2?"mid":"mids"}`:""}. {counts[weekMid.id]?`${counts[weekMid.id]} of our dinners lean on it.`:""}</>:<>Nothing this week needs a mid‑base — the dinners use bases directly or standalone pastes.</>}</HomeSays>

  <SectionHead title="Standalone mids" action={<span className="muted">no base underneath</span>}/>
  <div className="hm-standalone">{standalone.map(x=>{const n=counts[x.id]??0;return <Link key={x.id} href={`/prep/mids/${x.id}`} className="hm-card hm-lift" style={{"--tone":toneFor(x.id)} as CSSProperties}><i/><span><strong>{x.code}</strong><small>{x.name}</small><small className="uses">{n?`${n} ${n===1?"dinner":"dinners"}`:x.examples.slice(0,3).join(" · ").toLowerCase()}</small></span></Link>})}</div>

  <SectionHead title="All mids" action={<span className="muted">{midBases.length} in the library</span>}/>
  <label className="hm-search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a mid‑base" aria-label="Find a mid-base"/>{q&&<button type="button" className="clear" aria-label="Clear" onClick={()=>setQ("")}>×</button>}</label>
  <div className="hm-list tight">{shownAll.map(m=>{const n=counts[m.id]??0;const parents=m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + ");return <Link key={m.id} href={`/prep/mids/${m.id}`} className="hm-card hm-row hm-lift" style={{padding:"10px 14px 10px 10px"}}><span style={{width:44,height:44,borderRadius:14,background:toneGradient(m.id),color:"#fff",fontSize:10,fontWeight:800,display:"grid",placeItems:"center",textAlign:"center",padding:"0 4px"}}>{m.code.length>6?m.code.slice(0,6):m.code}</span><span><strong>{m.name}</strong><small>{parents||"stands alone"}</small></span><span className={`hm-pill ${weekIds.has(m.id)?"":n?"sky":"neutral"}`}>{weekIds.has(m.id)?"this week":n?`${n} ${n===1?"dinner":"dinners"}`:"idea"}</span></Link>})}</div>
  {!q&&all.length>8&&<button className="hm-cook-more" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${all.length}`}</button>}
  {shownAll.length===0&&<div className="hm-empty"><strong>Nothing matches.</strong>Try another name.</div>}
 </div>;
}
