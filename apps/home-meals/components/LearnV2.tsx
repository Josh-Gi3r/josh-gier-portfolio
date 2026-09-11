import Link from "next/link";
import { midBases, motherBases } from "@/data/home-graph-v3";
import { BaseMultiplierMap, PrepPipeline } from "./HomeInfographics";
import { PortionScale } from "./PortionScale";

const guides=[
 {href:"/learn/system",icon:"✦",title:"How it all links",copy:"Recipe → plan → groceries → prep → kitchen → cook → rate."},
 {href:"/learn/portions",icon:"🧊",title:"Freezer portions",copy:"Cubes and pucks sized to what each component actually needs."},
 {href:"/learn/prep-day",icon:"🍳",title:"Prep without chaos",copy:"Only make the batches the week or stock-up session actually needs."},
 {href:"/learn/freezer",icon:"❄",title:"Freezer layout",copy:"Mothers, mids, protein and carbs each have a predictable home."}
];
export function LearnV2(){return <div className="hm-screen hm-v3-screen hm-learn-v3"><header className="hm-mobile-head"><div><span>HELP</span><h1>How Home Meals works.</h1><p>Quick visual guides for when you actually need them.</p></div><Link href="/" className="hm-head-help">‹</Link></header><div className="hm-help-grid-v3">{guides.map(x=><Link href={x.href} key={x.href}><i>{x.icon}</i><div><strong>{x.title}</strong><p>{x.copy}</p></div><b>›</b></Link>)}</div><section className="hm-help-summary-v3"><article><strong>{motherBases.length}</strong><span>mother bases</span></article><article><strong>{midBases.length}</strong><span>mid-bases</span></article><article><strong>1</strong><span>shared household state</span></article></section><BaseMultiplierMap/><PrepPipeline/><PortionScale/></div>}
