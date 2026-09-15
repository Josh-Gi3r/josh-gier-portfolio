"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,motherBases} from "@/data/home-data";
import {allLiveRecipesV7 as recipes,getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {recipeSupportedByActivePrepV7} from "@/data/prep-repertoire-v7";
import {mealHistorySummaryV7,recentPenaltyV7} from "@/data/meal-history-v7";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {recipeAvailabilityV7,stockPortionsV7} from "@/data/stock-math-v7";
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
 const h=useHousehold(),ready=useReadiness(),day=(new Date().getDay()+6)%7,[idx,setIdx]=useState(0),[welcomeSeen,setWelcomeSeen]=useState(true);
 useEffect(()=>{try{setWelcomeSeen(localStorage.getItem(SEEN_KEY)==="1")}catch{setWelcomeSeen(true)}},[]);
 const dismissWelcome=()=>{try{localStorage.setItem(SEEN_KEY,"1")}catch{}setWelcomeSeen(true)};
 const history=useMemo(()=>mealHistorySummaryV7({history:h.history,favourites:h.favourites,ratings:h.ratings}),[h.history,h.favourites,h.ratings]);
 const displayWeek=h.weekStatus==="suggested"&&h.suggestedWeek?.length===7?h.suggestedWeek:h.week,confirmed=h.weekStatus==="confirmed";
 const stack=useMemo(()=>{
  const planned=getLiveRecipeV7(displayWeek[day]??displayWeek[0])??recipes[0];
  const rest=recipes.filter(r=>r.id!==planned.id&&(!h.kitchenReady||recipeAvailabilityV7(r.id,h.componentStock,h.ingredientStock).ready)).sort((a,b)=>{
   const aPrep=h.activePrepIds.length?recipeSupportedByActivePrepV7(a.id,h.activePrepIds):false,bPrep=h.activePrepIds.length?recipeSupportedByActivePrepV7(b.id,h.activePrepIds):false;
   const aRating=Math.max(h.ratings[a.id]?.josh??0,h.ratings[a.id]?.g??0),bRating=Math.max(h.ratings[b.id]?.josh??0,h.ratings[b.id]?.g??0);
   return Number(bPrep)-Number(aPrep)||recentPenaltyV7(a.id,h.history)-recentPenaltyV7(b.id,h.history)||Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||bRating-aRating||a.minutes-b.minutes;
  });
  return[planned,...rest]
 },[displayWeek,day,h.kitchenReady,h.componentStock,h.ingredientStock,h.favourites,h.ratings,h.history,h.activePrepIds]);
 useEffect(()=>{setIdx(0)},[displayWeek]);
 const tonight=stack[idx%stack.length],tonightTitle=recipeTitle(tonight.id,tonight.title),tonightReady=ready(tonight),tonightPrep=prepForRecipeAtCookScaleV7(tonight.id),tonightHistory=history.recipes[tonight.id],tonightActiveFit=!h.activePrepIds.length||recipeSupportedByActivePrepV7(tonight.id,h.activePrepIds);
 const cookHref=tonightReady.state==="ready"?`/cook/${tonight.id}/cook`:`/cook/${tonight.id}`,notTonight=()=>{setIdx(i=>i+1);feedback("change")};
 const touch=useRef<{x:number;y:number}|null>(null),onTouchStart=(e:React.TouchEvent)=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}},onTouchEnd=(e:React.TouchEvent)=>{const s=touch.current;touch.current=null;if(!s)return;const dx=e.changedTouches[0].clientX-s.x,dy=e.changedTouches[0].clientY-s.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)notTonight()};
 const soonIds=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0),coreMothers=motherBases.filter(m=>m.id!=="onion"),stockedMothers=coreMothers.filter(m=>(h.componentStock[m.id]??0)>0).length;
 const last=h.history[0]?getLiveRecipeV7(h.history[0].mealId):null,lastPhoto=last?h.mealPhotos.find(x=>x.mealId===last.id):undefined;
 const says=(()=>{
  if(!h.kitchenReady)return{text:<>I don’t know the kitchen yet. The meals below are a preview of what Home can do. Confirm what is actually here before we turn them into a plan.</>,actions:<Link className="primary" href="/kitchen">Set Kitchen truth</Link>};
  if(!confirmed&&h.weekStatus==="suggested")return{text:<>I built a <b>suggested week</b> around your choices. It is still a preview until you approve it.</>,actions:<Link className="primary" href="/plan">Review suggested week</Link>};
  if(!confirmed&&!h.activePrepIds.length)return{text:<>Kitchen is known. The meals below stay as a <b>preview</b>. Choose what prep you want to maintain, or plan around what you already have.</>,actions:<><Link className="primary" href="/prep">Choose our prep</Link><Link className="ghost" href="/plan">Build a week</Link></>};
  if(!confirmed)return{text:<>This is <b>a week Home could build</b>, not a commitment. Build around what you have, your active prep, both, or freely, then approve it.</>,actions:<Link className="primary" href="/plan">Build our week</Link>};
  if(idx>0){const ago=tonightHistory.daysSince;return{text:<>Okay, not that one. This fits {tonightActiveFit?"your active prep":"the recorded Kitchen"}{ago!=null?` and you last had it ${ago} ${ago===1?"day":"days"} ago`:" and you haven’t logged it before"}.</>};}
  if(tonightReady.state==="ready")return{text:<>Tonight looks like <b>{tonightTitle}</b> — {tonight.minutes} reference minutes, recorded Kitchen truth covers it{tonightActiveFit?", and it fits your active prep":""}{tonightHistory.daysSince!=null?`. Last cooked ${tonightHistory.daysSince} ${tonightHistory.daysSince===1?"day":"days"} ago.`:". It hasn’t been logged before."}</>};
  const a=recipeAvailabilityV7(tonight.id,h.componentStock,h.ingredientStock),missing=[...a.missingIngredients.map(x=>x.name),...a.missingPrep.map(x=>getComponent(x.id)?.code??x.id)].filter(Boolean).slice(0,3).join(", ");
  return{text:<>Tonight is <b>{tonightTitle}</b>, but we’re short {missing||"a few recorded things"}. Swap it, or pick one from what we have.</>,actions:<><Link className="primary" href="/plan">Swap it</Link><button className="ghost" onClick={notTonight}>Show me what we have</button></>};
 })();

 if(!welcomeSeen&&!h.kitchenReady&&h.history.length===0)return <div className="hm-screen hm-home-empty"><header className="hm-home-head"><h1 className="hm-h1">Hey Josh &amp; G</h1></header><div className="stage"><Orb size={140} label="Home"/></div><div className="copy"><h2>Start with what’s true.</h2><p className="hm-lead">If the kitchen is empty, say so once. If not, add what is actually here. Then Home can build the first shop and prep around reality.</p></div><div className="acts"><Link className="hm-btn primary" href="/kitchen" onClick={dismissWelcome}>Set up the Kitchen</Link><Link className="hm-btn ghost" href="/scan?mode=Fridge&back=%2Fkitchen" onClick={dismissWelcome}>Show Home</Link></div><button className="foot" onClick={()=>{dismissWelcome();window.dispatchEvent(new Event("home-meals:ask"))}}>Or just tell Home what’s true</button></div>;

 return <div className="hm-screen">
  <header className="hm-home-head"><div><div className="hm-eyebrow">{longDays[day]} {partOfDay()}</div><h1 className="hm-h1">Hey Josh &amp; G</h1></div><Link href="/learn" className="hm-us" aria-label="Household"><Avatar who="josh"/><Avatar who="g"/></Link></header>
  <HomeSays actions={says.actions}>{says.text}</HomeSays>
  <section className="hm-tonight" aria-label={confirmed?"Tonight":"Idea for tonight"}><div className="under"/><div className="card" key={tonight.id} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>{tonight.image&&<img src={tonight.image} alt={tonightTitle} width={780} height={872} loading="eager" fetchPriority="high" decoding="async"/>}<div className="shade"/><div className="tags"><span className="hm-pill white">{confirmed?(idx===0?"TONIGHT":"INSTEAD"):(idx===0?"IDEA FOR TONIGHT":"ANOTHER IDEA")}</span><span className="hm-pill onphoto">{mealMeta(tonight)}</span></div><div className="copy"><h2>{tonightTitle}</h2><p>{recipeSubtitle(tonight.id,tonight.subtitle)}</p><div className="prep">{tonightPrep.map(p=>{const c=getComponent(p.componentId);return c?<span key={p.componentId} style={{"--tone":toneFor(p.componentId)} as CSSProperties}><i/>{c.code}</span>:null})}<span className={`stock ${tonightReady.state==="missing"?"missing":""}`}>{tonightReady.label}</span></div><div className="actions"><button className="hm-btn glass" onClick={notTonight}>Not tonight</button><Link className="hm-btn light" href={cookHref} onClick={()=>feedback("tap")}>{tonightReady.state==="ready"?"Cook it →":"Open recipe →"}</Link></div></div></div><div className="swipe">Swipe · {Math.max(0,stack.length-1-(idx%stack.length))} more ideas from what we have</div></section>
  <SectionHead title={confirmed?"This week":"A week Home could build"} action={<Link href="/plan">Plan ›</Link>}/><div className="hm-rail week" aria-label={confirmed?"This week’s dinners":"Preview week"}>{displayWeek.map((id,i)=>{const recipe=getLiveRecipeV7(id);return recipe?<MealTile key={`${id}-${i}`} recipe={recipe} badge={days[i]} badgeClass={i===day?"today":""}/>:null})}</div>
  <div className="hm-pulse" aria-label="Household pulse"><Link href="/kitchen" style={{"--accent":"var(--peach-text)","--tint-grad":"linear-gradient(180deg,#fff,#fff1ea)"} as CSSProperties}><span>Fridge</span><b>{h.kitchenReady?soonIds.length:"—"}</b><small>{h.kitchenReady?(soonIds.length?"use soon":"nothing urgent"):"unknown"}</small></Link><Link href="/prep"><span>Our prep</span><b>{h.activePrepIds.length||"—"}</b><small>{h.activePrepIds.length?`${stockedMothers}/${coreMothers.length} core bases stocked`:"choose a repertoire"}</small></Link><Link href="/plan"><span>{confirmed?"To buy":"Preview gaps"}</span><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>{h.kitchenReady?(confirmed?"for the week":"not committed"):"set Kitchen truth"}</small></Link></div>
  {last&&<Link href="/history" className="hm-card hm-memory hm-lift">{(lastPhoto?.dataUrl||last.image)&&<img src={lastPhoto?.dataUrl??last.image} alt={recipeTitle(last.id,last.title)} loading="lazy"/>}<div><span className="kick">LAST COOKED{lastPhoto?" · OUR PHOTO":""}</span><strong>{recipeTitle(last.id,last.title)}</strong><small>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}{h.recipeNotes[last.id]?.[0]?` · “${h.recipeNotes[last.id][0].text}”`:""}</small></div><span className="arrow">›</span></Link>}
 </div>;
}
