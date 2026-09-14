"use client";
import Link from "next/link";
import {useState,type CSSProperties} from "react";
import {midContent} from "@/data/mid-content-v3";
import {findMid} from "@/data/foundation";
import {midBases,motherBases,recipes,getRecipe} from "@/data/home-data";
import {batchOutputMl,stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead,Sheet,Stat,Toast} from "./Primitives";
import {ComponentSheet} from "./StockSheets";

const google=(q:string)=>`https://www.google.com/search?q=${encodeURIComponent(q)}`;
const youtube=(q:string)=>`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export function Mid({id}:{id:string}){
 const h=useHousehold();const m=midBases.find(x=>x.id===id)!;const c=midContent[id];const info=findMid(id);
 const linked=recipes.filter(r=>r.midIds.includes(id));const usedThisWeek=h.week.some(rid=>getRecipe(rid).midIds.includes(id));const researchOnly=linked.length===0;
 const[confirm,setConfirm]=useState(false);const[count,setCount]=useState(false);const[toast,setToast]=useState("");
 const portions=stockPortions(id,h.componentStock);const batchMl=batchOutputMl(id);const parents=m.parentMotherIds.map(pid=>motherBases.find(x=>x.id===pid)).filter(Boolean) as typeof motherBases;
 const tone=toneFor(id),grad=toneGradient(id);const word=portionWord(id);
 const batch=c?.batch??info?.ingredients??[];const method=c?.method??info?.method??[];const what=c?.what??info?.summary??"A make-ahead flavour direction.";
 const finishBatch=()=>{h.makeBatch(id);setConfirm(false);feedback("success");setToast(`${m.code} · ${m.batchYield} ${portionWord(id,m.batchYield)} added`);window.setTimeout(()=>setToast(""),1800)};
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  <div className="hm-hero-grad" style={{"--tone-light":`${tone}99`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep/mids" onPhoto label="Back to mids"/></div><div className="code"><span className="kick">MID‑BASE · {parents.length?`FROM ${parents.map(p=>p.code).join(" + ")}`:"STANDALONE"}</span><b>{m.code}</b></div></div>
  <div className="hm-sheetpage" style={{paddingBottom:140}}>
   <h1 className="hm-h1" style={{fontSize:28,lineHeight:1.1}}>{m.name}</h1>
   <p className="hm-lead" style={{marginTop:8}}>{what}</p>
   <div className="hm-stats"><Stat v={h.kitchenReady?portions:"—"} k={`${portionWord(id,2)} left`}/><Stat v={`${m.portionMl} ml`} k={`per ${word}`} tint="var(--tint-peach)"/><Stat v={linked.length} k={linked.length===1?"dinner":"dinners"} tint="var(--tint-sky)"/></div>
   {parents.length>0&&<div className="hm-chiplist" style={{marginTop:14}}>{parents.map(p=>{const hero=motherHero(p.id);return <Link key={p.id} href={`/prep/${p.id}`} className="tinted" style={{"--tone":toneFor(p.id),paddingLeft:6} as CSSProperties}>{hero?<img src={hero} alt="" style={{width:26,height:26,borderRadius:"50%",objectFit:"cover"}}/>:<i/>}Built from {p.code}<small>{p.name}</small></Link>})}</div>}
   <HomeSays>{researchOnly?<>Nothing we’ve saved uses <b>{m.code}</b> yet. {c?.dinners?.length?`Good first candidates: ${c.dinners.slice(0,3).join(", ")}.`:"Keep it here until a dinner really needs it."}</>:usedThisWeek?<>This week needs <b>{m.code}</b>{h.kitchenReady?portions?` — ${portions} ${portionWord(id,portions)} in the freezer.`:" and the freezer is empty of it. Make a batch before then.":"."}</>:<>{linked.length} of our dinners start from <b>{m.code}</b>. {h.kitchenReady?`${portions} ${portionWord(id,portions)} in the freezer.`:"Count the freezer to see what’s left."}</>}</HomeSays>

   {batch.length>0&&<><SectionHead title={`Batch of ${m.batchYield}`} action={<span className="muted">{m.portionLabel}</span>}/><div className="hm-chiplist">{batch.map(x=><span key={x}>{x}</span>)}</div></>}
   {method.length>0&&<div className="hm-steps" style={{marginTop:20}}>{method.map((s,i)=><div key={s} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{s}</p></div><span/></div>)}</div>}
   {(c||info)&&<div className="hm-card hm-refs">{(c?.storage??info?.storage)&&<p><b>Storage · </b>{c?.storage??info?.storage}</p>}{c&&<><p>{c.source}</p><a href={google(`${c.source} ${m.name} recipe`)} target="_blank" rel="noreferrer">Find written source ↗</a>{c.youtube&&<a href={youtube(c.youtube)} target="_blank" rel="noreferrer">Watch: {c.youtube} ↗</a>}</>}</div>}

   <SectionHead title="Becomes" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{linked.length?`${linked.length} dinners`:"ideas"}</span>}/>
   {linked.length?<div className="hm-rail">{linked.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{(c?.dinners??m.examples).slice(0,6).map(x=><span key={x}>{x}</span>)}</div>}
  </div>
  <div className="hm-cta split"><button className="hm-btn ghost icon" aria-label={`Count ${m.code}`} onClick={()=>setCount(true)}>＋</button><button className="hm-btn primary" style={{background:grad}} onClick={()=>setConfirm(true)}>Make {m.batchYield} {portionWord(id,m.batchYield)}</button></div>
  <Sheet open={confirm} onClose={()=>setConfirm(false)} label={`Make a ${m.code} batch`} title={`Make ${m.code}`} action={<span className="muted">{m.batchYield} × {m.portionMl} ml</span>}>
   <HomeSays className="tight">One batch adds <b>{batchMl} ml</b> — {m.batchYield} {portionWord(id,m.batchYield)}, dated today.</HomeSays>
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" onClick={finishBatch}>Batch finished</button></div>
  </Sheet>
  <ComponentSheet id={count?id:null} onClose={()=>setCount(false)}/>
  {toast&&<Toast text={toast}/>}
 </div>;
}
