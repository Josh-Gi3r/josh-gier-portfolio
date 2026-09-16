"use client";

import Link from "next/link";
import {useMemo,useState,type ReactNode} from "react";
import {useHousehold} from "../HouseholdState";
import {canonicalPrepComponentsV2,type CanonicalPrepComponentV2} from "@/data/food-truth-v2";
import {foundationImages} from "@/data/foundation-assets";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {activePrepSummaryV7,coreMotherIdsV7,prepStarterSetsV7,prepRelationshipLabelV7} from "@/data/prep-repertoire-v7";
import {formatPacketCountV6,getPrepPortionPolicyV6} from "@/data/prep-portioning-v6";
import {prepCategoryImagesV11} from "@/data/prep-category-assets-v11";
import {feedback} from "@/lib/feedback";
import {prepHero} from "@/lib/tones";
import {formatQty,SectionHead} from "./Primitives";

type PrepMode="browse"|"ours"|"week";
const commonIds=["onion","ginger-garlic","garlic","chilli","lemongrass","pesto","duxelles"] as const;
const midBaseForms=new Set(["paste","cooked-base","roux","stock"]);
const sauceForms=new Set(["sauce","marinade","condiment"]);
const prepFallback=foundationImages.prepDay;

function hrefFor(c:CanonicalPrepComponentV2){return c.tier==="mother"?`/prep/${c.id}`:c.tier==="mid"?`/prep/mids/${c.id}`:`/prep/boosters/${c.id}`}
function safePrepImage(src:string|null|undefined){return src??prepFallback}
function repairPrepImage(e:React.SyntheticEvent<HTMLImageElement>){if(e.currentTarget.src!==prepFallback)e.currentTarget.src=prepFallback}
function PrepPhoto({c}:{c:CanonicalPrepComponentV2}){return <img src={safePrepImage(prepHero(c.id))} alt={c.name} loading="lazy" onError={repairPrepImage}/>}

