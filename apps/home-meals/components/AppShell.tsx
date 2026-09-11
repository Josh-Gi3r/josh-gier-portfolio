"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./Icons";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, motherBases, midBases } from "@/data/home-graph";

const nav=[
 {href:"/",label:"Home",icon:"home" as const},
 {href:"/cook",label:"Cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",icon:"prep" as const},
 {href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",icon:"plan" as const}
];

export function AppShell({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 const household=useHousehold();
 const [open,setOpen]=useState(false);const[query,setQuery]=useState("");
 const [messages,setMessages]=useState<{who:"you"|"home";text:string}[]>([{who:"home",text:"Hi. Ask me what we're eating, what needs using, what to buy, or what needs prep."}]);
 const active=useMemo(()=>nav.find(item=>item.href==="/"?pathname==="/":pathname.startsWith(item.href))?.href,[pathname]);
 const dayIndex=(new Date().getDay()+6)%7;
 const tonight=getMeal(household.week[dayIndex]??household.week[0]);
 const answer=(q0:string)=>{
  const q=q0.toLowerCase();
  if(q.includes("tonight")||q.includes("eat")||q.includes("cook"))return `Tonight is ${tonight.title}. About ${tonight.minutes} minutes. It uses ${[...tonight.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...tonight.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean).join(" + ")||"fresh ingredients only"}.`;
  if(q.includes("shop")||q.includes("grocery")||q.includes("buy")){const list=household.shoppingNeeds.slice(0,5).map(x=>`${getIngredient(x.id).name} ${Math.ceil(x.qty)} ${x.unit}`).join(", ");return list?`For this week's actual plan, you still need ${list}${household.shoppingNeeds.length>5?" and a few more items":""}. Plan has the full linked list.`:"You already have everything required for the current week."}
  if(q.includes("prep")||q.includes("base")){const list=household.prepNeeds.map(x=>`${(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code} ×${x.short}`).join(", ");return list?`Based on this week's meals and current freezer stock, prep ${list}. Everything else can wait.`:"Your current prep stock covers the planned week. Don't make anything just because it's prep day."}
  if(q.includes("freezer")||q.includes("stock")){const low=household.prepNeeds.slice(0,4).map(x=>`${(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code} ${x.onHand} left`).join(", ");return low?`The relevant low stock is ${low}. Prep is driven by the week, not by filling every slot.`:"The planned week is covered by current prep stock."}
  const base=motherBases.find(x=>q.includes(x.code.toLowerCase())||q.includes(x.name.toLowerCase())); if(base)return `${base.code}: ${base.name}. ${base.purpose} You have ${household.componentStock[base.id]??0} portions. This base unlocks roughly ${base.approxMeals} dinner directions.`;
  const mid=midBases.find(x=>q.includes(x.code.toLowerCase())||q.includes(x.name.toLowerCase())); if(mid)return `${mid.code}: ${mid.name}. It links to ${mid.parentMotherIds.map(id=>motherBases.find(x=>x.id===id)?.code).filter(Boolean).join(" + ")||"no mother base"} and opens ${mid.examples.join(", ")}. You have ${household.componentStock[mid.id]??0} portions.`;
  return "Ask me about tonight, this week's groceries, what to prep, freezer stock, or any base. Everything I answer comes from the same linked household state.";
 };
 const send=()=>{const clean=query.trim();if(!clean)return;setMessages(m=>[...m,{who:"you",text:clean},{who:"home",text:answer(clean)}]);setQuery("")};
 return <div className="hm-app-shell">
  <main className="hm-app-main">{children}</main>
  <div className="hm-ask-dock"><Link href="/scan" className="hm-round-action" aria-label="Camera"><Icon name="camera"/></Link><button type="button" className="hm-ask-home" onClick={()=>setOpen(true)}><Icon name="spark"/><span>Ask Home</span></button><button type="button" className="hm-round-action" onClick={()=>setOpen(true)} aria-label="Voice"><Icon name="mic"/></button></div>
  <nav className="hm-bottom-nav">{nav.map(item=><Link key={item.href} href={item.href} className={active===item.href?"active":""}><Icon name={item.icon} size={20}/><span>{item.label}</span></Link>)}</nav>
  {open&&<div className="hm-ask-backdrop" onClick={()=>setOpen(false)}><section className="hm-ask-sheet" onClick={e=>e.stopPropagation()}><header><div><small>JOSH + G · HOME</small><h2>Ask Home</h2><p>Camera, voice, text</p></div><button type="button" onClick={()=>setOpen(false)}>×</button></header><div className="hm-messages">{messages.map((m,i)=><div key={i} className={m.who}>{m.text}</div>)}</div><div className="hm-quick"><button onClick={()=>setQuery("What can we cook tonight?")}>Tonight</button><button onClick={()=>setQuery("What do we need to buy?")}>Groceries</button><button onClick={()=>setQuery("What should I prep?")}>Prep</button></div><div className="hm-composer"><Link href="/scan"><Icon name="camera"/></Link><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about home…"/><button type="button" onClick={send}><Icon name="arrow"/></button></div></section></div>}
 </div>
}
