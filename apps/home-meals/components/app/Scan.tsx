"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {feedback} from "@/lib/feedback";
import {Icon} from "../Icons";
import {Back,PageHead} from "./Primitives";

const modes=[
 {id:"Fridge",mark:"FR",title:"Open the fridge",hint:"Frame the shelves clearly so the useful food is easy to review."},
 {id:"Freezer",mark:"FZ",title:"Open the freezer",hint:"Show a whole drawer or one labelled prep section at a time."},
 {id:"Receipt",mark:"RC",title:"Show the receipt",hint:"Keep the full receipt flat and readable from top to bottom."},
 {id:"Prep",mark:"PR",title:"Show the pan",hint:"Photograph the colour and texture you want to check."},
 {id:"Meal",mark:"ML",title:"Show dinner",hint:"Capture what we actually cooked for the household history."}
] as const;
type Mode=(typeof modes)[number]["id"];
export function Scan(){const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[error,setError]=useState("");const[back,setBack]=useState("/");
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const clearPreview=()=>{if(preview)URL.revokeObjectURL(preview);setPreview(undefined);setError("")};
 const chooseMode=(next:Mode)=>{clearPreview();setMode(next);feedback("tap")};
 const chooseFile=(file?:File)=>{if(!file)return;clearPreview();if(!file.type.startsWith("image/")){setError("That file isn’t an image. Try another photo.");feedback("change");return}try{setPreview(URL.createObjectURL(file));feedback("change")}catch{setError("That photo couldn’t be opened. Try taking it again.");feedback("change")}};
 const backLabel=back.startsWith("/cook/")?"Cooking":back==="/kitchen"?"Kitchen":back==="/prep"?"Prep":"Home";
 const kitchenHref=back==="/kitchen"?back:"/kitchen";const current=modes.find(x=>x.id===mode)!;
 return <div className="hm-page-v5 hm-scan-v5 hm-scan-v6"><Back href={back} label={backLabel}/><PageHead title="Show Home" sub="Camera first. No fiddly forms while you’re standing in the kitchen."/>
  <div className="hm-scan-modes-v6" aria-label="What are you showing Home?">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>chooseMode(m.id)}><b>{m.mark}</b><span>{m.id}</span></button>)}</div>

  <section className={`hm-camera-v6 ${preview?"has-photo":""}`}>
   {preview?<img src={preview} alt={`Selected ${mode.toLowerCase()} photo`} onError={()=>{clearPreview();setError("That photo couldn’t be displayed. Try taking it again.")}}/>:<div className="hm-camera-empty-v6"><div className="hm-frame-corners-v6" aria-hidden="true"><i/><i/><i/><i/></div><span>{mode.toUpperCase()}</span><strong>{current.title}</strong><p>{error||current.hint}</p></div>}
   <div className="hm-camera-top-v6"><span><i/>{mode}</span><em>{preview?"Photo ready":"AUTO"}</em></div>
   <div className="hm-camera-controls-v6">
    <label className="hm-camera-library-v6" aria-label={`Choose ${mode.toLowerCase()} photo from library`}><input type="file" accept="image/*" onChange={e=>chooseFile(e.target.files?.[0])}/><Icon name="camera" size={19}/><span>Photos</span></label>
    <label className="hm-shutter-v6" aria-label={`Take ${mode.toLowerCase()} photo`}><input type="file" accept="image/*" capture="environment" onChange={e=>chooseFile(e.target.files?.[0])}/><i/></label>
    <button className="hm-camera-clear-v6" onClick={()=>preview?clearPreview():feedback("tap")} aria-label={preview?"Clear photo":"Camera help"}>{preview?"×":"?"}</button>
   </div>
  </section>

  <div className="hm-camera-honesty-v6"><Icon name="spark" size={17}/><p><strong>Photo input is live.</strong> Home keeps the image beside the task, but automatic ingredient/receipt recognition is not connected yet, so stock only changes when you confirm it.</p></div>

  {error&&!preview&&<section className="hm-photo-next-v5" role="status"><strong>Photo not loaded.</strong><p>{error}</p><button className="hm-text-button-v5" onClick={()=>{setError("");feedback("tap")}}>Try again</button></section>}
  {preview&&<section className="hm-photo-next-v5 hm-photo-next-v6"><div><span>{mode.toUpperCase()}</span><strong>{mode==="Prep"?"Compare this with the recipe’s visual cues.":mode==="Meal"?"Keep this with tonight’s memory.":"Use this while you check the real kitchen state."}</strong></div>{mode==="Prep"?<><p>Look at the colour, reduction and texture beside the relevant mother or recipe guide.</p><Link href={back.startsWith("/cook/")?back:"/prep"}>{back.startsWith("/cook/")?"Back to cooking":"Open Prep"}</Link></>:mode==="Receipt"?<><p>Keep the receipt visible while you add what actually came home.</p><Link href={kitchenHref}>Update Kitchen</Link></>:mode==="Meal"?<><p>When dinner is done, rate it and leave the note that changes the recipe next time.</p><Link href={back.startsWith("/cook/")?back:"/cook"}>{back.startsWith("/cook/")?"Back to cooking":"Our recipes"}</Link></>:<><p>Use the picture as a fast visual reference while you confirm what is in stock.</p><Link href={kitchenHref}>Update Kitchen</Link></>}<button className="hm-text-button-v5" onClick={()=>{clearPreview();feedback("tap")}}>Discard photo</button></section>}
 </div>}
