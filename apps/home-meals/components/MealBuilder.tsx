"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { researchedMeals } from "@/data/meals-researched";
import { mothers, mids, boosters } from "@/data/foundation";

const anchors=[
 {label:"Chicken",match:(s:string)=>s.includes("chicken")},
 {label:"Beef",match:(s:string)=>s.includes("beef")},
 {label:"Fish / salmon",match:(s:string)=>/salmon|white fish|fish fillet/.test(s)},
 {label:"Prawns",match:(s:string)=>s.includes("prawn")},
 {label:"Eggs",match:(s:string)=>s.includes("egg")},
 {label:"Plant-based",match:(s:string)=>/tofu|chickpea|beans|aubergine|cauliflower/.test(s)}
];
const allComponents=[...mothers,...mids,...boosters];
const nameFor=(code:string)=>allComponents.find(x=>x.code===code)?.name||code;
const toneFor=(code:string)=>allComponents.find(x=>x.code===code)?.tone||"#777";

export function MealBuilder(){
 const[anchor,setAnchor]=useState("Chicken");
 const eligible=useMemo(()=>{const a=anchors.find(x=>x.label===anchor)!;return researchedMeals.filter(m=>a.match(m.ingredients.join(" ").toLowerCase()))},[anchor]);
 const codes=useMemo(()=>Array.from(new Set(eligible.flatMap(m=>m.parts.map(p=>p.code)))),[eligible]);
 const[selected,setSelected]=useState("GOLD");
 const activeCode=codes.includes(selected)?selected:(codes[0]||"");
 const matches=eligible.filter(m=>!activeCode||m.parts.some(p=>p.code===activeCode));
 return <div className="valid-builder"><section className="valid-builder-stage"><span className="eyebrow">VALID COMBINATIONS ONLY</span><h2>{matches[0]?.title||"Choose another path"}</h2><p>The builder no longer invents arbitrary sauce combinations. It only surfaces combinations already represented in the researched cookbook.</p><div className="builder-path"><span>{anchor}</span><b>+</b><span style={{borderColor:toneFor(activeCode)}}>{activeCode||"—"}</span><b>→</b><strong>{matches.length} meal{matches.length===1?"":"s"}</strong></div>{matches[0]&&<div className="builder-feature"><small>{matches[0].cuisine} · {matches[0].time} min</small><p>{matches[0].subtitle}</p><Link href={`/cook/${matches[0].slug}`} className="primary-button">Open recipe →</Link></div>}</section><section className="valid-builder-controls"><label><span>01 · Anchor</span><div className="anchor-buttons">{anchors.map(a=><button key={a.label} className={anchor===a.label?"active":""} onClick={()=>{setAnchor(a.label);setSelected("")}}>{a.label}</button>)}</div></label><label><span>02 · Foundation component</span><div className="component-buttons">{codes.map(code=><button key={code} className={activeCode===code?"active":""} style={{"--base-color":toneFor(code)} as React.CSSProperties} onClick={()=>setSelected(code)}><i/>{code}<small>{nameFor(code)}</small></button>)}</div></label><label><span>03 · Matching researched meals</span><div className="builder-results">{matches.map(m=><Link href={`/cook/${m.slug}`} key={m.slug}><strong>{m.title}</strong><small>{m.time} min · {m.method}</small></Link>)}</div></label></section></div>
}
