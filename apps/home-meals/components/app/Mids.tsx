"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {midBases,motherBases,recipes} from "@/data/home-data";
import {Back,PageHead} from "./Primitives";

export function Mids(){const[q,setQ]=useState("");const[parent,setParent]=useState("all");const[showAll,setShowAll]=useState(false);
 const counts=useMemo(()=>Object.fromEntries(midBases.map(m=>[m.id,recipes.filter(r=>r.midIds.includes(m.id)).length])),[]);
 const filtered=midBases.filter(m=>(parent==="all"||parent==="standalone"?parent!=="standalone"||m.parentMotherIds.length===0:m.parentMotherIds.includes(parent))&&(`${m.code} ${m.name} ${m.examples.join(" ")}`).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>(counts[b.id]??0)-(counts[a.id]??0)||a.name.localeCompare(b.name));
 const shown=showAll||q||parent!=="all"?filtered:filtered.slice(0,12);
 return <div className="hm-page-v5 hm-mids-v5"><Back href="/prep" label="Prep"/><PageHead eyebrow="MIDS" title="Mid-bases" sub="Extra directions worth making ahead."/>
  <label className="hm-search-v5"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search mids"/></label>
  <div className="hm-filter-rail-v5"><button className={parent==="all"?"active":""} onClick={()=>setParent("all")}>Useful now</button>{motherBases.map(m=><button key={m.id} className={parent===m.id?"active":""} onClick={()=>setParent(m.id)}>{m.code}</button>)}<button className={parent==="standalone"?"active":""} onClick={()=>setParent("standalone")}>Standalone</button></div>
  <div className="hm-mid-list-v5">{shown.map(m=>{const n=counts[m.id]??0;return <Link href={`/prep/mids/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><div><strong>{m.code}</strong><span>{m.name}</span><small>{m.parentMotherIds.length?m.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + "):"stands alone"}</small></div><div className={`hm-mid-maturity-v5 ${n?"active":"idle"}`}>{n?`${n} ${n===1?"recipe":"recipes"}`:"not in our rotation yet"}</div><b>›</b></Link>})}</div>
  {!q&&parent==="all"&&filtered.length>12&&<button className="hm-secondary-button-v5" onClick={()=>setShowAll(v=>!v)}>{showAll?"Show the useful set":"Show all 26"}</button>}
 </div>}
