"use client";
import { useMemo, useState } from "react";
import { boosters, foundationCounts, mids, mothers, prepTimeline, storageRules } from "@/data/foundation";

export function FoundationArchitecture(){
 const [layer,setLayer]=useState<"mother"|"mid"|"booster">("mother");
 const items=layer==="mother"?mothers:layer==="mid"?mids:boosters;
 return <section className="foundation-viz architecture-viz"><div className="viz-copy"><span className="eyebrow">THE FOUNDATION</span><h2>{foundationCounts.mothers} mothers → {foundationCounts.mids} mids → {foundationCounts.boosters} boosters</h2><p>We keep the mother layer small and labour-intensive. Specific cultural identity moves down into mids and boosters so the freezer stays powerful without becoming a museum of twenty sauces.</p></div><div className="layer-switch">{(["mother","mid","booster"] as const).map(x=><button key={x} className={layer===x?"active":""} onClick={()=>setLayer(x)}>{x}s <b>{x==="mother"?foundationCounts.mothers:x==="mid"?foundationCounts.mids:foundationCounts.boosters}</b></button>)}</div><div className={`foundation-node-grid ${layer}`}>{items.map(x=><div className="foundation-node" key={x.code} style={{"--node":x.tone} as React.CSSProperties}><i/><strong>{x.code}</strong><span>{x.name}</span><small>{x.portionMl} ml · ×{x.starterYield}</small></div>)}</div></section>
}

export function PortionLanguage(){
 const modules=[{ml:15,label:"Booster",use:"garlic, chilli, herb oil"},{ml:30,label:"Strong mid / DARK",use:"tare, curry paste, jus"},{ml:60,label:"Mother / mid",use:"GOLD, REMPAH, sambal"},{ml:90,label:"Large mother",use:"RED"}];
 return <section className="foundation-viz portion-viz"><div className="viz-copy"><span className="eyebrow">FREEZER LANGUAGE</span><h2>Four measured modules.</h2><p>No “some sauce.” Every recipe will eventually say exactly how many modules it needs.</p></div><div className="portion-bars">{modules.map(x=><div key={x.ml} className="portion-item"><div className="portion-cube" style={{"--scale":`${48+Math.sqrt(x.ml)*5}px`} as React.CSSProperties}><b>{x.ml}</b><span>ml</span></div><strong>{x.label}</strong><small>{x.use}</small></div>)}</div></section>
}

export function PrepTimelineGraphic(){return <section className="foundation-viz timeline-viz"><div className="viz-copy"><span className="eyebrow">PREP-DAY ORCHESTRATION</span><h2>Three hours, sequenced by stove time.</h2><p>The long reductions start first. Cold sauces and boosters happen while mothers cool. We are using waiting time instead of stacking every task end-to-end.</p></div><div className="timeline-track">{prepTimeline.map((x,i)=><div className="timeline-event" key={x.minute} style={{"--delay":`${i*55}ms`} as React.CSSProperties}><span>{x.minute}m</span><div><strong>{x.title}</strong><small>{x.detail}</small></div></div>)}</div></section>}

export function StorageGraphic(){return <section className="foundation-viz storage-viz"><div className="viz-copy"><span className="eyebrow">JB / SG STORAGE</span><h2>Cold storage is part of the recipe.</h2></div><div className="storage-grid">{storageRules.map((x,i)=><article key={x.title}><span>0{i+1}</span><strong>{x.title}</strong><b>{x.value}</b><p>{x.detail}</p></article>)}</div></section>}

export function YieldGraphic(){
 const total=useMemo(()=>mothers.reduce((n,x)=>n+x.starterYield,0)+mids.reduce((n,x)=>n+x.starterYield,0)+boosters.reduce((n,x)=>n+x.starterYield,0),[]);
 return <section className="yield-strip"><div><span className="eyebrow">STARTER FOUNDATION OUTPUT</span><strong>{total}</strong><small>measured portions if every starter batch is made</small></div><div><b>{mothers.reduce((n,x)=>n+x.starterYield,0)}</b><span>mother portions</span></div><div><b>{mids.reduce((n,x)=>n+x.starterYield,0)}</b><span>mid portions</span></div><div><b>{boosters.reduce((n,x)=>n+x.starterYield,0)}</b><span>booster portions</span></div></section>
}
