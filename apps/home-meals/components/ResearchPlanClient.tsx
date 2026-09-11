"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { firstWeekTopUp, researchedWeek } from "@/data/meal-plan";
import { mealBySlug, researchedMeals } from "@/data/meals-researched";
import { MealVisual } from "./MealVisual";

export function ResearchPlanClient(){
 const [week,setWeek]=useState(researchedWeek);const[editing,setEditing]=useState<number|null>(null);const[checked,setChecked]=useState<Record<string,boolean>>({});
 const swap=(i:number,slug:string)=>{setWeek(w=>w.map((x,n)=>n===i?{...x,slug,note:"Swapped from researched library"}:x));setEditing(null)};
 const topUpCount=useMemo(()=>firstWeekTopUp.reduce((n,g)=>n+g.items.length,0),[]);
 return <><section className="research-week"><div className="week-hero"><span className="eyebrow">FIRST OPERATING WEEK</span><h2>Seven dinners that stress-test the system.</h2><p>Indian, Chinese-style, Malaysian, Thai and European lanes; wok, pan, curry and braise methods; fresh seafood earlier in the week; four different mother bases plus core mids.</p></div><div className="research-week-list">{week.map((x,i)=>{const m=mealBySlug(x.slug)!;return <article key={x.day}><div className="week-day"><span>{x.day}</span><small>0{i+1}</small></div><Link href={`/cook/${m.slug}`} className="week-meal"><MealVisual slug={m.slug} title={m.title} compact/><div><strong>{m.title}</strong><small>{m.time} min · {m.method}</small><p>{x.note}</p></div></Link><button className="text-button" onClick={()=>setEditing(editing===i?null:i)}>Swap</button>{editing===i&&<div className="research-swap">{researchedMeals.slice(0,18).map(r=><button key={r.slug} onClick={()=>swap(i,r.slug)}><strong>{r.title}</strong><small>{r.time} min · {r.cuisine}</small></button>)}</div>}</article>})}</div></section><section className="week-shop"><div className="section-heading"><div><span className="eyebrow">WEEKLY FRESH TOP-UP</span><h2>Foundation stock is already assumed.</h2></div><span className="pill">{topUpCount} checks</span></div><div className="week-shop-grid">{firstWeekTopUp.map(g=><div key={g.group}><h3>{g.group}</h3>{g.items.map(item=>{const id=`${g.group}:${item}`;return <label className={checked[id]?"checked":""} key={id}><input type="checkbox" checked={!!checked[id]} onChange={()=>setChecked(c=>({...c,[id]:!c[id]}))}/><span>{item}</span></label>})}</div>)}</div></section></>
}
