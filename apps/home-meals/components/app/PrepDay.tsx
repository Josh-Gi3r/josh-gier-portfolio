"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {getComponent,midBases,motherBases} from "@/data/home-data";
import {batchOutputMl} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";

type Mode="week"|"stock";
type Job={id:string;shortMl:number;batches:number;neededMl:number;onHandMl:number};
type SessionJob=Job&{doneBatches:number};
const longCook=new Set(["clear","dark","red","onion"]);
const panCook=new Set(["blond","gold","sambal","rempah","rendang","laksa","malaysian-kari","asam-pedas","nam-prik-pao","douban","duxelles"]);
function phase(id:string){return longCook.has(id)?0:panCook.has(id)?1:2}
function phaseName(p:number){return p===0?"Start first":p===1?"While those cook":"Finish with the quick ones"}
function phaseNote(p:number){return p===0?"Get the long pots on. They can simmer while you do everything else.":p===1?"Use the stove space that opens up. Cook bases and fried pastes to their visual cue.":"Mix, blend and portion the shorter jobs at the end."}
function equipment(id:string){if(["clear","dark"].includes(id))return "large pot";if(longCook.has(id)||panCook.has(id))return "wide pan / pot";if(midBases.some(x=>x.id===id))return "pan / blender";return "small bowl / blender"}

export function PrepDay(){
 const h=useHousehold();const[mode,setMode]=useState<Mode>("week");const[session,setSession]=useState<SessionJob[]|null>(null);
 const stockJobs=useMemo<Job[]>(()=>motherBases.map(m=>{const target=m.portionMl*2;const ml=h.componentStock[m.id]??0;return{id:m.id,shortMl:Math.max(0,target-ml),batches:ml<target?1:0,neededMl:target,onHandMl:ml}}).filter(x=>x.shortMl>0),[h.componentStock]);
 const liveJobs=(mode==="week"?h.prepNeeds:stockJobs).map(x=>({...x,batches:Math.max(1,x.batches)})).sort((a,b)=>phase(a.id)-phase(b.id));
 const jobs=session??liveJobs.map(x=>({...x,doneBatches:0}));
 const totalBatches=jobs.reduce((n,x)=>n+x.batches,0);const completed=jobs.reduce((n,x)=>n+x.doneBatches,0);const pct=totalBatches?Math.round(completed/totalBatches*100):100;
 const start=()=>{setSession(liveJobs.map(x=>({...x,doneBatches:0})));feedback("change")};
 const reset=(next:Mode)=>{setMode(next);setSession(null);feedback("tap")};
 const run=(id:string)=>{if(!session)return;const job=session.find(x=>x.id===id);if(!job||job.doneBatches>=job.batches)return;h.makeBatch(id);setSession(prev=>prev?.map(x=>x.id===id?{...x,doneBatches:x.doneBatches+1}:x)??null);feedback("success")};
 const grouped=[0,1,2].map(p=>({p,jobs:jobs.filter(x=>phase(x.id)===p)})).filter(x=>x.jobs.length);
 const finished=!!session&&completed>=totalBatches;
 return <div className="hm-page-v5 hm-prepday-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="PREP DAY" title="Prep session" sub="Set the long cooks going, then work around them."/>
  {!session&&<div className="hm-segment-v5"><button className={mode==="week"?"active":""} onClick={()=>reset("week")}>This week</button><button className={mode==="stock"?"active":""} onClick={()=>reset("stock")}>Stock up</button></div>}
  <div className="hm-prep-progress-v5"><div><span>{session?"Session progress":"Session plan"}</span><strong>{jobs.length?`${totalBatches} ${totalBatches===1?"batch":"batches"} · ${jobs.length} ${jobs.length===1?"job":"jobs"}`:"Nothing to make"}</strong></div><em><i style={{width:`${session?pct:0}%`}}/></em></div>
  {!session&&jobs.length>0&&<section className="hm-prep-start-v5"><div><strong>Order is already sorted</strong><p>Long stocks and reductions first, cooked bases next, quick mixes last. Open each recipe if you need its exact method or visual cue.</p></div><button onClick={start}>Start session</button></section>}
  {jobs.length&&!finished?<div className={`hm-prep-phases-v5 ${session?"running":"preview"}`}>{grouped.map(group=><section key={group.p}><header><span>{String(group.p+1).padStart(2,"0")}</span><div><strong>{phaseName(group.p)}</strong><small>{phaseNote(group.p)}</small></div></header><div className="hm-prepday-list-v5">{group.jobs.map((j,i)=>{const c=getComponent(j.id);if(!c)return null;const done=j.doneBatches>=j.batches;return <article key={j.id} className={done?"done":""} style={{"--tone":c.tone} as React.CSSProperties}><b>{done?"✓":String(i+1).padStart(2,"0")}</b><i/><div><strong>{c.code} · {c.name}</strong><span>{mode==="week"?`${j.shortMl} ml short`:`${j.onHandMl} ml now`} · {equipment(j.id)}</span><small>{j.batches} {j.batches===1?"batch":"batches"} · {batchOutputMl(j.id)} ml each{j.doneBatches?` · ${j.doneBatches} done`:""}</small></div>{session?<button disabled={done} onClick={()=>run(j.id)}>{done?"Done":"Batch done"}</button>:<Link href={motherBases.some(m=>m.id===j.id)?`/prep/${j.id}`:midBases.some(m=>m.id===j.id)?`/prep/mids/${j.id}`:"/prep"}>Recipe</Link>}</article>})}</div></section>)}</div>:null}
  {!jobs.length||finished?<div className="hm-empty-v5 hm-done-v5"><span>✓</span><strong>{finished?"Prep session finished":mode==="week"?"This week is covered":"Foundations are stocked"}</strong><p>{finished?"The completed batches are now in Kitchen stock.":"No batch needed right now."}</p><Link href="/prep">Back to Prep</Link></div>:null}
  <section className="hm-prep-rules-v5"><div><b>1</b><span><strong>Cook</strong><small>Follow the batch recipe and its doneness cue.</small></span></div><div><b>2</b><span><strong>Cool</strong><small>Cool safely before portioning.</small></span></div><div><b>3</b><span><strong>Label</strong><small>Name · amount · date.</small></span></div><div><b>4</b><span><strong>Freeze</strong><small>Put the new batch behind older stock.</small></span></div></section>
 </div>}
