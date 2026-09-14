"use client";
import Link from "next/link";
import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {feedback} from "@/lib/feedback";
import {getIngredient,getRecipe,ingredients,motherBases} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {useHousehold} from "../HouseholdState";
import {Icon} from "../Icons";
import {toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Orb} from "./Orb";
import {Check,formatQty,SectionHead,Toast} from "./Primitives";

const modes=[
 {id:"Fridge",label:"Fridge",title:"Point at the fridge",hint:"Frame the shelves so the useful food is easy to see."},
 {id:"Freezer",label:"Freezer",title:"Open the freezer",hint:"One drawer or one labelled prep section at a time."},
 {id:"Pantry",label:"Pantry",title:"Open the pantry",hint:"One shelf at a time so the staples are easy to check."},
 {id:"Receipt",label:"Receipt",title:"Show the receipt",hint:"Flat and readable, top to bottom."},
 {id:"Prep",label:"Prep check",title:"Show the pan",hint:"The colour and texture you want to check."},
 {id:"Meal",label:"Dinner",title:"Show dinner",hint:"What we actually cooked, for the cookbook."}
] as const;
type Mode=(typeof modes)[number]["id"];
const levels=["Out","Low","Some","Plenty"];
function scanStep(item:{id:string;category:string;unit:string}){if(item.unit==="count"||item.unit==="portion")return 1;if(item.unit==="ml")return item.category==="Dairy"?100:50;if(item.unit==="g")return item.category==="Protein"?200:item.category==="Fresh"?100:50;return 1}
function compressMealPhoto(file:File){return new Promise<string>((resolve,reject)=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{try{const render=(max:number,quality:number)=>{const scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("canvas");ctx.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL("image/jpeg",quality)};let data=render(760,.68);if(data.length>440000)data=render(640,.6);if(data.length>440000)data=render(540,.52);URL.revokeObjectURL(url);if(data.length>520000)throw new Error("photo-budget");resolve(data)}catch(e){URL.revokeObjectURL(url);reject(e)}};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("image"))};img.src=url})}

