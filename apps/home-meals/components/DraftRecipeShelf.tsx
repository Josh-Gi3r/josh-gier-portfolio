"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

type DraftStatus="idea"|"draft"|"cooked"|"revised"|"household_approved";
type Draft={id:string;title:string;status:DraftStatus;updated_at:string;hero:string|null};
const labels:Record<DraftStatus,string>={idea:"Idea",draft:"Working draft",cooked:"Cooked once",revised:"Revised",household_approved:"One of ours"};

export function DraftRecipeShelf(){
 const[drafts,setDrafts]=useState<Draft[]>([]);
 useEffect(()=>{
  let live=true;
  const refresh=()=>fetch("/api/recipe-drafts",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(async x=>{const base=(x?.drafts??[]).slice(0,8);const rows=await Promise.all(base.map(async(d:any)=>{try{const im=await fetch(`/api/recipe-image?draftId=${encodeURIComponent(d.id)}`,{cache:"no-store"}).then(r=>r.ok?r.json():null);return{...d,hero:im?.selected?.url??null}}catch{return{...d,hero:null}}}));if(live)setDrafts(rows)}).catch(()=>{});
  refresh();const changed=()=>refresh();window.addEventListener("home-meals:drafts-changed",changed);window.addEventListener("home-meals:recipe-image-changed",changed);
  return()=>{live=false;window.removeEventListener("home-meals:drafts-changed",changed);window.removeEventListener("home-meals:recipe-image-changed",changed)};
 },[]);
 if(!drafts.length)return null;
 return <section className="hm-draft-shelf" aria-label="Our working recipes"><div className="hm-draft-shelf-head"><strong>Our working recipes</strong><small>Ideas we’re shaping together</small></div><div className="hm-draft-shelf-list">{drafts.map(d=><Link className={`hm-draft-shelf-card ${d.hero?"with-image":""}`} href={"/cook/drafts/"+encodeURIComponent(d.id)} key={d.id}>{d.hero?<div className="hm-draft-shelf-thumb"><img src={d.hero} alt={d.title+" generated recipe illustration"}/></div>:<div className="hm-draft-shelf-thumb empty"><span>✦</span></div>}<span className="hm-draft-shelf-copy"><strong>{d.title}</strong><small>{labels[d.status]}</small><em>Open ›</em></span></Link>)}</div></section>;
}
