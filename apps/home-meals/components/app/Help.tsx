"use client";
import Link from "next/link";
import type {CSSProperties} from "react";
import {motherBases} from "@/data/home-data";
import {canonicalPrepComponentsV2} from "@/data/food-truth-v2";
import {ingredientsForRecipeV7} from "@/data/ingredient-engine-v7";
import {coreMotherIdsV7} from "@/data/prep-repertoire-v7";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {useHousehold} from "../HouseholdState";
import {JoshPresenceAnchor} from "../JoshPresence";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {RoundBack,SectionHead,Tile} from "./Primitives";

const guides=[
 {slug:"portions",kicker:"PORTIONS",title:"Split prep without guessing",sub:"Measure what you made, then portion it",img:foundationImages.cubes},
 {slug:"freezer",kicker:"FREEZER",title:"Keep the freezer easy",sub:"Label it · oldest first",img:foundationImages.freezer},
 {slug:"prep-day",kicker:"PREP DAY",title:"One useful prep session",sub:"Only make what the week needs",img:foundationImages.prepDay},
 {slug:"system",kicker:"THE WEEK",title:"How the week becomes a list",sub:"Plan → what we have → what to buy",img:foundationImages.groceries}
];
const actions=[
 {href:"#household",label:"Household",glyph:"J·G",bg:"linear-gradient(135deg,#ffc2a8,#ff9f7a)"},
 {href:"/history",label:"Our history",glyph:"★",bg:"var(--grad-green-short)"},
 {href:"/prep/day",label:"Prep Day",glyph:"✓",bg:"linear-gradient(135deg,#9fc0ff,#4f8cff)"},
 {href:"/cook/builder",label:"From what we have",glyph:"✦",bg:"var(--ink)"}
];
const interactiveGuides=[
 {topic:"kitchen",title:"Kitchen setup",sub:"Fridge, freezer and pantry",glyph:"⌂"},
 {topic:"plan",title:"Build our week",sub:"Ideas → review → keep it",glyph:"7"},
 {topic:"prep",title:"Prep & freezer",sub:"What we keep around and why",glyph:"✦"},
 {topic:"prepday",title:"Prep Day",sub:"Turn the week into bench work",glyph:"✓"},
 {topic:"camera",title:"Show me",sub:"Camera, photos and confirmation",glyph:"◉"},
 {topic:"cooking",title:"Cooking mode",sub:"Steps, timers and finishing",glyph:"♨"},
 {topic:"ask",title:"Ask & voice",sub:"Ask me instead of hunting",glyph:"…"},
 {topic:"history",title:"History & ratings",sub:"What we cooked and liked",glyph:"★"}
] as const;
function launch(detail:Record<string,string>){feedback("tap");window.dispatchEvent(new CustomEvent("home-meals:guide",{detail}))}

export function Help(){
 const h=useHousehold();
 return <div className="hm-screen">
  <h1 className="hm-h1 hm-gut">More</h1>
  <section className="hm-josh-guide-hub hm-gut" aria-label="Josh guides">
   <div className="hm-josh-guide-hero hm-card lg"><JoshPresenceAnchor priority={35} expression="affectionate" size={78}/><div><span className="hm-kicker">NEED A HAND?</span><h2>Want me to show you?</h2><p>Start from the beginning, do the quick lap, or pick exactly the bit you forgot.</p></div></div>
   <div className="hm-josh-guide-main"><button className="hm-btn primary" onClick={()=>launch({mode:"full"})}>Show me around</button><button className="hm-btn ghost" onClick={()=>launch({mode:"quick"})}>Quick refresher</button></div>
   <div className="hm-josh-guide-grid">{interactiveGuides.map(g=><button key={g.topic} className="hm-card hm-lift" onClick={()=>launch({topic:g.topic})}><span className="ic">{g.glyph}</span><span><strong>{g.title}</strong><small>{g.sub}</small></span><b>›</b></button>)}</div>
  </section>
  <div className="hm-more-actions">{actions.map(a=><Link key={a.href} href={a.href} className="hm-card hm-lift" style={{"--bg":a.bg} as CSSProperties} onClick={()=>feedback("tap")}><span className="ic">{a.glyph}</span><strong>{a.label}</strong></Link>)}</div>
  <p className="hm-more-memory hm-gut">{h.history.length?`${h.history.length} ${h.history.length===1?"dinner":"dinners"} in our history so far.`:"Nothing in our dinner history yet — that starts after the first cook."}</p>
  <SectionHead title="Kitchen guides" action={<span className="muted">keep for reference</span>}/>
  <div className="hm-guides">{guides.map(g=><Tile key={g.slug} href={`/learn/${g.slug}`} img={g.img} alt=""><div className="shade side"/><div className="gcopy"><span className="kick">{g.kicker}</span><div><h3>{g.title}</h3><p>{g.sub}</p></div></div></Tile>)}</div>
 </div>;
}

