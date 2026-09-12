"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useMemo,useState} from "react";
import {Icon} from "../Icons";
import {useHousehold} from "../HouseholdState";
import {getIngredient,getRecipe,ingredients,prepComponents,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {recipeAvailability} from "@/data/stock-math";
import {formatQty} from "./Primitives";
import {bindGlobalHaptics,feedback} from "@/lib/feedback";
import {useSheet} from "@/lib/useSheet";

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
 const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);
 const day=(new Date().getDay()+6)%7;const tonight=getRecipe(h.week[day]??h.week[0])??recipes[0];
 useEffect(()=>bindGlobalHaptics(),[]);useSheet(ask,()=>setAsk(false));
 const answer=(text:string)=>{const s=text.toLowerCase();
  const needsKitchen=s.includes("have")||s.includes("buy")||s.includes("shop")||s.includes("grocery")||s.includes("prep")||s.includes("freezer")||s.includes("soon")||s.includes("low")||s.includes("make now")||s.includes("ready now");
  if(!h.kitchenReady&&needsKitchen)return "I don't know the kitchen yet. Check Fridge, Freezer and Pantry once, then I can use the real stock.";
  if(s.includes("soon")||s.includes("go bad")||s.includes("expire")){const a=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).map(id=>getIngredient(id)?.name).filter(Boolean);return a.length?`Use these first: ${a.slice(0,6).join(", ")}${a.length>6?"…":"."}`:"Nothing is marked use soon."}
  if(s.includes("tonight")||s.includes("eat tonight")){const a=recipeAvailability(tonight.id,h.componentStock,h.ingredientStock);const missing=a.missingPrep.length+a.missingIngredients.length;return `${recipeTitle(tonight.id,tonight.title)} is on tonight. ${tonight.minutes} minutes. ${!h.kitchenReady?"Check Kitchen if you want me to confirm the stock.":a.ready?"We have everything for it.":`${missing} ${missing===1?"thing is":"things are"} still missing.`}`}
  if(s.includes("make now")||s.includes("ready now")||s.includes("what can we make")){const ready=recipes.filter(r=>recipeAvailability(r.id,h.componentStock,h.ingredientStock).ready).sort((a,b)=>Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||a.minutes-b.minutes).slice(0,4);return ready.length?`Ready now: ${ready.map(r=>recipeTitle(r.id,r.title)).join(", ")}.`:"Nothing is fully covered right now. Plan shows what we need to buy or prep."}
  if(s.includes("buy")||s.includes("shop")||s.includes("grocery")){const a=h.shoppingNeeds.slice(0,5).map(x=>getIngredient(x.id)?.name).filter(Boolean);return a.length?`${h.shoppingNeeds.length} ${h.shoppingNeeds.length===1?"thing":"things"} to buy. First up: ${a.join(", ")}${h.shoppingNeeds.length>5?"…":"."}`:"We have what this week needs."}
  if(s.includes("prep")||s.includes("freezer")||s.includes("low")){const a=h.prepNeeds.slice(0,5).map(x=>{const c=prepComponents.find(y=>y.id===x.id);return c?`${c.code} ${x.shortMl} ml`:""}).filter(Boolean);return a.length?`Prep next: ${a.join(", ")}.`:"The freezer covers this week."}
  if(s.includes("favourite")||s.includes("favorite")||s.includes("we like")){const a=recipes.filter(r=>h.favourites[r.id]||(h.ratings[r.id]?.josh??0)>=4||(h.ratings[r.id]?.g??0)>=4).slice(0,6);return a.length?`Our favourites: ${a.map(x=>recipeTitle(x.id,x.title)).join(", ")}.`:"We haven't marked any favourites yet."}
  if(s.includes("last")&&(s.includes("cook")||s.includes("meal")||s.includes("dinner")||s.includes("time"))){const last=h.history[0]?getRecipe(h.history[0].mealId):null;return last?`Last cooked: ${recipeTitle(last.id,last.title)}.${h.recipeNotes[last.id]?.[0]?` Note: “${h.recipeNotes[last.id][0].text}”`:""}`:"We haven't logged a dinner yet."}
  if(s.includes("this week")||s.includes("week plan")){return `This week: ${h.week.map(id=>recipeTitle(getRecipe(id).id,getRecipe(id).title)).join(", ")}.`}
  const component=prepComponents.find(x=>s.includes(x.code.toLowerCase())||s.includes(x.name.toLowerCase()));if(component)return h.kitchenReady?`${component.code}: ${h.componentStock[component.id]??0} ml in the freezer.`:"Check the freezer first and I can tell you.";
  const ingredient=ingredients.find(x=>s.includes(x.name.toLowerCase())||s.includes(x.id.replace(/-/g," ")));if(ingredient){const n=h.ingredientStock[ingredient.id]??0;if(ingredient.tracking==="state")return `${ingredient.name}: ${n>0?"we have it":"we're out"}.`;return `${ingredient.name}: ${n>0?formatQty(n,ingredient.unit):"out"}.`}
  if(s.includes("have")||s.includes("at home")||s.includes("kitchen")){const stockedIngredients=ingredients.filter(x=>(h.ingredientStock[x.id]??0)>0).length;const stockedMothers=prepComponents.filter(x=>x.kind==="mother"&&(h.componentStock[x.id]??0)>0).length;const soon=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).length;return `At home: ${stockedIngredients} tracked ingredients, ${stockedMothers}/8 mother bases stocked${soon?`, and ${soon} marked use soon`:""}.`;}
  return "Ask me about tonight, what we have, what can be made now, groceries, prep, use-soon food, favourites, or the last dinner.";
 }
 const send=(text=q)=>{const clean=text.trim();if(!clean)return;setMessages(v=>[...v,{who:"you",text:clean},{who:"home",text:answer(clean)}]);setQ("");feedback("change")};
 return <div className="hm-shell-v5">
  {cookingRoute?<div className="hm-main-v5">{children}</div>:<main className="hm-main-v5">{children}</main>}
  {h.storageIssue&&<div className="hm-storage-warning-v5" role="status"><span><strong>Changes aren’t saving on this device.</strong><small>Keep this tab open and try again before closing Home Meals.</small></span><button onClick={h.clearStorageIssue} aria-label="Dismiss save warning">×</button></div>}
  <nav className="hm-nav-v5" aria-label="Main navigation">{nav.map(item=><Link href={item.href} key={item.href} className={active===item.href?"active":""}><Icon name={item.icon} size={22}/><span>{item.label}</span></Link>)}</nav>
  <button className="hm-ask-fab-v5" onClick={()=>setAsk(true)} aria-label="Ask Home"><Icon name="spark" size={22}/><span>Ask Home</span></button>
  {ask&&<div className="hm-sheet-backdrop-v5" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setAsk(false)}}><section className="hm-sheet-v5 hm-ask-sheet-v5" role="dialog" aria-modal="true" aria-label="Ask Home">
   <div className="hm-sheet-handle-v5"/><header><div><span>HOME</span><h2>Ask Home</h2></div><button className="hm-icon-button-v5" onClick={()=>setAsk(false)} aria-label="Close">×</button></header>
   <div className="hm-ask-context-v5"><div><span>Tonight</span><strong>{recipeTitle(tonight.id,tonight.title)}</strong></div><Link href={`/cook/${tonight.id}`} onClick={()=>setAsk(false)}>Open</Link></div>
   <div className="hm-ask-messages-v5" tabIndex={0} aria-label="Ask Home conversation">{messages.slice(-6).map((m,i)=><div key={i} className={m.who}>{m.text}</div>)}</div>
   <div className="hm-ask-quick-v5"><button onClick={()=>send("What should we cook tonight?")}>Tonight</button><button onClick={()=>send("What can we make now?")}>Ready now</button><button onClick={()=>send("What should we use soon?")}>Use soon</button><button onClick={()=>send("What do we need to buy?")}>Groceries</button><button onClick={()=>send("What should we prep?")}>Prep</button><Link href={`/scan?mode=${cookingRoute||path.startsWith("/prep")?"Prep":"Fridge"}&back=${encodeURIComponent(path)}`} onClick={()=>setAsk(false)}>Camera</Link></div>
   <form className="hm-composer-v5" onSubmit={e=>{e.preventDefault();send()}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about home…" aria-label="Ask Home" autoFocus/><button aria-label="Send"><Icon name="arrow" size={18}/></button></form>
  </section></div>}
 </div>
}
