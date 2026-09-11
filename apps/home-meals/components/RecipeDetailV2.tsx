"use client";
import Link from "next/link";
import { useHousehold } from "./HouseholdState";
import { getIngredient, getMeal, midBases, motherBases } from "@/data/home-graph-v3";
import { mealBySlug } from "@/data/meals-researched";
import { RecipeEvolution } from "./RecipeEvolution";

export function RecipeDetailV2({mealId}:{mealId:string}){
 const h=useHousehold(); const meal=getMeal(mealId); const research=mealBySlug(mealId); const rating=h.ratings[mealId]??{};
 const components=[...meal.motherIds.map(id=>({kind:"Mother",item:motherBases.find(x=>x.id===id)!})),...meal.midIds.map(id=>({kind:"Mid",item:midBases.find(x=>x.id===id)!}))];
 return <div className="hm-screen hm-recipe-detail hm-v3-screen">
  <Link href="/cook" className="hm-back">← Our recipes</Link>
  <section className="hm-recipe-hero">{meal.image?<img src={meal.image} alt={meal.title}/>:<div className="hm-meal-placeholder big">{meal.title[0]}</div>}<div className="hm-recipe-hero-copy"><span>{meal.cuisine} · {meal.minutes} min · {meal.method}</span><h1>{meal.title}</h1><p>{meal.subtitle}</p><div className="hm-code-row">{components.map(({item})=><b key={item.id}>{item.code}</b>)}</div>{meal.status==="placeholder"&&<em>This is a test recipe direction. The food graph is wired; our household version can evolve after we actually cook it.</em>}<div className="hm-action-row"><Link className="hm-btn primary" href={`/cook/${meal.id}/cook`}>Start cooking</Link><Link className="hm-btn secondary" href="/plan">Put in week</Link></div></div></section>
  <section className="hm-recipe-linked-grid"><article><span>FROM THE FREEZER</span><h2>Prep components</h2>{components.length?components.map(({kind,item})=><div className="hm-component-line" key={item.id}><i style={{background:item.tone}}/><div><strong>{item.code} · {item.name}</strong><small>{kind} · have {h.componentStock[item.id]??0} portion(s)</small></div></div>):<p className="hm-empty">No frozen component required.</p>}</article><article><span>FROM HOME</span><h2>Fresh / pantry</h2>{meal.ingredients.map(req=><div className="hm-ingredient-line" key={req.id}><div><strong>{getIngredient(req.id).name}</strong><small>need {req.qty} {req.unit}</small></div><b className={(h.ingredientStock[req.id]??0)>=req.qty?"ok":"low"}>home {h.ingredientStock[req.id]??0}</b></div>)}</article></section>
  {research?<><section className="hm-recipe-story"><article><span>WHY IT STAYS</span><h2>{research.why}</h2></article><article><span>BALANCE</span><p>{research.balance}</p></article></section><section className="hm-method-section"><span>METHOD</span><h2>{research.steps.length} moves</h2><ol>{research.steps.map((step,i)=><li key={step}><b>{String(i+1).padStart(2,"0")}</b><p>{step}</p></li>)}</ol><a href={research.source.url} target="_blank" rel="noreferrer">Reference: {research.source.label} ↗</a></section></>:<section className="hm-placeholder-panel"><strong>Recipe still evolving</strong><p>This direction is valid in the graph, but exact household method/notes can improve after we cook it.</p></section>}
  <section className="hm-rating-panel"><div><span>AFTER DINNER</span><h2>How did we do?</h2><p>Josh + G rate separately. This becomes the memory for future weeks.</p></div><div className="hm-person-rating"><strong>Josh</strong><div>{[1,2,3,4,5].map(x=><button key={x} className={(rating.josh??0)>=x?"on":""} onClick={()=>h.rateMeal(mealId,"josh",x)}>★</button>)}</div></div><div className="hm-person-rating"><strong>G</strong><div>{[1,2,3,4,5].map(x=><button key={x} className={(rating.g??0)>=x?"on":""} onClick={()=>h.rateMeal(mealId,"g",x)}>★</button>)}</div></div></section>
  <RecipeEvolution mealId={mealId}/>
 </div>
}
