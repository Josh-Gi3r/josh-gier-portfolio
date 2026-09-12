"use client";
import Link from "next/link";
import type {ReactNode} from "react";
import {feedback} from "@/lib/feedback";
import {getComponent,getRecipe,type CanonicalRecipe} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {recipeAvailability} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";

export function PageHead({eyebrow,title,sub,action}:{eyebrow?:string;title:string;sub?:string;action?:ReactNode}){return <header className="hm-page-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</header>}
export function SectionHead({title,eyebrow,action}:{title:string;eyebrow?:string;action?:ReactNode}){return <header className="hm-section-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>{action}</header>}
export function Back({href,label="Back"}:{href:string;label?:string}){return <Link className="hm-back-v5" href={href} onClick={()=>feedback("tap")}>‹ <span>{label}</span></Link>}
export function ComponentPill({id,amountMl}:{id:string;amountMl?:number}){const c=getComponent(id);if(!c)return null;return <span className="hm-component-pill-v5" style={{"--tone":c.tone} as React.CSSProperties}><i/>{c.code}{amountMl?` · ${amountMl} ml`:""}</span>}
export function RatingLine({recipeId}:{recipeId:string}){const h=useHousehold();const r=h.ratings[recipeId];if(!r?.josh&&!r?.g)return null;return <span className="hm-rating-line-v5">{r.josh?`Josh ${r.josh}★`:"Josh —"}<b>·</b>{r.g?`G ${r.g}★`:"G —"}</span>}
export function MealCard({recipe,compact=false,day}:{recipe:CanonicalRecipe;compact?:boolean;day?:string}){const title=recipeTitle(recipe.id,recipe.title);return <Link href={`/cook/${recipe.id}`} className={`hm-meal-card-v5 ${compact?"compact":""}`} onClick={()=>feedback("tap")}>{recipe.image?<img src={recipe.image} alt=""/>:<div className="hm-photo-placeholder-v5">{title.slice(0,1)}</div>}<div className="hm-meal-card-copy-v5">{day&&<span>{day}</span>}<strong>{title}</strong><small>{recipe.minutes} min · {recipe.cuisine}</small><RatingLine recipeId={recipe.id}/></div></Link>}
export function RecipeReady({recipe}:{recipe:CanonicalRecipe}){const h=useHousehold();if(!h.kitchenReady)return <span className="hm-ready-v5 unknown">Kitchen not checked</span>;const a=recipeAvailability(recipe.id,h.componentStock,h.ingredientStock);return <span className={`hm-ready-v5 ${a.ready?"ready":"missing"}`}>{a.ready?"We have it":"Missing a few things"}</span>}
export function formatQty(qty:number,unit:string){if(unit==="have")return "check pantry";if(unit==="portion")return `${trim(qty)} ${qty===1?"portion":"portions"}`;if(unit==="count")return trim(qty);if(unit==="g"&&qty>=1000)return `${trim(qty/1000)} kg`;if(unit==="ml"&&qty>=1000)return `${trim(qty/1000)} L`;return `${trim(qty)} ${unit}`}
function trim(n:number){return Number.isInteger(n)?String(n):String(Math.round(n*10)/10)}
export function recipeFor(id:string){return getRecipe(id)}
