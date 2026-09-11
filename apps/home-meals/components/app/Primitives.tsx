"use client";
import Link from "next/link";
import type {ReactNode} from "react";
import {feedback} from "@/lib/feedback";
import {getComponent,getRecipe,type CanonicalRecipe} from "@/data/home-data";
import {useHousehold} from "../HouseholdState";

export function PageHead({eyebrow,title,sub,action}:{eyebrow?:string;title:string;sub?:string;action?:ReactNode}){return <header className="hm-page-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</header>}
export function SectionHead({title,eyebrow,action}:{title:string;eyebrow?:string;action?:ReactNode}){return <header className="hm-section-head-v5"><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>{action}</header>}
export function Back({href,label="Back"}:{href:string;label?:string}){return <Link className="hm-back-v5" href={href} onClick={()=>feedback("tap")}>‹ <span>{label}</span></Link>}
export function ComponentPill({id,amountMl}:{id:string;amountMl?:number}){const c=getComponent(id);if(!c)return null;return <span className="hm-component-pill-v5" style={{"--tone":c.tone} as React.CSSProperties}><i/>{c.code}{amountMl?` · ${amountMl} ml`:""}</span>}
export function RatingLine({recipeId}:{recipeId:string}){const h=useHousehold();const r=h.ratings[recipeId];if(!r?.josh&&!r?.g)return null;return <span className="hm-rating-line-v5">{r.josh?`Josh ${r.josh}★`:"Josh —"}<b>·</b>{r.g?`G ${r.g}★`:"G —"}</span>}
export function MealCard({recipe,compact=false,day}:{recipe:CanonicalRecipe;compact?:boolean;day?:string}){return <Link href={`/cook/${recipe.id}`} className={`hm-meal-card-v5 ${compact?"compact":""}`} onClick={()=>feedback("tap")}>{recipe.image?<img src={recipe.image} alt=""/>:<div className="hm-photo-placeholder-v5">{recipe.title.slice(0,1)}</div>}<div className="hm-meal-card-copy-v5">{day&&<span>{day}</span>}<strong>{recipe.title}</strong><small>{recipe.minutes} min · {recipe.cuisine}</small><RatingLine recipeId={recipe.id}/></div></Link>}
export function RecipeReady({recipe}:{recipe:CanonicalRecipe}){const h=useHousehold();if(!h.kitchenReady)return <span className="hm-ready-v5 unknown">Kitchen not checked</span>;const missingPrep=recipe.prep.some(x=>(h.componentStock[x.id]??0)<x.totalMl);const missingIng=recipe.ingredients.some(x=>{const d=h.ingredientStock[x.id]??0;return x.unit!=="have"&&d<x.qty});return <span className={`hm-ready-v5 ${missingPrep||missingIng?"missing":"ready"}`}>{missingPrep||missingIng?"Missing a few things":"We have it"}</span>}
export function formatQty(qty:number,unit:string){if(unit==="have")return "check pantry";if(unit==="portion")return `${trim(qty)} ${qty===1?"portion":"portions"}`;return `${trim(qty)} ${unit}`}
function trim(n:number){return Number.isInteger(n)?String(n):String(Math.round(n*10)/10)}
export function recipeFor(id:string){return getRecipe(id)}
