"use client";

import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent} from "@/data/home-data";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {canonicalPrepComponentsV2} from "@/data/food-truth-v2";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {
  activePrepSummaryV7,
  coreMotherIdsV7,
  optionalPrepIdsV7,
  prepExpansionCandidatesV7,
  prepRelationshipLabelV7,
  prepStarterSetsV7,
} from "@/data/prep-repertoire-v7";
import {formatPacketCountV6,getPrepPortionPolicyV6} from "@/data/prep-portioning-v6";
import {feedback} from "@/lib/feedback";
import {prepHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {formatQty,MealTile,SectionHead} from "./Primitives";

type LibraryFocus="core"|"mid"|"booster"|"optional"|null;
const categoryImages={
  core:"/images/prep-v9/core-bases.webp",
  mid:"/images/prep-v9/prep-library.webp",
  booster:"/images/prep-v9/prep-library.webp",
} as const;

function componentHref(id:string,tier:"mother"|"mid"|"booster"){
  return tier==="mother"?`/prep/${id}`:tier==="mid"?`/prep/mids/${id}`:`/prep/boosters/${id}`;
}
function tierName(tier:"mother"|"mid"|"booster"){
  return tier==="mother"?"Core base":tier==="mid"?"Mid & sauce":"Booster";
}
function PrepPhoto({id,name}:{id:string;name:string}){
  const image=prepHero(id);
  return image?<img src={image} alt={name} loading="lazy"/>:<span className="hm-prep-v9-fallback" style={{background:toneGradient(id)}}/>;
}

export function PrepV9(){
  const h=useHousehold();
  const[showInventory,setShowInventory]=useState(false);
  const[libraryOpen,setLibraryOpen]=useState(false);
  const[libraryFocus,setLibraryFocus]=useState<LibraryFocus>(null);
  const active=h.activePrepIds??[];
  const summary=useMemo(()=>activePrepSummaryV7(active),[active]);
  const displayWeek=h.weekStatus==="suggested"&&h.suggestedWeek?.length===7?h.suggestedWeek:h.week;
  const weekIds=useMemo(()=>new Set(displayWeek.flatMap(id=>prepForRecipeAtCookScaleV7(id).map(x=>x.componentId))),[displayWeek]);
  const needsById=useMemo(()=>new Map(h.prepNeeds.map(x=>[x.id,x])),[h.prepNeeds]);
  const activeComponents=canonicalPrepComponentsV2.filter(c=>active.includes(c.id)).sort((a,b)=>a.tier.localeCompare(b.tier)||a.code.localeCompare(b.code));
  const inactiveNeeded=canonicalPrepComponentsV2.filter(c=>weekIds.has(c.id)&&!active.includes(c.id));
  const stockedComponents=canonicalPrepComponentsV2.filter(c=>(h.componentStock[c.id]??0)>0);
  const core=canonicalPrepComponentsV2.filter(c=>coreMotherIdsV7.includes(c.id));
  const mids=canonicalPrepComponentsV2.filter(c=>c.tier==="mid");
  const boosters=canonicalPrepComponentsV2.filter(c=>c.tier==="booster");
  const optional=canonicalPrepComponentsV2.filter(c=>optionalPrepIdsV7.has(c.id as "onion"));
  const unlocked=recipes.filter(r=>summary.unlockedRecipeIds.includes(r.id));
  const expansions=prepExpansionCandidatesV7(active).filter(x=>x.newDinnerCount>0).slice(0,4);
  const actionable=canonicalPrepComponentsV2.filter(c=>weekIds.has(c.id)).sort((a,b)=>Number(!!needsById.get(b.id))-Number(!!needsById.get(a.id))||a.code.localeCompare(b.code));
  const focused=libraryFocus==="core"?core:libraryFocus==="mid"?mids:libraryFocus==="booster"?boosters:libraryFocus==="optional"?optional:[];

  const packetText=(id:string)=>{
    const p=getPrepPortionPolicyV6(id),qty=h.componentStock[id]??0;
    if(!p)return `${qty} recorded`;
    const n=formatPacketCountV6(qty/p.packet.qty);
    const noun=p.kind==="stock-block"?"stock block":p.kind==="booster-dose"?"dose":p.kind==="fridge-portion"?"fridge portion":p.kind==="pantry-dose"?"pantry dose":"packet";
    return `${n} ${noun}${n==="1"?"":"s"} · ${formatQty(qty,p.packet.unit)} total`;
  };
  const adjustPacket=(id:string,delta:number)=>{
    const p=getPrepPortionPolicyV6(id);if(!p)return;
    h.setComponent(id,Math.max(0,(h.componentStock[id]??0)+delta*p.packet.qty));
    feedback("change");
  };
  const setStarter=(ids:readonly string[])=>{h.setActivePrepSet(ids);feedback("success")};
  const toggle=(id:string,on?:boolean)=>{h.toggleActivePrep(id,on);feedback("change")};
  const focusLibrary=(focus:LibraryFocus)=>{setLibraryOpen(true);setLibraryFocus(focus);feedback("tap")};

  const says=(()=>{
    if(!active.length&&stockedComponents.length)return{text:<>You already have <b>{stockedComponents.length}</b> prep {stockedComponents.length===1?"item":"items"} recorded. That is <b>Have now</b>. Choose separately what you want to keep maintaining, or plan around the stock you already have.</>,actions:<><Link className="primary" href="/plan" onClick={()=>h.setPlanPreferences("stock")}>Plan around what we have</Link><button className="ghost" onClick={()=>setShowInventory(true)}>Edit have now</button></>};
    if(!active.length)return{text:<>You do <b>not</b> need all 41 prep items. <b>Have now</b> is physical stock; <b>Our prep</b> is the smaller repertoire you want to maintain.</>,actions:<button className="primary" onClick={()=>setStarter(prepStarterSetsV7.small.componentIds)}>Start small · GOLD · SAMBAL · RED</button>};
    if(inactiveNeeded.length)return{text:<>{h.weekStatus==="confirmed"?"This week":"The preview week"} asks for <b>{inactiveNeeded.slice(0,3).map(x=>x.code).join(", ")}</b> outside your active repertoire. Add them, or rebuild around your chosen prep.</>,actions:<Link className="primary" href="/plan">Review the week</Link>};
    if(h.weekStatus==="confirmed"&&h.prepNeeds.length)return{text:<>Your repertoire is set. Prep next shows only what the confirmed week is actually short of.</>,actions:<Link className="primary" href="/prep/day">Open Prep Day</Link>};
    return{text:<><b>{active.length}</b> prep items are in <b>Our prep</b> and they currently unlock <b>{summary.unlockedCount}</b> of {summary.totalRecipes} dinners. Physical stock remains separate.</>};
  })();

  return <div className="hm-screen hm-prep-v9">
    <div className="hm-prep-v9-head hm-gut"><div><span className="hm-eyebrow">Kitchen foundations</span><h1 className="hm-h1">Prep</h1></div><Link className="hm-btn xs primary" href="/prep/day">Prep Day</Link></div>
    <HomeSays actions={says.actions}>{says.text}</HomeSays>

    <SectionHead title={h.weekStatus==="confirmed"?"Prep next":"Preview prep"} action={<Link href={h.weekStatus==="confirmed"?"/prep/day":"/plan"}>{h.weekStatus==="confirmed"?"Prep Day ›":"Review plan ›"}</Link>}/>
    {actionable.length?<div className="hm-prep-v9-tasks">{actionable.map(c=>{const need=needsById.get(c.id),p=getPrepPortionPolicyV6(c.id),short=need?formatQty(need.shortQty,need.unit):null;return <Link key={c.id} href={componentHref(c.id,c.tier)} className={`hm-prep-v9-task ${need?"urgent":"covered"}`} style={{"--tone":toneFor(c.id)} as CSSProperties} onClick={()=>feedback("tap")}><div className="photo"><PrepPhoto id={c.id} name={c.name}/><div className="shade"/><span className="kind">{tierName(c.tier)}</span></div><div className="copy"><span className="code">{c.code}</span><h3>{c.name}</h3><p>{prepRelationshipLabelV7(c.id)}</p><div className="status"><strong>{h.weekStatus==="confirmed"?(need?`Need ${short}`:"Covered"):(need?`Preview short ${short}`:"Preview covered")}</strong>{p&&<small>{formatQty(p.packet.qty,p.packet.unit)} per storage {p.kind==="stock-block"?"block":p.kind==="booster-dose"?"dose":"packet"}</small>}</div><span className="go">{need&&h.weekStatus==="confirmed"?`Make ${c.code}`:"Open prep"} →</span></div></Link>})}</div>:<div className="hm-empty"><strong>No prep dependencies in this {h.weekStatus==="confirmed"?"week":"preview"}.</strong>The dinners are direct-ingredient dishes.</div>}

    {!active.length?<>
      <SectionHead title="Choose our prep" action={<span className="muted">change it anytime</span>}/>
      <div className="hm-prep-v9-starters">
        {[prepStarterSetsV7.small,prepStarterSetsV7.balanced,prepStarterSetsV7.fullMothers].map((s,i)=>{const ids=s.componentIds,hero=ids[0]?prepHero(ids[0]):undefined;return <button key={s.id} className={`hm-prep-v9-starter ${i===0?"featured":""}`} onClick={()=>setStarter(ids)}>{hero&&<img src={hero} alt=""/>}<div className="shade"/><div className="copy"><span>{ids.length} prep items</span><strong>{i===0?"Start small":s.label}</strong><small>{s.description}</small><b>{activePrepSummaryV7(ids).unlockedCount} dinners fit →</b></div></button>})}
      </div>
    </>:<>
      <SectionHead title="Our prep" action={<span className="muted">{active.length} active · {summary.unlockedCount} dinners</span>}/>
      <div className="hm-prep-v9-rail" aria-label="Our prep">{activeComponents.map(c=>{const need=needsById.get(c.id),qty=h.componentStock[c.id]??0;return <article key={c.id} className="hm-prep-v9-browse"><Link href={componentHref(c.id,c.tier)} className="photo" onClick={()=>feedback("tap")}><PrepPhoto id={c.id} name={c.name}/><div className="shade"/><span className="kind">{tierName(c.tier)}</span>{qty>0&&<span className="stocked">stocked</span>}<div className="photo-copy"><b>{c.code}</b><strong>{c.name}</strong></div></Link><div className="meta"><span><b>{qty>0?packetText(c.id):"None recorded"}</b><small>{weekIds.has(c.id)?need?`${h.weekStatus==="confirmed"?"this week":"preview"} · short ${formatQty(need.shortQty,need.unit)}`:`${h.weekStatus==="confirmed"?"this week":"preview"} · covered`:prepRelationshipLabelV7(c.id)}</small></span><button onClick={()=>toggle(c.id,false)}>Pause</button></div></article>})}</div>
      <Link href="/plan" className="hm-card hm-prep-v9-plan" onClick={()=>h.setPlanPreferences("repertoire",h.allowExtraPrep)}><span><strong>Plan around our prep</strong><small>Prioritise this maintenance repertoire. Home can keep or forbid one useful extra prep.</small></span><b>→</b></Link>
    </>}

    <SectionHead title="Have now" action={<button onClick={()=>setShowInventory(v=>!v)}>{showInventory?"Done":"Edit stock"}</button>}/>
    {!showInventory?(stockedComponents.length?<div className="hm-prep-v9-stock-rail">{stockedComponents.map(c=><Link key={c.id} href={componentHref(c.id,c.tier)} className="hm-prep-v9-stock"><span className="thumb"><PrepPhoto id={c.id} name={c.name}/></span><span><strong>{c.code} · {c.name}</strong><small>{packetText(c.id)}</small></span><b>›</b></Link>)}</div>:<div className="hm-empty"><strong>No prep stock recorded yet.</strong>Tap Edit stock to add packets you already have. This does not add them to “Our prep”.</div>):<div className="hm-prep-v9-stock-grid">{canonicalPrepComponentsV2.map(c=>{const p=getPrepPortionPolicyV6(c.id),qty=h.componentStock[c.id]??0;return <article key={c.id} className="hm-prep-v9-stock-edit"><Link href={componentHref(c.id,c.tier)} className="photo"><PrepPhoto id={c.id} name={c.name}/></Link><div className="copy"><strong>{c.code}</strong><small>{c.name}</small><span>{qty>0?packetText(c.id):`none · ${p?formatQty(p.packet.qty,p.packet.unit):"—"}`}</span></div><div className="hm-stock-step"><button aria-label={`Remove one ${c.code} packet`} disabled={qty<=0} onClick={()=>adjustPacket(c.id,-1)}>−</button><b>{p?formatPacketCountV6(qty/p.packet.qty):qty}</b><button aria-label={`Add one ${c.code} packet`} onClick={()=>adjustPacket(c.id,1)}>＋</button></div></article>})}</div>}

    <SectionHead title="Browse prep library" action={<span className="muted">41 total</span>}/>
    <button className="hm-prep-v9-library-hero" aria-expanded={libraryOpen} onClick={()=>{setLibraryOpen(v=>!v);if(libraryOpen)setLibraryFocus(null);feedback("tap")}}><img src="/images/prep-v9/prep-library.webp" alt="Organised Home Meals prep library"/><div className="shade"/><div className="copy"><span className="hm-kicker">THE FULL CAPABILITY LIBRARY</span><h2>Browse everything we can prep</h2><p>Core foundations, sauces, concentrated boosters and one optional caramelised-onion prep.</p><span className="go">{libraryOpen?"Close library":"Explore library"} →</span></div></button>
    <div className="hm-prep-v9-library-stats" aria-label="Prep library categories"><button onClick={()=>focusLibrary("core")}><b>7</b><span>Core bases</span></button><Link href="/prep/mids"><b>26</b><span>Mids &amp; sauces</span></Link><Link href="/prep/boosters"><b>7</b><span>Boosters</span></Link><button onClick={()=>focusLibrary("optional")}><b>1</b><span>Caramelised onion foundation</span></button></div>

    {libraryOpen&&<div className="hm-prep-v9-library-panel">
      <div className="hm-prep-v9-categories">
        <button className={libraryFocus==="core"?"on":""} onClick={()=>setLibraryFocus("core")}><img src={categoryImages.core} alt=""/><div className="shade"/><span><small>FOUNDATIONS</small><strong>7 Core bases</strong></span></button>
        <Link href="/prep/mids"><img src={categoryImages.mid} alt=""/><div className="shade"/><span><small>SAUCES</small><strong>26 Mids &amp; sauces</strong></span></Link>
        <Link href="/prep/boosters"><img src={categoryImages.booster} alt=""/><div className="shade"/><span><small>FINISHERS</small><strong>7 Boosters</strong></span></Link>
        <button className={libraryFocus==="optional"?"on":""} onClick={()=>setLibraryFocus("optional")}><img src={prepHero("onion")??categoryImages.mid} alt=""/><div className="shade"/><span><small>OPTIONAL</small><strong>Caramelised onion foundation</strong></span></button>
      </div>
      {libraryFocus&&<><SectionHead title={libraryFocus==="core"?"Core bases":libraryFocus==="optional"?"Optional foundation":libraryFocus==="mid"?"Mids & sauces":"Boosters"} action={<button onClick={()=>setLibraryFocus(null)}>Close</button>}/><div className="hm-prep-v9-card-grid">{focused.map(c=>{const on=active.includes(c.id),qty=h.componentStock[c.id]??0;return <article key={c.id} className="hm-prep-v9-card"><Link href={componentHref(c.id,c.tier)} className="photo"><PrepPhoto id={c.id} name={c.name}/><div className="shade"/><span className="code">{c.code}</span>{qty>0&&<span className="stocked">stocked</span>}</Link><div className="body"><strong>{c.name}</strong><small>{prepRelationshipLabelV7(c.id)}</small><button className={on?"on":""} onClick={()=>toggle(c.id,!on)}>{on?"In our prep ✓":"Add to our prep"}</button></div></article>})}</div></>}
    </div>}

    {active.length>0&&<><SectionHead title="What our prep unlocks" action={<Link href="/cook">Browse recipes ›</Link>}/>{unlocked.length?<div className="hm-rail">{unlocked.slice(0,12).map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-empty"><strong>No dinners fit this exact prep set yet.</strong>Try one useful addition below.</div>}{expansions.length>0&&<div className="hm-prep-v9-expansions">{expansions.map(x=>{const c=getComponent(x.componentId);return c?<button key={x.componentId} onClick={()=>toggle(x.componentId,true)}><span><strong>Add {c.code}</strong><small>+{x.newDinnerCount} more {x.newDinnerCount===1?"dinner":"dinners"}</small></span><b>＋</b></button>:null})}</div>}</>}
  </div>;
}
