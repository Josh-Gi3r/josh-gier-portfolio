"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "../Icons";
import {feedback} from "@/lib/feedback";

const leftNav=[
 {href:"/",label:"Home",icon:"home" as const},
 {href:"/cook",label:"Cook",icon:"cook" as const},
 {href:"/prep",label:"Prep",icon:"prep" as const},
];
const rightNav=[
 {href:"/kitchen",label:"Kitchen",icon:"kitchen" as const},
 {href:"/plan",label:"Plan",icon:"plan" as const},
 {href:"/learn",label:"More",icon:"more" as const},
];

function isCurrent(path:string,href:string){
 if(href==="/")return path==="/";
 return path.startsWith(href);
}

export function HomeDock(){
 const path=usePathname();
 const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);
 if(cookingRoute)return null;
 const cameraMode=path.startsWith("/prep")?"Prep":path.startsWith("/kitchen")?"Fridge":"Fridge";
 const cameraHref=`/scan?mode=${cameraMode}&back=${encodeURIComponent(path)}`;
 const openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 const startVoice=()=>{
  feedback("tap");
  const W=window as typeof window & {SpeechRecognition?:new()=>any;webkitSpeechRecognition?:new()=>any};
  const Recognition=W.SpeechRecognition||W.webkitSpeechRecognition;
  if(!Recognition){openAsk();return}
  const rec=new Recognition();
  rec.lang="en-SG";rec.interimResults=false;rec.maxAlternatives=1;
  rec.onresult=(e:any)=>{
   const text=e.results?.[0]?.[0]?.transcript??"";
   openAsk();
   if(!text)return;
   window.setTimeout(()=>{
    const input=document.querySelector<HTMLInputElement>(".hm-composer-v5 input");
    if(!input)return;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value")?.set;
    setter?.call(input,text);
    input.dispatchEvent(new Event("input",{bubbles:true}));
    window.setTimeout(()=>input.form?.requestSubmit(),30);
   },120);
  };
  rec.onerror=()=>openAsk();
  rec.start();
 };
 return <nav className="hm-dock-v75" aria-label="Home Meals navigation">
  <div className="hm-dock-wing-v75 hm-dock-left-v75">
   {leftNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={current?"active":""} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}
  </div>
  <div className="hm-dock-center-v75" aria-label="Home inputs">
   <Link href={cameraHref} className="hm-dock-side-button-v75" aria-label="Show Home with camera"><Icon name="camera" size={24}/></Link>
   <button className="hm-dock-ask-v75" onClick={openAsk} aria-label="Ask Home"><Icon name="spark" size={21}/><span>Ask Home</span></button>
   <button className="hm-dock-side-button-v75" onClick={startVoice} aria-label="Talk to Home"><Icon name="mic" size={24}/></button>
  </div>
  <div className="hm-dock-wing-v75 hm-dock-right-v75">
   {rightNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={current?"active":""} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}
  </div>
 </nav>
}
