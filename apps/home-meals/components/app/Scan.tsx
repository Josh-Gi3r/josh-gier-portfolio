"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";

const modes=[{id:"Fridge",icon:"🥬"},{id:"Freezer",icon:"❄"},{id:"Receipt",icon:"🧾"},{id:"Prep",icon:"🍳"},{id:"Meal",icon:"🍽"}] as const;
type Mode=(typeof modes)[number]["id"];
export function Scan(){const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[back,setBack]=useState("/");
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 return <div className="hm-page-v5 hm-scan-v5"><Back href={back} label={back==="/"?"Home":"Back"}/><PageHead eyebrow="CAMERA" title="Show Home" sub="Take a photo now. Nothing changes until you confirm it."/>
  <div className="hm-scan-modes-v5">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>{setMode(m.id);setPreview(undefined);feedback("tap")}}><i>{m.icon}</i><span>{m.id}</span></button>)}</div>
  <section className="hm-camera-v5">{preview?<img src={preview} alt="Selected kitchen photo"/>:<div><span>{modes.find(x=>x.id===mode)?.icon}</span><strong>{mode==="Prep"?"Check the prep":mode}</strong><p>{mode==="Prep"?"Photograph the pan or prep stage.":mode==="Receipt"?"Photograph the whole receipt clearly.":`Photograph the ${mode.toLowerCase()}.`}</p></div>}<label><input type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files?.[0];if(f){setPreview(URL.createObjectURL(f));feedback("change")}}}/><span>{preview?"Take another":"Camera / photo"}</span></label></section>
  {preview&&<section className="hm-photo-next-v5"><strong>Photo ready.</strong>{mode==="Prep"?<><p>Image coaching isn’t connected yet. Compare the pan with the colour and texture cues in the prep recipe.</p><Link href={back.startsWith("/cook/")?back:"/prep"}>{back.startsWith("/cook/")?"Back to cooking":"Open Prep"}</Link></>:mode==="Receipt"?<><p>Receipt reading isn’t connected yet. Add what you bought in Kitchen.</p><Link href="/kitchen">Update Kitchen</Link></>:mode==="Meal"?<><p>Keep the meal in cooking history after dinner.</p><Link href="/cook">Our recipes</Link></>:<><p>Update the real stock in Kitchen. No guessed counts will be added from this photo.</p><Link href="/kitchen">Update Kitchen</Link></>}</section>}
 </div>}
