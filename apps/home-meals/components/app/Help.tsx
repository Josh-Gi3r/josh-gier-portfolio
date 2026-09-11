import Link from "next/link";
import {Back,PageHead,SectionHead} from "./Primitives";
import {motherBases} from "@/data/home-data";
import {PortionScale} from "../PortionScale";

const cards=[
 {href:"/learn/system",icon:"↻",title:"How it fits together",copy:"Plan meals, check what’s home, shop the gap, prep the slow bits, cook, then remember what worked."},
 {href:"/learn/portions",icon:"▦",title:"Freezer portions",copy:"Why DARK stays small, GOLD freezes bigger and stock needs the most room."},
 {href:"/learn/prep-day",icon:"✓",title:"Prep day",copy:"A simple order for cooking, cooling, labelling and freezing."},
 {href:"/learn/freezer",icon:"❄",title:"Freezer layout",copy:"Where bases, mids and proteins should live."}
];
export function Help(){return <div className="hm-page-v5 hm-help-v5"><Back href="/" label="Home"/><PageHead eyebrow="HELP" title="Quick guides" sub="Only the bits worth checking while we cook."/><div className="hm-help-cards-v5">{cards.map(c=><Link href={c.href} key={c.href}><i>{c.icon}</i><span><strong>{c.title}</strong><small>{c.copy}</small></span><b>›</b></Link>)}</div><section className="hm-block-v5"><SectionHead eyebrow="MOTHER BASES" title="The eight foundations"/><div className="hm-mother-mini-v5">{motherBases.map(m=><Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}><i/><strong>{m.code}</strong><span>{m.name}</span></Link>)}</div></section></div>}
export function Guide({slug}:{slug:string}){const data:Record<string,{title:string;sub:string;steps:string[]}>={
 system:{title:"How Home Meals fits together",sub:"The same dinner moves from the plan to the shopping list, prep, cooking and our notes.",steps:["Pick the week’s recipes.","Check what is already in the kitchen.","Buy only what is missing.","Prep only what the week is short of.","Cook from the recipe quantities.","Rate it and leave a note for next time."]},
 portions:{title:"Freezer portions",sub:"Strong things stay small. Bulky bases and stock freeze bigger.",steps:["30 ml: strong sauce or concentrate.","60 ml: small sauce portion.","120–250 ml: larger dinner portions.","350–500 ml: tomato sauce or stock.","Label name, amount and date."]},
 "prep-day":{title:"Prep day",sub:"Do the slow work once, then get out of the kitchen.",steps:["Start with the week’s actual shortfalls.","Put long cooks on first.","Make faster pastes while they run.","Cool safely.","Portion and label.","Freeze new stock behind older stock."]},
 freezer:{title:"Freezer layout",sub:"A predictable freezer is quicker to use and easier to count.",steps:["Keep mothers together.","Keep mids and boosters together.","Pack raw protein by dinner.","Keep rice/carbs separate.","Old stock in front, new stock behind.","No mystery tubs: label everything."]}
 };const g=data[slug];if(!g)return null;return <div className="hm-page-v5 hm-guide-v5"><Back href="/learn" label="Guides"/><PageHead eyebrow="GUIDE" title={g.title} sub={g.sub}/><ol className="hm-guide-steps-v5">{g.steps.map((s,i)=><li key={s}><b>{i+1}</b><span>{s}</span></li>)}</ol>{slug==="portions"&&<PortionScale/>}<div className="hm-help-links-v5"><Link href="/prep">Prep</Link><Link href="/plan">Plan</Link><Link href="/kitchen">Kitchen</Link></div></div>}
