"use client";
import Link from "next/link";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe,ingredients,motherBases} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {MealCard,PageHead,RecipeReady,SectionHead} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export function Home(){
 const h=useHousehold();const day=(new Date().getDay()+6)%7;const tonight=getRecipe(h.week[day]??h.week[0]);const last=h.history[0]?getRecipe(h.history[0].mealId):null;
 const trackedIngredients=ingredients.filter(x=>(h.ingredientStock[x.id]??0)>0).length;const stockedMothers=motherBases.filter(x=>(h.componentStock[x.id]??0)>0).length;
 const firstPrep=h.prepNeeds[0];const firstBuy=h.shoppingNeeds[0];
 const soonIds=Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0);const firstSoon=soonIds[0];const soonName=firstSoon?getIngredient(firstSoon)?.name:null;const soonDay=firstSoon?h.week.findIndex(id=>getRecipe(id).ingredients.some(x=>x.id===firstSoon)):-1;
 return <div className="hm-page-v5 hm-home-v5">
  <PageHead eyebrow="HOME MEALS" title="Tonight" sub="Josh + G" action={<div className="hm-us-v5"><b>J</b><b>G</b></div>}/>
  <section className="hm-tonight-v5">{tonight.image?<img src={tonight.image} alt=""/>:<div/>}<div className="hm-tonight-shade-v5"/><div className="hm-tonight-content-v5"><div className="hm-tonight-meta-v5"><RecipeReady recipe={tonight}/><span>{tonight.minutes} min</span></div><h2>{recipeTitle(tonight.id,tonight.title)}</h2><p>{recipeSubtitle(tonight.id,tonight.subtitle)}</p><div className="hm-tonight-actions-v5"><Link href={`/cook/${tonight.id}/cook`}>Cook</Link><Link href="/plan">Swap</Link></div></div></section>

  {!h.kitchenReady?<Link href="/kitchen" className="hm-priority-v5 setup"><span>Kitchen</span><strong>Tell Home what we have</strong><p>Check the fridge, freezer and pantry once so shopping and prep are real.</p><b>›</b></Link>:
   firstSoon?<Link href="/plan" className="hm-priority-v5 soon"><span>Use soon</span><strong>{soonName}</strong><p>{soonDay>=0?`${days[soonDay]}'s dinner already uses it.`:"Move it into a meal before it goes."}{soonIds.length>1?` +${soonIds.length-1} more.`:""}</p><b>›</b></Link>:
   firstPrep?<Link href="/prep" className="hm-priority-v5 prep"><span>Prep</span><strong>{getComponent(firstPrep.id)?.code} needs topping up</strong><p>{firstPrep.shortMl} ml short for this week.</p><b>›</b></Link>:
   firstBuy?<Link href="/plan" className="hm-priority-v5 shop"><span>Shopping</span><strong>{getIngredient(firstBuy.id)?.name} is on the list</strong><p>{h.shoppingNeeds.length} {h.shoppingNeeds.length===1?"item":"items"} to buy this week.</p><b>›</b></Link>:
   <div className="hm-priority-v5 good"><span>This week</span><strong>We’re covered</strong><p>No urgent shop or prep job.</p></div>}

  <section className="hm-block-v5"><SectionHead eyebrow="THIS WEEK" title="What we’re eating" action={<Link href="/plan">Plan</Link>}/><div className="hm-meal-rail-v5">{h.week.map((id,i)=><MealCard recipe={getRecipe(id)} key={`${id}-${i}`} compact day={`${days[i]}${i===day?" · today":""}`}/>)}</div></section>

  <section className="hm-block-v5"><SectionHead eyebrow="KITCHEN" title={h.kitchenReady?"At a glance":"Not checked yet"} action={<Link href="/kitchen">Open</Link>}/><div className="hm-kitchen-pulse-v5">
   <Link href="/kitchen"><span>Fridge + pantry</span><strong>{h.kitchenReady?trackedIngredients:"—"}</strong><small>{h.kitchenReady?"tracked items":"check stock"}</small></Link>
   <Link href="/kitchen"><span>Mother bases</span><strong>{h.kitchenReady?`${stockedMothers}/8`:"—"}</strong><small>{h.kitchenReady?"with some stock":"check freezer"}</small></Link>
   <Link href="/plan"><span>Use soon</span><strong>{h.kitchenReady?soonIds.length:"—"}</strong><small>{h.kitchenReady?(soonIds.length?"need attention":"nothing flagged"):"after kitchen check"}</small></Link>
  </div></section>

  <section className="hm-block-v5"><SectionHead eyebrow="OUR MEMORY" title="Last time" action={<Link href="/cook">Recipes</Link>}/>{last?<Link href={`/cook/${last.id}`} className="hm-memory-card-v5">{last.image&&<img src={last.image} alt=""/>}<div><strong>{recipeTitle(last.id,last.title)}</strong><span>{h.ratings[last.id]?.josh?`Josh ${h.ratings[last.id].josh}★`:"Josh —"} · {h.ratings[last.id]?.g?`G ${h.ratings[last.id].g}★`:"G —"}</span>{h.recipeNotes[last.id]?.[0]&&<p>“{h.recipeNotes[last.id][0].text}”</p>}</div><b>›</b></Link>:<div className="hm-empty-v5"><strong>Nothing cooked yet.</strong><p>After dinner, rate it and leave a note. Home will remember.</p></div>}</section>
 </div>
}
