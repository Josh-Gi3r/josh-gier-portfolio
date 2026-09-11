"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {getComponent,motherBases} from "@/data/home-data";
import {batchOutputMl} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";

export function PrepDay(){const h=useHousehold();const[mode,setMode]=useState<"week"|"stock">("week");const[done,setDone]=useState(0);
 const stockJobs=useMemo(()=>motherBases.map(m=>{const target=m.portionMl*2;const ml=h.componentStock[m.id]??0;return{id:m.id,shortMl:Math.max(0,target-ml),batches:ml<target?1:0,neededMl:target,onHandMl:ml}}).filter(x=>x.shortMl>0),[h.componentStock]);
 const jobs=mode==="week"?h.prepNeeds:stockJobs;const totalBatches=jobs.reduce((n,x)=>n+Math.max(1,x.batches),0);const pct=totalBatches?Math.min(100,Math.round((done/totalBatches)*100)):100;
 const run=(id:string)=>{h.makeBatch(id);setDone(x=>x+1);feedback("success")};
 return <div className="hm-page-v5 hm-prepday-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="PREP DAY" title="Prep session" sub="One job at a time."/>
  <div className="hm-segment-v5"><button className={mode==="week"?"active":""} onClick={()=>{setMode("week");setDone(0)}}>This week</button><button className={mode==="stock"?"active":""} onClick={()=>{setMode("stock");setDone(0)}}>Stock up</button></div>
  <div className="hm-prep-progress-v5"><div><span>This session</span><strong>{jobs.length?`${totalBatches} ${totalBatches===1?"batch":"batches"}`:"Nothing to make"}</strong></div><em><i style={{width:`${pct}%`}}/></em></div>
  {jobs.length?<div className="hm-prepday-list-v5">{jobs.map((j,i)=>{const c=getComponent(j.id);if(!c)return null;return <article key={j.id} style={{"--tone":c.tone} as React.CSSProperties}><b>{String(i+1).padStart(2,"0")}</b><i/><div><strong>{c.code} · {c.name}</strong><span>{mode==="week"?`${j.shortMl} ml short`:`${j.onHandMl} ml now`}</span><small>One batch adds {batchOutputMl(j.id)} ml</small></div><button onClick={()=>run(j.id)}>Batch done</button></article>})}</div>:<div className="hm-empty-v5 hm-done-v5"><span>✓</span><strong>{mode==="week"?"This week is covered":"Foundations are stocked"}</strong><p>No batch needed right now.</p><Link href="/prep">Back to Prep</Link></div>}
  <section className="hm-prep-rules-v5"><div><b>1</b><span><strong>Cook</strong><small>Follow the batch recipe and its doneness cue.</small></span></div><div><b>2</b><span><strong>Cool</strong><small>Cool safely before portioning.</small></span></div><div><b>3</b><span><strong>Label</strong><small>Name · amount · date.</small></span></div><div><b>4</b><span><strong>Freeze</strong><small>Put the new batch behind older stock.</small></span></div></section>
 </div>}
