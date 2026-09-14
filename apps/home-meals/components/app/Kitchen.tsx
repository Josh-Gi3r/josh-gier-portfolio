"use client";
import Link from "next/link";
import {useMemo,useRef,useState,type CSSProperties} from "react";
import {getComponent,getRecipe,ingredients,motherBases,prepComponents,type IngredientDef} from "@/data/home-data";
import {foundationImages} from "@/data/foundation-assets";
import {stockPortions} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,SectionHead} from "./Primitives";
import {ageDays,ComponentSheet,levelOf,levelQty,levels,StockSheet} from "./StockSheets";

const tabs=["Fridge","Freezer","Pantry"] as const;
type Tab=typeof tabs[number];
const pctOf=(level:number)=>[12,38,62,88][level];
const bars=["linear-gradient(90deg,#ffb48f,#ff8a5c)","linear-gradient(90deg,#ffb48f,#ff8a5c)","linear-gradient(90deg,#6fd39a,#2fae6e)","linear-gradient(90deg,#a8e6c3,#4cc487)"];

export function Kitchen(){
 const h=useHousehold();
 const[tab,setTab]=useState<Tab>("Fridge");const[q,setQ]=useState("");const[showAll,setShowAll]=useState(false);const[edit,setEdit]=useState<string|null>(null);const[editComponent,setEditComponent]=useState<string|null>(null);
 const relevantIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).ingredients.map(x=>x.id))),[h.week]);
 const list=ingredients.filter(i=>tab==="Fridge"?["Fresh","Protein","Dairy"].includes(i.category):tab==="Pantry"&&i.category==="Pantry").filter(i=>!q||i.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(!!h.useSoon[b.id])-Number(!!h.useSoon[a.id])||(h.useSoon[a.id]&&h.useSoon[b.id]?new Date(h.useSoonAt[a.id]??0).getTime()-new Date(h.useSoonAt[b.id]??0).getTime():0)||Number(relevantIds.has(b.id))-Number(relevantIds.has(a.id))||Number((h.ingredientStock[b.id]??0)>0)-Number((h.ingredientStock[a.id]??0)>0)||a.name.localeCompare(b.name));
 const priority=list.filter(i=>h.useSoon[i.id]||relevantIds.has(i.id)||(h.ingredientStock[i.id]??0)>0);
 const shown=q||showAll?list:(priority.length?priority:list).slice(0,12);
 const stockedFridge=ingredients.filter(i=>["Fresh","Protein","Dairy"].includes(i.category)&&(h.ingredientStock[i.id]??0)>0);
 const useSoon=stockedFridge.filter(i=>h.useSoon[i.id]).sort((a,b)=>new Date(h.useSoonAt[a.id]??0).getTime()-new Date(h.useSoonAt[b.id]??0).getTime());
 const uncoveredSoon=useSoon.filter(i=>!h.week.some(rid=>getRecipe(rid).ingredients.some(x=>x.id===i.id)));
 const lowPantry=ingredients.filter(i=>i.category==="Pantry"&&i.tracking==="state"&&(h.ingredientStock[i.id]??0)===1);
 const pucks=motherBases.reduce((n,m)=>n+stockPortions(m.id,h.componentStock),0);const stockedMothers=motherBases.filter(m=>(h.componentStock[m.id]??0)>0).length;
 const activeBatches=h.prepBatches.filter(b=>(b.remainingMl??b.outputMl)>0).sort((a,b)=>new Date(a.at).getTime()-new Date(b.at).getTime());const oldest=activeBatches[0];const oldestC=oldest?getComponent(oldest.componentId):null;
 const lowMother=motherBases.find(m=>h.week.some(id=>getRecipe(id).motherIds.includes(m.id))&&stockPortions(m.id,h.componentStock)<2);
 const switchTab=(t:Tab)=>{setTab(t);setQ("");setShowAll(false);feedback("tap")};
 const scanHref=`/scan?mode=${tab}&back=${encodeURIComponent("/kitchen")}`;
 const setLevel=(item:IngredientDef,level:number)=>{h.setIngredient(item.id,levelQty(item,level));feedback("change")};
 const hero={Fridge:{img:foundationImages.groceries,heading:h.kitchenReady?(useSoon.length?"Use soon first":"Nothing urgent"):"Show me the fridge",sub:h.kitchenReady?(useSoon.length?`${useSoon.length} ${useSoon.length===1?"thing needs":"things need"} a dinner`:`${stockedFridge.length} things in the fridge`):"once, and the week gets real"},
  Freezer:{img:foundationImages.freezer,heading:h.kitchenReady?`${stockedMothers} bases · ${pucks} portions`:"Count the bases",sub:h.kitchenReady?(oldest&&oldestC?`oldest first: ${oldestC.code} from ${new Date(oldest.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})}`:lowMother?`${lowMother.code} is low for this week`:"all dated batches used in order"):"pucks and cubes, per base"},
  Pantry:{img:foundationImages.cubes,heading:h.kitchenReady?(lowPantry.length?"Running low":"Pantry looks fine"):"Just the staples",sub:h.kitchenReady?(lowPantry.length?`${lowPantry.slice(0,3).map(i=>i.name).join(", ")}`:"only what changes dinner"):"Plenty · Some · Low · Out is enough"}}[tab];
 const says=(()=>{
  if(!h.kitchenReady)return {text:<>Teach me the kitchen once. Levels are enough for sauces and staples — exact amounts only where they change dinner.</>,actions:<><button className="primary" onClick={()=>{h.confirmKitchen();feedback("success")}}>Kitchen checked</button><Link className="ghost" href={scanHref}>Use the camera</Link></>};
  if(tab==="Fridge"){if(uncoveredSoon.length){const i=uncoveredSoon[0];const age=ageDays(h.useSoonAt[i.id]);return {text:<><b>{i.name}</b>{age?` has been marked ${age} ${age===1?"day":"days"}`:" is marked use soon"} and nothing this week uses it. Want me to fit it in?</>,actions:<><Link className="primary" href="/plan">Fit it in</Link><button className="ghost" onClick={()=>{h.toggleUseSoon(i.id);feedback("change")}}>It’s fine</button></>}}if(useSoon.length){const i=useSoon[0];const dayIdx=h.week.findIndex(rid=>getRecipe(rid).ingredients.some(x=>x.id===i.id));return {text:<><b>{i.name}</b> is covered — {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][dayIdx]}’s dinner uses it.</>}}return {text:<>Nothing is marked use soon. Tap anything to update it, or drag a handle.</>}}
  if(tab==="Freezer"){if(lowMother)return {text:<><b>{lowMother.code}</b> is down to {stockPortions(lowMother.id,h.componentStock)} and this week wants it. Prep Sunday fixes it.</>,actions:<><Link className="primary" href="/prep/day">Book Sunday</Link><Link className="ghost" href={`/prep/${lowMother.id}`}>Open {lowMother.code}</Link></>};if(oldest&&oldestC)return {text:<><b>{oldestC.code}</b> from {new Date(oldest.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} is the oldest — use it first.</>,actions:<Link className="primary" href="/cook/builder">Cook from it</Link>};return {text:<>The bases are in good shape for this week. Tap a row to count pucks.</>}}
  if(lowPantry.length)return {text:<>{lowPantry.slice(0,2).map(i=>i.name).join(" and ")} {lowPantry.length===1?"is":"are"} low — one bottle each covers the month.</>,actions:<Link className="primary" href="/plan">Add to the list</Link>};
  return {text:<>Pantry levels look fine for the current week.</>};
 })();
 const editItem=edit?ingredients.find(i=>i.id===edit):null;

 return <div className="hm-screen">
  <div className="hm-kitchen-head"><h1 className="hm-h1">Kitchen</h1><Link className="hm-btn xs primary" href={scanHref} onClick={()=>feedback("tap")}>Scan the {tab.toLowerCase()}</Link></div>
  <div className="hm-seg" role="tablist" aria-label="Kitchen area">{tabs.map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?"on":""} onClick={()=>switchTab(t)}>{t}</button>)}</div>
  <div className="hm-kitchen-hero" key={tab}><img src={hero.img} alt=""/><div className="shade"/><div className="copy"><h3>{hero.heading}</h3><p>{hero.sub}</p></div></div>
  <HomeSays className="tight" actions={says.actions}>{says.text}</HomeSays>

  {tab==="Freezer"?<>
   <div className="hm-card lg hm-wheel-card">
    <div className="hm-wheel" style={{background:wheel(h.componentStock)}}><div className="inner"><div><b>{pucks}</b><span>portions ready</span>{lowMother&&<small>{lowMother.code} low</small>}</div></div></div>
    <div className="hm-wheel-legend">{motherBases.map(m=><span key={m.id} style={{"--tone":toneFor(m.id)} as CSSProperties}><i/>{m.code} <small>{stockPortions(m.id,h.componentStock)}</small></span>)}</div>
   </div>
   <div className="hm-list">{motherBases.map(m=>{const n=stockPortions(m.id,h.componentStock);const hero=motherHero(m.id);const old=activeBatches.find(b=>b.componentId===m.id);const planned=h.week.some(id=>getRecipe(id).motherIds.includes(m.id));return <div key={m.id} className="hm-card hm-freezer-row" style={{"--tone":toneFor(m.id),"--tone-grad":toneGradient(m.id)} as CSSProperties}>
    <button className="thumb" onClick={()=>{setEditComponent(m.id);feedback("tap")}} aria-label={`Update ${m.code}`} style={{overflow:"hidden",padding:0}}>{hero?<img src={hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:m.code}</button>
    <button style={{textAlign:"left",minWidth:0}} onClick={()=>{setEditComponent(m.id);feedback("tap")}}><strong>{m.code} <small>· {m.name}</small></strong><div className="hm-segs" aria-hidden="true">{[0,1,2,3,4,5,6,7].map(i=><i key={i} className={i<n?"on":""}/>)}</div><span className="sub">{n<=0?"Out":n<2&&planned?"Low · Prep Sunday":old?`oldest ${new Date(old.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})} · use first`:planned?"used this week":"good"}</span></button>
    <div className="hm-stepper"><button className="minus" aria-label={`One less ${m.code}`} onClick={()=>{h.setComponent(m.id,Math.max(0,(h.componentStock[m.id]??0)-m.portionMl));feedback("change")}}>−</button><b>{n}</b><button className="plus" aria-label={`One more ${m.code}`} onClick={()=>{h.setComponent(m.id,(h.componentStock[m.id]??0)+m.portionMl);feedback("change")}}>+</button></div>
   </div>})}</div>
   <MidsAndBoosters onEdit={id=>setEditComponent(id)}/>
  </>:<>
   <label className="hm-search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Find in the ${tab.toLowerCase()}`} aria-label={`Find in the ${tab.toLowerCase()}`}/>{q&&<button type="button" className="clear" aria-label="Clear" onClick={()=>setQ("")}>×</button>}</label>
   <div className="hm-list">{shown.map(item=>{const n=h.ingredientStock[item.id]??0;const level=levelOf(item,n);const soon=!!h.useSoon[item.id];const age=ageDays(h.useSoonAt[item.id]);const relevant=relevantIds.has(item.id);
    const tag=soon?{label:age?`${age} ${age===1?"day":"days"}`:"Use soon",cls:"peach"}:relevant?{label:"This week",cls:""}:level===1?{label:"Low",cls:"peach"}:level===0?{label:"Out",cls:"neutral"}:{label:"Fine",cls:"sky"};
    return <div key={item.id} className="hm-card hm-stock" style={{padding:0}}>
     <button style={{textAlign:"left",padding:"14px 0 14px 16px",minWidth:0}} onClick={()=>{setEdit(item.id);feedback("tap")}} aria-label={`Update ${item.name}`}>
      <div className="name"><strong>{item.name}</strong><span className={`hm-pill ${tag.cls}`}>{tag.label}</span></div>
      <LevelBar level={level} onChange={l=>setLevel(item,l)} label={item.name}/>
      <div className="hm-level-labels">{levels.map((l,i)=><span key={l} className={i===level?"on":""}>{l}</span>)}</div>
     </button>
     <button className="qty" style={{padding:"14px 16px 14px 0"}} onClick={()=>{setEdit(item.id);feedback("tap")}} aria-label={`Update ${item.name} amount`}>{item.tracking==="state"?levels[level]:n>0?formatQty(n,item.unit):"Out"}<small>{item.tracking==="state"?"level":"tap for exact"}</small></button>
    </div>})}</div>
   {!q&&list.length>shown.length&&<button className="hm-cook-more" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show less":`Show all ${list.length}`}</button>}
   {shown.length===0&&<div className="hm-empty"><strong>Nothing matches.</strong>Try another name or clear the search.</div>}
   <p className="hm-kitchen-foot">Drag the handle · tap for exact · or just tell Home</p>
  </>}
  <div className="hm-gut" style={{marginTop:18}}><button className="hm-btn ghost full sm" onClick={()=>{h.confirmKitchen();feedback("success")}}>{h.kitchenReady?"Kitchen up to date ✓":"Kitchen checked ✓"}</button></div>

  <StockSheet item={editItem??null} onClose={()=>setEdit(null)}/>
  <ComponentSheet id={editComponent} onClose={()=>setEditComponent(null)}/>
 </div>;
}

function wheel(stock:Record<string,number>){const parts=motherBases.map(m=>({tone:toneFor(m.id),n:stockPortions(m.id,stock)}));const total=parts.reduce((s,p)=>s+p.n,0);if(!total)return "conic-gradient(#e6ece8 0 100%)";let acc=0;return `conic-gradient(${parts.filter(p=>p.n).map(p=>{const from=acc/total*100;acc+=p.n;return `${p.tone} ${from}% ${acc/total*100}%`}).join(",")})`}

function LevelBar({level,onChange,label}:{level:number;onChange:(l:number)=>void;label:string}){
 const ref=useRef<HTMLDivElement>(null);
 const pick=(clientX:number)=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const x=Math.max(0,Math.min(1,(clientX-r.left)/r.width));onChange(Math.min(3,Math.floor(x*4)))};
 return <div ref={ref} className="hm-level" role="slider" aria-label={`${label} level`} aria-valuemin={0} aria-valuemax={3} aria-valuenow={level} aria-valuetext={levels[level]} tabIndex={0}
  onPointerDown={e=>{e.stopPropagation();(e.target as HTMLElement).setPointerCapture?.(e.pointerId);pick(e.clientX)}} onPointerMove={e=>{if(e.buttons)pick(e.clientX)}} onClick={e=>e.stopPropagation()}
  onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();onChange(Math.min(3,level+1))}if(e.key==="ArrowLeft"){e.preventDefault();onChange(Math.max(0,level-1))}}}>
  <div className="fill" style={{width:`${pctOf(level)}%`,"--bar":bars[level]} as CSSProperties}/><div className="knob" style={{left:`calc(${pctOf(level)}% - 26px)`}}/>
 </div>;
}

