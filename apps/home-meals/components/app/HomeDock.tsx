"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "../Icons";
import {feedback} from "@/lib/feedback";
import styles from "./HomeDock.module.css";

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

function DockShell(){
 return <svg className={styles.shell} viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
  <defs>
   <linearGradient id="hmDockFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#fffdf8"/>
    <stop offset="60%" stopColor="#faf6ef"/>
    <stop offset="100%" stopColor="#f1e7d9"/>
   </linearGradient>
   <linearGradient id="hmDockEdge" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#ead7ae"/>
    <stop offset="100%" stopColor="#c9a45e"/>
   </linearGradient>
   <filter id="hmDockShadow" x="-10%" y="-20%" width="120%" height="145%">
    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#4a3924" floodOpacity=".18"/>
   </filter>
  </defs>
  <path filter="url(#hmDockShadow)" fill="url(#hmDockFill)" stroke="url(#hmDockEdge)" strokeWidth="1.6" d="M42 55 H332 C350 55 359 49 372 39 C386 28 401 33 414 28 C433 21 450 8 500 8 C550 8 567 21 586 28 C599 33 614 28 628 39 C641 49 650 55 668 55 H958 C982 55 994 71 994 93 V128 C994 145 982 152 958 152 H42 C18 152 6 145 6 128 V93 C6 71 18 55 42 55 Z"/>
  <path fill="none" stroke="rgba(255,255,255,.88)" strokeWidth="1.25" d="M43 58 H333 C351 58 361 51 374 42 C388 31 402 36 416 31 C435 24 452 12 500 12 C548 12 565 24 584 31 C598 36 612 31 626 42 C639 51 649 58 667 58 H957"/>
 </svg>
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
 return <nav className={styles.dock} aria-label="Home Meals navigation">
  <DockShell/>
  <div className={`${styles.wing} ${styles.left}`}>
   {leftNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={`${styles.navItem} ${current?styles.active:""}`} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}
  </div>
  <div className={styles.center} aria-label="Home inputs">
   <Link href={cameraHref} className={styles.sideButton} aria-label="Show Home with camera"><Icon name="camera" size={24}/></Link>
   <button className={styles.ask} onClick={openAsk} aria-label="Ask Home"><Icon name="spark" size={21}/><span>Ask Home</span></button>
   <button className={styles.sideButton} onClick={startVoice} aria-label="Talk to Home"><Icon name="mic" size={24}/></button>
  </div>
  <div className={`${styles.wing} ${styles.right}`}>
   {rightNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={`${styles.navItem} ${current?styles.active:""}`} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}
  </div>
 </nav>
}
