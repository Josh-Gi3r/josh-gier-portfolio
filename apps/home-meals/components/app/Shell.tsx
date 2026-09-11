"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useMemo,useState} from "react";
import {Icon} from "../Icons";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe,motherBases,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {feedback} from "@/lib/feedback";

const nav=[
 {href:"/",label:"Home",icon:"home" as const},
 {href:"/cook",label:"Cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",icon:"prep" as const},
 {href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",icon:"plan" as const}
];

export function Shell({children}:{children:React.ReactNode}){
 const path=usePathname();const h=useHousehold();const[ask,setAsk]=useState(false);const[q,setQ]=useState("");
 const[messages,setMessages]=useState<{who:"you"|"home";text:string}[]>([{who:"home",text:"What do you need?"}]);
 const active=useMemo(()=>nav.find(x=>x.href==="/"?path==="/":path.startsWith(x.href))?.href,[path]);
 const day=(new Date().getDay()+6)%7;const tonight=getRecipe(h.week[day]??h.week[0])??recipes[0];
 const answer=(text:string)=>{const s=text.toLowerCase();
  if(!h.kitchenReady&&(s.includes("have")||s.includes("buy")||s.includes("prep")||s.includes("freezer")||s.includes("soon")))return "I don't know the kitchen yet. Check Fridge, Freezer and Pantry once, then I can use the real stock.";
  if(s.includes("soon")||s.includes("go bad")||s.includes("expire")){const a=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).map(id=>getIngredient(id)?.name).filter(Boolean);return a.length?`Use these first: ${a.slice(0,6).join(", ")}${a.length>6?"…":""}`:"Nothing is marked use soon."}
  if(s.includes("tonight")||s.includes("cook")||s.includes("eat"))return `${recipeTitle(tonight.id,tonight.title)} is on tonight. ${tonight.minutes} minutes.`;
  if(s.includes("buy")||s.includes("shop")||s.includes("grocery")){const a=h.shoppingNeeds.slice(0,5).map(x=>getIngredient(x.id)?.name).filter(Boolean);return a.length?`Top of the list: ${a.join(", ")}${h.shoppingNeeds.length>5?"…":""}`:"We have what this week needs."}
  if(s.includes("prep")||s.includes("freezer")){const a=h.prepNeeds.slice(0,5).map(x=>{const c=getComponent(x.id);return c?`${c.code} ${x.shortMl} ml`:""}).filter(Boolean);return a.length?`Prep next: ${a.join(", ")}.`:"This week is covered."}
  if(s.includes("favourite")||s.includes("favorite")){const a=recipes.filter(r=>h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4).slice(0,6);return a.length?`Our favourites: ${a.map(x=>recipeTitle(x.id,x.title)).join(", ")}.`:"We haven't marked any favourites yet."}
  const base=motherBases.find(x=>s.includes(x.code.toLowerCase())||s.includes(x.name.toLowerCase()));if(base)return `${base.code}: ${h.componentStock[base.id]??0} ml in the freezer.`;
  return "Ask about tonight, what to use soon, groceries, prep, favourites, or what we have at home.";
 };
 const send=(text=q)=>{const clean=text.trim();if(!clean)return;setMessages(v=>[...v,{who:"you",text:clean},{who:"home",text:answer(clean)}]);setQ("");feedback("change")};
 return <div className="hm-shell-v5">
  <main className="hm-main-v5">{children}</main>
  <nav className="hm-nav-v5" aria-label="Main navigation">{nav.map(item=><Link href={item.href} key={item.href} className={active===item.href?"active":""} onClick={()=>feedback("tap")}><Icon name={item.icon} size={22}/><span>{item.label}</span></Link>)}</nav>
  <button className="hm-ask-fab-v5" onClick={()=>{setAsk(true);feedback("tap")}} aria-label="Ask Home"><Icon name="spark" size={22}/><span>Ask Home</span></button>
  {ask&&<div className="hm-sheet-backdrop-v5" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setAsk(false)}}><section className="hm-sheet-v5 hm-ask-sheet-v5" role="dialog" aria-modal="true" aria-label="Ask Home">
   <div className="hm-sheet-handle-v5"/><header><div><span>HOME</span><h2>Ask Home</h2></div><button className="hm-icon-button-v5" onClick={()=>setAsk(false)} aria-label="Close">×</button></header>
   <div className="hm-ask-context-v5"><div><span>Tonight</span><strong>{recipeTitle(tonight.id,tonight.title)}</strong></div><Link href={`/cook/${tonight.id}`} onClick={()=>setAsk(false)}>Open</Link></div>
   <div className="hm-ask-messages-v5">{messages.slice(-6).map((m,i)=><div key={i} className={m.who}>{m.text}</div>)}</div>
   <div className="hm-ask-quick-v5"><button onClick={()=>send("What should we cook tonight?")}>Tonight</button><button onClick={()=>send("What should we use soon?")}>Use soon</button><button onClick={()=>send("What do we need to buy?")}>Groceries</button><button onClick={()=>send("What should we prep?")}>Prep</button><Link href="/scan" onClick={()=>setAsk(false)}>Camera</Link></div>
   <form className="hm-composer-v5" onSubmit={e=>{e.preventDefault();send()}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about home…" autoFocus/><button aria-label="Send"><Icon name="arrow" size={18}/></button></form>
  </section></div>}
 </div>
}
