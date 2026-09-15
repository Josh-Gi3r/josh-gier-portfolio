"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {canonicalPrepComponentsV2,type CanonicalPrepComponentV2} from "@/data/food-truth-v2";
import {foundationImages} from "@/data/foundation-assets";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {coreMotherIdsV7,prepRelationshipLabelV7} from "@/data/prep-repertoire-v7";
import {getPrepPortionPolicyV6} from "@/data/prep-portioning-v6";
import {allLiveRecipesV7 as recipes} from "@/data/recipe-catalog-v7";
import {prepCategoryImagesV11} from "@/data/prep-category-assets-v11";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {prepHero} from "@/lib/tones";
import {formatQty,RoundBack} from "./Primitives";

const midBaseForms=new Set(["paste","cooked-base","roux","stock"]);
const sauceForms=new Set(["sauce","marinade","condiment"]);
const commonIds=["onion","ginger-garlic","garlic","chilli","lemongrass","pesto","duxelles"] as const;
const dinnersFor=(id:string)=>recipes.filter(r=>prepForRecipeAtCookScaleV7(r.id).some(x=>x.componentId===id));
const prepFallback=foundationImages.prepDay;
function hrefFor(c:CanonicalPrepComponentV2){return c.tier==="mother"?`/prep/${c.id}`:c.tier==="mid"?`/prep/mids/${c.id}`:`/prep/boosters/${c.id}`}
function safePrepImage(src:string|null|undefined){return src??prepFallback}
function repairPrepImage(e:React.SyntheticEvent<HTMLImageElement>){if(e.currentTarget.src!==prepFallback)e.currentTarget.src=prepFallback}
function Photo({c}:{c:CanonicalPrepComponentV2}){return <img src={safePrepImage(prepHero(c.id))} alt={c.name} loading="lazy" onError={repairPrepImage}/>}

type Family="bases"|"mids"|"sauces"|"boosters"|"common";
const meta:Record<Family,{eyebrow:string;title:string;desc:string;image:string}>={
 bases:{eyebrow:"FOUNDATIONS",title:"Core bases",desc:"Seven foundations. Pick the one you want, then make it or see what it unlocks.",image:prepCategoryImagesV11.coreBases},
 mids:{eyebrow:"BUILDERS",title:"Mid bases & pastes",desc:"Pastes, stocks, roux and cooked flavour builders. Two big cards per row, no list hunting.",image:prepCategoryImagesV11.midBases},
 sauces:{eyebrow:"SAUCES",title:"Sauces & condiments",desc:"Stir-fry sauces, marinades, tare and condiments, organised as tappable food cards.",image:prepCategoryImagesV11.sauces},
 boosters:{eyebrow:"BOOSTERS",title:"Boosters",desc:"Small concentrated preps with outsized flavour impact.",image:prepCategoryImagesV11.boosters},
 common:{eyebrow:"SHORTCUTS",title:"Common prep",desc:"Everyday shortcuts from across the system. This is a convenience view, not a new food tier.",image:prepCategoryImagesV11.common},
};

function familyItems(family:Family){
 if(family==="bases")return canonicalPrepComponentsV2.filter(c=>coreMotherIdsV7.includes(c.id));
 if(family==="mids")return canonicalPrepComponentsV2.filter(c=>c.tier==="mid"&&midBaseForms.has(c.form));
 if(family==="sauces")return canonicalPrepComponentsV2.filter(c=>c.tier==="mid"&&sauceForms.has(c.form));
 if(family==="boosters")return canonicalPrepComponentsV2.filter(c=>c.tier==="booster");
 return commonIds.map(id=>canonicalPrepComponentsV2.find(c=>c.id===id)).filter((c):c is CanonicalPrepComponentV2=>!!c);
}

export function BasesV10(){return <PrepFamilyV10 family="bases"/>}
export function MidBasesV10(){return <PrepFamilyV10 family="mids"/>}
export function SaucesV10(){return <PrepFamilyV10 family="sauces"/>}
export function BoostersV10(){return <PrepFamilyV10 family="boosters"/>}
export function CommonPrepV10(){return <PrepFamilyV10 family="common"/>}

function PrepFamilyV10({family}:{family:Family}){
 const h=useHousehold(),info=meta[family],items=familyItems(family),[q,setQ]=useState(""),[filter,setFilter]=useState<"all"|"week"|"ours">("all");
 const weekIds=useMemo(()=>new Set(h.week.flatMap(id=>prepForRecipeAtCookScaleV7(id).map(x=>x.componentId))),[h.week]);
 const shown=items.filter(c=>(!q||`${c.code} ${c.name}`.toLowerCase().includes(q.toLowerCase()))&&(filter==="all"||filter==="week"&&weekIds.has(c.id)||filter==="ours"&&h.activePrepIds.includes(c.id)));
 const toggle=(id:string,on:boolean)=>{h.toggleActivePrep(id,on);feedback("change")};
 return <div className="hm-screen hm-prep-family-v10">
  <div className="hm-title-row"><RoundBack href="/prep" label="Back to Prep"/><div><span className="hm-eyebrow">Prep · Browse</span><h1 className="hm-h1">{info.title}</h1></div></div>
  <div className="hm-prep-family-v10-hero"><img src={info.image} alt="" onError={repairPrepImage}/><div className="shade"/><div className="copy"><span>{info.eyebrow}</span><h2>{items.length} {info.title}</h2><p>{info.desc}</p></div></div>
  {items.length>9&&<label className="hm-search hm-prep-family-v10-search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Find in ${info.title.toLowerCase()}`} aria-label={`Find in ${info.title}`}/>{q&&<button type="button" className="clear" aria-label="Clear" onClick={()=>setQ("")}>×</button>}</label>}
  <div className="hm-prep-family-v10-filters" role="group" aria-label={`${info.title} filters`}>{(["all","week","ours"] as const).map(f=><button key={f} className={filter===f?"on":""} onClick={()=>setFilter(f)}>{f==="all"?"All":f==="week"?"This week":"Our prep"}</button>)}</div>
  {shown.length?<div className="hm-prep-family-v10-grid">{shown.map(c=>{const active=h.activePrepIds.includes(c.id),stock=h.componentStock[c.id]??0,p=getPrepPortionPolicyV6(c.id),n=dinnersFor(c.id).length;return <article key={c.id} className="hm-prep-family-v10-card"><Link href={hrefFor(c)} className="photo" onClick={()=>feedback("tap")}><Photo c={c}/><div className="shade"/><span className="code">{c.code}</span>{weekIds.has(c.id)&&<span className="week">THIS WEEK</span>}</Link><div className="body"><strong>{c.name}</strong><small>{family==="bases"?`${n} ${n===1?"dinner":"dinners"} use this base`:prepRelationshipLabelV7(c.id)}</small><div className="facts"><span>{stock>0?`Stock ${formatQty(stock,p?.packet.unit??c.workingUnit.unit)}`:n?`${n} ${n===1?"dinner":"dinners"}`:"Library"}</span><button className={active?"on":""} aria-label={active?`Pause ${c.name}`:`Add ${c.name} to our prep`} onClick={()=>toggle(c.id,!active)}>{active?"✓":"＋"}</button></div></div></article>})}</div>:<div className="hm-empty"><strong>Nothing here.</strong>{q?"Try another search.":filter==="week"?"This week does not use anything in this family.":"No items match this view."}</div>}
  {family==="common"&&<p className="hm-prep-family-v10-note hm-gut">Common prep is a shortcut view. These foods keep their real Core / Mid / Booster identity underneath, so planning and stock maths stay unchanged.</p>}
 </div>
}
