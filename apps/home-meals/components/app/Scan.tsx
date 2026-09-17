"use client";
import Link from "next/link";
import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {feedback} from "@/lib/feedback";
import {motherBases} from "@/data/home-data";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {ingredientUiCatalogV7 as ingredients,getIngredientUiV7,ingredientUiNameV7} from "@/data/ingredient-ui-v7";
import {ingredientsForRecipeV7,canonicalIngredientIdForRuntimeV7} from "@/data/ingredient-engine-v7";
import {getCanonicalPrepV2} from "@/data/food-truth-v2";
import {stockPortionsV7} from "@/data/stock-math-v7";
import {recipeTitle} from "@/data/recipe-display";
import {useHousehold} from "../HouseholdState";
import {JoshPresenceAnchor} from "../JoshPresence";
import {Icon} from "../Icons";
import {toneFor,toneGradient} from "@/lib/tones";
import {Check,formatQty,SectionHead,Toast} from "./Primitives";

const modes=[
 {id:"Fridge",label:"Fridge",title:"Show me the fridge",hint:"One shelf or drawer at a time. Good light helps."},
 {id:"Freezer",label:"Freezer",title:"Show me the freezer",hint:"One drawer or labelled prep section at a time."},
 {id:"Pantry",label:"Pantry",title:"Show me the pantry",hint:"One shelf at a time so the useful staples are easy to spot."},
 {id:"Receipt",label:"Receipt",title:"Show me the receipt",hint:"Lay it flat and keep the whole thing readable."},
 {id:"Prep",label:"Prep",title:"Show me the pan",hint:"I can compare colour, gloss and texture with the cooking cue."},
 {id:"Meal",label:"Dinner",title:"Show me dinner",hint:"Save what we actually cooked with the recipe."}
] as const;
type Mode=(typeof modes)[number]["id"];
const levels=["Out","Low","Some","Plenty"];
function scanStep(item:{id:string;category:string;unit:string}){if(item.unit==="count"||item.unit==="portion")return 1;if(item.unit==="ml")return item.category==="Dairy"?100:50;if(item.unit==="g")return item.category==="Protein"?200:item.category==="Fresh"?100:50;return 1}
function compressMealPhoto(file:File){return new Promise<string>((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{try{const render=(max:number,quality:number)=>{const scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("canvas");ctx.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL("image/jpeg",quality)};let data=render(760,.68);if(data.length>440000)data=render(640,.6);if(data.length>440000)data=render(540,.52);URL.revokeObjectURL(url);if(data.length>520000)throw new Error("photo-budget");resolve(data)}catch(e){URL.revokeObjectURL(url);reject(e)}};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("image"))};img.src=url})}

