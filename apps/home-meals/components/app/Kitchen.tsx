"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {getComponent,ingredients,motherBases,prepComponents,getRecipe} from "@/data/home-data";
import {motherProcessImages} from "@/data/mother-process-assets";
import {foundationImages} from "@/data/foundation-assets";
import {stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {formatQty,PageHead,SectionHead} from "./Primitives";

const tabs=["Fridge","Freezer","Pantry"] as const;
type Tab=typeof tabs[number];
const smallHerbs=new Set(["coriander","parsley","thai-basil"]);
const stateLevels=[{value:0,label:"Out"},{value:1,label:"Low"},{value:2,label:"Some"},{value:3,label:"Plenty"}] as const;
function stateLevelLabel(value:number){return value>=3?"Plenty":value>=2?"Some":value>=1?"Low":"Out"}
function stepFor(item:{id:string;category:string;unit:string}){
 if(item.unit==="count"||item.unit==="portion")return 1;
 if(item.unit==="ml")return item.category==="Dairy"?50:25;
 if(item.unit==="g"){
  if(smallHerbs.has(item.id))return 10;
  if(item.category==="Protein"||item.category==="Fresh")return 100;
  if(item.category==="Dairy")return 50;
  return 50;
 }
 return 1;
}

export function Kitchen(){
 const h=useHousehold();
 const[tab,setTab]=useState<Tab>("Fridge");
 const[q,setQ]=useState("");
 const[showAll,setShowAll]=useState(false);
 const relevantIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).ingredients.map(x=>x.id))),[h.week]);
 const list=ingredients
  .filter(i=>tab==="Fridge"?["Fresh","Protein","Dairy"].includes(i.category):tab==="Pantry"&&i.category==="Pantry")
  .filter(i=>!q||i.name.toLowerCase().includes(q.toLowerCase()))
  .sort((a,b)=>Number(!!h.useSoon[b.id])-Number(!!h.useSoon[a.id])||Number(relevantIds.has(b.id))-Number(relevantIds.has(a.id))||Number((h.ingredientStock[b.id]??0)>0)-Number((h.ingredientStock[a.id]??0)>0)||a.name.localeCompare(b.name));
 const priority=list.filter(i=>h.useSoon[i.id]||relevantIds.has(i.id)||(h.ingredientStock[i.id]??0)>0);
 const shown=q||showAll?list:(priority.length?priority:list).slice(0,14);
 const changeIngredient=(id:string,delta:number)=>{h.setIngredient(id,Math.max(0,(h.ingredientStock[id]??0)+delta));feedback("change")};
 const setStateLevel=(id:string,value:number)=>{h.setIngredient(id,value);feedback("change")};
 const switchTab=(t:Tab)=>{setTab(t);setQ("");setShowAll(false);feedback("tap")};
 const scanMode=tab==="Freezer"?"Freezer":tab==="Pantry"?"Pantry":"Fridge";
 const scanHref=`/scan?mode=${scanMode}&back=${encodeURIComponent("/kitchen")}`;
 const stockedFridge=ingredients.filter(i=>["Fresh","Protein","Dairy"].includes(i.category)&&(h.ingredientStock[i.id]??0)>0);
 const stockedPantry=ingredients.filter(i=>i.category==="Pantry"&&(h.ingredientStock[i.id]??0)>0);
 const lowPantry=stockedPantry.filter(i=>i.tracking==="state"&&(h.ingredientStock[i.id]??0)===1);
 const useSoon=stockedFridge.filter(i=>h.useSoon[i.id]);
 const thisWeek=ingredients.filter(i=>relevantIds.has(i.id)&&(h.ingredientStock[i.id]??0)>0);
 return <div className="hm-page-v5 hm-kitchen-v5 hm-kitchen-v6">
  <PageHead title="Kitchen" sub="What’s at home, what needs using, and what is running low." action={<Link className="hm-round-link-v5" href={scanHref} aria-label={`Open ${scanMode.toLowerCase()} camera`}>⌁</Link>}/>
  {!h.kitchenReady&&<section className="hm-setup-banner-v5 hm-kitchen-setup-v6"><div><span>FIRST CHECK</span><h2>Teach Home the kitchen once.</h2><p>Start with what this week uses. Exact quantities only where they help; simple levels are enough for sauces and staples.</p></div><button onClick={()=>{h.confirmKitchen();feedback("success")}}>Kitchen checked</button></section>}

  <div className="hm-segment-v5 hm-kitchen-tabs-v5 hm-kitchen-tabs-v6">{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>switchTab(t)}>{t}</button>)}</div>

  {tab==="Fridge"&&<section className="hm-kitchen-focus-v6">
   <div className={`hm-use-first-v6 ${useSoon.length?"urgent":"calm"}`}><span>{useSoon.length?"USE FIRST":"FRIDGE"}</span><strong>{useSoon.length?`${useSoon.length} ${useSoon.length===1?"thing needs":"things need"} attention`:"Nothing urgent"}</strong><p>{useSoon.length?useSoon.slice(0,5).map(x=>x.name).join(" · "):"Keep this light. Mark something use-soon only when it will actually change dinner decisions."}</p>{useSoon.length>0&&<Link href="/plan">Fit them into the week →</Link>}</div>
   <div className="hm-kitchen-pulse-v6"><div><b>{stockedFridge.length}</b><span>in fridge</span></div><div><b>{thisWeek.filter(i=>["Fresh","Protein","Dairy"].includes(i.category)).length}</b><span>used this week</span></div><div><b>{useSoon.length}</b><span>use soon</span></div></div>
  </section>}

  {tab==="Pantry"&&<section className="hm-kitchen-focus-v6"><div className="hm-use-first-v6 pantry"><span>PANTRY</span><strong>{stockedPantry.length?`${stockedPantry.length} staples on hand`:"Pantry not checked yet"}</strong><p>{lowPantry.length?`${lowPantry.slice(0,4).map(i=>i.name).join(" · ")}${lowPantry.length>4?` +${lowPantry.length-4} more`:""} ${lowPantry.length===1?"is":"are"} running low.`:h.shoppingNeeds.filter(x=>ingredients.find(i=>i.id===x.id)?.category==="Pantry").length?"A few pantry gaps are already feeding the shopping list.":"Nothing in the current week is asking for an urgent pantry top-up."}</p></div><div className="hm-kitchen-pulse-v6"><div><b>{stockedPantry.length}</b><span>on hand</span></div><div><b>{lowPantry.length}</b><span>running low</span></div><div><b>{h.shoppingNeeds.filter(x=>ingredients.find(i=>i.id===x.id)?.category==="Pantry").length}</b><span>to buy</span></div></div></section>}

  {tab==="Freezer"?<Freezer/>:<>
   <section className="hm-block-v5 hm-kitchen-editor-v6"><SectionHead title={tab==="Fridge"?"Update the fridge":"Update the pantry"} action={<Link href={scanHref}>Use camera ›</Link>}/><label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Find in ${tab.toLowerCase()}`} aria-label={`Find in ${tab.toLowerCase()}`}/></label>
    {shown.length?<div className="hm-stock-list-v5">{shown.map(i=>{const n=h.ingredientStock[i.id]??0;const relevant=relevantIds.has(i.id);const soon=!!h.useSoon[i.id];const step=stepFor(i);const level=stateLevelLabel(n);return <article key={i.id} className={`${tab==="Fridge"?"with-soon":""} ${i.tracking==="state"?"state-level-v21":""}`}><div><strong>{i.name}</strong><span>{soon&&<b className="soon">Use soon</b>}{relevant&&<b>This week</b>}{i.tracking==="state"?level:n>0?formatQty(n,i.unit):"Out"}</span></div>{tab==="Fridge"&&<button className={`hm-soon-toggle-v5 ${soon?"on":""}`} aria-label={`${soon?"Remove":"Mark"} ${i.name} ${soon?"from":"as"} use soon`} onClick={()=>{if(n>0){h.toggleUseSoon(i.id);feedback("change")}}} disabled={n<=0}>◷</button>}{i.tracking==="state"?<div className="hm-stock-level-v21" role="group" aria-label={`${i.name} stock level`}>{stateLevels.map(option=><button key={option.value} className={n===option.value?"on":""} aria-pressed={n===option.value} onClick={()=>setStateLevel(i.id,option.value)}><i/>{option.label}</button>)}</div>:<div className="hm-stepper-v5"><button aria-label={`Decrease ${i.name} by ${step} ${i.unit}`} onClick={()=>changeIngredient(i.id,-step)}>−</button><b>{n?Math.round(n*10)/10:"0"}</b><span>{i.unit==="count"?"":i.unit==="portion"?(n===1?"portion":"portions"):i.unit}</span><button aria-label={`Increase ${i.name} by ${step} ${i.unit}`} onClick={()=>changeIngredient(i.id,step)}>+</button></div>}</article>})}</div>:<div className="hm-empty-v5"><strong>Nothing matches.</strong><p>Try another name or clear the search.</p>{q&&<button className="hm-text-button-v5" onClick={()=>{setQ("");feedback("tap")}}>Clear search</button>}</div>}
    {!q&&list.length>shown.length&&<button className="hm-text-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show less":`Show all ${list.length}`}</button>}
   </section>
  </>}
  <div className="hm-kitchen-bottom-v5 hm-kitchen-bottom-v6"><Link href={scanHref}>Show Home</Link><button onClick={()=>{h.confirmKitchen();feedback("success")}}>{h.kitchenReady?"Kitchen up to date ✓":"Kitchen checked ✓"}</button></div>
 </div>
}

function Freezer(){
 const h=useHousehold();
 const[more,setMore]=useState(false);
 const activeIds=new Set(h.week.flatMap(id=>getRecipe(id).prep.map(x=>x.id)));
 const other=prepComponents.filter(c=>!motherBases.some(m=>m.id===c.id)).sort((a,b)=>Number(activeIds.has(b.id))-Number(activeIds.has(a.id))||a.code.localeCompare(b.code));
 const shown=more?other:other.filter(x=>activeIds.has(x.id)||(h.componentStock[x.id]??0)>0).slice(0,14);
 const setByPortion=(id:string,delta:number)=>{const c=getComponent(id);if(!c)return;h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*c.portionMl));feedback("change")};
 const stocked=motherBases.filter(m=>(h.componentStock[m.id]??0)>0).length;const weekMothers=motherBases.filter(m=>activeIds.has(m.id)).length;const low=motherBases.filter(m=>activeIds.has(m.id)&&(h.componentStock[m.id]??0)<m.portionMl).length;
 const activeBatches=h.prepBatches.filter(b=>(b.remainingMl??b.outputMl)>0).sort((a,b)=>new Date(a.at).getTime()-new Date(b.at).getTime());const fifo=activeBatches[0];const fifoComponent=fifo?getComponent(fifo.componentId):null;const fifoAge=fifo?Math.max(0,Math.floor((Date.now()-new Date(fifo.at).getTime())/86400000)):0;const fifoHref=fifoComponent?(fifoComponent.kind==="mother"?`/prep/${fifoComponent.id}`:fifoComponent.kind==="mid"?`/prep/mids/${fifoComponent.id}`:`/prep/boosters/${fifoComponent.id}`):"/prep";
 const datedMl=(id:string)=>activeBatches.filter(b=>b.componentId===id).reduce((sum,b)=>sum+(b.remainingMl??b.outputMl),0);const undated=prepComponents.map(c=>({c,ml:Math.max(0,(h.componentStock[c.id]??0)-datedMl(c.id))})).filter(x=>x.ml>0);const undatedCodes=undated.slice(0,5).map(x=>x.c.code).join(" · ");
 const oldestBatch=(id:string)=>activeBatches.find(b=>b.componentId===id);
 return <>
  <section className="hm-freezer-overview-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(25,34,28,.78),rgba(25,34,28,.16)),url(${foundationImages.freezer})`}}><div><span>FREEZER</span><strong>{stocked}/8 mothers stocked</strong><p>{low?`${low} planned ${low===1?"mother is":"mothers are"} low for this week.`:"The foundations are in good shape for the current week."}</p></div><Link href="/prep">Prep next →</Link><div className="hm-freezer-pulse-v6"><b>{weekMothers}<small>used this week</small></b><b>{activeBatches.length}<small>dated batches</small></b></div></section>
  {fifo&&fifoComponent&&<Link href={fifoHref} className="hm-freezer-fifo-v25"><span><small>USE OLDEST FIRST</small><strong>{fifoComponent.code} · {fifoComponent.name}</strong><p>{fifo.remainingMl??fifo.outputMl} ml left · made {new Date(fifo.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {fifoAge===0?"today":`${fifoAge} ${fifoAge===1?"day":"days"} ago`}</p></span><b>›</b></Link>}
  {undated.length>0&&<div className="hm-freezer-undated-v28"><span><small>NO BATCH DATE</small><strong>{undated.length} {undated.length===1?"prep item has":"prep items have"} manually entered stock</strong><p>{undatedCodes}{undated.length>5?` +${undated.length-5} more`:""}. We count it for meals, but we do not invent a made date.</p></span><Link href="/prep/day">Next Prep Day ›</Link></div>}
  <section className="hm-block-v5 hm-freezer-mothers-section-v6"><SectionHead title="Mother bases" action={<Link href="/prep">Open Prep ›</Link>}/><div className="hm-freezer-mothers-v6">{motherBases.map(m=>{const n=stockPortions(m.id,h.componentStock);const photo=motherProcessImages[m.id]?.at(-1)?.url;const oldest=oldestBatch(m.id);const oldestLabel=oldest?new Date(oldest.at).toLocaleDateString(undefined,{day:"numeric",month:"short"}):null;const manualMl=Math.max(0,(h.componentStock[m.id]??0)-datedMl(m.id));return <article key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><Link href={`/prep/${m.id}`} className="hm-freezer-object-v6">{photo?<img src={photo} alt={`${m.name} freezer portions`} loading="lazy"/>:<div/>}<span>{m.code}</span></Link><div className="hm-freezer-copy-v6"><strong>{m.name}</strong><small>{h.componentStock[m.id]??0} ml · {activeIds.has(m.id)?"this week":"foundation"}{oldestLabel?` · oldest ${oldestLabel}`:""}{manualMl?` · ${manualMl} ml undated`:""}</small><em className="hm-stock-segments-v5" aria-label={`${n} ${n===1?"portion":"portions"} of ${m.code}`}>{[0,1,2,3,4].map(i=><i key={i} className={i<Math.min(n,5)?"on":""}/>)}</em></div><div className="hm-stepper-v5"><button aria-label={`Decrease ${m.code}`} onClick={()=>setByPortion(m.id,-1)}>−</button><b>{n}</b><button aria-label={`Increase ${m.code}`} onClick={()=>setByPortion(m.id,1)}>+</button></div></article>})}</div></section>
  <section className="hm-block-v5"><SectionHead title="Mids + boosters" action={<Link href="/prep/mids">Explore ›</Link>}/><div className="hm-freezer-other-v5">{shown.map(c=>{const n=stockPortions(c.id,h.componentStock);const oldest=oldestBatch(c.id);const oldestLabel=oldest?new Date(oldest.at).toLocaleDateString(undefined,{day:"numeric",month:"short"}):null;const manualMl=Math.max(0,(h.componentStock[c.id]??0)-datedMl(c.id));return <article key={c.id} style={{"--tone":c.tone} as React.CSSProperties}><i/><span><strong>{c.code}</strong><small>{c.name}{activeIds.has(c.id)?" · this week":""}{oldestLabel?` · oldest ${oldestLabel}`:""}{manualMl?` · ${manualMl} ml undated`:""}</small></span><div className="hm-stepper-v5"><button aria-label={`Decrease ${c.code}`} onClick={()=>setByPortion(c.id,-1)}>−</button><b>{n}</b><button aria-label={`Increase ${c.code}`} onClick={()=>setByPortion(c.id,1)}>+</button></div></article>})}</div><button className="hm-text-button-v5" onClick={()=>{setMore(v=>!v);feedback("tap")}}>{more?"Show less":"Show all prep"}</button></section>
 </>;
}