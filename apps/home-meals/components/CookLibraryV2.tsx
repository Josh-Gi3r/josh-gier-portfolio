"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useHousehold } from "./HouseholdState";
import { meals, midBases, motherBases } from "@/data/home-graph-v3";

export function CookLibraryV2(){
 const h=useHousehold();const[query,setQuery]=useState("");const[filter,setFilter]=useState("all");
 const cuisines=["all",...Array.from(new Set(meals.map(x=>x.cuisine)))];
 const badges=(m:typeof meals[number])=>[...m.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...m.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean) as string[];
 const visible=useMemo(()=>meals.filter(m=>(filter==="all"||m.cuisine===filter)&&(`${m.title} ${m.subtitle} ${m.cuisine}`).toLowerCase().includes(query.toLowerCase())),[query,filter]);
 const favourites=meals.filter(m=>{const r=h.ratings[m.id];return (r?.josh??0)>=4||(r?.g??0)>=4}).slice(0,6);
 const quick=meals.filter(m=>m.minutes<=25).slice(0,8);
 const recent=h.history.map(x=>meals.find(m=>m.id===x.mealId)).filter(Boolean).slice(0,6) as typeof meals;
 const Card=({m,small=false}:{m:typeof meals[number];small?:boolean})=><Link href={`/cook/${m.id}`} className={`hm-cook-card-v3 ${small?"small":""}`}>{m.image?<img src={m.image} alt={m.title}/>:<div className="placeholder">{m.title[0]}</div>}<div className="shade"/><div className="copy"><div className="tags">{badges(m).slice(0,3).map(x=><b key={x}>{x}</b>)}{m.status==="placeholder"&&<em>test</em>}</div><h3>{m.title}</h3><p>{m.minutes} min · {m.cuisine}</p>{h.ratings[m.id]&&(h.ratings[m.id].josh||h.ratings[m.id].g)&&<span>J {h.ratings[m.id].josh??"—"}★ · G {h.ratings[m.id].g??"—"}★</span>}</div></Link>;
 return <div className="hm-screen hm-cook-screen hm-v3-screen">
  <header className="hm-mobile-head"><div><span>COOK</span><h1>Our recipes.</h1><p>The ones we keep, test, change and make again.</p></div><Link href="/cook/builder" className="hm-scan-head">✦</Link></header>

  <section className="hm-cook-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search our recipes…"/><Link href="/cook/builder">From what we have ›</Link></section>

  {!query&&filter==="all"&&<>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>QUICK TONIGHT</span><h2>25 minutes or less</h2></div></div><div className="hm-cook-rail">{quick.map(m=><Card key={m.id} m={m} small/>)}</div></section>
   <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>{favourites.length?"FAVOURITES":"START HERE"}</span><h2>{favourites.length?"We'd make these again":"Good first-week recipes"}</h2></div></div><div className="hm-cook-grid-featured">{(favourites.length?favourites:meals.slice(0,4)).map(m=><Card key={m.id} m={m}/>)}</div></section>
   {recent.length>0&&<section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>RECENTLY COOKED</span><h2>What we've actually made</h2></div></div><div className="hm-cook-rail">{recent.map(m=><Card key={m.id} m={m} small/>)}</div></section>}
  </>}

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>RECIPE LIBRARY</span><h2>{visible.length} recipes</h2></div><small>living cookbook</small></div><div className="hm-cuisine-pills">{cuisines.map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x==="all"?"All":x}</button>)}</div><div className="hm-recipe-list-v3">{visible.map(m=><Link href={`/cook/${m.id}`} key={m.id}>{m.image?<img src={m.image} alt=""/>:<div className="placeholder">{m.title[0]}</div>}<div><div className="hm-code-row">{badges(m).slice(0,4).map(x=><b key={x}>{x}</b>)}{m.status==="placeholder"&&<em>test</em>}</div><strong>{m.title}</strong><small>{m.minutes} min · {m.method} · {m.cuisine}</small></div><b>›</b></Link>)}</div></section>
 </div>
}