export function Scan(){
 const h=useHousehold();const[mode,setMode]=useState<Mode>("Fridge"),[preview,setPreview]=useState<string>(),[file,setFile]=useState<File>(),[error,setError]=useState(""),[back,setBack]=useState("/"),[nonce,setNonce]=useState(0),[receiptChecked,setReceiptChecked]=useState<string[]>([]),[mealId,setMealId]=useState<string>(),[mealSaving,setMealSaving]=useState(false),[toast,setToast]=useState(""),[changed,setChanged]=useState<Record<string,boolean>>({});
 useEffect(()=>{const p=new URLSearchParams(window.location.search),m=p.get("mode") as Mode|null;if(m&&modes.some(x=>x.id===m))setMode(m);const b=p.get("back");if(b?.startsWith("/"))setBack(b);const meal=p.get("meal");if(meal)setMealId(meal)},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1600)},clear=()=>{if(preview)URL.revokeObjectURL(preview);setPreview(undefined);setFile(undefined);setError("");setNonce(n=>n+1);setReceiptChecked([]);setChanged({})},chooseMode=(m:Mode)=>{clear();setMode(m);feedback("tap")};
 const chooseFile=(f?:File)=>{if(!f)return;clear();if(f.type&&!f.type.startsWith("image/")){setError("That file isn’t an image.");return}if(f.size>16*1024*1024){setError("That photo is very large — try a smaller one.");return}try{setFile(f);setPreview(URL.createObjectURL(f));feedback("change")}catch{setError("That photo couldn’t be opened.")}};
 const current=modes.find(x=>x.id===mode)!,targetMealId=mealId??h.history[0]?.mealId,targetMeal=targetMealId?getLiveRecipeV7(targetMealId):undefined,relevant=useMemo(()=>new Set(h.week.flatMap(rid=>ingredientsForRecipeV7(rid).filter(x=>!x.optional).map(canonicalIngredientIdForRuntimeV7))),[h.week]);
 const quick=useMemo(()=>ingredients.filter(i=>mode==="Pantry"?i.category==="Pantry":["Fresh","Protein","Dairy"].includes(i.category)).sort((a,b)=>Number(relevant.has(b.id))-Number(relevant.has(a.id))||Number((h.ingredientStock[b.id]??0)>0)-Number((h.ingredientStock[a.id]??0)>0)||a.name.localeCompare(b.name)).slice(0,12),[mode,relevant,h.ingredientStock]);
 const adjust=(id:string,delta:number)=>{const item=getIngredientUiV7(id);if(!item)return;const cur=h.ingredientStock[id]??0;h.setIngredient(id,item.tracking==="state"?Math.max(0,Math.min(3,cur+delta)):Math.max(0,cur+delta*scanStep(item)));setChanged(v=>({...v,[id]:true}));feedback("change")};
 const adjustBase=(id:string,delta:number)=>{const truth=getCanonicalPrepV2(id);if(!truth)return;h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*truth.workingUnit.qty));setChanged(v=>({...v,[id]:true}));feedback("change")};
 const toggleReceipt=(id:string)=>{setReceiptChecked(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);feedback("tap")},addReceipt=()=>{for(const id of receiptChecked){const item=h.shoppingNeeds.find(x=>x.id===id);if(!item)continue;const cur=h.ingredientStock[id]??0;h.setIngredient(id,item.unit==="have"?Math.max(cur,2):cur+item.qty);if(h.groceryChecked[id])h.toggleGrocery(id)}flash(`${receiptChecked.length} added to Kitchen`);setReceiptChecked([]);feedback("success")};
 const saveMeal=async()=>{if(!file||!targetMealId||mealSaving)return;setMealSaving(true);try{h.saveMealPhoto(targetMealId,await compressMealPhoto(file));flash("Saved with dinner");feedback("success")}catch{setError("That photo couldn’t be saved on this phone.")}finally{setMealSaving(false)}};
 const confirmed=Object.keys(changed).length,kitchenTab=mode==="Pantry"?"Pantry":mode==="Freezer"?"Freezer":"Fridge";
 const manualHref=mode==="Meal"?(targetMeal?`/cook/${targetMeal.id}`:"/cook"):mode==="Prep"?(back.startsWith("/prep")||back.startsWith("/cook")?back:"/prep"):"/kitchen";
 const manualLabel=mode==="Meal"?"Our recipes":mode==="Prep"?"Open the cues":"Add it myself";
 const says=(()=>{if(error)return<>{error} Try another photo — nothing has changed.</>;if(mode==="Receipt")return h.shoppingNeeds.length?<>Tick anything from this week’s list that you can see. You decide what gets added.</>:<>The week’s list is already clear. Anything extra can go in through Kitchen.</>;if(mode==="Prep")return<>I can compare colour and texture, but a photo can’t prove food-safe temperature.</>;if(mode==="Meal")return targetMeal?<>Keep this with <b>{recipeTitle(targetMeal.id,targetMeal.title)}</b>?</>:<>Log a dinner first, then we can keep its photo.</>;return<>Use the photo as a reference and tap anything that needs changing{confirmed?` — ${confirmed} changed so far.`:"."}</>})();
 return <div className="hm-scan hm-show-josh">
  <header className="hm-show-top"><Link href={back} className="hm-round" aria-label="Close camera">×</Link><div><span>SHOW ME</span><strong>{current.title}</strong></div><button className="hm-show-ask" aria-label="Ask Home" onClick={()=>window.dispatchEvent(new Event("home-meals:ask"))}>✦</button></header>
  {!preview?<main className="hm-show-launcher">
   <JoshPresenceAnchor priority={70} expression={error?"sheepish":"affectionate"} size={104} observeVisibility={false} className="hm-show-head"/>
   <h1>{current.title}</h1><p>{current.hint}</p>
   <div className="hm-show-modes" role="tablist" data-home-guide="show-josh-modes">{modes.map(m=><button key={m.id} role="tab" aria-selected={mode===m.id} className={mode===m.id?"on":""} onClick={()=>chooseMode(m.id)}>{m.label}</button>)}</div>
   <div className="hm-show-capture" data-home-guide="show-josh-capture">
    <label className="hm-btn primary"><input key={`cam-${nonce}`} type="file" accept="image/*" capture="environment" aria-label="Take a photo" onChange={e=>chooseFile(e.target.files?.[0])}/><Icon name="camera" size={20}/>Take a photo</label>
    <label className="hm-btn ghost"><input key={`lib-${nonce}`} type="file" accept="image/*" aria-label="Choose a photo from the library" onChange={e=>chooseFile(e.target.files?.[0])}/><span aria-hidden="true">▧</span>Choose a photo</label>
   </div>
   <Link className="hm-show-manual" href={manualHref}>{manualLabel} ›</Link>
   <small>{mode==="Prep"||mode==="Meal"?"I can help with what’s visible. Use the recipe’s thermometer check for food safety.":"Nothing goes into Kitchen until you confirm it."}</small>
  </main>:<>
   <div className="hm-show-photo" data-home-guide="show-josh-photo"><img src={preview} alt={`${mode} photo`} onError={()=>{clear();setError("That photo couldn’t be displayed.")}}/><button onClick={clear}>Choose another</button></div>
   <div className="hm-show-note"><JoshPresenceAnchor priority={70} expression={error?"sheepish":"thinking"} size={58} observeVisibility={false}/><div className="hm-bubble">{says}</div></div>
   <div className="hm-scan-panel"><div className="modes" role="tablist">{modes.map(m=><button key={m.id} role="tab" aria-selected={mode===m.id} className={mode===m.id?"on":""} onClick={()=>chooseMode(m.id)}>{m.label}</button>)}</div>
    {(mode==="Fridge"||mode==="Pantry")&&<><SectionHead title={mode==="Fridge"?"What you can see":"Useful staples"} action={<Link href="/kitchen">Full {kitchenTab.toLowerCase()} ›</Link>}/><div className="hm-list tight">{quick.map(item=>{const n=h.ingredientStock[item.id]??0;return<div key={item.id} className="hm-card hm-scan-row"><span><strong>{item.name}</strong><small>{relevant.has(item.id)?"This week":"Kitchen"}{changed[item.id]?" · changed":""}</small></span><div className="hm-stepper"><button className="minus" disabled={n<=0} onClick={()=>adjust(item.id,-1)}>−</button><b>{item.tracking==="state"?levels[Math.min(3,n)]:n>0?formatQty(n,item.unit):"Out"}</b><button className="plus" disabled={item.tracking==="state"&&n>=3} onClick={()=>adjust(item.id,1)}>+</button></div></div>})}</div><div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={clear}>Choose another</button><Link className="hm-btn primary sm" href={back.startsWith("/")?back:"/kitchen"} onClick={()=>{if(confirmed)h.confirmKitchen()}}>{confirmed?`Keep ${confirmed}`:"Done"}</Link></div></>}
    {mode==="Freezer"&&<><SectionHead title="Count the bases" action={<Link href="/kitchen">Full freezer ›</Link>}/><div className="hm-list tight">{motherBases.map(m=>{const truth=getCanonicalPrepV2(m.id);if(!truth)return null;const qty=h.componentStock[m.id]??0,n=stockPortionsV7(m.id,h.componentStock);return<div key={m.id} className="hm-card hm-scan-row" style={{gridTemplateColumns:"10px 1fr auto",gap:12}}><i className="hm-dot" style={{"--tone":toneFor(m.id),width:10,height:44,borderRadius:999,background:toneGradient(m.id)} as CSSProperties}/><span><strong>{m.code}</strong><small>{m.name} · {qty} {truth.workingUnit.unit}{changed[m.id]?" · changed":""}</small></span><div className="hm-stepper"><button className="minus" disabled={qty<=0} onClick={()=>adjustBase(m.id,-1)}>−</button><b>{n}</b><button className="plus" onClick={()=>adjustBase(m.id,1)}>+</button></div></div>})}</div><div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={clear}>Choose another</button><Link className="hm-btn primary sm" href="/kitchen" onClick={()=>{if(confirmed)h.confirmKitchen()}}>{confirmed?`Keep ${confirmed}`:"Done"}</Link></div></>}
    {mode==="Receipt"&&<><SectionHead title="What came home" action={<span className="muted">{receiptChecked.length}/{Math.min(12,h.shoppingNeeds.length)}</span>}/>{h.shoppingNeeds.length?<div className="hm-list tight">{h.shoppingNeeds.slice(0,12).map(item=>{const on=receiptChecked.includes(item.id);return<button key={item.canonicalId} className={`hm-checkrow ${on?"done":""}`} aria-pressed={on} onClick={()=>toggleReceipt(item.id)}><Check on={on}/><span className="name">{ingredientUiNameV7(item.canonicalId)}</span><small>{item.unit==="have"?"restock":formatQty(item.qty,item.unit)}</small></button>})}</div>:<div className="hm-empty"><strong>The list is already clear.</strong>Anything extra goes in through Kitchen.</div>}<div className="acts" style={{marginTop:18}}><button className="hm-btn ghost sm" onClick={clear}>Choose another</button><button className="hm-btn primary sm" disabled={!receiptChecked.length} onClick={addReceipt}>Add {receiptChecked.length||""} to Kitchen</button></div></>}
    {mode==="Prep"&&<><SectionHead title="Compare with the cue" action={<span className="muted">colour · gloss · texture</span>}/><div className="hm-list tight">{motherBases.filter(m=>back.includes(`/prep/${m.id}`)||!back.includes("/prep/")).slice(0,back.includes("/prep/")?1:4).map(m=><Link key={m.id} href={`/prep/${m.id}`} className="hm-card hm-row hm-lift"><span style={{width:44,height:44,borderRadius:14,background:toneGradient(m.id),color:"#fff",fontSize:11,fontWeight:800,display:"grid",placeItems:"center"}}>{m.code}</span><span><strong>{m.name}</strong><small>Open the recipe and visual cues</small></span></Link>)}</div></>}
    {mode==="Meal"&&<><SectionHead title="Dinner photo"/>{targetMeal?<div className="hm-card lg"><strong>{recipeTitle(targetMeal.id,targetMeal.title)}</strong><p className="hm-note">A photo is a memory of dinner, not proof that the inside reached a safe temperature.</p><button className="hm-btn primary full" disabled={!file||mealSaving} onClick={()=>void saveMeal()}>{mealSaving?"Saving…":"Save with dinner"}</button></div>:<div className="hm-empty"><strong>No dinner to attach this to yet.</strong></div>}</>}
   </div>
  </>}
  {toast&&<Toast text={toast}/>} 
 </div>;
}
