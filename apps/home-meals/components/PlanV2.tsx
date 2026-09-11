"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, meals, midBases, motherBases } from "@/data/home-graph-v3";
import { GroceryDelta, WeekDependencyMap } from "./HomeInfographics";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function PlanV2(){
 const h=useHousehold();
 const grouped=h.shoppingNeeds.reduce<Record<string,typeof h.shoppingNeeds>>((acc,x)=>{const cat=getIngredient(x.id).category;(acc[cat]??=[]).push(x);return acc},{});
 const codeLine=(id:string)=>{const m=getMeal(id);return [...m.motherIds.map(x=>motherBases.find(b=>b.id===x)?.code),...m.midIds.map(x=>midBases.find(b=>b.id===x)?.code)].filter(Boolean).join(" + ")||"fresh"};
 const rated=Object.entries(h.ratings).filter(([,v])=>v.josh||v.g).slice(0,4);
 const useSoon=["mushrooms","cream","broccoli"].map(id=>{const item=h.shoppingNeeds.find(x=>x.id===id);const def=(()=>{try{return getIngredient(id)}catch{return null}})();return def?{id,name:def.name,onHand:h.ingredientStock[id]??0,unit:def.defaultUnit,need:item?.required??0}:null}).filter(Boolean) as {id:string;name:string;onHand:number;unit:string;need:number}[];
 return <div className="hm-screen hm-plan-screen hm-v3-screen">
  <header className="hm-mobile-head"><div><span>THIS WEEK</span><h1>Plan & shop.</h1><p>Seven dinners, one linked home.</p></div><div className="hm-couple-bubbles"><b>J</b><b>G</b></div></header>

  <section className="hm-section hm-v3-section hm-plan-week-section"><div className="hm-v3-section-head"><div><span>YOUR WEEK</span><h2>At a glance</h2></div><small>tap a card to swap</small></div><div className="hm-plan-rail-v3">{h.week.map((id,i)=>{const m=getMeal(id);return <article key={`${id}-${i}`}>{m.image?<img src={m.image} alt=""/>:<div className="placeholder">{m.title[0]}</div>}<span>{days[i]}</span><strong>{m.title}</strong><small>{m.minutes}m · {codeLine(id)}</small><select value={id} onChange={e=>h.setDay(i,e.target.value)} aria-label={`Change ${days[i]} meal`}>{meals.map(opt=><option key={opt.id} value={opt.id}>{opt.title}</option>)}</select></article>})}</div></section>

  <section className="hm-plan-attention-grid">
   <article><div className="hm-v3-section-head"><div><span>USE SOON</span><h2>Eat these first</h2></div></div><div className="hm-use-soon-list">{useSoon.map((x,i)=><div key={x.id}><i>{["🍄","🥛","🥦"][i]}</i><span><strong>{x.name}</strong><small>{x.onHand>0?`${Math.ceil(x.onHand)} ${x.unit} at home`:"low / out"}</small></span></div>)}</div></article>
   <article><div className="hm-v3-section-head"><div><span>TOP UP</span><h2>Running low</h2></div></div>{h.shoppingNeeds.slice(0,4).map(x=><div className="hm-topup-row" key={x.id}><span>{getIngredient(x.id).name}</span><strong>+{Math.ceil(x.qty)} {x.unit}</strong></div>)}</article>
  </section>

  <GroceryDelta/>
  <WeekDependencyMap/>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>SHOPPING LIST</span><h2>{h.shoppingNeeds.length?`${h.shoppingNeeds.length} things to buy`:"We're covered"}</h2></div><small>generated from this week</small></div>{h.shoppingNeeds.length?<div className="hm-shopping-grid-v3">{Object.entries(grouped).map(([cat,items])=><article key={cat}><header><span>{cat}</span><b>{items.length}</b></header>{items.map(x=><label key={x.id} className={h.groceryChecked[x.id]?"done":""}><input type="checkbox" checked={!!h.groceryChecked[x.id]} onChange={()=>h.toggleGrocery(x.id)}/><span><strong>{getIngredient(x.id).name}</strong><small>buy {Math.ceil(x.qty)} {x.unit}</small></span></label>)}</article>)}</div>:<div className="hm-celebrate-card">✓ Everything this week needs is already at home.</div>}</section>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>PREP FROM THE PLAN</span><h2>{h.prepNeeds.length?`${h.prepNeeds.length} things to make`:"Freezer covered"}</h2></div><Link href="/prep">Open Prep ›</Link></div><div className="hm-plan-prep-strip">{h.prepNeeds.length?h.prepNeeds.map(x=>{const item=motherBases.find(b=>b.id===x.id)??midBases.find(b=>b.id===x.id);return <div key={x.id} style={{"--tone":item?.tone} as React.CSSProperties}><i/><strong>{item?.code}</strong><span>short {x.short}</span></div>}):<div className="hm-celebrate-card compact">Nothing to prep just because it is Sunday.</div>}</div></section>

  <section className="hm-rating-house"><div><span>OUR WEEK</span><h2>How did we do?</h2></div>{rated.length?<div className="hm-ratings-strip-v3">{rated.map(([id,v])=><div key={id}><strong>{getMeal(id).title}</strong><span><b>J</b> {v.josh??"—"}★ <b>G</b> {v.g??"—"}★</span></div>)}</div>:<p>After dinner, rate it separately. The good ones stay. The weak ones evolve.</p>}<Link href="/cook">Our recipes ›</Link></section>
 </div>
}
