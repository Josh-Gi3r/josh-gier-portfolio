"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, midBases, motherBases } from "@/data/home-graph-v3";
import { FreezerWheel } from "./HomeInfographics";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const shortDay=["M","T","W","T","F","S","S"];

export function HomeDashboard(){
 const h=useHousehold();
 const day=(new Date().getDay()+6)%7;
 const tonight=getMeal(h.week[day]??h.week[0]);
 const codes=(mealId:string)=>{const m=getMeal(mealId);return [...m.motherIds.map(id=>motherBases.find(x=>x.id===id)?.code),...m.midIds.map(id=>midBases.find(x=>x.id===id)?.code)].filter(Boolean) as string[]};
 const buy=h.shoppingNeeds.slice(0,3);
 const prep=h.prepNeeds.slice(0,3);
 const rating=h.ratings[tonight.id];
 return <div className="hm-screen hm-home-screen hm-v3-screen">
  <header className="hm-mobile-head">
   <div><span>HOME MEALS</span><h1>Hey, what are we doing?</h1><p>Josh + G · home tonight</p></div>
   <div className="hm-couple-bubbles"><b>J</b><b>G</b></div>
  </header>

  <section className="hm-tonight-v3">
   {tonight.image&&<img src={tonight.image} alt={tonight.title}/>}<div className="shade"/>
   <div className="copy"><span>TONIGHT · {tonight.minutes} MIN</span><h2>{tonight.title}</h2><p>{tonight.subtitle}</p><div className="chips">{codes(tonight.id).map(x=><b key={x}>{x}</b>)}{rating&&(rating.josh||rating.g)&&<em>{rating.josh?`J ${rating.josh}★`:""}{rating.josh&&rating.g?" · ":""}{rating.g?`G ${rating.g}★`:""}</em>}</div><div className="actions"><Link href={`/cook/${tonight.id}/cook`}>Start cooking</Link><Link href="/plan">Swap dinner</Link></div></div>
  </section>

  <section className="hm-home-action-grid">
   <Link href="/plan" className="hm-home-action use"><i>◷</i><div><span>USE / BUY</span><strong>{buy.length?`${buy.length} things need attention`:"We're covered"}</strong><small>{buy.length?buy.map(x=>getIngredient(x.id).name).join(" · "):"Nothing urgent to buy"}</small></div><b>›</b></Link>
   <Link href="/prep" className="hm-home-action prep"><i>✦</i><div><span>PREP</span><strong>{prep.length?`${prep.length} things to top up`:"You're covered"}</strong><small>{prep.length?prep.map(x=>(motherBases.find(m=>m.id===x.id)??midBases.find(m=>m.id===x.id))?.code).join(" · "):"Skip the busywork"}</small></div><b>›</b></Link>
  </section>

  <section className="hm-section hm-v3-section"><div className="hm-v3-section-head"><div><span>THIS WEEK</span><h2>Seven dinners</h2></div><Link href="/plan">Plan & shop ›</Link></div><div className="hm-week-rail-v3">{h.week.map((id,i)=>{const m=getMeal(id);return <Link href={`/cook/${id}`} key={`${id}-${i}`} className={i===day?"today":""}>{m.image?<img src={m.image} alt=""/>:<div className="placeholder">{m.title[0]}</div>}<span>{days[i]}</span><strong>{m.title}</strong><small>{m.minutes}m · {codes(id).join(" + ")||"fresh"}</small><i>{shortDay[i]}</i></Link>})}</div></section>

  <section className="hm-home-intel-card"><div className="hm-home-intel-copy"><span>KITCHEN NOTE</span><h2>{prep.length?`Make ${((motherBases.find(m=>m.id===prep[0].id)??midBases.find(m=>m.id===prep[0].id))?.code) ?? "one batch"} next.`:"Freezer looks good."}</h2><p>{prep.length?"That is the highest-priority prep gap created by this week's actual meals.":"Nothing needs making just because it's Sunday."}</p></div><Link href="/kitchen">Kitchen ›</Link></section>

  <FreezerWheel/>

  <section className="hm-home-love"><span>♡</span><div><strong>Good food, happier home.</strong><p>Choose · shop · prep · cook · rate · make it better next time.</p></div></section>
 </div>
}
