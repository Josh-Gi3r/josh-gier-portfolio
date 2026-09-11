"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
import { useHousehold } from "./HouseholdState";
import { getIngredient, midBases, motherBases } from "@/data/home-graph-v3";

const modes=[{id:"Fridge",icon:"🥬",copy:"What's actually at home"},{id:"Freezer",icon:"❄",copy:"Count bases + portions"},{id:"Receipt",icon:"🧾",copy:"Add what we bought"},{id:"Prep check",icon:"🍳",copy:"Does this look ready?"},{id:"Meal",icon:"🍽",copy:"Remember what we cooked"}] as const;
type Mode=(typeof modes)[number]["id"];
const freezerDetected:Record<string,number>={red:5,gold:7,rempah:4,sambal:3,dark:8,blond:5,clear:4,onion:2,"thai-green":3,"wok-brown":4};
const fridgeDetected:Record<string,number>={"chicken-thigh":900,cream:250,broccoli:500,mushrooms:300,parmesan:90,lime:3};
const receiptDetected:Record<string,number>={"chicken-thigh":1000,cream:400,"red-onion":500,coriander:30,broccoli:400};

export function ScanV2(){
 const h=useHousehold();const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[analysed,setAnalysed]=useState(false);const[confirmed,setConfirmed]=useState(false);
 const detected=useMemo(()=>{
  if(mode==="Freezer")return Object.entries(freezerDetected).map(([id,qty])=>{const item=motherBases.find(x=>x.id===id)??midBases.find(x=>x.id===id);return {id,label:item?.code??id,qty,unit:"portions"}});
  if(mode==="Fridge")return Object.entries(fridgeDetected).map(([id,qty])=>({id,label:getIngredient(id).name,qty,unit:getIngredient(id).defaultUnit}));
  if(mode==="Receipt")return Object.entries(receiptDetected).map(([id,qty])=>({id,label:getIngredient(id).name,qty,unit:getIngredient(id).defaultUnit}));
  return [];
 },[mode]);
 const confirm=()=>{if(mode==="Freezer")for(const [id,qty] of Object.entries(freezerDetected))h.setComponent(id,qty);if(mode==="Fridge")for(const [id,qty] of Object.entries(fridgeDetected))h.setIngredient(id,qty);if(mode==="Receipt")for(const [id,qty] of Object.entries(receiptDetected))h.setIngredient(id,(h.ingredientStock[id]??0)+qty);setConfirmed(true)};
 return <div className="hm-screen hm-scan-v3 hm-v3-screen">
  <header className="hm-mobile-head"><div><span>SHOW HOME</span><h1>Point. Snap. Done.</h1><p>The camera is just another way to update our kitchen.</p></div><Link href="/" className="hm-head-help">×</Link></header>
  <div className="hm-scan-mode-rail">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>{setMode(m.id);setAnalysed(false);setConfirmed(false)}}><i>{m.icon}</i><strong>{m.id}</strong><small>{m.copy}</small></button>)}</div>
  <section className="hm-camera-v3">{preview?<img src={preview} alt="Selected kitchen photo"/>:<div className="hm-camera-empty"><div className="reticle"><i/><i/><i/><i/></div><span>{modes.find(x=>x.id===mode)?.icon}</span><h2>Show Home your {mode.toLowerCase()}</h2><p>{mode==="Prep check"?"Take a photo of the pan or prep stage.":mode==="Meal"?"Take a quick photo before we eat.":"Take a clear photo. We'll confirm before changing anything."}</p></div>}<label className="hm-camera-shutter-v3"><input type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files?.[0];if(f){setPreview(URL.createObjectURL(f));setAnalysed(false);setConfirmed(false)}}}/><span/></label></section>
  {preview&&!analysed&&<button className="hm-scan-analyse" onClick={()=>setAnalysed(true)}><Icon name="spark"/> Check this photo</button>}
  {analysed&&<section className="hm-scan-result-v3"><header><span>V1 PREVIEW</span><h2>{mode==="Prep check"?"Here's what I'd look for":mode==="Meal"?"Meal noted":"I found these"}</h2></header>{["Fridge","Freezer","Receipt"].includes(mode)?<div className="hm-detected-list-v3">{detected.map(x=><div key={x.id}><i>✓</i><span><strong>{x.label}</strong><small>{x.qty} {x.unit}</small></span></div>)}</div>:mode==="Prep check"?<div className="hm-prep-check-v3"><strong>Use the recipe cue as the authority.</strong><p>The photo coaching is simulated in V1. For meat doneness, use time + temperature, not the camera.</p></div>:<div className="hm-prep-check-v3"><strong>Nice. We'll tie meal photos to cook history when live vision is connected.</strong></div>}{["Fridge","Freezer","Receipt"].includes(mode)&&<button onClick={confirm} disabled={confirmed}>{confirmed?"✓ Kitchen updated":"Confirm & update Kitchen"}</button>}</section>}
  <footer className="hm-scan-footnote"><span>✦</span><p><strong>Same household state.</strong> Confirmed scans update the exact stock used by Plan, Prep and Ask Home. Image understanding itself is still simulated until live vision is connected.</p></footer>
 </div>
}
