"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./Icons";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, motherBases, midBases } from "@/data/home-graph-v3";

const nav=[
 {href:"/",label:"Home",icon:"home" as const},
 {href:"/cook",label:"Cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",icon:"prep" as const},
 {href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",icon:"plan" as const}
];

export function AppShell({children}:{children:React.ReactNode}){
 const pathname=usePathname(); const household=useHousehold();
 const [open,setOpen]=useState(false);const[query,setQuery]=useState("");
 const [messages,setMessages]=useState<{who:"you"|"home";text:string}[]>([{who:"home",text:"Hi. What are we doing?"}]);
 const active=useMemo(()=>nav.find(item=>item.href==="/"?pathname==="/":pathname.startsWith(item.href))?.href,[pathname]);
 const dayIndex=(new Date().getDay()+6)%7; const tonight=getMeal(household.week[dayIndex]??household.week[0]);
 const answer=(q0:string)=>{
  const q=q0.toLowerCase();
  if(q.includes("tonight")||q.includes("eat")||q.includes("cook"))return `I'd do ${tonight.title} tonight. ${tonight.minutes} minutes, and it uses ${[...tonight.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...tonight.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean).join(" + ")||"fresh ingredients"}.`;
  if(q.includes("shop")||q.includes("grocery")||q.includes("buy")){const list=household.shoppingNeeds.slice(0,5).map(x=>`${getIngredient(x.id).name} ${Math.ceil(x.qty)} ${x.unit}`).join(", ");return list?`We're short ${list}${household.shoppingNeeds.length>5?" and a few more things":""}. The Plan tab has the whole list.`:"We're covered for the current week."}
  if(q.includes("prep")||q.includes("base")){const list=household.prepNeeds.map(x=>`${(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code} ×${x.short}`).join(", ");return list?`This week's actual prep is ${list}. Everything else can wait.`:"Prep is covered. Don't make anything just because it's Sunday."}
  if(q.includes("freezer")||q.includes("stock")){const low=motherBases.filter(x=>(household.componentStock[x.id]??0)<=1).map(x=>`${x.code} ${household.componentStock[x.id]??0}`).join(", ");return low?`Low core stock: ${low}. Whether we top it up depends on the next plan.`:"Core freezer stock looks healthy."}
  const base=motherBases.find(x=>q.includes(x.code.toLowerCase())||q.includes(x.name.toLowerCase()));if(base)return `${base.code}: ${base.name}. You have ${household.componentStock[base.id]??0} portions. It supports roughly ${base.approxMeals} dinner directions.`;
  const mid=midBases.find(x=>q.includes(x.code.toLowerCase())||q.includes(x.name.toLowerCase()));if(mid)return `${mid.code}: ${mid.name}. ${mid.parentMotherIds.length?`It works with ${mid.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + ")}.`:"It stands alone."} You have ${household.componentStock[mid.id]??0} portions.`;
  return "Ask me what to cook, what to buy, what to prep, what is low, or about any base. I answer from the same household state as the rest of Home Meals.";
 };
 const send=(text=query)=>{const clean=text.trim();if(!clean)return;setMessages(m=>[...m,{who:"you",text:clean},{who:"home",text:answer(clean)}]);setQuery("")};
 return <div className="hm-app-shell hm-v3-shell">
  <main className="hm-app-main">{children}</main>
  <div className="hm-ask-dock hm-ask-dock-v3"><Link href="/scan" className="hm-round-action" aria-label="Camera"><Icon name="camera"/></Link><button type="button" className="hm-ask-home" onClick={()=>setOpen(true)}><Icon name="spark"/><span>Ask Home</span></button><button type="button" className="hm-round-action" onClick={()=>setOpen(true)} aria-label="Voice"><Icon name="mic"/></button></div>
  <nav className="hm-bottom-nav hm-bottom-nav-v3">{nav.map(item=><Link key={item.href} href={item.href} className={active===item.href?"active":""}><Icon name={item.icon} size={20}/><span>{item.label}</span></Link>)}</nav>
  {open&&<div className="hm-ask-backdrop hm-ask-backdrop-v3" onClick={()=>setOpen(false)}><section className="hm-ask-sheet hm-ask-sheet-v3" onClick={e=>e.stopPropagation()}>
   <header><div><small>JOSH + G · HOME</small><h2>Ask Home</h2><p>Camera, voice, text</p></div><button type="button" onClick={()=>setOpen(false)}>×</button></header>
   <div className="hm-ask-tonight"><span>TONIGHT</span><strong>{tonight.title}</strong><small>{tonight.minutes} min</small><Link href={`/cook/${tonight.id}`}>open ›</Link></div>
   <div className="hm-messages">{messages.map((m,i)=><div key={i} className={m.who}>{m.text}</div>)}</div>
   <div className="hm-ask-action-cards"><button onClick={()=>send("What can we cook tonight?")}><i>🍽</i><strong>Tonight</strong><span>What should we cook?</span></button><button onClick={()=>send("What should I prep?")}><i>🧊</i><strong>Prep</strong><span>What are we low on?</span></button><button onClick={()=>send("What do we need to buy?")}><i>🛒</i><strong>Groceries</strong><span>What's missing?</span></button></div>
   <div className="hm-ask-scan-row"><Link href="/scan"><Icon name="camera"/><span><strong>Scan fridge / receipt / prep</strong><small>Show Home something</small></span><b>›</b></Link></div>
   <div className="hm-composer"><Link href="/scan"><Icon name="camera"/></Link><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about home…"/><button type="button" onClick={()=>send()}><Icon name="arrow"/></button></div>
  </section></div>}
 </div>
}
