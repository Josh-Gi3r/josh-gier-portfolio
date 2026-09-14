"use client";
import Link from "next/link";
import {useMemo,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getRecipe,midBases,motherBases,recipes} from "@/data/home-data";
import {foundationImages} from "@/data/foundation-assets";
import {prepDemandForWeekMl,stockPortions} from "@/data/stock-math";
import {feedback} from "@/lib/feedback";
import {motherHero,portionWord,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,SectionHead,Tile} from "./Primitives";

const statusOf=(portions:number)=>portions<=0?{label:"Out",bg:"linear-gradient(135deg,#ff8a70,#e65f45)"}:portions<2?{label:"Low",bg:"linear-gradient(135deg,#ffb48f,#ff8a5c)"}:{label:"Good",bg:"linear-gradient(135deg,#6fd39a,#2fae6e)"};
const quick=[{href:"/prep/day",label:"Prep Day",glyph:"✓",bg:"var(--grad-green-short)"},{href:"/prep/mids",label:"Mid-bases",glyph:"→",bg:"linear-gradient(135deg,#ffc2a8,#ff9f7a)"},{href:"/learn/portions",label:"Working portions",glyph:"▦",bg:"linear-gradient(135deg,#9fc0ff,#4f8cff)"},{href:"/learn/freezer",label:"Freezer",glyph:"❄",bg:"var(--ink)"}];

export function Prep(){
 const h=useHousehold();
 const demand=prepDemandForWeekMl(h.week);const needs=h.kitchenReady?h.prepNeeds:[];
 const needLine=needs.slice(0,3).map(n=>{const c=getComponent(n.id);return c?`${c.code} ${n.shortQty} ${n.unit}`:null}).filter(Boolean).join(" · ");
 const focusId=needs[0]?.id??demand.sort((a,b)=>b.neededQty-a.neededQty)[0]?.id??"gold";const focus=getComponent(focusId)??getComponent("gold")!;
 const becomes=useMemo(()=>{const viaMid=new Set(midBases.filter(m=>m.parentMotherIds.includes(focusId)).map(m=>m.id));return recipes.filter(r=>r.prep.some(p=>p.id===focusId)||r.midIds.some(m=>viaMid.has(m)))},[focusId]);
 const says=(()=>{
  if(!h.kitchenReady)return {text:<>I can’t plan prep until I know the freezer. Count the bases once and I’ll only ask you to make what the week is short of.</>,actions:<><Link className="primary" href="/kitchen">Count the freezer</Link><Link className="ghost" href="/prep/day">Stock up anyway</Link></>};
  if(needs.length)return {text:<>Short <b>{needLine}</b> this week. Prep Day will make one canonical run at a time, then weigh the real output before it becomes stock.</>,actions:<><Link className="primary" href="/prep/day">Open Prep Day</Link><Link className="ghost" href="/plan">Swap a dinner instead</Link></>};
  return {text:<>The freezer covers this week — nothing to make. A stock-up session is there if you want a quiet kitchen session.</>,actions:<><Link className="primary" href="/prep/day">Stock up</Link><Link className="ghost" href="/prep/mids">Explore mids</Link></>};
 })();
 return <div className="hm-screen">
  <h1 className="hm-h1 hm-gut">Prep</h1>
  <HomeSays actions={says.actions}>{says.text}</HomeSays>
  <SectionHead title="Our bases" action={<span className="muted">in the freezer</span>}/>
  <div className="hm-bases">{motherBases.map(m=>{const portions=stockPortions(m.id,h.componentStock);const st=statusOf(portions);const hero=motherHero(m.id);return <Tile key={m.id} href={`/prep/${m.id}`} img={hero} alt={m.name} style={{"--tone":toneFor(m.id),"--tone-grad":toneGradient(m.id)} as CSSProperties}>{!hero&&<div className="initial">{m.code}<small>{m.name}</small></div>}<span className="badge code">{m.code}</span>{h.kitchenReady&&<span className="badge right status" style={{"--status":st.bg} as CSSProperties}>{st.label}</span>}<div className="copy"><div className="n">{h.kitchenReady?portions:"—"} <small>{portionWord(m.id,portions)}</small></div><span className="name">{m.name}</span></div></Tile>})}</div>
  <Link href="/prep/day" className={`hm-session hm-lift ${needs.length?"":"calm"}`} onClick={()=>feedback("tap")}><img src={foundationImages.prepDay} alt="" loading="lazy"/><div className="shade"/><div className="copy"><div><span className="kick">{needs.length?"THIS WEEK":"STOCK-UP SESSION"}</span><h3>{needs.length?<>{needLine}<br/>{needs.length} measured {needs.length===1?"run":"runs"}</>:<>Top up any base<br/>and weigh what you actually made</>}</h3></div><span className="hm-btn">{needs.length?"Start session":"Open Prep Day"}</span></div></Link>
  {h.prepBatches.length>0&&<><SectionHead title="Recent batches" action={<span className="muted">newest first</span>}/><div className="hm-batches">{h.prepBatches.slice(0,4).map((b,i)=>{const c=getComponent(b.componentId);return <div key={`${b.producedAt}-${i}`} className="hm-card" style={{"--tone":toneFor(b.componentId)} as CSSProperties}><i/><span><strong>{c?.code} · {c?.name}</strong><small>{new Date(b.producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · {b.remaining.qty>0?`${b.remaining.qty} ${b.remaining.unit} left`:"used up"}</small></span><b>{b.initial.qty} {b.initial.unit}</b></div>})}</div></>}
  <SectionHead title={`What ${focus.code} becomes`} action={<span style={{color:toneFor(focusId),fontWeight:700,fontSize:13}}>{becomes.length} dinners</span>}/><div className="hm-rail">{becomes.slice(0,10).map(r=><MealTile key={r.id} recipe={r}/>)}</div>
  <SectionHead title="More" action={<span className="muted">guides & tools</span>}/><div className="hm-quick">{quick.map(q=><Link key={q.href} href={q.href} className="hm-card hm-lift" style={{"--bg":q.bg} as CSSProperties} onClick={()=>feedback("tap")}><span className="ic">{q.glyph}</span><strong>{q.label}</strong></Link>)}</div>
  <p className="hm-note hm-gut" style={{marginTop:14}}>{demand.length} prep {demand.length===1?"item":"items"} in this week’s plan · {getRecipe(h.week[0])?"7 dinners":""}</p>
 </div>;
}
