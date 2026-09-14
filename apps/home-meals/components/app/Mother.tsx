"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {motherProcessImages} from "@/data/mother-process-assets";
import {getComponent,motherBases,recipes} from "@/data/home-data";
import {canonicalPrepComponentsV2,getCanonicalPrepV2,recipePrepV2} from "@/data/food-truth-v2";
import {getPrepFormulationV2} from "@/data/prep-formulations-v2";
import {getPrepStorageV2} from "@/data/prep-storage-v2";
import {prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,MealTile,RoundBack,SectionHead,Sheet,Toast} from "./Primitives";
import {ComponentSheet} from "./StockSheets";

function descendantsOf(id:string){const out=new Set([id]);let changed=true;while(changed){changed=false;for(const c of canonicalPrepComponentsV2)if(c.madeFrom.some(p=>out.has(p))&&!out.has(c.id)){out.add(c.id);changed=true}}return out}
export function Mother({id}:{id:string}){
 const h=useHousehold(),m=motherBases.find(x=>x.id===id)!,truth=getCanonicalPrepV2(id),form=getPrepFormulationV2(id),storage=getPrepStorageV2(id);if(!truth||!form)throw new Error(`Missing canonical mother ${id}`);
 const process=motherProcessImages[id]??[],hero=motherHero(id),tone=toneFor(id),grad=toneGradient(id);
 const[confirm,setConfirm]=useState(false),[count,setCount]=useState(false),[toast,setToast]=useState(""),[made,setMade]=useState("");
 const qty=h.componentStock[id]??0,portions=stockPortions(id,h.componentStock),short=h.prepNeeds.find(x=>x.id===id),weekDemand=prepDemandForWeekMl(h.week).find(x=>x.id===id);
 const children=canonicalPrepComponentsV2.filter(x=>x.tier==="mid"&&x.madeFrom.includes(id));
 const linked=useMemo(()=>{const family=descendantsOf(id);return recipes.filter(r=>recipePrepV2(r.id).some(p=>family.has(p.componentId)))},[id]);
 const batches=h.prepBatches.filter(b=>b.componentId===id&&b.remaining.qty>0).sort((a,b)=>new Date(a.producedAt).getTime()-new Date(b.producedAt).getTime()),oldest=batches[0];
 const suggested=short?Math.max(1,Math.ceil(short.shortQty/truth.workingUnit.qty)):Math.max(2,Math.ceil((weekDemand?.neededQty??truth.workingUnit.qty*4)/truth.workingUnit.qty));
 const finishBatch=()=>{const n=Math.round(Number(made));if(!(n>0))return;h.recordPortionedProduction(id,n);setMade("");setConfirm(false);feedback("success");setToast(`${m.code} · ${n} working ${n===1?"portion":"portions"} added`);window.setTimeout(()=>setToast(""),1800)};
 const says=(()=>{if(!h.kitchenReady)return{text:<>Count {m.code} in the freezer once and I’ll tell you when this week is short.</>,actions:<button className="primary" onClick={()=>setCount(true)}>Count {m.code}</button>};if(short)return{text:<>This week is <b>{formatQty(short.shortQty,short.unit)} short</b> of {m.code}, about {Math.ceil(short.shortQty/truth.workingUnit.qty)} working {Math.ceil(short.shortQty/truth.workingUnit.qty)===1?"portion":"portions"}. Make what you want and tell Home how many usable portions went into the freezer.</>,actions:<><button className="primary" onClick={()=>setConfirm(true)}>Make {m.code}</button><Link className="ghost" href="/prep/day">Prep Day</Link></>};if(oldest)return{text:<><b>{m.code}</b> has {portions} working {portions===1?"portion":"portions"} recorded. Oldest batch is from {new Date(oldest.producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})}; use it first.</>};return{text:<>{portions} working {portions===1?"portion":"portions"} recorded{weekDemand?` and this week uses about ${Math.ceil(weekDemand.neededQty/truth.workingUnit.qty)}`:""}. {linked.length?`${linked.length} of our dinners start here or through a child prep.`:"Nothing saved uses it yet."}</>}})();
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  {hero?<div className="hm-hero md"><img src={hero} alt={m.name} loading="eager" fetchPriority="high"/><div className="shade"/><div className="top"><RoundBack href="/prep" onPhoto label="Back to prep"/></div></div>:<div className="hm-hero-grad" style={{"--tone-light":`${tone}aa`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep" onPhoto label="Back to prep"/></div><div className="code"><span className="kick">MOTHER BASE</span><b>{m.code}</b></div></div>}
  <div className="hm-sheetpage peach" style={{paddingBottom:80}}>
   <div style={{display:"flex",alignItems:"center",gap:8}}><span className="hm-code-badge">{m.code}</span><span className="hm-note">one working portion = {formatQty(truth.workingUnit.qty,truth.workingUnit.unit)} · {h.kitchenReady?`${portions} left`:"not counted"}</span></div>
   <h1 className="hm-h1-lg" style={{marginTop:10}}>{m.name}</h1><p className="hm-lead" style={{marginTop:8}}>{m.purpose}</p>
   <div className="hm-detail-actions"><button className="hm-btn tone" onClick={()=>setConfirm(true)}>Make {m.code}</button><button className="hm-btn ghost icon" aria-label={`Count ${m.code}`} onClick={()=>setCount(true)}>＋</button></div>
   <HomeSays actions={says.actions}>{says.text}</HomeSays>
   {process.length>0&&<><SectionHead title="How it should look" action={<span className="muted">swipe · {process.length} stages</span>}/><div className="hm-process">{process.map((p,i)=><article key={p.url}><img src={p.url} alt={`${m.name}: ${p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase()}`} loading={i<2?"eager":"lazy"}/><div className="copy"><div className="stage">{p.stage}</div><p>{p.caption}</p></div></article>)}</div></>}
   <SectionHead title="What goes in" action={<span className="muted">portion after cooking</span>}/><div className="hm-chiplist">{form.ingredientInputs.map((x,i)=><span key={`${x.ingredientId}-${i}`}>{x.name} · {formatQty(x.qty,x.unit)}{x.optional?" · optional":""}</span>)}</div>
   <SectionHead title="Cook it" action={<span className="muted">{form.method.length} steps</span>}/><div className="hm-steps" style={{marginTop:14}}>{form.method.map((step,i)=><div key={i} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{step.instruction}</p>{step.cue&&<small>{step.cue}</small>}</div><span/></div>)}</div>
   <SectionHead title="When it’s ready" action={<Link href={`/scan?mode=Prep&back=${encodeURIComponent(`/prep/${id}`)}`}>Show the pan</Link>}/><div className="hm-cues">{form.method.filter(x=>x.cue).map((x,i)=><div key={i} className="hm-card"><b>✓</b>{x.cue}</div>)}</div>
   {h.kitchenReady&&(batches.length>0||qty>0)&&<><SectionHead title="In the freezer" action={<span className="muted">oldest first</span>}/><div className="hm-card hm-batches-card">{batches.slice(0,4).map((b,i)=>{const left=Math.floor(b.remaining.qty/Math.max(1,truth.workingUnit.qty)),madeN=Math.round(b.initial.qty/Math.max(1,truth.workingUnit.qty));return <div key={b.batchId} className="row"><b className={`n ${i===0?"first":""}`}>{i+1}</b><span><strong>{left} working {left===1?"portion":"portions"}{i===0?" · use first":""}</strong><small>Made {new Date(b.producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {madeN} portioned</small></span></div>})}</div></>}
   {children.length>0&&<><SectionHead title={`Build from ${m.code}`} action={<Link href="/prep/mids">Explore ›</Link>}/><div className="hm-chiplist">{children.map(x=>{const c=getComponent(x.id),n=recipes.filter(r=>recipePrepV2(r.id).some(p=>p.componentId===x.id)).length;return c?<Link key={x.id} href={`/prep/mids/${x.id}`} className="tinted" style={{"--tone":toneFor(x.id)} as CSSProperties}><i/>{x.code}<small>{n?`${n} ${n===1?"dinner":"dinners"}`:x.name}</small></Link>:null})}</div></>}
   <SectionHead title="Becomes" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{linked.length} dinners</span>}/>{linked.length?<div className="hm-rail">{linked.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{m.examples.map(x=><span key={x}>{x}</span>)}</div>}
   <div className="hm-card hm-refs">{storage?.note&&<p><b>Storage · </b>{storage.note}</p>}{form.evidence.map(e=><a key={e.url} href={e.url} target="_blank" rel="noreferrer">{e.label} ↗</a>)}</div>
  </div>
  <Sheet open={confirm} onClose={()=>setConfirm(false)} label={`Make ${m.code}`} title={`Make ${m.code}`} action={<span className="muted">no batch weighing</span>}><HomeSays className="tight">Cook the prep recipe, then divide it into practical working portions. Home only needs to know how many usable portions you put away.</HomeSays><div className="hm-card" style={{marginTop:14,padding:14}}><strong>One working portion = {formatQty(truth.workingUnit.qty,truth.workingUnit.unit)}</strong><small style={{display:"block"}}>For this week, {suggested} {suggested===1?"portion is":"portions are"} a sensible target. Make more or less if you want.</small></div><label style={{display:"grid",gap:8,marginTop:18}}><span className="hm-note">How many working portions did you freeze?</span><input inputMode="numeric" value={made} onChange={e=>setMade(e.target.value)} placeholder={String(suggested)} aria-label={`Working portions of ${m.code} made`}/></label><div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" disabled={!(Number(made)>0)} onClick={finishBatch}>Add portions to Kitchen</button></div></Sheet>
  <ComponentSheet id={count?id:null} onClose={()=>setCount(false)}/>{toast&&<Toast text={toast}/>} 
 </div>;
}
