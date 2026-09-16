"use client";
import Link from "next/link";
import {useMemo} from "react";
import {getRecipe,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {useHousehold} from "./HouseholdState";
import {MealTile,SectionHead,Stat} from "./app/Primitives";

// What Home has learned from us: only things Josh or G actually cooked, rated or changed.
export function HouseholdMemory(){
 const h=useHousehold();
 const memory=useMemo(()=>{
  const cookedIds=[...new Set(h.history.map(x=>x.mealId))];
  const loved=recipes.filter(r=>(h.ratings[r.id]?.josh??0)>=4&&(h.ratings[r.id]?.g??0)>=4).sort((a,b)=>Math.min(h.ratings[b.id]?.josh??0,h.ratings[b.id]?.g??0)-Math.min(h.ratings[a.id]?.josh??0,h.ratings[a.id]?.g??0)).slice(0,6);
  const split=recipes.filter(r=>{const j=h.ratings[r.id]?.josh,g=h.ratings[r.id]?.g;return j!=null&&g!=null&&Math.abs(j-g)>=2}).slice(0,3);
  const versions=Object.values(h.recipeVersions).reduce((n,list)=>n+list.length,0);
  const notes=Object.entries(h.recipeNotes).flatMap(([id,list])=>list.map(n=>({id,...n}))).sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime()).slice(0,4);
  return {cookedIds,loved,split,versions,notes};
 },[h.history,h.ratings,h.recipeVersions,h.recipeNotes]);
 const empty=!h.history.length&&!memory.notes.length&&!Object.values(h.favourites).some(Boolean);
 return <section id="memory" aria-label="Our history">
  <SectionHead title="Our history" action={<Link href="/cook">Recipes ›</Link>}/>
  {empty?<div className="hm-empty"><strong>Nothing here yet.</strong>Cook something, rate it, and leave a note if there’s anything worth remembering.<br/><Link href="/cook">Choose dinner ›</Link></div>:<>
   <div className="hm-stats" style={{marginTop:14}}><Stat v={h.history.length} k="dinners logged"/><Stat v={memory.cookedIds.length} k="recipes cooked" tint="var(--tint-peach)"/><Stat v={memory.versions} k="recipe changes" tint="var(--tint-sky)"/></div>
   {memory.loved.length>0&&<><SectionHead title="Both loved" action={<span className="muted">both gave 4★ or better</span>}/><div className="hm-rail">{memory.loved.map(r=><MealTile key={r.id} recipe={r} sub={`J ${h.ratings[r.id]?.josh}★ · G ${h.ratings[r.id]?.g}★`}/>)}</div></>}
   {memory.split.length>0&&<><SectionHead title="We disagree on these"/><div className="hm-memory-lines">{memory.split.map(r=><Link key={r.id} href={`/cook/${r.id}`} className="hm-card hm-lift"><strong>{recipeTitle(r.id,r.title)}</strong><small>Josh {h.ratings[r.id]?.josh}★ · G {h.ratings[r.id]?.g}★</small></Link>)}</div></>}
   {memory.notes.length>0&&<><SectionHead title="Recent notes"/><div className="hm-memory-lines">{memory.notes.map((n,i)=>{const r=getRecipe(n.id);return <Link key={`${n.id}-${n.at}-${i}`} href={`/cook/${n.id}`} className="hm-card hm-lift"><small>{n.author==="josh"?"Josh":n.author==="g"?"G":"Home"} · {recipeTitle(r.id,r.title)}</small><p>“{n.text}”</p></Link>})}</div></>}
  </>}
 </section>;
}
