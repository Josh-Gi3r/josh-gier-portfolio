"use client";

import {usePathname,useRouter} from "next/navigation";
import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import {useHousehold} from "./HouseholdState";
import {JoshPresenceAnchor,type JoshExpression} from "./JoshPresence";
import {getHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import {feedback} from "@/lib/feedback";

type Surface="home"|"cook"|"prep"|"kitchen"|"plan";
type Topic=Surface|"prepday"|"ask"|"camera"|"cooking"|"history";
type Stage="idle"|"welcome"|"menu"|"topics"|"tour"|"topic"|"finish";
type GuideMode="first"|"full"|"quick"|"topic";
type Rect={left:number;top:number;width:number;height:number};
type Step={anchor:string;highlight?:string;line:string;expression:JoshExpression;cue?:{verb:string;label:string};progress?:{current:number;total:number};actions?:{label:string;onClick:()=>void;primary?:boolean}[]};

const CORE:Surface[]=["home","cook","prep","kitchen","plan"];
const GUIDE_KEY="home-meals-guide-v1";
const routeFor:Record<Surface,string>={home:"/",cook:"/cook",prep:"/prep",kitchen:"/kitchen",plan:"/plan"};
const navFor:Record<Surface,string>={home:'[data-home-guide="nav-home"]',cook:'[data-home-guide="nav-cook"]',prep:'[data-home-guide="nav-prep"]',kitchen:'[data-home-guide="nav-kitchen"]',plan:'[data-home-guide="nav-plan"]'};
const surfaceAnchor:Record<Surface,string>={home:".hm-tonight",cook:".hm-cook-head",prep:".hm-prep-v10-head",kitchen:".hm-kitchen-head",plan:".hm-plan-head"};
const surfaceName:Record<Surface,string>={home:"Home",cook:"Cook",prep:"Prep",kitchen:"Kitchen",plan:"Plan"};
const FULL_LINE:Record<Surface,string>={
 home:"This is the bit I’d check first. Dinner ideas, the week, and anything we should use up show up here.",
 cook:"Hungry? Start here. This is everything we actually cook — old favourites, quick wins and things we haven’t tried yet.",
 prep:"This is our shortcut drawer. Bases, sauces and little flavour bombs we make once so dinner is easier later.",
 kitchen:"This is what we actually have. It doesn’t need to be perfect — just close enough that I can be useful.",
 plan:"This is the week. I can put one together for us, but nothing is decided until we keep it."
};
const QUICK_LINE:Record<Surface,string>={
 home:"Home is the quick glance: dinner, the week, and anything urgent.",
 cook:"Cook is where we pick dinner.",
 prep:"Prep is our make-ahead shortcut drawer.",
 kitchen:"Kitchen is what we actually have.",
 plan:"Plan is the week before we commit to it."
};
const topicLabels:Record<Topic,string>={home:"Home",cook:"Cook",prep:"Prep & freezer",kitchen:"Kitchen setup",plan:"Build our week",prepday:"Prep Day",ask:"Ask & voice",camera:"Camera",cooking:"Cooking",history:"History"};

function surfaceFromPath(path:string):Surface|null{if(path==="/")return"home";if(path==="/cook")return"cook";if(path==="/prep")return"prep";if(path==="/kitchen")return"kitchen";if(path==="/plan")return"plan";return null}
function topicFromPath(path:string):Topic|null{if(path==="/prep/day")return"prepday";const surface=surfaceFromPath(path);if(surface)return surface;if(path==="/history")return"history";if(path==="/scan")return"camera";if(/^\/cook\/[^/]+(?:\/cook)?$/.test(path))return"cooking";if(path.startsWith("/prep/"))return"prep";return null}
function readFirstRun(person:HouseholdPerson){if(typeof window==="undefined")return"unseen" as const;try{const raw=localStorage.getItem(`${GUIDE_KEY}:${person}`);if(!raw)return"unseen" as const;const x=JSON.parse(raw) as {status?:string};return x.status==="completed"||x.status==="dismissed"?x.status:"unseen"}catch{return"unseen" as const}}
function writeFirstRun(person:HouseholdPerson,status:"completed"|"dismissed"){try{localStorage.setItem(`${GUIDE_KEY}:${person}`,JSON.stringify({status,at:new Date().toISOString()}))}catch{}}
function emit(name:string,detail:Record<string,unknown>={}){try{window.dispatchEvent(new CustomEvent("home-meals:guide-analytics",{detail:{name,at:new Date().toISOString(),...detail}}))}catch{}}
function area(a:Rect,b:Rect){const x=Math.max(0,Math.min(a.left+a.width,b.left+b.width)-Math.max(a.left,b.left)),y=Math.max(0,Math.min(a.top+a.height,b.top+b.height)-Math.max(a.top,b.top));return x*y}
function toRect(r:DOMRect):Rect{return{left:r.left,top:r.top,width:r.width,height:r.height}}
function lineFor(surface:Surface,mode:GuideMode){return mode==="quick"?QUICK_LINE[surface]:FULL_LINE[surface]}
function cueFor(surface:Surface){return{verb:"Tap",label:surfaceName[surface]}}

export function HomeGuideProvider({children}:{children:React.ReactNode}){
 const path=usePathname(),router=useRouter(),h=useHousehold();
 const[person,setPerson]=useState<HouseholdPerson|null>(null),[stage,setStage]=useState<Stage>("idle"),[mode,setMode]=useState<GuideMode>("topic"),[seen,setSeen]=useState<Set<Surface>>(new Set()),[topic,setTopic]=useState<Topic|null>(null),[topicLesson,setTopicLesson]=useState(0),[kitchenLesson,setKitchenLesson]=useState(0),[blocked,setBlocked]=useState(false);
 const surface=surfaceFromPath(path),currentTopic=topicFromPath(path),lastSurface=useRef<Surface|null>(null);
 const stop=(reason:"dismissed"|"completed"|"closed")=>{if(mode==="first"&&person){if(reason==="completed")writeFirstRun(person,"completed");else writeFirstRun(person,"dismissed");window.dispatchEvent(new Event("home-meals:guide-state"))}emit(`home_guide_${reason}`,{person,mode});setStage("idle");setSeen(new Set());setTopic(null);setTopicLesson(0);setKitchenLesson(0)};

 useEffect(()=>{const sync=()=>setPerson(getHouseholdPerson());sync();window.addEventListener("home-meals:person",sync);return()=>window.removeEventListener("home-meals:person",sync)},[]);
 useEffect(()=>{
  const summon=(event:Event)=>{const detail=(event as CustomEvent<{topic?:Topic;mode?:"full"|"quick"|"menu"}>).detail;setSeen(new Set());setTopicLesson(0);setKitchenLesson(0);if(detail?.mode==="full"){setMode("full");setTopic(null);setStage("tour");if(path!=="/")router.push("/")}else if(detail?.mode==="quick"){setMode("quick");setTopic(null);setStage("tour");if(path!=="/")router.push("/")}else{setMode("topic");setTopic(detail?.topic??null);setStage(detail?.topic?"topic":"menu");if(detail?.topic){const t=detail.topic;if(t==="history")router.push("/history");else if(t==="prepday")router.push("/prep/day");else if(t==="cooking")router.push("/cook");else if(t==="camera")router.push("/scan?mode=Fridge&back=/learn");else if(t==="ask"){if(path==="/scan"||/^\/cook\/[^/]+\/cook$/.test(path))router.push("/")}else router.push(routeFor[t as Surface])}}emit("home_guide_summoned",{person,topic:detail?.topic??null,requestedMode:detail?.mode??null})};
  window.addEventListener("home-meals:guide",summon as EventListener);return()=>window.removeEventListener("home-meals:guide",summon as EventListener)
 },[person,router,path]);
 useEffect(()=>{if(!person||stage!=="idle"||!surface||readFirstRun(person)!=="unseen")return;const timer=window.setTimeout(()=>{if(document.querySelector('[role="dialog"][aria-modal="true"]'))return;setMode("first");setSeen(new Set());setStage("welcome");emit("home_guide_started",{person,mode:"first"})},900);return()=>window.clearTimeout(timer)},[person,stage,surface]);
 useEffect(()=>{if(stage!=="tour"||!surface)return;setSeen(prev=>{if(prev.has(surface))return prev;const next=new Set(prev);next.add(surface);return next});if(lastSurface.current!==surface){emit("home_guide_step_seen",{person,mode,surface});lastSurface.current=surface}},[stage,surface,person,mode]);
 useEffect(()=>{if(stage!=="tour"||surface!=="home")return;const effective=new Set(seen);effective.add("home");if(CORE.every(x=>effective.has(x)))setStage("finish")},[stage,surface,seen]);
 useEffect(()=>{if(stage==="idle")return;const check=()=>setBlocked(!!document.querySelector('[role="dialog"][aria-modal="true"],.hm-sheet-backdrop'));check();const observer=new MutationObserver(check);observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect()},[stage]);

 const startFirst=()=>{feedback("tap");setMode("first");setSeen(new Set());setTopic(null);setTopicLesson(0);setKitchenLesson(0);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_first_run_accepted",{person})};
 const startFull=()=>{feedback("tap");setMode("full");setSeen(new Set());setTopic(null);setTopicLesson(0);setKitchenLesson(0);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_full_replay",{person})};
 const startQuick=()=>{feedback("tap");setMode("quick");setSeen(new Set());setTopic(null);setTopicLesson(0);setKitchenLesson(0);setStage("tour");if(path!=="/")router.push("/");emit("home_guide_quick_refresher",{person})};
 const openTopics=()=>{feedback("tap");setMode("topic");setTopic(null);setTopicLesson(0);setStage("topics");emit("home_guide_topic_menu",{person})};
 const startTopic=(t:Topic,stay=false)=>{feedback("tap");setMode("topic");setTopic(t);setTopicLesson(0);setStage("topic");if(!stay){if(t==="history")router.push("/history");else if(t==="prepday")router.push("/prep/day");else if(t==="cooking")router.push("/cook");else if(t==="camera")router.push("/scan?mode=Fridge&back=/learn");else if(t==="ask"){if(path==="/scan"||/^\/cook\/[^/]+\/cook$/.test(path))router.push("/")}else router.push(routeFor[t as Surface])}emit("home_guide_specific_help_selected",{person,topic:t})};
 const topicDone=[{label:"Got it",onClick:()=>stop("closed"),primary:true},{label:"More guides",onClick:()=>setStage("topics")}];

 const step=useMemo<Step|null>(()=>{
  const orb='[data-home-guide="orb"]';
  if(stage==="welcome")return{anchor:orb,highlight:orb,line:person==="g"?"Hey sunshine! ☀️ I made this little thing for us. Want me to show you where everything lives?":"Quick tour? I’ll show you around. Only the bits that matter.",expression:"affectionate",actions:[{label:"Show me",onClick:startFirst,primary:true},{label:"Not now",onClick:()=>stop("dismissed")}]};
  if(stage==="menu")return{anchor:orb,highlight:orb,line:"Need me again? I can do the quick lap, start from the beginning, or show you one thing.",expression:"affectionate",actions:[{label:"Quick refresher",onClick:startQuick,primary:true},{label:"Whole thing",onClick:startFull},{label:"One bit",onClick:openTopics},...(currentTopic?[{label:"This screen",onClick:()=>startTopic(currentTopic,true)}]:[])]};
  if(stage==="topics")return{anchor:orb,highlight:orb,line:"What are you trying to do?",expression:"thinking",actions:[...(["home","cook","prep","kitchen","plan","prepday","ask","camera","cooking","history"] as Topic[]).map(t=>({label:topicLabels[t],onClick:()=>startTopic(t),primary:t==="plan"})),{label:"Back",onClick:()=>setStage("menu")}]};
  if(stage==="topic"){
   if(!topic)return null;
   if(topic==="kitchen"&&path==="/kitchen"){
    if(topicLesson===0)return{anchor:surfaceAnchor.kitchen,highlight:'[data-home-guide="kitchen-tabs"]',line:"Three places, that’s it: fridge, freezer and pantry. Start wherever you’re standing.",expression:"talk",actions:[{label:"Next",onClick:()=>setTopicLesson(1),primary:true}]};
    if(topicLesson===1)return{anchor:'[data-home-guide="kitchen-tabs"]',highlight:'[data-home-guide="kitchen-scan"]',line:"Don’t feel like typing? Show me a shelf or drawer and I’ll help you fill it in.",expression:"happy",actions:[{label:"Next",onClick:()=>setTopicLesson(2),primary:true}]};
    return{anchor:'[data-home-guide="kitchen-scan"]',highlight:'[data-home-guide="kitchen-checked"]',line:"When it’s roughly right, mark it checked. We can fix little things later.",expression:"wink",actions:topicDone};
   }
   if(topic==="plan"&&path==="/plan"){
    if(topicLesson===0)return{anchor:surfaceAnchor.plan,highlight:".hm-plan-basis",line:"First tell me what I’m allowed to work with: what’s here, our usual prep, both, or anything.",expression:"thinking",actions:[{label:"Next",onClick:()=>setTopicLesson(1),primary:true}]};
    return{anchor:".hm-plan-basis",highlight:".hm-build",line:"Then let me make a week. It’s only a suggestion until you keep it.",expression:"happy",actions:topicDone};
   }
   if(topic==="prep"&&path.startsWith("/prep")&&path!=="/prep/day"){
    if(path!=="/prep")return{anchor:".hm-title-row",line:"You’re inside one bit of Prep now. This is where the make-ahead stuff gets its own recipe, stock and cues.",expression:"talk",actions:topicDone};
    if(topicLesson===0)return{anchor:surfaceAnchor.prep,highlight:".hm-prep-v10-tabs",line:"Browse is the whole cupboard. Ours is what we like keeping around. This week is only what the week actually needs.",expression:"talk",actions:[{label:"Next",onClick:()=>setTopicLesson(1),primary:true}]};
    return{anchor:".hm-prep-v10-tabs",highlight:'a[href="/prep/day"]',line:"Prep Day turns the week into an actual make-ahead list, in the order it makes sense to cook it.",expression:"happy",actions:topicDone};
   }
   if(topic==="prepday"&&path==="/prep/day")return{anchor:".hm-title-row",line:"Prep Day is the bench list. It only pulls in what we need, puts parent prep first, and asks you to measure what you actually made before it goes into Kitchen.",expression:"talk",actions:topicDone};
   if(topic==="camera"&&path==="/scan"){
    if(topicLesson===0)return{anchor:'[data-home-guide="show-josh-modes"]',highlight:'[data-home-guide="show-josh-modes"]',line:"Pick what you’re showing me first — fridge, freezer, pantry, receipt, prep or dinner.",expression:"thinking",actions:[{label:"Next",onClick:()=>setTopicLesson(1),primary:true}]};
    return{anchor:'[data-home-guide="show-josh-capture"]',highlight:'[data-home-guide="show-josh-capture"]',line:"Then take a photo or choose one you already have. I’ll suggest what I see; you decide what gets saved.",expression:"happy",actions:topicDone};
   }
   if(topic==="ask")return document.querySelector(orb)?{anchor:orb,highlight:orb,line:"Tap my face when you’d rather ask than hunt through the app. Use the mic beside me if talking is easier.",expression:"affectionate",actions:topicDone}:null;
   if(topic==="cooking"){
    if(/^\/cook\/[^/]+\/cook$/.test(path))return{anchor:".hm-cooking .body",line:"One step at a time. Timers appear when they help, swipe or tap Next to move, and Done saves dinner at the end.",expression:"talk",actions:topicDone};
    if(/^\/cook\/[^/]+$/.test(path))return{anchor:".hm-recipe-title",highlight:".hm-cta .primary",line:"Check what goes in, skim the steps, then Start cooking when you’re ready for the one-step-at-a-time view.",expression:"talk",actions:topicDone};
    return path==="/cook"?{anchor:surfaceAnchor.cook,line:"Pick a dinner, open it, then Start cooking. That’s the focused view with steps, timers, ratings and notes at the end.",expression:"talk",actions:topicDone}:null;
   }
   if(topic==="history"&&path==="/history")return{anchor:".hm-title-row",line:"This is where dinner starts becoming ours — what we cooked, when, our separate ratings and the notes worth remembering.",expression:"happy",actions:topicDone};
   const base=topic==="home"&&path==="/"?{anchor:surfaceAnchor.home,line:"Home is the quick look: dinner, the week, and anything we should deal with now.",expression:"talk" as JoshExpression}:topic==="cook"&&path==="/cook"?{anchor:surfaceAnchor.cook,line:"Cook is everything we actually make. Ready now, favourites and Not lately are the fast ways in.",expression:"talk" as JoshExpression}:null;
   return base?{...base,actions:topicDone}:null;
  }
  if(stage==="finish"){
   const replay=mode!=="first";const firstLine=person==="g"?"That’s it, sunshine. If you forget anything, tap my face and I’ll show you again.":"That’s it. Tap my face anytime you want the quick version again.";const line=mode==="first"?firstLine:mode==="quick"?"That’s the quick lap. Grab me anytime if one bit slips your mind.":"That’s the whole thing again. Next time you can just pick the bit you need.";
   return{anchor:orb,highlight:orb,line,expression:mode==="first"?"wink":"happy",actions:[{label:mode==="first"?"Got it":"Done",onClick:()=>stop(mode==="first"?"completed":"closed"),primary:true},...(replay?[{label:"One bit",onClick:openTopics}]:[])]};
  }
  if(stage!=="tour"||!surface)return null;
  const effective=new Set(seen);effective.add(surface);const remaining=CORE.filter(x=>!effective.has(x));const progress={current:Math.min(effective.size,CORE.length),total:CORE.length};
  if(!h.kitchenReady&&surface==="home")return{anchor:orb,highlight:navFor.kitchen,line:mode==="quick"?"Home is the quick glance. Before the useful bits work, I need a rough idea of what’s in the kitchen.":"This is Home. Before I can be properly useful, give me a rough idea of what’s actually in the kitchen.",expression:"thinking",cue:cueFor("kitchen"),progress};
  if(!h.kitchenReady&&surface==="kitchen"){
   const next=remaining[0]??"home";
   if(mode==="quick")return{anchor:surfaceAnchor.kitchen,highlight:navFor[next],line:"Kitchen is the fridge, freezer and pantry. Roughly right is enough.",expression:"talk",cue:cueFor(next),progress};
   if(kitchenLesson===0)return{anchor:surfaceAnchor.kitchen,highlight:'[data-home-guide="kitchen-tabs"]',line:"Three places: fridge, freezer and pantry. That’s how I know what we actually have.",expression:"talk",progress,actions:[{label:"Next",onClick:()=>setKitchenLesson(1),primary:true}]};
   if(kitchenLesson===1)return{anchor:'[data-home-guide="kitchen-tabs"]',highlight:'[data-home-guide="kitchen-scan"]',line:"If typing everything sounds painful, show me. A quick photo is enough to get started.",expression:"happy",progress,actions:[{label:"Next",onClick:()=>setKitchenLesson(2),primary:true}]};
   if(kitchenLesson===2)return{anchor:'[data-home-guide="kitchen-scan"]',highlight:'[data-home-guide="kitchen-checked"]',line:"When it looks roughly right, mark it checked. We can fix details whenever they matter.",expression:"wink",progress,actions:[{label:"Keep touring",onClick:()=>setKitchenLesson(3),primary:true}]};
   return{anchor:surfaceAnchor.kitchen,highlight:navFor[next],line:"That’s enough to get going.",expression:"happy",cue:cueFor(next),progress};
  }
  if(!remaining.length&&surface!=="home")return{anchor:surfaceAnchor[surface],highlight:navFor.home,line:lineFor(surface,mode),expression:"happy",cue:cueFor("home"),progress};
  const next=remaining[0];if(!next)return null;
  return{anchor:surfaceAnchor[surface],highlight:navFor[next],line:lineFor(surface,mode),expression:mode==="quick"?"happy":"talk",cue:cueFor(next),progress};
 },[stage,surface,seen,topic,topicLesson,path,mode,currentTopic,h.kitchenReady,person,kitchenLesson]);

 useEffect(()=>{const highlightSelector=step?.highlight;if(stage!=="tour"||!highlightSelector)return;const click=(event:MouseEvent)=>{const el=(event.target as Element|null)?.closest?.("[data-home-guide]") as HTMLElement|null;if(!el)return;const expected=document.querySelector<HTMLElement>(highlightSelector);if(expected&&el===expected)emit("home_guide_target_clicked",{person,mode,target:el.dataset.homeGuide});else if(el.dataset.homeGuide?.startsWith("nav-"))emit("home_guide_detour",{person,mode,expected:expected?.dataset.homeGuide,actual:el.dataset.homeGuide})};document.addEventListener("click",click,true);return()=>document.removeEventListener("click",click,true)},[stage,step,person,mode]);

 return <>{children}{stage!=="idle"&&!blocked&&step&&<GuideOverlay step={step} intro={stage==="welcome"} onClose={()=>stop(mode==="first"?"dismissed":"closed")}/>}</>;
}

function GuideOverlay({step,intro,onClose}:{step:Step;intro:boolean;onClose:()=>void}){
 const cardRef=useRef<HTMLDivElement>(null),[pos,setPos]=useState({left:16,top:90}),[highlight,setHighlight]=useState<Rect|null>(null),[reduceMotion,setReduceMotion]=useState(false);
 useEffect(()=>{const mq=window.matchMedia("(prefers-reduced-motion: reduce)"),sync=()=>setReduceMotion(mq.matches);sync();mq.addEventListener?.("change",sync);return()=>mq.removeEventListener?.("change",sync)},[]);
 useEffect(()=>{const selector=step.highlight??step.anchor,target=document.querySelector<HTMLElement>(selector);if(!target)return;let raf1=0,raf2=0;raf1=window.requestAnimationFrame(()=>{raf2=window.requestAnimationFrame(()=>{const vv=window.visualViewport,viewTop=vv?.offsetTop??0,viewHeight=vv?.height??window.innerHeight,r=target.getBoundingClientRect(),fixedTarget=!!target.closest(".hm-bar-nav,.hm-bar-pill");const safeTop=viewTop+16,safeBottom=viewTop+viewHeight-(fixedTarget?16:176);if(r.top<safeTop||r.bottom>safeBottom)target.scrollIntoView({block:"center",inline:"nearest",behavior:reduceMotion?"auto":"smooth"})})});return()=>{window.cancelAnimationFrame(raf1);window.cancelAnimationFrame(raf2)}},[step.anchor,step.highlight,step.line,reduceMotion]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[onClose]);
 useEffect(()=>{let raf=0;const place=()=>{window.cancelAnimationFrame(raf);raf=window.requestAnimationFrame(()=>{const vv=window.visualViewport,view={left:vv?.offsetLeft??0,top:vv?.offsetTop??0,width:vv?.width??window.innerWidth,height:vv?.height??window.innerHeight};const anchorEl=document.querySelector<HTMLElement>(step.anchor),targetEl=document.querySelector<HTMLElement>(step.highlight??step.anchor);if(!anchorEl){setHighlight(null);return}const a=toRect(anchorEl.getBoundingClientRect()),target=targetEl?toRect(targetEl.getBoundingClientRect()):a;setHighlight(step.highlight?target:null);const width=Math.min(cardRef.current?.offsetWidth??328,view.width-24),height=cardRef.current?.offsetHeight??176,gap=14;const candidates=[{left:a.left+a.width+gap,top:a.top+a.height/2-height/2},{left:a.left-width-gap,top:a.top+a.height/2-height/2},{left:a.left+a.width/2-width/2,top:a.top-height-gap},{left:a.left+a.width/2-width/2,top:a.top+a.height+gap},{left:view.left+12,top:view.top+24},{left:view.left+view.width-width-12,top:view.top+24}];const exclusions=[...document.querySelectorAll<HTMLElement>(".hm-bar-pill,.hm-bar-nav,.hm-cta,[data-home-guide-exclusion],input:focus,textarea:focus")].map(x=>toRect(x.getBoundingClientRect()));const clamp=(c:{left:number;top:number})=>({left:Math.max(view.left+12,Math.min(c.left,view.left+view.width-width-12)),top:Math.max(view.top+12,Math.min(c.top,view.top+view.height-height-12))});const scored=candidates.map((raw,i)=>{const c=clamp(raw),r={...c,width,height};let penalty=area(r,target)*1000;for(const ex of exclusions)penalty+=area(r,ex)*100;penalty+=i*3;return{...c,penalty}}).sort((x,y)=>x.penalty-y.penalty)[0];setPos({left:scored.left,top:scored.top})})};place();window.addEventListener("resize",place);window.addEventListener("scroll",place,true);window.visualViewport?.addEventListener("resize",place);window.visualViewport?.addEventListener("scroll",place);const ro=new ResizeObserver(place),mo=new MutationObserver(place),anchor=document.querySelector(step.anchor);if(anchor)ro.observe(anchor);mo.observe(document.body,{childList:true,subtree:true});return()=>{window.cancelAnimationFrame(raf);window.removeEventListener("resize",place);window.removeEventListener("scroll",place,true);window.visualViewport?.removeEventListener("resize",place);window.visualViewport?.removeEventListener("scroll",place);ro.disconnect();mo.disconnect()}},[step.anchor,step.highlight]);
 return <div className={`hm-guide-layer ${intro?"intro":"active"} ${reduceMotion?"reduce":""}`} data-home-guide-overlay>
  {!intro&&!highlight&&<div className="hm-guide-scrim"/>}
  {highlight&&<div className="hm-guide-highlight" style={{left:highlight.left-6,top:highlight.top-6,width:highlight.width+12,height:highlight.height+12}}/>}
  <div ref={cardRef} className="hm-guide-card" style={{left:pos.left,top:pos.top} as CSSProperties}>
   <JoshPresenceAnchor priority={100} expression={step.expression} size={78} className="hm-guide-head" observeVisibility={false}/>
   <div className="hm-guide-bubble">{!intro&&<button className="hm-guide-close" onClick={onClose} aria-label="Stop guide">×</button>}<div className="hm-guide-copy" role="status" aria-live="polite">{step.line}</div>{step.cue&&<div className="hm-guide-cue"><span>{step.cue.verb}</span><b>{step.cue.label}</b></div>}{step.progress&&<div className="hm-guide-progress" aria-label={`Guide progress ${step.progress.current} of ${step.progress.total}`}><span>{step.progress.current}/{step.progress.total}</span><i>{Array.from({length:step.progress.total},(_,i)=><b key={i} className={i<step.progress!.current?"on":""}/>)}</i></div>}{step.actions&&<div className="hm-guide-actions">{step.actions.map(a=><button key={a.label} className={a.primary?"primary":""} onClick={a.onClick}>{a.label}</button>)}</div>}</div>
  </div>
 </div>
}
