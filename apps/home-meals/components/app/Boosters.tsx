"use client";
import Link from "next/link";
import {useState,type CSSProperties} from "react";
import {foundationImages} from "@/data/foundation-assets";
import {boosters,getComponent,recipes} from "@/data/home-data";
import {getCanonicalPrepV2} from "@/data/food-truth-v2";
import {getPrepFormulationV2} from "@/data/prep-formulations-v2";
import {getPrepStorageV2} from "@/data/prep-storage-v2";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead,Sheet,Stat,Toast} from "./Primitives";
import {useHold} from "./StockSheets";

// Boosters are tiny finishing portions. Identity and stock come from the household
// ledger; batch inputs, method and storage come from the canonical v2 truth files.
const portionsOf=(id:string,portionMl:number,stock:Record<string,number>)=>Math.floor(Math.max(0,stock[id]??0)/Math.max(1,portionMl));
const statusOf=(n:number)=>n<=2?{label:"Low",cls:"peach"}:n<=4?{label:"Some",cls:"neutral"}:{label:"Good",cls:""};
const dinnersFor=(id:string)=>recipes.filter(r=>r.boosterIds.includes(id));

const formWords:Record<string,string>={aromatic:"An aromatic paste",marinade:"A marinade",spice:"A dry spice finish",condiment:"A condiment",sauce:"A sauce",paste:"A paste"};
function describe(id:string){
 const c=getCanonicalPrepV2(id);const s=getPrepStorageV2(id);
 if(!c)return {summary:"A small finishing portion.",storage:"",pantry:false,note:undefined as string|undefined};
 const pantry=!!s?.pantryAllowed;
 const keep=pantry?"Kept airtight in the pantry.":s?.fridgeDays?`Fridge ${s.fridgeDays} ${s.fridgeDays===1?"day":"days"}${s.freezerAllowed?", freezer for longer.":"."}`:s?.freezerAllowed?"Freezer.":"";
 const storage=pantry?"pantry · airtight":s?.fridgeDays?`fridge ${s.fridgeDays}d${s.freezerAllowed?" · freeze":""}`:"freeze";
 return {summary:`${formWords[c.form]??"A finishing portion"} used ${c.workingUnit.qty} ${c.workingUnit.unit} at a time. ${keep}`,storage,pantry,note:c.note??s?.note};
}

export function Boosters(){
 const h=useHousehold();
 const usage=boosters.map(b=>({b,n:dinnersFor(b.id).length})).sort((a,b)=>b.n-a.n);
 const mostUsed=usage.filter(x=>x.n>0).slice(0,3).map(x=>x.b.code);
 const low=boosters.filter(b=>h.kitchenReady&&dinnersFor(b.id).length&&portionsOf(b.id,b.portionMl,h.componentStock)<=2);
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">Boosters</h1></div>
  <p className="hm-lead hm-gut" style={{marginTop:10,fontSize:14}}>Small portions that finish a plate: aromatics, heat, a marinade, a spice finish.</p>
  <div className="hm-kitchen-hero" style={{height:150}}><img src={foundationImages.cubes} alt=""/><div className="shade"/><div className="copy"><span className="hm-kicker" style={{color:"rgba(255,255,255,.85)"}}>{boosters.length} boosters</span><h3 style={{marginTop:4}}>{mostUsed.length?`Most used: ${mostUsed.join(", ")}`:"Small cubes, big finish"}</h3></div></div>
  <HomeSays className="tight">{low.length?<><b>{low.map(b=>b.code).join(", ")}</b> {low.length===1?"is":"are"} down to a couple of portions and our dinners lean on {low.length===1?"it":"them"}. A ten‑minute batch fixes it.</>:mostUsed.length?<><b>{mostUsed[0]}</b> starts more of our dinners than anything else. Keep a tray of it in the freezer.</>:<>Count a few here and I’ll tell you when a booster is running out.</>}</HomeSays>
  <div className="hm-boosters">{boosters.map(b=>{const n=portionsOf(b.id,b.portionMl,h.componentStock);const st=statusOf(n);return <Link key={b.id} href={`/prep/boosters/${b.id}`} className="hm-card lg hm-lift" style={{"--tone-grad":toneGradient(b.id)} as CSSProperties} onClick={()=>feedback("tap")}><div className="top"><span className="sq">{b.code}</span>{h.kitchenReady&&<span className={`hm-pill ${st.cls}`}>{st.label}</span>}</div><strong>{b.name}</strong><small>{b.portionMl} ml · {h.kitchenReady?`${n} left`:"not counted"}</small></Link>})}</div>
 </div>;
}

