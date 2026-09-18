"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type FormEvent,type ReactNode} from "react";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {mealHistorySummaryV7} from "@/data/meal-history-v7";
import {recipeTitle} from "@/data/recipe-display";
import {kcalReferenceForV3} from "@/data/recipe-kcal-reference-v3";
import {getComponent} from "@/data/home-data";
import type {CardContext,ResponseType,TruthLevel} from "@/lib/josh-conversation";
import {useHousehold} from "./HouseholdState";
import {Icon} from "./Icons";
import {JoshPresenceAnchor} from "./JoshPresence";
import {Waves} from "./app/Orb";
import {useReadiness} from "./app/Primitives";

export type AskSection={title:string|null;items:{label:string;detail:string|null;state:string|null;href:string|null}[]};
export type AskRecipeDraft={title:string;servings:number|null;ingredients:{name:string;quantity:number|null;unit:string|null}[];method:string[];notes:string[]};
export type AskMessage={who:"you"|"home";text:string;responseType?:ResponseType;truthLevel?:TruthLevel;cardContext?:CardContext;sections?:AskSection[];recipeDraft?:AskRecipeDraft|null;mealIds?:string[];tags?:string[];href?:string|null;action?:string|null;extra?:ReactNode};
type Quick={label:string;text:string};

function qty(q:number|null,u:string|null){if(q==null)return"";return `${Number.isInteger(q)?q:Math.round(q*10)/10}${u?` ${u}`:""}`}

