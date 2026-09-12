"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";

function stepMinutes(s:string){const m=s.match(/(\d+)(?:[–-](\d+))?\s*(?:minutes?|mins?)/i);return m?Number(m[1]):0}
export function Cooking({id}:{id:string}){
 const h=useHousehold();const r=getRecipe(id);const[step,setStep]=useState(0);const[done,setDone]=useState(false);const[timer,setTimer]=useState(0);const tick=useRef<ReturnType<typeof setInterval>|null>(null);const title=recipeTitle(r.id,r.title);
 const suggested=useMemo(()=>stepMinutes(r.steps[step]),[r.steps,step]);
 useEffect(()=>{let lock:any;const wake=async()=>{try{if("wakeLock" in navigator)lock=await (navigator as any).wakeLock.request("screen")}catch{}};wake();return()=>{lock?.release?.();if(tick.current)clearInterval(tick.current)}},[]);
 const startTimer=(mins:number)=>{if(tick.current)clearInterval(tick.current);const end=Date.now()+mins*60000;setTimer(mins*60);tick.current=setInterval(()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));setTimer(left);if(!left&&tick.current){clearInterval(tick.current);tick.current=null;feedback("success")}},1000)};
 const next=()=>{setStep(s=>Math.min(r.steps.length-1,s+1));setTimer(0);feedback("tap")};const back=()=>{setStep(s=>Math.max(0,s-1));setTimer(0);feedback("tap")};
 const finish=()=>{if(done)return;h.cookMeal(id);setDone(true);feedback("success")};
 return <div className="hm-cooking-v5">
  <header><Link href={`/cook/${id}`}>‹ Recipe</Link><div><span>{step+1} of {r.steps.length}</span><div className="hm-cook-progress-v5"><i style={{width:`${((step+1)/r.steps.length)*100}%`}}/></div></div></header>
  <main>
   <div className="hm-cook-tools-v5"><Link href={`/scan?mode=Prep&back=${encodeURIComponent(`/cook/${id}/cook`)}`} onClick={()=>feedback("tap")}>⌁ Camera</Link><button onClick={()=>document.querySelector<HTMLButtonElement>(".hm-ask-fab-v5")?.click()}>✦ Ask Home</button></div>
   <div className="hm-cooking-title-v5"><h1 style={{fontSize:14,fontWeight:750,color:"#57705f",margin:0}}>{title}</h1><strong>{String(step+1).padStart(2,"0")}</strong></div><p className="hm-cooking-step-v5">{r.steps[step]}</p>{suggested>0&&<div className="hm-timer-v5">{timer>0?<><strong>{Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</strong><button onClick={()=>startTimer(suggested)}>Restart</button></>:<button onClick={()=>startTimer(suggested)}>Start {suggested} min timer</button>}</div>}
   <details className="hm-cook-drawer-v5"><summary>Ingredients & prep</summary><div><h3>Prep</h3>{r.prep.map(x=><p key={x.id}><span>{getComponent(x.id)?.name}</span><strong>{x.totalMl} ml</strong></p>)}<h3>Ingredients</h3>{r.ingredients.map(x=><p key={`${x.id}-${x.raw}`}><span>{getIngredient(x.id)?.name}{x.optional?" · optional":""}</span><strong>{x.display}</strong></p>)}</div></details>
  </main>
  {!done?<footer><button disabled={step===0} onClick={back}>Back</button>{step<r.steps.length-1?<button className="primary" onClick={next}>Next</button>:<button className="primary" onClick={finish}>Dinner’s ready</button>}</footer>:<section className="hm-cook-finished-v5"><span>✓</span><h2>Dinner logged</h2><p>Rate it while it’s fresh in your mind.</p><div>{(["josh","g"] as const).map(who=><div key={who}><strong>{who==="josh"?"Josh":"G"}</strong>{[1,2,3,4,5].map(n=><button key={n} className={(h.ratings[id]?.[who]??0)>=n?"on":""} aria-label={`${who} ${n} stars`} onClick={()=>{h.rateMeal(id,who,n);feedback("change")}}>★</button>)}</div>)}</div><Link href={`/cook/${id}`}>Add a note</Link></section>}
 </div>
}
