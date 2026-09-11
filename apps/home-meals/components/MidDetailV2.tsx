"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { meals, midBases, motherBases } from "@/data/home-graph-v3";
import { midContent } from "@/data/mid-content-v3";
export function MidDetailV2({midId}:{midId:string}){
 const h=useHousehold();const mid=midBases.find(x=>x.id===midId);if(!mid)return null;const linked=meals.filter(x=>x.midIds.includes(midId));const c=midContent[midId];
 return <div className="hm-screen hm-mid-detail hm-v3-screen"><Link href="/prep/mids" className="hm-back">← All mids</Link>
  <header className="hm-mid-detail-hero" style={{"--tone":mid.tone} as React.CSSProperties}><div><span>MID-BASE</span><h1>{mid.code}</h1><h2>{mid.name}</h2><p>{c?.what??"Directional prep component."}</p><div className="hm-code-row">{mid.parentMotherIds.map(id=><b key={id}>{motherBases.find(m=>m.id===id)?.code}</b>)}{mid.standalone&&<em>standalone</em>}</div></div><aside><small>ON HAND</small><strong>{h.componentStock[mid.id]??0}</strong><span>{mid.portionLabel}</span><button onClick={()=>h.makeBatch(mid.id)}>+ batch {mid.batchYield}</button></aside></header>
  <section className="hm-mid-facts"><div><span>PORTION</span><strong>{mid.portionLabel}</strong></div><div><span>BATCH</span><strong>×{mid.batchYield}</strong></div><div><span>PARENT</span><strong>{mid.parentMotherIds.map(id=>motherBases.find(m=>m.id===id)?.code).join(" + ")||"Standalone"}</strong></div><div><span>DINNERS</span><strong>{c?.dinners.length??mid.examples.length}+</strong></div></section>
  {c&&<><section className="hm-mid-recipe"><article><span>BATCH</span><h2>What goes in</h2><ul>{c.batch.map(x=><li key={x}>{x}</li>)}</ul></article><article><span>METHOD</span><h2>Make it once</h2><ol>{c.method.map((x,i)=><li key={x}><b>{i+1}</b><p>{x}</p></li>)}</ol></article></section><section className="hm-mid-storage"><div><span>STORAGE</span><strong>{c.storage}</strong></div><div><span>SOURCE</span><strong>{c.source}</strong><small>{c.youtube}</small></div></section></>}
  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>WHAT IT OPENS</span><h2>Meals from this mid</h2></div></div><div className="hm-dinner-bubbles">{(c?.dinners??mid.examples).map(x=><span key={x}>{x}</span>)}</div>{linked.length>0&&<div className="hm-prep-meal-links">{linked.map((m,i)=><Link href={`/cook/${m.id}`} key={m.id}><span>{i+1}</span><div><strong>{m.title}</strong><small>{m.cuisine} · {m.minutes} min</small></div></Link>)}</div>}</section>
 </div>
}
