"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {midBases,motherBases,recipes,getRecipe} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {Back,PageHead} from "./Primitives";
import {BaseExplorer} from "./BaseExplorer";

type Scope="week"|"rotation"|"research"|"all";
const scopes:[Scope,string][]=[["week","This week"],["rotation","In our recipes"],["research","Research"],["all","All"]];
export function Mids(){
 const h=useHousehold();const[q,setQ]=useState("");const[scope,setScope]=useState<Scope>("week");const[showMap,setShowMap]=useState(false);
 const counts=useMemo(()=>Object.fromEntries(midBases.map(m=>[m.id,recipes.filter(r=>r.midIds.includes(m.id)).length])),[]);
 const weekIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).midIds)),[h.week]);
 const scoped=midBases.filter(m=>scope==="week"?weekIds.has(m.id):scope==="rotation"?(counts[m.id]??0)>0:scope==="research"?(counts[m.id]??0)===0:true);
 const filtered=scoped.filter(m=>(`${m.code} ${m.name} ${m.examples.join(" ")} ${m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).join(" ")}`).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(weekIds.has(b.id))-Number(weekIds.has(a.id))||(counts[b.id]??0)-(counts[a.id]??0)||a.name.localeCompare(b.name));
 return <div className="hm-page-v5 hm-mids-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="MID-BASES" title="Mid-bases" sub="Small batches that turn the same mother base into different dinners."/>
  <label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a mid-base" aria-label="Search mid-bases"/></label>
  <div className="hm-filter-rail-v5" aria-label="Mid-base view">{scopes.map(([id,label])=><button key={id} className={scope===id?"active":""} onClick={()=>{setScope(id);feedback("tap")}}>{label}{id==="week"&&weekIds.size?` · ${weekIds.size}`:""}</button>)}</div>
  <button className="hm-secondary-button-v5" aria-expanded={showMap} onClick={()=>{setShowMap(v=>!v);feedback("tap")}}>{showMap?"Hide mother → mid → dinner":"Mother → mid → dinner"}</button>
  {showMap&&<BaseExplorer/>}
  {filtered.length?<div className="hm-mid-list-v5">{filtered.map(m=>{const n=counts[m.id]??0;const thisWeek=weekIds.has(m.id);return <Link href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{m.parentMotherIds.length?m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + "):"stands alone"}</small></div><div className={`hm-mid-maturity-v5 ${n?"active":"idle"}`}>{thisWeek?"this week":n?`${n} saved ${n===1?"recipe":"recipes"}`:"not in our rotation yet"}</div><b>›</b></Link>})}</div>:<div className="hm-empty-v5"><strong>{scope==="week"?"No mid-base needed this week.":"Nothing matches."}</strong><p>{scope==="week"?"The current dinners either use mother bases directly or standalone prep.":"Try another search or view."}</p></div>}
 </div>}
