"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {JoshStyle,MemoryKind} from "@/lib/josh-conversation";
import {feedback} from "@/lib/feedback";

const STYLE_KEY="home-meals-josh-style-v1";
type Memory={id:string;subject:string;kind:MemoryKind;text:string;source_person:"josh"|"g"|null;updated_at:string};
type Draft={id:string;title:string;status:"idea"|"draft"|"cooked"|"revised"|"household_approved";payload:Record<string,unknown>;updated_at:string};
const styles:readonly {id:JoshStyle;label:string;sub:string}[]=[
 {id:"normal",label:"Normal",sub:"Casual and useful"},
 {id:"shorter",label:"Shorter",sub:"Get to it faster"},
 {id:"chatty",label:"More chatty",sub:"A little more conversation"}
];
const memoryLabels:Record<MemoryKind,string>={preference:"Preference",household_fact:"Home fact",recipe_project:"Recipe project",conversation_summary:"Conversation"};
const draftLabels:Record<Draft["status"],string>={idea:"Idea",draft:"Draft",cooked:"Cooked once",revised:"Revised",household_approved:"One of ours"};
function readStyle():JoshStyle{try{const v=localStorage.getItem(STYLE_KEY);return v==="shorter"||v==="chatty"?v:"normal"}catch{return"normal"}}

export function JoshMemorySettings(){
 const[style,setStyle]=useState<JoshStyle>("normal"),[memories,setMemories]=useState<Memory[]>([]),[drafts,setDrafts]=useState<Draft[]>([]),[memoryConfigured,setMemoryConfigured]=useState(false),[loading,setLoading]=useState(true),[openMemories,setOpenMemories]=useState(false),[openDrafts,setOpenDrafts]=useState(false);
 const refresh=()=>{setLoading(true);Promise.all([fetch("/api/memory",{cache:"no-store"}).then(r=>r.ok?r.json():null),fetch("/api/recipe-drafts",{cache:"no-store"}).then(r=>r.ok?r.json():null)]).then(([m,d])=>{setMemoryConfigured(!!m?.configured);setMemories(m?.memories??[]);setDrafts(d?.drafts??[])}).catch(()=>{}).finally(()=>setLoading(false))};
 useEffect(()=>{setStyle(readStyle());refresh();const handler=()=>refresh();window.addEventListener("home-meals:drafts-changed",handler);return()=>window.removeEventListener("home-meals:drafts-changed",handler)},[]);
 const choose=(next:JoshStyle)=>{setStyle(next);try{localStorage.setItem(STYLE_KEY,next)}catch{}window.dispatchEvent(new Event("home-meals:josh-style"));feedback("tap")};
 const forget=async(id:string)=>{const res=await fetch(`/api/memory?id=${encodeURIComponent(id)}`,{method:"DELETE"});if(res.ok){setMemories(v=>v.filter(x=>x.id!==id));feedback("success")}};
 return <section className="hm-josh-settings hm-gut" aria-label="Josh settings">
  <div className="hm-card lg hm-josh-style-card"><div><span className="hm-kicker">JOSH'S VIBE</span><h2>How much should I say?</h2><p>Same brain and household memory. Just a different amount of chat.</p></div><div className="hm-josh-style-options">{styles.map(s=><button key={s.id} className={style===s.id?"on":""} aria-pressed={style===s.id} onClick={()=>choose(s.id)}><strong>{s.label}</strong><small>{s.sub}</small></button>)}</div></div>
  <div className="hm-card lg hm-josh-memory-card"><button className="hm-josh-memory-head" onClick={()=>setOpenMemories(v=>!v)} aria-expanded={openMemories}><span><span className="hm-kicker">MEMORY</span><strong>Things I remember</strong><small>{loading?"Checking…":!memoryConfigured?"Memory isn't available on this server yet.":memories.length?`${memories.length} useful ${memories.length===1?"thing":"things"} saved for later.`:"Nothing saved yet. I’ll ask before keeping a preference or household fact."}</small></span><b>{openMemories?"−":"+"}</b></button>{openMemories&&memoryConfigured&&<div className="hm-josh-memory-list">{memories.length?memories.map(m=><div key={m.id}><span><em>{memoryLabels[m.kind]}{m.source_person?` · ${m.source_person==="g"?"G":"Josh"}`:""}</em><strong>{m.subject}</strong><small>{m.text}</small></span><button onClick={()=>void forget(m.id)} aria-label={`Forget ${m.subject}`}>Forget</button></div>):<p>I haven't saved anything yet. Chat normally. If something sounds useful later, I'll offer to remember it.</p>}</div>}</div>
  <div className="hm-card lg hm-josh-memory-card"><button className="hm-josh-memory-head" onClick={()=>setOpenDrafts(v=>!v)} aria-expanded={openDrafts}><span><span className="hm-kicker">OUR RECIPE IDEAS</span><strong>Working recipes</strong><small>{loading?"Checking…":drafts.length?`${drafts.length} ${drafts.length===1?"recipe":"recipes"} we're still shaping.`:"Nothing in drafts yet. Ask me about a dish that isn't in Home and we can build one."}</small></span><b>{openDrafts?"−":"+"}</b></button>{openDrafts&&<div className="hm-josh-memory-list drafts">{drafts.length?drafts.map(d=><div key={d.id}><span><em>{draftLabels[d.status]}</em><strong>{d.title}</strong><small>{d.status==="household_approved"?"We chose to keep this one.":"Saved from a Josh conversation. It stays a draft until we deliberately make it one of ours."}</small></span><Link className="hm-josh-memory-open" href={"/cook/drafts/"+encodeURIComponent(d.id)}>Open</Link></div>):<p>No working recipes yet.</p>}</div>}</div>
 </section>;
}
