"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {getComponent,getRecipe,motherBases} from "@/data/home-data";
import {canonicalPrepComponentsV2,getCanonicalPrepV2} from "@/data/food-truth-v2";
import {quantity} from "@/data/food-quantity";
import {prepJobsForWeekV2} from "@/data/prep-plan-v2";
import {getPrepFormulationV2} from "@/data/prep-formulations-v2";
import {recipeTitle} from "@/data/recipe-display";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Check,Progress,RoundBack,SectionHead} from "./Primitives";

type Mode="week"|"stock";
type Job={id:string;shortQty:number|null;unit:string};
const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const equipment=(id:string)=>["clear","dark"].includes(id)?"large pot":["red","onion","blond","gold","sambal","rempah","makhani","rendang","laksa","malaysian-kari","asam-pedas","wok-brown","wok-white","douban","duxelles"].includes(id)?"wide pan":id==="massaman-finish"?"spice grinder":"blender / bowl";
const hrefFor=(id:string)=>{const c=getComponent(id);return c?.kind==="mother"?`/prep/${id}`:c?.kind==="mid"?`/prep/mids/${id}`:c?.kind==="booster"?`/prep/boosters/${id}`:"/prep"};
const cueFor=(id:string)=>{const f=getPrepFormulationV2(id);return f?.method.find(x=>x.cue)?.cue??f?.method.at(-2)?.instruction??null};

