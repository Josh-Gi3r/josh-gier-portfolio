"use client";
import Link from "next/link";
import type {CSSProperties} from "react";
import {motherBases,prepComponents,recipes} from "@/data/home-data";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {motherHero,toneFor,toneGradient} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {RoundBack,SectionHead,Tile} from "./Primitives";

const guides=[
 {slug:"portions",kicker:"PORTIONS",title:"Cube sizes, to scale",sub:"What each freezer size is for",img:foundationImages.cubes},
 {slug:"freezer",kicker:"FREEZER",title:"Label it, front to back",sub:"CODE / ML / DATE · oldest first",img:foundationImages.freezer},
 {slug:"prep-day",kicker:"PREP DAY",title:"Chop → cook → cue → cool → freeze",sub:"The Sunday pipeline",img:foundationImages.prepDay},
 {slug:"system",kicker:"THE WEEK",title:"Plan minus what’s home",sub:"How the list and prep are built",img:foundationImages.groceries}
];
const actions=[
 {href:"#household",label:"Household",glyph:"J·G",bg:"linear-gradient(135deg,#ffc2a8,#ff9f7a)"},
 {href:"#memory",label:"Our history",glyph:"★",bg:"var(--grad-green-short)"},
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

// Freezer sizes grouped by what actually uses them in our data.
const buckets=[{ml:15,px:34,label:"Boosters",test:(x:number)=>x<=15,grad:"linear-gradient(135deg,#f0d27a,#d4a93a)"},{ml:30,px:43,label:"Concentrates",test:(x:number)=>x>15&&x<=45,grad:"linear-gradient(135deg,#9a7a68,#7a5a48)"},{ml:60,px:54,label:"Everyday bases",test:(x:number)=>x>45&&x<=60,grad:"linear-gradient(135deg,#e8b64a,#c48a1c)"},{ml:120,px:68,label:"Dinner bases",test:(x:number)=>x>60&&x<=150,grad:"linear-gradient(135deg,#ff8a70,#e65f45)"},{ml:250,px:86,label:"Big portions",test:(x:number)=>x>150&&x<400,grad:"linear-gradient(135deg,#c98a48,#a86a2a)"},{ml:500,px:108,label:"Stock",test:(x:number)=>x>=400,grad:"linear-gradient(135deg,#9fc0ff,#4f8cff)"}];
const pipeline=[["Chop","0–15 min","Trim, peel, weigh. Everything measured before any heat.","#6fd39a"],["Cook","15–90 min","Onions first, slow. Patience here is the whole flavour.","#2fae6e"],["Cue","watch","Each base has one visual sign it’s done. Home shows the photo.","#4cc487"],["Cool","1–2 h","Shallow trays, quickly. Never freeze warm.","#4f8cff"],["Portion","10 min","Into the right cube size. Level, not heaped.","#ff9f7a"],["Label","2 min","CODE / ML / DATE on the tray or bag.","#e8825f"],["Freeze","overnight","Flat first, then into bags once solid.","#a8e6c3"]];
const loop=[["Choose","Recipes + week","/plan"],["Check","Kitchen","/kitchen"],["Fill the gap","Shop + prep","/prep"],["Use it","Cook + rate","/cook"]];

export function Guide({slug}:{slug:string}){
 const h=useHousehold();
 const header={portions:{img:foundationImages.cubes,title:"Six cube sizes, to scale.",lead:"Every base and booster freezes into one of these. The recipe still says exactly how many."},freezer:{img:foundationImages.freezer,title:"Label it. Oldest in front.",lead:"Three things on every label. Home reads the date back so nothing gets forgotten."},"prep-day":{img:foundationImages.prepDay,title:"Seven moves, every base.",lead:"Same rhythm whichever base you’re making. Prep Day orders them so pans overlap."},system:{img:foundationImages.groceries,title:"The week decides the list.",lead:"Dinners set the demand. What’s already home comes off. What’s left is the shop and the prep."}}[slug];
 if(!header)return null;
 const today=new Date();const useBy=new Date(today.getTime()+90*86400000);const fmt=(d:Date)=>d.toLocaleDateString(undefined,{day:"numeric",month:"short"}).toUpperCase();
 const required=new Set<string>();h.week.forEach(id=>recipes.find(r=>r.id===id)?.ingredients.forEach(x=>{if(!x.optional)required.add(x.id)}));
 return <div className="hm-screen flush">
  <div className="hm-hero sm"><img src={header.img} alt="" loading="eager"/><div className="shade fade"/><div className="top"><RoundBack href="/learn" onPhoto label="Back to More"/></div></div>
  <div className="hm-guide-head"><span className="hm-kicker">Guide</span><h1>{header.title}</h1><p className="hm-lead">{header.lead}</p></div>

  {slug==="portions"&&<>
   <div className="hm-cubes">{buckets.map(b=><div key={b.ml}><div className="cube" style={{width:b.px,height:b.px,borderRadius:Math.round(b.px/4),"--grad":b.grad} as CSSProperties}/><b>{b.ml}</b></div>)}</div>
   <p className="hm-note hm-gut" style={{textAlign:"center",marginTop:8}}>millilitres · silhouettes to scale</p>
   <div className="hm-guide-rows">{buckets.map(b=>{const codes=prepComponents.filter(c=>b.test(c.portionMl)).map(c=>c.code);return <div key={b.ml} className="hm-card"><span className="sw" style={{"--grad":b.grad} as CSSProperties}>{b.ml} ml</span><span><strong>{b.label}</strong><small>{codes.length?codes.slice(0,8).join(" · ")+(codes.length>8?` +${codes.length-8}`:""):"nothing uses this size yet"}</small></span></div>})}</div>
  </>}

  {slug==="freezer"&&<>
   <div className="hm-label" style={{"--tone":toneFor("gold")} as CSSProperties}><div className="head"><span className="code">GOLD</span><span className="kind">BASE</span></div><div className="cells"><div><small>ML</small><b>60</b></div><div><small>DATE</small><b>{fmt(today)}</b></div><div><small>USE BY</small><b className="green">{fmt(useBy)}</b></div></div></div>
   <div className="hm-guide-rows">{[["1","Code","The base name in caps. GOLD, not ‘curry base’.","var(--tint-green)","var(--green)"],["2","Millilitres","So you can count cubes into a recipe without guessing.","var(--tint-sky)","var(--sky)"],["3","Date made","Home works out use‑by from the freezer guide and nudges you.","var(--tint-peach)","var(--peach-text)"],["↺","Oldest in front","When a new batch goes in, the old one moves forward. Home tells you which to grab.","var(--track)","var(--ink-soft)"]].map(([v,t,x,bg,fg])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":bg,"--fg":fg} as CSSProperties}>{v}</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div>
   <SectionHead title="Where things live" action={<span className="muted">one drawer each</span>}/>
   <div className="hm-guide-rows" style={{paddingTop:14}}>{[["Bases",motherBases.map(m=>m.code).join(" · "),"var(--grad-green-short)"],["Mids + boosters","small flavour portions, coded trays","linear-gradient(135deg,#ffb48f,#ff8a5c)"],["Protein","dinner‑size packs","linear-gradient(135deg,#9fc0ff,#4f8cff)"],["Carbs","rice · breads · backup portions","linear-gradient(135deg,#d4b65a,#a88a2a)"]].map(([t,x,g])=><div key={t} className="hm-card"><span className="sw sq" style={{"--grad":g} as CSSProperties}>❄</span><span><strong>{t}</strong><small>{x}</small></span></div>)}</div>
  </>}

  {slug==="prep-day"&&<>
   <div className="hm-pipeline">{pipeline.map(([name],i)=><div key={name}><span className={i===1?"on":""}>{name}</span>{i<pipeline.length-1&&<i>›</i>}</div>)}</div>
   <div className="hm-timeline"><i className="line"/><div className="items">{pipeline.map(([name,time,text,dot])=><article key={name} className="hm-card" style={{"--dot":dot} as CSSProperties}><i className="dot"/><div className="head"><strong>{name}</strong><small>{time}</small></div><p>{text}</p></article>)}</div></div>
   <SectionHead title="Trust the cues" action={<Link href="/prep">Bases ›</Link>}/>
   <div className="hm-rail">{motherBases.map(m=>{const p=motherProcessImages[m.id]?.at(-2);const img=p?.url??motherHero(m.id);return <Tile key={m.id} href={`/prep/${m.id}`} img={img} alt={m.name} title={m.code} sub={p?p.stage.replace(/^\d+\s*·\s*/,"").toLowerCase():m.name} style={{"--tone-grad":toneGradient(m.id)} as CSSProperties}/>})}</div>
   <div className="hm-gut" style={{marginTop:22}}><Link className="hm-btn primary full" href="/prep/day">Open Prep Day</Link></div>
  </>}

  {slug==="system"&&<>
   <div className="hm-gap" style={{marginTop:26}}><div><b>{required.size}</b><small>week needs</small></div><span>−</span><div className="sky"><b>{h.kitchenReady?Math.max(0,required.size-h.shoppingNeeds.length):"—"}</b><small>at home</small></div><span>=</span><div className="green"><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>to buy</small></div></div>
   <div className="hm-guide-rows">{loop.map(([step,what,href],i)=><Link key={step} href={href} className="hm-card hm-lift"><span className="sw sq">{i+1}</span><span><strong>{step}</strong><small>{what}</small></span></Link>)}</div>
   <HomeSays>Cooking takes off exactly what the plan counted, so the freezer, the list and the ratings all stay honest. Swap a dinner and the numbers move with it.</HomeSays>
  </>}
  <div style={{height:40}}/>
 </div>;
}
