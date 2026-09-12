"use client";
import {useMemo,useState} from "react";
import {midBases,midsByCuisine,motherBases,recipes,getRecipe} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {useSheet} from "@/lib/useSheet";
import {Back,PageHead} from "./Primitives";
import {BaseExplorer} from "./BaseExplorer";

type Scope="week"|"rotation"|"research"|"all";
type ParentFilter="all"|"standalone"|string;
const scopes:[Scope,string][]=[["week","This week"],["rotation","In our recipes"],["research","Research"],["all","All"]];
export function Mids(){
 const h=useHousehold();const[q,setQ]=useState("");const[scope,setScope]=useState<Scope>("week");const[showMap,setShowMap]=useState(false);const[filterOpen,setFilterOpen]=useState(false);const[cuisine,setCuisine]=useState("All");const[parent,setParent]=useState<ParentFilter>("all");useSheet(filterOpen,()=>setFilterOpen(false));
 const counts=useMemo(()=>Object.fromEntries(midBases.map(m=>[m.id,recipes.filter(r=>r.midIds.includes(m.id)).length])),[]);
 const weekIds=useMemo(()=>new Set(h.week.flatMap(id=>getRecipe(id).midIds)),[h.week]);
 const cuisineIds=useMemo(()=>cuisine==="All"?null:new Set(midsByCuisine.find(x=>x.label===cuisine)?.ids??[]),[cuisine]);
 const scoped=midBases.filter(m=>scope==="week"?weekIds.has(m.id):scope==="rotation"?(counts[m.id]??0)>0:scope==="research"?(counts[m.id]??0)===0:true).filter(m=>!cuisineIds||cuisineIds.has(m.id)).filter(m=>parent==="all"?true:parent==="standalone"?m.standalone:m.parentMotherIds.includes(parent));
 const filtered=scoped.filter(m=>(`${m.code} ${m.name} ${m.examples.join(" ")} ${m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).join(" ")}`).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(weekIds.has(b.id))-Number(weekIds.has(a.id))||(counts[b.id]??0)-(counts[a.id]??0)||a.name.localeCompare(b.name));
 const activeFilters=Number(cuisine!=="All")+Number(parent!=="all");
 return <div className="hm-page-v5 hm-mids-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="MID-BASES" title="Mid-bases" sub="Small batches that turn the same mother base into different dinners."/>
  <label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a mid-base" aria-label="Search mid-bases"/></label>
  <div className="hm-filter-rail-v5" aria-label="Mid-base view">{scopes.map(([id,label])=><button key={id} className={scope===id?"active":""} onClick={()=>{setScope(id);feedback("tap")}}>{label}{id==="week"&&weekIds.size?` · ${weekIds.size}`:""}</button>)}</div>
  <div className="hm-filter-rail-v5" aria-label="Mid-base tools"><button className={activeFilters?"active":""} onClick={()=>{setFilterOpen(true);feedback("tap")}}>Filter{activeFilters?` · ${activeFilters}`:""}</button><button className={showMap?"active":""} aria-expanded={showMap} onClick={()=>{setShowMap(v=>!v);feedback("tap")}}>Mother → mid → dinner</button></div>
  {showMap&&<BaseExplorer/>}
  {filtered.length?<div className="hm-mid-list-v5">{filtered.map(m=>{const n=counts[m.id]??0;const thisWeek=weekIds.has(m.id);return <a href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{m.parentMotherIds.length?m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + "):"stands alone"}</small></div><div className={`hm-mid-maturity-v5 ${n?"active":"idle"}`}>{thisWeek?"this week":n?`${n} saved ${n===1?"recipe":"recipes"}`:"not in our rotation yet"}</div><b>›</b></a>})}</div>:<div className="hm-empty-v5"><strong>{scope==="week"&&!activeFilters?"No mid-base needed this week.":"Nothing matches."}</strong><p>{scope==="week"&&!activeFilters?"The current dinners either use mother bases directly or standalone prep.":"Clear a filter or try another search."}</p>{activeFilters>0&&<button className="hm-text-button-v5" onClick={()=>{setCuisine("All");setParent("all");feedback("tap")}}>Clear filters</button>}</div>}
  {filterOpen&&<div className="hm-sheet-backdrop-v5" onMouseDown={e=>{if(e.target===e.currentTarget)setFilterOpen(false)}}><section className="hm-sheet-v5 hm-mid-filter-sheet-v5" role="dialog" aria-modal="true" aria-label="Filter mid-bases"><div className="hm-sheet-handle-v5"/><header><div><span>FILTER</span><h2>Mid-bases</h2></div><button className="hm-icon-button-v5" onClick={()=>setFilterOpen(false)} aria-label="Close">×</button></header><div className="hm-filter-sheet-v5"><h3>Cuisine</h3><div className="hm-filter-rail-v5"><button className={cuisine==="All"?"active":""} onClick={()=>{setCuisine("All");feedback("tap")}}>All</button>{midsByCuisine.map(x=><button key={x.label} className={cuisine===x.label?"active":""} onClick={()=>{setCuisine(x.label);feedback("tap")}}>{x.label}</button>)}</div><h3>Built from</h3><div className="hm-filter-rail-v5"><button className={parent==="all"?"active":""} onClick={()=>{setParent("all");feedback("tap")}}>Any</button><button className={parent==="standalone"?"active":""} onClick={()=>{setParent("standalone");feedback("tap")}}>Standalone</button>{motherBases.map(m=><button key={m.id} className={parent===m.id?"active":""} onClick={()=>{setParent(m.id);feedback("tap")}}>{m.code}</button>)}</div><button className="hm-primary-button-v5" onClick={()=>{setFilterOpen(false);feedback("change")}}>Done</button></div></section></div>}
 </div>}
