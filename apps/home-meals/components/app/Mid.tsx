"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {midContent} from "@/data/mid-content-v3";
import {getPrepFormulationV2} from "@/data/prep-formulations-v2";
import {getPrepStorageV2} from "@/data/prep-storage-v2";
import {getComponent,recipes} from "@/data/home-data";
import {getCanonicalPrepV2,recipePrepV2} from "@/data/food-truth-v2";
import {stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,MealTile,RoundBack,SectionHead,Sheet,Stat,Toast} from "./Primitives";
import {ComponentSheet} from "./StockSheets";

export function Mid({id}:{id:string}){
 const h=useHousehold(),truth=getCanonicalPrepV2(id),f=getPrepFormulationV2(id),storage=getPrepStorageV2(id),editorial=midContent[id];
 if(!truth||truth.tier!=="mid"||!f)throw new Error(`Missing canonical mid-base ${id}`);
 const linked=recipes.filter(r=>recipePrepV2(r.id).some(p=>p.componentId===id));
 const usedThisWeek=h.week.some(rid=>recipePrepV2(rid).some(p=>p.componentId===id));
 const researchOnly=linked.length===0;
 const parents=truth.madeFrom.map(pid=>getCanonicalPrepV2(pid)).filter((x):x is NonNullable<typeof x>=>!!x);
 const partners=truth.usedWith.map(pid=>getCanonicalPrepV2(pid)).filter((x):x is NonNullable<typeof x>=>!!x);
 const component=getComponent(id),name=component?.name??truth.name,code=component?.code??truth.code;
 const[confirm,setConfirm]=useState(false),[count,setCount]=useState(false),[toast,setToast]=useState(""),[measured,setMeasured]=useState(""),[error,setError]=useState("");
 const portions=stockPortions(id,h.componentStock),tone=toneFor(id),grad=toneGradient(id),word=portionWord(id);
 const batches=useMemo(()=>h.prepBatches.filter(b=>b.componentId===id&&b.remaining.qty>0).sort((a,b)=>new Date(a.producedAt).getTime()-new Date(b.producedAt).getTime()),[h.prepBatches,id]);
 const finishBatch=()=>{const amount=Number(measured);if(!(amount>0))return;try{h.recordMeasuredProduction(id,amount,truth.workingUnit.unit);setMeasured("");setError("");setConfirm(false);feedback("success");setToast(`${code} · ${amount} ${truth.workingUnit.unit} measured and logged`);window.setTimeout(()=>setToast(""),1800)}catch(e){setError(e instanceof Error?e.message:"Couldn’t log that batch.")}};
 const parentLine=parents.map(p=>`${p.code} ${formatQty(f.componentInputs.find(x=>x.componentId===p.id)?.qty??0,f.componentInputs.find(x=>x.componentId===p.id)?.unit??p.workingUnit.unit)}`).join(" + ");
 const what=editorial?.what??truth.note??"A Home Meals make-ahead flavour component.";
 const says=(()=>{
  if(researchOnly)return{text:<>Nothing in the current 36 dinners consumes <b>{code}</b> yet. Keep it as a researched idea until a dinner really needs it.</>};
  if(!h.kitchenReady)return{text:<>Count the freezer first. Then Home can tell you whether <b>{code}</b> is actually needed.</>,actions:<button className="primary" onClick={()=>setCount(true)}>Count {code}</button>};
  if(usedThisWeek&&portions===0)return{text:<><b>{code}</b> is required this week and none is recorded. Make one canonical run, then measure the real finished output before it enters Kitchen.</>,actions:<button className="primary" onClick={()=>setConfirm(true)}>Make one run</button>};
  if(batches[0])return{text:<><b>{code}</b> has {formatQty(h.componentStock[id]??0,truth.workingUnit.unit)} recorded. Oldest measured batch is from {new Date(batches[0].producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})}; use it first.</>};
  return{text:<>{linked.length} of our dinners use <b>{code}</b>. {h.kitchenReady?`${formatQty(h.componentStock[id]??0,truth.workingUnit.unit)} recorded.`:""}</>};
 })();
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  <div className="hm-hero-grad" style={{"--tone-light":`${tone}99`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep/mids" onPhoto label="Back to mids"/></div><div className="code"><span className="kick">MID-BASE · {parents.length?`MADE FROM ${parents.map(p=>p.code).join(" + ")}`:"STANDALONE"}</span><b>{code}</b></div></div>
  <div className="hm-sheetpage" style={{paddingBottom:140}}>
   <h1 className="hm-h1" style={{fontSize:28,lineHeight:1.1}}>{name}</h1><p className="hm-lead" style={{marginTop:8}}>{what}</p>
   <div className="hm-stats"><Stat v={h.kitchenReady?portions:"—"} k={`${portionWord(id,2)} left`}/><Stat v={`${truth.workingUnit.qty} ${truth.workingUnit.unit}`} k={`working ${word}`} tint="var(--tint-peach)"/><Stat v={linked.length} k={linked.length===1?"dinner":"dinners"} tint="var(--tint-sky)"/></div>
   {(parents.length>0||partners.length>0)&&<div className="hm-chiplist" style={{marginTop:14}}>{parents.map(p=>{const hero=motherHero(p.id);return <Link key={`parent-${p.id}`} href={p.tier==="mother"?`/prep/${p.id}`:`/prep/mids/${p.id}`} className="tinted" style={{"--tone":toneFor(p.id),paddingLeft:6} as CSSProperties}>{hero?<img src={hero} alt="" style={{width:26,height:26,borderRadius:"50%",objectFit:"cover"}}/>:<i/>}Made from {p.code}<small>{p.name}</small></Link>})}{partners.map(p=><span key={`partner-${p.id}`} className="tinted" style={{"--tone":toneFor(p.id)} as CSSProperties}><i/>Pairs with {p.code}<small>{p.name}</small></span>)}</div>}
   <HomeSays>{says.text}</HomeSays>
   <SectionHead title="Canonical formulation" action={<span className="muted">measure final {truth.workingUnit.unit}</span>}/>
   {f.componentInputs.length>0&&<div className="hm-chiplist" style={{marginBottom:10}}>{f.componentInputs.map(x=><span key={x.componentId} className="tinted" style={{"--tone":toneFor(x.componentId)} as CSSProperties}><i/>{getComponent(x.componentId)?.code??x.componentId} · {formatQty(x.qty,x.unit)}</span>)}</div>}
   <div className="hm-chiplist">{f.ingredientInputs.map((x,i)=><span key={`${x.ingredientId}-${i}`}>{x.name} · {formatQty(x.qty,x.unit)}{x.optional?" · optional":""}</span>)}</div>
   <SectionHead title="Make it" action={<span className="muted">{f.method.length} steps</span>}/><div className="hm-steps" style={{marginTop:14}}>{f.method.map((step,i)=><div key={i} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{step.instruction}</p>{step.cue&&<small>{step.cue}</small>}</div><span/></div>)}</div>
   {batches.length>0&&<><SectionHead title="Measured batches" action={<span className="muted">oldest first</span>}/><div className="hm-card hm-batches-card">{batches.slice(0,4).map((b,i)=><div className="row" key={b.batchId}><b className={`n ${i===0?"first":""}`}>{i+1}</b><span><strong>{formatQty(b.remaining.qty,b.remaining.unit)}{i===0?" · use first":""}</strong><small>Made {new Date(b.producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · measured {formatQty(b.initial.qty,b.initial.unit)}</small></span></div>)}</div></>}
   <div className="hm-card hm-refs">{storage?.note&&<p><b>Storage · </b>{storage.note}</p>}{f.evidence.map(e=><a key={e.url} href={e.url} target="_blank" rel="noreferrer">{e.label} ↗</a>)}</div>
   <SectionHead title="Becomes" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{linked.length?`${linked.length} dinners`:"ideas"}</span>}/>{linked.length?<div className="hm-rail">{linked.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{(editorial?.dinners??component?.examples??[]).slice(0,6).map(x=><span key={x}>{x}</span>)}</div>}
  </div>
  <div className="hm-cta split"><button className="hm-btn ghost icon" aria-label={`Count ${code}`} onClick={()=>setCount(true)}>＋</button><button className="hm-btn primary" style={{background:grad}} onClick={()=>setConfirm(true)}>Make one formulation run</button></div>
  <Sheet open={confirm} onClose={()=>{setConfirm(false);setError("")}} label={`Make ${code}`} title={`Make ${code}`} action={<span className="muted">actual output only</span>}>
   <HomeSays className="tight">Follow the canonical formulation{parentLine?<>. It consumes <b>{parentLine}</b> from recorded stock</>:null}. After cooling, weigh or measure the finished component. Home stores exactly that amount.</HomeSays>
   <label style={{display:"grid",gap:8,marginTop:18}}><span className="hm-note">Finished output</span><div style={{display:"flex",alignItems:"center",gap:10}}><input inputMode="decimal" value={measured} onChange={e=>setMeasured(e.target.value)} placeholder={`0 ${truth.workingUnit.unit}`} aria-label={`Measured ${code} output`} style={{minWidth:0,flex:1}}/><b>{truth.workingUnit.unit}</b></div></label>
   {error&&<p role="alert" style={{color:"var(--peach-text)",fontWeight:700,marginTop:10}}>{error}</p>}
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" disabled={!(Number(measured)>0)} onClick={finishBatch}>Log measured batch</button></div>
  </Sheet>
  <ComponentSheet id={count?id:null} onClose={()=>setCount(false)}/>{toast&&<Toast text={toast}/>} 
 </div>;
}
