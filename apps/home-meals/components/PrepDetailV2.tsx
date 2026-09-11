"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { baseRecipesV2 } from "@/data/base-recipes-v2";
import { meals, midBases, motherBases } from "@/data/home-graph";

export function PrepDetailV2({baseId}:{baseId:string}){
 const h=useHousehold();const base=motherBases.find(x=>x.id===baseId)!;const recipe=baseRecipesV2[baseId];const mids=midBases.filter(x=>x.parentMotherIds.includes(baseId));const linkedMeals=meals.filter(x=>x.motherIds.includes(baseId));
 return <div className="hm-screen hm-base-detail">
  <Link href="/prep" className="hm-back">← Prep</Link>
  <header className="hm-base-hero" style={{"--tone":base.tone} as React.CSSProperties}><div><span>CORE BASE · {base.approxMeals} DISHES</span><h1>{base.code}</h1><h2>{base.name}</h2><p>{base.purpose}</p></div><aside><small>FREEZER</small><strong>{h.componentStock[base.id]??0}</strong><span>portions now</span><button onClick={()=>h.makeBatch(base.id)}>Log one batch +{base.batchYield}</button></aside></header>
  <section className="hm-base-facts"><div><span>PORTION</span><strong>{base.portionLabel}</strong></div><div><span>STARTER BATCH</span><strong>×{base.batchYield}</strong></div><div><span>FREEZE AS</span><strong>{base.freezeFormat}</strong></div><div><span>LINKED MIDS</span><strong>{mids.length}</strong></div></section>
  {recipe&&<><section className="hm-base-recipe"><article><span>MEASURED BATCH</span><h2>What goes in</h2><ul>{recipe.ingredients.map(x=><li key={x}>{x}</li>)}</ul></article><article><span>METHOD</span><h2>Cook to the cue</h2><ol>{recipe.method.map((x,i)=><li key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></li>)}</ol></article></section><section className="hm-cue-grid"><header><span>DONENESS</span><h2>The pan, not the clock.</h2></header>{recipe.cues.map((x,i)=><div key={x}><b>0{i+1}</b><p>{x}</p></div>)}</section><section className="hm-base-notes"><article><span>STORAGE</span><p>{recipe.storage}</p></article><article><span>JB / SINGAPORE</span><p>{recipe.local}</p></article><article><span>REFERENCE</span><p>{recipe.sourceLabel}</p><small>{recipe.youtube}</small></article></section></>}
  <section className="hm-section"><div className="hm-section-title"><div><span>MULTIPLIERS</span><h2>Mids that use {base.code}</h2></div><Link href="/prep/mids">All mids →</Link></div>{mids.length?<div className="hm-mid-link-grid">{mids.map(mid=><Link href={`/prep/mids/${mid.id}`} key={mid.id} style={{"--tone":mid.tone} as React.CSSProperties}><i/><strong>{mid.code}</strong><span>{mid.name}</span><small>{mid.examples.join(" · ")}</small></Link>)}</div>:<div className="hm-covered-card">No dedicated mid is required; this mother already branches directly into multiple dinners.</div>}</section>
  <section className="hm-section"><div className="hm-section-title"><div><span>DINNERS WIRED NOW</span><h2>Recipes already using {base.code}</h2></div><Link href="/cook">Cook →</Link></div><div className="hm-prep-meal-links">{linkedMeals.map((m,i)=><Link href={`/cook/${m.id}`} key={m.id}><span>{i+1}</span><div><strong>{m.title}</strong><small>{m.cuisine} · {m.minutes} min</small></div></Link>)}</div></section>
 </div>
}
