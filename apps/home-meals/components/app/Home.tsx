"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe,ingredients,motherBases} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {recipeAvailability} from "@/data/stock-math";
import {foundationImages} from "@/data/foundation-assets";
import {freezerAge} from "@/data/freezer-guide";
import {MealCard,PageHead,RecipeReady,SectionHead} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function Home(){
 const h=useHousehold();const day=(new Date().getDay()+6)%7;const tonight=getRecipe(h.week[day]??h.week[0]);const last=h.history[0]?getRecipe(h.history[0].mealId):null;const tonightTitle=recipeTitle(tonight.id,tonight.title);const lastPhoto=last?h.mealPhotos.find(x=>x.mealId===last.id):undefined;const lastVersion=last?(h.recipeVersions[last.id]?.[0]?.number??1):1;
 const fridgeItems=ingredients.filter(x=>["Fresh","Protein","Dairy"].includes(x.category)&&(h.ingredientStock[x.id]??0)>0).length;
 const pantryItems=ingredients.filter(x=>x.category==="Pantry"&&(h.ingredientStock[x.id]??0)>0).length;const pantryLowItems=ingredients.filter(x=>x.category==="Pantry"&&x.tracking==="state"&&(h.ingredientStock[x.id]??0)===1);const pantryLow=pantryLowItems.length;
 const stockedMothers=motherBases.filter(x=>(h.componentStock[x.id]??0)>0).length;
 const firstPrep=h.prepNeeds[0];const firstBuy=h.shoppingNeeds[0];
 const soonIds=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0);const uncoveredSoon=soonIds.filter(id=>!h.week.some(rid=>getRecipe(rid).ingredients.some(x=>x.id===id)));const prioritySoon=uncoveredSoon[0]??soonIds[0];const soonName=prioritySoon?getIngredient(prioritySoon)?.name:null;const soonDay=prioritySoon?h.week.findIndex(id=>getRecipe(id).ingredients.some(x=>x.id===prioritySoon)):-1;
 const agingBatch=h.prepBatches.filter(b=>(b.remainingMl??b.outputMl)>0).map(b=>({batch:b,age:freezerAge(b.componentId,b.at),component:getComponent(b.componentId)})).filter(x=>x.component?.kind==="mother"&&x.age.status!=="recorded").sort((a,b)=>{const ar=a.age.guide?a.age.ageDays/a.age.guide.lowerDays:0;const br=b.age.guide?b.age.ageDays/b.age.guide.lowerDays:0;return br-ar})[0];
 const readyTonight=h.kitchenReady&&recipeAvailability(tonight.id,h.componentStock,h.ingredientStock).ready;
 const heroHref=readyTonight?`/cook/${tonight.id}/cook`:`/cook/${tonight.id}`;const heroLabel=readyTonight?"Cook now":h.kitchenReady?"See what’s missing":"Open recipe";
 return <div className="hm-page-v5 hm-home-v5 hm-home-v6">
  <PageHead title="Home Meals" sub="Josh & G" action={<div className="hm-us-v5 hm-us-v6"><b>J</b><b>G</b></div>}/>

  <section className="hm-tonight-v5 hm-tonight-v6">{tonight.image?<img src={tonight.image} alt={tonightTitle} width={780} height={520} loading="eager" fetchPriority="high" decoding="async"/>:<div/>}<div className="hm-tonight-shade-v5"/><div className="hm-tonight-content-v5"><span className="hm-hero-kicker-v6">TONIGHT’S DINNER</span><h2>{tonightTitle}</h2><p>{recipeSubtitle(tonight.id,tonight.subtitle)}</p><div className="hm-tonight-meta-v5"><RecipeReady recipe={tonight}/><span>{tonight.minutes} min</span></div><div className="hm-tonight-actions-v5"><Link href={heroHref}>{heroLabel} <b>→</b></Link><Link href="/plan">Swap</Link></div></div></section>

  {!h.kitchenReady?<Link href="/kitchen" className="hm-priority-v5 setup"><span>Kitchen</span><strong>Tell Home what we have</strong><p>Check the fridge, freezer and pantry once so shopping and prep are real.</p><b>›</b></Link>:
   uncoveredSoon.length>0?<Link href="/plan" className="hm-priority-v5 soon"><span>Use soon</span><strong>{soonName} needs a dinner</strong><p>Nothing in the current week uses it yet.{uncoveredSoon.length>1?` +${uncoveredSoon.length-1} more.`:""}</p><b>›</b></Link>:
   firstPrep?<Link href="/prep" className="hm-priority-v5 prep"><span>Prep</span><strong>{getComponent(firstPrep.id)?.code} needs topping up</strong><p>{firstPrep.shortMl} ml short for this week.</p><b>›</b></Link>:
   firstBuy?<Link href="/plan" className="hm-priority-v5 shop"><span>Shopping</span><strong>{getIngredient(firstBuy.id)?.name} is on the list</strong><p>{h.shoppingNeeds.length} {h.shoppingNeeds.length===1?"item":"items"} to buy this week.</p><b>›</b></Link>:
   prioritySoon?<Link href={`/cook/${h.week[soonDay]}`} className="hm-priority-v5 soon"><span>Use soon</span><strong>{soonName} is covered</strong><p>{soonDay>=0?`${days[soonDay]}'s dinner already uses it.`:"It is already in the plan."}</p><b>›</b></Link>:
   agingBatch?<Link href={`/prep/${agingBatch.component!.id}`} className="hm-priority-v5 prep"><span>Freezer first</span><strong>{agingBatch.component!.code} {agingBatch.age.status==="past-lower-guide"?"has reached its storage guide":"is getting close to its storage guide"}</strong><p>{agingBatch.age.ageDays} days since the dated batch · freezer guide {agingBatch.age.guide?.label}. Use the oldest portion before making more.</p><b>›</b></Link>:
   pantryLow?<Link href="/kitchen" className="hm-priority-v5 shop"><span>Next shop</span><strong>{pantryLow===1?`${pantryLowItems[0].name} is running low`:`${pantryLow} pantry staples are running low`}</strong><p>Still enough for this week. Check them before the next grocery run.</p><b>›</b></Link>:
   <div className="hm-priority-v5 good"><span>This week</span><strong>We’re covered</strong><p>No urgent shop or prep job.</p></div>}

  <section className="hm-block-v5 hm-home-week-v6"><SectionHead title="This week" action={<Link href="/plan">See all ›</Link>}/><div className="hm-meal-rail-v5">{h.week.map((id,i)=><MealCard recipe={getRecipe(id)} key={`${id}-${i}`} compact day={`${days[i]}${i===day?" · today":""}`}/>)}</div></section>

  <section className="hm-block-v5 hm-kitchen-status-v6"><SectionHead title="Kitchen status" action={<Link href="/kitchen">Kitchen ›</Link>}/><div className="hm-kitchen-grid-v6">
   <Link href="/kitchen" className="fridge"><div className="hm-kitchen-icon-v6">▥</div><span><strong>Fridge</strong><small>{h.kitchenReady?`${fridgeItems} items`:"Check stock"}</small></span><b>›</b></Link>
   <Link href="/kitchen" className="freezer" style={{"--status-image":`url(${foundationImages.freezer})`} as React.CSSProperties}><div className="hm-kitchen-icon-v6">❄</div><span><strong>Freezer</strong><small>{h.kitchenReady?(agingBatch?`${agingBatch.component!.code} use first`:`${stockedMothers}/8 mothers`):"Check freezer"}</small></span><b>›</b></Link>
   <Link href="/kitchen" className="pantry"><div className="hm-kitchen-icon-v6">◫</div><span><strong>Pantry</strong><small>{h.kitchenReady?(pantryLow?`${pantryLow} running low`:`${pantryItems} items`):"Check pantry"}</small></span><b>›</b></Link>
   <Link href="/plan" className="shopping" style={{"--status-image":`url(${foundationImages.groceries})`} as React.CSSProperties}><div className="hm-kitchen-icon-v6">⌑</div><span><strong>Shopping</strong><small>{h.shoppingNeeds.length?`${h.shoppingNeeds.length} items`:"Nothing urgent"}</small></span><b>›</b></Link>
  </div></section>

  <section className="hm-block-v5 hm-memory-v6"><SectionHead title="Our cookbook" action={<Link href="/cook">Recipes ›</Link>}/>{last?<Link href={`/cook/${last.id}`} className={`hm-memory-card-v5 ${lastPhoto?"personal-photo-v24":""}`}>{(lastPhoto?.dataUrl||last.image)&&<img src={lastPhoto?.dataUrl??last.image} alt={lastPhoto?`${recipeTitle(last.id,last.title)} we cooked`:recipeTitle(last.id,last.title)} width={148} height={148} loading="lazy" decoding="async"/>}<div><small className="hm-memory-version-v24">OUR v{lastVersion}{lastPhoto?" · OUR PHOTO":""}</small><strong>{recipeTitle(last.id,last.title)}</strong><span>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}</span>{h.recipeNotes[last.id]?.[0]&&<p>“{h.recipeNotes[last.id][0].text}”</p>}</div><b>›</b></Link>:<div className="hm-empty-v5"><strong>Nothing cooked yet.</strong><p>Cook something and Home will remember what worked for us.</p><Link href="/cook">Choose a recipe</Link></div>}</section>
 </div>
}