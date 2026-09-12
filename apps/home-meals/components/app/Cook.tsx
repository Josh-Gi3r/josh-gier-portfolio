"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {recipes} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";
import {MealCard,PageHead,SectionHead} from "./Primitives";

type View="ours"|"all";
export function Cook(){
 const h=useHousehold();const[q,setQ]=useState("");const[cuisine,setCuisine]=useState("All");const[showAll,setShowAll]=useState(false);const[view,setView]=useState<View>("ours");
 const cuisines=["All",...Array.from(new Set(recipes.map(x=>x.cuisine))).sort()];
 const cookedIds=new Set(h.history.map(x=>x.mealId));
 const favourites=recipes.filter(r=>h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4);
 const recent=h.history.map(x=>recipes.find(r=>r.id===x.mealId)).filter(Boolean).filter((r,i,a)=>a.findIndex(x=>x?.id===r?.id)===i).slice(0,8) as typeof recipes;
 const quick=recipes.filter(r=>r.minutes<=25).slice(0,10);
 const newToUs=recipes.filter(r=>!cookedIds.has(r.id)).slice(0,8);
 const visible=useMemo(()=>recipes.filter(r=>(cuisine==="All"||r.cuisine===cuisine)&&(`${recipeTitle(r.id,r.title)} ${recipeSubtitle(r.id,r.subtitle)} ${r.title} ${r.cuisine}`).toLowerCase().includes(q.toLowerCase())),[q,cuisine]);
 const searching=!!q||cuisine!=="All";const library=searching||showAll?visible:visible.slice(0,8);
 const clearSearch=()=>{setQ("");setCuisine("All");setShowAll(false);feedback("tap")};
 const chooseView=(next:View)=>{setView(next);setShowAll(false);if(next==="ours"){setQ("");setCuisine("All")}feedback("tap")};
 return <div className="hm-page-v5 hm-cook-v5">
  <PageHead eyebrow="COOK" title="Our recipes" sub="The ones we cook, keep and change." action={<Link className="hm-round-link-v5" href="/cook/builder" aria-label="From what we have">✦</Link>}/>
  <div className="hm-search-row-v5"><label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>{setQ(e.target.value);setView("all");setShowAll(false)}} placeholder="Search recipes" aria-label="Search recipes"/></label><Link href="/cook/builder">From what we have</Link></div>
  {!q&&<div className="hm-segment-v5 hm-cook-tabs-v5"><button className={view==="ours"?"active":""} onClick={()=>chooseView("ours")}>For us</button><button className={view==="all"?"active":""} onClick={()=>chooseView("all")}>All {recipes.length}</button></div>}
  {view==="ours"&&!q?<>
   {favourites.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="FAVOURITES" title="We’d make these again"/><div className="hm-meal-rail-v5">{favourites.slice(0,8).map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>}
   <section className="hm-block-v5"><SectionHead eyebrow="QUICK" title="25 minutes or less"/><div className="hm-meal-rail-v5">{quick.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>
   {recent.length>0&&<section className="hm-block-v5"><SectionHead eyebrow="RECENT" title="Made lately"/><div className="hm-meal-rail-v5">{recent.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>}
   <section className="hm-block-v5"><SectionHead eyebrow="TRY NEXT" title="Not cooked yet" action={<button onClick={()=>chooseView("all")}>All recipes</button>}/><div className="hm-meal-rail-v5">{newToUs.map(r=><MealCard recipe={r} key={r.id} compact/>)}</div></section>
  </>:<section className="hm-block-v5 hm-library-v5"><SectionHead eyebrow="ALL RECIPES" title={`${visible.length} ${visible.length===1?"recipe":"recipes"}`}/><div className="hm-filter-rail-v5">{cuisines.map(c=><button key={c} className={cuisine===c?"active":""} onClick={()=>{setCuisine(c);setShowAll(false);feedback("tap")}}>{c}</button>)}</div>{library.length?<div className="hm-recipe-list-v5">{library.map(r=><MealCard recipe={r} key={r.id}/>)}</div>:<div className="hm-empty-v5"><strong>No recipes match that.</strong><p>Try another dish or cuisine.</p><button className="hm-text-button-v5" onClick={clearSearch}>Clear search</button></div>}{!searching&&visible.length>8&&<button className="hm-secondary-button-v5" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${visible.length}`}</button>}</section>}
 </div>
}