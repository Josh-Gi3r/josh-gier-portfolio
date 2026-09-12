"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";

const modes=[{id:"Fridge",icon:"🥬"},{id:"Freezer",icon:"❄"},{id:"Receipt",icon:"🧾"},{id:"Prep",icon:"🍳"},{id:"Meal",icon:"🍽"}] as const;
type Mode=(typeof modes)[number]["id"];
export function Scan(){const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[error,setError]=useState("");const[back,setBack]=useState("/");
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const clearPreview=()=>{if(preview)URL.revokeObjectURL(preview);setPreview(undefined);setError("")};
 const chooseMode=(next:Mode)=>{clearPreview();setMode(next);feedback("tap")};
 const chooseFile=(file?:File)=>{if(!file)return;clearPreview();if(!file.type.startsWith("image/")){setError("That file isn’t an image. Try another photo.");feedback("change");return}try{setPreview(URL.createObjectURL(file));feedback("change")}catch{setError("That photo couldn’t be opened. Try taking it again.");feedback("change")}};
 const backLabel=back.startsWith("/cook/")?"Cooking":back==="/kitchen"?"Kitchen":back==="/prep"?"Prep":"Home";
 const kitchenHref=back==="/kitchen"?back:"/kitchen";
 return <div className="hm-page-v5 hm-scan-v5"><Back href={back} label={backLabel}/><PageHead eyebrow="CAMERA" title="Show Home" sub="Take a photo. We’ll still update the kitchen ourselves for now."/>
  <div className="hm-scan-modes-v5" aria-label="Photo type">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>chooseMode(m.id)}><i>{m.icon}</i><span>{m.id}</span></button>)}</div>
  <section className="hm-camera-v5">{preview?<img src={preview} alt={`Selected ${mode.toLowerCase()} photo`} onError={()=>{clearPreview();setError("That photo couldn’t be displayed. Try taking it again.")}}/>:<div><span>{modes.find(x=>x.id===mode)?.icon}</span><strong>{mode==="Prep"?"Check the prep":mode}</strong><p>{error?error:mode==="Prep"?"Photograph the pan or prep stage.":mode==="Receipt"?"Photograph the whole receipt clearly.":mode==="Meal"?"Photograph the finished dinner.":`Photograph the ${mode.toLowerCase()}.`}</p></div>}<label><input type="file" accept="image/*" capture="environment" aria-label={`Choose ${mode.toLowerCase()} photo`} onChange={e=>chooseFile(e.target.files?.[0])}/><span>{preview?"Take another":error?"Try another photo":"Camera / photo"}</span></label></section>
  {error&&!preview&&<section className="hm-photo-next-v5" role="status"><strong>Photo not loaded.</strong><p>{error}</p><button className="hm-text-button-v5" onClick={()=>{setError("");feedback("tap")}}>Try again</button></section>}
  {preview&&<section className="hm-photo-next-v5"><div><span>{mode.toUpperCase()}</span><strong>Photo ready for this check.</strong></div>{mode==="Prep"?<><p>Keep it beside the prep recipe and compare the pan with the colour and texture cues.</p><Link href={back.startsWith("/cook/")?back:"/prep"}>{back.startsWith("/cook/")?"Back to cooking":"Open Prep"}</Link></>:mode==="Receipt"?<><p>Keep the receipt handy while you add what came home.</p><Link href={kitchenHref}>Update Kitchen</Link></>:mode==="Meal"?<><p>When dinner is done, rate it and add a note to the recipe.</p><Link href={back.startsWith("/cook/")?back:"/cook"}>{back.startsWith("/cook/")?"Back to cooking":"Our recipes"}</Link></>:<><p>Use the photo as a visual check while you update the real stock.</p><Link href={kitchenHref}>Update Kitchen</Link></>}<button className="hm-text-button-v5" onClick={()=>{clearPreview();feedback("tap")}}>Discard photo</button></section>}
 </div>}
