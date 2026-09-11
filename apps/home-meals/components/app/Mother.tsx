"use client";
import Link from "next/link";
import {useState} from "react";
import {useHousehold} from "../HouseholdState";
import {baseRecipesV2} from "@/data/base-recipes-v2";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {batchOutputMl,stockPortions} from "@/data/stock-math";
import {feedback} from "@/lib/feedback";
import {useSheet} from "@/lib/useSheet";
import {Back,MealCard,SectionHead} from "./Primitives";

export function Mother({id}:{id:string}){const h=useHousehold();const m=motherBases.find(x=>x.id===id)!;const recipe=baseRecipesV2[id];const mids=midBases.filter(x=>x.parentMotherIds.includes(id));const linked=recipes.filter(r=>r.motherIds.includes(id));const[confirm,setConfirm]=useState(false);useSheet(confirm,()=>setConfirm(false));const ml=h.componentStock[id]??0;const portions=stockPortions(id,h.componentStock);const batchMl=batchOutputMl(id);
 return <div className="hm-page-v5 hm-mother-v5"><Back href="/prep" label="Prep"/><header className="hm-mother-head-v5" style={{"--tone":m.tone} as React.CSSProperties}><div className="hm-base-cube-v5 big"><i/><b>{m.code}</b></div><div><span>MOTHER BASE</span><h1>{m.name}</h1><p>{m.purpose}</p></div></header>
  <section className="hm-stock-action-v5"><div><span>In the freezer</span><strong>{h.kitchenReady?`${ml} ml`:"Not checked"}</strong><small>{h.kitchenReady?`${portions} standard ${portions===1?"portion":"portions"}`:`Standard portion: ${m.portionMl} ml`}</small></div><button onClick={()=>setConfirm(true)}>Make batch</button></section>
  {recipe&&<><section className="hm-block-v5 hm-batch-recipe-v5"><SectionHead eyebrow="BATCH RECIPE" title="What goes in"/><ul>{recipe.ingredients.map(x=><li key={x}>{x}</li>)}</ul></section><section className="hm-block-v5"><SectionHead eyebrow="METHOD" title="Cook it"/><ol className="hm-step-list-v5">{recipe.method.map((x,i)=><li key={x}><b>{i+1}</b><p>{x}</p></li>)}</ol></section><section className="hm-block-v5"><SectionHead eyebrow="LOOK FOR" title="When it’s ready"/><div className="hm-cue-grid-v5">{recipe.cues.map(x=><div key={x}>✓ {x}</div>)}</div></section><section className="hm-practical-grid-v5"><div><span>Freeze</span><strong>{m.freezeFormat}</strong></div><div><span>JB / Singapore</span><p>{recipe.local}</p></div><a href={recipe.sourceUrl} target="_blank" rel="noreferrer"><span>Reference</span><strong>{recipe.sourceLabel} ↗</strong></a></section></>}
  {mids.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="MIDS" title={`Build from ${m.code}`}/><div className="hm-mid-quick-v5">{mids.map(x=><Link href={`/prep/mids/${x.id}`} key={x.id} style={{"--tone":x.tone} as React.CSSProperties}><i/><div><strong>{x.code}</strong><span>{x.name}</span></div></Link>)}</div></section>}
  <section className="hm-block-v5"><SectionHead eyebrow="RECIPES" title={`Cook with ${m.code}`}/>{linked.length?<div className="hm-meal-rail-v5">{linked.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div>:<div className="hm-empty-v5">No current recipe uses this base yet.</div>}</section>
  {confirm&&<div className="hm-sheet-backdrop-v5" onMouseDown={e=>{if(e.target===e.currentTarget)setConfirm(false)}}><section className="hm-sheet-v5" role="dialog" aria-modal="true" aria-label={`Add ${m.code} batch`}><div className="hm-sheet-handle-v5"/><header><div><span>ADD A BATCH</span><h2>{m.code}</h2></div><button className="hm-icon-button-v5" onClick={()=>setConfirm(false)} aria-label="Close">×</button></header><p>One batch adds <strong>{batchMl} ml</strong> to the freezer ({m.batchYield} × {m.portionMl} ml).</p><button className="hm-primary-button-v5" onClick={()=>{h.makeBatch(id);setConfirm(false);feedback("success")}}>Batch finished</button></section></div>}
 </div>}
