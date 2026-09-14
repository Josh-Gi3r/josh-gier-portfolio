"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {getComponent,ingredients,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {recipeAvailability} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {toneFor} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {mealMeta,PrepDots,RoundBack,SectionHead,useReadiness} from "./Primitives";

type Mode="prep"|"ingredient"|"ready";
const modes:[Mode,string][]=[["prep","By prep"],["ingredient","By ingredient"],["ready","Ready now"]];

// "From what we have": start from the freezer or the fridge and see which dinners fall out.
export function Builder(){
 const h=useHousehold();const ready=useReadiness();
 const[mode,setMode]=useState<Mode>(h.kitchenReady?"ready":"prep");const[picked,setPicked]=useState<string[]>([]);const[showAll,setShowAll]=useState(false);
 const stockedComponents=useMemo(()=>Array.from(new Set(recipes.flatMap(r=>r.prep.map(p=>p.id)))).filter(id=>(h.componentStock[id]??0)>0),[h.componentStock]);
 const componentChips=stockedComponents.length?stockedComponents:Array.from(new Set(recipes.flatMap(r=>r.motherIds)));
 const stockedIngredients=useMemo(()=>ingredients.filter(i=>(h.ingredientStock[i.id]??0)>0&&i.tracking!=="state").slice(0,24),[h.ingredientStock]);
 const useSoonIds=useMemo(()=>new Set(Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0)),[h.useSoon,h.ingredientStock]);
 const daysSinceCooked=(id:string)=>{const e=h.history.find(x=>x.mealId===id);return e?Math.max(0,Math.floor((Date.now()-new Date(e.at).getTime())/86400000)):9999};
 const recentPenalty=(id:string)=>{const a=daysSinceCooked(id);return a<3?60:a<7?36:a<14?16:a<28?6:0};
 const score=(r:typeof recipes[number])=>{const a=recipeAvailability(r.id,h.componentStock,h.ingredientStock);const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);const soon=r.ingredients.filter(i=>useSoonIds.has(i.id)).length;return a.missingPrep.length*30+a.missingIngredients.length*10+r.minutes-rating*3-soon*18-Number(!!h.favourites[r.id])*6+recentPenalty(r.id)};
 const matches=useMemo(()=>recipes.filter(r=>mode==="ready"?(!h.kitchenReady||recipeAvailability(r.id,h.componentStock,h.ingredientStock).ready):mode==="prep"?(picked.length?picked.some(id=>r.prep.some(p=>p.id===id)):true):(picked.length?picked.some(id=>r.ingredients.some(i=>i.id===id)):true)).sort((a,b)=>score(a)-score(b)),[mode,picked,h.componentStock,h.ingredientStock,h.ratings,h.useSoon,h.favourites,h.kitchenReady,h.history]);
 const list=showAll?matches:matches.slice(0,6);
 const chooseMode=(m:Mode)=>{setMode(m);setPicked([]);setShowAll(false);feedback("tap")};
 const toggle=(id:string)=>{setPicked(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);setShowAll(false);feedback("tap")};
 const pickedLabel=picked.map(id=>mode==="prep"?getComponent(id)?.code:ingredients.find(i=>i.id===id)?.name).filter(Boolean).join(" + ");
 const says=(()=>{
  if(!h.kitchenReady)return {text:<>Until the kitchen’s checked this is a ranking, not a promise. Check it once and “Ready now” becomes real.</>,actions:<Link className="primary" href="/kitchen">Check the kitchen</Link>};
  if(mode==="ready")return {text:matches.length?<>{matches.length} {matches.length===1?"dinner needs":"dinners need"} nothing from the shop. Quickest first.</>:<>Nothing is fully covered right now. Pick a base and I’ll show what’s close.</>,actions:matches.length?undefined:<button className="primary" onClick={()=>chooseMode("prep")}>Start from a base</button>};
  if(mode==="prep")return {text:picked.length?<>With <b>{pickedLabel}</b> in the freezer you can make {matches.length} {matches.length===1?"dinner":"dinners"}. Pick one and I’ll check the fridge for the rest.</>:<>Tap what’s in the freezer and I’ll fan out the dinners it unlocks.</>};
  return {text:picked.length?<>{matches.length} {matches.length===1?"dinner uses":"dinners use"} <b>{pickedLabel}</b>. Use-soon food is pushed up.</>:<>Tap something in the fridge — use-soon things first.</>};
 })();
 const chips=mode==="prep"?componentChips.map(id=>({id,label:getComponent(id)?.code??id,tone:toneFor(id)})):mode==="ingredient"?stockedIngredients.map(i=>({id:i.id,label:useSoonIds.has(i.id)?`◷ ${i.name}`:i.name,tone:useSoonIds.has(i.id)?"var(--peach)":"var(--green)"})):[];
 return <div className="hm-screen">
  <div className="hm-title-row"><RoundBack href="/cook" label="Back to recipes"/><h1 className="hm-h1">From what we have</h1></div>
  <div className="hm-seg sm" role="tablist">{modes.map(([m,label])=><button key={m} role="tab" aria-selected={mode===m} className={mode===m?"on":""} onClick={()=>chooseMode(m)}>{label}</button>)}</div>
  {chips.length>0&&<div className="hm-chips" style={{marginTop:14}}>{chips.map(c=>{const on=picked.includes(c.id);return <button key={c.id} className={`hm-chip ${on?"on":""}`} aria-pressed={on} style={{"--tone":c.tone} as CSSProperties} onClick={()=>toggle(c.id)}><i className="dot" style={on?{background:"#fff"}:undefined}/>{c.label}</button>})}</div>}
  {mode!=="ready"&&chips.length===0&&<div className="hm-empty"><strong>Nothing counted yet.</strong>{mode==="prep"?"Count the freezer and the bases show up here.":"Fill in the fridge and the ingredients show up here."}<br/><Link href="/kitchen">Open Kitchen ›</Link></div>}
  <HomeSays className="tight" actions={says.actions}>{says.text}</HomeSays>
  <SectionHead title={`${matches.length} ${matches.length===1?"dinner":"dinners"}`} action={<span className="muted">{mode==="ready"?"quickest first":"best coverage first"}</span>}/>
  {list.length?<div className="hm-list">{list.map(r=>{const rd=ready(r);const title=recipeTitle(r.id,r.title);return <Link key={r.id} href={`/cook/${r.id}`} className="hm-card lg hm-row hm-lift" style={{gridTemplateColumns:"84px 1fr",padding:8}} onClick={()=>feedback("tap")}>{r.image?<img className="thumb lg" src={r.image} alt="" loading="lazy"/>:<span className="thumb lg" style={{background:"#dfe8e2"}}/>}<span><strong>{title}</strong><small>{mealMeta(r)}</small><span style={{display:"flex",gap:5,marginTop:8,alignItems:"center"}}><PrepDots recipe={r}/><span className={`hm-pill ${rd.pillClass}`} style={{marginLeft:4}}>{rd.label}</span></span></span></Link>})}</div>
  :<div className="hm-empty"><strong>Nothing matches that combination yet.</strong>Try fewer picks, or swap a dinner in the plan.<br/><Link href="/plan">Open the week ›</Link></div>}
  {matches.length>6&&<button className="hm-builder-more" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${matches.length}`}</button>}
 </div>;
}
