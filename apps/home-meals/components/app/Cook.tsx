"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {recipes} from "@/data/home-data";
import {feedback} from "@/lib/feedback";
import {MealCard,PageHead,SectionHead} from "./Primitives";

export function Cook(){
 const h=useHousehold();const[q,setQ]=useState("");const[cuisine,setCuisine]=useState("All");const[showAll,setShowAll]=useState(false);
 const cuisines=["All",...Array.from(new Set(recipes.map(x=>x.cuisine))).sort()];
 const cookedIds=new Set(h.history.map(x=>x.mealId));
 const favourites=recipes.filter(r=>h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4);
 const recent=h.history.map(x=>recipes.find(r=>r.id===x.mealId)).filter(Boolean).filter((r,i,a)=>a.findIndex(x=>x?.id===r?.id)===i).slice(0,8) as typeof recipes;
 const quick=recipes.filter(r=>r.minutes<=25).slice(0,10);
 const newToUs=recipes.filter(r=>!cookedIds.has(r.id)).slice(0,8);
 const visible=useMemo(()=>recipes.filter(r=>(cuisine==="All"||r.cuisine===cuisine)&&(`${r.title} ${r.cuisine} ${r.subtitle}`).toLowerCase().includes(q.toLowerCase())),[q,cuisine]);
 const searching=!!q||cuisine!=="All";const library=searching||showAll?visible:visible.slice(0,12);
 return <div className="hm-page-v5 hm-cook-v5">
  <PageHead eyebrow="COOK" title="Our recipes" sub="The ones we cook, keep and change." action={<Link className="hm-round-link-v5" href="/cook/builder" aria-label="From what we have">✦</Link>}/>
  <div className="hm-search-row-v5"><label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}} placeholder="Search recipes"/></label><Link href="/cook/builder">From what we have</Link></div>
  {!q&&cuisine==="All"&&<>
   {favourites.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="FAVOURITES" title="We’d make these again"/><div className="hm-meal-rail-v5">{favourites.slice(0,8).map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>}
   <section className="hm-block-v5"><SectionHead eyebrow="QUICK" title="25 minutes or less"/><div className="hm-meal-rail-v5">{quick.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>
   {recent.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="RECENT" title="Made lately"/><div className="hm-meal-rail-v5">{recent.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>}
   <section className="hm-block-v5"><SectionHead eyebrow="NEW TO US" title="Worth trying"/><div className="hm-meal-rail-v5">{newToUs.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>
  </>}
  <section className="hm-block-v5 hm-library-v5"><SectionHead eyebrow="ALL RECIPES" title={`${visible.length} recipes`}/><div className="hm-filter-rail-v5">{cuisines.map(c=><button key={c} className={cuisine===c?"active":""} onClick={()=>{setCuisine(c);setShowAll(false);feedback("tap")}}>{c}</button>)}</div><div className="hm-recipe-list-v5">{library.map(r=><MealCard recipe={r} key={r.id}/>)}</div>{!searching&&visible.length>12&&<button className="hm-secondary-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${visible.length}`}</button>}</section>
 </div>
}
