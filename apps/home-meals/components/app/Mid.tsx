"use client";
import Link from "next/link";
import {useState} from "react";
import {midContent} from "@/data/mid-content-v3";
import {motherProcessImages} from "@/data/mother-process-assets";
import {midBases,motherBases,recipes,getRecipe} from "@/data/home-data";
import {batchOutputMl,stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {useSheet} from "@/lib/useSheet";
import {Back,MealCard,SectionHead} from "./Primitives";

const google=(q:string)=>`https://www.google.com/search?q=${encodeURIComponent(q)}`;
const youtube=(q:string)=>`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
export function Mid({id}:{id:string}){
 const h=useHousehold();const m=midBases.find(x=>x.id===id)!;const c=midContent[id];const linked=recipes.filter(r=>r.midIds.includes(id));const usedThisWeek=h.week.some(rid=>getRecipe(rid).midIds.includes(id));const researchOnly=linked.length===0;const[confirm,setConfirm]=useState(false);const[added,setAdded]=useState(false);useSheet(confirm,()=>setConfirm(false));const ml=h.componentStock[id]??0;const portions=stockPortions(id,h.componentStock);const batchMl=batchOutputMl(id);const parents=m.parentMotherIds.map(pid=>motherBases.find(x=>x.id===pid)).filter(Boolean) as typeof motherBases;
 const finishBatch=()=>{h.makeBatch(id);setConfirm(false);setAdded(true);feedback("success");setTimeout(()=>setAdded(false),1800)};
 return <div className="hm-page-v5 hm-mid-v5 hm-mid-v6"><Back href="/prep/mids" label="Mids"/>
  <header className="hm-mid-head-v5 hm-mid-head-v6" style={{"--tone":m.tone} as React.CSSProperties}><div className="hm-mid-object-v6"><i/><b>{m.code}</b><span>MID</span></div><div><span>{usedThisWeek?"THIS WEEK":researchOnly?"RESEARCH":"MID-BASE"}</span><h1>{m.name}</h1><p>{c?.what??"A make-ahead flavour direction."}</p><div className="hm-mid-parent-links-v6">{parents.length?parents.map(parent=><Link href={`/prep/${parent.id}`} key={parent.id}>{parent.code}</Link>):<b>Standalone</b>}</div></div></header>
  <section className={`hm-stock-action-v5 hm-stock-action-v6 ${researchOnly?"research":""}`}><div><span>{researchOnly?"Status":"In the kitchen"}</span><strong>{researchOnly?"Not in our rotation yet":h.kitchenReady?`${ml} ml`:"Not checked"}</strong><small>{added?`${m.code} added to freezer ✓`:researchOnly?"Keep the research; make it when we add a dinner that uses it.":h.kitchenReady?`${portions} standard ${portions===1?"portion":"portions"}`:`Standard portion: ${m.portionMl} ml`}</small></div>{!researchOnly&&<button onClick={()=>setConfirm(true)}>{usedThisWeek?"Make for this week":"Make batch"}</button>}</section>

  {parents.length>0&&<section className="hm-mid-lineage-v6"><span>BUILT FROM</span><div>{parents.map(parent=>{const image=motherProcessImages[parent.id]?.at(-1)?.url;return <Link href={`/prep/${parent.id}`} key={parent.id} style={{"--parent-tone":parent.tone} as React.CSSProperties}>{image?<img src={image} alt="" loading="lazy"/>:<i/>}<b>{parent.code}</b><small>{parent.name}</small></Link>})}<em>→</em><div className="hm-mid-lineage-object-v6" style={{"--tone":m.tone} as React.CSSProperties}><i/><b>{m.code}</b><small>{m.name}</small></div></div></section>}

  {c&&<><section className="hm-block-v5 hm-batch-recipe-v5 hm-batch-recipe-v6"><SectionHead title="What goes in" action={<span>{researchOnly?"Research recipe":"Batch recipe"}</span>}/><ul>{c.batch.map(x=><li key={x}>{x}</li>)}</ul></section><section className="hm-block-v5"><SectionHead title="Make it"/><ol className="hm-step-list-v5">{c.method.map((x,i)=><li key={x}><b>{i+1}</b><p>{x}</p></li>)}</ol></section><section className="hm-practical-grid-v5 hm-practical-grid-v6"><div><span>Storage</span><p>{c.storage}</p></div><div><span>References</span><p>{c.source}</p><a href={google(`${c.source} ${m.name} recipe`)} target="_blank" rel="noreferrer">Find written source ↗</a>{c.youtube&&<><small>{c.youtube}</small><a href={youtube(c.youtube)} target="_blank" rel="noreferrer">Find tutorial ↗</a></>}</div></section></>}
  <section className="hm-block-v5"><SectionHead title={linked.length?`${linked.length} ${linked.length===1?"dinner":"dinners"} using ${m.code}`:"Not in our rotation yet"}/>{linked.length?<div className="hm-meal-rail-v5">{linked.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div>:<div className="hm-empty-v5"><strong>No saved dinner uses this yet.</strong>{c?.dinners?.length&&<p>Good next candidates: {c.dinners.slice(0,4).join(" · ")}</p>}</div>}</section>
  {confirm&&<div className="hm-sheet-backdrop-v5" onMouseDown={e=>{if(e.target===e.currentTarget)setConfirm(false)}}><section className="hm-sheet-v5" role="dialog" aria-modal="true" aria-label={`Add ${m.code} batch`}><div className="hm-sheet-handle-v5"/><header><div><span>ADD A BATCH</span><h2>{m.code}</h2></div><button className="hm-icon-button-v5" onClick={()=>setConfirm(false)} aria-label="Close">×</button></header><p>One batch adds <strong>{batchMl} ml</strong> ({m.batchYield} × {m.portionMl} ml).</p><button className="hm-primary-button-v5" onClick={finishBatch}>Batch finished</button></section></div>}
 </div>}
