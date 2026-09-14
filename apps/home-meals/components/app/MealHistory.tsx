"use client";
import Link from "next/link";
import {useMemo} from "react";
import {useHousehold} from "../HouseholdState";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {mealHistorySummaryV7} from "@/data/meal-history-v7";
import {recipeTitle} from "@/data/recipe-display";
import {RoundBack,SectionHead,Stat} from "./Primitives";

export function MealHistory(){
 const h=useHousehold();const summary=useMemo(()=>mealHistorySummaryV7({history:h.history,favourites:h.favourites,ratings:h.ratings}),[h.history,h.favourites,h.ratings]);
 const recent=h.history.slice(0,30),unique30=summary.recent30.length,topCuisine=summary.cuisines30[0];
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/cook" label="Back to recipes"/><h1 className="hm-h1">What we’ve eaten</h1></div>
  <p className="hm-lead hm-gut" style={{marginTop:10,fontSize:14}}>Home remembers what was cooked, when, and what Josh and G thought of it. This is what keeps suggestions from getting repetitive.</p>
  <div className="hm-stats"><Stat v={summary.totalCookEvents} k="dinners logged"/><Stat v={unique30} k="different in 30d" tint="var(--tint-peach)"/><Stat v={topCuisine?.cuisine??"—"} k={topCuisine?`${topCuisine.count} in 30d`:"top cuisine"} tint="var(--tint-sky)"/></div>
  {summary.cuisines30.length>0&&<><SectionHead title="Last 30 days" action={<span className="muted">cuisine mix</span>}/><div className="hm-chiplist">{summary.cuisines30.map(x=><span key={x.cuisine}>{x.cuisine} · {x.count}</span>)}</div></>}
  {summary.forgottenFavourites.length>0&&<><SectionHead title="Worth bringing back" action={<span className="muted">liked · not lately</span>}/><div className="hm-list tight">{summary.forgottenFavourites.slice(0,6).map(id=>{const r=getLiveRecipeV7(id),hx=summary.recipes[id],rating=h.ratings[id];if(!r)return null;return <Link key={id} href={`/cook/${id}`} className="hm-card hm-row hm-lift" style={{padding:"10px 14px 10px 10px"}}>{r.image?<img className="thumb" src={r.image} alt=""/>:<span className="thumb"/>}<span><strong>{recipeTitle(r.id,r.title)}</strong><small>{hx.daysSince==null?"Not cooked yet":`${hx.daysSince} days since last`} · Josh {rating?.josh??"—"}★ · G {rating?.g??"—"}★</small></span></Link>})}</div></>}
  <SectionHead title="Recent dinners" action={<span className="muted">newest first</span>}/>
  {recent.length?<div className="hm-list tight">{recent.map((event,i)=>{const r=getLiveRecipeV7(event.mealId),hx=summary.recipes[event.mealId];if(!r||!hx)return null;return <Link key={`${event.at}-${i}`} href={`/cook/${event.mealId}`} className="hm-card hm-row hm-lift" style={{padding:"10px 14px 10px 10px"}}>{r.image?<img className="thumb" src={r.image} alt=""/>:<span className="thumb"/>}<span><strong>{recipeTitle(r.id,r.title)}</strong><small>{new Date(event.at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:new Date(event.at).getFullYear()!==new Date().getFullYear()?"numeric":undefined})} · {r.cuisine} · cooked {hx.cookCount}× total</small></span></Link>})}</div>:<div className="hm-empty"><strong>No dinners logged yet.</strong>Finish a cooking session and it will appear here automatically.</div>}
 </div>;
}