export function PrepV10(){
 const h=useHousehold();
 const[mode,setMode]=useState<PrepMode>("browse"),[showInventory,setShowInventory]=useState(false);
 const active=h.activePrepIds??[],summary=useMemo(()=>activePrepSummaryV7(active),[active]);
 const displayWeek=h.weekStatus==="unplanned"?[]:h.weekStatus==="suggested"&&h.suggestedWeek?.length===7?h.suggestedWeek:h.week;
 const weekIds=useMemo(()=>new Set(displayWeek.flatMap(id=>prepForRecipeAtCookScaleV7(id).map(x=>x.componentId))),[displayWeek]);
 const needsById=useMemo(()=>new Map(h.prepNeeds.map(x=>[x.id,x])),[h.prepNeeds]);
 const core=canonicalPrepComponentsV2.filter(c=>coreMotherIdsV7.includes(c.id));
 const mids=canonicalPrepComponentsV2.filter(c=>c.tier==="mid"&&midBaseForms.has(c.form));
 const sauces=canonicalPrepComponentsV2.filter(c=>c.tier==="mid"&&sauceForms.has(c.form));
 const boosters=canonicalPrepComponentsV2.filter(c=>c.tier==="booster");
 const common=commonIds.map(id=>canonicalPrepComponentsV2.find(c=>c.id===id)).filter((c):c is CanonicalPrepComponentV2=>!!c);
 const activeComponents=canonicalPrepComponentsV2.filter(c=>active.includes(c.id));
 const stocked=canonicalPrepComponentsV2.filter(c=>(h.componentStock[c.id]??0)>0);
 const weekComponents=canonicalPrepComponentsV2.filter(c=>weekIds.has(c.id));
 const weekNeed=weekComponents.filter(c=>needsById.has(c.id));
 const weekCovered=weekComponents.filter(c=>!needsById.has(c.id));
 const packetText=(id:string)=>{const p=getPrepPortionPolicyV6(id),qty=h.componentStock[id]??0;if(!p)return `${qty}`;const n=formatPacketCountV6(qty/p.packet.qty);return `${n} ${n==="1"?"portion":"portions"} · ${formatQty(qty,p.packet.unit)}`};
 const adjustPacket=(id:string,delta:number)=>{const p=getPrepPortionPolicyV6(id);if(!p)return;h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*p.packet.qty));feedback("change")};
 const toggle=(id:string,on:boolean)=>{h.toggleActivePrep(id,on);feedback("change")};
 const setStarter=(ids:readonly string[])=>{h.setActivePrepSet(ids);feedback("success")};
 const setTab=(next:PrepMode)=>{setMode(next);setShowInventory(false);feedback("tap")};
 const categories=[
  {href:"/prep/bases",image:prepCategoryImagesV11.coreBases,kicker:"FOUNDATIONS",title:"Core bases",count:core.length,desc:"The seven foundations we deliberately build meals from."},
  {href:"/prep/mids",image:prepCategoryImagesV11.midBases,kicker:"BUILDERS",title:"Mid bases & pastes",count:mids.length,desc:"Curry pastes, stocks, roux and cooked flavour builders."},
  {href:"/prep/sauces",image:prepCategoryImagesV11.sauces,kicker:"SAUCES",title:"Sauces & condiments",count:sauces.length,desc:"Stir-fry sauces, marinades, tare and finishing condiments."},
  {href:"/prep/boosters",image:prepCategoryImagesV11.boosters,kicker:"BOOSTERS",title:"Boosters",count:boosters.length,desc:"Small aromatic and spice preps that change a whole dinner."},
  {href:"/prep/common",image:prepCategoryImagesV11.common,kicker:"SHORTCUTS",title:"Common prep",count:common.length,desc:"Handy things we reach for often, collected in one place."},
 ] as const;
 const starterImages=[safePrepImage(prepHero("gold")),safePrepImage(prepHero("sambal")),safePrepImage(prepHero("red"))] as const;
 return <div className="hm-screen hm-prep-v10">
  <div className="hm-prep-v10-head hm-gut"><div><span className="hm-eyebrow">Josh &amp; G kitchen</span><h1 className="hm-h1">Prep</h1></div><Link className="hm-btn xs primary" href="/prep/day">Prep Day</Link></div>
  <div className="hm-prep-v10-tabs hm-gut" role="tablist" aria-label="Prep views">
   {(["browse","ours","week"] as const).map(x=><button key={x} role="tab" aria-selected={mode===x} className={mode===x?"on":""} onClick={()=>setTab(x)}>{x==="browse"?"Browse":x==="ours"?"Ours":"This week"}</button>)}
  </div>

  {mode==="browse"&&<section className="hm-prep-v10-view" aria-label="Browse prep">
   <div className="hm-prep-v10-intro hm-gut"><strong>What do you want to prep?</strong><span>Bases, sauces and boosters we can make ahead.</span></div>
   <div className="hm-prep-v10-category-stack">{categories.map(c=><Link key={c.href} href={c.href} className="hm-prep-v10-category" onClick={()=>feedback("tap")}><img src={c.image} alt="" onError={repairPrepImage}/><div className="shade"/><div className="copy"><span>{c.kicker}</span><div className="title"><b>{c.count}</b><h2>{c.title}</h2></div><p>{c.desc}</p><strong>Open →</strong></div></Link>)}</div>
  </section>}

  {mode==="ours"&&<section className="hm-prep-v10-view" aria-label="Our prep and stock">
   <div className="hm-prep-v10-summary hm-gut"><button onClick={()=>setShowInventory(false)}><b>{active.length}</b><span>Our prep</span><small>{summary.unlockedCount} dinners fit</small></button><button onClick={()=>setShowInventory(true)}><b>{stocked.length}</b><span>At home</span><small>in the fridge or freezer</small></button></div>
   {!active.length?<><SectionHead title="Choose our prep" action={<span className="muted">change it anytime</span>}/><div className="hm-prep-v10-starters">{[prepStarterSetsV7.small,prepStarterSetsV7.balanced,prepStarterSetsV7.fullMothers].map((s,i)=><button key={s.id} className={i===0?"featured":""} onClick={()=>setStarter(s.componentIds)}><img src={starterImages[i]??prepFallback} alt="" onError={repairPrepImage}/><div className="shade"/><div><span>{s.componentIds.length} items</span><strong>{i===0?"Start small":s.label}</strong><small>{s.description}</small><b>{activePrepSummaryV7(s.componentIds).unlockedCount} dinners fit →</b></div></button>)}</div></>:<><SectionHead title="Our prep" action={<Link href="/plan" onClick={()=>h.setPlanPreferences("repertoire",h.allowExtraPrep)}>Use this for the week ›</Link>}/><div className="hm-prep-v10-grid">{activeComponents.map(c=><PrepStateCard key={c.id} c={c} stock={h.componentStock[c.id]??0} packetText={packetText(c.id)} secondary={weekIds.has(c.id)?needsById.has(c.id)?`This week · short ${formatQty(needsById.get(c.id)!.shortQty,needsById.get(c.id)!.unit)}`:"This week · covered":prepRelationshipLabelV7(c.id)??"Prep item"} action={<button aria-label={`Pause ${c.name}`} onClick={()=>toggle(c.id,false)}>Pause</button>}/>)}</div></>}
   <SectionHead title="At home" action={<button onClick={()=>setShowInventory(v=>!v)}>{showInventory?"Done":"Edit stock"}</button>}/>
   {!showInventory?(stocked.length?<div className="hm-prep-v10-grid">{stocked.map(c=><PrepStateCard key={c.id} c={c} stock={h.componentStock[c.id]??0} packetText={packetText(c.id)} secondary="In the fridge or freezer"/>)}</div>:<div className="hm-empty"><strong>No prep in the fridge or freezer yet.</strong>Add something here when we actually have it at home.</div>):<div className="hm-prep-v10-stock-edit">{canonicalPrepComponentsV2.map(c=>{const p=getPrepPortionPolicyV6(c.id),qty=h.componentStock[c.id]??0;return <article key={c.id}><Link href={hrefFor(c)} className="photo"><PrepPhoto c={c}/></Link><div className="copy"><strong>{c.code}</strong><small>{c.name}</small><span>{qty>0?packetText(c.id):`none · ${p?formatQty(p.packet.qty,p.packet.unit):"—"}`}</span></div><div className="hm-stock-step"><button aria-label={`Remove one ${c.code} portion`} disabled={qty<=0} onClick={()=>adjustPacket(c.id,-1)}>−</button><b>{p?formatPacketCountV6(qty/p.packet.qty):qty}</b><button aria-label={`Add one ${c.code} portion`} onClick={()=>adjustPacket(c.id,1)}>＋</button></div></article>})}</div>}
  </section>}

  {mode==="week"&&<section className="hm-prep-v10-view" aria-label="This week's prep">
   {h.weekStatus!=="confirmed"?<div className="hm-prep-v10-week-message hm-gut"><span>NO WEEK YET</span><h2>Pick the week first.</h2><p>Once we choose the dinners, I’ll show what prep needs making.</p><Link className="hm-btn primary" href="/plan">Open Plan</Link></div>:<div className="hm-prep-v10-week-message hm-gut ready"><span>THIS WEEK</span><h2>{weekNeed.length?`${weekNeed.length} prep ${weekNeed.length===1?"job":"jobs"} to make.`:"Prep is covered."}</h2><p>{weekNeed.length?"Here’s only the prep we still need to make.":"Nothing needs making unless you want to stock up."}</p><Link className="hm-btn primary" href="/prep/day">Open Prep Day</Link></div>}
   {h.weekStatus==="confirmed"&&weekNeed.length>0&&<><SectionHead title="Need to make"/><div className="hm-prep-v10-tasks">{weekNeed.map(c=>{const need=needsById.get(c.id)!,p=getPrepPortionPolicyV6(c.id);return <Link key={c.id} href={hrefFor(c)} className="hm-prep-v10-task"><div className="photo"><PrepPhoto c={c}/><div className="shade"/><span>{c.code}</span></div><div className="copy"><small>{c.tier==="mother"?"Core base":c.tier==="mid"?"Mid / sauce":"Booster"}</small><h3>{c.name}</h3><strong>{h.weekStatus==="confirmed"?"Need":"Need"} {formatQty(need.shortQty,need.unit)}</strong>{p&&<p>{formatQty(p.packet.qty,p.packet.unit)} per portion</p>}<b>{h.weekStatus==="confirmed"?`Make ${c.code}`:"Open prep"} →</b></div></Link>})}</div></>}
   {h.weekStatus==="confirmed"&&weekCovered.length>0&&<><SectionHead title="Already covered"/><div className="hm-prep-v10-grid compact">{weekCovered.map(c=><PrepStateCard key={c.id} c={c} stock={h.componentStock[c.id]??0} packetText={packetText(c.id)} secondary="Covered for this week"/>)}</div></>}
   {h.weekStatus==="confirmed"&&!weekComponents.length&&<div className="hm-empty"><strong>No make-ahead prep needed this week.</strong>These dinners can be cooked without making a base or sauce first.</div>}
  </section>}
 </div>
}

function PrepStateCard({c,stock,packetText,secondary,action}:{c:CanonicalPrepComponentV2;stock:number;packetText:string;secondary:string;action?:ReactNode}){
 return <article className="hm-prep-v10-state-card"><Link href={hrefFor(c)} className="photo"><PrepPhoto c={c}/><div className="shade"/><span className="code">{c.code}</span>{stock>0&&<span className="stock">have it</span>}</Link><div className="body"><strong>{c.name}</strong><small>{stock>0?packetText:"None here"}</small><span>{secondary}</span>{action}</div></article>
}
