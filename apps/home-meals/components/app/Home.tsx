"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe,ingredients,motherBases} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {recipeAvailability,stockPortions} from "@/data/stock-math";
import {foundationImages} from "@/data/foundation-assets";
import {motherProcessImages} from "@/data/mother-process-assets";
import {MealCard,PageHead,RecipeReady,SectionHead} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function Home(){
 const h=useHousehold();const day=(new Date().getDay()+6)%7;const tonight=getRecipe(h.week[day]??h.week[0]);const last=h.history[0]?getRecipe(h.history[0].mealId):null;
 const fridgeItems=ingredients.filter(x=>["Fresh","Protein","Dairy"].includes(x.category)&&(h.ingredientStock[x.id]??0)>0).length;
 const pantryItems=ingredients.filter(x=>x.category==="Pantry"&&(h.ingredientStock[x.id]??0)>0).length;
 const stockedMothers=motherBases.filter(x=>(h.componentStock[x.id]??0)>0).length;
 const firstPrep=h.prepNeeds[0];const firstBuy=h.shoppingNeeds[0];
 const soonIds=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0);const uncoveredSoon=soonIds.filter(id=>!h.week.some(rid=>getRecipe(rid).ingredients.some(x=>x.id===id)));const prioritySoon=uncoveredSoon[0]??soonIds[0];const soonName=prioritySoon?getIngredient(prioritySoon)?.name:null;const soonDay=prioritySoon?h.week.findIndex(id=>getRecipe(id).ingredients.some(x=>x.id===prioritySoon)):-1;
 const readyTonight=h.kitchenReady&&recipeAvailability(tonight.id,h.componentStock,h.ingredientStock).ready;
 const heroHref=readyTonight?`/cook/${tonight.id}/cook`:`/cook/${tonight.id}`;const heroLabel=readyTonight?"Cook now":h.kitchenReady?"See what’s missing":"Open recipe";
 const prepNext=[...motherBases].sort((a,b)=>Number(h.prepNeeds.some(n=>n.id===b.id))-Number(h.prepNeeds.some(n=>n.id===a.id))||stockPortions(a.id,h.componentStock)-stockPortions(b.id,h.componentStock)).slice(0,4);
 return <div className="hm-page-v5 hm-home-v5 hm-home-v6">
  <PageHead title="Home Meals" sub="Josh & G" action={<div className="hm-us-v5 hm-us-v6"><b>J</b><b>G</b></div>}/>
  <div className="hm-home-note-v6">Good food.<br/>Happier home. <span>♥</span></div>

  <section className="hm-tonight-v5 hm-tonight-v6">{tonight.image?<img src={tonight.image} alt="" width={780} height={520} loading="eager" fetchPriority="high" decoding="async"/>:<div/>}<div className="hm-tonight-shade-v5"/><div className="hm-tonight-content-v5"><span className="hm-hero-kicker-v6">TONIGHT’S DINNER</span><h2>{recipeTitle(tonight.id,tonight.title)}</h2><p>{recipeSubtitle(tonight.id,tonight.subtitle)}</p><div className="hm-tonight-meta-v5"><RecipeReady recipe={tonight}/><span>{tonight.minutes} min</span></div><div className="hm-tonight-actions-v5"><Link href={heroHref}>{heroLabel} <b>→</b></Link><Link href="/plan">Swap</Link></div></div><div className="hm-hero-scribble-v6">Simple ingredients.<br/>Extraordinary dinners. ♥</div></section>

  {!h.kitchenReady?<Link href="/kitchen" className="hm-priority-v5 setup"><span>Kitchen</span><strong>Tell Home what we have</strong><p>Check the fridge, freezer and pantry once so shopping and prep are real.</p><b>›</b></Link>:
   uncoveredSoon.length>0?<Link href="/plan" className="hm-priority-v5 soon"><span>Use soon</span><strong>{soonName} needs a dinner</strong><p>Nothing in the current week uses it yet.{uncoveredSoon.length>1?` +${uncoveredSoon.length-1} more.`:""}</p><b>›</b></Link>:
   firstPrep?<Link href="/prep" className="hm-priority-v5 prep"><span>Prep</span><strong>{getComponent(firstPrep.id)?.code} needs topping up</strong><p>{firstPrep.shortMl} ml short for this week.</p><b>›</b></Link>:
   firstBuy?<Link href="/plan" className="hm-priority-v5 shop"><span>Shopping</span><strong>{getIngredient(firstBuy.id)?.name} is on the list</strong><p>{h.shoppingNeeds.length} {h.shoppingNeeds.length===1?"item":"items"} to buy this week.</p><b>›</b></Link>:
   prioritySoon?<Link href={`/cook/${h.week[soonDay]}`} className="hm-priority-v5 soon"><span>Use soon</span><strong>{soonName} is covered</strong><p>{soonDay>=0?`${days[soonDay]}'s dinner already uses it.`:"It is already in the plan."}</p><b>›</b></Link>:
   <div className="hm-priority-v5 good"><span>This week</span><strong>We’re covered</strong><p>No urgent shop or prep job.</p></div>}

  <section className="hm-block-v5 hm-home-week-v6"><SectionHead title="This week" action={<Link href="/plan">See all ›</Link>}/><div className="hm-meal-rail-v5">{h.week.map((id,i)=><MealCard recipe={getRecipe(id)} key={`${id}-${i}`} compact day={`${days[i]}${i===day?" · today":""}`}/>)}</div></section>

  <section className="hm-block-v5 hm-kitchen-status-v6"><SectionHead title="Kitchen status" action={<Link href="/kitchen">Looks good! ❧</Link>}/><div className="hm-kitchen-grid-v6">
   <Link href="/kitchen" className="fridge"><div className="hm-kitchen-icon-v6">▥</div><span><strong>Fridge</strong><small>{h.kitchenReady?`${fridgeItems} items`:"Check stock"}</small></span><b>›</b></Link>
   <Link href="/kitchen" className="freezer" style={{"--status-image":`url(${foundationImages.freezer})`} as React.CSSProperties}><div className="hm-kitchen-icon-v6">❄</div><span><strong>Freezer</strong><small>{h.kitchenReady?`${stockedMothers}/8 mothers`:"Check freezer"}</small></span><b>›</b></Link>
   <Link href="/kitchen" className="pantry"><div className="hm-kitchen-icon-v6">◫</div><span><strong>Pantry</strong><small>{h.kitchenReady?`${pantryItems} items`:"Check pantry"}</small></span><b>›</b></Link>
   <Link href="/plan" className="shopping" style={{"--status-image":`url(${foundationImages.groceries})`} as React.CSSProperties}><div className="hm-kitchen-icon-v6">⌑</div><span><strong>Shopping</strong><small>{h.shoppingNeeds.length?`${h.shoppingNeeds.length} items`:"Nothing urgent"}</small></span><b>›</b></Link>
  </div></section>

  <section className="hm-block-v5 hm-prep-next-v6"><SectionHead title="Prep next" action={<Link href="/prep">View guide ›</Link>}/><p className="hm-section-deck-v6">Make the foundations once. Give the week options.</p><div className="hm-prep-object-row-v6">{prepNext.map(m=>{const n=stockPortions(m.id,h.componentStock);const photo=motherProcessImages[m.id]?.at(-1)?.url;const need=h.prepNeeds.find(x=>x.id===m.id);return <Link href={`/prep/${m.id}`} key={m.id} style={{"--tone":m.tone} as React.CSSProperties}>{photo?<img src={photo} alt="" loading="lazy"/>:<img src={foundationImages.cubes} alt="" loading="lazy"/>}<span><em>{m.code}</em><strong>{m.name}</strong><small>{need?`${need.shortMl} ml short`:h.kitchenReady?`${n} portions`:"not checked"}</small></span></Link>})}</div></section>

  {last&&<section className="hm-block-v5 hm-memory-v6"><SectionHead title="Our cookbook" action={<Link href="/cook">Recipes ›</Link>}/><Link href={`/cook/${last.id}`} className="hm-memory-card-v5">{last.image&&<img src={last.image} alt="" width={148} height={148} loading="lazy" decoding="async"/>}<div><strong>{recipeTitle(last.id,last.title)}</strong><span>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}</span>{h.recipeNotes[last.id]?.[0]&&<p>“{h.recipeNotes[last.id][0].text}”</p>}</div><b>›</b></Link></section>}

  <aside className="hm-home-banner-v6" style={{backgroundImage:`linear-gradient(90deg,rgba(31,26,20,.76),rgba(31,26,20,.16)),url(${foundationImages.prepDay})`}}><strong>A more delicious home.</strong><span>Simple habits. Better meals. A happier us.</span><em>Good food changes everything ♥</em></aside>
 </div>
}
