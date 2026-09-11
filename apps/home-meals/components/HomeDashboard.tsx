"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, midBases, motherBases } from "@/data/home-graph";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function HomeDashboard(){
 const h=useHousehold(); const day=(new Date().getDay()+6)%7; const tonight=getMeal(h.week[day]??h.week[0]);
 const prep=h.prepNeeds.slice(0,3); const buy=h.shoppingNeeds.slice(0,4);
 const codes=(mealId:string)=>{const m=getMeal(mealId);return [...m.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...m.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean) as string[]};
 return <div className="hm-screen hm-home-screen">
  <header className="hm-page-head"><div><p className="hm-kicker">HOME MEALS</p><h1>What are we doing?</h1><p>Josh + G · dinner, prep and groceries in one place.</p></div><div className="hm-household-avatar"><span>J</span><span>G</span></div></header>
  <section className="hm-tonight-card">{tonight.image&&<img src={tonight.image} alt={tonight.title}/>}<div className="hm-tonight-shade"/><div className="hm-tonight-copy"><span>TONIGHT · {tonight.minutes} MIN</span><h2>{tonight.title}</h2><p>{tonight.subtitle}</p><div className="hm-code-row">{codes(tonight.id).map(x=><b key={x}>{x}</b>)}</div><div className="hm-action-row"><Link href={`/cook/${tonight.id}`} className="hm-btn primary">Cook tonight</Link><Link href="/plan" className="hm-btn glass">Change meal</Link></div></div></section>
  <section className="hm-smart-row"><Link href="/plan"><small>WEEK</small><strong>{h.shoppingNeeds.length===0?"Groceries covered":`${h.shoppingNeeds.length} things to buy`}</strong><span>Generated from the actual plan →</span></Link><Link href="/prep"><small>PREP</small><strong>{prep.length===0?"You're covered":`${prep.length} prep gaps`}</strong><span>{prep.length?prep.map(x=>(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code).join(" · "):"Nothing to make just for the sake of it"} →</span></Link></section>
  <section className="hm-section"><div className="hm-section-title"><div><span>THIS WEEK</span><h2>Seven dinners</h2></div><Link href="/plan">Plan & shop →</Link></div><div className="hm-week-strip">{h.week.map((id,i)=>{const m=getMeal(id);return <Link key={`${id}-${i}`} href={`/cook/${id}`} className={i===day?"today":""}><span>{days[i]}</span>{m.image?<img src={m.image} alt=""/>:<div className="hm-meal-placeholder">{m.title.slice(0,1)}</div>}<strong>{m.title}</strong><small>{m.minutes}m · {codes(id).join(" + ")||"fresh"}</small></Link>})}</div></section>
  <section className="hm-home-grid"><article><div className="hm-section-title"><div><span>USE / BUY</span><h2>What needs attention</h2></div><Link href="/plan">See list →</Link></div>{buy.length?buy.map(x=><div className="hm-attention-row" key={x.id}><i/><div><strong>{getIngredient(x.id).name}</strong><small>Need {Math.ceil(x.qty)} {x.unit} · have {Math.ceil(x.onHand)}</small></div></div>):<p className="hm-empty">The week is covered by what is at home.</p>}</article>
   <article><div className="hm-section-title"><div><span>FREEZER</span><h2>Core base stock</h2></div><Link href="/kitchen">Kitchen →</Link></div><div className="hm-mini-stock">{motherBases.map(b=><div key={b.id}><i style={{background:b.tone}}/><span>{b.code}</span><strong>{h.componentStock[b.id]??0}</strong></div>)}</div></article></section>
  <section className="hm-home-note"><span>♡</span><div><strong>Good food, happier home.</strong><p>The system should disappear into daily life: choose, shop, prep, cook, rate, repeat.</p></div></section>
 </div>
}
