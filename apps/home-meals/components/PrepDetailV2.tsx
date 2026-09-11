"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { baseRecipesV2 } from "@/data/base-recipes-v2";
import { meals, midBases, motherBases } from "@/data/home-graph-v3";

export function PrepDetailV2({baseId}:{baseId:string}){
 const h=useHousehold();const base=motherBases.find(x=>x.id===baseId)!;const recipe=baseRecipesV2[baseId];const mids=midBases.filter(x=>x.parentMotherIds.includes(baseId));const linkedMeals=meals.filter(x=>x.motherIds.includes(baseId));const stock=h.componentStock[base.id]??0;
 const scale=Math.min(1.35,.55+Math.sqrt(base.portionMl)/32);
 return <div className="hm-screen hm-base-detail hm-v3-screen">
  <header className="hm-mobile-head"><div><span>CORE BASE · {base.approxMeals} DINNERS</span><h1>{base.code}</h1><p>{base.name}</p></div><Link href="/prep" className="hm-head-help">‹</Link></header>

  <section className="hm-base-v3-hero" style={{"--tone":base.tone} as React.CSSProperties}><div className="hm-base-big-cube"><i style={{transform:`scale(${scale})`}}/><strong>{base.code}</strong></div><div className="copy"><span>WHY IT LIVES IN OUR FREEZER</span><h2>{base.name}</h2><p>{base.purpose}</p><div className="chips"><b>{base.approxMeals} dinner directions</b><b>{mids.length} linked mids</b></div></div><aside><small>ON HAND</small><strong>{stock}</strong><span>portions</span><button onClick={()=>h.makeBatch(base.id)}>+ batch {base.batchYield}</button></aside></section>

  <section className="hm-base-v3-stats"><article><span>PORTION</span><strong>{base.portionLabel}</strong><small>{base.portionMl} ml standard</small></article><article><span>BATCH</span><strong>×{base.batchYield}</strong><small>one prep session</small></article><article><span>FREEZE</span><strong>{base.freezeFormat}</strong></article></section>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>WHAT IT OPENS</span><h2>From one base</h2></div></div><div className="hm-dinner-bubbles">{base.examples.map(x=><span key={x}>{x}</span>)}</div>{mids.length>0&&<div className="hm-base-mid-flow"><div className="mother" style={{"--tone":base.tone} as React.CSSProperties}><i/><strong>{base.code}</strong></div><b>→</b><div className="mids">{mids.map((mid,i)=><Link href={`/prep/mids/${mid.id}`} key={mid.id} style={{animationDelay:`${i*60}ms`}}><strong>{mid.code}</strong><span>{mid.name}</span></Link>)}</div></div>}</section>

  {recipe&&<>
   <section className="hm-base-recipe-v3"><article><span>MEASURED BATCH</span><h2>What goes in</h2><ul>{recipe.ingredients.map(x=><li key={x}>{x}</li>)}</ul></article><article><span>METHOD</span><h2>Cook to the cue</h2><ol>{recipe.method.map((x,i)=><li key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></li>)}</ol></article></section>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>DONENESS</span><h2>Look for this</h2></div><small>the pan, not just the clock</small></div><div className="hm-cue-cards-v3">{recipe.cues.map((x,i)=><article key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span><i/></article>)}</div></section>
   <section className="hm-base-practical-v3"><article><span>🧊</span><div><strong>Store it</strong><p>{recipe.storage}</p></div></article><article><span>📍</span><div><strong>JB / Singapore</strong><p>{recipe.local}</p></div></article><article><span>▶</span><div><strong>Reference</strong><p>{recipe.sourceLabel}</p><a href={recipe.sourceUrl} target="_blank" rel="noreferrer">Open source ↗</a><small>{recipe.youtube}</small></div></article></section>
  </>}

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>RECIPES USING {base.code}</span><h2>Cook from it</h2></div><Link href="/cook">All recipes ›</Link></div>{linkedMeals.length?<div className="hm-prep-meal-rail">{linkedMeals.map(m=><Link href={`/cook/${m.id}`} key={m.id}>{m.image&&<img src={m.image} alt=""/>}<strong>{m.title}</strong><small>{m.cuisine} · {m.minutes} min</small></Link>)}</div>:<div className="hm-celebrate-card">The mother is researched; more linked household recipes will be added as we approve them.</div>}</section>
 </div>
}
