"use client";
import Link from "next/link";
import {useState,type CSSProperties} from "react";
import {foundationImages} from "@/data/foundation-assets";
import {canonicalPrepComponentsV2,getCanonicalPrepV2,recipePrepV2} from "@/data/food-truth-v2";
import {getPrepFormulationV2} from "@/data/prep-formulations-v2";
import {getPrepStorageV2} from "@/data/prep-storage-v2";
import {prepRelationshipLabelV2} from "@/data/prep-repertoire-v2";
import {recipes} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {prepHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,MealTile,RoundBack,SectionHead,Sheet,Stat,Toast} from "./Primitives";

const boosters=canonicalPrepComponentsV2.filter(x=>x.tier==="booster");
const dinnersFor=(id:string)=>recipes.filter(r=>recipePrepV2(r.id).some(x=>x.componentId===id));
const portionsOf=(id:string,stock:Record<string,number>)=>{const c=getCanonicalPrepV2(id);return c?Math.floor(Math.max(0,stock[id]??0)/Math.max(1,c.workingUnit.qty)):0};
const statusOf=(n:number)=>n<=0?{label:"Out",cls:"peach"}:n<=2?{label:"Low",cls:"peach"}:n<=4?{label:"Some",cls:"neutral"}:{label:"Good",cls:""};
const formWords:Record<string,string>={aromatic:"An aromatic prep",marinade:"A marinade",spice:"A dry spice finish",condiment:"A condiment",sauce:"A sauce",paste:"A paste"};
function describe(id:string){const c=getCanonicalPrepV2(id),s=getPrepStorageV2(id);if(!c)return{summary:"A small finishing prep.",storage:"",note:undefined as string|undefined};const pantry=!!s?.pantryAllowed,keep=pantry?"Kept airtight in the pantry.":s?.fridgeDays?`Fridge ${s.fridgeDays} ${s.fridgeDays===1?"day":"days"}${s.freezerAllowed?", freeze for longer.":"."}`:s?.freezerAllowed?"Freeze for longer keeping.":"";return{summary:`${formWords[c.form]??"A finishing prep"} used ${formatQty(c.workingUnit.qty,c.workingUnit.unit)} at a time. ${keep}`,storage:pantry?"pantry · airtight":s?.fridgeDays?`fridge ${s.fridgeDays}d${s.freezerAllowed?" · freeze":""}`:s?.freezerAllowed?"freeze":"",note:c.note??s?.note}}

export function Boosters(){
 const h=useHousehold(),usage=boosters.map(b=>({b,n:dinnersFor(b.id).length})).sort((a,b)=>b.n-a.n),mostUsed=usage.filter(x=>x.n>0).slice(0,3).map(x=>x.b.code),needed=boosters.filter(b=>h.week.some(rid=>recipePrepV2(rid).some(x=>x.componentId===b.id)));
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><h1 className="hm-h1">Boosters</h1></div><p className="hm-lead hm-gut" style={{marginTop:10,fontSize:14}}>Small aromatics, marinades and finishes. Keep only the ones your dinners actually use.</p>
  <div className="hm-kitchen-hero" style={{height:150}}><img src={foundationImages.cubes} alt=""/><div className="shade"/><div className="copy"><span className="hm-kicker" style={{color:"rgba(255,255,255,.85)"}}>{boosters.length} boosters</span><h3 style={{marginTop:4}}>{mostUsed.length?`Most useful: ${mostUsed.join(", ")}`:"Small prep, big finish"}</h3></div></div>
  <HomeSays className="tight">{needed.length?<><b>{needed.map(b=>b.code).join(", ")}</b> {needed.length===1?"is":"are"} used by this week. That does not mean the other boosters need to be maintained.</>:<>Nothing this week needs a booster. Leave the rest dormant until a dinner calls for one.</>}</HomeSays>
  <div className="hm-boosters">{boosters.map(b=>{const n=portionsOf(b.id,h.componentStock),st=statusOf(n),active=h.activePrepIds.includes(b.id),hero=prepHero(b.id);return <Link key={b.id} href={`/prep/boosters/${b.id}`} className="hm-card lg hm-lift" style={{"--tone-grad":toneGradient(b.id),overflow:"hidden",padding:0} as CSSProperties} onClick={()=>feedback("tap")}>{hero&&<img src={hero} alt="" style={{width:"100%",aspectRatio:"4 / 3",objectFit:"cover",display:"block"}}/>}<div style={{padding:14}}><div className="top"><span className="sq">{b.code}</span>{h.kitchenReady&&<span className={`hm-pill ${st.cls}`}>{st.label}</span>}</div><strong>{b.name}</strong><small>{formatQty(b.workingUnit.qty,b.workingUnit.unit)} working amount · {h.kitchenReady?`${n} left`:"not counted"}</small><small>{active?"active repertoire":prepRelationshipLabelV2(b.id)}</small></div></Link>})}</div>
 </div>;
}

