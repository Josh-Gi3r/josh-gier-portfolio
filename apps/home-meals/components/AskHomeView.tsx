"use client";
import Link from "next/link";
import {useState,type FormEvent,type ReactNode} from "react";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {recipeTitle} from "@/data/recipe-display";
import {kcalReferenceForV3} from "@/data/recipe-kcal-reference-v3";
import {Icon} from "./Icons";
import {Orb,Waves} from "./app/Orb";

export type AskMessage={who:"you"|"home";text:string;mealIds?:string[];tags?:string[];href?:string|null;action?:string|null;extra?:ReactNode};
type Quick={label:string;text:string};

// Full-screen Ask Home. Shared by the on-device answers (Shell) and the household-brain runtime.
// Home talks first, big orb while nothing has been said, then the conversation with photo picks.
export function AskHomeView({messages,q,setQ,onSend,onClose,cameraHref,quick,loading=false,status="Ask Home"}:{messages:AskMessage[];q:string;setQ:(v:string)=>void;onSend:(text?:string)=>void;onClose:()=>void;cameraHref:string;quick:Quick[];loading?:boolean;status?:string}){
 const[dismissed,setDismissed]=useState<Record<string,boolean>>({});
 const conversation=messages.some(m=>m.who==="you");
 const submit=(e:FormEvent)=>{e.preventDefault();onSend()};
 const showGuide=()=>{onClose();window.setTimeout(()=>window.dispatchEvent(new Event("home-meals:guide")),90)};
 return <div className="hm-ask" role="presentation">
  <section className="hm-ask-inner" role="dialog" aria-modal="true" aria-label="Ask Home">
   <div className="hm-ask-top">
    <button className="hm-round" onClick={onClose} aria-label="Close Ask Home" data-ask-close>×</button>
    <span>{status}</span>
    <Link href={cameraHref} className="hm-round green" aria-label="Show Home with camera" onClick={onClose}><Icon name="camera" size={20}/></Link>
   </div>
   <div className="hm-ask-stage"><Orb size={conversation?96:164} label="Home"/></div>
   <div className="hm-ask-scroll" aria-live="polite">
    {messages.map((m,i)=>{
     if(m.who==="you")return <div key={i} className="hm-ask-msg you"><div>{m.text}</div></div>;
     const picks=(m.mealIds??[]).filter(id=>!dismissed[`${i}:${id}`]).slice(0,4);
     return <div key={i} className="hm-ask-block">
      <div className="hm-ask-msg home"><Orb size={36}/><div className="hm-bubble">{m.text}
       {m.tags&&m.tags.length>0&&<div className="hm-ask-tags">{m.tags.filter(Boolean).map(t=><span key={t}>{t}</span>)}</div>}
       {m.extra}
       {m.href&&m.action&&<Link className="hm-ask-action" href={m.href} onClick={onClose}>{m.action} →</Link>}
      </div></div>
      {picks.length>0&&<div className="hm-ask-picks" style={{marginTop:12}}>{picks.map(id=>{const r=getLiveRecipeV7(id);if(!r)return null;const title=recipeTitle(r.id,r.title),n=kcalReferenceForV3(r.id);return <div key={id} className="hm-tile">{r.image&&<img src={r.image} alt={title} loading="lazy"/>}<div className="shade deep"/><div className="copy"><strong>{title}</strong><small>{r.minutes} min{n?` · ~${n.kcalPerPerson} kcal/person`:""}</small><div className="acts"><Link className="yes" href={`/cook/${id}`} onClick={onClose}>Yes</Link><button className="nah" onClick={()=>setDismissed(v=>({...v,[`${i}:${id}`]:true}))}>Nah</button></div></div></div>})}</div>}
     </div>;
    })}
    {loading&&<div className="hm-ask-msg home"><Orb size={36}/><div className="hm-bubble hm-ask-typing"><i/><i/><i/></div></div>}
   </div>
   <div className="hm-ask-foot">
    <div className={`hm-ask-chips ${conversation?"":"center"}`}><button className="hm-chip sm" onClick={showGuide}>Show me around</button>{quick.map(c=><button key={c.text} className="hm-chip sm" onClick={()=>onSend(c.text)}>{c.label}</button>)}</div>
    <form className="hm-ask-composer" data-ask-composer onSubmit={submit}>
     <Link href={cameraHref} className="cam" aria-label="Show Home with camera" onClick={onClose}><Icon name="camera" size={20}/></Link>
     <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Or type it…" aria-label="Ask Home" autoFocus enterKeyHint="send"/>
     {q.trim()?<button className="send" aria-label="Send" disabled={loading}>↑</button>:<button type="button" className="send listening" aria-label="Talk to Home"><Waves white/></button>}
    </form>
   </div>
  </section>
 </div>;
}
