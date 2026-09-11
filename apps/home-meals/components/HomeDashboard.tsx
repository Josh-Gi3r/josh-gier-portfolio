"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, midBases, motherBases } from "@/data/home-graph-v3";
import { FreezerWheel } from "./HomeInfographics";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export function HomeDashboard(){
 const h=useHousehold();
 const day=(new Date().getDay()+6)%7;
 const tonight=getMeal(h.week[day]??h.week[0]);
 const codes=(mealId:string)=>{const m=getMeal(mealId);return [...m.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...m.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean) as string[]};
 const buy=h.shoppingNeeds.slice(0,3);
 const prep=h.prepNeeds.slice(0,3);
 const rating=h.ratings[tonight.id];
 const last=h.history[0]?getMeal(h.history[0].mealId):null;
 const lowMother=motherBases.find(x=>(h.componentStock[x.id]??0)<=1);
 return <div className="hm-screen hm-home-screen hm-v3-screen hm-home-v4">
  <header className="hm-home-head-v4">
   <div><span>HOME MEALS</span><h1>Tonight at home</h1><p>Josh + G · our little kitchen</p></div>
   <Link href="/kitchen" className="hm-us-orb-v4"><b>J</b><b>G</b><i>♥</i></Link>
  </header>

  <section className="hm-tonight-v4">
   {tonight.image&&<img src={tonight.image} alt={tonight.title}/>}<div className="hm-tonight-glow-v4"/><div className="hm-tonight-shine-v4"/>
   <div className="hm-tonight-top-v4"><span><i/> READY TONIGHT</span><small>{tonight.minutes} min</small></div>
   <div className="hm-tonight-copy-v4"><h2>{tonight.title}</h2><p>{tonight.subtitle}</p><div className="hm-tonight-chips-v4">{codes(tonight.id).map(x=><b key={x}>{x}</b>)}{rating&&(rating.josh||rating.g)&&<em>{rating.josh?`J ${rating.josh}★`:""}{rating.josh&&rating.g?" · ":""}{rating.g?`G ${rating.g}★`:""}</em>}</div><div className="hm-tonight-actions-v4"><Link href={`/cook/${tonight.id}/cook`}>Cook now <b>→</b></Link><Link href="/plan">Swap</Link></div></div>
  </section>

  <section className="hm-quick-v4">
   <Link href="/plan" className="warm"><i>◷</i><div><span>SHOP</span><strong>{buy.length?`${h.shoppingNeeds.length} top-ups`:"Covered"}</strong><small>{buy.length?buy.map(x=>getIngredient(x.id).name).join(" · "):"Nothing urgent"}</small></div><b>›</b></Link>
   <Link href="/prep" className="green"><i>✦</i><div><span>PREP</span><strong>{prep.length?`${h.prepNeeds.length} jobs`:"All good"}</strong><small>{prep.length?prep.map(x=>(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code).join(" · "):"Skip it"}</small></div><b>›</b></Link>
   <Link href="/scan" className="blue"><i>◎</i><div><span>SHOW HOME</span><strong>Camera</strong><small>Fridge · receipt · prep</small></div><b>›</b></Link>
  </section>

  <section className="hm-v4-section"><header><div><span>THIS WEEK</span><h2>What we're eating</h2></div><Link href="/plan">Plan ›</Link></header><div className="hm-week-v4">{h.week.map((id,i)=>{const m=getMeal(id);return <Link href={`/cook/${id}`} key={`${id}-${i}`} className={i===day?"today":""}>{m.image?<img src={m.image} alt=""/>:<div className="placeholder">{m.title[0]}</div>}<div><span>{days[i]}{i===day?" · today":""}</span><strong>{m.title}</strong><small>{m.minutes}m · {codes(id).join(" + ")||"fresh"}</small></div>{i===day&&<i>●</i>}</Link>})}</div></section>

  <section className="hm-kitchen-nudge-v4"><div className="hm-nudge-icon-v4"><span>✦</span><i/></div><div><small>HOME NOTE</small><strong>{prep.length?`Let's make ${((motherBases.find(m=>m.id===prep[0].id)??midBases.find(m=>m.id===prep[0].id))?.code) ?? "one batch"} next.`:lowMother?`${lowMother.code} is getting low.`:"Kitchen is in a good place."}</strong><p>{prep.length?"It matters because this week's meals actually use it.":"No prep for prep's sake."}</p></div><Link href="/prep">›</Link></section>

  <FreezerWheel/>

  <section className="hm-v4-section"><header><div><span>OUR MEMORY</span><h2>What we're learning</h2></div><Link href="/cook">Recipes ›</Link></header><div className="hm-memory-v4">{last?<><div className="hm-memory-meal-v4">{last.image&&<img src={last.image} alt=""/>}<div><span>LAST COOKED</span><strong>{last.title}</strong><small>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}</small></div></div><div className="hm-memory-note-v4">“{h.recipeNotes[last.id]?.[0]?.text??"Cook it, rate it, tweak it. Home remembers."}”</div></>:<><div className="hm-memory-empty-v4"><span>♥</span><strong>Our recipes get better as we use them.</strong><p>Cook · rate · leave a note · make the next version ours.</p></div></>}</div></section>

  <section className="hm-home-signoff-v4"><span>♥</span><div><strong>Good food. Less faff. More us.</strong><p>That's the whole point.</p></div></section>
 </div>
}
