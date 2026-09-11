"use client";
import { useEffect, useState } from "react";
import { prepTimeline } from "@/data/foundation";

export function PrepDayClient(){
 const [done,setDone]=useState<Record<number,boolean>>({});
 useEffect(()=>{try{const raw=localStorage.getItem("home-meals-prep-day");if(raw)setDone(JSON.parse(raw))}catch{}},[]);
 const toggle=(m:number)=>setDone(prev=>{const next={...prev,[m]:!prev[m]};localStorage.setItem("home-meals-prep-day",JSON.stringify(next));return next});
 const completed=prepTimeline.filter(x=>done[x.minute]).length;
 const current=prepTimeline.find(x=>!done[x.minute])??prepTimeline.at(-1)!;
 return <div className="prep-day-app"><section className="prep-now"><span className="eyebrow">CURRENT MOVE</span><strong>{current.minute} min</strong><h2>{completed===prepTimeline.length?"Foundation prep complete":current.title}</h2><p>{completed===prepTimeline.length?"Everything has been cooled, portioned and labelled. Freeze with airflow around the trays, then bag once solid.":current.detail}</p><div className="prep-day-progress"><i style={{width:`${Math.round(completed/prepTimeline.length*100)}%`}}/></div><small>{completed} of {prepTimeline.length} stages complete</small></section><div className="prep-stage-list">{prepTimeline.map((x,i)=><label key={x.minute} className={done[x.minute]?"done":""}><input type="checkbox" checked={!!done[x.minute]} onChange={()=>toggle(x.minute)}/><span>{String(i+1).padStart(2,"0")}</span><div><strong>{x.title}</strong><small>{x.minute} min · {x.detail}</small></div></label>)}</div></div>
}