export function BoosterDetail({slug}:{slug:string}){
 const h=useHousehold(),b=getCanonicalPrepV2(slug),f=getPrepFormulationV2(slug);if(!b||b.tier!=="booster"||!f)throw new Error(`Missing canonical booster ${slug}`);
 const dinners=dinnersFor(slug),about=describe(slug),[confirm,setConfirm]=useState(false),[toast,setToast]=useState(""),[measured,setMeasured]=useState("");
 const n=portionsOf(slug,h.componentStock),tone=toneFor(slug),grad=toneGradient(slug),active=h.activePrepIds.includes(slug),inputs=f.ingredientInputs.map(x=>`${x.name} ${formatQty(x.qty,x.unit)}${x.optional?" (optional)":""}`),cues=f.method.map(x=>x.cue).filter((x):x is string=>!!x),hero=prepHero(slug);
 const finishBatch=()=>{const amount=Number(measured);if(!(amount>0))return;h.recordMeasuredProduction(slug,amount,b.workingUnit.unit);setMeasured("");setConfirm(false);feedback("success");setToast(`${b.code} · ${amount} ${b.workingUnit.unit} measured and logged`);window.setTimeout(()=>setToast(""),1800)};
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  {hero?<div className="hm-hero md"><img src={hero} alt={b.name} loading="eager" fetchPriority="high"/><div className="shade"/><div className="top"><RoundBack href="/prep/boosters" onPhoto label="Back to boosters"/></div><div className="code" style={{position:"absolute",left:22,bottom:22,color:"white"}}><span className="kick">BOOSTER · {formatQty(b.workingUnit.qty,b.workingUnit.unit)}</span><b style={{display:"block",fontSize:28}}>{b.code}</b></div></div>:<div className="hm-hero-grad sm" style={{"--tone-light":`${tone}99`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep/boosters" onPhoto label="Back to boosters"/></div><div className="code"><span className="kick">BOOSTER · {formatQty(b.workingUnit.qty,b.workingUnit.unit)} WORKING AMOUNT</span><b>{b.code}</b></div></div>}
  <div className="hm-sheetpage" style={{paddingBottom:140}}><h1 className="hm-h1" style={{fontSize:28,lineHeight:1.1}}>{b.name}</h1><p className="hm-lead" style={{marginTop:8}}>{about.summary}</p><div className="hm-stats"><Stat v={h.kitchenReady?n:"—"} k="working portions left"/><Stat v={formatQty(b.workingUnit.qty,b.workingUnit.unit)} k="working amount" tint="var(--tint-peach)"/><Stat v={dinners.length} k={dinners.length===1?"dinner":"dinners"} tint="var(--tint-sky)"/></div>
   <div className="hm-card" style={{marginTop:16,padding:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><span><strong>{active?"In your active repertoire":"Dormant library item"}</strong><small style={{display:"block"}}>{prepRelationshipLabelV2(slug)}</small></span><button className={`hm-pill ${active?"":"neutral"}`} onClick={()=>{h.toggleActivePrep(slug,!active);feedback("change")}}>{active?"Pause":"Add"}</button></div>
   <SectionHead title="Canonical formulation" action={about.storage&&<span className="muted">{about.storage}</span>}/><div className="hm-chiplist">{inputs.map(x=><span key={x}>{x}</span>)}</div><div className="hm-steps" style={{marginTop:20}}>{f.method.map((s,i)=><div key={s.instruction} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{s.instruction}</p>{s.cue&&<small>{s.cue}</small>}</div><span/></div>)}</div>{cues.length>0&&<div className="hm-cues" style={{marginTop:12}}>{cues.map(c=><div key={c} className="hm-card"><b>✓</b>{c}</div>)}</div>}
   <SectionHead title="Goes into" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{dinners.length?`${dinners.length} dinners`:"library"}</span>}/>{dinners.length?<div className="hm-rail">{dinners.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-empty"><strong>No saved dinner uses this yet.</strong>Keep it dormant until one does.</div>}{(about.note||f.evidence.length>0)&&<div className="hm-card hm-refs">{about.note&&<p>{about.note}</p>}{f.evidence.map(e=><a key={e.url} href={e.url} target="_blank" rel="noreferrer">{e.label} ↗</a>)}</div>}
  </div>
  <div className="hm-cta"><button className="hm-btn primary" style={{background:grad}} onClick={()=>setConfirm(true)}>Make one formulation run</button></div>
  <Sheet open={confirm} onClose={()=>setConfirm(false)} label={`Make ${b.code}`} title={`Make ${b.code}`} action={<span className="muted">actual output only</span>}><HomeSays className="tight">Follow the formulation, then weigh or measure the finished prep. Home logs only the amount you actually made.</HomeSays><label style={{display:"grid",gap:8,marginTop:18}}><span className="hm-note">Finished output</span><div style={{display:"flex",alignItems:"center",gap:10}}><input inputMode="decimal" value={measured} onChange={e=>setMeasured(e.target.value)} placeholder={`0 ${b.workingUnit.unit}`} aria-label={`Measured ${b.code} finished output`} style={{minWidth:0,flex:1}}/><b>{b.workingUnit.unit}</b></div></label><div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" disabled={!(Number(measured)>0)} onClick={finishBatch}>Log measured batch</button></div></Sheet>{toast&&<Toast text={toast}/>} 
 </div>;
}
