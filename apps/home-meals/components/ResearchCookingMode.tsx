"use client";
import { useEffect, useState } from "react";
import type { ResearchedMeal } from "@/data/meals-researched";
import { Icon } from "./Icons";

export function ResearchCookingMode({meal}:{meal:ResearchedMeal}){
 const [step,setStep]=useState(0),[seconds,setSeconds]=useState(0),[running,setRunning]=useState(false);
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);
 const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
 const done=step===meal.steps.length-1;
 return <div className="research-cook-mode"><div className="research-cook-head"><span>{meal.cuisine}</span><strong>{meal.title}</strong><div className="meal-parts">{meal.parts.map(x=><b key={x.code}>{x.code} ×{x.count}</b>)}</div></div><div className="research-cook-progress"><i style={{width:`${((step+1)/meal.steps.length)*100}%`}}/></div><section><span className="cook-step-number">{String(step+1).padStart(2,"0")}</span><small>STEP {step+1} OF {meal.steps.length}</small><h1>{meal.steps[step]}</h1></section><div className="cook-timer"><Icon name="clock"/><strong>{fmt(seconds)}</strong><button onClick={()=>setRunning(r=>!r)}>{running?"Pause":"Start timer"}</button><button onClick={()=>{setRunning(false);setSeconds(0)}}>Reset</button></div><div className="cook-controls"><button className="secondary-button" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Previous</button><button className="primary-button" onClick={()=>setStep(s=>Math.min(meal.steps.length-1,s+1))}>{done?"Finish":"Next step"} <Icon name="arrow"/></button></div></div>
}
