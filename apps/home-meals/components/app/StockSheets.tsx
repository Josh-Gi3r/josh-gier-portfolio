"use client";
import Link from "next/link";
import {useEffect,useRef} from "react";
import {getComponent,type IngredientDef} from "@/data/home-data";
import {getCanonicalPrepV2} from "@/data/food-truth-v2";
import {stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {prepHero,portionWord,toneGradient} from "@/lib/tones";
import {Sheet} from "./Primitives";

export const levels=["Out","Low","Some","Plenty"];
const smallHerbs=new Set(["coriander","parsley","thai-basil"]);
export function stepFor(item:IngredientDef){if(item.unit==="count"||item.unit==="portion")return 1;if(item.unit==="ml")return item.category==="Dairy"?50:25;if(item.unit==="g"){if(smallHerbs.has(item.id))return 10;if(item.category==="Protein"||item.category==="Fresh")return 100;return 50}return 1}
export function levelOf(item:IngredientDef,n:number){if(item.tracking==="state")return Math.max(0,Math.min(3,n));const s=stepFor(item);return n<=0?0:n<2*s?1:n<4*s?2:3}
export const levelQty=(item:IngredientDef,level:number)=>item.tracking==="state"?level:[0,1,3,5][level]*stepFor(item);
export function ageDays(at?:string){return at?Math.max(0,Math.floor((Date.now()-new Date(at).getTime())/86400000)):null}
export function useHold(fn:()=>void){const t=useRef<ReturnType<typeof setInterval>|null>(null);const stop=()=>{if(t.current){clearInterval(t.current);t.current=null}};useEffect(()=>stop,[]);return {onPointerDown:()=>{fn();stop();t.current=setInterval(fn,160)},onPointerUp:stop,onPointerLeave:stop,onPointerCancel:stop}}

export function StockEditor({item,onDone}:{item:IngredientDef;onDone:()=>void}){
 const h=useHousehold();const n=h.ingredientStock[item.id]??0;const step=stepFor(item);const level=levelOf(item,n);const soon=!!h.useSoon[item.id];const age=ageDays(h.useSoonAt[item.id]);
 const set=(v:number)=>{h.setIngredient(item.id,Math.max(0,item.tracking==="state"?Math.min(3,v):v));feedback("change")};
 const dec=useHold(()=>set((h.ingredientStock[item.id]??0)-(item.tracking==="state"?1:step)));const inc=useHold(()=>set((h.ingredientStock[item.id]??0)+(item.tracking==="state"?1:step)));
 const place=["Fresh","Protein","Dairy"].includes(item.category)?"Fridge":"Pantry";
 return <>
  <div className="item"><div className="ic">{item.name[0]}</div><div><h3>{item.name}</h3><small>{place}{soon?` · marked use soon ${age?`${age} ${age===1?"day":"days"} ago`:"today"}`:""}</small></div></div>
  <div className="big"><button className="minus" aria-label="Less" {...dec}>−</button><div className="val"><b>{item.tracking==="state"?levels[level]:Math.round(n*10)/10}</b><small>{item.tracking==="state"?"qualitative level":`${item.unit==="count"?"count":item.unit==="portion"?"portions":item.unit} · hold to count fast`}</small></div><button className="plus" aria-label="More" {...inc}>+</button></div>
  <div className="hm-levels">{levels.map((l,i)=><button key={l} className={i===level?"on":""} onClick={()=>set(levelQty(item,i))}>{l}</button>)}</div>
  <div className="acts">{place==="Fridge"?<button className={`soon ${soon?"on":""}`} disabled={n<=0} onClick={()=>{h.toggleUseSoon(item.id);feedback("change")}}>{soon?"Use soon ✓":"Use soon ◷"}</button>:<span/>}<button onClick={()=>set(0)}>Threw it out</button></div>
  <button className="hm-btn primary full" style={{marginTop:18,height:56}} onClick={onDone}>Done</button>
 </>;
}

export function ComponentEditor({id,onDone}:{id:string;onDone:()=>void}){
 const h=useHousehold();const c=getComponent(id)!;const truth=getCanonicalPrepV2(id);if(!truth)return null;const qty=h.componentStock[id]??0;const n=stockPortions(id,h.componentStock);const hero=prepHero(id);
 const set=(portions:number)=>{h.setComponent(id,Math.max(0,portions)*truth.workingUnit.qty);feedback("change")};
 const dec=useHold(()=>set(stockPortions(id,h.componentStock)-1));const inc=useHold(()=>set(stockPortions(id,h.componentStock)+1));
 const batches=h.prepBatches.filter(b=>b.componentId===id&&b.remaining.qty>0).sort((a,b)=>new Date(a.producedAt).getTime()-new Date(b.producedAt).getTime());
 return <>
  <div className="item"><div className="ic" style={{background:toneGradient(id),color:"#fff",fontSize:13,overflow:"hidden"}}>{hero?<img src={hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:c.code}</div><div><h3>{c.code}</h3><small>{c.name} · {truth.workingUnit.qty} {truth.workingUnit.unit} per working {portionWord(id)}{batches[0]?` · oldest ${new Date(batches[0].producedAt).toLocaleDateString(undefined,{day:"numeric",month:"short"})}`:""}</small></div></div>
  <div className="big"><button className="minus" aria-label="One less" {...dec}>−</button><div className="val"><b>{n}</b><small>{portionWord(id,n)} · {qty} {truth.workingUnit.unit} · hold to count fast</small></div><button className="plus" aria-label="One more" {...inc}>+</button></div>
  <div className="acts"><Link className="hm-btn ghost" style={{height:52,fontSize:14}} href={c.kind==="mother"?`/prep/${id}`:c.kind==="mid"?`/prep/mids/${id}`:`/prep/boosters/${id}`} onClick={onDone}>Open {c.code}</Link><button onClick={()=>set(0)}>Used it all</button></div>
  <button className="hm-btn primary full" style={{marginTop:18,height:56}} onClick={onDone}>Done</button>
 </>;
}

export function StockSheet({item,onClose}:{item:IngredientDef|null;onClose:()=>void}){return <Sheet open={!!item} onClose={onClose} label="Update stock" title="Update" action={<span className="muted">tap outside to close</span>} className="hm-stock-sheet">{item&&<StockEditor item={item} onDone={onClose}/>}</Sheet>}
export function ComponentSheet({id,onClose}:{id:string|null;onClose:()=>void}){return <Sheet open={!!id&&!!getComponent(id)} onClose={onClose} label="Update freezer stock" title="Update" action={<span className="muted">tap outside to close</span>} className="hm-stock-sheet">{id&&getComponent(id)&&<ComponentEditor id={id} onDone={onClose}/>}</Sheet>}
