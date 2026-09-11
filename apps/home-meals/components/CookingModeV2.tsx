"use client";
import Link from "next/link";
import { useState } from "react";
import { useHousehold } from "./HouseholdState";
import { getMeal, getIngredient, midBases, motherBases } from "@/data/home-graph";
import { mealBySlug } from "@/data/meals-researched";

export function CookingModeV2({mealId}:{mealId:string}){
 const h=useHousehold(); const meal=getMeal(mealId); const research=mealBySlug(mealId); const steps=research?.steps??["Get all linked prep components and fresh ingredients out.","Cook the protein or vegetables using the intended method.","Add the linked mother/mid components, dilute or finish as appropriate, and cook until the sauce is right.","Taste, finish fresh, serve, then rate it in Home Meals."];
 const [step,setStep]=useState(0); const [done,setDone]=useState(false);
 const components=[...meal.motherIds.map(id=>motherBases.find(x=>x.id===id)!),...meal.midIds.map(id=>midBases.find(x=>x.id===id)!)];
 const complete=()=>{if(!done){h.cookMeal(mealId);setDone(true)}};
 return <div className="hm-cooking-mode">
  <header><Link href={`/cook/${mealId}`}>← Recipe</Link><div><span>COOKING FOR JOSH + G</span><h1>{meal.title}</h1></div><small>{step+1} / {steps.length}</small></header>
  <section className="hm-cook-setup"><div><span>FROM FREEZER</span>{components.length?components.map(x=><b key={x.id}>{x.code} ×1</b>):<b>No frozen prep</b>}</div><div><span>FRESH / PANTRY</span>{meal.ingredients.slice(0,6).map(x=><b key={x.id}>{getIngredient(x.id).name} {x.qty}{x.unit}</b>)}</div></section>
  <main><div className="hm-step-number">{String(step+1).padStart(2,"0")}</div><p>{steps[step]}</p></main>
  <footer><button disabled={step===0} onClick={()=>setStep(x=>Math.max(0,x-1))}>Back</button>{step<steps.length-1?<button className="primary" onClick={()=>setStep(x=>Math.min(steps.length-1,x+1))}>Next step</button>:<button className="primary" onClick={complete}>{done?"✓ Dinner logged":"Finish & update kitchen"}</button>}</footer>
  {done&&<div className="hm-cook-done"><strong>Dinner logged.</strong><span>The linked prep components and ingredients were deducted from Kitchen. Rate it on the recipe page.</span></div>}
 </div>
}
