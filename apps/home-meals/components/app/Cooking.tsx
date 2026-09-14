"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";
import {getHouseholdPerson} from "@/lib/device-profile";
import {phaseFor,stepCue,stepMinutes} from "@/lib/steps";
import {portionWord,toneFor} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Orb} from "./Orb";
import {Avatar,formatQty} from "./Primitives";

type CookSession={step:number;timerEnd:number|null;timerDone:boolean;updatedAt:number};
type StockReceipt={prep:{id:string;plannedMl:number;deductedMl:number}[];ingredients:{id:string;plannedQty:number;deductedQty:number;unit:string;display:string}[]};
type Author="josh"|"g";
const noteChips=["More chilli","Less salt","Bigger portion","Perfect as is"];
function readCookSession(id:string,totalSteps:number):CookSession|null{if(typeof window==="undefined")return null;try{const raw=sessionStorage.getItem(`home-meals-cook:${id}`);if(!raw)return null;const s=JSON.parse(raw) as CookSession;if(!s||Date.now()-(s.updatedAt??0)>6*60*60*1000){sessionStorage.removeItem(`home-meals-cook:${id}`);return null}return {step:Math.max(0,Math.min(totalSteps-1,Number(s.step)||0)),timerEnd:Number(s.timerEnd)>Date.now()?Number(s.timerEnd):null,timerDone:!!s.timerDone&&!(Number(s.timerEnd)>Date.now()),updatedAt:Number(s.updatedAt)||Date.now()}}catch{return null}}

