"use client";

import {usePathname,useRouter} from "next/navigation";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "./HouseholdState";
import {getHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import {feedback} from "@/lib/feedback";

type Surface="home"|"cook"|"prep"|"kitchen"|"plan";
type Topic=Surface|"ask"|"camera"|"cooking"|"history";
type Stage="idle"|"welcome"|"menu"|"topics"|"tour"|"topic"|"finish";
type GuideMode="first"|"full"|"quick"|"topic";
type Expression="hello"|"talk"|"look"|"pleased"|"affectionate"|"surprised"|"wink"|"thinking"|"laughing"|"sheepish";
type Rect={left:number;top:number;width:number;height:number};
type Step={anchor:string;highlight?:string;line:string;expression:Expression;progress?:{current:number;total:number};actions?:{label:string;onClick:()=>void;primary?:boolean}[]};

const CORE:Surface[]=["home","cook","prep","kitchen","plan"];
const GUIDE_KEY="home-meals-guide-v1";
const routeFor:Record<Surface,string>={home:"/",cook:"/cook",prep:"/prep",kitchen:"/kitchen",plan:"/plan"};
const navFor:Record<Surface,string>={home:'[data-home-guide="nav-home"]',cook:'[data-home-guide="nav-cook"]',prep:'[data-home-guide="nav-prep"]',kitchen:'[data-home-guide="nav-kitchen"]',plan:'[data-home-guide="nav-plan"]'};
const surfaceAnchor:Record<Surface,string>={home:".hm-tonight",cook:".hm-cook-head",prep:".hm-prep-v10-head",kitchen:".hm-kitchen-head",plan:".hm-plan-head"};
const surfaceName:Record<Surface,string>={home:"Home",cook:"Cook",prep:"Prep",kitchen:"Kitchen",plan:"Plan"};
const FULL_LINE:Record<Surface,string>={
 home:"This is home base. Tonight and the week start here.",
 cook:"All our recipes live here. ‘Ready now’ only means Kitchen says we can actually make it.",
 prep:"Prep is our shortcut stash — bases, pastes, sauces and boosters we make ahead so dinner’s easier.",
 kitchen:"Kitchen is what we actually have. If it isn’t recorded here, Home won’t pretend it is.",
 plan:"This is our week. Suggestions aren’t locked until we confirm them, and either of us can change anything we don’t fancy."
};
const QUICK_LINE:Record<Surface,string>={
 home:"Home is tonight and the week at a glance.",
 cook:"Cook is all our recipes.",
 prep:"Prep is the make-ahead stuff that makes dinner quicker.",
 kitchen:"Kitchen is what we physically have.",
 plan:"Plan is our shared week."
};
const topicLabels:Record<Topic,string>={home:"Home",cook:"Cook",prep:"Prep",kitchen:"Kitchen",plan:"Plan",ask:"Ask & voice",camera:"Camera",cooking:"Cooking",history:"History"};

function surfaceFromPath(path:string):Surface|null{
 if(path==="/")return"home";
 if(path==="/cook")return"cook";
 if(path==="/prep")return"prep";
 if(path==="/kitchen")return"kitchen";
 if(path==="/plan")return"plan";
 return null;
}
function topicFromPath(path:string):Topic|null{
 const surface=surfaceFromPath(path);if(surface)return surface;
 if(path==="/history")return"history";
 if(path==="/scan")return"camera";
 if(/^\/cook\/[^/]+(?:\/cook)?$/.test(path))return"cooking";
 if(path.startsWith("/prep/"))return"prep";
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
function lineFor(surface:Surface,mode:GuideMode){return mode==="quick"?QUICK_LINE[surface]:FULL_LINE[surface]}
function promptFor(surface:Surface){return surface==="cook"?"Tap Cook.":surface==="prep"?"Now Prep.":surface==="kitchen"?"Next, Kitchen.":surface==="plan"?"Have a look at Plan.":"Tap Home and I’ll wrap up."}
function topicStep(topic:Topic,path:string):Omit<Step,"actions">|null{
 const orb='[data-home-guide="orb"]',camera='[data-home-guide="camera"]',voice='[data-home-guide="voice"]';
 if(topic==="home")return path==="/"?{anchor:surfaceAnchor.home,highlight:surfaceAnchor.home,line:"Home is the quick read: tonight, what’s coming up, and anything Home thinks needs attention.",expression:"talk"}:null;
 if(topic==="cook")return path==="/cook"?{anchor:surfaceAnchor.cook,line:"Cook is the whole recipe library. Filters like Ready now, favourites and not lately are just different ways into the same recipes.",expression:"talk"}:null;
 if(topic==="prep")return path.startsWith("/prep")?{anchor:path==="/prep"?surfaceAnchor.prep:".hm-title-row",line:"Prep is the make-ahead system. Bases start dishes, mids and sauces shape them, boosters finish them. Prep Day only makes what the confirmed week actually needs.",expression:"thinking"}:null;
 if(topic==="kitchen")return path==="/kitchen"?{anchor:surfaceAnchor.kitchen,line:"Kitchen is household truth: fridge, freezer and pantry. Home only uses what we’ve actually recorded.",expression:"talk"}:null;
 if(topic==="plan")return path==="/plan"?{anchor:surfaceAnchor.plan,line:"Plan is our shared week. We can move dinners around, change our minds and confirm the week when it actually looks right.",expression:"talk"}:null;
 if(topic==="ask")return document.querySelector(orb)?{anchor:orb,highlight:orb,line:"Tap the green orb and ask me normally. The mic beside it is the same thing spoken instead of typed.",expression:"affectionate"}:null;
 if(topic==="camera"){
  if(path==="/scan")return{anchor:".hm-scan .stage",line:"Camera is reference, not magic. Show me the fridge, freezer, pantry, receipt, prep or dinner — I suggest what I see, and nothing changes until you confirm it.",expression:"look"};
  return document.querySelector(camera)?{anchor:camera,highlight:camera,line:"That camera is for showing me instead of typing. I’ll suggest what I see and you confirm before Kitchen changes.",expression:"look"}:null;
 }
 if(topic==="cooking"){
  if(/^\/cook\/[^/]+\/cook$/.test(path))return{anchor:".hm-cooking .body",line:"This is live cooking mode: one step at a time, timers when they matter, swipe or Next to move on, and Done logs dinner at the end.",expression:"talk"};
  if(/^\/cook\/[^/]+$/.test(path))return{anchor:".hm-recipe-title",highlight:".hm-cta .primary",line:"This is the recipe page. Check what goes in, the steps and what Kitchen says — then Start cooking when you’re ready.",expression:"talk"};
  return path==="/cook"?{anchor:surfaceAnchor.cook,line:"Pick any recipe. Open it, then Start cooking gives you the step-by-step cooking mode, timers, finish logging, ratings and notes.",expression:"talk"}:null;
 }
 if(topic==="history")return path==="/history"?{anchor:".hm-title-row",line:"History is what keeps Home from getting repetitive. It remembers what we cooked, when, favourites and Josh/G ratings separately.",expression:"pleased"}:null;
 return null;
}

export function HomeGuideProvider({children}:{children:React.ReactNode}){
 const path=usePathname(),router=useRouter(),h=useHousehold();
 const[person,setPerson]=useState<HouseholdPerson|null>(null),[stage,setStage]=useState<Stage>("idle"),[mode,setMode]=useState<GuideMode>("topic"),[seen,setSeen]=useState<Set<Surface>>(new Set()),[topic,setTopic]=useState<Topic|null>(null),[blocked,setBlocked]=useState(false);
 const surface=surfaceFromPath(path),currentTopic=topicFromPath(path),lastSurface=useRef<Surface|null>(null);
 const stop=(reason:"dismissed"|"completed"|"closed")=>{if(mode==="first"&&person){if(reason==="completed")writeFirstRun(person,"completed");else writeFirstRun(person,"dismissed")}emit(`home_guide_${reason}`,{person,mode});setStage("idle");setSeen(new Set());setTopic(null)};

 useEffect(()=>{const sync=()=>setPerson(getHouseholdPerson());sync();window.addEventListener("home-meals:person",sync);return()=>window.removeEventListener("home-meals:person",sync)},[]);
 useEffect(()=>{
  const summon=(event:Event)=>{const detail=(event as CustomEvent<{topic?:Topic}>).detail;setMode("topic");setSeen(new Set());setTopic(detail?.topic??null);setStage(detail?.topic?"topic":"menu");if(detail?.topic){const t=detail.topic;if(t==="history")router.push("/history");else if(t==="cooking")router.push("/cook");else if(t==="ask"||t==="camera"){}else router.push(routeFor[t as Surface])}emit("home_guide_summoned",{person,topic:detail?.topic??null})};
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

 const startFirst=()=>{feedback("tap");setMode("first");setSeen(new Set());setTopic(null);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_first_run_accepted",{person})};
 const startFull=()=>{feedback("tap");setMode("full");setSeen(new Set());setTopic(null);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_full_replay",{person})};
 const startQuick=()=>{feedback("tap");setMode("quick");setSeen(new Set());setTopic(null);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_quick_refresher",{person})};
 const openTopics=()=>{feedback("tap");setMode("topic");setTopic(null);setStage("topics");emit("home_guide_topic_menu",{person})};
 const startTopic=(t:Topic,stay=false)=>{feedback("tap");setMode("topic");setTopic(t);setStage("topic");if(!stay){if(t==="history")router.push("/history");else if(t==="cooking")router.push("/cook");else if(t==="ask"||t==="camera"){}else router.push(routeFor[t as Surface])}emit("home_guide_specific_help_selected",{person,topic:t})};

 const step=useMemo<Step|null>(()=>{
  const orb='[data-home-guide="orb"]';
  if(stage==="welcome")return{anchor:orb,highlight:orb,line:"Hey sunshine ☀️. Come, I’ll show you around. Takes a minute.",expression:"hello",actions:[{label:"Show me",onClick:startFirst,primary:true},{label:"Not now",onClick:()=>stop("dismissed")}]};
  if(stage==="menu")return{anchor:orb,highlight:orb,line:"Yep. Quick lap, the whole thing again, or just one bit?",expression:"affectionate",actions:[{label:"Quick refresher",onClick:startQuick,primary:true},{label:"Whole thing",onClick:startFull},{label:"One bit",onClick:openTopics},...(currentTopic?[{label:"This screen",onClick:()=>startTopic(currentTopic,true)}]:[])]};
  if(stage==="topics")return{anchor:orb,highlight:orb,line:"What do you want me to show you?",expression:"thinking",actions:[...(["home","cook","prep","kitchen","plan","ask","camera","cooking","history"] as Topic[]).map(t=>({label:topicLabels[t],onClick:()=>startTopic(t),primary:t==="ask"})),{label:"Back",onClick:()=>setStage("menu")}]};
  if(stage==="topic"){
   if(!topic)return null;const base=topicStep(topic,path);if(!base)return null;
   return{...base,actions:[{label:"Got it",onClick:()=>stop("closed"),primary:true},{label:"More help",onClick:()=>setStage("menu")}]};
  }
  if(stage==="finish"){
   const replay=mode!=="first";const line=mode==="first"?"And this little green thing is me. Tap it whenever you’re not sure — ask me, talk to me, show me something, or get me to walk you through any bit again.":mode==="quick"?"Yep, that’s the app. Tap me anytime if you only want a refresher on one bit.":"That’s the whole thing again. Tap me anytime for a quick refresher or one bit.";
   return{anchor:orb,highlight:orb,line,expression:mode==="first"?"wink":"pleased",actions:[{label:mode==="first"?"Got it":"Done",onClick:()=>stop(mode==="first"?"completed":"closed"),primary:true},...(replay?[{label:"One bit",onClick:openTopics}]:[])]};
  }
  if(stage!=="tour"||!surface)return null;
  const effective=new Set(seen);effective.add(surface);const remaining=CORE.filter(x=>!effective.has(x));const progress={current:Math.min(effective.size,CORE.length),total:CORE.length};
  if(!remaining.length&&surface!=="home")return{anchor:surfaceAnchor[surface],highlight:navFor.home,line:`${lineFor(surface,mode)} Tap Home and I’ll wrap up.`,expression:"look",progress};
  const next=remaining[0];if(!next)return null;
  return{anchor:surfaceAnchor[surface],highlight:navFor[next],line:`${lineFor(surface,mode)} ${promptFor(next)}`,expression:mode==="quick"?"pleased":"look",progress};
 },[stage,surface,seen,topic,path,mode,currentTopic]);

 useEffect(()=>{
  const highlightSelector=step?.highlight;
  if(stage!=="tour"||!highlightSelector)return;
  const click=(event:MouseEvent)=>{const el=(event.target as Element|null)?.closest?.("[data-home-guide]") as HTMLElement|null;if(!el)return;const expected=document.querySelector<HTMLElement>(highlightSelector);if(expected&&el===expected)emit("home_guide_target_clicked",{person,mode,target:el.dataset.homeGuide});else if(el.dataset.homeGuide?.startsWith("nav-"))emit("home_guide_detour",{person,mode,expected:expected?.dataset.homeGuide,actual:el.dataset.homeGuide})};
  document.addEventListener("click",click,true);return()=>document.removeEventListener("click",click,true)
 },[stage,step,person,mode]);

 return <>{children}{stage!=="idle"&&!blocked&&step&&<GuideOverlay step={step} onClose={()=>stop(mode==="first"?"dismissed":"closed")}/>}</>;
}

function GuideOverlay({step,onClose}:{step:Step;onClose:()=>void}){
 const cardRef=useRef<HTMLDivElement>(null),[pos,setPos]=useState({left:16,top:90}),[highlight,setHighlight]=useState<Rect|null>(null),[reduceMotion,setReduceMotion]=useState(false);
 useEffect(()=>{const mq=window.matchMedia("(prefers-reduced-motion: reduce)"),sync=()=>setReduceMotion(mq.matches);sync();mq.addEventListener?.("change",sync);return()=>mq.removeEventListener?.("change",sync)},[]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[onClose]);
 useEffect(()=>{
  let raf=0;const place=()=>{window.cancelAnimationFrame(raf);raf=window.requestAnimationFrame(()=>{
   const vv=window.visualViewport,view={left:vv?.offsetLeft??0,top:vv?.offsetTop??0,width:vv?.width??window.innerWidth,height:vv?.height??window.innerHeight};
   const anchorEl=document.querySelector<HTMLElement>(step.anchor),targetEl=document.querySelector<HTMLElement>(step.highlight??step.anchor);if(!anchorEl){setHighlight(null);return}
   const a=toRect(anchorEl.getBoundingClientRect()),target=targetEl?toRect(targetEl.getBoundingClientRect()):a;setHighlight(step.highlight?target:null);
   const width=Math.min(cardRef.current?.offsetWidth??328,view.width-24),height=cardRef.current?.offsetHeight??176,gap=14;
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
  place();window.addEventListener("resize",place);window.addEventListener("scroll",place,true);window.visualViewport?.addEventListener("resize",place);window.visualViewport?.addEventListener("scroll",place);const ro=new ResizeObserver(place),mo=new MutationObserver(place),anchor=document.querySelector(step.anchor);if(anchor)ro.observe(anchor);mo.observe(document.body,{childList:true,subtree:true});return()=>{window.cancelAnimationFrame(raf);window.removeEventListener("resize",place);window.removeEventListener("scroll",place,true);window.visualViewport?.removeEventListener("resize",place);window.visualViewport?.removeEventListener("scroll",place);ro.disconnect();mo.disconnect()}
 },[step.anchor,step.highlight]);
 return <div className={`hm-guide-layer ${reduceMotion?"reduce":""}`} data-home-guide-overlay>
  {highlight&&<div className="hm-guide-highlight" style={{left:highlight.left-6,top:highlight.top-6,width:highlight.width+12,height:highlight.height+12}}/>}
  <div ref={cardRef} className="hm-guide-card" style={{left:pos.left,top:pos.top} as CSSProperties}>
   <button className="hm-guide-close" onClick={onClose} aria-label="Stop guide">×</button>
   <GuideHead expression={step.expression}/>
   <div className="hm-guide-bubble"><div className="hm-guide-copy" role="status" aria-live="polite">{step.line}</div>{step.progress&&<div className="hm-guide-progress" aria-label={`Guide progress ${step.progress.current} of ${step.progress.total}`}><span>{step.progress.current}/{step.progress.total}</span><i>{Array.from({length:step.progress.total},(_,i)=><b key={i} className={i<step.progress!.current?"on":""}/>)}</i></div>}{step.actions&&<div className="hm-guide-actions">{step.actions.map(a=><button key={a.label} className={a.primary?"primary":""} onClick={a.onClick}>{a.label}</button>)}</div>}</div>
  </div>
 </div>
}

function GuideHead({expression}:{expression:Expression}){
 return <div className={`hm-guide-head ${expression}`} aria-hidden="true"><span className="hm-guide-sprite"/></div>
}
