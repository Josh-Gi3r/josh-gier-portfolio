"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./Icons";
import { researchedWeek } from "@/data/meal-plan";
import { mealBySlug, researchedMeals } from "@/data/meals-researched";

const nav=[
 {href:"/",label:"Home",icon:"home" as const},{href:"/cook",label:"Cook",icon:"cook" as const},{href:"/prep",label:"Prep",icon:"prep" as const},{href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},{href:"/plan",label:"Plan",icon:"plan" as const},{href:"/learn",label:"Learn",icon:"learn" as const}
];
const todayMeal=()=>{const idx=(new Date().getDay()+6)%7;return mealBySlug(researchedWeek[idx].slug)!};
const replyFor=(query:string)=>{
 const q=query.toLowerCase();
 if(q.includes("gold"))return "GOLD is the Indian onion-tomato masala mother: 60 ml modules, starter batch ×12. The critical cue is properly golden onion first, then tomato cooked until thick and glossy with slight oil separation.";
 if(q.includes("sambal")||q.includes("pecah"))return "For SAMBAL, keep frying until the paste darkens and red oil visibly separates from the solids — pecah minyak. Starter portions are 60 ml ×8.";
 if(q.includes("grocery")||q.includes("shop"))return "Start with the First Run shop, not the Full Library restock. It supports all six mothers plus PESTO, THAI-G, WOK-B, TARE-T and four core boosters.";
 if(q.includes("prep")||q.includes("session"))return "First Run is two sessions: Session A makes all six mothers in about 3½ hours; Session B makes four core mids and four boosters in about 90 minutes.";
 if(q.includes("cream"))return "Cream stays out of frozen mothers. Add it fresh at dinner so bases freeze cleanly and can branch into non-creamy dishes.";
 if(q.includes("label")||q.includes("freezer"))return "Label every frozen component CODE / ML / DATE — e.g. GOLD / 60 / 11SEP. Freeze trays with airflow, then bag portions once solid.";
 if(q.includes("tonight")||q.includes("today")){const m=todayMeal();return `Tonight's researched plan is ${m.title}. It takes about ${m.time} minutes and uses ${m.parts.map(x=>`${x.code} ×${x.count}`).join(", ")}. Open Home or Plan for the full recipe.`}
 const hit=researchedMeals.find(m=>q.split(/\s+/).some(w=>w.length>4&&(`${m.title} ${m.cuisine} ${m.ingredients.join(" ")}`).toLowerCase().includes(w)));
 if(hit&&(q.includes("meal")||q.includes("cook")||q.includes("chicken")||q.includes("fish")||q.includes("beef")||q.includes("vegetarian")))return `${hit.title} is in the researched library: ${hit.time} minutes, ${hit.method}, using ${hit.parts.map(x=>`${x.code} ×${x.count}`).join(", ")}. ${hit.balance}`;
 return "Ask about tonight, a meal, a mother base, mid, booster, shopping, prep order, portion size, freezer label or storage rule. I answer from the researched Home Meals V1 content.";
};

export function AppShell({children}:{children:React.ReactNode}){
 const pathname=usePathname();const[open,setOpen]=useState(false);const[query,setQuery]=useState("");const[messages,setMessages]=useState<{who:"you"|"home";text:string}[]>([{who:"home",text:"Home Meals V1 is live. Ask about tonight, a recipe, the foundation, shopping, prep or freezer stock."}]);
 const active=useMemo(()=>nav.find(item=>item.href==="/"?pathname==="/":pathname.startsWith(item.href))?.href,[pathname]);
 const send=()=>{const clean=query.trim();if(!clean)return;setMessages(m=>[...m,{who:"you",text:clean},{who:"home",text:replyFor(clean)}]);setQuery("")};
 return <div className="app-shell"><aside className="side-rail"><Link href="/" className="brand-mark"><span>H</span><div><strong>Home Meals</strong><small>Josh + G</small></div></Link><nav className="side-nav">{nav.map(item=><Link key={item.href} href={item.href} className={active===item.href?"active":""}><Icon name={item.icon}/><span>{item.label}</span></Link>)}</nav><div className="rail-status"><span className="status-dot"/><div><strong>V1 operating system</strong><small>Foundation + researched meals</small></div></div></aside><main className="app-main">{children}</main><nav className="mobile-nav">{nav.slice(0,5).map(item=><Link key={item.href} href={item.href} className={active===item.href?"active":""}><Icon name={item.icon} size={19}/><span>{item.label}</span></Link>)}</nav><button className="ask-home-fab" onClick={()=>setOpen(true)}><Icon name="spark"/><span>Ask Home</span></button>{open&&<div className="ask-sheet-backdrop" onClick={()=>setOpen(false)}><section className="ask-sheet" onClick={e=>e.stopPropagation()}><div className="ask-sheet-head"><div><span className="eyebrow">HOUSEHOLD BRAIN · V1</span><h2>Ask Home</h2></div><button className="icon-button" onClick={()=>setOpen(false)}>×</button></div><div className="ask-messages">{messages.map((message,i)=><div key={i} className={`message ${message.who}`}>{message.text}</div>)}</div><div className="quick-prompts"><button onClick={()=>setQuery("What is tonight's meal?")}>Tonight</button><button onClick={()=>setQuery("What should I shop first?")}>First shop</button><button onClick={()=>setQuery("How do I know GOLD is ready?")}>GOLD cue</button></div><div className="ask-composer"><Link href="/scan" className="round-action"><Icon name="camera"/></Link><button className="round-action" disabled title="Realtime voice is Phase 2"><Icon name="mic"/></button><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask Home…"/><button className="send-button" onClick={send}><Icon name="arrow"/></button></div></section></div>}</div>
}
