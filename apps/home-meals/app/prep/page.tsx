import Link from "next/link";
import { boosters, foundationCounts, mids, mothers } from "@/data/foundation";
import { FoundationArchitecture, PortionLanguage, PrepTimelineGraphic, StorageGraphic, YieldGraphic } from "@/components/FoundationVisuals";

export default function PrepPage(){
 return <div className="page foundation-page">
  <header className="topbar"><div><span className="eyebrow">FOUNDATION</span><h1>Prep the work. Keep dinner fresh.</h1><p>The researched Home Meals engine: six mother bases, fifteen directional mids and eleven boosters, all measured for a freezer-first kitchen in JB.</p></div><div className="button-row"><Link href="/prep/groceries" className="secondary-button">Foundation shop</Link><Link href="/prep/day" className="primary-button">Start prep day →</Link></div></header>
  <YieldGraphic/>
  <section className="foundation-section"><div className="section-heading"><div><span className="eyebrow">01 · MOTHER BASES</span><h2>Only the labour worth centralising.</h2></div><span className="pill">{foundationCounts.mothers} mothers</span></div><div className="mother-grid">{mothers.map(x=><Link href={`/prep/${x.slug}`} className="mother-card" key={x.slug} style={{"--base-color":x.tone} as React.CSSProperties}>{x.heroImage&&<img src={x.heroImage} alt=""/>}<div className="mother-card-shade"/><div className="mother-card-copy"><span>{x.code} · {x.portionMl} ml</span><h3>{x.name}</h3><p>{x.summary}</p><small>Starter batch ×{x.starterYield} → {x.starterYield*x.portionMl} ml</small></div></Link>)}</div></section>
  <FoundationArchitecture/>
  <section className="foundation-section compact"><div className="section-heading"><div><span className="eyebrow">02 · MID-BASES</span><h2>Where the cuisine changes direction.</h2></div><Link href="/prep/mids">Browse all {mids.length} →</Link></div><div className="mid-preview">{mids.slice(0,8).map(x=><Link href={`/prep/mids/${x.slug}`} key={x.slug} style={{"--base-color":x.tone} as React.CSSProperties}><i/><span>{x.code}</span><strong>{x.name}</strong><small>{x.portionMl} ml · ×{x.starterYield}</small></Link>)}</div></section>
  <section className="foundation-section compact"><div className="section-heading"><div><span className="eyebrow">03 · BOOSTERS</span><h2>Tiny portions with disproportionate leverage.</h2></div><Link href="/prep/boosters">Browse all {boosters.length} →</Link></div><div className="booster-preview">{boosters.slice(0,8).map(x=><Link href={`/prep/boosters/${x.slug}`} key={x.slug}><span>{x.code}</span><strong>{x.name}</strong><small>{x.portionMl} ml</small></Link>)}</div></section>
  <PortionLanguage/>
  <PrepTimelineGraphic/>
  <StorageGraphic/>
  <section className="foundation-cta"><div><span className="eyebrow">READY TO MAKE IT REAL?</span><h2>Shop once. Prep once. Label everything.</h2></div><div className="button-row"><Link href="/prep/groceries" className="secondary-button">Open grocery list</Link><Link href="/prep/day" className="primary-button">Open prep-day mode →</Link></div></section>
 </div>
}