export function PrepDay(){
 const h=useHousehold();const[mode,setMode]=useState<Mode>("week");const[picked,setPicked]=useState<string[]>([]);const[started,setStarted]=useState(false);const[done,setDone]=useState<Record<string,boolean>>({});const[measured,setMeasured]=useState<Record<string,string>>({});const[wrap,setWrap]=useState({cool:false,label:false,freeze:false});const[error,setError]=useState("");
 const today=(new Date().getDay()+6)%7;
 const stockV2=useMemo(()=>Object.fromEntries(canonicalPrepComponentsV2.map(c=>[c.id,quantity(Math.max(0,h.componentStock[c.id]??0),c.workingUnit.unit)])),[h.componentStock]);
 const weekJobs=useMemo<Job[]>(()=>prepJobsForWeekV2(h.week,stockV2).map(j=>({id:j.componentId,shortQty:j.shortfall.qty,unit:j.shortfall.unit})),[h.week,stockV2]);
 const lowMothers=useMemo(()=>motherBases.filter(m=>{const c=getCanonicalPrepV2(m.id);return c&&(h.componentStock[m.id]??0)<c.workingUnit.qty*2}).map(m=>m.id),[h.componentStock]);
 const stockIds=picked.length?picked:(lowMothers.length?lowMothers:motherBases.slice(0,4).map(m=>m.id));
 const stockJobs=useMemo<Job[]>(()=>stockIds.map(id=>({id,shortQty:null,unit:getCanonicalPrepV2(id)?.workingUnit.unit??"g"})),[stockIds]);
 const jobs=mode==="week"?weekJobs:stockJobs;const completed=jobs.filter(j=>done[j.id]).length;const pct=jobs.length?Math.round((completed/jobs.length)*70+(Number(wrap.cool)+Number(wrap.label)+Number(wrap.freeze))/3*30):0;const allProduced=jobs.length>0&&completed===jobs.length;const finished=allProduced&&wrap.cool&&wrap.label&&wrap.freeze;
 const current=jobs.find(j=>!done[j.id]);const headline=jobs.slice(0,3).map(j=>getComponent(j.id)?.code).filter(Boolean).join(" · ");
 const reset=(m:Mode)=>{setMode(m);setStarted(false);setDone({});setMeasured({});setWrap({cool:false,label:false,freeze:false});setError("");feedback("tap")};
 const start=()=>{setStarted(true);setDone({});setMeasured({});setWrap({cool:false,label:false,freeze:false});setError("");feedback("change")};
 const complete=(job:Job)=>{if(done[job.id])return;const c=getCanonicalPrepV2(job.id),f=getPrepFormulationV2(job.id),qty=Number(measured[job.id]);if(!c||!f||!(qty>0)){setError(`Enter the measured finished ${job.unit} for ${getComponent(job.id)?.code??job.id} first.`);return}for(const parent of f.componentInputs){const have=h.componentStock[parent.componentId]??0;if(have<parent.qty){setError(`${getComponent(parent.componentId)?.code??parent.componentId} needs ${parent.qty} ${parent.unit} on hand before ${getComponent(job.id)?.code??job.id} can be logged.`);return}}h.recordMeasuredProduction(job.id,qty,c.workingUnit.unit);setDone(x=>({...x,[job.id]:true}));setError("");feedback("success")};
 const tickWrap=(key:"cool"|"label"|"freeze")=>{if(!allProduced)return;if(key==="label"&&!wrap.cool)return;if(key==="freeze"&&!wrap.label)return;setWrap(x=>({...x,[key]:true}));feedback(key==="freeze"?"success":"change")};
 const usedBy=(id:string)=>h.week.map((rid,i)=>getRecipe(rid).prep.some(p=>p.id===id)?days[i]:null).filter(Boolean).join(", ");
 const says=(()=>{if(!h.kitchenReady)return {text:<>Count the freezer first and this becomes exactly what the week is short of. Nothing is given an invented batch yield.</>,actions:<Link className="primary" href="/kitchen">Count the freezer</Link>};if(finished)return {text:<>Measured, labelled and frozen. Kitchen now holds the amounts you actually made — not a guessed number of cubes.</>,actions:<Link className="primary" href="/prep">Back to Prep</Link>};if(started&&current){const cue=cueFor(current.id);return {text:<><b>{getComponent(current.id)?.code}</b> is next{cue?` — ${cue}`:""}. When it is finished, weigh or measure the whole output before moving on.</>,actions:<Link className="primary" href={hrefFor(current.id)}>Open the recipe</Link>}}if(started&&allProduced)return {text:<>Every production run is measured. Now cool promptly, label CODE / AMOUNT / UNIT / DATE, then freeze.</>};if(!jobs.length)return {text:<>The freezer covers this week. Switch to Stock-up if you want to make something anyway.</>,actions:<button className="primary" onClick={()=>reset("stock")}>Stock up</button>};return {text:<>{mode==="week"?<>The week needs <b>{headline}</b>. </>:<>Pick the bases you want to stock. </>}Each row is one canonical formulation run; actual output is entered after cooking.</>}})();
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">Prep Day</h1><span className="spacer"/><span className="hm-note">{longDays[today]}</span></div>
  {!started&&<div className="hm-seg sm" role="tablist"><button role="tab" aria-selected={mode==="week"} className={mode==="week"?"on":""} onClick={()=>reset("week")}>This week</button><button role="tab" aria-selected={mode==="stock"} className={mode==="stock"?"on":""} onClick={()=>reset("stock")}>Stock-up</button></div>}
  {jobs.length>0&&<div className={`hm-prepday-card ${finished?"done":""}`}><div className="head"><span className="kick">{mode==="week"?"THIS WEEK":"STOCK-UP"}</span><span className="n">{started?`${completed}/${jobs.length} measured`:`${jobs.length} ${jobs.length===1?"run":"runs"}`}</span></div><h2>{headline}</h2><Progress pct={started?pct:0} thin/><div className="foot"><span>canonical formulations</span><span>{started?(finished?"Done":"measure every output"):"no assumed yield"}</span></div></div>}
  <HomeSays className="tight" actions={says.actions}>{says.text}</HomeSays>
  {error&&<div className="hm-card" role="alert" style={{margin:"12px 16px",padding:14,color:"var(--peach-text)"}}>{error}</div>}

  {mode==="stock"&&!started&&<><div className="hm-picker" aria-label="Pick bases to make">{motherBases.map(m=>{const on=stockIds.includes(m.id),hero=motherHero(m.id),truth=getCanonicalPrepV2(m.id);return <button key={m.id} className={on?"on":""} aria-pressed={on} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties} onClick={()=>{setPicked(v=>{const seed=v.length?v:stockIds;return seed.includes(m.id)?seed.filter(x=>x!==m.id):[...seed,m.id]});feedback("tap")}}>{hero&&<img src={hero} alt=""/>}<div className="shade"/><span className="tick">{on?"✓":"+"}</span><div className="copy"><strong>{m.code}</strong><small>{truth?.workingUnit.qty} {truth?.workingUnit.unit} working unit</small></div></button>})}</div></>}

  {jobs.length>0&&<><SectionHead title={started?"On the bench":"The order"} action={<span className="muted">parents before children · weigh every run</span>}/><div className="hm-list">
   {jobs.map(job=>{const c=getComponent(job.id),truth=getCanonicalPrepV2(job.id),isDone=!!done[job.id],isCurrent=started&&current?.id===job.id,uses=mode==="week"?usedBy(job.id):"";if(!c||!truth)return null;return <div key={job.id} className={`hm-task ${isDone?"done":""} ${isCurrent?"current":""}`}><Check on={isDone} next={isCurrent} lg/><span style={{minWidth:0,flex:1}}><strong>{c.code} · one formulation run</strong><small>{job.shortQty!=null?`short ${job.shortQty} ${job.unit} · `:""}{equipment(job.id)}{uses?` · for ${uses}`:""}</small>{started&&!isDone&&<label style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}><input inputMode="decimal" value={measured[job.id]??""} onChange={e=>setMeasured(x=>({...x,[job.id]:e.target.value}))} placeholder={`Finished ${truth.workingUnit.unit}`} aria-label={`Measured ${c.code} output`} style={{minWidth:0,width:120}}/><span>{truth.workingUnit.unit}</span><button className="hm-btn primary xs" onClick={()=>complete(job)}>Log measured</button></label>}</span><span className="meta"><i className="hm-dot" style={{"--tone":toneFor(job.id)} as CSSProperties}/>{truth.workingUnit.qty} {truth.workingUnit.unit}/use</span></div>})}
   {started&&([ ["cool","Cool promptly","shallow containers; follow the component storage rule"],["label","Label the real amount","CODE / AMOUNT / UNIT / DATE"],["freeze","Freeze / store","oldest measured batch stays first"]] as const).map(([key,title,sub])=>{const k=key as "cool"|"label"|"freeze",on=wrap[k],enabled=allProduced&&(k==="cool"||(k==="label"&&wrap.cool)||(k==="freeze"&&wrap.label));return <button key={k} className={`hm-task ${on?"done":""} ${enabled&&!on?"current":""}`} disabled={!enabled||on} onClick={()=>tickWrap(k)}><Check on={on} next={enabled&&!on} lg/><span><strong>{title}</strong><small>{sub}</small></span><span className="meta">{k==="freeze"?"final":"required"}</span></button>})}
  </div></>}
  {!started&&jobs.length>0&&<div className="hm-gut" style={{marginTop:18}}><button className="hm-btn primary full" onClick={start}>Start session</button></div>}
  {!started&&!jobs.length&&mode==="week"&&<div className="hm-empty"><strong>This week is covered.</strong>Nothing needs making for the current plan.<br/><Link href="/prep">Back to Prep ›</Link></div>}
  {started&&!finished&&<div className="hm-gut" style={{marginTop:18}}><button className="hm-btn ghost full sm" onClick={()=>reset(mode)}>Stop the session</button></div>}
  {finished&&<div className="hm-gut" style={{marginTop:18}}><Link className="hm-btn primary full" href="/kitchen">See the freezer →</Link></div>}
  {mode==="week"&&!started&&jobs.length>0&&<p className="hm-note hm-gut" style={{marginTop:14}}>For {h.week.map((id,i)=>jobs.some(j=>getRecipe(id).prep.some(p=>p.id===j.id))?`${days[i]} ${recipeTitle(id,getRecipe(id).title)}`:null).filter(Boolean).slice(0,3).join(" · ")}</p>}
 </div>;
}
