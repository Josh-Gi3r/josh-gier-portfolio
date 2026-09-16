"use client";

import {usePathname,useRouter} from "next/navigation";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "./HouseholdState";
import {getHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import {feedback} from "@/lib/feedback";

type Surface="home"|"cook"|"prep"|"kitchen"|"plan";
type Stage="idle"|"welcome"|"menu"|"tour"|"topic"|"finish";
type GuideMode="first"|"summoned";
type Rect={left:number;top:number;width:number;height:number};
type Step={anchor:string;highlight?:string;line:string;expression:"hello"|"talk"|"look"|"pleased";actions?:{label:string;onClick:()=>void;primary?:boolean}[]};

const CORE:Surface[]=["home","cook","prep","kitchen","plan"];
const GUIDE_KEY="home-meals-guide-v1";
const routeFor:Record<Surface,string>={home:"/",cook:"/cook",prep:"/prep",kitchen:"/kitchen",plan:"/plan"};
const navFor:Record<Surface,string>={home:'[data-home-guide="nav-home"]',cook:'[data-home-guide="nav-cook"]',prep:'[data-home-guide="nav-prep"]',kitchen:'[data-home-guide="nav-kitchen"]',plan:'[data-home-guide="nav-plan"]'};
const surfaceAnchor:Record<Surface,string>={home:'[data-home-guide="home-tonight"]',cook:'[data-home-guide="surface-cook"]',prep:'[data-home-guide="surface-prep"]',kitchen:'[data-home-guide="surface-kitchen"]',plan:'[data-home-guide="surface-plan"]'};
const surfaceName:Record<Surface,string>={home:"Home",cook:"Cook",prep:"Prep",kitchen:"Kitchen",plan:"Plan"};
const surfaceLine:Record<Surface,string>={
 home:"This is the important bit — what are we eating?",
 cook:"Yep. All our recipes live here. ‘Ready now’ uses what we actually have.",
 prep:"Prep is our shortcut stash — bases, pastes, sauces, all the stuff we make ahead so dinner’s easier.",
 kitchen:"Kitchen is what we actually have. If it’s not in here, Home won’t pretend it is.",
 plan:"This is our week. Change anything you don’t fancy."
};

function surfaceFromPath(path:string):Surface|null{
 if(path==="/")return"home";
 if(path==="/cook")return"cook";
 if(path==="/prep")return"prep";
 if(path==="/kitchen")return"kitchen";
 if(path==="/plan")return"plan";
 return null;
}
function readFirstRun(person:HouseholdPerson){
 if(typeof window==="undefined")return"unseen" as const;
 try{const raw=localStorage.getItem(`${GUIDE_KEY}:${person}`);if(!raw)return"unseen" as const;const x=JSON.parse(raw) as {status?:string};return x.status==="completed"||x.status==="dismissed"?x.status:"unseen"}catch{return"unseen" as const}
}
function writeFirstRun(person:HouseholdPerson,status:"completed"|"dismissed"){
 try{localStorage.setItem(`${GUIDE_KEY}:${person}`,JSON.stringify({status,at:new Date().toISOString()}))}catch{}
}
function emit(name:string,detail:Record<string,unknown>={}){
 try{window.dispatchEvent(new CustomEvent("home-meals:guide-analytics",{detail:{name,at:new Date().toISOString(),...detail}}))}catch{}
}
function area(a:Rect,b:Rect){const x=Math.max(0,Math.min(a.left+a.width,b.left+b.width)-Math.max(a.left,b.left)),y=Math.max(0,Math.min(a.top+a.height,b.top+b.height)-Math.max(a.top,b.top));return x*y}
function toRect(r:DOMRect):Rect{return{left:r.left,top:r.top,width:r.width,height:r.height}}

export function HomeGuideProvider({children}:{children:React.ReactNode}){
 const path=usePathname(),router=useRouter(),h=useHousehold();
 const[person,setPerson]=useState<HouseholdPerson|null>(null),[stage,setStage]=useState<Stage>("idle"),[mode,setMode]=useState<GuideMode>("summoned"),[seen,setSeen]=useState<Set<Surface>>(new Set()),[topic,setTopic]=useState<Surface|null>(null),[blocked,setBlocked]=useState(false);
 const surface=surfaceFromPath(path),lastSurface=useRef<Surface|null>(null);
 const stop=(reason:"dismissed"|"completed"|"closed")=>{if(mode==="first"&&person){if(reason==="completed")writeFirstRun(person,"completed");else writeFirstRun(person,"dismissed")}emit(`home_guide_${reason}`,{person,mode});setStage("idle");setSeen(new Set());setTopic(null)};

 useEffect(()=>{const sync=()=>setPerson(getHouseholdPerson());sync();window.addEventListener("home-meals:person",sync);return()=>window.removeEventListener("home-meals:person",sync)},[]);
 useEffect(()=>{
  const summon=(event:Event)=>{const detail=(event as CustomEvent<{topic?:Surface}>).detail;setMode("summoned");setSeen(new Set());setTopic(detail?.topic??null);setStage(detail?.topic?"topic":"menu");if(detail?.topic)router.push(routeFor[detail.topic]);emit("home_guide_summoned",{person,topic:detail?.topic??null})};
  window.addEventListener("home-meals:guide",summon as EventListener);return()=>window.removeEventListener("home-meals:guide",summon as EventListener)
 },[person,router]);
 useEffect(()=>{
  if(person!=="g"||!h.kitchenReady||stage!=="idle"||!surface||readFirstRun("g")!=="unseen")return;
  const timer=window.setTimeout(()=>{if(document.querySelector('[role="dialog"][aria-modal="true"]'))return;setMode("first");setSeen(new Set());setStage("welcome");emit("home_guide_started",{person:"g",mode:"first"})},900);
  return()=>window.clearTimeout(timer)
 },[person,h.kitchenReady,stage,surface]);
 useEffect(()=>{
  if(stage!=="tour"||!surface)return;
  setSeen(prev=>{if(prev.has(surface))return prev;const next=new Set(prev);next.add(surface);return next});
  if(lastSurface.current!==surface){emit("home_guide_step_seen",{person,mode,surface});lastSurface.current=surface}
 },[stage,surface,person,mode]);
 useEffect(()=>{
  if(stage!=="tour"||surface!=="home")return;
  const effective=new Set(seen);effective.add("home");if(CORE.every(x=>effective.has(x)))setStage("finish")
 },[stage,surface,seen]);
 useEffect(()=>{
  if(stage==="idle")return;
  const check=()=>setBlocked(!!document.querySelector('[role="dialog"][aria-modal="true"],.hm-sheet-backdrop'));
  check();const observer=new MutationObserver(check);observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect()
 },[stage]);

 const startTour=()=>{feedback("tap");setSeen(new Set());setTopic(null);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_first_run_accepted",{person})};
 const startQuick=()=>{feedback("tap");setSeen(new Set());setTopic(null);setStage("tour");if(!surface)router.push("/");emit("home_guide_quick_lap",{person})};
 const startTopic=(s:Surface)=>{feedback("tap");setTopic(s);setStage("topic");router.push(routeFor[s]);emit("home_guide_specific_help_selected",{person,surface:s})};

 const step=useMemo<Step|null>(()=>{
  const orb='[data-home-guide="orb"]';
  if(stage==="welcome")return{anchor:orb,highlight:orb,line:"Hey sunshine ☀️. Come, I’ll show you around. Takes a minute.",expression:"hello",actions:[{label:"Show me",onClick:startTour,primary:true},{label:"Not now",onClick:()=>stop("dismissed")}]};
  if(stage==="menu")return{anchor:orb,highlight:orb,line:"Course. Quick lap, or are you looking for something?",expression:"hello",actions:[{label:"Quick lap",onClick:startQuick,primary:true},...(["cook","prep","kitchen","plan"] as Surface[]).map(s=>({label:surfaceName[s],onClick:()=>startTopic(s)}))]};
  if(stage==="topic"){
   if(!topic||surface!==topic)return null;
   return{anchor:surfaceAnchor[topic],line:surfaceLine[topic],expression:"talk",actions:[{label:"Got it",onClick:()=>stop("closed"),primary:true}]};
  }
  if(stage==="finish")return{anchor:orb,highlight:orb,line:"And this little green thing is me. Tap it whenever you’re not sure — ask me stuff, scan something, talk to me, or get me to show you around again.",expression:"pleased",actions:[{label:"Got it",onClick:()=>stop("completed"),primary:true}]};
  if(stage!=="tour"||!surface)return null;
  const effective=new Set(seen);effective.add(surface);const remaining=CORE.filter(x=>!effective.has(x));
  if(!remaining.length&&surface!=="home")return{anchor:surfaceAnchor[surface],highlight:navFor.home,line:`${surfaceLine[surface]} Tap Home and I’ll wrap up.`,expression:"look"};
  const next=remaining[0];if(!next)return null;
  const prompt=next==="cook"?"All the recipes are in Cook. Have a look.":next==="prep"?"Prep’s the slightly nerdier bit. Tap that.":next==="kitchen"?"Kitchen’s different — that’s what we physically have. Have a look.":next==="plan"?"Come, have a look at our week.":"Tap Home and I’ll wrap up.";
  return{anchor:surfaceAnchor[surface],highlight:navFor[next],line:`${surfaceLine[surface]} ${prompt}`,expression:"look"};
 },[stage,surface,seen,topic,path]);

 useEffect(()=>{
  if(stage!=="tour"||!step?.highlight)return;
  const click=(event:MouseEvent)=>{const el=(event.target as Element|null)?.closest?.("[data-home-guide]") as HTMLElement|null;if(!el)return;const expected=document.querySelector(step.highlight);if(expected&&el===expected)emit("home_guide_target_clicked",{person,mode,target:el.dataset.homeGuide});else if(el.dataset.homeGuide?.startsWith("nav-"))emit("home_guide_detour",{person,mode,expected:(expected as HTMLElement|null)?.dataset.homeGuide,actual:el.dataset.homeGuide})};
  document.addEventListener("click",click,true);return()=>document.removeEventListener("click",click,true)
 },[stage,step,person,mode]);

 return <>{children}{stage!=="idle"&&!blocked&&step&&<GuideOverlay step={step} onClose={()=>stop(mode==="first"?"dismissed":"closed")}/>}</>;
}

function GuideOverlay({step,onClose}:{step:Step;onClose:()=>void}){
 const cardRef=useRef<HTMLDivElement>(null),[pos,setPos]=useState({left:16,top:90}),[highlight,setHighlight]=useState<Rect|null>(null),[reduceMotion,setReduceMotion]=useState(false);
 useEffect(()=>{const mq=window.matchMedia("(prefers-reduced-motion: reduce)"),sync=()=>setReduceMotion(mq.matches);sync();mq.addEventListener?.("change",sync);return()=>mq.removeEventListener?.("change",sync)},[]);
 useEffect(()=>{
  let raf=0;const place=()=>{window.cancelAnimationFrame(raf);raf=window.requestAnimationFrame(()=>{
   const vv=window.visualViewport,view={left:vv?.offsetLeft??0,top:vv?.offsetTop??0,width:vv?.width??window.innerWidth,height:vv?.height??window.innerHeight};
   const anchorEl=document.querySelector<HTMLElement>(step.anchor),targetEl=document.querySelector<HTMLElement>(step.highlight??step.anchor);if(!anchorEl)return;
   const a=toRect(anchorEl.getBoundingClientRect()),target=targetEl?toRect(targetEl.getBoundingClientRect()):a;setHighlight(step.highlight?target:null);
   const width=Math.min(cardRef.current?.offsetWidth??316,view.width-24),height=cardRef.current?.offsetHeight??176,gap=14;
   const candidates=[
    {left:a.left+a.width+gap,top:a.top+a.height/2-height/2},
    {left:a.left-width-gap,top:a.top+a.height/2-height/2},
    {left:a.left+a.width/2-width/2,top:a.top-height-gap},
    {left:a.left+a.width/2-width/2,top:a.top+a.height+gap},
    {left:view.left+12,top:view.top+24},
    {left:view.left+view.width-width-12,top:view.top+24}
   ];
   const exclusions=[...document.querySelectorAll<HTMLElement>(".hm-bar-pill,.hm-bar-nav,.hm-cta,[data-home-guide-exclusion],input:focus,textarea:focus")].map(x=>toRect(x.getBoundingClientRect()));
   const clamp=(c:{left:number;top:number})=>({left:Math.max(view.left+12,Math.min(c.left,view.left+view.width-width-12)),top:Math.max(view.top+12,Math.min(c.top,view.top+view.height-height-12))});
   const scored=candidates.map((raw,i)=>{const c=clamp(raw),r={...c,width,height};let penalty=area(r,target)*1000;for(const ex of exclusions)penalty+=area(r,ex)*100;penalty+=i*3;return{...c,penalty}}).sort((x,y)=>x.penalty-y.penalty)[0];
   setPos({left:scored.left,top:scored.top});
  })};
  place();window.addEventListener("resize",place);window.addEventListener("scroll",place,true);window.visualViewport?.addEventListener("resize",place);window.visualViewport?.addEventListener("scroll",place);const ro=new ResizeObserver(place),anchor=document.querySelector(step.anchor);if(anchor)ro.observe(anchor);return()=>{window.cancelAnimationFrame(raf);window.removeEventListener("resize",place);window.removeEventListener("scroll",place,true);window.visualViewport?.removeEventListener("resize",place);window.visualViewport?.removeEventListener("scroll",place);ro.disconnect()}
 },[step.anchor,step.highlight]);
 return <div className={`hm-guide-layer ${reduceMotion?"reduce":""}`} data-home-guide-overlay>
  {highlight&&<div className="hm-guide-highlight" style={{left:highlight.left-6,top:highlight.top-6,width:highlight.width+12,height:highlight.height+12}}/>}
  <div ref={cardRef} className="hm-guide-card" style={{left:pos.left,top:pos.top} as CSSProperties}>
   <button className="hm-guide-close" onClick={onClose} aria-label="Stop guide">×</button>
   <GuideHead expression={step.expression}/>
   <div className="hm-guide-bubble"><div className="hm-guide-copy" aria-live="polite">{step.line}</div>{step.actions&&<div className="hm-guide-actions">{step.actions.map(a=><button key={a.label} className={a.primary?"primary":""} onClick={a.onClick}>{a.label}</button>)}</div>}</div>
  </div>
 </div>
}

function GuideHead({expression}:{expression:Step["expression"]}){
 return <div className={`hm-guide-head ${expression}`} aria-hidden="true"><div className="hm-guide-face"><i className="hair"/><i className="brow l"/><i className="brow r"/><i className="eye l"/><i className="eye r"/><i className="freckles"/><i className="mouth"/></div></div>
}
