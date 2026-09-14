"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {baseRecipesV2} from "@/data/base-recipes-v2";
import {motherProcessImages} from "@/data/mother-process-assets";
import {findMother} from "@/data/foundation";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {batchOutputMl,prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {freezerAge} from "@/data/freezer-guide";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead,Sheet,Toast} from "./Primitives";
import {ComponentSheet} from "./StockSheets";

export function Mother({id}:{id:string}){
 const h=useHousehold();const m=motherBases.find(x=>x.id===id)!;const recipe=baseRecipesV2[id];const info=findMother(id);const process=motherProcessImages[id]??[];const hero=motherHero(id);
 const[confirm,setConfirm]=useState(false);const[count,setCount]=useState(false);const[toast,setToast]=useState("");
 const ml=h.componentStock[id]??0;const portions=stockPortions(id,h.componentStock);const batchMl=batchOutputMl(id);
 const short=h.prepNeeds.find(x=>x.id===id);const weekDemand=prepDemandForWeekMl(h.week).find(x=>x.id===id);
 const mids=midBases.filter(x=>x.parentMotherIds.includes(id));
 const linked=useMemo(()=>{const viaMid=new Set(mids.map(x=>x.id));return recipes.filter(r=>r.motherIds.includes(id)||r.midIds.some(x=>viaMid.has(x)))},[id,mids]);
 const batches=h.prepBatches.filter(b=>b.componentId===id&&(b.remainingMl??b.outputMl)>0).sort((a,b)=>new Date(a.at).getTime()-new Date(b.at).getTime());const oldest=batches[0];const age=oldest?freezerAge(id,oldest.at):null;
 const datedMl=batches.reduce((s,b)=>s+(b.remainingMl??b.outputMl),0);const undatedMl=Math.max(0,ml-datedMl);
 const tone=toneFor(id),grad=toneGradient(id);
 const finishBatch=()=>{h.makeBatch(id);setConfirm(false);feedback("success");setToast(`${m.code} · ${m.batchYield} ${portionWord(id,m.batchYield)} added`);window.setTimeout(()=>setToast(""),1800)};
 const says=(()=>{
  if(!h.kitchenReady)return {text:<>Count the {m.code} {portionWord(id,2)} in the freezer once and I’ll tell you when a batch is due.</>,actions:<button className="primary" onClick={()=>setCount(true)}>Count {m.code}</button>};
  if(short)return {text:<>This week is <b>{short.shortMl} ml short</b> of {m.code} — that’s {short.short} {portionWord(id,short.short)}. One batch covers it.</>,actions:<><button className="primary" onClick={()=>setConfirm(true)}>Make a batch</button><Link className="ghost" href="/prep/day">Prep Day</Link></>};
  if(age?.status==="past-lower-guide")return {text:<>The oldest {m.code} is {age.ageDays} days in — past the {age.guide?.label} guide. Use it first.</>,actions:<Link className="primary" href="/cook/builder">Cook from it</Link>};
  return {text:<>{portions} {portionWord(id,portions)} in the freezer{weekDemand?` and this week uses ${Math.ceil(weekDemand.neededMl/Math.max(1,m.portionMl))}`:""}. {linked.length?`${linked.length} of our dinners start here.`:"Nothing saved uses it yet."}</>};
 })();
 return <div className="hm-screen flush" style={{"--tone":tone,"--tone-grad":grad} as CSSProperties}>
  {hero?<div className="hm-hero md"><img src={hero} alt={m.name} loading="eager" fetchPriority="high"/><div className="shade"/><div className="top"><RoundBack href="/prep" onPhoto label="Back to prep"/></div></div>
  :<div className="hm-hero-grad" style={{"--tone-light":`${tone}aa`,"--tone-deep":tone} as CSSProperties}><div className="glow"/><div className="top"><RoundBack href="/prep" onPhoto label="Back to prep"/></div><div className="code"><span className="kick">MOTHER BASE</span><b>{m.code}</b></div></div>}
  <div className="hm-sheetpage peach" style={{paddingBottom:60}}>
   <div style={{display:"flex",alignItems:"center",gap:8}}><span className="hm-code-badge">{m.code}</span><span className="hm-note">{m.portionMl} ml {portionWord(id,2)} · {h.kitchenReady?`${portions} left`:"not counted"}</span></div>
   <h1 className="hm-h1-lg" style={{marginTop:10}}>{m.name}</h1>
   <p className="hm-lead" style={{marginTop:8}}>{m.purpose}</p>
   <div className="hm-detail-actions"><button className="hm-btn tone" onClick={()=>setConfirm(true)}>Make {m.batchYield} {portionWord(id,m.batchYield)}{batchMl?` · ${batchMl} ml`:""}</button><button className="hm-btn ghost icon" aria-label={`Count ${m.code}`} onClick={()=>setCount(true)}>＋</button></div>
   <HomeSays actions={says.actions}>{says.text}</HomeSays>

   {process.length>0&&<><SectionHead title="How it should look" action={<span className="muted">swipe · {process.length} stages</span>}/>
    <div className="hm-process">{process.map((p,i)=><article key={p.url}><img src={p.url} alt={`${m.name}: ${p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase()}`} loading={i<2?"eager":"lazy"}/><div className="copy"><div className="stage">{p.stage}</div><p>{p.caption}</p></div></article>)}</div></>}

   {recipe&&<>
    <SectionHead title="Batch" action={<span className="muted">{m.freezeFormat}</span>}/>
    <div className="hm-chiplist">{recipe.ingredients.map(x=><span key={x}>{x}</span>)}</div>
    <SectionHead title="Cook it" action={<span className="muted">{recipe.method.length} steps</span>}/>
    <div className="hm-steps" style={{marginTop:14}}>{recipe.method.map((s,i)=><div key={s} className="hm-card hm-step" style={{"--phase":grad} as CSSProperties}><b>{i+1}</b><div><p>{s}</p></div><span/></div>)}</div>
    <SectionHead title="When it’s ready" action={<Link href={`/scan?mode=Prep&back=${encodeURIComponent(`/prep/${id}`)}`}>Show the pan</Link>}/>
    <div className="hm-cues">{recipe.cues.map(c=><div key={c} className="hm-card"><b>✓</b>{c}</div>)}</div>
   </>}

   {h.kitchenReady&&(batches.length>0||ml>0)&&<><SectionHead title="In the freezer" action={<span className="muted">{batches.length?`${batches.length} dated ${batches.length===1?"batch":"batches"}`:"undated"}</span>}/>
    <div className="hm-card hm-batches-card">{batches.slice(0,4).map((b,i)=><div key={`${b.at}-${i}`} className="row"><b className={`n ${i===0?"first":""}`}>{i+1}</b><span><strong>{b.remainingMl??b.outputMl} ml{i===0?" · use first":""}</strong><small>Made {new Date(b.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})}{age&&i===0?` · ${age.ageDays} ${age.ageDays===1?"day":"days"} ago${age.guide?` · guide ${age.guide.label}`:""}`:""}</small></span><span className="hm-pill neutral">{Math.floor((b.remainingMl??b.outputMl)/Math.max(1,m.portionMl))} {portionWord(id,2)}</span></div>)}{undatedMl>0&&<div className="row"><b className="n">?</b><span><strong>{undatedMl} ml undated</strong><small>Counted by hand · no made date</small></span><span/></div>}</div></>}

   {mids.length>0&&<><SectionHead title={`Build from ${m.code}`} action={<Link href="/prep/mids">Explore ›</Link>}/>
    <div className="hm-chiplist">{mids.map(x=>{const n=recipes.filter(r=>r.midIds.includes(x.id)).length;return <Link key={x.id} href={`/prep/mids/${x.id}`} className="tinted" style={{"--tone":toneFor(x.id)} as CSSProperties}><i/>{x.code}<small>{n?`${n} ${n===1?"dinner":"dinners"}`:x.name}</small></Link>})}</div></>}

   <SectionHead title="Becomes" action={<span style={{color:tone,fontWeight:700,fontSize:13}}>{linked.length} dinners</span>}/>
   {linked.length?<div className="hm-rail">{linked.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-chiplist">{m.examples.map(x=><span key={x}>{x}</span>)}</div>}

   {(recipe||info)&&<div className="hm-card hm-refs">{recipe?.storage&&<p><b>Storage · </b>{recipe.storage}</p>}{recipe?.local&&<p><b>Here · </b>{recipe.local}</p>}{recipe&&<a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.sourceLabel} ↗</a>}</div>}
  </div>

  <Sheet open={confirm} onClose={()=>setConfirm(false)} label={`Make a ${m.code} batch`} title={`Make ${m.code}`} action={<span className="muted">{m.batchYield} × {m.portionMl} ml</span>}>
   <HomeSays className="tight">One batch adds <b>{batchMl} ml</b> — {m.batchYield} {portionWord(id,m.batchYield)}. {short?`This week is ${short.shortMl} ml short, so that covers it.`:"I’ll date it today so the oldest always goes first."}</HomeSays>
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setConfirm(false)}>Not yet</button><button className="hm-btn primary" onClick={finishBatch}>Batch finished</button></div>
  </Sheet>
  <ComponentSheet id={count?id:null} onClose={()=>setCount(false)}/>
  {toast&&<Toast text={toast}/>}
 </div>;
}