const tierInfo={
 mother:{title:"Core bases",note:"Seven foundations we can keep around when they earn their space",grad:"var(--grad-green-short)"},
 mid:{title:"Mids & sauces",note:"Make these when a dinner actually needs them",grad:"linear-gradient(135deg,#ffb48f,#ff8a5c)"},
 booster:{title:"Boosters",note:"Small aromatics, marinades and finishes",grad:"linear-gradient(135deg,#9fc0ff,#4f8cff)"}
} as const;
const pipeline=[["Chop","0–15 min","Trim, peel and measure before the heat starts.","#6fd39a"],["Cook","recipe","Follow the method, then trust the colour and texture cues as well as the clock.","#2fae6e"],["Check","watch","Look for the texture, colour or reduction shown in the recipe.","#4cc487"],["Cool","promptly","Cool it as directed before you pack it away.","#4f8cff"],["Measure","1 min","Weigh or measure what you actually made.","#ff9f7a"],["Portion","a few min","Split that amount into useful portions, with any bit left over recorded too.","#e8825f"],["Label","2 min","Name · amount · date. Keep the oldest one in front.","#a8e6c3"]];
const loop=[["Choose","Pick the dinners","/plan"],["Check","See what’s at home","/kitchen"],["Fill the gap","Shop + make what’s missing","/prep"],["Cook","Eat, rate, remember","/cook"]];

