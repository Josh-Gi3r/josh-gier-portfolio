"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { researchedMeals } from "@/data/meals-researched";
import { MealVisual } from "./MealVisual";

const filters=["All","≤20 min","Vegetarian","Chicken","Fish","Wok","One-pot","Weekend"];
export function ResearchMealLibrary(){
 const [query,setQuery]=useState(""); const[filter,setFilter]=useState("All");
 const meals=useMemo(()=>researchedMeals.filter(m=>{const hay=`${m.title} ${m.subtitle} ${m.cuisine} ${m.method} ${m.tags.join(" ")}`.toLowerCase();if(query&&!hay.includes(query.toLowerCase()))return false;if(filter==="≤20 min"&&m.time>20)return false;if(filter==="Vegetarian"&&!m.tags.includes("vegetarian"))return false;if(filter==="Chicken"&&!m.ingredients.join(" ").toLowerCase().includes("chicken"))return false;if(filter==="Fish"&&!/salmon|fish/.test(m.ingredients.join(" ").toLowerCase()))return false;if(filter==="Wok"&&!m.method.includes("wok"))return false;if(filter==="One-pot"&&!/one-pot|braise|soup/.test(m.method))return false;if(filter==="Weekend"&&m.difficulty!=="Weekend"&&!m.tags.includes("weekend"))return false;return true}),[query,filter]);
 return <><div className="meal-library-tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search meals, cuisines, ingredients or methods…"/><div>{filters.map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div></div><div className="research-meal-grid">{meals.map(m=><Link href={`/cook/${m.slug}`} className="research-meal-card" key={m.slug}><MealVisual slug={m.slug} title={m.title} compact/><div className="research-meal-body"><div className="meal-kicker"><span>{m.cuisine}</span><b>{m.time} min</b></div><h2>{m.title}</h2><p>{m.subtitle}</p><div className="meal-parts">{m.parts.map(x=><span key={`${x.code}-${x.count}`}>{x.code} ×{x.count}</span>)}</div><footer><small>{m.method}</small><strong>{m.difficulty}</strong></footer></div></Link>)}</div></>
}
