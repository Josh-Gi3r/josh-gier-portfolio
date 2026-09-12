"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {getComponent,getRecipe,midBases,motherBases} from "@/data/home-data";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {recipeTitle} from "@/data/recipe-display";
import {batchOutputMl} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";

type Mode="week"|"stock";
type Job={id:string;shortMl:number;batches:number;neededMl:number;onHandMl:number};
type SessionJob=Job&{doneBatches:number};
type WrapKey="cool"|"label"|"freeze";
const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longCook=new Set(["clear","dark","red","onion"]);
const panCook=new Set(["blond","gold","sambal","rempah","rendang","laksa","malaysian-kari","asam-pedas","nam-prik-pao","douban","duxelles"]);
const motherIds=new Set(motherBases.map(x=>x.id));
function phase(id:string){return longCook.has(id)?0:panCook.has(id)?1:2}
function phaseName(p:number){return p===0?"Start first":p===1?"While those cook":"Finish with the quick ones"}
function phaseNote(p:number){return p===0?"Get the long pots on. They can simmer while you do everything else.":p===1?"Use the stove space that opens up. Cook bases and fried pastes to their visual cue.":"Mix, blend and portion the shorter jobs at the end."}
function equipment(id:string){if(["clear","dark"].includes(id))return "large pot";if(longCook.has(id)||panCook.has(id))return "wide pan / pot";if(midBases.some(x=>x.id===id))return "pan / blender";return "small bowl / blender"}
function prepHref(id:string){const c=getComponent(id);return c?.kind==="mother"?`/prep/${id}`:c?.kind==="mid"?`/prep/mids/${id}`:c?.kind==="booster"?`/prep/boosters/${id}`:"/prep"}
const emptyWrap=()=>({cool:false,label:false,freeze:false});

