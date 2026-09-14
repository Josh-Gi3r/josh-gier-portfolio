"use client";
import Link from "next/link";
import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {getComponent,getRecipe,midBases,motherBases} from "@/data/home-data";
import {baseRecipesV2} from "@/data/base-recipes-v2";
import {recipeTitle} from "@/data/recipe-display";
import {batchOutputMl,stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Check,Progress,RoundBack,SectionHead} from "./Primitives";

type Mode="week"|"stock";
type Job={id:string;batches:number;shortMl:number};
type Wrap="cool"|"label"|"freeze";
const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
// Rough hands-on minutes per batch; long pots start first so they simmer while the rest happens.
const minutesFor=(id:string)=>({clear:60,dark:75,red:60,onion:60,gold:90,blond:70,sambal:50,rempah:60} as Record<string,number>)[id]??(midBases.some(m=>m.id===id)?25:10);
const longCook=new Set(["clear","dark","red","onion"]);
const panCook=new Set(["blond","gold","sambal","rempah","rendang","laksa","malaysian-kari","asam-pedas","nam-prik-pao","douban","duxelles"]);
const phase=(id:string)=>longCook.has(id)?0:panCook.has(id)?1:2;
const equipment=(id:string)=>["clear","dark"].includes(id)?"large pot":longCook.has(id)||panCook.has(id)?"wide pan":"blender";
const hrefFor=(id:string)=>{const c=getComponent(id);return c?.kind==="mother"?`/prep/${id}`:c?.kind==="mid"?`/prep/mids/${id}`:c?.kind==="booster"?`/prep/boosters/${id}`:"/prep"};
const cueFor=(id:string)=>baseRecipesV2[id]?.cues?.[1]??baseRecipesV2[id]?.cues?.[0]??null;
const fmtMin=(m:number)=>m>=60?`${Math.floor(m/60)} h${m%60?` ${m%60}`:""}`:`${m} min`;

