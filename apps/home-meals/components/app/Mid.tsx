"use client";
import Link from "next/link";
import {useState} from "react";
import {midContent} from "@/data/mid-content-v3";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {batchOutputMl,stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {useSheet} from "@/lib/useSheet";
import {Back,MealCard,SectionHead} from "./Primitives";

export function Mid({id}:{id:string}){const h=useHousehold();const m=midBases.find(x=>x.id===id)!;const c=midContent[id];const linked=recipes.filter(r=>r.midIds.includes(id));const[confirm,setConfirm]=useState(false);useSheet(confirm,()=>setConfirm(false));const ml=h.componentStock[id]??0;const portions=stockPortions(id,h.componentStock);const batchMl=batchOutputMl(id);
 return <div className="hm-page-v5 hm-mid-v5"><Back href="/prep/mids" label="Mids"/><header className="hm-mid-head-v5" style={{"--tone":m.tone} as React.CSSProperties}><i/><div><span>MID-BASE</span><h1>{m.name}</h1><p>{c?.what??"A make-ahead flavour direction."}</p><div>{m.parentMotherIds.length?m.parentMotherIds.map(pid=><Link href={`/prep/${pid}`} key={pid}>{motherBases.find(x=>x.id===pid)?.code}</Link>):<b>Standalone</b>}</div></div></header>
  <section className="hm-stock-action-v5"><div><span>In the kitchen</span><strong>{h.kitchenReady?`${ml} ml`:"Not checked"}</strong><small>{h.kitchenReady?`${portions} standard ${portions===1?"portion":"portions"}`:`Standard portion: ${m.portionMl} ml`}</small></div><button onClick={()=>setConfirm(true)}>Make batch</button></section>
  {c&&<><section className="hm-block-v5 hm-batch-recipe-v5"><SectionHead eyebrow="BATCH RECIPE" title="What goes in"/><ul>{c.batch.map(x=><li key={x}>{x}</li>)}</ul></section><section className="hm-block-v5"><SectionHead eyebrow="METHOD" title="Make it"/><ol className="hm-step-list-v5">{c.method.map((x,i)=><li key={x}><b>{i+1}</b><p>{x}</p></li>)}</ol></section><section className="hm-practical-grid-v5"><div><span>Storage</span><p>{c.storage}</p></div><div><span>Reference</span><p>{c.source}</p>{c.youtube&&<small>{c.youtube}</small>}</div></section></>}
  <section className="hm-block-v5"><SectionHead eyebrow="OUR RECIPES" title={linked.length?`${linked.length} ${linked.length===1?"recipe":"recipes"} using ${m.code}`:"Not in our rotation yet"}/>{linked.length?<div className="hm-meal-rail-v5">{linked.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div>:<div className="hm-empty-v5"><strong>No saved dinner uses this yet.</strong>{c?.dinners?.length&&<p>Good next candidates: {c.dinners.slice(0,4).join(" · ")}</p>}</div>}</section>
  {confirm&&<div className="hm-sheet-backdrop-v5" onMouseDown={e=>{if(e.target===e.currentTarget)setConfirm(false)}}><section className="hm-sheet-v5" role="dialog" aria-modal="true" aria-label={`Add ${m.code} batch`}><div className="hm-sheet-handle-v5"/><header><div><span>ADD A BATCH</span><h2>{m.code}</h2></div><button className="hm-icon-button-v5" onClick={()=>setConfirm(false)} aria-label="Close">×</button></header><p>One batch adds <strong>{batchMl} ml</strong> ({m.batchYield} × {m.portionMl} ml).</p><button className="hm-primary-button-v5" onClick={()=>{h.makeBatch(id);setConfirm(false);feedback("success")}}>Batch finished</button></section></div>}
 </div>}
