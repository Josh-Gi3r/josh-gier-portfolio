"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useMemo} from "react";
import {Icon} from "../Icons";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe} from "@/data/home-data";
import {feedback} from "@/lib/feedback";
import {Orb,Waves} from "./Orb";

const tabs=[
 {href:"/",label:"Home",icon:"home" as const},
 {href:"/cook",label:"Cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",icon:"prep" as const},
 {href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",icon:"plan" as const},
 {href:"/learn",label:"More",icon:"more" as const}
];
const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function isCurrent(path:string,href:string){return href==="/"?path==="/":path.startsWith(href)}

// Bottom bar: six flat tabs on a frosted strip, with the camera · orb · voice pill floating above.
// The orb IS the Ask Home button. A hint chip appears above the pill when Home has something to say.
export function HomeBar(){
 const path=usePathname();const h=useHousehold();
 const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);
 const cameraMode=path.startsWith("/prep")?"Prep":"Fridge";
 const cameraHref=`/scan?mode=${cameraMode}&back=${encodeURIComponent(path)}`;
 const hint=useMemo(()=>{
  if(!(path==="/"||path==="/plan")||!h.kitchenReady)return null;
  const soon=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).sort((a,b)=>new Date(h.useSoonAt[a]??0).getTime()-new Date(h.useSoonAt[b]??0).getTime());
  const uncovered=soon.find(id=>!h.week.some(rid=>getRecipe(rid).ingredients.some(x=>x.id===id)));
  if(uncovered){const name=getIngredient(uncovered)?.name;const today=(new Date().getDay()+6)%7;const day=days[Math.min(6,today+1)];return {text:`${name} needs using — ${day}?`,href:"/plan"}}
  const short=h.prepNeeds[0];if(short){const c=getComponent(short.id);if(c)return {text:`${c.code} is short for this week`,href:"/prep"}}
  return null;
 },[path,h.kitchenReady,h.useSoon,h.useSoonAt,h.ingredientStock,h.week,h.prepNeeds]);
 if(cookingRoute)return null;
 const openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 const startVoice=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:voice"))};
 return <div className="hm-bar">
  {hint&&<Link href={hint.href} className="hm-bar-hint" onClick={()=>feedback("tap")}>✦ {hint.text}</Link>}
  <div className="hm-bar-pill" aria-label="Home inputs">
   <Link href={cameraHref} className="hm-bar-side" aria-label="Show Home with camera" onClick={()=>feedback("tap")}><Icon name="camera" size={22}/></Link>
   <button className="hm-bar-orb" onClick={openAsk} aria-label="Ask Home"><Orb size={64}/></button>
   <button className="hm-bar-side" onClick={startVoice} aria-label="Talk to Home"><Waves/></button>
  </div>
  <nav className="hm-bar-nav" aria-label="Main navigation">
   {tabs.map(t=>{const on=isCurrent(path,t.href);return <Link key={t.href} href={t.href} className={`hm-bar-tab ${on?"on":""}`} aria-current={on?"page":undefined} onClick={()=>feedback("tap")}><Icon name={t.icon} size={24}/><span>{t.label}</span></Link>})}
  </nav>
 </div>;
}
