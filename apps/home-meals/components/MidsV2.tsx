import Link from "next/link";
import { midBases, midsByCuisine, motherBases } from "@/data/home-graph-v3";

export function MidsV2(){return <div className="hm-screen hm-mids-screen hm-v3-screen">
 <header className="hm-mobile-head"><div><span>MID-BASES</span><h1>26 flavour multipliers.</h1><p>Only things worth making ahead get a slot here.</p></div><Link href="/prep" className="hm-head-help">‹</Link></header>
 <section className="hm-mid-rule"><span>THE RULE</span><strong>3+ dinners or it does not earn freezer space.</strong><p>Fresh five-minute sauces stay fresh. Mids exist because they multiply the mothers or save real weeknight work.</p></section>
 {midsByCuisine.map(group=>{const list=group.ids.map(id=>midBases.find(x=>x.id===id)).filter(Boolean) as typeof midBases;return <section className="hm-section hm-v3-section" key={group.label}><div className="hm-v3-section-head"><div><span>CUISINE</span><h2>{group.label}</h2></div><small>{list.length} mids</small></div><div className="hm-mid-library-v3">{list.map(mid=><Link href={`/prep/mids/${mid.id}`} key={mid.id} style={{"--tone":mid.tone} as React.CSSProperties}><i/><div><div className="hm-mid-title"><strong>{mid.code}</strong>{mid.standalone&&<em>standalone</em>}</div><h3>{mid.name}</h3><p>{mid.parentMotherIds.length?`with ${mid.parentMotherIds.map(id=>motherBases.find(m=>m.id===id)?.code).join(" + ")}`:"no mother needed"}</p><small>{mid.examples.slice(0,3).join(" · ")}</small></div><b>›</b></Link>)}</div></section>})}
 </div>}
