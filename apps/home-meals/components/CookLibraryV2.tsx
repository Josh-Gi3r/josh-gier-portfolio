"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { meals, midBases, motherBases } from "@/data/home-graph";

export function CookLibraryV2(){
 const [query,setQuery]=useState(""); const [filter,setFilter]=useState("all");
 const cuisines=["all",...Array.from(new Set(meals.map(x=>x.cuisine)))];
 const visible=useMemo(()=>meals.filter(m=>(filter==="all"||m.cuisine===filter)&&(`${m.title} ${m.subtitle} ${m.cuisine}`).toLowerCase().includes(query.toLowerCase())),[query,filter]);
 const badges=(m:typeof meals[number])=>[...m.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...m.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean) as string[];
 return <div className="hm-screen hm-cook-screen">
  <header className="hm-page-head"><div><p className="hm-kicker">COOK</p><h1>Our recipes</h1><p>Only meals connected to the prep and kitchen system belong here.</p></div><Link href="/cook/builder" className="hm-btn primary">Build from what we have</Link></header>
  <section className="hm-library-controls"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search our recipes…"/><div>{cuisines.map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x==="all"?"All":x}</button>)}</div></section>
  <section className="hm-recipe-grid">{visible.map(m=><Link href={`/cook/${m.id}`} key={m.id} className="hm-recipe-card">{m.image?<img src={m.image} alt={m.title}/>:<div className="hm-meal-placeholder big">{m.title.slice(0,1)}</div>}<div className="hm-recipe-card-copy"><div className="hm-code-row">{badges(m).map(x=><b key={x}>{x}</b>)}{m.status==="placeholder"&&<em>content placeholder</em>}</div><h2>{m.title}</h2><p>{m.subtitle}</p><footer><span>{m.cuisine}</span><span>{m.minutes} min</span><span>{m.method}</span></footer></div></Link>)}</section>
 </div>
}
