"use client";
import {useMemo} from "react";
import {getComponent,getRecipe,getIngredient} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";

const days=["M","T","W","T","F","S","S"];
export function WeekReuse(){
 const h=useHousehold();
 const rows=useMemo(()=>{const m=new Map<string,{count:number;days:number[]}>();h.week.forEach((id,di)=>{const seen=new Set<string>();getRecipe(id).prep.forEach(p=>{if(seen.has(p.id))return;seen.add(p.id);const cur=m.get(p.id)??{count:0,days:[]};cur.count++;cur.days.push(di);m.set(p.id,cur)})});return [...m.entries()].map(([id,v])=>({id,...v,component:getComponent(id)})).filter(x=>x.component).sort((a,b)=>b.count-a.count).slice(0,6)},[h.week]);
 if(!rows.length)return null;
 return <section className="hm-week-reuse-v5"><header><div><span>SHARED PREP</span><h2>What gets reused this week</h2></div><small>{rows.filter(x=>x.count>1).length} used more than once</small></header><div className="hm-week-reuse-days-v5">{days.map((d,i)=><b key={i}>{d}</b>)}</div><div className="hm-week-reuse-rows-v5">{rows.map((r,i)=><div key={r.id} style={{"--tone":r.component!.tone,"--delay":`${i*55}ms`} as React.CSSProperties}><span><i/><strong>{r.component!.code}</strong></span><em>{days.map((_,di)=><i key={di} className={r.days.includes(di)?"on":""}/>)}</em><small>{r.count}×</small></div>)}</div></section>
}

export function GroceryGap(){
 const h=useHousehold();
 const required=useMemo(()=>{const ids=new Set<string>();h.week.forEach(id=>getRecipe(id).ingredients.forEach(x=>ids.add(x.id)));return [...ids]},[h.week]);
 const missing=h.shoppingNeeds.length;const covered=h.kitchenReady?Math.max(0,required.length-missing):0;const pct=h.kitchenReady&&required.length?Math.round(covered/required.length*100):0;
 const next=h.shoppingNeeds.slice(0,3).map(x=>getIngredient(x.id)?.name).filter(Boolean);
 return <section className="hm-grocery-gap-v5"><div><span>THIS WEEK</span><h2>{h.kitchenReady?missing?`${missing} things still missing`:"Everything is covered":"Check the kitchen first"}</h2><p>{h.kitchenReady?(next.length?`Next up: ${next.join(" · ")}.`:"Nothing needs buying for the current plan."):"Once Fridge, Freezer and Pantry are checked, this becomes the real shopping gap."}</p></div><div className="hm-grocery-gap-meter-v5"><b>{h.kitchenReady?`${pct}%`:"—"}</b><span>already home</span><em><i style={{width:`${pct}%`}}/></em></div></section>
}