export function PrepDay(){
 const h=useHousehold();
 const[mode,setMode]=useState<Mode>("week");const[picked,setPicked]=useState<string[]>([]);const[session,setSession]=useState<Job[]|null>(null);const[done,setDone]=useState<Record<string,number>>({});const[wrap,setWrap]=useState<Record<Wrap,boolean>>({cool:false,label:false,freeze:false});const[startedAt,setStartedAt]=useState<number|null>(null);const[committed,setCommitted]=useState(false);
 const today=(new Date().getDay()+6)%7;
 const weekJobs=useMemo<Job[]>(()=>h.prepNeeds.map(x=>({id:x.id,batches:Math.max(1,x.batches),shortMl:x.shortMl})),[h.prepNeeds]);
 const lowMothers=useMemo(()=>motherBases.filter(m=>stockPortions(m.id,h.componentStock)<2).map(m=>m.id),[h.componentStock]);
 useEffect(()=>{if(mode==="stock"&&!picked.length)setPicked(lowMothers.length?lowMothers:motherBases.slice(0,4).map(m=>m.id))},[mode]); // eslint-disable-line react-hooks/exhaustive-deps
 const stockJobs=useMemo<Job[]>(()=>picked.map(id=>({id,batches:1,shortMl:0})),[picked]);
 const planned=(mode==="week"?weekJobs:stockJobs).slice().sort((a,b)=>phase(a.id)-phase(b.id));
 const jobs=session??planned;
 const tasks=jobs.flatMap(j=>Array.from({length:j.batches},(_,i)=>({key:`${j.id}:${i}`,id:j.id,n:i+1,of:j.batches})));
 const cookDone=tasks.filter(t=>(done[t.id]??0)>=t.n).length;const allCooked=tasks.length>0&&cookDone===tasks.length;
 const totalMin=jobs.reduce((s,j)=>s+minutesFor(j.id)*j.batches,0);const leftMin=tasks.filter(t=>(done[t.id]??0)<t.n).reduce((s,t)=>s+minutesFor(t.id),0);
 const totalSteps=tasks.length+3;const doneSteps=cookDone+Number(wrap.cool)+Number(wrap.label)+Number(wrap.freeze);const pct=totalSteps?Math.round(doneSteps/totalSteps*100):0;
 const current=tasks.find(t=>(done[t.id]??0)<t.n);
 const headline=jobs.map(j=>{const c=getComponent(j.id);return c?`${c.code} ×${(c.batchYield??1)*j.batches}`:null}).filter(Boolean).slice(0,3).join(" · ");
 const start=()=>{setSession(planned);setDone({});setWrap({cool:false,label:false,freeze:false});setStartedAt(Date.now());setCommitted(false);feedback("change")};
 const reset=(m:Mode)=>{setMode(m);setSession(null);setDone({});setWrap({cool:false,label:false,freeze:false});setStartedAt(null);setCommitted(false);feedback("tap")};
 const tick=(t:{id:string;n:number})=>{if(!session)return;setDone(d=>({...d,[t.id]:(d[t.id]??0)>=t.n?t.n-1:t.n}));feedback("success")};
 const tickWrap=(k:Wrap)=>{if(!allCooked)return;if(k==="label"&&!wrap.cool)return;if(k==="freeze"&&!wrap.label)return;if(k==="freeze"&&!committed){for(const j of session??[])for(let i=0;i<(done[j.id]??0);i++)h.makeBatch(j.id);setCommitted(true)}setWrap(w=>({...w,[k]:!w[k]}));feedback(k==="freeze"?"success":"change")};
 const finished=allCooked&&wrap.cool&&wrap.label&&wrap.freeze;
 const usedBy=(id:string)=>h.week.map((rid,i)=>getRecipe(rid).prep.some(p=>p.id===id)?days[i]:null).filter(Boolean).join(", ");
 const says=(()=>{
  if(!h.kitchenReady)return {text:<>Count the freezer first and this list becomes exactly what the week is short of — nothing more.</>,actions:<Link className="primary" href="/kitchen">Count the freezer</Link>};
  if(finished)return {text:<>All in the freezer and counted, dated today. Oldest still goes first.</>,actions:<Link className="primary" href="/prep">Back to Prep</Link>};
  if(session&&current){const c=getComponent(current.id);const cue=cueFor(current.id);return {text:<><b>{c?.code}</b> is on{cue?` — ${cue.toLowerCase()}.`:"."} {tasks.length-cookDone>1?"Everything else can wait for it.":"Last one."}</>,actions:<Link className="primary" href={hrefFor(current.id)}>Show the cue</Link>}}
  if(session&&allCooked)return {text:<>Cooked isn’t stored. Cool it in shallow trays, label CODE / ML / DATE, then freeze — I’ll count it once it’s in.</>};
  if(mode==="stock")return {text:<>A full stock‑up is about <b>{fmtMin(totalMin)}</b>. Pick which bases — I’ll order the pans so nothing waits.</>};
  if(!jobs.length)return {text:<>The freezer covers this week. Switch to Stock‑up if you want to top up anyway.</>,actions:<button className="primary" onClick={()=>reset("stock")}>Stock up</button>};
  return {text:<>Short <b>{headline}</b>. About {fmtMin(totalMin)} hands‑on{jobs.some(j=>longCook.has(j.id))?", long pots first.":"."}</>};
 })();
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">Prep Day</h1><span className="spacer"/><span className="hm-note">{longDays[today]}</span></div>
  {!session&&<div className="hm-seg sm" role="tablist"><button role="tab" aria-selected={mode==="week"} className={mode==="week"?"on":""} onClick={()=>reset("week")}>This week</button><button role="tab" aria-selected={mode==="stock"} className={mode==="stock"?"on":""} onClick={()=>reset("stock")}>Stock‑up</button></div>}
  {(session||mode==="week")&&jobs.length>0&&<div className={`hm-prepday-card ${finished?"done":""}`}>
   <div className="head"><span className="kick">{mode==="week"?"THIS WEEK":"STOCK-UP"}</span><span className="n">{session?`${doneSteps}/${totalSteps} done`:`${jobs.length} ${jobs.length===1?"base":"bases"}`}</span></div>
   <h2>{headline||"Nothing short"}</h2>
   <Progress pct={session?pct:0} thin/>
   <div className="foot"><span>{startedAt?`Started ${new Date(startedAt).toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"})}`:`≈ ${fmtMin(totalMin)} hands‑on`}</span><span>{session?(finished?"Done":`≈ ${fmtMin(leftMin)} left`):"long pots first"}</span></div>
  </div>}
  <HomeSays className="tight" actions={says.actions}>{says.text}</HomeSays>

  {mode==="stock"&&!session&&<>
   <div className="hm-picker" aria-label="Pick bases to make">{motherBases.map(m=>{const on=picked.includes(m.id);const hero=motherHero(m.id);return <button key={m.id} className={on?"on":""} aria-pressed={on} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties} onClick={()=>{setPicked(v=>v.includes(m.id)?v.filter(x=>x!==m.id):[...v,m.id]);feedback("tap")}}>{hero&&<img src={hero} alt=""/>}<div className="shade"/><span className="tick">{on?"✓":"+"}</span><div className="copy"><strong>{m.code}</strong><small>{m.batchYield} {portionWord(m.id,m.batchYield)}</small></div></button>})}</div>
   {jobs.length>0&&<div className="hm-summary"><div className="head"><strong>{jobs.length} {jobs.length===1?"base":"bases"} · {jobs.reduce((s,j)=>s+(getComponent(j.id)?.batchYield??0),0)} portions</strong><span>≈ {fmtMin(totalMin)}</span></div><div className="bar">{jobs.map(j=><i key={j.id} style={{flex:minutesFor(j.id),"--tone":toneFor(j.id)} as CSSProperties}/>)}</div><p>{jobs.map(j=>getComponent(j.id)?.code).filter(Boolean).join(" → ")}{jobs.some(j=>longCook.has(j.id))?" — long pots start first, pans overlap, quick pastes last.":"."}</p></div>}
  </>}

  {jobs.length>0&&<><SectionHead title={session?"On the bench":"The order"} action={<span className="muted">{session?`${cookDone}/${tasks.length} cooked`:"long cooks first"}</span>}/>
   <div className="hm-list">
    {tasks.map(t=>{const c=getComponent(t.id);if(!c)return null;const isDone=(done[t.id]??0)>=t.n;const isCurrent=!!session&&current?.key===t.key;const uses=mode==="week"?usedBy(t.id):"";return <button key={t.key} className={`hm-task ${isDone?"done":""} ${isCurrent?"current":""}`} disabled={!session} onClick={()=>tick(t)} aria-pressed={isDone}><Check on={isDone} next={isCurrent} lg/><span><strong>Cook {c.code}{t.of>1?` · batch ${t.n} of ${t.of}`:""}</strong><small>{c.batchYield} {portionWord(t.id,c.batchYield)} · {batchOutputMl(t.id)} ml · {equipment(t.id)}{uses?` · for ${uses}`:""}</small></span><span className="meta"><i className="hm-dot" style={{"--tone":toneFor(t.id)} as CSSProperties}/>{fmtMin(minutesFor(t.id))}</span></button>})}
    {([["cool","Cool in shallow trays","1–2 h max before freezing"],["label","Portion + label","CODE / ML / DATE on every tray"],["freeze","Freeze flat, log stock","new batch goes behind the old"]] as [Wrap,string,string][]).map(([k,title,sub])=>{const on=wrap[k];const enabled=!!session&&allCooked&&(k==="cool"||(k==="label"&&wrap.cool)||(k==="freeze"&&wrap.label));const isCurrent=enabled&&!on&&!(k==="label"&&wrap.label)&&!(k==="freeze"&&wrap.freeze);return <button key={k} className={`hm-task ${on?"done":""} ${isCurrent?"current":""}`} disabled={!enabled||(k==="freeze"&&on)} onClick={()=>tickWrap(k)} aria-pressed={on}><Check on={on} next={isCurrent} lg/><span><strong>{title}</strong><small>{sub}</small></span><span className="meta">{k==="cool"?"1–2 h":k==="label"?"10 min":"overnight"}</span></button>})}
   </div></>}

  {!session&&jobs.length>0&&<div className="hm-gut" style={{marginTop:18}}><button className="hm-btn primary full" onClick={start}>Start session</button></div>}
  {!session&&!jobs.length&&mode==="week"&&<div className="hm-empty"><strong>This week is covered.</strong>Nothing needs making for the current plan.<br/><Link href="/prep">Back to Prep ›</Link></div>}
  {session&&!finished&&<div className="hm-gut" style={{marginTop:18}}><button className="hm-btn ghost full sm" onClick={()=>reset(mode)}>Stop the session</button></div>}
  {finished&&<div className="hm-gut" style={{marginTop:18}}><Link className="hm-btn primary full" href="/kitchen">See the freezer →</Link></div>}
  {mode==="week"&&!session&&jobs.length>0&&<p className="hm-note hm-gut" style={{marginTop:14}}>For {h.week.map((id,i)=>jobs.some(j=>getRecipe(id).prep.some(p=>p.id===j.id))?`${days[i]} ${recipeTitle(id,getRecipe(id).title)}`:null).filter(Boolean).slice(0,3).join(" · ")}</p>}
 </div>;
}
