"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {Back,PageHead} from "./Primitives";

const modes=[{id:"Fridge",icon:"🥬"},{id:"Freezer",icon:"❄"},{id:"Receipt",icon:"🧾"},{id:"Prep",icon:"🍳"},{id:"Meal",icon:"🍽"}] as const;
export function Scan(){const[mode,setMode]=useState<(typeof modes)[number]["id"]>("Fridge");const[preview,setPreview]=useState<string>();useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 return <div className="hm-page-v5 hm-scan-v5"><Back href="/" label="Home"/><PageHead eyebrow="CAMERA" title="Show Home" sub="Take a photo now. We’ll only change stock when you confirm it."/>
  <div className="hm-scan-modes-v5">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>{setMode(m.id);setPreview(undefined)}}><i>{m.icon}</i><span>{m.id}</span></button>)}</div>
  <section className="hm-camera-v5">{preview?<img src={preview} alt="Selected kitchen photo"/>:<div><span>{modes.find(x=>x.id===mode)?.icon}</span><strong>{mode}</strong><p>{mode==="Prep"?"Photograph the pan or prep stage.":mode==="Receipt"?"Photograph the whole receipt clearly.":`Photograph the ${mode.toLowerCase()}.`}</p></div>}<label><input type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files?.[0];if(f)setPreview(URL.createObjectURL(f))}}/><span>{preview?"Take another":"Camera / photo"}</span></label></section>
  {preview&&<section className="hm-photo-next-v5"><strong>Photo ready.</strong>{mode==="Prep"?<><p>For now, compare it with the colour and texture cues in the prep recipe.</p><Link href="/prep">Open Prep</Link></>:mode==="Receipt"?<><p>Receipt reading isn’t connected yet. Add what you bought in Kitchen.</p><Link href="/kitchen">Update Kitchen</Link></>:mode==="Meal"?<><p>Keep cooking history in the recipe after dinner.</p><Link href="/cook">Our recipes</Link></>:<><p>Update the real stock in Kitchen. No guessed counts will be added from this photo.</p><Link href="/kitchen">Update Kitchen</Link></>}</section>}
 </div>}
