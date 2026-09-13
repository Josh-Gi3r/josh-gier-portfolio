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
function isCurrent(path:string,href:string){if(href==="/")return path==="/";return path.startsWith(href)}
function DockShell(){return <svg className={styles.shell} viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="hmDockFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffdf8"/><stop offset="58%" stopColor="#faf6ef"/><stop offset="100%" stopColor="#f0e5d6"/></linearGradient><linearGradient id="hmDockEdge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ead8b0"/><stop offset="100%" stopColor="#c59e57"/></linearGradient><filter id="hmDockShadow" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#4a3924" floodOpacity=".20"/></filter></defs><path filter="url(#hmDockShadow)" fill="url(#hmDockFill)" stroke="url(#hmDockEdge)" strokeWidth="1.7" d="M42 50 H330 C349 50 359 44 372 35 C386 25 400 29 414 24 C433 17 451 4 500 4 C549 4 567 17 586 24 C600 29 614 25 628 35 C641 44 651 50 670 50 H958 C982 50 994 68 994 91 V132 C994 149 982 158 958 158 H42 C18 158 6 149 6 132 V91 C6 68 18 50 42 50 Z"/><path fill="none" stroke="rgba(255,255,255,.90)" strokeWidth="1.2" d="M44 54 H332 C350 54 361 48 374 39 C388 29 402 33 416 28 C435 21 453 9 500 9 C547 9 565 21 584 28 C598 33 612 29 626 39 C639 48 650 54 668 54 H956"/></svg>}
export function HomeDock(){
 const path=usePathname();const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);if(cookingRoute)return null;
 const cameraMode=path.startsWith("/prep")?"Prep":path.startsWith("/kitchen")?"Fridge":"Fridge";const cameraHref=`/scan?mode=${cameraMode}&back=${encodeURIComponent(path)}`;
 const openAsk=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:ask"))};
 const startVoice=()=>{feedback("tap");window.dispatchEvent(new Event("home-meals:voice"))};
 return <nav className={styles.dock} aria-label="Home Meals navigation"><DockShell/><div className={`${styles.wing} ${styles.left}`}>{leftNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={`${styles.navItem} ${current?styles.active:""}`} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}</div><div className={styles.center} aria-label="Home inputs"><Link href={cameraHref} className={styles.sideButton} aria-label="Show Home with camera"><Icon name="camera" size={24}/></Link><button className={styles.ask} onClick={openAsk} aria-label="Ask Home"><Icon name="spark" size={21}/><span>Ask Home</span></button><button className={styles.sideButton} onClick={startVoice} aria-label="Talk to Home"><Icon name="mic" size={24}/></button></div><div className={`${styles.wing} ${styles.right}`}>{rightNav.map(item=>{const current=isCurrent(path,item.href);return <Link key={item.href} href={item.href} className={`${styles.navItem} ${current?styles.active:""}`} aria-current={current?"page":undefined}><Icon name={item.icon} size={24}/><span>{item.label}</span></Link>})}</div></nav>
}
