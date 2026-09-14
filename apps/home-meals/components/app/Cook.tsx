"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {recipes} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";
import {Orb} from "./Orb";
import {useReadiness} from "./Primitives";

const PAGE=12;
export function Cook(){
 const h=useHousehold();const ready=useReadiness();
 const[q,setQ]=useState("");const[filter,setFilter]=useState("All");const[showAll,setShowAll]=useState(false);
 const cuisines=useMemo(()=>Array.from(new Set(recipes.map(x=>x.cuisine))).sort(),[]);
 const filters=["All","Quick","Favourites","Ready now",...cuisines];
 const cookedIds=useMemo(()=>new Set(h.history.map(x=>x.mealId)),[h.history]);
 const list=useMemo(()=>recipes.filter(r=>{if(q&&!(`${recipeTitle(r.id,r.title)} ${recipeSubtitle(r.id,r.subtitle)} ${r.title} ${r.cuisine} ${r.tags.join(" ")}`).toLowerCase().includes(q.toLowerCase()))return false;if(filter==="Quick")return r.minutes<=25;if(filter==="Favourites")return !!h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4;if(filter==="Ready now")return ready(r).state==="ready";if(filter!=="All")return r.cuisine===filter;return true}).sort((a,b)=>Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||Number(cookedIds.has(b.id))-Number(cookedIds.has(a.id))||0),[q,filter,h.favourites,h.ratings,cookedIds,ready]);
 const shown=showAll||q?list:list.slice(0,PAGE);const pick=(f:string)=>{setFilter(f);setShowAll(false);feedback("tap")};const openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 return <div className="hm-screen"><div className="hm-cook-head"><h1 className="hm-h1">Our recipes</h1><span className="hm-note">{list.length} dishes</span></div><label className="hm-search"><input value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}} placeholder="Search or say “something with prawns”" aria-label="Search recipes"/>{q?<button type="button" className="clear" aria-label="Clear search" onClick={()=>{setQ("");feedback("tap")}}>×</button>:<button type="button" onClick={openAsk} aria-label="Ask Home" style={{display:"grid",placeItems:"center"}}><Orb size={40}/></button>}</label><div className="hm-chips" style={{marginTop:14}} aria-label="Filter recipes">{filters.map(f=><button key={f} className={`hm-chip ${filter===f?"on":""}`} aria-pressed={filter===f} onClick={()=>pick(f)}>{f}</button>)}</div>{shown.length?<div className="hm-cook-grid">{shown.map((r,i)=>{const title=recipeTitle(r.id,r.title),rd=ready(r),fav=!!h.favourites[r.id];return <Link key={r.id} href={`/cook/${r.id}`} className={`hm-cook-card ${i%3===0?"tall":""}`} style={{animationDelay:`${Math.min(i,8)*35}ms`}} onClick={()=>feedback("tap")}><div className="photo">{r.image&&<img src={r.image} alt={title} loading={i<4?"eager":"lazy"} decoding="async"/>}<span className={`fav ${fav?"on":""}`} aria-hidden="true">♥</span><span className="min">{r.minutes} min</span></div><div className="body"><strong>{title}</strong><small>{r.cuisine}</small><span className={`hm-pill ${rd.pillClass}`}><i/>{rd.label}</span></div></Link>})}</div>:<div className="hm-state" style={{minHeight:"auto",padding:"40px 0 20px"}}><div className="center"><Orb size={96}/><h1>Nothing called that yet.</h1><p>Try another dish, or ask Home to find something close.</p><button className="hm-btn primary sm" onClick={openAsk}>Ask Home</button></div><div className="foot">Or try a shorter word</div></div>}{!showAll&&!q&&list.length>PAGE&&<button className="hm-cook-more" onClick={()=>{setShowAll(true);feedback("tap")}}>Show all {list.length}</button>}</div>;
}
