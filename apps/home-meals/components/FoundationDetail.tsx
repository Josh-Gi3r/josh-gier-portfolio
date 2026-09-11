import Link from "next/link";
import type { PrepComponent } from "@/data/foundation";

export function FoundationDetail({item}:{item:PrepComponent}){
 const back=item.role==="mother"?"/prep":item.role==="mid"?"/prep/mids":"/prep/boosters";
 return <div className="page foundation-detail" style={{"--foundation-tone":item.tone} as React.CSSProperties}>
  <Link href={back} className="back-link">← {item.role==="mother"?"Mother bases":item.role==="mid"?"Mid-bases":"Boosters"}</Link>
  <section className="foundation-hero">
   {item.heroImage?<div className="foundation-photo"><img src={item.heroImage} alt={`${item.name} cooking base`}/><span>HOME MEALS · {item.role.toUpperCase()}</span></div>:<div className="foundation-code-hero"><span>{item.code}</span></div>}
   <div className="foundation-hero-copy"><span className="eyebrow">{item.role.toUpperCase()} · {item.portionMl} ML MODULE</span><h1>{item.name}</h1><p>{item.summary}</p><div className="foundation-yield"><div><small>STARTER BATCH</small><strong>×{item.starterYield}</strong><span>{item.portionMl} ml portions</span></div><div><small>TOTAL YIELD</small><strong>{item.starterYield*item.portionMl}</strong><span>ml approx.</span></div></div></div>
  </section>
  <section className="why-section"><span className="eyebrow">WHY THIS EXISTS</span><p>{item.why}</p></section>
  <div className="foundation-two-col"><section><span className="eyebrow">MEASURED STARTER BATCH</span><h2>Ingredients</h2><ul className="ingredient-checklist">{item.ingredients.map(x=><li key={x}><i/>{x}</li>)}</ul></section><section><span className="eyebrow">METHOD</span><h2>Cook to the cue.</h2><ol className="foundation-method">{item.method.map((x,i)=><li key={x}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p></li>)}</ol></section></div>
  <section className="cue-panel"><div><span className="eyebrow">VISUAL CUES</span><h2>The pan tells you when it is ready.</h2></div><div className="cue-grid">{item.visualCues.map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div></section>
  <div className="foundation-two-col lower"><section><span className="eyebrow">WHAT IT UNLOCKS</span><h2>Use it across the menu.</h2><div className="use-tags">{item.uses.map(x=><span key={x}>{x}</span>)}</div></section><section><span className="eyebrow">LOCAL / STORAGE</span><h2>Designed for JB.</h2><p className="storage-copy">{item.storage}</p>{item.localNotes.map(x=><p className="local-note" key={x}>{x}</p>)}</section></div>
  <section className="source-panel"><span className="eyebrow">REFERENCE BENCHMARKS</span><div>{item.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}><span>{s.kind}</span><strong>{s.label}</strong><b>↗</b></a>)}</div></section>
 </div>
}
