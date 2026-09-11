"use client";
import { useMemo, useState } from "react";
import { boosters, foundationCounts, mids, mothers, storageRules } from "@/data/foundation";
import { firstRunCodes, firstRunSummary, hotFoundationTimeline } from "@/data/foundation-ops";

export function FoundationArchitecture(){
 const [layer,setLayer]=useState<"mother"|"mid"|"booster">("mother");
 const items=layer==="mother"?mothers:layer==="mid"?mids:boosters;
 return <section className="foundation-viz architecture-viz"><div className="viz-copy"><span className="eyebrow">THE FOUNDATION</span><h2>{foundationCounts.mothers} mothers → {foundationCounts.mids} mids → {foundationCounts.boosters} boosters</h2><p>We keep the mother layer small and labour-intensive. Specific cultural identity moves down into mids and boosters so the freezer stays powerful without becoming a museum of twenty sauces.</p></div><div className="layer-switch">{(["mother","mid","booster"] as const).map(x=><button key={x} className={layer===x?"active":""} onClick={()=>setLayer(x)}>{x}s <b>{x==="mother"?foundationCounts.mothers:x==="mid"?foundationCounts.mids:foundationCounts.boosters}</b></button>)}</div><div className={`foundation-node-grid ${layer}`}>{items.map(x=><div className="foundation-node" key={x.code} style={{"--node":x.tone} as React.CSSProperties}><i/><strong>{x.code}</strong><span>{x.name}</span><small>{x.portionMl} ml · ×{x.starterYield}</small></div>)}</div></section>
}

export function PortionLanguage(){
 const modules=[{ml:15,label:"Booster",use:"garlic, chilli, herb oil"},{ml:30,label:"Strong mid / DARK",use:"tare, curry paste, jus"},{ml:60,label:"Mother / mid",use:"GOLD, REMPAH, sambal"},{ml:90,label:"Large mother",use:"RED"}];
 return <section className="foundation-viz portion-viz"><div className="viz-copy"><span className="eyebrow">FREEZER LANGUAGE</span><h2>Four measured modules.</h2><p>No “some sauce.” Every recipe will eventually say exactly how many modules it needs.</p></div><div className="portion-bars">{modules.map(x=><div key={x.ml} className="portion-item"><div className="portion-cube" style={{"--scale":`${48+Math.sqrt(x.ml)*5}px`} as React.CSSProperties}><b>{x.ml}</b><span>ml</span></div><strong>{x.label}</strong><small>{x.use}</small></div>)}</div></section>
}

export function PrepTimelineGraphic(){return <section className="foundation-viz timeline-viz"><div className="viz-copy"><span className="eyebrow">SESSION A · HOT FOUNDATIONS</span><h2>About 3½ hours, sequenced by stove time.</h2><p>All six mothers are made in parallel, with DARK reducing in the background while the other bases occupy the pans and wok. Core mids and boosters are a separate 90-minute session.</p></div><div className="timeline-track">{hotFoundationTimeline.map((x,i)=><div className="timeline-event" key={x.minute} style={{"--delay":`${i*55}ms`} as React.CSSProperties}><span>{x.minute}m</span><div><strong>{x.title}</strong><small>{x.detail}</small>{x.codes?.length?<div className="stage-codes">{x.codes.map(c=><b key={c}>{c}</b>)}</div>:null}</div></div>)}</div></section>}

export function StorageGraphic(){return <section className="foundation-viz storage-viz"><div className="viz-copy"><span className="eyebrow">JB / SG STORAGE</span><h2>Cold storage is part of the recipe.</h2></div><div className="storage-grid">{storageRules.map((x,i)=><article key={x.title}><span>0{i+1}</span><strong>{x.title}</strong><b>{x.value}</b><p>{x.detail}</p></article>)}</div></section>}

export function YieldGraphic(){
 const firstMothers=useMemo(()=>mothers.filter(x=>firstRunCodes.mothers.includes(x.code)),[]);
 const firstMids=useMemo(()=>mids.filter(x=>firstRunCodes.mids.includes(x.code)),[]);
 const firstBoosters=useMemo(()=>boosters.filter(x=>firstRunCodes.boosters.includes(x.code)),[]);
 const firstTotal=[...firstMothers,...firstMids,...firstBoosters].reduce((n,x)=>n+x.starterYield,0);
 return <section className="yield-strip"><div><span className="eyebrow">RECOMMENDED FIRST RUN</span><strong>{firstTotal}</strong><small>measured portions across {firstRunSummary.sessions} prep sessions · not all {foundationCounts.total} library components</small></div><div><b>{firstMothers.reduce((n,x)=>n+x.starterYield,0)}</b><span>mother portions</span></div><div><b>{firstMids.reduce((n,x)=>n+x.starterYield,0)}</b><span>core-mid portions</span></div><div><b>{firstBoosters.reduce((n,x)=>n+x.starterYield,0)}</b><span>booster portions</span></div></section>
}
