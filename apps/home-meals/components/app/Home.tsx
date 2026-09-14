"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe,motherBases,recipes} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {recipeAvailability,stockPortions} from "@/data/stock-math";
import {feedback} from "@/lib/feedback";
import {toneFor} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Orb} from "./Orb";
import {Avatar,mealMeta,MealTile,SectionHead,useReadiness} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SEEN_KEY="home-meals-welcome-seen-v1";
function partOfDay(){const hour=new Date().getHours();return hour<12?"morning":hour<17?"afternoon":"evening"}

export function Home(){
 const h=useHousehold();const ready=useReadiness();
 const day=(new Date().getDay()+6)%7;
 const[idx,setIdx]=useState(0);const[welcomeSeen,setWelcomeSeen]=useState(true);
 useEffect(()=>{try{setWelcomeSeen(localStorage.getItem(SEEN_KEY)==="1")}catch{setWelcomeSeen(true)}},[]);
 const dismissWelcome=()=>{try{localStorage.setItem(SEEN_KEY,"1")}catch{}setWelcomeSeen(true)};
 // Tonight's stack: the planned dinner first, then everything the kitchen can cover right now.
 const stack=useMemo(()=>{const planned=getRecipe(h.week[day]??h.week[0]);const rest=recipes.filter(r=>r.id!==planned.id&&(!h.kitchenReady||recipeAvailability(r.id,h.componentStock,h.ingredientStock).ready)).sort((a,b)=>Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||Math.max(h.ratings[b.id]?.josh??0,h.ratings[b.id]?.g??0)-Math.max(h.ratings[a.id]?.josh??0,h.ratings[a.id]?.g??0)||a.minutes-b.minutes);return [planned,...rest]},[h.week,day,h.kitchenReady,h.componentStock,h.ingredientStock,h.favourites,h.ratings]);
 useEffect(()=>{setIdx(0)},[h.week]);
 const tonight=stack[idx%stack.length];const tonightTitle=recipeTitle(tonight.id,tonight.title);const tonightReady=ready(tonight);
 const cookHref=tonightReady.state==="ready"?`/cook/${tonight.id}/cook`:`/cook/${tonight.id}`;
 const notTonight=()=>{setIdx(i=>i+1);feedback("change")};
 const touch=useRef<{x:number;y:number}|null>(null);
 const onTouchStart=(e:React.TouchEvent)=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}};
 const onTouchEnd=(e:React.TouchEvent)=>{const s=touch.current;touch.current=null;if(!s)return;const dx=e.changedTouches[0].clientX-s.x,dy=e.changedTouches[0].clientY-s.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)notTonight()};

 // Pulse numbers straight from household state.
 const soonIds=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0);
 const pucks=motherBases.reduce((n,m)=>n+stockPortions(m.id,h.componentStock),0);
 const stockedMothers=motherBases.filter(m=>(h.componentStock[m.id]??0)>0).length;
 const lowMother=motherBases.find(m=>h.week.some(id=>getRecipe(id).motherIds.includes(m.id))&&stockPortions(m.id,h.componentStock)<2);
 const last=h.history[0]?getRecipe(h.history[0].mealId):null;const lastPhoto=last?h.mealPhotos.find(x=>x.mealId===last.id):undefined;

 const says=(()=>{
  if(!h.kitchenReady)return {text:<>I don’t know the kitchen yet. Show me the fridge and freezer once and tonight, shopping and prep all get real.</>,actions:<><Link className="primary" href="/kitchen">Check the kitchen</Link><Link className="ghost" href="/scan?mode=Fridge&back=%2F">Use the camera</Link></>};
  if(idx>0)return {text:<>Okay, not that one. Here’s the next from what we have — {tonight.minutes} minutes{tonightReady.state==="ready"?", nothing to buy.":"."}</>};
  if(tonightReady.state==="ready")return {text:<>Tonight looks like <b>{tonightTitle}</b> — {tonight.minutes} minutes, everything’s here. Not feeling it? Say so and I’ll pull the next idea.</>};
  const a=recipeAvailability(tonight.id,h.componentStock,h.ingredientStock);const missing=[...a.missingIngredients.map(x=>getIngredient(x.id)?.name),...a.missingPrep.map(x=>getComponent(x.id)?.code)].filter(Boolean).slice(0,3).join(", ");
  return {text:<>Tonight is <b>{tonightTitle}</b>, but we’re short {missing||"a few things"}. Swap it, or pick one from what we have.</>,actions:<><Link className="primary" href="/plan">Swap it</Link><button className="ghost" onClick={notTonight}>Show me what we have</button></>};
 })();

 if(!welcomeSeen&&!h.kitchenReady&&h.history.length===0)return <div className="hm-screen hm-home-empty">
  <header className="hm-home-head"><h1 className="hm-h1">Hey Josh &amp; G</h1></header>
  <div className="stage"><Orb size={140} label="Home"/></div>
  <div className="copy"><h2>Let’s start with what’s in the kitchen.</h2><p className="hm-lead">Show me the fridge and freezer once, and everything else — the week, shopping, prep — gets real.</p></div>
  <div className="acts"><Link className="hm-btn primary" href="/scan?mode=Fridge&back=%2Fkitchen" onClick={dismissWelcome}>Show Home the fridge</Link><Link className="hm-btn ghost" href="/plan" onClick={dismissWelcome}>Pick this week’s dinners first</Link></div>
  <button className="foot" onClick={()=>{dismissWelcome();window.dispatchEvent(new Event("home-meals:ask"))}}>Or just say “what’s for dinner?”</button>
 </div>;

 return <div className="hm-screen">
  <header className="hm-home-head">
   <div><div className="hm-eyebrow">{longDays[day]} {partOfDay()}</div><h1 className="hm-h1">Hey Josh &amp; G</h1></div>
   <Link href="/learn" className="hm-us" aria-label="Household"><Avatar who="josh"/><Avatar who="g"/></Link>
  </header>
  <HomeSays actions={says.actions}>{says.text}</HomeSays>

  <section className="hm-tonight" aria-label="Tonight">
   <div className="under"/>
   <div className="card" key={tonight.id} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    {tonight.image&&<img src={tonight.image} alt={tonightTitle} width={780} height={872} loading="eager" fetchPriority="high" decoding="async"/>}
    <div className="shade"/>
    <div className="tags"><span className="hm-pill white">{idx===0?"TONIGHT":"INSTEAD"}</span><span className="hm-pill onphoto">{mealMeta(tonight)}</span></div>
    <div className="copy">
     <h2>{tonightTitle}</h2>
     <p>{recipeSubtitle(tonight.id,tonight.subtitle)}</p>
     <div className="prep">
      {tonight.prep.map(p=>{const c=getComponent(p.id);return c?<span key={p.id} style={{"--tone":toneFor(p.id)} as CSSProperties}><i/>{c.code}</span>:null})}
      <span className={`stock ${tonightReady.state==="missing"?"missing":""}`}>{tonightReady.label}</span>
     </div>
     <div className="actions">
      <button className="hm-btn glass" onClick={notTonight}>Not tonight</button>
      <Link className="hm-btn light" href={cookHref} onClick={()=>feedback("tap")}>{tonightReady.state==="ready"?"Cook it →":"Open recipe →"}</Link>
     </div>
    </div>
   </div>
   <div className="swipe">Swipe · {Math.max(0,stack.length-1-(idx%stack.length))} more ideas from what we have</div>
  </section>

  <SectionHead title="This week" action={<Link href="/plan">Plan ›</Link>}/>
  <div className="hm-rail week" aria-label="This week's dinners">
   {h.week.map((id,i)=><MealTile key={`${id}-${i}`} recipe={getRecipe(id)} badge={days[i]} badgeClass={i===day?"today":""}/>)}
  </div>

  <div className="hm-pulse" aria-label="Kitchen pulse">
   <Link href="/kitchen" style={{"--accent":"var(--peach-text)","--tint-grad":"linear-gradient(180deg,#fff,#fff1ea)"} as CSSProperties}><span>Fridge</span><b>{h.kitchenReady?soonIds.length:"—"}</b><small>{h.kitchenReady?(soonIds.length?"use soon":"nothing urgent"):"not checked"}</small></Link>
   <Link href="/kitchen"><span>Freezer</span><b>{h.kitchenReady?pucks:"—"}</b><small>{h.kitchenReady?(lowMother?`portions · ${lowMother.code} low`:`portions · ${stockedMothers}/${motherBases.length} bases`):"not checked"}</small></Link>
   <Link href="/plan"><span>To buy</span><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>{h.kitchenReady?"for the week":"check kitchen"}</small></Link>
  </div>

  {last&&<Link href={`/cook/${last.id}`} className="hm-card hm-memory hm-lift">
   {(lastPhoto?.dataUrl||last.image)&&<img src={lastPhoto?.dataUrl??last.image} alt={recipeTitle(last.id,last.title)} loading="lazy"/>}
   <div><span className="kick">LAST COOKED{lastPhoto?" · OUR PHOTO":""}</span><strong>{recipeTitle(last.id,last.title)}</strong><small>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}{h.recipeNotes[last.id]?.[0]?` · “${h.recipeNotes[last.id][0].text}”`:""}</small></div>
   <span className="arrow">›</span>
  </Link>}
 </div>;
}
