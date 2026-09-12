"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {feedback} from "@/lib/feedback";
import {getIngredient} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {Icon} from "../Icons";
import {Back,formatQty,PageHead} from "./Primitives";

const modes=[
 {id:"Fridge",mark:"FR",title:"Open the fridge",hint:"Frame the shelves clearly so the useful food is easy to review."},
 {id:"Freezer",mark:"FZ",title:"Open the freezer",hint:"Show a whole drawer or one labelled prep section at a time."},
 {id:"Pantry",mark:"PN",title:"Open the pantry",hint:"Show one shelf or cupboard section at a time so staples are easy to check."},
 {id:"Receipt",mark:"RC",title:"Show the receipt",hint:"Keep the full receipt flat and readable from top to bottom."},
 {id:"Prep",mark:"PR",title:"Show the pan",hint:"Photograph the colour and texture you want to check."},
 {id:"Meal",mark:"ML",title:"Show dinner",hint:"Capture what we actually cooked for the household history."}
] as const;
type Mode=(typeof modes)[number]["id"];
export function Scan(){const h=useHousehold();const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[error,setError]=useState("");const[back,setBack]=useState("/");const[fileNonce,setFileNonce]=useState(0);const[receiptChecked,setReceiptChecked]=useState<string[]>([]);const[receiptSaved,setReceiptSaved]=useState(false);
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const clearPreview=()=>{if(preview)URL.revokeObjectURL(preview);setPreview(undefined);setError("");setFileNonce(n=>n+1);setReceiptChecked([]);setReceiptSaved(false)};
 const chooseMode=(next:Mode)=>{clearPreview();setMode(next);feedback("tap")};
 const chooseFile=(file?:File)=>{if(!file)return;clearPreview();if(file.type&&!file.type.startsWith("image/")){setError("That file isn’t an image. Try another photo.");feedback("change");return}if(file.size>16*1024*1024){setError("That photo is very large. Try a smaller image or take another photo.");feedback("change");return}try{setPreview(URL.createObjectURL(file));feedback("change")}catch{setError("That photo couldn’t be opened. Try taking it again.");feedback("change")}};
 const backLabel=back.startsWith("/cook/")?"Cooking":back==="/kitchen"?"Kitchen":back==="/prep"?"Prep":"Home";
 const kitchenHref=back==="/kitchen"?back:"/kitchen";const current=modes.find(x=>x.id===mode)!;
 const toggleReceipt=(id:string)=>{setReceiptChecked(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);setReceiptSaved(false);feedback("tap")};
 const addReceiptItems=()=>{for(const id of receiptChecked){const item=h.shoppingNeeds.find(x=>x.id===id);if(!item)continue;const add=item.unit==="have"?1:item.qty;h.setIngredient(id,(h.ingredientStock[id]??0)+add);if(h.groceryChecked[id])h.toggleGrocery(id)}setReceiptChecked([]);setReceiptSaved(true);feedback("success")};
 return <div className="hm-page-v5 hm-scan-v5 hm-scan-v6"><Back href={back} label={backLabel}/><PageHead title="Show Home" sub="Camera first. No fiddly forms while you’re standing in the kitchen."/>
  <div className="hm-scan-modes-v6" aria-label="What are you showing Home?">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>chooseMode(m.id)}><b>{m.mark}</b><span>{m.id}</span></button>)}</div>

  <section className={`hm-camera-v6 ${preview?"has-photo":""}`}>
   {preview?<img src={preview} alt={`Selected ${mode.toLowerCase()} photo`} onError={()=>{clearPreview();setError("That photo couldn’t be displayed. Try taking it again.")}}/>:<div className="hm-camera-empty-v6"><div className="hm-frame-corners-v6" aria-hidden="true"><i/><i/><i/><i/></div><span>{mode.toUpperCase()}</span><strong>{current.title}</strong><p>{error||current.hint}</p></div>}
   <div className="hm-camera-top-v6"><span><i/>{mode}</span><em>{preview?"Photo ready":"AUTO"}</em></div>
   <div className="hm-camera-controls-v6">
    <label className="hm-camera-library-v6" aria-label={`Choose ${mode.toLowerCase()} photo from library`}><input key={`library-${fileNonce}`} type="file" accept="image/*" onChange={e=>chooseFile(e.target.files?.[0])}/><Icon name="camera" size={19}/><span>Photos</span></label>
    <label className="hm-shutter-v6" aria-label={`Take ${mode.toLowerCase()} photo`}><input key={`camera-${fileNonce}`} type="file" accept="image/*" capture="environment" onChange={e=>chooseFile(e.target.files?.[0])}/><i/></label>
    <button className="hm-camera-clear-v6" onClick={()=>preview?clearPreview():feedback("tap")} aria-label={preview?"Clear photo":"Camera help"}>{preview?"×":"?"}</button>
   </div>
  </section>

  <div className="hm-camera-honesty-v6"><Icon name="spark" size={17}/><p><strong>Photo input works now.</strong> The photo stays on this screen while you check the task. Automatic ingredient and receipt recognition is not connected yet, so Kitchen only changes when you confirm it.</p></div>

  {error&&!preview&&<section className="hm-photo-next-v5" role="status"><strong>Photo not loaded.</strong><p>{error}</p><button className="hm-text-button-v5" onClick={()=>{setError("");setFileNonce(n=>n+1);feedback("tap")}}>Try again</button></section>}

  {preview&&mode==="Receipt"&&<section className="hm-receipt-confirm-v12"><header><span>MANUAL CONFIRM</span><h2>What actually came home?</h2><p>Tick only the items you can see on this receipt. Nothing is being guessed from the photo.</p></header>{receiptSaved&&<div className="hm-receipt-saved-v12">✓ Added to Kitchen</div>}{h.shoppingNeeds.length?<><div className="hm-receipt-items-v12">{h.shoppingNeeds.slice(0,12).map(item=>{const d=getIngredient(item.id);const on=receiptChecked.includes(item.id);return <button key={item.id} className={on?"on":""} onClick={()=>toggleReceipt(item.id)}><i>{on?"✓":""}</i><span><strong>{d?.name??item.id}</strong><small>{formatQty(item.qty,item.unit)}</small></span></button>})}</div><button className="hm-primary-button-v5" disabled={!receiptChecked.length} onClick={addReceiptItems}>Add {receiptChecked.length||"checked"} to Kitchen</button>{h.shoppingNeeds.length>12&&<Link className="hm-text-button-v5" href="/plan">Open full shopping list</Link>}</>:<div className="hm-empty-v5"><strong>The current shopping list is already clear.</strong><p>If this receipt contains something else, add it directly in Kitchen.</p><Link href={kitchenHref}>Open Kitchen</Link></div>}</section>}

  {preview&&<section className="hm-photo-next-v5 hm-photo-next-v6"><div><span>{mode.toUpperCase()}</span><strong>{mode==="Prep"?"Compare this with the recipe’s visual cues.":mode==="Meal"?"Keep this beside tonight’s memory.":mode==="Receipt"?"Receipt stays visible while you confirm the items.":"Use this while you check the real kitchen state."}</strong></div>{mode==="Prep"?<><p>Look at the colour, reduction and texture beside the relevant mother or recipe guide.</p><Link href={back.startsWith("/cook/")?back:"/prep"}>{back.startsWith("/cook/")?"Back to cooking":"Open Prep"}</Link></>:mode==="Receipt"?<><p>Use the confirmation list above, or open Kitchen for anything not in this week’s shopping list.</p><Link href={kitchenHref}>Update Kitchen</Link></>:mode==="Meal"?<><p>When dinner is done, rate it and leave the note that changes the recipe next time.</p><Link href={back.startsWith("/cook/")?back:"/cook"}>{back.startsWith("/cook/")?"Back to cooking":"Our recipes"}</Link></>:<><p>Use the picture as a fast visual reference while you confirm what is in stock.</p><Link href={kitchenHref}>Update Kitchen</Link></>}<button className="hm-text-button-v5" onClick={()=>{clearPreview();feedback("tap")}}>Discard photo</button></section>}
 </div>}
