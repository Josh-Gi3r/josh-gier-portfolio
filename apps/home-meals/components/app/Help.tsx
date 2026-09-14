"use client";
import Link from "next/link";
import type {CSSProperties} from "react";
import {motherBases} from "@/data/home-data";
import {canonicalPrepComponentsV2} from "@/data/food-truth-v2";
import {ingredientsForRecipeV2} from "@/data/ingredient-engine-v2";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {RoundBack,SectionHead,Tile,formatQty} from "./Primitives";

const guides=[
 {slug:"portions",kicker:"PORTIONS",title:"Working portions, made simple",sub:"What one useful prep portion means",img:foundationImages.cubes},
 {slug:"freezer",kicker:"FREEZER",title:"Label it, front to back",sub:"CODE / PORTIONS / DATE · oldest first",img:foundationImages.freezer},
 {slug:"prep-day",kicker:"PREP DAY",title:"Chop → cook → cue → cool → portion",sub:"Only what this week needs",img:foundationImages.prepDay},
 {slug:"system",kicker:"THE WEEK",title:"Plan minus what’s home",sub:"How the list and prep are built",img:foundationImages.groceries}
];
const actions=[
 {href:"#household",label:"Household",glyph:"J·G",bg:"linear-gradient(135deg,#ffc2a8,#ff9f7a)"},
 {href:"/history",label:"Our history",glyph:"★",bg:"var(--grad-green-short)"},
 {href:"/prep/day",label:"Prep Day",glyph:"✓",bg:"linear-gradient(135deg,#9fc0ff,#4f8cff)"},
 {href:"/cook/builder",label:"From what we have",glyph:"✦",bg:"var(--ink)"}
];

export function Help(){
 const h=useHousehold();
 return <div className="hm-screen">
  <h1 className="hm-h1 hm-gut">More</h1>
  <div className="hm-more-actions">{actions.map(a=><Link key={a.href} href={a.href} className="hm-card hm-lift" style={{"--bg":a.bg} as CSSProperties} onClick={()=>feedback("tap")}><span className="ic">{a.glyph}</span><strong>{a.label}</strong></Link>)}</div>
  <HomeSays className="tight">{h.history.length?<>{h.history.length} {h.history.length===1?"dinner":"dinners"} logged so far. Everything I remember about them is under Our history.</>:<>Cook something and rate it — what worked lands here, not in a settings page.</>}</HomeSays>
  <SectionHead title="Guides" action={<span className="muted">short, visual</span>}/>
  <div className="hm-guides">{guides.map(g=><Tile key={g.slug} href={`/learn/${g.slug}`} img={g.img} alt=""><div className="shade side"/><div className="gcopy"><span className="kick">{g.kicker}</span><div><h3>{g.title}</h3><p>{g.sub}</p></div></div></Tile>)}</div>
 </div>;
}

const tierInfo={
 mother:{title:"Core bases",note:"Big foundations you may keep in rotation",grad:"var(--grad-green-short)"},
 mid:{title:"Mids & sauces",note:"Made or kept when a dinner actually needs them",grad:"linear-gradient(135deg,#ffb48f,#ff8a5c)"},
 booster:{title:"Boosters",note:"Small aromatics, marinades and finishes",grad:"linear-gradient(135deg,#9fc0ff,#4f8cff)"}
} as const;
const pipeline=[["Chop","0–15 min","Trim, peel and measure before heat starts.","#6fd39a"],["Cook","recipe","Follow the method and let the visual cue, not the clock alone, tell you when it is ready.","#2fae6e"],["Cue","watch","Each important prep has a texture, colour or reduction cue. Home shows the reference image where we have one.","#4cc487"],["Cool","promptly","Follow the component storage guidance and cool safely before packing.","#4f8cff"],["Portion","a few min","Divide into useful working portions. No whole-pot weighing exercise.","#ff9f7a"],["Label","2 min","CODE / PORTIONS / DATE on the container or bag.","#e8825f"],["Store","done","Freeze, refrigerate or keep airtight according to that prep’s storage rule.","#a8e6c3"]];
const loop=[["Choose","Recipes + week","/plan"],["Check","Kitchen","/kitchen"],["Fill the gap","Shop + prep","/prep"],["Use it","Cook + rate","/cook"]];

