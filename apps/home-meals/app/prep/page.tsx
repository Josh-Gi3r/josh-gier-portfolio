import Link from "next/link";
import { bases, boosters, inventoryGroups, midBases } from "@/data/home-meals";
import { CubeScale, FreezerMap, SystemLayers } from "@/components/SystemInfographics";
import { Icon } from "@/components/Icons";
import { PrepLogger } from "@/components/PrepLogger";

export default function PrepPage() {
  return <div className="page">
    <header className="topbar"><div><span className="eyebrow">PREP</span><h1>Build the infrastructure once.</h1><p>Eight mother bases hold the slow work. Mid-bases create direction. Dinner still gets cooked fresh.</p></div><div className="button-row"><Link href="/plan/shopping" className="secondary-button">Prep groceries</Link><PrepLogger/></div></header>
    <div className="prep-summary"><div><small>MOTHER BASE LIBRARY</small><strong>{bases.length}</strong><span>Distinct foundations, not near-duplicates</span></div><div><small>MID-BASE LIBRARY</small><strong>{midBases.length}</strong><span>Directional pastes and concentrates</span></div><div><small>BOOSTERS</small><strong>{boosters.length}</strong><span>Small high-leverage flavour cubes</span></div></div>
    <SystemLayers/>
    <section><div className="section-heading"><div><span className="eyebrow">MOTHER BASES</span><h2>The freezer engine.</h2></div><span className="pill">Core + specialist</span></div><div className="base-card-grid">{bases.map((base) => { const stock = inventoryGroups.freezer.find((i) => i.name === base.code)?.qty; return <Link href={`/prep/${base.slug}`} className="base-card" key={base.code} style={{ "--base-color": base.tone } as React.CSSProperties}><div className="base-card-top"><i/><span>{base.code}</span><small>{base.size} · {base.tier}</small></div><h3>{base.name}</h3><p>{base.summary}</p><div className="base-card-foot"><span>{stock ?? "—"} in freezer</span><Icon name="arrow"/></div></Link> })}</div></section>
    <CubeScale/>
    <section><div className="section-heading"><div><span className="eyebrow">MID-BASES</span><h2>Specificity without sacrificing flexibility.</h2></div><span className="pill">{midBases.length} directions</span></div><div className="mid-grid">{midBases.map((mid)=><div className="mid-card" key={mid.code}><div><span>{mid.code}</span><small>{mid.size} · {mid.storage}</small></div><h3>{mid.name}</h3><p>{mid.summary}</p><div className="mid-pairs">{mid.pairsWith.map(x=><b key={x}>{x}</b>)}</div><small>{mid.unlocks.slice(0,3).join(" · ")}</small></div>)}</div></section>
    <section><div className="section-heading"><div><span className="eyebrow">BOOSTER CUBES</span><h2>Small cubes. Huge leverage.</h2></div></div><div className="booster-grid">{boosters.map((b) => <div key={b.code}><span>{b.code}</span><strong>{b.name}</strong><small>{b.size}</small></div>)}</div></section>
    <FreezerMap/>
  </div>;
}
