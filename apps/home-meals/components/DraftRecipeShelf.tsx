"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

type DraftStatus="idea"|"draft"|"cooked"|"revised"|"household_approved";
type Draft={id:string;title:string;status:DraftStatus;updated_at:string};
const labels:Record<DraftStatus,string>={idea:"Idea",draft:"Working draft",cooked:"Cooked once",revised:"Revised",household_approved:"One of ours"};

export function DraftRecipeShelf(){
 const[drafts,setDrafts]=useState<Draft[]>([]);
 useEffect(()=>{
  let live=true;
  const refresh=()=>fetch("/api/recipe-drafts",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>{if(live)setDrafts((x?.drafts??[]).slice(0,8))}).catch(()=>{});
  refresh();window.addEventListener("home-meals:drafts-changed",refresh);
  return()=>{live=false;window.removeEventListener("home-meals:drafts-changed",refresh)};
 },[]);
 if(!drafts.length)return null;
 return <section className="hm-draft-shelf" aria-label="Our working recipes"><div className="hm-draft-shelf-head"><strong>Our working recipes</strong><small>Ideas we’re shaping together</small></div><div className="hm-draft-shelf-list">{drafts.map(d=><Link className="hm-draft-shelf-card" href={"/cook/drafts/"+encodeURIComponent(d.id)} key={d.id}><span><strong>{d.title}</strong><small>{labels[d.status]}</small></span><span>Open ›</span></Link>)}</div></section>;
}
