"use client";
import Link from "next/link";
import type {CSSProperties,ReactNode} from "react";
import {feedback} from "@/lib/feedback";
import {getComponent,type CanonicalRecipe} from "@/data/home-data";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
import {prepForRecipeAtCookScaleV7} from "@/data/food-engine-v7";
import {recipeTitle} from "@/data/recipe-display";
import {recipeAvailabilityV7} from "@/data/stock-math-v7";
import {useSheet} from "@/lib/useSheet";
import {toneFor} from "@/lib/tones";
import {useHousehold} from "../HouseholdState";

export function SectionHead({title,action,className=""}:{title:ReactNode;action?:ReactNode;className?:string}){return <div className={`hm-sec ${className}`}><h2 className="hm-h2">{title}</h2>{action}</div>}
export function Tile({href,img,alt,title,sub,badge,badgeClass="",className="",style,children,onClick}:{href?:string;img?:string;alt?:string;title?:ReactNode;sub?:ReactNode;badge?:ReactNode;badgeClass?:string;className?:string;style?:CSSProperties;children?:ReactNode;onClick?:()=>void}){const body=<>{img?<img src={img} alt={alt??""} loading="lazy" decoding="async"/>:<div className="initial">{String(alt??title??"?").slice(0,1)}</div>}<div className="shade"/>{badge&&<span className={`badge ${badgeClass}`}>{badge}</span>}{(title||sub)&&<div className="copy">{title&&<strong>{title}</strong>}{sub&&<small>{sub}</small>}</div>}{children}</>;const cls=`hm-tile hm-lift ${className}`;return href?<Link href={href} className={cls} style={style} onClick={()=>{feedback("tap");onClick?.()}}>{body}</Link>:<div className={cls} style={style} onClick={onClick}>{body}</div>}
export function MealTile({recipe,href,badge,badgeClass,className,sub}:{recipe:CanonicalRecipe;href?:string;badge?:ReactNode;badgeClass?:string;className?:string;sub?:ReactNode}){const title=recipeTitle(recipe.id,recipe.title);return <Tile href={href??`/cook/${recipe.id}`} img={recipe.image} alt={title} title={title} sub={sub} badge={badge} badgeClass={badgeClass} className={className}/>}
export function Sheet({open,onClose,label,title,sub,action,children,className=""}:{open:boolean;onClose:()=>void;label:string;title?:ReactNode;sub?:ReactNode;action?:ReactNode;children:ReactNode;className?:string}){useSheet(open,onClose);if(!open)return null;return <div className="hm-sheet-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className={`hm-sheet ${className}`} role="dialog" aria-modal="true" aria-label={label}><i className="hm-sheet-handle"/>{(title||action)&&<div className="hm-sheet-head">{title&&<h2>{title}</h2>}{action??<button onClick={onClose}>Close</button>}</div>}{sub&&<p className="hm-sheet-sub">{sub}</p>}{children}</section></div>}
export function Avatar({who,size="",className=""}:{who:"josh"|"g";size?:""|"lg"|"sm";className?:string}){return <b className={`hm-avatar ${who==="josh"?"j":"g"} ${size} ${className}`} aria-hidden="true">{who==="josh"?"J":"G"}</b>}
export function Check({on,next=false,lg=false}:{on:boolean;next?:boolean;lg?:boolean}){return <span className={`hm-check ${on?"on":""} ${next?"next":""} ${lg?"lg":""}`} aria-hidden="true">{on?"✓":""}</span>}
export function Progress({pct,thin=false}:{pct:number;thin?:boolean}){return <div className={`hm-progress ${thin?"thin":""}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{width:`${Math.max(0,Math.min(100,pct))}%`}}/></div>}
export function Stat({v,k,tint}:{v:ReactNode;k:ReactNode;tint?:string}){return <div className="hm-stat" style={tint?{"--tint":tint} as CSSProperties:undefined}><b>{v}</b><span>{k}</span></div>}
export function RoundBack({href,onPhoto=false,label="Back"}:{href:string;onPhoto?:boolean;label?:string}){return <Link href={href} className={`hm-round ${onPhoto?"onphoto":""}`} aria-label={label} onClick={()=>feedback("tap")}>‹</Link>}
export function Toast({text}:{text:string}){return <div className="hm-toast" role="status">{text}</div>}
export function PrepDots({recipe}:{recipe:CanonicalRecipe}){return <>{prepForRecipeAtCookScaleV7(recipe.id).map(p=><i key={p.componentId} className="hm-dot" style={{"--tone":toneFor(p.componentId)} as CSSProperties} title={getComponent(p.componentId)?.code}/>)}</>}
export function mealMeta(recipe:CanonicalRecipe){return `${recipe.minutes} min · ${recipe.cuisine}`}
export type Readiness={state:"ready"|"missing"|"unknown";label:string;missing:number;pillClass:string};
export function useReadiness(){const h=useHousehold();return(recipe:CanonicalRecipe|string):Readiness=>{const r=typeof recipe==="string"?getLiveRecipeV7(recipe):recipe;if(!r)return{state:"missing",label:"Recipe unavailable",missing:1,pillClass:"peach"};if(!h.kitchenReady)return{state:"unknown",label:"Kitchen not checked",missing:0,pillClass:"neutral"};const a=recipeAvailabilityV7(r.id,h.componentStock,h.ingredientStock),missing=a.missingPrep.length+a.missingIngredients.length;return a.ready?{state:"ready",label:"We have it all",missing:0,pillClass:""}:{state:"missing",label:`Missing ${missing}`,missing,pillClass:"peach"}}}
export function ReadyPill({recipe}:{recipe:CanonicalRecipe}){const ready=useReadiness()(recipe);return <span className={`hm-pill ${ready.pillClass}`}><i/>{ready.label}</span>}
export function formatQty(qty:number,unit:string){if(unit==="have")return"check pantry";if(unit==="portion")return`${trim(qty)} ${qty===1?"portion":"portions"}`;if(unit==="count")return trim(qty);if(unit==="g"&&qty>=1000)return`${trim(qty/1000)} kg`;if(unit==="ml"&&qty>=1000)return`${trim(qty/1000)} L`;return`${trim(qty)} ${unit}`}
function trim(n:number){return Number.isInteger(n)?String(n):String(Math.round(n*10)/10)}
