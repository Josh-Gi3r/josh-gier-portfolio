"use client";
import Link from "next/link";
import type {CSSProperties,ReactNode} from "react";
import {feedback} from "@/lib/feedback";
import {getComponent,getRecipe,type CanonicalRecipe} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {nutritionFor} from "@/data/recipe-nutrition";
import {recipeAvailability} from "@/data/stock-math";
import {useSheet} from "@/lib/useSheet";
import {toneFor} from "@/lib/tones";
import {useHousehold} from "../HouseholdState";

/* ---------- v3 primitives ---------- */

export function SectionHead({title,action,className=""}:{title:ReactNode;action?:ReactNode;className?:string}){return <div className={`hm-sec ${className}`}><h2 className="hm-h2">{title}</h2>{action}</div>}

// Photo tile with the ink gradient shade; used for meals, bases and guides.
export function Tile({href,img,alt,title,sub,badge,badgeClass="",className="",style,children,onClick}:{href?:string;img?:string;alt?:string;title?:ReactNode;sub?:ReactNode;badge?:ReactNode;badgeClass?:string;className?:string;style?:CSSProperties;children?:ReactNode;onClick?:()=>void}){
 const body=<>{img?<img src={img} alt={alt??""} loading="lazy" decoding="async"/>:<div className="initial">{String(alt??title??"?").slice(0,1)}</div>}<div className="shade"/>{badge&&<span className={`badge ${badgeClass}`}>{badge}</span>}{(title||sub)&&<div className="copy">{title&&<strong>{title}</strong>}{sub&&<small>{sub}</small>}</div>}{children}</>;
 const cls=`hm-tile hm-lift ${className}`;
 return href?<Link href={href} className={cls} style={style} onClick={()=>{feedback("tap");onClick?.()}}>{body}</Link>:<div className={cls} style={style} onClick={onClick}>{body}</div>;
}

export function MealTile({recipe,href,badge,badgeClass,className,sub}:{recipe:CanonicalRecipe;href?:string;badge?:ReactNode;badgeClass?:string;className?:string;sub?:ReactNode}){
 const title=recipeTitle(recipe.id,recipe.title);
 return <Tile href={href??`/cook/${recipe.id}`} img={recipe.image} alt={title} title={title} sub={sub} badge={badge} badgeClass={badgeClass} className={className}/>;
}

// Bottom sheet: frosted white, 36px top radius, handle, title row.
export function Sheet({open,onClose,label,title,sub,action,children,className=""}:{open:boolean;onClose:()=>void;label:string;title?:ReactNode;sub?:ReactNode;action?:ReactNode;children:ReactNode;className?:string}){
 useSheet(open,onClose);
 if(!open)return null;
 return <div className="hm-sheet-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className={`hm-sheet ${className}`} role="dialog" aria-modal="true" aria-label={label}>
   <i className="hm-sheet-handle"/>
   {(title||action)&&<div className="hm-sheet-head">{title&&<h2>{title}</h2>}{action??<button onClick={onClose}>Close</button>}</div>}
   {sub&&<p className="hm-sheet-sub">{sub}</p>}
   {children}
  </section>
 </div>;
}

