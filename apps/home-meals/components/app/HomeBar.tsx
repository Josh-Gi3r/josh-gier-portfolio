"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useMemo} from "react";
import {Icon} from "../Icons";
import {useHousehold} from "../HouseholdState";
import {JoshPresenceAnchor} from "../JoshPresence";
import {getComponent,getIngredient} from "@/data/home-data";
import {ingredientsForRecipeV7} from "@/data/ingredient-engine-v7";
import {feedback} from "@/lib/feedback";
import {Waves} from "./Orb";

const tabs=[
 {href:"/",label:"Home",guide:"nav-home",icon:"home" as const},
 {href:"/cook",label:"Cook",guide:"nav-cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",guide:"nav-prep",icon:"prep" as const},
 {href:"/kitchen",label:"Kitchen",guide:"nav-kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",guide:"nav-plan",icon:"plan" as const},
 {href:"/learn",label:"More",guide:"nav-more",icon:"more" as const}
];
const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function isCurrent(path:string,href:string){return href==="/"?path==="/":path.startsWith(href)}

// Bottom bar: camera · Josh · voice above the six main tabs. Josh yields whenever a higher-priority assistant surface is speaking.
export function HomeBar(){
 const path=usePathname();const h=useHousehold();
 const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);
 const cameraMode=path.startsWith("/prep")?"Prep":"Fridge";
 const cameraHref=`/scan?mode=${cameraMode}&back=${encodeURIComponent(path)}`;
 const hint=useMemo(()=>{
  if(!(path==="/"||path==="/plan")||!h.kitchenReady)return null;
  const soon=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).sort((a,b)=>new Date(h.useSoonAt[a]??0).getTime()-new Date(h.useSoonAt[b]??0).getTime());
  const displayWeek=h.weekStatus==="suggested"&&h.suggestedWeek?.length===7?h.suggestedWeek:h.week;
  const uncovered=soon.find(id=>!displayWeek.some(rid=>ingredientsForRecipeV7(rid).some(x=>x.ingredientId===id)));
  if(uncovered){const name=getIngredient(uncovered)?.name;const today=(new Date().getDay()+6)%7;const day=days[Math.min(6,today+1)];return {text:`${name} needs using — ${day}?`,href:"/plan"}}
  const short=h.weekStatus==="confirmed"?h.prepNeeds[0]:null;if(short){const c=getComponent(short.id);if(c)return {text:`${c.code} is short for this week`,href:"/prep"}}
  return null;
 },[path,h.kitchenReady,h.useSoon,h.useSoonAt,h.ingredientStock,h.week,h.suggestedWeek,h.weekStatus,h.prepNeeds]);
 if(cookingRoute||path==="/scan")return null;
 const openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 const startVoice=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:voice"))};
 return <div className="hm-bar">
  {hint&&<Link href={hint.href} className="hm-bar-hint" onClick={()=>feedback("tap")}>✦ {hint.text}</Link>}
  <div className="hm-bar-pill" aria-label="Home inputs">
   <Link href={cameraHref} className="hm-bar-side" aria-label="Show Josh with camera" data-home-guide="camera" onClick={()=>feedback("tap")}><Icon name="camera" size={22}/></Link>
   <button className="hm-bar-orb" data-home-guide="orb" onClick={openAsk} aria-label="Ask Josh"><JoshPresenceAnchor priority={10} expression="idle" size={58} observeVisibility={false}/></button>
   <button className="hm-bar-side" data-home-guide="voice" onClick={startVoice} aria-label="Talk to Josh"><Waves/></button>
  </div>
  <nav className="hm-bar-nav" aria-label="Main navigation">
   {tabs.map(t=>{const on=isCurrent(path,t.href);return <Link key={t.href} href={t.href} data-home-guide={t.guide} className={`hm-bar-tab ${on?"on":""}`} aria-current={on?"page":undefined} onClick={()=>feedback("tap")}><Icon name={t.icon} size={24}/><span>{t.label}</span></Link>})}
  </nav>
 </div>;
}
