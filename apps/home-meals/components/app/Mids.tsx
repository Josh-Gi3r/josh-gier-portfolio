"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {canonicalPrepComponentsV2,recipePrepV2} from "@/data/food-truth-v2";
import {prepRelationshipLabelV2} from "@/data/prep-repertoire-v2";
import {motherBases,recipes} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,prepHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead} from "./Primitives";

const mids=canonicalPrepComponentsV2.filter(x=>x.tier==="mid");
const dinnersFor=(componentId:string)=>recipes.filter(r=>recipePrepV2(r.id).some(x=>x.componentId===componentId));
function MidThumb({id,code,size=44}:{id:string;code:string;size?:number}){const hero=prepHero(id);return <span style={{width:size,height:size,borderRadius:14,background:toneGradient(id),color:"#fff",fontSize:10,fontWeight:800,display:"grid",placeItems:"center",overflow:"hidden",flex:"0 0 auto"}}>{hero?<img src={hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:code.slice(0,6)}</span>}

export function Mids(){
 const h=useHousehold(),[selected,setSelected]=useState(motherBases.find(m=>m.id==="gold")?.id??motherBases[0].id),[q,setQ]=useState(""),[showAll,setShowAll]=useState(false);
 const mother=motherBases.find(x=>x.id===selected)??motherBases[0],weekIds=useMemo(()=>new Set(h.week.flatMap(id=>recipePrepV2(id).map(x=>x.componentId))),[h.week]),related=useMemo(()=>mids.filter(x=>x.madeFrom.includes(mother.id)||x.usedWith.includes(mother.id)),[mother.id]);
 const dinners=useMemo(()=>{const ids=new Set(related.map(x=>x.id));return recipes.filter(r=>recipePrepV2(r.id).some(x=>ids.has(x.componentId))||recipePrepV2(r.id).some(x=>x.componentId===mother.id))},[mother.id,related]);
 const standalone=mids.filter(m=>m.madeFrom.length===0&&m.usedWith.length===0),all=mids.filter(m=>!q||`${m.code} ${m.name}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(weekIds.has(b.id))-Number(weekIds.has(a.id))||dinnersFor(b.id).length-dinnersFor(a.id).length||a.name.localeCompare(b.name)),shownAll=q||showAll?all:all.slice(0,8),weekMid=mids.find(m=>weekIds.has(m.id));
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">Mids &amp; sauces</h1></div><p className="hm-lead hm-gut" style={{marginTop:10,fontSize:14}}>Some are made from a core base, some pair with one, and some stand alone. Home keeps those relationships separate.</p>
  <div className="hm-mothers-rail" aria-label="Choose a core base">{motherBases.map(m=>{const on=m.id===mother.id,hero=motherHero(m.id);return <button key={m.id} className={on?"on":""} aria-pressed={on} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties} onClick={()=>{setSelected(m.id);feedback("tap")}}><span className="ball">{hero?<img src={hero} alt=""/>:m.code}</span><small>{m.code}</small></button>})}</div>
  <div className="hm-card lg hm-explore" style={{"--tone":toneFor(mother.id)} as CSSProperties}><div className="head"><h3>{mother.code} relationships</h3><span>{dinners.length} {dinners.length===1?"dinner":"dinners"}</span></div>{related.length?<div className="hm-list tight" style={{marginTop:14}}>{related.map(x=><Link key={x.id} href={`/prep/mids/${x.id}`} className="hm-card hm-row hm-lift" style={{padding:"8px 10px"}}><MidThumb id={x.id} code={x.code}/><span><strong>{x.code} · {x.name}</strong><small>{prepRelationshipLabelV2(x.id)}</small></span></Link>)}</div>:<p className="hm-lead" style={{marginTop:12,fontSize:14}}>No mid is made from or explicitly paired with {mother.code}. Dinners may use the core base directly.</p>}{dinners.length?<div className="hm-rail sm">{dinners.slice(0,10).map(r=><MealTile key={r.id} recipe={r}/>)}</div>:null}</div>
  <HomeSays className="tight">{weekMid?<>This week uses <b>{weekMid.code}</b>. {prepRelationshipLabelV2(weekMid.id)}. {dinnersFor(weekMid.id).length?`${dinnersFor(weekMid.id).length} saved dinners use it.`:""}</>:<>Nothing in this week’s plan needs a mid. That is fine: mids are repertoire, not homework.</>}</HomeSays>
  <SectionHead title="Standalone mids" action={<span className="muted">no mother required</span>}/><div className="hm-list tight">{standalone.map(x=>{const n=dinnersFor(x.id).length;return <Link key={x.id} href={`/prep/mids/${x.id}`} className="hm-card hm-row hm-lift" style={{padding:"8px 10px"}}><MidThumb id={x.id} code={x.code} size={52}/><span><strong>{x.code} · {x.name}</strong><small>{n?`${n} ${n===1?"dinner":"dinners"}`:"library idea"}</small></span></Link>})}</div>
  <SectionHead title="All mids" action={<span className="muted">{mids.length} in the library</span>}/><label className="hm-search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a mid or sauce" aria-label="Find a mid or sauce"/>{q&&<button type="button" className="clear" aria-label="Clear" onClick={()=>setQ("")}>×</button>}</label><div className="hm-list tight">{shownAll.map(m=>{const n=dinnersFor(m.id).length;return <Link key={m.id} href={`/prep/mids/${m.id}`} className="hm-card hm-row hm-lift" style={{padding:"10px 14px 10px 10px"}}><MidThumb id={m.id} code={m.code}/><span><strong>{m.name}</strong><small>{prepRelationshipLabelV2(m.id)}</small></span><span className={`hm-pill ${weekIds.has(m.id)?"":n?"sky":"neutral"}`}>{weekIds.has(m.id)?"this week":n?`${n} ${n===1?"dinner":"dinners"}`:"idea"}</span></Link>})}</div>{!q&&all.length>8&&<button className="hm-cook-more" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${all.length}`}</button>}{shownAll.length===0&&<div className="hm-empty"><strong>Nothing matches.</strong>Try another name.</div>}
 </div>;
}