export function Avatar({who,size="",className=""}:{who:"josh"|"g";size?:""|"lg"|"sm";className?:string}){return <b className={`hm-avatar ${who==="josh"?"j":"g"} ${size} ${className}`} aria-hidden="true">{who==="josh"?"J":"G"}</b>}
export function Check({on,next=false,lg=false}:{on:boolean;next?:boolean;lg?:boolean}){return <span className={`hm-check ${on?"on":""} ${next?"next":""} ${lg?"lg":""}`} aria-hidden="true">{on?"✓":""}</span>}
export function Progress({pct,thin=false}:{pct:number;thin?:boolean}){return <div className={`hm-progress ${thin?"thin":""}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{width:`${Math.max(0,Math.min(100,pct))}%`}}/></div>}
export function Stat({v,k,tint}:{v:ReactNode;k:ReactNode;tint?:string}){return <div className="hm-stat" style={tint?{"--tint":tint} as CSSProperties:undefined}><b>{v}</b><span>{k}</span></div>}
export function RoundBack({href,onPhoto=false,label="Back"}:{href:string;onPhoto?:boolean;label?:string}){return <Link href={href} className={`hm-round ${onPhoto?"onphoto":""}`} aria-label={label} onClick={()=>feedback("tap")}>‹</Link>}
export function Toast({text}:{text:string}){return <div className="hm-toast" role="status">{text}</div>}
export function PrepDots({recipe}:{recipe:CanonicalRecipe}){return <>{recipe.prep.map(p=><i key={p.id} className="hm-dot" style={{"--tone":toneFor(p.id)} as CSSProperties} title={getComponent(p.id)?.code}/>)}</>}

// "18 min · 610 kcal"
export function mealMeta(recipe:CanonicalRecipe){const n=nutritionFor(recipe.id);return n?`${recipe.minutes} min · ${n.kcal} kcal`:`${recipe.minutes} min · ${recipe.cuisine}`}

export type Readiness={state:"ready"|"missing"|"unknown";label:string;missing:number;pillClass:string};
export function useReadiness(){
 const h=useHousehold();
 return (recipe:CanonicalRecipe|string):Readiness=>{
  const r=typeof recipe==="string"?getRecipe(recipe):recipe;
  if(!h.kitchenReady)return {state:"unknown",label:"Kitchen not checked",missing:0,pillClass:"neutral"};
  const a=recipeAvailability(r.id,h.componentStock,h.ingredientStock);const missing=a.missingPrep.length+a.missingIngredients.length;
  return a.ready?{state:"ready",label:"We have it all",missing:0,pillClass:""}:{state:"missing",label:`Missing ${missing}`,missing,pillClass:"peach"};
 };
}
export function ReadyPill({recipe}:{recipe:CanonicalRecipe}){const ready=useReadiness()(recipe);return <span className={`hm-pill ${ready.pillClass}`}><i/>{ready.label}</span>}

/* ---------- legacy primitives (routes not yet rebuilt) ---------- */

export function PageHead({eyebrow,title,sub,action}:{eyebrow?:string;title:string;sub?:string;action?:ReactNode}){return <header className="hm-page-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</header>}
export function LegacySectionHead({title,eyebrow,action}:{title:string;eyebrow?:string;action?:ReactNode}){return <header className="hm-section-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>{action}</header>}
export function Back({href,label="Back"}:{href:string;label?:string}){return <Link className="hm-back-v5" href={href} onClick={()=>feedback("tap")}>‹ <span>{label}</span></Link>}
export function ComponentPill({id,amountMl}:{id:string;amountMl?:number}){const c=getComponent(id);if(!c)return null;return <span className="hm-component-pill-v5" style={{"--tone":toneFor(id)} as CSSProperties}><i/>{c.code}{amountMl?` · ${amountMl} ml`:""}</span>}
export function RatingLine({recipeId}:{recipeId:string}){const h=useHousehold();const r=h.ratings[recipeId];if(!r?.josh&&!r?.g)return null;return <span className="hm-rating-line-v5">{r.josh?`Josh ${r.josh}★`:"Josh —"}<b>·</b>{r.g?`G ${r.g}★`:"G —"}</span>}
export function MealCard({recipe,compact=false,day}:{recipe:CanonicalRecipe;compact?:boolean;day?:string}){const h=useHousehold();const title=recipeTitle(recipe.id,recipe.title);const personalPhoto=h.mealPhotos.find(x=>x.mealId===recipe.id);const version=h.recipeVersions[recipe.id]?.[0]?.number??1;const ours=!!personalPhoto||version>1||h.history.some(x=>x.mealId===recipe.id);const image=personalPhoto?.dataUrl??recipe.image;return <Link href={`/cook/${recipe.id}`} className={`hm-meal-card-v5 ${compact?"compact":""} ${personalPhoto?"has-our-photo-v40":""}`} onClick={()=>feedback("tap")}>{image?<img src={image} alt={personalPhoto?`${title} we cooked`:title} width={320} height={240} loading="lazy" decoding="async"/>:<div className="hm-photo-placeholder-v5">{title.slice(0,1)}</div>}{ours&&<em className="hm-meal-card-ours-v40">OUR v{version}{personalPhoto?" · PHOTO":""}</em>}<div className="hm-meal-card-copy-v5">{day&&<span>{day}</span>}<strong>{title}</strong><small>{recipe.minutes} min · {recipe.cuisine}</small><RatingLine recipeId={recipe.id}/></div></Link>}
export function RecipeReady({recipe}:{recipe:CanonicalRecipe}){const h=useHousehold();if(!h.kitchenReady)return <span className="hm-ready-v5 unknown">Kitchen not checked</span>;const a=recipeAvailability(recipe.id,h.componentStock,h.ingredientStock);return <span className={`hm-ready-v5 ${a.ready?"ready":"missing"}`}>{a.ready?"We have it":"Missing a few things"}</span>}
export function formatQty(qty:number,unit:string){if(unit==="have")return "check pantry";if(unit==="portion")return `${trim(qty)} ${qty===1?"portion":"portions"}`;if(unit==="count")return trim(qty);if(unit==="g"&&qty>=1000)return `${trim(qty/1000)} kg`;if(unit==="ml"&&qty>=1000)return `${trim(qty/1000)} L`;return `${trim(qty)} ${unit}`}
function trim(n:number){return Number.isInteger(n)?String(n):String(Math.round(n*10)/10)}
export function recipeFor(id:string){return getRecipe(id)}