export function BoosterDetail({slug}:{slug:string}){
 const h=useHousehold();const b=boosters.find(x=>x.id===slug)!;const tracked=getComponent(slug);const dinners=dinnersFor(slug);
 const f=getPrepFormulationV2(slug);const about=describe(slug);
 const[confirm,setConfirm]=useState(false);const[toast,setToast]=useState("");
 const n=portionsOf(slug,b.portionMl,h.componentStock);const tone=toneFor(slug),grad=toneGradient(slug);
 const yieldN=tracked?.batchYield??b.batchYield;const unit=about.pantry?"portion":"cube";const units=`${unit}s`;
 const inputs=f?.ingredientInputs.map(x=>`${x.name} ${x.qty} ${x.unit}${x.optional?" (optional)":""}`)??[];
 const cues=f?.method.map(x=>x.cue).filter((x):x is string=>!!x)??[];
 const set=(portions:number)=>{h.setComponent(slug,Math.max(0,portions)*b.portionMl);feedback("change")};
 const dec=useHold(()=>set(portionsOf(slug,b.portionMl,h.componentStock)-1));const inc=useHold(()=>set(portionsOf(slug,b.portionMl,h.componentStock)+1));
 const finishBatch=()=>{if(tracked)h.makeBatch(slug);else h.setComponent(slug,(h.componentStock[slug]??0)+yieldN*b.portionMl);setConfirm(false);feedback("success");setToast(`${b.code} · ${yieldN} ${units} added`);window.setTimeout(()=>setToast(""),1800)};
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  <div className="hm-hero-grad sm" style={{"--tone-light":`${tone}99`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep/boosters" onPhoto label="Back to boosters"/></div><div className="code"><span className="kick">BOOSTER · {b.portionMl} ML</span><b>{b.code}</b></div></div>
  <div className="hm-sheetpage" style={{paddingBottom:140}}>
   <h1 className="hm-h1" style={{fontSize:28,lineHeight:1.1}}>{b.name}</h1>
   <p className="hm-lead" style={{marginTop:8}}>{about.summary}</p>
   <div className="hm-stats"><Stat v={h.kitchenReady?n:"—"} k={`${units} left`}/><Stat v={`${b.portionMl} ml`} k={`per ${unit}`} tint="var(--tint-peach)"/><Stat v={dinners.length||b.examples.length} k={dinners.length?"dinners":"uses"} tint="var(--tint-sky)"/></div>
   <div className="hm-card hm-stock-sheet" style={{marginTop:16,padding:"6px 16px 16px"}}><div className="big"><button className="minus" aria-label="One less" {...dec}>−</button><div className="val"><b>{n}</b><small>{units} · hold to count fast</small></div><button className="plus" aria-label="One more" style={{background:grad}} {...inc}>+</button></div></div>
   {f&&<>
    <SectionHead title={`Batch of ${yieldN}`} action={about.storage&&<span className="muted">{about.storage}</span>}/>
    <div className="hm-chiplist">{inputs.map(x=><span key={x}>{x}</span>)}</div>
    <div className="hm-steps" style={{marginTop:20}}>{f.method.map((s,i)=><div key={s.instruction} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{s.instruction}</p></div><span/></div>)}</div>
    {cues.length>0&&<div className="hm-cues" style={{marginTop:12}}>{cues.map(c=><div key={c} className="hm-card"><b>✓</b>{c}</div>)}</div>}
   </>}
   <SectionHead title="Goes into" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{dinners.length?`${dinners.length} dinners`:"anything"}</span>}/>
   {dinners.length?<div className="hm-rail">{dinners.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{b.examples.map(x=><span key={x}>{x}</span>)}</div>}
   {(about.note||(f&&f.evidence.length>0))&&<div className="hm-card hm-refs">{about.note&&<p>{about.note}</p>}{f?.evidence.map(e=><a key={e.url} href={e.url} target="_blank" rel="noreferrer">{e.label} ↗</a>)}</div>}
  </div>
  <div className="hm-cta"><button className="hm-btn primary" style={{background:grad}} onClick={()=>setConfirm(true)}>Make {yieldN} {units}</button></div>
  <Sheet open={confirm} onClose={()=>setConfirm(false)} label={`Make a ${b.code} batch`} title={`Make ${b.code}`} action={<span className="muted">{yieldN} × {b.portionMl} ml</span>}>
   <HomeSays className="tight">One batch adds <b>{yieldN} {units}</b> of {b.code}{tracked?", dated today.":"."}</HomeSays>
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" onClick={finishBatch}>It’s in the freezer</button></div>
  </Sheet>
  {toast&&<Toast text={toast}/>}
 </div>;
}
