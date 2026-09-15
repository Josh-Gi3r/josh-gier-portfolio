"use client";

import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {canonicalPrepComponentsV2} from "@/data/food-truth-v2";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {coreMotherIdsV7,prepRelationshipLabelV7} from "@/data/prep-repertoire-v7";
import {motherBases} from "@/data/home-data";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,prepHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {MealTile,RoundBack,SectionHead} from "./Primitives";

const mids=canonicalPrepComponentsV2.filter(x=>x.tier==="mid");
const coreMothers=motherBases.filter(m=>coreMotherIdsV7.includes(m.id));
const dinnersFor=(componentId:string)=>recipes.filter(r=>prepForRecipeAtCookScaleV7(r.id).some(x=>x.componentId===componentId));
function MidPhoto({id,name}:{id:string;name:string}){const hero=prepHero(id);return hero?<img src={hero} alt={name} loading="lazy"/>:<span style={{background:toneGradient(id)}}/>}

export function MidsV9(){
  const h=useHousehold();
  const[selected,setSelected]=useState(coreMothers.find(m=>m.id==="gold")?.id??coreMothers[0].id);
  const[q,setQ]=useState("");
  const[showAll,setShowAll]=useState(false);
  const mother=coreMothers.find(x=>x.id===selected)??coreMothers[0];
  const weekIds=useMemo(()=>new Set(h.week.flatMap(id=>prepForRecipeAtCookScaleV7(id).map(x=>x.componentId))),[h.week]);
  const related=useMemo(()=>mids.filter(x=>x.madeFrom.includes(mother.id)||x.usedWith.includes(mother.id)),[mother.id]);
  const dinners=useMemo(()=>{const ids=new Set(related.map(x=>x.id));return recipes.filter(r=>prepForRecipeAtCookScaleV7(r.id).some(x=>ids.has(x.componentId)||x.componentId===mother.id))},[mother.id,related]);
  const standalone=mids.filter(m=>m.madeFrom.length===0&&m.usedWith.length===0);
  const all=mids.filter(m=>!q||`${m.code} ${m.name}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(weekIds.has(b.id))-Number(weekIds.has(a.id))||dinnersFor(b.id).length-dinnersFor(a.id).length||a.name.localeCompare(b.name));
  const shownAll=q||showAll?all:all.slice(0,10);
  const weekMids=mids.filter(m=>weekIds.has(m.id));
  const toggle=(id:string,on?:boolean)=>{h.toggleActivePrep(id,on);feedback("change")};
  return <div className="hm-screen hm-mids-v9">
    <div className="hm-title-row"><RoundBack href="/prep" label="Back to prep"/><div><span className="hm-eyebrow">Prep library</span><h1 className="hm-h1">Mids &amp; sauces</h1></div></div>
    <div className="hm-mids-v9-hero"><img src="/images/prep-v9/prep-library.webp" alt="An organised spread of Home Meals mids and sauces"/><div className="shade"/><div className="copy"><span>26 SAUCES &amp; MIDS</span><h2>More range from the prep you already love.</h2><p>Some are made from a core base, some pair with one, and some stand alone.</p></div></div>
    <HomeSays className="tight">{weekMids.length?<><b>{weekMids.map(x=>x.code).join(", ")}</b> {weekMids.length===1?"is":"are"} in this week. The rest are repertoire, not homework.</>:<>Nothing in this week needs a mid. Browse by the base you already maintain, or pick a standalone sauce worth keeping.</>}</HomeSays>

    {weekMids.length>0&&<><SectionHead title="This week" action={<span className="muted">tap to open</span>}/><div className="hm-mids-v9-featured">{weekMids.map(m=>{const n=dinnersFor(m.id).length,active=h.activePrepIds.includes(m.id);return <article key={m.id} className="hm-mids-v9-feature"><Link href={`/prep/mids/${m.id}`} className="photo"><MidPhoto id={m.id} name={m.name}/><div className="shade"/><span className="code">{m.code}</span><span className="week">THIS WEEK</span></Link><div className="body"><strong>{m.name}</strong><small>{prepRelationshipLabelV7(m.id)} · {n} {n===1?"dinner":"dinners"}</small><button className={active?"on":""} onClick={()=>toggle(m.id,!active)}>{active?"In our prep ✓":"Add to our prep"}</button></div></article>})}</div></>}

    <SectionHead title="Browse by core base" action={<span className="muted">swipe</span>}/>
    <div className="hm-mids-v9-mother-rail" aria-label="Choose a core base">{coreMothers.map(m=>{const on=m.id===mother.id,hero=motherHero(m.id);return <button key={m.id} className={on?"on":""} aria-pressed={on} style={{"--tone":toneFor(m.id)} as CSSProperties} onClick={()=>{setSelected(m.id);feedback("tap")}}><span className="photo">{hero?<img src={hero} alt=""/>:<span style={{background:toneGradient(m.id)}}/>}</span><span><strong>{m.code}</strong><small>{m.name}</small></span></button>})}</div>

    <div className="hm-mids-v9-related"><div className="head"><span><small>WITH {mother.code}</small><h2>{related.length?`${related.length} related ${related.length===1?"mid":"mids"}`:"Direct-base dinners"}</h2></span><span>{dinners.length} {dinners.length===1?"dinner":"dinners"}</span></div>{related.length?<div className="hm-mids-v9-card-rail">{related.map(m=>{const n=dinnersFor(m.id).length,active=h.activePrepIds.includes(m.id);return <article key={m.id} className="hm-mids-v9-card"><Link href={`/prep/mids/${m.id}`} className="photo"><MidPhoto id={m.id} name={m.name}/><div className="shade"/><span className="code">{m.code}</span></Link><div className="body"><strong>{m.name}</strong><small>{prepRelationshipLabelV7(m.id)}</small><div><span>{n} {n===1?"dinner":"dinners"}</span><button className={active?"on":""} onClick={()=>toggle(m.id,!active)}>{active?"✓":"＋"}</button></div></div></article>})}</div>:<p className="hm-lead">No mid is made from or explicitly paired with {mother.code}. Dinners may use the core base directly.</p>}{dinners.length>0&&<div className="hm-rail sm">{dinners.slice(0,10).map(r=><MealTile key={r.id} recipe={r}/>)}</div>}</div>

    <SectionHead title="Standalone mids" action={<span className="muted">no core base required</span>}/>
    <div className="hm-mids-v9-grid">{standalone.map(m=>{const n=dinnersFor(m.id).length,active=h.activePrepIds.includes(m.id);return <article key={m.id} className="hm-mids-v9-card"><Link href={`/prep/mids/${m.id}`} className="photo"><MidPhoto id={m.id} name={m.name}/><div className="shade"/><span className="code">{m.code}</span></Link><div className="body"><strong>{m.name}</strong><small>{n?`${n} ${n===1?"dinner":"dinners"}`:"library idea"}</small><div><span>Standalone</span><button className={active?"on":""} onClick={()=>toggle(m.id,!active)}>{active?"✓":"＋"}</button></div></div></article>})}</div>

    <SectionHead title="All mids & sauces" action={<span className="muted">{mids.length} in the library</span>}/>
    <label className="hm-search"><input value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}} placeholder="Find a mid or sauce" aria-label="Find a mid or sauce"/>{q&&<button type="button" className="clear" aria-label="Clear" onClick={()=>setQ("")}>×</button>}</label>
    <div className="hm-mids-v9-grid all">{shownAll.map(m=>{const n=dinnersFor(m.id).length,active=h.activePrepIds.includes(m.id);return <article key={m.id} className={`hm-mids-v9-card ${weekIds.has(m.id)?"week":""}`}><Link href={`/prep/mids/${m.id}`} className="photo"><MidPhoto id={m.id} name={m.name}/><div className="shade"/><span className="code">{m.code}</span>{weekIds.has(m.id)&&<span className="week">THIS WEEK</span>}</Link><div className="body"><strong>{m.name}</strong><small>{prepRelationshipLabelV7(m.id)}</small><div><span>{n?`${n} ${n===1?"dinner":"dinners"}`:"library idea"}</span><button className={active?"on":""} aria-label={active?`Pause ${m.name}`:`Add ${m.name} to our prep`} onClick={()=>toggle(m.id,!active)}>{active?"✓":"＋"}</button></div></div></article>})}</div>
    {!q&&all.length>10&&<button className="hm-cook-more" onClick={()=>{setShowAll(v=>!v);feedback("tap")}}>{showAll?"Show fewer":`Show all ${all.length}`}</button>}
    {shownAll.length===0&&<div className="hm-empty"><strong>Nothing matches.</strong>Try another name.</div>}
  </div>;
}