export function PrepDay(){
 const h=useHousehold();const[mode,setMode]=useState<Mode>("week");const[session,setSession]=useState<SessionJob[]|null>(null);const[setupPart,setSetupPart]=useState<0|1>(0);const[firstRunActive,setFirstRunActive]=useState(false);const[wrap,setWrap]=useState(emptyWrap);const[committed,setCommitted]=useState(false);
 const stockJobs=useMemo<Job[]>(()=>motherBases.map(m=>{const target=m.portionMl*2;const ml=h.componentStock[m.id]??0;return{id:m.id,shortMl:Math.max(0,target-ml),batches:ml<target?1:0,neededMl:target,onHandMl:ml}}).filter(x=>x.shortMl>0),[h.componentStock]);
 const baseJobs=(mode==="week"?h.prepNeeds:stockJobs).map(x=>({...x,batches:Math.max(1,x.batches)})).sort((a,b)=>phase(a.id)-phase(b.id));
 const setupA=baseJobs.filter(x=>motherIds.has(x.id)),setupB=baseJobs.filter(x=>!motherIds.has(x.id));
 const shouldSplit=mode==="week"&&!session&&!firstRunActive&&h.prepBatches.length===0&&baseJobs.length>6&&setupA.length>0&&setupB.length>0;
 const split=firstRunActive||shouldSplit;
 const liveJobs=split?(setupPart===0?setupA:setupB):baseJobs;
 const jobs=session??liveJobs.map(x=>({...x,doneBatches:0}));
 const totalBatches=jobs.reduce((n,x)=>n+x.batches,0);const completed=jobs.reduce((n,x)=>n+x.doneBatches,0);const pct=totalBatches?Math.round(completed/totalBatches*100):100;
 const resetWrap=()=>{setWrap(emptyWrap());setCommitted(false)};
 const start=()=>{if(shouldSplit)setFirstRunActive(true);setSession(liveJobs.map(x=>({...x,doneBatches:0})));resetWrap();feedback("change")};
 const reset=(next:Mode)=>{setMode(next);setSession(null);setSetupPart(0);setFirstRunActive(false);resetWrap();feedback("tap")};
 const chooseSetup=(part:0|1)=>{setSetupPart(part);setSession(null);resetWrap();feedback("tap")};
 const nextSetup=()=>{setSetupPart(1);setSession(null);resetWrap();feedback("change")};
 const run=(id:string)=>{if(!session)return;const job=session.find(x=>x.id===id);if(!job||job.doneBatches>=job.batches)return;setSession(prev=>prev?.map(x=>x.id===id?{...x,doneBatches:x.doneBatches+1}:x)??null);feedback("success")};
 const grouped=[0,1,2].map(p=>({p,jobs:jobs.filter(x=>phase(x.id)===p)})).filter(x=>x.jobs.length);
 const batchesFinished=!!session&&totalBatches>0&&completed>=totalBatches;
 const wrapDone=wrap.cool&&wrap.label&&wrap.freeze;
 const finished=batchesFinished&&wrapDone;
 const commitSession=()=>{if(!session||committed)return;for(const job of session){for(let i=0;i<job.doneBatches;i++)h.makeBatch(job.id)}setCommitted(true)};
 const completeWrap=(key:WrapKey)=>{if(!batchesFinished)return;if(key==="label"&&!wrap.cool)return;if(key==="freeze"&&!wrap.label)return;if(key==="freeze")commitSession();setWrap(prev=>({...prev,[key]:true}));feedback(key==="freeze"?"success":"change")};
 const usedBy=(componentId:string)=>h.week.map((rid,i)=>{const r=getRecipe(rid);return r.prep.some(x=>x.id===componentId)?`${days[i]} ${recipeTitle(r.id,r.title)}`:null}).filter(Boolean) as string[];
 const firstA=baseJobs.filter(x=>motherIds.has(x.id)).length,firstB=baseJobs.filter(x=>!motherIds.has(x.id)).length;
 const workbenchTitle=!session?"Set up the bench":batchesFinished&&!wrapDone?"Finish the prep":finished?"Everything is away":"Cook through the list";
 const workbenchNote=!session?"Long cooks first. Quick mixes last. Keep trays and labels ready before the pans finish.":batchesFinished&&!wrapDone?"Cooking is done. Cool, portion, label and freeze before this session counts as finished.":finished?"Stock is now logged in Kitchen with today’s batch date.":`${completed} of ${totalBatches} batches cooked.`;
 return <div className="hm-page-v5 hm-prepday-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="PREP DAY" title="Prep session" sub="Set the long cooks going, then work around them."/>
  {!session&&<div className="hm-segment-v5"><button className={mode==="week"?"active":""} onClick={()=>reset("week")}>This week</button><button className={mode==="stock"?"active":""} onClick={()=>reset("stock")}>Stock up</button></div>}
  <section className="hm-prepday-workbench-v7" style={{backgroundImage:`url(${foundationImages.prepDay})`}}><div><span><span>{session?"ON THE BENCH":"PREP WORKBENCH"}</span><strong>{workbenchTitle}</strong><small>{workbenchNote}</small></span><b>{session?`${completed}/${totalBatches}`:`${jobs.length}`}</b></div></section>
  {split&&!session&&mode==="week"&&<section className="hm-first-run-v5"><span>STARTING FROM EMPTY</span><h2>Two sessions. Not one marathon.</h2><p>Do the mother bases first. Come back for the smaller mids and quick prep after the foundations are in the freezer.</p><div><button className={setupPart===0?"active":""} onClick={()=>chooseSetup(0)}>A · Foundations <b>{firstA}</b></button><button className={setupPart===1?"active":""} onClick={()=>chooseSetup(1)}>B · Mids + quick <b>{firstB}</b></button></div></section>}
  <div className="hm-prep-progress-v5"><div><span>{session?"Session progress":split?`Session ${setupPart===0?"A":"B"}`:"Session plan"}</span><strong>{jobs.length?`${totalBatches} ${totalBatches===1?"batch":"batches"} · ${jobs.length} ${jobs.length===1?"job":"jobs"}`:"Nothing to make"}</strong></div><em><i style={{width:`${session?pct:0}%`}}/></em></div>
  {!session&&jobs.length>0&&<section className="hm-prep-start-v5"><div><strong>{split?(setupPart===0?"Foundations first":"Mids + quick prep"):"Order is already sorted"}</strong><p>{split&&setupPart===0?"These are the big reusable pieces. Start the long pots, then cook the other mothers around them.":split?"These smaller jobs finish the week once the main foundations are handled.":"Long stocks and reductions first, cooked bases next, quick mixes last. Open each recipe if you need its exact method or visual cue."}</p></div><button onClick={start}>Start session</button></section>}
  {jobs.length&&!batchesFinished?<div className={`hm-prep-phases-v5 ${session?"running":"preview"}`}>{grouped.map(group=><section key={group.p}><header><span>{String(group.p+1).padStart(2,"0")}</span><div><strong>{phaseName(group.p)}</strong><small>{phaseNote(group.p)}</small></div></header><div className="hm-prepday-list-v5">{group.jobs.map((j,i)=>{const c=getComponent(j.id);if(!c)return null;const done=j.doneBatches>=j.batches;const meals=usedBy(j.id);const photo=motherProcessImages[j.id]?.[2]?.url??motherProcessImages[j.id]?.[0]?.url;return <article key={j.id} className={done?"done":""} style={{"--tone":c.tone} as React.CSSProperties}><b>{done?"✓":String(i+1).padStart(2,"0")}</b><span className="hm-prep-job-photo-v7">{photo?<img src={photo} alt={`${c.name} prep cue`} loading="lazy"/>:<i/>}</span><div><strong>{c.code} · {c.name}</strong><span>{mode==="week"?`${j.shortMl} ml short`:`${j.onHandMl} ml now`} · {equipment(j.id)}</span><small>{j.batches} {j.batches===1?"batch":"batches"} · {batchOutputMl(j.id)} ml each{j.doneBatches?` · ${j.doneBatches} cooked`:""}</small>{mode==="week"&&meals.length>0&&<small className="hm-prep-usedby-v5">For {meals.slice(0,3).join(" · ")}{meals.length>3?` +${meals.length-3}`:""}</small>}</div>{session?<div className="hm-prep-job-actions-v37"><Link href={prepHref(j.id)} target="_blank" rel="noreferrer" onClick={()=>feedback("tap")}>Guide ↗</Link><button disabled={done} onClick={()=>run(j.id)}>{done?"Cooked":"Batch cooked"}</button></div>:<Link href={prepHref(j.id)}>Recipe</Link>}</article>})}</div></section>)}</div>:null}
  {batchesFinished&&!wrapDone&&<section className="hm-prep-wrap-v7"><header><span>FINISH THE SESSION</span><h2>Cooked isn’t stored yet.</h2><p>These three steps keep the freezer useful and make the stock count truthful.</p></header><div><button className={wrap.cool?"done":""} onClick={()=>completeWrap("cool")}><i>{wrap.cool?"✓":"1"}</i><span><strong>Cool safely</strong><small>Get the hot prep out of deep pots and cool before sealing.</small></span><b>›</b></button><button disabled={!wrap.cool} className={wrap.label?"done":""} onClick={()=>completeWrap("label")}><i>{wrap.label?"✓":"2"}</i><span><strong>Portion + label</strong><small>Name, amount and today’s date. Use the recipe portion size.</small></span><b>›</b></button><button disabled={!wrap.label} className={wrap.freeze?"done":""} onClick={()=>completeWrap("freeze")}><i>{wrap.freeze?"✓":"3"}</i><span><strong>Freeze + log stock</strong><small>New batch goes behind older stock. Kitchen updates only now.</small></span><b>›</b></button></div></section>}
  {finished&&firstRunActive&&setupPart===0?<div className="hm-empty-v5 hm-done-v5"><span>✓</span><strong>Foundations done</strong><p>The mother bases are cooled, labelled, frozen and logged in Kitchen. The remaining mids and quick prep can be a separate session.</p><button className="hm-primary-button-v5" onClick={nextSetup}>Next: mids + quick</button></div>:!jobs.length||finished?<div className="hm-empty-v5 hm-done-v5"><span>✓</span><strong>{finished?"Prep session finished":mode==="week"?"This week is covered":"Foundations are stocked"}</strong><p>{finished?"Everything is cooled, labelled, frozen and now counted in Kitchen.":"No batch needed right now."}</p><Link href="/prep">Back to Prep</Link></div>:null}
  {!session&&<section className="hm-prep-rules-v5"><div><b>1</b><span><strong>Cook</strong><small>Follow the batch recipe and its doneness cue.</small></span></div><div><b>2</b><span><strong>Cool</strong><small>Cool safely before portioning.</small></span></div><div><b>3</b><span><strong>Label</strong><small>Name · amount · date.</small></span></div><div><b>4</b><span><strong>Freeze</strong><small>Put the new batch behind older stock.</small></span></div></section>}
 </div>}
