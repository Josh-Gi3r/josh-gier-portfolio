"use client";
import { useEffect, useState } from "react";
import { hotFoundationTimeline, modifierSessionTimeline } from "@/data/foundation-ops";

export function PrepDayClient(){
 const [session,setSession]=useState<"hot"|"modifiers">("hot");
 const timeline=session==="hot"?hotFoundationTimeline:modifierSessionTimeline;
 const key=`home-meals-prep-day-${session}`;
 const [done,setDone]=useState<Record<string,boolean>>({});
 useEffect(()=>{try{const raw=localStorage.getItem(key);setDone(raw?JSON.parse(raw):{})}catch{setDone({})}},[key]);
 const toggle=(m:number)=>setDone(prev=>{const id=String(m);const next={...prev,[id]:!prev[id]};localStorage.setItem(key,JSON.stringify(next));return next});
 const completed=timeline.filter(x=>done[String(x.minute)]).length;
 const current=timeline.find(x=>!done[String(x.minute)])??timeline.at(-1)!;
 const finished=completed===timeline.length;
 return <div><div className="prep-session-switch"><button className={session==="hot"?"active":""} onClick={()=>setSession("hot")}><strong>Session A · Hot Foundations</strong><small>All 6 mother bases · about 3½ hours</small></button><button className={session==="modifiers"?"active":""} onClick={()=>setSession("modifiers")}><strong>Session B · Core Modifiers</strong><small>4 mids + 4 boosters · about 90 minutes</small></button></div><p className="scope-explainer">The full library contains 32 prep components. The first run deliberately makes 14 of them across two sessions. Rotational mids are added later only when the menu actually needs them.</p><div className="prep-day-app"><section className="prep-now"><span className="eyebrow">CURRENT MOVE</span><strong>{current.minute} min</strong><h2>{finished?"Session complete":current.title}</h2><p>{finished?"Everything in this session has been cooled or portioned correctly. Freeze with airflow around the trays, then bag only after portions are fully solid.":current.detail}</p>{current.codes?.length?<div className="current-codes">{current.codes.map(c=><span key={c}>{c}</span>)}</div>:null}<div className="prep-day-progress"><i style={{width:`${Math.round(completed/timeline.length*100)}%`}}/></div><small>{completed} of {timeline.length} stages complete</small></section><div className="prep-stage-list">{timeline.map((x,i)=><label key={x.minute} className={done[String(x.minute)]?"done":""}><input type="checkbox" checked={!!done[String(x.minute)]} onChange={()=>toggle(x.minute)}/><span>{String(i+1).padStart(2,"0")}</span><div><strong>{x.title}</strong><small>{x.minute} min · {x.detail}</small>{x.codes?.length?<div className="stage-codes">{x.codes.map(c=><b key={c}>{c}</b>)}</div>:null}</div></label>)}</div></div></div>
}