export function Guide({slug}:{slug:string}){
 const h=useHousehold();
 const header={portions:{img:foundationImages.cubes,title:"Working portions, not batch weights.",lead:"Home keeps exact g/ml/count underneath so recipes add up, but you only need to think in useful portions when stocking prep."},freezer:{img:foundationImages.freezer,title:"Label it. Oldest in front.",lead:"Code, number of working portions and date made. Home does not invent an expiry date."},"prep-day":{img:foundationImages.prepDay,title:"Make what the week needs.",lead:"Same rhythm whichever prep you’re making. Prep Day orders the work and keeps the rest of the 41-item library dormant."},system:{img:foundationImages.groceries,title:"The week decides the list.",lead:"Dinners set demand. What’s already home comes off. What’s left is the shop and the prep."}}[slug];
 if(!header)return null;
 const today=new Date();const fmt=(d:Date)=>d.toLocaleDateString(undefined,{day:"numeric",month:"short"}).toUpperCase();
 const required=new Set<string>();h.week.forEach(id=>ingredientsForRecipeV2(id).forEach(x=>{if(!x.optional&&x.ingredientId!=="water")required.add(x.ingredientId)}));
 return <div className="hm-screen flush">
  <div className="hm-hero sm"><img src={header.img} alt="" loading="eager"/><div className="shade fade"/><div className="top"><RoundBack href="/learn" onPhoto label="Back to More"/></div></div>
  <div className="hm-guide-head"><span className="hm-kicker">Guide</span><h1>{header.title}</h1><p className="hm-lead">{header.lead}</p></div>

  {slug==="portions"&&<>
   <div className="hm-guide-rows">{(["mother","mid","booster"] as const).map(tier=>{const info=tierInfo[tier],items=canonicalPrepComponentsV2.filter(c=>c.tier===tier);return <div key={tier} className="hm-card"><span className="sw sq" style={{"--grad":info.grad} as CSSProperties}>{items.length}</span><span><strong>{info.title}</strong><small>{info.note}</small><small style={{display:"block",marginTop:4}}>{items.slice(0,8).map(c=>`${c.code} ${formatQty(c.workingUnit.qty,c.workingUnit.unit)}`).join(" · ")}{items.length>8?` · +${items.length-8} more`:""}</small></span></div>})}</div>
   <HomeSays>Example: if GOLD’s working portion is 60 g and a dinner uses two, Home handles the 120 g arithmetic. You can simply think “two GOLD portions.”</HomeSays>
  </>}

  {slug==="freezer"&&<>
   <div className="hm-label" style={{"--tone":toneFor("gold")} as CSSProperties}><div className="head"><span className="code">GOLD</span><span className="kind">BASE</span></div><div className="cells"><div><small>PORTIONS</small><b>3</b></div><div><small>MADE</small><b>{fmt(today)}</b></div><div><small>ORDER</small><b className="green">USE FIRST</b></div></div></div>
   <div className="hm-guide-rows">{[["1","Code","The prep name in caps. GOLD, not ‘curry base’.","var(--tint-green)","var(--green)"],["2","Portions","Count the usable working portions you actually stored.","var(--tint-sky)","var(--sky)"],["3","Date made","Home can keep older recorded batches in front without pretending to know an exact expiry.","var(--tint-peach)","var(--peach-text)"],["↺","Oldest in front","When a new batch goes in, the older recorded batch stays first to use.","var(--track)","var(--ink-soft)"]].map(([v,t,x,bg,fg])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":bg,"--fg":fg} as CSSProperties}>{v}</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div>
   <SectionHead title="Where things live" action={<span className="muted">keep it simple</span>}/>
   <div className="hm-guide-rows" style={{paddingTop:14}}>{[["Core bases",canonicalPrepComponentsV2.filter(c=>c.tier==="mother").map(c=>c.code).join(" · "),"var(--grad-green-short)"],["Mids + boosters","only the active ones and what this week needs","linear-gradient(135deg,#ffb48f,#ff8a5c)"],["Protein","dinner-size packs","linear-gradient(135deg,#9fc0ff,#4f8cff)"],["Carbs","rice · breads · backup portions","linear-gradient(135deg,#d4b65a,#a88a2a)"]].map(([t,x,g])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":g} as CSSProperties}>❄</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div>
  </>}

  {slug==="prep-day"&&<>
   <div className="hm-pipeline">{pipeline.map(([name],i)=><div key={name}><span className={i===1?"on":""}>{name}</span>{i<pipeline.length-1&&<i>›</i>}</div>)}</div>
   <div className="hm-timeline"><i className="line"/><div className="items">{pipeline.map(([name,time,text,dot])=><article key={name} className="hm-card" style={{"--dot":dot} as CSSProperties}><i className="dot"/><div className="head"><strong>{name}</strong><small>{time}</small></div><p>{text}</p></article>)}</div></div>
   <SectionHead title="Trust the cues" action={<Link href="/prep">Prep ›</Link>}/>
   <div className="hm-rail">{motherBases.map(m=>{const p=motherProcessImages[m.id]?.at(-2);const img=p?.url??motherHero(m.id);return <Tile key={m.id} href={`/prep/${m.id}`} img={img} alt={m.name} title={m.code} sub={p?p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase():m.name} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties}/>})}</div>
   <div className="hm-gut" style={{marginTop:22}}><Link className="hm-btn primary full" href="/prep/day">Open Prep Day</Link></div>
  </>}

  {slug==="system"&&<>
   <div className="hm-gap" style={{marginTop:26}}><div><b>{required.size}</b><small>week needs</small></div><span>−</span><div className="sky"><b>{h.kitchenReady?Math.max(0,required.size-h.shoppingNeeds.length):"—"}</b><small>covered</small></div><span>=</span><div className="green"><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>to buy</small></div></div>
   <div className="hm-guide-rows">{loop.map(([step,what,href],i)=><Link key={step} href={href} className="hm-card hm-lift"><span className="sw sq">{i+1}</span><span><strong>{step}</strong><small>{what}</small></span></Link>)}</div>
   <HomeSays>When recorded Kitchen truth fully covers a dinner, cooking reconciles the exact stock Home knows. If it does not, the dinner can still go into History without Home inventing or partially deducting stock.</HomeSays>
  </>}
  <div style={{height:40}}/>
 </div>;
}
