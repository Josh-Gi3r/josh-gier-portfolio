"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {midContent} from "@/data/mid-content-v3";
import {quantity} from "@/data/food-quantity";
import {containerGuidanceV6,getHouseholdPrepFormulationV6,getPrepPortionPolicyV6,packetBreakdownV6} from "@/data/prep-portioning-v6";
import {getPrepStorageV2} from "@/data/prep-storage-v2";
import {getComponent} from "@/data/home-data";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {getCanonicalPrepV2} from "@/data/food-truth-v2";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {stockPortionsV7} from "@/data/stock-math-v7";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {prepHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,MealTile,RoundBack,SectionHead,Sheet,Stat,Toast} from "./Primitives";
import {ComponentSheet} from "./StockSheets";

export function Mid({id}:{id:string}){
 const h=useHousehold(),truth=getCanonicalPrepV2(id),f=getHouseholdPrepFormulationV6(id),policy=getPrepPortionPolicyV6(id),storage=getPrepStorageV2(id),editorial=midContent[id];
 if(!truth||truth.tier!=="mid"||!f||!policy)throw new Error(`Missing canonical mid-base ${id}`);
 const linked=recipes.filter(r=>prepForRecipeAtCookScaleV7(r.id).some(p=>p.componentId===id)),usedThisWeek=h.week.some(rid=>prepForRecipeAtCookScaleV7(rid).some(p=>p.componentId===id)),researchOnly=linked.length===0;
 const parents=truth.madeFrom.map(pid=>getCanonicalPrepV2(pid)).filter((x):x is NonNullable<typeof x>=>!!x),partners=truth.usedWith.map(pid=>getCanonicalPrepV2(pid)).filter((x):x is NonNullable<typeof x>=>!!x);
 const component=getComponent(id),name=component?.name??truth.name,code=component?.code??truth.code,hero=prepHero(id);
 const[confirm,setConfirm]=useState(false),[count,setCount]=useState(false),[toast,setToast]=useState(""),[made,setMade]=useState(""),[error,setError]=useState("");
 const packets=stockPortionsV7(id,h.componentStock),tone=toneFor(id),grad=toneGradient(id),batches=useMemo(()=>h.prepBatches.filter(b=>b.componentId===id&&b.remaining.qty>0).sort((a,b)=>new Date(a.producedAt).getTime()-new Date(b.producedAt).getTime()),[h.prepBatches,id]);
 const needed=h.prepNeeds.find(x=>x.id===id),suggested=needed?Math.max(1,Math.ceil(needed.shortQty/policy.packet.qty)):policy.targetRotation[0];
 const finishBatch=()=>{const measured=Number(made);if(!(measured>0))return;try{const output=quantity(measured,policy.packet.unit),split=packetBreakdownV6(id,output);h.recordMeasuredProduction(id,output,"portion-v6");setMade("");setError("");setConfirm(false);feedback("success");const rem=split.remainder.qty>0?` + ${formatQty(split.remainder.qty,split.remainder.unit)} remainder`:"";setToast(`${code} · ${split.fullPackets} full ${split.fullPackets===1?"packet":"packets"}${rem}`);window.setTimeout(()=>setToast(""),2200)}catch(e){setError(e instanceof Error?e.message:"Couldn’t log the measured batch.")}};
 const parentLine=parents.map(p=>`${p.code} ${formatQty(f.componentInputs.find(x=>x.componentId===p.id)?.qty??0,f.componentInputs.find(x=>x.componentId===p.id)?.unit??p.workingUnit.unit)}`).join(" + "),what=editorial?.what??truth.note??"A Home Meals make-ahead flavour component.";
 const says=(()=>{if(researchOnly)return{text:<>Nothing in the current live catalogue consumes <b>{code}</b> yet. Keep it dormant until a dinner really needs it.</>};if(!h.kitchenReady)return{text:<>Count the freezer first. Then Home can tell you whether <b>{code}</b> is actually needed.</>,actions:<button className="primary" onClick={()=>setCount(true)}>Count {code}</button>};if(usedThisWeek&&packets===0)return{text:<><b>{code}</b> is required this week and none is recorded. Make one household batch, measure the finished output, then divide it into practical stored packets.</>,actions:<button className="primary" onClick={()=>setConfirm(true)}>Make {code}</button>};if(batches[0])return{text:<><b>{code}</b> has about {packets} full {packets===1?"packet":"packets"}. Oldest batch is from {new Date(batches[0].producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})}; use it first.</>};return{text:<>{linked.length} of our dinners use <b>{code}</b>. {h.kitchenReady?`${packets} full ${packets===1?"packet":"packets"} recorded.`:""}</>}})();
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  {hero?<div className="hm-hero md"><img src={hero} alt={name} loading="eager" fetchPriority="high"/><div className="shade"/><div className="top"><RoundBack href="/prep/mids" onPhoto label="Back to mids"/></div><div className="code" style={{position:"absolute",left:22,bottom:22,color:"white"}}><span className="kick">MID · {parents.length?`MADE FROM ${parents.map(p=>p.code).join(" + ")}`:partners.length?`PAIRS WITH ${partners.map(p=>p.code).join(" + ")}`:"STANDALONE"}</span><b style={{display:"block",fontSize:28}}>{code}</b></div></div>:<div className="hm-hero-grad" style={{"--tone-light":`${tone}99`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep/mids" onPhoto label="Back to mids"/></div><div className="code"><span className="kick">MID · {parents.length?`MADE FROM ${parents.map(p=>p.code).join(" + ")}`:partners.length?`PAIRS WITH ${partners.map(p=>p.code).join(" + ")}`:"STANDALONE"}</span><b>{code}</b></div></div>}
  <div className="hm-sheetpage" style={{paddingBottom:140}}>
   <h1 className="hm-h1" style={{fontSize:28,lineHeight:1.1}}>{name}</h1><p className="hm-lead" style={{marginTop:8}}>{what}</p>
   <div className="hm-stats"><Stat v={h.kitchenReady?packets:"—"} k="full packets left"/><Stat v={formatQty(policy.packet.qty,policy.packet.unit)} k="per storage packet" tint="var(--tint-peach)"/><Stat v={linked.length} k={linked.length===1?"dinner":"dinners"} tint="var(--tint-sky)"/></div>
   {(parents.length>0||partners.length>0)&&<div className="hm-chiplist" style={{marginTop:14}}>{parents.map(p=>{const phero=prepHero(p.id);return <Link key={`parent-${p.id}`} href={p.tier==="mother"?`/prep/${p.id}`:`/prep/mids/${p.id}`} className="tinted" style={{"--tone":toneFor(p.id),paddingLeft:6} as CSSProperties}>{phero?<img src={phero} alt="" style={{width:26,height:26,borderRadius:"50%",objectFit:"cover"}}/>:<i/>}Made from {p.code}<small>{p.name}</small></Link>})}{partners.map(p=>{const phero=prepHero(p.id);return <span key={`partner-${p.id}`} className="tinted" style={{"--tone":toneFor(p.id)} as CSSProperties}>{phero?<img src={phero} alt="" style={{width:26,height:26,borderRadius:"50%",objectFit:"cover"}}/>:<i/>}Pairs with {p.code}<small>{p.name}</small></span>})}</div>}
   <HomeSays>{says.text}</HomeSays>
   <SectionHead title="What goes in" action={<span className="muted">household batch · measure after cooking</span>}/>
   {f.componentInputs.length>0&&<div className="hm-chiplist" style={{marginBottom:10}}>{f.componentInputs.map(x=><span key={x.componentId} className="tinted" style={{"--tone":toneFor(x.componentId)} as CSSProperties}><i/>{getComponent(x.componentId)?.code??x.componentId} · {formatQty(x.qty,x.unit)}</span>)}</div>}
   <div className="hm-chiplist">{f.ingredientInputs.map((x,i)=><span key={`${x.ingredientId}-${i}`}>{x.name} · {formatQty(x.qty,x.unit)}{x.optional?" · optional":""}</span>)}</div>
   <SectionHead title="Make it" action={<span className="muted">{f.method.length} steps</span>}/><div className="hm-steps" style={{marginTop:14}}>{f.method.map((step,i)=><div key={i} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{step.instruction}</p>{step.cue&&<small>{step.cue}</small>}</div><span/></div>)}</div>
   {batches.length>0&&<><SectionHead title="In the freezer" action={<span className="muted">oldest first · exact stock underneath</span>}/><div className="hm-card hm-batches-card">{batches.slice(0,4).map((b,i)=>{const left=packetBreakdownV6(id,b.remaining),madeN=packetBreakdownV6(id,b.initial);return <div className="row" key={b.batchId}><b className={`n ${i===0?"first":""}`}>{i+1}</b><span><strong>{left.fullPackets} full {left.fullPackets===1?"packet":"packets"}{left.remainder.qty?` + ${formatQty(left.remainder.qty,left.remainder.unit)} remainder`:""}{i===0?" · use first":""}</strong><small>Made {new Date(b.producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · measured {formatQty(b.initial.qty,b.initial.unit)} · {madeN.fullPackets} full packets</small></span></div>})}</div></>}
   <div className="hm-card hm-refs"><p><b>Portioning · </b>{containerGuidanceV6(id)}</p>{storage?.note&&<p><b>Storage · </b>{storage.note}</p>}{f.evidence.map(e=><a key={e.url} href={e.url} target="_blank" rel="noreferrer">{e.label} ↗</a>)}</div>
   <SectionHead title="Becomes" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{linked.length?`${linked.length} dinners`:"ideas"}</span>}/>{linked.length?<div className="hm-rail">{linked.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{(editorial?.dinners??component?.examples??[]).slice(0,6).map(x=><span key={x}>{x}</span>)}</div>}
  </div>
  <div className="hm-cta split"><button className="hm-btn ghost icon" aria-label={`Count ${code}`} onClick={()=>setCount(true)}>＋</button><button className="hm-btn primary" style={{background:grad}} onClick={()=>setConfirm(true)}>Make {code}</button></div>
  <Sheet open={confirm} onClose={()=>{setConfirm(false);setError("")}} label={`Make ${code}`} title={`Make ${code}`} action={<span className="muted">measure finished output</span>}>
   <HomeSays className="tight">Follow the household prep recipe{parentLine?<>. It uses <b>{parentLine}</b> from recorded prep</>:null}. After cooling as directed, weigh or measure the <b>actual finished output</b>. Home records that exact amount and derives full packets plus remainder.</HomeSays>
   <div className="hm-card" style={{marginTop:14,padding:14}}><strong>Storage packet · {formatQty(policy.packet.qty,policy.packet.unit)}</strong><small style={{display:"block"}}>{containerGuidanceV6(id)} Target rotation is usually {policy.targetRotation[0]}–{policy.targetRotation[1]} packets; current demand suggests about {suggested}.</small></div>
   <label style={{display:"grid",gap:8,marginTop:18}}><span className="hm-note">Actual finished output ({policy.packet.unit})</span><input inputMode="decimal" value={made} onChange={e=>setMade(e.target.value)} placeholder={`e.g. ${Math.round(policy.packet.qty*policy.targetRotation[0])}`} aria-label={`Measured finished ${policy.packet.unit} of ${code}`}/></label>
   {error&&<p role="alert" style={{color:"var(--peach-text)",fontWeight:700,marginTop:10}}>{error}</p>}
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" disabled={!(Number(made)>0)} onClick={finishBatch}>Measure & add to Kitchen</button></div>
  </Sheet>
  <ComponentSheet id={count?id:null} onClose={()=>setCount(false)}/>{toast&&<Toast text={toast}/>} 
 </div>;
}
