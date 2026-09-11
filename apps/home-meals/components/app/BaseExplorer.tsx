"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";

export function BaseExplorer(){
 const[selected,setSelected]=useState(motherBases[2]?.id??motherBases[0].id);const mother=motherBases.find(x=>x.id===selected)??motherBases[0];
 const mids=useMemo(()=>midBases.filter(x=>x.parentMotherIds.includes(mother.id)),[mother.id]);
 const dinnerIds=useMemo(()=>{const direct=recipes.filter(r=>r.motherIds.includes(mother.id));const byMid=recipes.filter(r=>r.midIds.some(id=>mids.some(m=>m.id===id)));const map=new Map([...direct,...byMid].map(r=>[r.id,r]));return [...map.values()].slice(0,8)},[mother.id,mids]);
 return <section className="hm-base-explorer-v5">
  <header><div><span>BASE → DINNER</span><h2>What this base opens up</h2></div><small>{mother.approxMeals} directions · {dinnerIds.length} saved</small></header>
  <div className="hm-base-selector-v5" aria-label="Choose a mother base">{motherBases.map(m=><button key={m.id} className={m.id===mother.id?"active":""} style={{"--tone":m.tone} as React.CSSProperties} onClick={()=>{setSelected(m.id);feedback("tap")}}><i/><span>{m.code}</span></button>)}</div>
  <div className="hm-base-flow-v5" style={{"--tone":mother.tone} as React.CSSProperties}>
   <div className="hm-base-flow-root-v5"><i/><strong>{mother.code}</strong><span>{mother.name}</span></div>
   <div className="hm-base-flow-arrow-v5" aria-hidden="true">↓</div>
   <div className="hm-base-flow-mids-v5">{mids.length?mids.map((mid,i)=>{const count=recipes.filter(r=>r.midIds.includes(mid.id)).length;return <Link href={`/prep/mids/${mid.id}`} key={mid.id} style={{"--delay":`${i*55}ms`} as React.CSSProperties}><strong>{mid.code}</strong><span>{mid.name}</span><small>{count?`${count} saved recipe${count===1?"":"s"}`:"not in our rotation yet"}</small></Link>}):<div className="hm-base-flow-direct-v5"><strong>Direct</strong><span>No mid needed</span></div>}</div>
   <div className="hm-base-flow-arrow-v5" aria-hidden="true">↓</div>
   {dinnerIds.length?<div className="hm-base-flow-dinners-v5">{dinnerIds.map((r,i)=><Link href={`/cook/${r.id}`} key={r.id} style={{"--delay":`${i*45}ms`} as React.CSSProperties}><span>{recipeTitle(r.id,r.title)}</span><small>{r.minutes} min</small></Link>)}</div>:<div className="hm-base-directions-v5"><strong>Good next directions</strong><div tabIndex={0} aria-label="Possible dinner directions">{mother.examples.slice(0,6).map(x=><span key={x}>{x}</span>)}</div><small>These are ideas this base supports, not saved recipes yet.</small></div>}
  </div>
 </section>
}