export function Cooking({id}:{id:string}){
 const h=useHousehold();const r=getRecipe(id);const total=r.steps.length;
 const initial=useRef<CookSession|null>(null);if(initial.current===null)initial.current=readCookSession(id,total);
 const[step,setStep]=useState(()=>initial.current?.step??0);const[done,setDone]=useState(false);const[startedAt]=useState(()=>Date.now());
 const[timer,setTimer]=useState(()=>initial.current?.timerEnd?Math.max(0,Math.ceil((initial.current.timerEnd-Date.now())/1000)):0);const[timerEnd,setTimerEnd]=useState<number|null>(()=>initial.current?.timerEnd??null);const[timerDone,setTimerDone]=useState(()=>initial.current?.timerDone??false);
 const[note,setNote]=useState("");const[author,setAuthor]=useState<Author>("josh");const[receipt,setReceipt]=useState<StockReceipt|null>(null);const[elapsed,setElapsed]=useState(0);
 const tick=useRef<ReturnType<typeof setInterval>|null>(null);const title=recipeTitle(r.id,r.title);const sessionKey=`home-meals-cook:${id}`;
 const versions=h.recipeVersions[id]??[];const currentVersion=versions[0]?.number??1;const latest=versions[0];
 const suggested=useMemo(()=>stepMinutes(r.steps[step]),[r.steps,step]);
 const tracked=useMemo(()=>r.ingredients.filter(x=>!x.optional&&getIngredient(x.id)?.tracking!=="state"),[r.ingredients]);
 const phase=phaseFor(step,total);
 const clearTick=()=>{if(tick.current){clearInterval(tick.current);tick.current=null}};
 const stopTimer=()=>{clearTick();setTimer(0);setTimerEnd(null);setTimerDone(false)};
 const armTimer=(end:number)=>{clearTick();setTimerDone(false);setTimerEnd(end);setTimer(Math.max(0,Math.ceil((end-Date.now())/1000)));tick.current=setInterval(()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));setTimer(left);if(!left){clearTick();setTimerEnd(null);setTimerDone(true);feedback("success")}},1000)};
 useEffect(()=>{const person=getHouseholdPerson();if(person)setAuthor(person)},[]);
 useEffect(()=>{let lock:any;const wake=async()=>{try{if("wakeLock" in navigator)lock=await (navigator as any).wakeLock.request("screen")}catch{}};wake();if(initial.current?.timerEnd)armTimer(initial.current.timerEnd);return()=>{lock?.release?.();clearTick()}},[]);
 useEffect(()=>{if(done)return;try{sessionStorage.setItem(sessionKey,JSON.stringify({step,timerEnd,timerDone,updatedAt:Date.now()} satisfies CookSession))}catch{}},[sessionKey,step,timerEnd,timerDone,done]);
 const startTimer=(mins:number)=>{armTimer(Date.now()+mins*60000);feedback("tap")};
 const next=()=>{stopTimer();setStep(s=>Math.min(total-1,s+1));feedback("tap")};
 const back=()=>{stopTimer();setStep(s=>Math.max(0,s-1));feedback("tap")};
 const leave=()=>{stopTimer();try{sessionStorage.removeItem(sessionKey)}catch{}};
 const finish=()=>{if(done)return;stopTimer();try{sessionStorage.removeItem(sessionKey)}catch{}setReceipt({prep:r.prep.map(x=>({id:x.id,plannedMl:x.totalMl,deductedMl:Math.min(Math.max(0,h.componentStock[x.id]??0),x.totalMl)})),ingredients:tracked.map(x=>({id:x.id,plannedQty:x.qty,deductedQty:Math.min(Math.max(0,h.ingredientStock[x.id]??0),x.qty),unit:x.unit,display:x.display}))});h.cookMeal(id);setElapsed(Math.max(1,Math.round((Date.now()-startedAt)/60000)));setDone(true);feedback("success")};
 const askHome=()=>{window.dispatchEvent(new Event("home-meals:ask"));feedback("tap")};
 const touch=useRef<{x:number;y:number}|null>(null);
 const onTouchStart=(e:React.TouchEvent)=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}};
 const onTouchEnd=(e:React.TouchEvent)=>{const s=touch.current;touch.current=null;if(!s)return;const dx=e.changedTouches[0].clientX-s.x,dy=e.changedTouches[0].clientY-s.y;if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return;if(dx<0){if(step<total-1)next()}else back()};
 const tip=stepCue(r.steps[step])??(latest?`Our v${currentVersion}: “${latest.summary}”`:step===total-1?"Say “done” and I’ll log the cook and take the stock off.":"Swipe or say “next” when you’re ready.");

 if(done){
  const prepLine=receipt?.prep.filter(x=>x.deductedMl>0).map(x=>{const c=getComponent(x.id);const portions=c?Math.round(x.deductedMl/Math.max(1,c.portionMl)):0;return c&&portions?`${portions} ${c.code}`:null}).filter(Boolean).join(" and ");
  const ingLine=receipt?.ingredients.filter(x=>x.deductedQty>0).slice(0,3).map(x=>`${formatQty(x.deductedQty,x.unit)} ${getIngredient(x.id)?.name?.toLowerCase()??x.id}`).join(", ");
  const finishUp=()=>{const clean=note.trim();if(clean){h.noteMeal(id,clean,author);if(clean!==latest?.summary)h.promoteRecipeVersion(id,clean,author)}feedback("success")};
  return <div className="hm-done hm-screen flush" style={{paddingBottom:140}}>
   <div className="stage">{r.image&&<img src={r.image} alt={title}/>}<div className="shade"/><div className="logged"><span className="hm-pill white">DINNER LOGGED</span></div></div>
   <div className="body">
    <h1 className="title">That’s {title}<br/>done in {elapsed} min.</h1>
    <HomeSays>{prepLine||ingLine?<>I took {prepLine?`${prepLine} from the freezer`:""}{prepLine&&ingLine?", ":""}{ingLine?`${ingLine} from the fridge`:""}. How was it?</>:<>Logged. Nothing was deducted because the kitchen wasn’t stocked yet. How was it?</>}</HomeSays>
    <div className="hm-list">
     {(["josh","g"] as const).map(w=><div key={w} className="hm-card lg hm-rate-row"><Avatar who={w} size="lg"/><div><div className="who">{w==="josh"?"Josh":"G"}</div><div className="hm-stars">{[1,2,3,4,5].map(n=><button key={n} className={(h.ratings[id]?.[w]??0)>=n?"on":""} aria-label={`${w==="josh"?"Josh":"G"} ${n} stars`} onClick={()=>{h.rateMeal(id,w,n);feedback("change")}}>★</button>)}</div></div></div>)}
     <div className="hm-card lg hm-notebox"><div className="who">Next time</div><div className="hm-authors sm" style={{marginTop:8}}>{(["josh","g"] as const).map(a=><button key={a} className={author===a?"on":""} onClick={()=>{setAuthor(a);feedback("tap")}}><Avatar who={a} size="sm"/>{a==="josh"?"Josh":"G"}</button>)}</div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="More chilli. Two CH cubes." aria-label="Note for next time"/><div className="chips">{noteChips.map(c=><button key={c} className="hm-chip tint" onClick={()=>setNote(v=>v?`${v.replace(/\.?\s*$/,"")}. ${c}.`:`${c}.`)}>{c}</button>)}</div></div>
     <Link className="hm-card hm-version hm-lift" href={`/scan?mode=Meal&meal=${id}&back=${encodeURIComponent(`/cook/${id}`)}`}><div><span className="kick">PHOTO</span><strong>Save a photo of tonight</strong><small>Kept with the recipe on this phone.</small></div><span style={{fontSize:22,color:"var(--muted)"}}>›</span></Link>
    </div>
   </div>
   <div className="hm-cta"><Link className="hm-btn primary" href={`/cook/${id}`} onClick={finishUp}>{note.trim()?`Save as our v${(latest?.summary===note.trim()?currentVersion:currentVersion+1)} →`:"Done →"}</Link></div>
  </div>;
 }

 return <div className="hm-cooking" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
  <div className="stage">
   {r.image&&<img src={r.image} alt={title} loading="eager" fetchPriority="high"/>}
   <div className="shade"/>
   <div className="top"><Link href={`/cook/${id}`} className="hm-round onphoto" aria-label="Leave cooking mode" onClick={leave}>×</Link><span className="hm-pill onphoto" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{title} · {step+1}/{total}</span><button onClick={askHome} aria-label="Ask Home" style={{display:"grid",placeItems:"center"}}><Orb size={44}/></button></div>
   <div className="dots" aria-hidden="true">{r.steps.map((_,i)=><i key={i} style={i<=step?{background:phaseFor(i,total).gradient}:undefined}/>)}</div>
  </div>
  <div className="body">
   <div className="phase" style={{"--phase":phase.gradient} as CSSProperties}><b>{step+1}</b><span>{phase.name}{latest&&step===0?` · our v${currentVersion}`:""}</span></div>
   <p className="text" key={step}>{r.steps[step]}</p>
   {suggested>0&&<div className="timer" aria-live="polite">{timerDone?<><strong className="done">Done ✓</strong><button onClick={()=>startTimer(suggested)}>Run again</button></>:timer>0?<><strong>{Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</strong><button onClick={()=>startTimer(suggested)}>Restart</button></>:<><strong>{suggested}:00</strong><button onClick={()=>startTimer(suggested)}>Start timer</button></>}</div>}
   <details className="drawer"><summary>Ingredients &amp; prep ›</summary><div className="hm-ing">{r.prep.map(p=>{const c=getComponent(p.id);return c?<span key={p.id}><i style={{background:toneFor(p.id)}}/>{c.code} · {p.portions} {portionWord(p.id,p.portions)}</span>:null})}{r.ingredients.map(x=><span key={`${x.id}-${x.raw}`} className={`plain ${x.optional?"optional":""}`}>{getIngredient(x.id)?.name??x.id} · {x.display}</span>)}</div></details>
   <div className="hm-card tip"><Orb size={30}/><span>{tip}</span></div>
  </div>
  <div className="foot">
   <div className="nav"><button className="hm-btn ghost" disabled={step===0} onClick={back}>Back</button>{step<total-1?<button className="hm-btn primary" onClick={next}>Next</button>:<button className="hm-btn primary" onClick={finish}>Done — log it</button>}</div>
   <div className="hint">‹ swipe · or say “next” ›</div>
  </div>
 </div>;
}
