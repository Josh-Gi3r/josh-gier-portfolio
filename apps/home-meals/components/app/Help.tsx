import Link from "next/link";
import {Back,PageHead,SectionHead} from "./Primitives";
import {motherBases} from "@/data/home-data";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {PortionScale} from "../PortionScale";

const cards=[
 {href:"/learn/system",mark:"↻",title:"From plan to dinner",copy:"How one dinner moves through Kitchen, shopping, Prep, cooking and our notes.",image:foundationImages.prepDay},
 {href:"/learn/portions",mark:"▦",title:"Freezer portions",copy:"When to freeze 30, 60, 120, 250 or 500 ml.",image:foundationImages.cubes},
 {href:"/learn/prep-day",mark:"✓",title:"Prep day",copy:"Cook, cool, portion, label and freeze without turning Sunday into a marathon.",image:foundationImages.prepDay},
 {href:"/learn/freezer",mark:"❄",title:"Freezer layout",copy:"A simple place for mothers, mids, proteins and carbs so we can find them fast.",image:foundationImages.freezer}
];

export function Help(){return <div className="hm-page-v5 hm-help-v5 hm-help-v6"><Back href="/" label="Home"/><PageHead title="Kitchen guides" sub="Quick references for when we’re actually cooking."/>
 <section className="hm-learn-hero-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(27,31,24,.78),rgba(27,31,24,.16)),url(${foundationImages.prepDay})`}}><span>OUR RHYTHM</span><h2>Do the slow work once.<br/>Cook the rest by feel.</h2><p>Only the references worth reaching for in the kitchen.</p></section>
 <div className="hm-help-cards-v6">{cards.map(c=><Link href={c.href} key={c.href} style={{"--guide-image":`url(${c.image})`} as React.CSSProperties}><div className="hm-guide-card-photo-v6"><b>{c.mark}</b></div><span><strong>{c.title}</strong><small>{c.copy}</small></span><i>›</i></Link>)}</div>
 <section className="hm-block-v5 hm-learn-system-v6"><SectionHead title="How dinner moves" action={<Link href="/learn/system">Open guide ›</Link>}/><div className="hm-loop-v6" aria-label="From recipe to dinner and back to our notes"><Link href="/cook">Recipes</Link><i>→</i><Link href="/plan">Week</Link><i>→</i><Link href="/kitchen">Kitchen</Link><i>→</i><Link href="/plan">Shop</Link><i>→</i><Link href="/prep">Prep</Link><i>→</i><Link href="/cook">Cook</Link><i>→</i><Link href="/cook">Rate</Link><b>↺</b></div><p>The week decides what to buy and prep. Cooking uses those same quantities. Our ratings and notes stay with the recipe for next time.</p></section>
 <section className="hm-block-v5"><SectionHead title="The eight foundations" action={<Link href="/prep">Prep ›</Link>}/><div className="hm-mother-mini-v6">{motherBases.map(m=>{const photo=motherProcessImages[m.id]?.at(-1)?.url;return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}>{photo?<img src={photo} alt={`${m.name} frozen in measured portions`} loading="lazy"/>:<i/>}<span><strong>{m.code}</strong><small>{m.name}</small></span></Link>})}</div></section>
 </div>}

const guideData:Record<string,{title:string;sub:string;hero:string;eyebrow:string;steps:string[]}>={
 system:{title:"From plan to dinner",sub:"The dinner, shopping list, freezer and our notes all stay tied to the same week.",hero:foundationImages.prepDay,eyebrow:"THE RHYTHM",steps:["Choose the month’s pool and the week’s dinners.","Check what is already in the fridge, freezer and pantry.","Buy only the gap between the plan and what is already home.","Prep only the slow pieces the week is short of.","Cook from the same quantities used by the plan.","Rate dinner and leave the note we want next time."]},
 portions:{title:"Freezer portions",sub:"Strong things stay small. Bulky foundations and stock get more room.",hero:foundationImages.cubes,eyebrow:"PORTIONS",steps:["30 ml: boosters, concentrates and little flavour hits.","60 ml: small sauces and strong everyday bases.","90–120 ml: useful dinner-size base portions.","250 ml: larger meal or batch-cooking portions.","500 ml: stock, tomato sauce or anything bulky.","Label the name, amount and date before it disappears into the freezer."]},
 "prep-day":{title:"Prep day",sub:"Do the slow work once, then get out of the kitchen.",hero:foundationImages.prepDay,eyebrow:"WORKBENCH",steps:["Start from this week’s actual prep shortfalls, not a random batch list.","Put the longest mother bases on first.","Make quicker mids and boosters while the slow pans cook.","Cool completely before covering and freezing.","Portion into the size the recipes actually use.","Label and put new stock behind older stock."]},
 freezer:{title:"Freezer layout",sub:"A predictable freezer is quicker to use, easier to count and less likely to grow mystery tubs.",hero:foundationImages.freezer,eyebrow:"FREEZER",steps:["Keep mother bases together so the foundations are visible at a glance.","Keep mids and boosters together in their own section.","Pack raw proteins by dinner-size portions.","Keep rice and other carb portions separate from sauces.","Old stock stays in front; new stock goes behind it.","No mystery tubs: every container gets a name, amount and date."]}
};

export function Guide({slug}:{slug:string}){const g=guideData[slug];if(!g)return null;return <div className="hm-page-v5 hm-guide-v5 hm-guide-v6"><Back href="/learn" label="Guides"/>
 <section className="hm-guide-hero-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(26,29,23,.8),rgba(26,29,23,.16)),url(${g.hero})`}}><span>{g.eyebrow}</span><h1>{g.title}</h1><p>{g.sub}</p></section>
 {slug==="system"&&<section className="hm-guide-system-v6"><div><b>1</b><span>Choose</span><strong>Recipes + week</strong></div><i>→</i><div><b>2</b><span>Check</span><strong>Kitchen</strong></div><i>→</i><div><b>3</b><span>Fill the gap</span><strong>Shop + prep</strong></div><i>→</i><div><b>4</b><span>Use it</span><strong>Cook + rate</strong></div></section>}
 {slug==="freezer"&&<section className="hm-freezer-layout-v6"><div className="mothers"><span>MOTHER DRAWER</span><strong>RED · GOLD · BLOND · SAMBAL · REMPAH · DARK · CLEAR · ONION</strong></div><div className="mids"><span>MIDS + BOOSTERS</span><strong>small flavour portions</strong></div><div className="protein"><span>PROTEIN</span><strong>dinner-size packs</strong></div><div className="carbs"><span>CARBS</span><strong>rice · breads · backup portions</strong></div></section>}
 <section className="hm-block-v5 hm-guide-steps-v6"><SectionHead title="The guide"/><ol>{g.steps.map((s,i)=><li key={s}><b>{String(i+1).padStart(2,"0")}</b><span>{s}</span></li>)}</ol></section>
 {slug==="portions"&&<PortionScale/>}
 {slug==="prep-day"&&<section className="hm-guide-prep-cues-v6"><SectionHead title="Trust the visual cues"/><div>{motherBases.slice(0,4).map(m=>{const p=motherProcessImages[m.id]?.at(-1);return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}>{p?<img src={p.url} alt={`${m.name}: ${p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase()}`} loading="lazy"/>:<i/>}<span><strong>{m.code}</strong><small>{p?.caption??m.name}</small></span></Link>})}</div></section>}
 <div className="hm-help-links-v5 hm-help-links-v6"><Link href="/prep">Prep</Link><Link href="/plan">Plan</Link><Link href="/kitchen">Kitchen</Link></div>
 </div>}