export function Guide({slug}:{slug:string}){
 const h=useHousehold();
 const header={portions:{img:foundationImages.cubes,title:"Measure first. Split it second.",lead:"Cook the prep, then weigh or measure what you actually ended up with. Home can split that into useful portions without pretending the pot always makes the same amount."},freezer:{img:foundationImages.freezer,title:"Label it. Oldest in front.",lead:"Name it, write the amount and the date, then keep the oldest one easiest to reach."},"prep-day":{img:foundationImages.prepDay,title:"Make what the week needs.",lead:"Prep Day puts the jobs in a sensible order and leaves everything else alone."},system:{img:foundationImages.groceries,title:"The week decides the list.",lead:"Pick the dinners, subtract what’s already here, then shop or prep what’s missing."}}[slug];
 if(!header)return null;
 const today=new Date();const fmt=(d:Date)=>d.toLocaleDateString(undefined,{day:"numeric",month:"short"}).toUpperCase();
 const displayWeek=h.weekStatus==="suggested"&&h.suggestedWeek?.length===7?h.suggestedWeek:h.week,required=new Set<string>();displayWeek.forEach(id=>ingredientsForRecipeV7(id).forEach(x=>{if(!x.optional&&x.ingredientId!=="water")required.add(x.ingredientId)}));
 return <div className="hm-screen flush">
  <div className="hm-hero sm"><img src={header.img} alt="" loading="eager"/><div className="shade fade"/><div className="top"><RoundBack href="/learn" onPhoto label="Back to More"/></div></div>
  <div className="hm-guide-head"><span className="hm-kicker">Guide</span><h1>{header.title}</h1><p className="hm-lead">{header.lead}</p></div>
  {slug==="portions"&&<><div className="hm-guide-rows">{(["mother","mid","booster"] as const).map(tier=>{const info=tierInfo[tier],items=canonicalPrepComponentsV2.filter(c=>c.tier===tier&&(tier!=="mother"||coreMotherIdsV7.includes(c.id)));return <div key={tier} className="hm-card"><span className="sw sq" style={{"--grad":info.grad} as CSSProperties}>{items.length}</span><span><strong>{info.title}</strong><small>{info.note}</small><small style={{display:"block",marginTop:4}}>{items.slice(0,8).map(c=>c.code).join(" · ")}{items.length>8?` · +${items.length-8} more`:""}</small></span></div>})}<div className="hm-card"><span className="sw sq" style={{"--grad":"linear-gradient(135deg,#b6875d,#7d5635)"} as CSSProperties}>1</span><span><strong>Optional onion base</strong><small>It’s there when a dinner genuinely benefits from it; we don’t keep it just to complete a set.</small></span></div></div><HomeSays expression="thinking">Example: if GOLD finishes at 1,137 g, we record 1,137 g. That might become four 240 g portions plus 177 g left over. The scale wins; Home doesn’t guess what the pot should have made.</HomeSays></>}
  {slug==="freezer"&&<><div className="hm-label" style={{"--tone":toneFor("gold")} as CSSProperties}><div className="head"><span className="code">GOLD</span><span className="kind">BASE</span></div><div className="cells"><div><small>AMOUNT</small><b>240 g</b></div><div><small>MADE</small><b>{fmt(today)}</b></div><div><small>NEXT</small><b className="green">USE FIRST</b></div></div></div><div className="hm-guide-rows">{[["1","Name","GOLD, not just ‘curry base’.","var(--tint-green)","var(--green)"],["2","Amount","Write what is actually in the bag or container.","var(--tint-sky)","var(--sky)"],["3","Date","The date tells us which one to use first.","var(--tint-peach)","var(--peach-text)"],["↺","Oldest in front","New batch goes behind the older one.","var(--track)","var(--ink-soft)"]].map(([v,t,x,bg,fg])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":bg,"--fg":fg} as CSSProperties}>{v}</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div><SectionHead title="Where things live" action={<span className="muted">keep it simple</span>}/><div className="hm-guide-rows" style={{paddingTop:14}}>{[["Core bases",canonicalPrepComponentsV2.filter(c=>coreMotherIdsV7.includes(c.id)).map(c=>c.code).join(" · "),"var(--grad-green-short)"],["Sauces + boosters","only the ones we actually use","linear-gradient(135deg,#ffb48f,#ff8a5c)"],["Protein","dinner-size packs","linear-gradient(135deg,#9fc0ff,#4f8cff)"],["Carbs","rice · breads · backup portions","linear-gradient(135deg,#d4b65a,#a88a2a)"]].map(([t,x,g])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":g} as CSSProperties}>❄</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div></>}
  {slug==="prep-day"&&<><div className="hm-pipeline">{pipeline.map(([name],i)=><div key={name}><span className={i===1?"on":""}>{name}</span>{i<pipeline.length-1&&<i>›</i>}</div>)}</div><div className="hm-timeline"><i className="line"/><div className="items">{pipeline.map(([name,time,text,dot])=><article key={name} className="hm-card" style={{"--dot":dot} as CSSProperties}><i className="dot"/><div className="head"><strong>{name}</strong><small>{time}</small></div><p>{text}</p></article>)}</div></div><SectionHead title="Trust the cues" action={<Link href="/prep">Prep ›</Link>}/><div className="hm-rail">{motherBases.filter(m=>coreMotherIdsV7.includes(m.id)).map(m=>{const p=motherProcessImages[m.id]?.at(-2);const img=p?.url??motherHero(m.id);return <Tile key={m.id} href={`/prep/${m.id}`} img={img} alt={m.name} title={m.code} sub={p?p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase():m.name} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties}/>})}</div><div className="hm-gut" style={{marginTop:22}}><Link className="hm-btn primary full" href="/prep/day">Open Prep Day</Link></div></>}
  {slug==="system"&&<><div className="hm-gap" style={{marginTop:26}}><div><b>{required.size}</b><small>week needs</small></div><span>−</span><div className="sky"><b>{h.kitchenReady?Math.max(0,required.size-h.shoppingNeeds.length):"—"}</b><small>already here</small></div><span>=</span><div className="green"><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>to buy</small></div></div><div className="hm-guide-rows">{loop.map(([step,what,href],i)=><Link key={step} href={href} className="hm-card hm-lift"><span className="sw sq">{i+1}</span><span><strong>{step}</strong><small>{what}</small></span></Link>)}</div><HomeSays expression="happy">If Kitchen has enough recorded for a dinner, Home can take the amounts off when we finish cooking. If it doesn’t, dinner still goes into History and Kitchen stays untouched instead of pretending.</HomeSays></>}
  <div style={{height:40}}/>
 </div>;
}