// Show Home: camera first. The photo is your reference; Kitchen only changes when you tap a control.
export function Scan(){
 const h=useHousehold();
 const[mode,setMode]=useState<Mode>("Fridge");const[preview,setPreview]=useState<string>();const[file,setFile]=useState<File>();const[error,setError]=useState("");const[back,setBack]=useState("/");const[nonce,setNonce]=useState(0);const[receiptChecked,setReceiptChecked]=useState<string[]>([]);const[mealId,setMealId]=useState<string>();const[mealSaving,setMealSaving]=useState(false);const[toast,setToast]=useState("");const[changed,setChanged]=useState<Record<string,boolean>>({});
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b);const meal=p.get("meal");if(meal)setMealId(meal)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1600)};
 const clear=()=>{if(preview)URL.revokeObjectURL(preview);setPreview(undefined);setFile(undefined);setError("");setNonce(n=>n+1);setReceiptChecked([]);setChanged({})};
 const chooseMode=(m:Mode)=>{clear();setMode(m);feedback("tap")};
 const chooseFile=(f?:File)=>{if(!f)return;clear();if(f.type&&!f.type.startsWith("image/")){setError("That file isn’t an image.");return}if(f.size>16*1024*1024){setError("That photo is very large — try a smaller one.");return}try{setFile(f);setPreview(URL.createObjectURL(f));feedback("change")}catch{setError("That photo couldn’t be opened.")}};
 const current=modes.find(x=>x.id===mode)!;
 const targetMealId=mealId??h.history[0]?.mealId;const targetMeal=targetMealId?getRecipe(targetMealId):null;
 const relevant=useMemo(()=>new Set(h.week.flatMap(rid=>getRecipe(rid).ingredients.filter(x=>!x.optional).map(x=>x.id))),[h.week]);
 const quick=useMemo(()=>ingredients.filter(i=>mode==="Pantry"?i.category==="Pantry":["Fresh","Protein","Dairy"].includes(i.category)).sort((a,b)=>Number(relevant.has(b.id))-Number(relevant.has(a.id))||Number((h.ingredientStock[b.id]??0)>0)-Number((h.ingredientStock[a.id]??0)>0)||a.name.localeCompare(b.name)).slice(0,12),[mode,relevant,h.ingredientStock]);
 const adjust=(id:string,delta:number)=>{const item=getIngredient(id);if(!item)return;const cur=h.ingredientStock[id]??0;h.setIngredient(id,item.tracking==="state"?Math.max(0,Math.min(3,cur+delta)):Math.max(0,cur+delta*scanStep(item)));setChanged(v=>({...v,[id]:true}));feedback("change")};
 const adjustBase=(id:string,delta:number)=>{const m=motherBases.find(x=>x.id===id);if(!m)return;h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*m.portionMl));setChanged(v=>({...v,[id]:true}));feedback("change")};
 const toggleReceipt=(id:string)=>{setReceiptChecked(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);feedback("tap")};
 const addReceipt=()=>{for(const id of receiptChecked){const item=h.shoppingNeeds.find(x=>x.id===id);if(!item)continue;const cur=h.ingredientStock[id]??0;h.setIngredient(id,item.unit==="have"?Math.max(cur,2):cur+item.qty);if(h.groceryChecked[id])h.toggleGrocery(id)}flash(`${receiptChecked.length} added to Kitchen`);setReceiptChecked([]);feedback("success")};
 const saveMeal=async()=>{if(!file||!targetMealId||mealSaving)return;setMealSaving(true);try{const data=await compressMealPhoto(file);h.saveMealPhoto(targetMealId,data);flash("Saved with dinner");feedback("success")}catch{setError("That photo couldn’t be saved in the phone’s photo budget.")}finally{setMealSaving(false)}};
 const confirmed=Object.keys(changed).length;
 const kitchenTab=mode==="Pantry"?"Pantry":mode==="Freezer"?"Freezer":"Fridge";
 const says=(()=>{
  if(error)return {text:<>{error} Try another photo — the controls below still work.</>};
  if(!preview)return {text:<>{current.hint} I won’t guess quantities — you confirm what goes in.</>};
  if(mode==="Receipt")return {text:h.shoppingNeeds.length?<>Tick the lines you can see on the receipt and they go straight into the fridge. I match against this week’s list.</>:<>This week’s list is already clear. Anything else goes in through Kitchen.</>};
  if(mode==="Prep")return {text:<>Compare the pan with the base’s cue photo — colour and gloss, not the clock. You decide when it’s there.</>};
  if(mode==="Meal")return {text:targetMeal?<>Keep this with <b>{recipeTitle(targetMeal.id,targetMeal.title)}</b>? Only a small copy stays on the phone.</>:<>Log a dinner first, then a photo can sit with it.</>};
  return {text:<>Use the photo as your reference and tap what’s changed{confirmed?` — ${confirmed} updated so far.`:"."}</>};
 })();
 return <div className="hm-scan">
  <div className="stage">
   {preview&&<img src={preview} alt={`${mode} photo`} onError={()=>{clear();setError("That photo couldn’t be displayed.")}}/>}
   <div className="shade"/>
   <div className="top"><Link href={back} className="hm-round dark" aria-label="Close camera" onClick={()=>feedback("tap")}>×</Link><span className="hm-pill onphoto">{current.title}</span><button aria-label="Ask Home" onClick={()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))}} style={{display:"grid",placeItems:"center"}}><Orb size={44}/></button></div>
   {!preview&&<div className="frame"><span>{mode==="Receipt"?"Whole receipt in frame":mode==="Prep"?"Fill the frame with the pan":"Steady · good light"}</span></div>}
   {!preview&&<div className="controls">
    <label aria-label="Choose a photo from the library"><input key={`lib-${nonce}`} type="file" accept="image/*" onChange={e=>chooseFile(e.target.files?.[0])}/><Icon name="camera" size={20}/></label>
    <label className="shutter" aria-label={`Take ${mode.toLowerCase()} photo`}><input key={`cam-${nonce}`} type="file" accept="image/*" capture="environment" onChange={e=>chooseFile(e.target.files?.[0])}/></label>
    <button aria-label="Open Kitchen" onClick={()=>{window.location.href="/kitchen"}}><Icon name="kitchen" size={20}/></button>
   </div>}
   <HomeSays bubbleClass="dark">{says.text}</HomeSays>
  </div>
  <div className="hm-scan-panel">
   <div className="modes" role="tablist">{modes.map(m=><button key={m.id} role="tab" aria-selected={mode===m.id} className={mode===m.id?"on":""} onClick={()=>chooseMode(m.id)}>{m.label}</button>)}</div>
   {!preview&&<div className="acts"><Link className="hm-btn ghost sm" href={mode==="Meal"?(targetMeal?`/cook/${targetMeal.id}`:"/cook"):mode==="Prep"?(back.startsWith("/prep")||back.startsWith("/cook")?back:"/prep"):"/kitchen"}>{mode==="Meal"?"Our recipes":mode==="Prep"?"Open the cues":"Add manually"}</Link><label className="hm-btn primary sm" style={{position:"relative",cursor:"pointer"}}><input key={`cta-${nonce}`} type="file" accept="image/*" capture="environment" onChange={e=>chooseFile(e.target.files?.[0])} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>Take the photo</label></div>}

   {preview&&(mode==="Fridge"||mode==="Pantry")&&<>
    <SectionHead title={mode==="Fridge"?"What you can see":"Useful staples"} action={<Link href="/kitchen">Full {kitchenTab.toLowerCase()} ›</Link>}/>
    <div className="hm-list tight">{quick.map(item=>{const n=h.ingredientStock[item.id]??0;return <div key={item.id} className={`hm-card hm-scan-row ${changed[item.id]?"":""}`}><span><strong>{item.name}</strong><small>{relevant.has(item.id)?"This week":"Kitchen"}{changed[item.id]?" · updated":""}</small></span><div className="hm-stepper"><button className="minus" disabled={n<=0} aria-label={`Less ${item.name}`} onClick={()=>adjust(item.id,-1)}>−</button><b>{item.tracking==="state"?levels[Math.min(3,n)]:n>0?formatQty(n,item.unit):"Out"}</b><button className="plus" disabled={item.tracking==="state"&&n>=3} aria-label={`More ${item.name}`} onClick={()=>adjust(item.id,1)}>+</button></div></div>})}</div>
    <div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={()=>{clear();feedback("tap")}}>Discard photo</button><Link className="hm-btn primary sm" href={back.startsWith("/")?back:"/kitchen"} onClick={()=>{if(confirmed)h.confirmKitchen();feedback("success")}}>{confirmed?`Confirm ${confirmed} ${confirmed===1?"item":"items"}`:"Done"}</Link></div>
   </>}

   {preview&&mode==="Freezer"&&<>
    <SectionHead title="Count the bases" action={<Link href="/kitchen">Full freezer ›</Link>}/>
    <div className="hm-list tight">{motherBases.map(m=>{const ml=h.componentStock[m.id]??0;const n=Math.floor(ml/Math.max(1,m.portionMl));return <div key={m.id} className="hm-card hm-scan-row" style={{gridTemplateColumns:"10px 1fr auto",gap:12}}><i className="hm-dot" style={{"--tone":toneFor(m.id),width:10,height:44,borderRadius:999,background:toneGradient(m.id)} as CSSProperties}/><span><strong>{m.code}</strong><small>{m.name}{changed[m.id]?" · updated":""}</small></span><div className="hm-stepper"><button className="minus" disabled={ml<=0} aria-label={`One less ${m.code}`} onClick={()=>adjustBase(m.id,-1)}>−</button><b style={{minWidth:22}}>{n}</b><button className="plus" aria-label={`One more ${m.code}`} onClick={()=>adjustBase(m.id,1)}>+</button></div></div>})}</div>
    <div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={()=>{clear();feedback("tap")}}>Discard photo</button><Link className="hm-btn primary sm" href="/kitchen" onClick={()=>{if(confirmed)h.confirmKitchen();feedback("success")}}>{confirmed?`Confirm ${confirmed}`:"Done"}</Link></div>
   </>}

   {preview&&mode==="Receipt"&&<>
    <SectionHead title="What came home" action={<span className="muted">{receiptChecked.length}/{Math.min(12,h.shoppingNeeds.length)}</span>}/>
    {h.shoppingNeeds.length?<div className="hm-list tight">{h.shoppingNeeds.slice(0,12).map(item=>{const d=getIngredient(item.id);const on=receiptChecked.includes(item.id);return <button key={item.id} className={`hm-checkrow ${on?"done":""}`} aria-pressed={on} onClick={()=>toggleReceipt(item.id)}><Check on={on}/><span className="name">{d?.name??item.id}</span><small>{item.unit==="have"?"restock":formatQty(item.qty,item.unit)}</small></button>})}</div>:<div className="hm-empty" style={{marginInline:0}}><strong>The list is already clear.</strong>Anything extra goes in through Kitchen.</div>}
    <div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={()=>{clear();feedback("tap")}}>Discard</button><button className="hm-btn primary sm" disabled={!receiptChecked.length} onClick={addReceipt}>Add {receiptChecked.length||""} to Kitchen</button></div>
   </>}

   {preview&&mode==="Prep"&&<>
    <SectionHead title="Compare with the cue" action={<span className="muted">colour · gloss · texture</span>}/>
    <div className="hm-list tight">{motherBases.filter(m=>back.includes(`/prep/${m.id}`)||!back.includes("/prep/")).slice(0,back.includes("/prep/")?1:4).map(m=><Link key={m.id} href={`/prep/${m.id}`} className="hm-card hm-row hm-lift" style={{padding:"10px 14px 10px 10px"}}><span style={{width:44,height:44,borderRadius:14,background:toneGradient(m.id),color:"#fff",fontSize:11,fontWeight:800,display:"grid",placeItems:"center"}}>{m.code}</span><span><strong>{m.name}</strong><small>Open the stage photos</small></span><span className="hm-pill sky">cues ›</span></Link>)}</div>
    <div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={()=>{clear();feedback("tap")}}>Give it more time</button><Link className="hm-btn primary sm" href={back.startsWith("/")?back:"/prep"}>It’s there → back</Link></div>
   </>}

   {preview&&mode==="Meal"&&<>
    <SectionHead title={targetMeal?recipeTitle(targetMeal.id,targetMeal.title):"Dinner photo"} action={<span className="muted">{targetMeal?"keep a small copy":"no dinner logged"}</span>}/>
    <div className="acts" style={{marginTop:14}}><button className="hm-btn ghost sm" onClick={()=>{clear();feedback("tap")}}>Discard</button>{targetMeal?<button className="hm-btn primary sm" disabled={mealSaving} onClick={saveMeal}>{mealSaving?"Saving…":"Save with dinner"}</button>:<Link className="hm-btn primary sm" href="/cook">Choose dinner</Link>}</div>
    {targetMeal&&<p className="hm-note" style={{marginTop:12}}>Nothing is inferred from the photo. It sits with the recipe on this phone.</p>}
   </>}
  </div>
  {toast&&<Toast text={toast}/>}
 </div>;
}