function MidsAndBoosters({onEdit}:{onEdit:(id:string)=>void}){
 const h=useHousehold();const[more,setMore]=useState(false);
 const activeIds=new Set(h.week.flatMap(id=>getRecipe(id).prep.map(x=>x.id)));
 const other=prepComponents.filter(c=>c.kind!=="mother").sort((a,b)=>Number(activeIds.has(b.id))-Number(activeIds.has(a.id))||Number((h.componentStock[b.id]??0)>0)-Number((h.componentStock[a.id]??0)>0)||a.code.localeCompare(b.code));
 const shown=more?other:other.filter(x=>activeIds.has(x.id)||(h.componentStock[x.id]??0)>0).slice(0,8);
 return <>
  <SectionHead title="Mids & boosters" action={<Link href="/prep/mids">Explore ›</Link>}/>
  {shown.length?<div className="hm-list tight">{shown.map(c=>{const n=stockPortions(c.id,h.componentStock);return <div key={c.id} className="hm-card hm-row" style={{padding:"8px 14px 8px 10px"}}>
   <button className="hm-dot" style={{"--tone":toneFor(c.id),width:44,height:44,borderRadius:14,background:toneGradient(c.id),color:"#fff",fontSize:10,fontWeight:800,display:"grid",placeItems:"center"} as CSSProperties} onClick={()=>onEdit(c.id)} aria-label={`Update ${c.code}`}>{c.code.length>5?c.code.slice(0,5):c.code}</button>
   <button style={{textAlign:"left",minWidth:0}} onClick={()=>onEdit(c.id)}><strong>{c.code}</strong><small>{c.name}{activeIds.has(c.id)?" · this week":""}</small></button>
   <div className="hm-stepper"><button className="minus" aria-label={`One less ${c.code}`} onClick={()=>{h.setComponent(c.id,Math.max(0,(h.componentStock[c.id]??0)-c.portionMl));feedback("change")}}>−</button><b>{n}</b><button className="plus" aria-label={`One more ${c.code}`} onClick={()=>{h.setComponent(c.id,(h.componentStock[c.id]??0)+c.portionMl);feedback("change")}}>+</button></div>
  </div>})}</div>:<div className="hm-empty"><strong>No mids or boosters counted yet.</strong>This week doesn’t need any — add them when you make a batch.</div>}
  <button className="hm-cook-more" onClick={()=>{setMore(v=>!v);feedback("tap")}}>{more?"Show less":`Show all ${other.length}`}</button>
 </>;
}