// Full-screen Ask Josh. Josh is the single visible assistant presence; semantic answers render as product UI instead of Markdown walls.
export function AskHomeView({messages,q,setQ,onSend,onClose,cameraHref,quick,loading=false,status="Ask Josh",scrollSignal=""}:{messages:AskMessage[];q:string;setQ:(v:string)=>void;onSend:(text?:string)=>void;onClose:()=>void;cameraHref:string;quick:Quick[];loading?:boolean;status?:string;scrollSignal?:string}){
 const[dismissed,setDismissed]=useState<Record<string,boolean>>({}),scrollRef=useRef<HTMLDivElement|null>(null),h=useHousehold(),ready=useReadiness();
 const history=useMemo(()=>mealHistorySummaryV7({history:h.history,favourites:h.favourites,ratings:h.ratings}),[h.history,h.favourites,h.ratings]);
 useEffect(()=>{const id=window.requestAnimationFrame(()=>{const el=scrollRef.current;if(el)el.scrollTop=el.scrollHeight});return()=>window.cancelAnimationFrame(id)},[messages.length,loading,scrollSignal]);
 const conversation=messages.some(m=>m.who==="you");
 const submit=(e:FormEvent)=>{e.preventDefault();onSend()};
 const showGuide=()=>{onClose();window.setTimeout(()=>window.dispatchEvent(new Event("home-meals:guide")),90)};
 const metaFor=(m:AskMessage,id:string)=>{const r=getLiveRecipeV7(id);if(!r)return"";const context=m.cardContext??"default";if(context==="prep"){const codes=prepForRecipeAtCookScaleV7(id).map(x=>getComponent(x.componentId)?.code).filter(Boolean);return codes.length?codes.join(" + "):"No make-ahead prep"}if(context==="readiness")return ready(r).label;if(context==="recency"){const ago=history.recipes[id]?.daysSince;return ago==null?"Not cooked yet":ago===0?"Cooked today":ago===1?"Cooked yesterday":`${ago} days since last`}if(context==="ratings"){const j=h.ratings[id]?.josh??0,g=h.ratings[id]?.g??0;return `${j?`Josh ${j}★`:"Josh -"} · ${g?`G ${g}★`:"G -"}`}if(context==="nutrition"){const n=kcalReferenceForV3(id);return n?`~${n.kcalPerPerson} kcal/person`:"Nutrition not calibrated"}if(context==="planning"){const prep=prepForRecipeAtCookScaleV7(id).map(x=>getComponent(x.componentId)?.code).filter(Boolean).slice(0,2);return `${r.cuisine}${prep.length?` · ${prep.join(" + ")}`:""}`}return `${r.minutes} min · ${r.cuisine}`};
 return <div className="hm-ask" role="presentation">
  <section className="hm-ask-inner" role="dialog" aria-modal="true" aria-label="Ask Josh">
   <div className="hm-ask-top">
    <button className="hm-round" onClick={onClose} aria-label="Close Ask Josh" data-ask-close>×</button>
    <span>{status}</span>
    <Link href={cameraHref} className="hm-round green" aria-label="Show Josh with camera" onClick={onClose}><Icon name="camera" size={20}/></Link>
   </div>
   <div className={`hm-ask-stage ${conversation?"conversation":""}`}><JoshPresenceAnchor priority={80} expression={loading?"thinking":conversation?"talk":"affectionate"} size={conversation?72:132} observeVisibility={false}/></div>
   <div className="hm-ask-scroll" aria-live="polite" ref={scrollRef}>
    {messages.map((m,i)=>{
     if(m.who==="you")return <div key={i} className="hm-ask-msg you"><div>{m.text}</div></div>;
     const picks=(m.mealIds??[]).filter(id=>!dismissed[`${i}:${id}`]).slice(0,4),offCatalog=m.truthLevel==="general_culinary"||m.truthLevel==="household_draft";
     return <div key={i} className={`hm-ask-block type-${m.responseType??"short_answer"}`}>
      <div className="hm-ask-msg home"><div className="hm-bubble">
       {offCatalog&&<div className="hm-ask-truth">{m.truthLevel==="household_draft"?"WORKING DRAFT":"NOT SAVED IN HOME YET"}</div>}
       {m.text&&<div className="hm-ask-lead">{m.text}</div>}
       {!!m.sections?.length&&<div className="hm-ask-sections">{m.sections.map((section,s)=><section key={s} className="hm-ask-section">{section.title&&<h3>{section.title}</h3>}<div>{section.items.map((item,j)=>item.href?<Link key={j} href={item.href} onClick={onClose} className="hm-ask-section-row"><span><b>{item.label}</b>{item.detail&&<small>{item.detail}</small>}</span>{item.state&&<em>{item.state}</em>}<strong>›</strong></Link>:<div key={j} className="hm-ask-section-row"><span><b>{item.label}</b>{item.detail&&<small>{item.detail}</small>}</span>{item.state&&<em>{item.state}</em>}</div>)}</div></section>)}</div>}
       {m.recipeDraft&&<div className="hm-ask-draft"><span className="hm-kicker">WORKING RECIPE</span><h3>{m.recipeDraft.title}</h3>{m.recipeDraft.servings&&<small>Makes {m.recipeDraft.servings} servings</small>}<div className="hm-ask-draft-grid"><section><b>What goes in</b>{m.recipeDraft.ingredients.slice(0,12).map((x,j)=><div key={j}><span>{x.name}</span><strong>{qty(x.quantity,x.unit)}</strong></div>)}</section><section><b>First pass</b>{m.recipeDraft.method.slice(0,6).map((x,j)=><p key={j}><i>{j+1}</i>{x}</p>)}</section></div>{m.recipeDraft.notes.length>0&&<div className="hm-ask-draft-notes">{m.recipeDraft.notes.slice(0,4).map((x,j)=><span key={j}>{x}</span>)}</div>}</div>}
       {m.tags&&m.tags.length>0&&<div className="hm-ask-tags">{m.tags.filter(Boolean).map(t=><span key={t}>{t}</span>)}</div>}
       {m.extra}
       {m.href&&m.action&&<Link className="hm-ask-action" href={m.href} onClick={onClose}>{m.action} →</Link>}
      </div></div>
      {picks.length>0&&<div className="hm-ask-picks" style={{marginTop:12}}>{picks.map(id=>{const r=getLiveRecipeV7(id);if(!r)return null;const title=recipeTitle(r.id,r.title);return <div key={id} className="hm-tile">{r.image&&<img src={r.image} alt={title} loading="lazy"/>}<div className="shade deep"/><div className="copy"><strong>{title}</strong><small>{metaFor(m,id)}</small><div className="acts"><Link className="yes" href={`/cook/${id}`} onClick={onClose}>Open</Link><button className="nah" onClick={()=>setDismissed(v=>({...v,[`${i}:${id}`]:true}))}>Skip</button></div></div></div>})}</div>}
     </div>;
    })}
    {loading&&<div className="hm-ask-msg home"><div className="hm-bubble hm-ask-typing"><i/><i/><i/></div></div>}
   </div>
   <div className="hm-ask-foot">
    <div className={`hm-ask-chips ${conversation?"":"center"}`}><button className="hm-chip sm" onClick={showGuide}>Show me around</button>{quick.map(c=><button key={c.text} className="hm-chip sm" onClick={()=>onSend(c.text)}>{c.label}</button>)}</div>
    <form className="hm-ask-composer" data-ask-composer onSubmit={submit}>
     <Link href={cameraHref} className="cam" aria-label="Show Josh with camera" onClick={onClose}><Icon name="camera" size={20}/></Link>
     <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask Josh…" aria-label="Ask Josh" autoFocus enterKeyHint="send"/>
     {q.trim()?<button className="send" aria-label="Send" disabled={loading}>↑</button>:<button type="button" className="send listening" aria-label="Talk to Josh"><Waves white/></button>}
    </form>
   </div>
  </section>
 </div>;
}
