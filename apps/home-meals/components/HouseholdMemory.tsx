"use client";
import Link from "next/link";
import {useMemo} from "react";
import {getRecipe,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {useHousehold} from "./HouseholdState";
import styles from "./HouseholdMemory.module.css";

export function HouseholdMemory(){
 const h=useHousehold();
 const memory=useMemo(()=>{
  const cookedIds=[...new Set(h.history.map(x=>x.mealId))];
  const loved=recipes.filter(r=>(h.ratings[r.id]?.josh??0)>=4&&(h.ratings[r.id]?.g??0)>=4).sort((a,b)=>Math.min(h.ratings[b.id]?.josh??0,h.ratings[b.id]?.g??0)-Math.min(h.ratings[a.id]?.josh??0,h.ratings[a.id]?.g??0)).slice(0,4);
  const split=recipes.filter(r=>{const j=h.ratings[r.id]?.josh,g=h.ratings[r.id]?.g;return j!=null&&g!=null&&Math.abs(j-g)>=2}).sort((a,b)=>Math.abs((h.ratings[b.id]?.josh??0)-(h.ratings[b.id]?.g??0))-Math.abs((h.ratings[a.id]?.josh??0)-(h.ratings[a.id]?.g??0))).slice(0,3);
  const recent=h.history.filter(x=>Date.now()-new Date(x.at).getTime()<14*86400000).slice(0,6);
  const versions=Object.values(h.recipeVersions).reduce((n,list)=>n+list.length,0);
  const notes=Object.entries(h.recipeNotes).flatMap(([id,list])=>list.map(n=>({id,...n}))).sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime()).slice(0,4);
  return {cookedIds,loved,split,recent,versions,notes};
 },[h.history,h.ratings,h.recipeVersions,h.recipeNotes]);
 if(!h.history.length&&!memory.notes.length&&!Object.values(h.favourites).some(Boolean))return <section className={styles.empty}><span>OUR MEMORY</span><h2>Nothing to learn from yet.</h2><p>Cook, rate and leave a note. Home will keep the useful parts here.</p><Link href="/cook">Choose dinner →</Link></section>;
 return <section className={styles.wrap} aria-label="What Home Meals remembers"><header><span>OUR MEMORY</span><h2>What Home has learned from us</h2><p>Only things Josh or G actually cooked, rated, favourited or changed.</p></header><div className={styles.stats}><div><b>{h.history.length}</b><small>dinners logged</small></div><div><b>{memory.cookedIds.length}</b><small>recipes cooked</small></div><div><b>{memory.versions}</b><small>recipe changes</small></div></div>{memory.loved.length>0&&<div className={styles.group}><strong>Both loved</strong><div className={styles.meals}>{memory.loved.map(r=><Link href={`/cook/${r.id}`} key={r.id}>{r.image?<img src={r.image} alt={recipeTitle(r.id,r.title)}/>:<i/>}<span><b>{recipeTitle(r.id,r.title)}</b><small>J {h.ratings[r.id]?.josh}★ · G {h.ratings[r.id]?.g}★</small></span></Link>)}</div></div>}{memory.split.length>0&&<div className={styles.group}><strong>We disagree on these</strong><div className={styles.lines}>{memory.split.map(r=><Link href={`/cook/${r.id}`} key={r.id}><span>{recipeTitle(r.id,r.title)}</span><small>Josh {h.ratings[r.id]?.josh}★ · G {h.ratings[r.id]?.g}★</small></Link>)}</div></div>}{memory.notes.length>0&&<div className={styles.group}><strong>Recent notes</strong><div className={styles.notes}>{memory.notes.map((n,i)=>{const r=getRecipe(n.id);return <Link href={`/cook/${n.id}`} key={`${n.id}-${n.at}-${i}`}><span>{n.author==="josh"?"Josh":n.author==="g"?"G":"Home"} · {recipeTitle(r.id,r.title)}</span><p>“{n.text}”</p></Link>})}</div></div>}{memory.recent.length>0&&<p className={styles.cooldown}>{memory.recent.length} recent dinner{memory.recent.length===1?"":"s"} are currently down-ranked when Home builds a new week.</p>}</section>;
}
