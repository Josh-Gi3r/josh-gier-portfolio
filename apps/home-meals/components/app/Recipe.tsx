"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe} from "@/data/home-data";
import {feedback} from "@/lib/feedback";
import {Back,ComponentPill,formatQty,RecipeReady} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function Recipe({id}:{id:string}){
 const h=useHousehold();const r=getRecipe(id);const[chooseDay,setChooseDay]=useState(false);const[note,setNote]=useState(h.ratings[id]?.note??"");const[saved,setSaved]=useState(false);
 const cooked=h.history.filter(x=>x.mealId===id);const lastNote=h.recipeNotes[id]?.[0];const rating=h.ratings[id]??{};const favourite=!!h.favourites[id];
 const events=useMemo(()=>[...cooked.map(x=>({at:x.at,label:"Cooked",detail:"Dinner logged"})),...(h.recipeNotes[id]??[]).map(x=>({at:x.at,label:x.author==="josh"?"Josh note":x.author==="g"?"G note":"Our note",detail:x.text}))].sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime()).slice(0,5),[cooked,h.recipeNotes,id]);
 const saveNote=()=>{h.noteMeal(id,note,"home");setSaved(true);feedback("success");setTimeout(()=>setSaved(false),1400)};
 return <div className="hm-page-v5 hm-recipe-v5">
  <div className="hm-recipe-top-v5"><Back href="/cook" label="Recipes"/><button className={`hm-favourite-v5 ${favourite?"on":""}`} aria-label={favourite?"Remove from favourites":"Add to favourites"} onClick={()=>{h.toggleFavourite(id);feedback("change")}}>{favourite?"♥":"♡"}</button></div>
  <section className="hm-recipe-hero-v5">{r.image?<img src={r.image} alt=""/>:<div className="hm-photo-placeholder-v5">{r.title[0]}</div>}<div className="hm-recipe-hero-shade-v5"/><div className="hm-recipe-hero-copy-v5"><div><span>{r.cuisine}</span><RecipeReady recipe={r}/></div><h1>{r.title}</h1><p>{r.subtitle}</p><small>{r.minutes} min · {r.method} · serves 2</small></div></section>
  <div className="hm-sticky-actions-v5"><Link href={`/cook/${r.id}/cook`} onClick={()=>feedback("tap")}>Cook</Link><button onClick={()=>{setChooseDay(true);feedback("tap")}}>Add to week</button></div>
  {(cooked.length>0||lastNote||favourite)&&<section className="hm-our-note-v5"><span>OUR VERSION</span><div className="hm-couple-rating-v5"><b>J</b><strong>{rating.josh?`${rating.josh}★`:"—"}</strong><b>G</b><strong>{rating.g?`${rating.g}★`:"—"}</strong>{favourite&&<em>♥ Favourite</em>}</div>{lastNote&&<p>“{lastNote.text}”</p>}<small>{cooked.length?`Cooked ${cooked.length} ${cooked.length===1?"time":"times"}`:"Not cooked yet"}</small></section>}
  <section className="hm-recipe-section-v5"><h2>What we need</h2><div className="hm-ingredient-list-v5">{r.ingredients.map(x=>{const d=getIngredient(x.id);return <div key={`${x.id}-${x.raw}`}><span>{d?.name??x.id}</span><strong>{formatQty(x.qty,x.unit)}</strong></div>})}</div></section>
  {r.prep.length>0&&<section className="hm-recipe-section-v5"><h2>From prep</h2><div className="hm-prep-list-v5">{r.prep.map(x=>{const have=h.componentStock[x.id]??0;return <div key={x.id}><ComponentPill id={x.id} amountMl={x.totalMl}/><span className={h.kitchenReady&&have>=x.totalMl?"ok":"need"}>{h.kitchenReady?have>=x.totalMl?"have it":`${Math.max(0,x.totalMl-have)} ml short`:"not checked"}</span></div>})}</div></section>}
  <section className="hm-recipe-section-v5"><h2>Method</h2><ol className="hm-step-list-v5">{r.steps.map((s,i)=><li key={s}><b>{i+1}</b><p>{s}</p></li>)}</ol></section>
  <section className="hm-recipe-section-v5 hm-why-v5"><details><summary>Why this recipe is here</summary><p>{r.why}</p><p>{r.balance}</p></details><a href={r.source.url} target="_blank" rel="noreferrer">Reference: {r.source.label} ↗</a></section>
  {events.length>0&&<section className="hm-recipe-history-v5"><header><span>OUR HISTORY</span><h2>How this one is changing</h2></header><div>{events.map((e,i)=><article key={`${e.at}-${i}`}><i/><span><strong>{e.label}</strong><p>{e.detail}</p><small>{new Date(e.at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}</small></span></article>)}</div></section>}
  <section className="hm-rate-v5"><div><span>AFTER DINNER</span><h2>How was it?</h2></div>{(["josh","g"] as const).map(who=><div className="hm-rate-person-v5" key={who}><strong>{who==="josh"?"Josh":"G"}</strong><div>{[1,2,3,4,5].map(n=><button key={n} className={(rating[who]??0)>=n?"on":""} aria-label={`${who} ${n} stars`} onClick={()=>{h.rateMeal(id,who,n);feedback("change")}}>★</button>)}</div></div>)}<label><span>Next time</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="More chilli? Less sweet? Different side?"/><button onClick={saveNote}>{saved?"Saved ✓":"Save note"}</button></label></section>
  {chooseDay&&<div className="hm-sheet-backdrop-v5" onMouseDown={e=>{if(e.target===e.currentTarget)setChooseDay(false)}}><section className="hm-sheet-v5"><div className="hm-sheet-handle-v5"/><header><div><span>ADD TO WEEK</span><h2>Which day?</h2></div><button className="hm-icon-button-v5" onClick={()=>setChooseDay(false)} aria-label="Close">×</button></header><div className="hm-day-picker-v5">{days.map((d,i)=><button key={d} onClick={()=>{h.setDay(i,id);setChooseDay(false);feedback("change")}}><span>{d}</span><strong>{getRecipe(h.week[i]).title}</strong></button>)}</div></section></div>}
 </div>
}
