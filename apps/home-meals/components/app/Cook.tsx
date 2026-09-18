"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {canonicalPrepComponentsV2} from "@/data/food-truth-v2";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {recipeSupportedByActivePrepV7} from "@/data/prep-repertoire-v7";
import {mealHistorySummaryV7,recentPenaltyV7} from "@/data/meal-history-v7";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {kcalReferenceForV3,type MealWeightV3} from "@/data/recipe-kcal-reference-v3";
import {feedback} from "@/lib/feedback";
import {DraftRecipeShelf} from "../DraftRecipeShelf";
import {Orb} from "./Orb";
import {useReadiness} from "./Primitives";

const PAGE=12;
type Mode="For us"|"All"|"Cuisine"|"Meal weight"|"By prep"|"Recent"|"Not lately"|"Never cooked"|"Favourites"|"Quick"|"Ready now";
const modes:Mode[]=["For us","Cuisine","Meal weight","By prep","Recent","Not lately","Never cooked","Favourites","Quick","Ready now","All"];
const weights:readonly {id:MealWeightV3;label:string}[]=[{id:"light",label:"Light"},{id:"balanced",label:"Balanced"},{id:"hearty",label:"Hearty"},{id:"rich",label:"Rich"}];

export function Cook(){
 const h=useHousehold(),ready=useReadiness();
 const[q,setQ]=useState(""),[mode,setMode]=useState<Mode>("For us"),[sub,setSub]=useState(""),[showAll,setShowAll]=useState(false);
 const history=useMemo(()=>mealHistorySummaryV7({history:h.history,favourites:h.favourites,ratings:h.ratings}),[h.history,h.favourites,h.ratings]);
 const cuisines=useMemo(()=>Array.from(new Set(recipes.map(x=>x.cuisine))).sort(),[]);
 const usedPrep=useMemo(()=>canonicalPrepComponentsV2.filter(c=>recipes.some(r=>prepForRecipeAtCookScaleV7(r.id).some(x=>x.componentId===c.id))).sort((a,b)=>Number(h.activePrepIds.includes(b.id))-Number(h.activePrepIds.includes(a.id))||a.tier.localeCompare(b.tier)||a.code.localeCompare(b.code)),[h.activePrepIds]);
 const score=(r:typeof recipes[number])=>{const rd=ready(r),rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0),fav=!!h.favourites[r.id],activeFit=h.activePrepIds.length?recipeSupportedByActivePrepV7(r.id,h.activePrepIds):false;return recentPenaltyV7(r.id,h.history)+Number(rd.state!=="ready")*8-Number(activeFit)*10-Number(fav)*8-rating*2+r.minutes*.08};
 const list=useMemo(()=>recipes.filter(r=>{const energy=kcalReferenceForV3(r.id);if(q&&!(`${recipeTitle(r.id,r.title)} ${recipeSubtitle(r.id,r.subtitle)} ${r.title} ${r.cuisine} ${r.tags.join(" ")} ${energy?.mealWeight??""}`).toLowerCase().includes(q.toLowerCase()))return false;const hx=history.recipes[r.id];if(mode==="Cuisine")return !sub||r.cuisine===sub;if(mode==="Meal weight")return !sub||energy?.mealWeight===sub;if(mode==="By prep")return !sub||prepForRecipeAtCookScaleV7(r.id).some(x=>x.componentId===sub);if(mode==="Recent")return hx.daysSince!=null&&hx.daysSince<14;if(mode==="Not lately")return hx.daysSince!=null&&hx.daysSince>=28;if(mode==="Never cooked")return hx.neverCooked;if(mode==="Favourites")return !!h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4;if(mode==="Quick")return r.minutes<=25;if(mode==="Ready now")return ready(r).state==="ready";return true}).sort((a,b)=>mode==="Recent"?(history.recipes[a.id].daysSince??9999)-(history.recipes[b.id].daysSince??9999):mode==="Not lately"?(history.recipes[b.id].daysSince??0)-(history.recipes[a.id].daysSince??0):mode==="For us"?score(a)-score(b):Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||recipeTitle(a.id,a.title).localeCompare(recipeTitle(b.id,b.title))),[q,mode,sub,history,h.favourites,h.ratings,h.activePrepIds,h.componentStock,h.ingredientStock,h.kitchenReady]);
 const shown=showAll||q?list:list.slice(0,PAGE),pick=(m:Mode)=>{setMode(m);setSub("");setShowAll(false);feedback("tap")},openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 const secondary=mode==="Cuisine"?cuisines.map(x=>({id:x,label:x})):mode==="Meal weight"?weights:mode==="By prep"?usedPrep.map(x=>({id:x.id,label:`${x.code}${h.activePrepIds.includes(x.id)?" · ours":""}`})):[];
 return <div className="hm-screen">
  <div className="hm-cook-head"><h1 className="hm-h1">Our recipes</h1><Link href="/history" className="hm-note">History ›</Link></div>
  <label className="hm-search"><input value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}} placeholder="Search or say “something with prawns”" aria-label="Search recipes"/>{q?<button type="button" className="clear" aria-label="Clear search" onClick={()=>{setQ("");feedback("tap")}}>×</button>:<button type="button" onClick={openAsk} aria-label="Ask Josh" style={{display:"grid",placeItems:"center"}}><Orb size={40}/></button>}</label>
  <DraftRecipeShelf/>
  <div className="hm-chips" style={{marginTop:14}} aria-label="Browse recipes">{modes.map(m=><button key={m} className={`hm-chip ${mode===m?"on":""}`} aria-pressed={mode===m} onClick={()=>pick(m)}>{m}</button>)}</div>
  {secondary.length>0&&<div className="hm-chips" style={{marginTop:10}} aria-label={mode}>{secondary.map(x=><button key={x.id} className={`hm-chip ${sub===x.id?"on":""}`} aria-pressed={sub===x.id} onClick={()=>{setSub(v=>v===x.id?"":x.id);setShowAll(false);feedback("tap")}}>{x.label}</button>)}</div>}
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}><span className="hm-note">{list.length} {list.length===1?"dish":"dishes"}</span>{mode==="For us"&&<span className="hm-note">ratings · our prep · what we had lately</span>}</div>
  {shown.length?<div className="hm-cook-grid">{shown.map((r,i)=>{const title=recipeTitle(r.id,r.title),rd=ready(r),fav=!!h.favourites[r.id],hx=history.recipes[r.id],prepFit=h.activePrepIds.length&&recipeSupportedByActivePrepV7(r.id,h.activePrepIds),energy=kcalReferenceForV3(r.id);let meta=r.cuisine;if(mode==="Meal weight"&&energy)meta=`${energy.mealWeight} · ~${energy.kcalPerPerson} kcal/person`;else if(mode==="Recent"&&hx.daysSince!=null)meta=hx.daysSince===0?"Today":hx.daysSince===1?"Yesterday":`${hx.daysSince} days ago`;else if(mode==="Not lately"&&hx.daysSince!=null)meta=`${hx.daysSince} days since last`;else if(mode==="Never cooked")meta="Never cooked";else if(prepFit)meta=`${r.cuisine} · fits our prep`;return <Link key={r.id} href={`/cook/${r.id}`} className={`hm-cook-card ${i%3===0?"tall":""}`} style={{animationDelay:`${Math.min(i,8)*35}ms`}} onClick={()=>feedback("tap")}><div className="photo">{r.image&&<img src={r.image} alt={title} loading={i<4?"eager":"lazy"} decoding="async"/>}<span className={`fav ${fav?"on":""}`} aria-hidden="true">♥</span><span className="min">{r.minutes} min</span></div><div className="body"><strong>{title}</strong><small>{meta}</small><span className={`hm-pill ${rd.pillClass}`}><i/>{rd.label}</span></div></Link>})}</div>:<div className="hm-state" style={{minHeight:"auto",padding:"40px 0 20px"}}><div className="center"><Orb size={96}/><h1>Nothing in that view yet.</h1><p>Try another cuisine, prep item or history view, or ask Josh.</p><button className="hm-btn primary sm" onClick={openAsk}>Ask Josh</button></div></div>}
  {!showAll&&!q&&list.length>PAGE&&<button className="hm-cook-more" onClick={()=>{setShowAll(true);feedback("tap")}}>Show all {list.length}</button>}
 </div>;
}
