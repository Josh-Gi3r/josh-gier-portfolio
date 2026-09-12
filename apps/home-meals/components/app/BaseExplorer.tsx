"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {motherProcessImages} from "@/data/mother-process-assets";
import {recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";

export function BaseExplorer(){
 const[selected,setSelected]=useState(motherBases[2]?.id??motherBases[0].id);const mother=motherBases.find(x=>x.id===selected)??motherBases[0];
 const mids=useMemo(()=>midBases.filter(x=>x.parentMotherIds.includes(mother.id)),[mother.id]);
 const dinners=useMemo(()=>{const direct=recipes.filter(r=>r.motherIds.includes(mother.id));const byMid=recipes.filter(r=>r.midIds.some(id=>mids.some(m=>m.id===id)));const map=new Map([...direct,...byMid].map(r=>[r.id,r]));return [...map.values()].slice(0,8)},[mother.id,mids]);
 const motherImage=motherProcessImages[mother.id]?.at(-1)?.url;
 return <section className="hm-base-explorer-v5 hm-base-explorer-v6">
  <header><div><span>THE SYSTEM</span><h2>One foundation. Many directions.</h2><p>Tap a mother and watch the cookbook branch from prep into dinner.</p></div><small>{mother.approxMeals} possible directions · {dinners.length} saved</small></header>
  <div className="hm-base-selector-v5 hm-base-selector-v6" aria-label="Choose a mother base">{motherBases.map(m=><button key={m.id} className={m.id===mother.id?"active":""} style={{"--tone":m.tone} as React.CSSProperties} onClick={()=>{setSelected(m.id);feedback("tap")}}><i/><span>{m.code}</span></button>)}</div>

  <div className="hm-system-map-v6" style={{"--tone":mother.tone} as React.CSSProperties}>
   <Link href={`/prep/${mother.id}`} className="hm-system-root-v6">{motherImage?<img src={motherImage} alt="" loading="lazy"/>:<div/>}<span>MOTHER</span><strong>{mother.code}</strong><small>{mother.name}</small></Link>
   <div className="hm-system-connector-v6" aria-hidden="true"><i/><span>{mids.length?"branches into":"works directly"}</span><i/></div>
   {mids.length?<div className="hm-system-mids-v6">{mids.map((mid,i)=>{const count=recipes.filter(r=>r.midIds.includes(mid.id)).length;return <Link href={`/prep/mids/${mid.id}`} key={mid.id} style={{"--mid-tone":mid.tone,"--delay":`${i*45}ms`} as React.CSSProperties}><i/><span>MID</span><strong>{mid.code}</strong><small>{mid.name}</small><em>{count?`${count} recipe${count===1?"":"s"}`:"direction"}</em></Link>})}</div>:<div className="hm-system-direct-v6"><strong>No mid needed</strong><span>{mother.code} can go straight into dinner.</span></div>}
   <div className="hm-system-connector-v6 second" aria-hidden="true"><i/><span>lands as dinner</span><i/></div>
   {dinners.length?<div className="hm-system-dinners-v6">{dinners.map((r,i)=><Link href={`/cook/${r.id}`} key={r.id} style={{"--delay":`${i*35}ms`} as React.CSSProperties}>{r.image?<img src={r.image} alt="" loading="lazy"/>:<div/>}<span><strong>{recipeTitle(r.id,r.title)}</strong><small>{r.minutes} min · {r.cuisine}</small></span></Link>)}</div>:<div className="hm-base-directions-v5 hm-system-ideas-v6"><strong>Good next dinner ideas</strong><div tabIndex={0} aria-label="Possible dinner ideas">{mother.examples.slice(0,6).map(x=><span key={x}>{x}</span>)}</div><small>Ideas this mother supports; they are not saved recipes yet.</small></div>}
  </div>
 </section>
}
