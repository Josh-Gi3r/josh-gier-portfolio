"use client";
import Link from "next/link";
import {useMemo,useState,type CSSProperties} from "react";
import {getComponent,getIngredient,getRecipe,recipes} from "@/data/home-data";
import {recipeTitle} from "@/data/recipe-display";
import {recipeAvailability} from "@/data/stock-math";
import {useHousehold} from "../HouseholdState";
import {feedback} from "@/lib/feedback";
import {toneFor} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Orb} from "./Orb";
import {Avatar,Check,formatQty,mealMeta,MealTile,Progress,SectionHead,Sheet,Stat,Toast,useReadiness} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const categories=["Fresh","Protein","Dairy","Pantry"] as const;
type RecipeRow=(typeof recipes)[number];
const poolFilters=["All","Favourites","Not lately","Quick","New"];

export function Plan(){
 const h=useHousehold();const ready=useReadiness();
 const today=(new Date().getDay()+6)%7;
 const[day,setDay]=useState(today);const[swap,setSwap]=useState<number|null>(null);const[q,setQ]=useState("");const[poolOpen,setPoolOpen]=useState(false);const[poolFilter,setPoolFilter]=useState("All");const[shopOpen,setShopOpen]=useState(false);const[changed,setChanged]=useState<number|null>(null);const[suggested,setSuggested]=useState<string[]|null>(null);const[toast,setToast]=useState("");

 const useSoonIds=useMemo(()=>new Set(Object.keys(h.useSoon).filter(id=>h.useSoon[id]&&(h.ingredientStock[id]??0)>0).sort((a,b)=>new Date(h.useSoonAt[a]??0).getTime()-new Date(h.useSoonAt[b]??0).getTime())),[h.useSoon,h.useSoonAt,h.ingredientStock]);
 const useSoonAge=(id:string)=>{const at=h.useSoonAt[id];return at?Math.max(0,Math.floor((Date.now()-new Date(at).getTime())/86400000)):0};
 const usesSoon=(r:RecipeRow)=>r.ingredients.filter(x=>useSoonIds.has(x.id));
 const useSoonWeight=(r:RecipeRow)=>usesSoon(r).reduce((s,x)=>s+1+Math.min(useSoonAge(x.id),7)*.18,0);
 const inMonth=(id:string)=>h.monthlyPool.includes(id);
 const stockGap=(r:RecipeRow)=>{if(!h.kitchenReady)return 99;const a=recipeAvailability(r.id,h.componentStock,h.ingredientStock);return a.missingPrep.length+a.missingIngredients.length};
 const daysSinceCooked=(id:string)=>{const e=h.history.find(x=>x.mealId===id);return e?Math.max(0,Math.floor((Date.now()-new Date(e.at).getTime())/86400000)):9999};
 const recentPenalty=(id:string)=>{const a=daysSinceCooked(id);return a<7?50:a<14?26:a<28?10:0};
 const rank=(a:RecipeRow,b:RecipeRow)=>useSoonWeight(b)-useSoonWeight(a)||stockGap(a)-stockGap(b)||recentPenalty(a.id)-recentPenalty(b.id)||Number(inMonth(b.id))-Number(inMonth(a.id))||Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||Math.max(h.ratings[b.id]?.josh??0,h.ratings[b.id]?.g??0)-Math.max(h.ratings[a.id]?.josh??0,h.ratings[a.id]?.g??0)||a.minutes-b.minutes;
 const swapResults=recipes.filter(r=>!q||`${recipeTitle(r.id,r.title)} ${r.title} ${r.cuisine}`.toLowerCase().includes(q.toLowerCase())).sort(rank);
 const reason=(r:RecipeRow)=>{const soon=usesSoon(r);if(soon.length)return `uses ${getIngredient(soon[0].id)?.name.toLowerCase()}`;const age=daysSinceCooked(r.id);if(h.favourites[r.id])return "favourite";if(age<28)return `had ${age===0?"today":`${age}d ago`}`;if(age!==9999)return "not had lately";return "not cooked yet"};

 const planned=getRecipe(h.week[day]);const plannedReady=ready(planned);
 const reuse=useMemo(()=>{const m=new Map<string,{count:number;days:number[]}>();h.week.forEach((id,di)=>{const seen=new Set<string>();getRecipe(id).prep.forEach(p=>{if(seen.has(p.id))return;seen.add(p.id);const cur=m.get(p.id)??{count:0,days:[]};cur.count++;cur.days.push(di);m.set(p.id,cur)})});return [...m.entries()].map(([id,v])=>({id,...v,component:getComponent(id)!})).filter(x=>x.component).sort((a,b)=>b.count-a.count).slice(0,5)},[h.week]);
 const required=useMemo(()=>{const ids=new Set<string>();h.week.forEach(id=>getRecipe(id).ingredients.forEach(x=>{if(!x.optional)ids.add(x.id)}));return ids.size},[h.week]);
 const prepLine=h.prepNeeds.slice(0,3).map(x=>{const c=getComponent(x.id);return c?`${c.code} ×${x.short}`:null}).filter(Boolean).join(" · ");
 const buyNames=h.shoppingNeeds.slice(0,3).map(x=>getIngredient(x.id)?.name.toLowerCase()).filter(Boolean).join(", ");
 const checked=h.shoppingNeeds.filter(x=>h.groceryChecked[x.id]);const shopPct=h.shoppingNeeds.length?Math.round(checked.length/h.shoppingNeeds.length*100):100;
 const shopGroups=categories.map(cat=>({cat,items:h.shoppingNeeds.filter(x=>getIngredient(x.id)?.category===cat)})).filter(x=>x.items.length);
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1600)};

 const chooseSwap=(r:RecipeRow)=>{if(swap===null)return;const i=swap;h.setDay(i,r.id);setSwap(null);setDay(i);setChanged(i);window.setTimeout(()=>setChanged(v=>v===i?null:v),600);feedback("change");flash(`${days[i]} · ${recipeTitle(r.id,r.title)}`)};
 const finishShopping=()=>{for(const item of checked){const cur=h.ingredientStock[item.id]??0;h.setIngredient(item.id,item.unit==="have"?Math.max(cur,2):cur+item.qty);h.toggleGrocery(item.id)}setShopOpen(false);feedback("success");flash(`${checked.length} added to Kitchen`)};
 const buildWeek=()=>{
  const month=recipes.filter(r=>inMonth(r.id));const pool=month.length>=7?month:recipes;const picked:RecipeRow[]=[];const reused=new Set<string>();
  for(let di=0;di<7;di++){const previous=picked[picked.length-1];const ranked=pool.filter(r=>!picked.some(x=>x.id===r.id)).map(r=>{const a=h.kitchenReady?recipeAvailability(r.id,h.componentStock,h.ingredientStock):null;const gap=a?a.missingPrep.length+a.missingIngredients.length:0;const rating=Math.max(h.ratings[r.id]?.josh??0,h.ratings[r.id]?.g??0);const overlap=r.prep.filter(p=>reused.has(p.id)).length;const weekday=di<5;const timeCost=weekday?Math.max(0,r.minutes-35)*.65:Math.max(0,25-r.minutes)*.18;const sameCuisine=previous&&previous.cuisine===r.cuisine?8:0;return {r,score:gap*28+recentPenalty(r.id)-useSoonWeight(r)*24-Number(!!h.favourites[r.id])*8-rating*2-overlap*5+timeCost+sameCuisine}}).sort((a,b)=>a.score-b.score||a.r.minutes-b.r.minutes);const next=ranked[0]?.r;if(!next)break;picked.push(next);next.prep.forEach(p=>reused.add(p.id))}
  if(picked.length===7){setSuggested(picked.map(r=>r.id));feedback("success")}
 };
 const swapSuggested=(i:number)=>{if(!suggested)return;const next=[...recipes].sort(rank).find(r=>!suggested.includes(r.id));if(!next)return;setSuggested(suggested.map((id,j)=>j===i?next.id:id));feedback("change")};
 const acceptWeek=()=>{if(!suggested||suggested.length!==7)return;suggested.forEach((id,i)=>h.setDay(i,id));setSuggested(null);feedback("success");flash("Week updated")};
 const suggestedRecipes=(suggested??[]).map(id=>getRecipe(id));
 const suggestedReady=suggestedRecipes.filter(r=>h.kitchenReady&&recipeAvailability(r.id,h.componentStock,h.ingredientStock).ready).length;
 const suggestedSoon=new Set(suggestedRecipes.flatMap(r=>usesSoon(r).map(x=>x.id))).size;
 const suggestedReuse=(()=>{const c=new Map<string,number>();suggestedRecipes.forEach(r=>r.prep.forEach(p=>c.set(p.id,(c.get(p.id)??0)+1)));return [...c.entries()].filter(([,n])=>n>1).map(([id,n])=>`${getComponent(id)?.code} ×${n}`)[0]??"—"})();
 const poolCandidates=recipes.filter(r=>{if(poolFilter==="Favourites")return !!h.favourites[r.id];if(poolFilter==="Not lately")return daysSinceCooked(r.id)>=28;if(poolFilter==="Quick")return r.minutes<=25;if(poolFilter==="New")return daysSinceCooked(r.id)===9999;return true}).sort((a,b)=>Number(inMonth(b.id))-Number(inMonth(a.id))||Number(!!h.favourites[b.id])-Number(!!h.favourites[a.id])||recipeTitle(a.id,a.title).localeCompare(recipeTitle(b.id,b.title)));
 const monthRecipes=h.monthlyPool.map(id=>getRecipe(id)).filter(Boolean);

 const says=(()=>{
  if(!h.kitchenReady)return {text:<>Pick the seven dinners first. Once the kitchen’s checked, the list and prep below turn into real numbers.</>,actions:<Link className="primary" href="/kitchen">Check the kitchen</Link>};
  const top=reuse.find(x=>x.count>1);const soonId=[...useSoonIds][0];const uncovered=soonId&&!h.week.some(rid=>getRecipe(rid).ingredients.some(x=>x.id===soonId));
  if(uncovered){const name=getIngredient(soonId)?.name;const free=[0,1,2,3,4,5,6].find(i=>i>=today&&!usesSoon(getRecipe(h.week[i])).length)??today;return {text:<><b>{name}</b> needs using and nothing this week touches it. Swap {longDays[free]} for something that does?</>,actions:<><button className="primary" onClick={()=>{setSwap(free);setQ("");feedback("tap")}}>Swap {days[free]}</button><button className="ghost" onClick={()=>{h.toggleUseSoon(soonId);feedback("change")}}>It’s fine</button></>}}
  if(top)return {text:<>{top.count===2?"Two":top.count===3?"Three":top.count} dinners pull <b>{top.component.code}</b> this week, so one batch carries {top.days.map(d=>days[d]).join(", ").replace(/, ([^,]*)$/," and $1")}. Nice reuse.</>};
  if(h.shoppingNeeds.length)return {text:<>{h.shoppingNeeds.length} things to buy for this week — {buyNames}. Shop mode groups them by aisle.</>,actions:<button className="primary" onClick={()=>{setShopOpen(true);feedback("tap")}}>Shop mode</button>};
  return {text:<>We have everything this week needs. Nothing to buy.</>};
 })();

 return <div className="hm-screen">
  <div className="hm-plan-head"><h1 className="hm-h1">This week</h1><button className="hm-build" onClick={buildWeek}>Build it for us<Orb size={30}/></button></div>
  <div className="hm-week" aria-label="This week's dinners">{h.week.map((id,i)=>{const r=getRecipe(id);return <button key={`${id}-${i}`} className={`${i===day?"on":""} ${changed===i?"changed":""}`} aria-pressed={i===day} aria-label={`${longDays[i]}: ${recipeTitle(r.id,r.title)}`} onClick={()=>{setDay(i);feedback("tap")}}><span>{days[i]}</span><div className="tile">{r.image&&<img src={r.image} alt=""/>}</div></button>})}</div>

  <div className="hm-plan-hero">
   {planned.image&&<img key={planned.id} src={planned.image} alt={recipeTitle(planned.id,planned.title)}/>}
   <div className="shade"/>
   <div className="copy"><span className="kick">{longDays[day].toUpperCase()}{day===today?" · TONIGHT":""}</span><h2>{recipeTitle(planned.id,planned.title)}</h2>
    <div className="acts"><button className="swap" onClick={()=>{setSwap(day);setQ("");feedback("tap")}}>Swap ⇄</button><span className="meta">{mealMeta(planned)}</span>{h.kitchenReady&&<span className={`hm-pill onphoto`} style={plannedReady.state==="missing"?{background:"rgba(255,138,92,.5)"}:undefined}>{plannedReady.label}</span>}</div>
   </div>
  </div>

  <div className="hm-plan-tiles">
   <div className="hm-plan-tile"><span className="kick">TO BUY</span><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><p>{h.kitchenReady?(buyNames?`${buyNames}…`:"we have it all"):"check the kitchen first"}</p><button className="hm-btn primary" disabled={!h.shoppingNeeds.length} onClick={()=>{setShopOpen(true);feedback("tap")}}>Shop mode</button></div>
   <div className="hm-plan-tile peach"><span className="kick">TO PREP</span><b>{h.kitchenReady?h.prepNeeds.length:"—"}</b><p>{h.kitchenReady?(prepLine||"freezer covers it"):"count the freezer first"}</p><Link className="hm-btn peach" href={h.prepNeeds.length?"/prep/day":"/prep"}>{h.prepNeeds.length?"Sunday":"Prep"}</Link></div>
  </div>
  <HomeSays actions={says.actions}>{says.text}</HomeSays>

  {useSoonIds.size>0&&<div className="hm-card hm-soon"><div className="head"><h3 className="hm-h3">Use soon</h3><Link href="/kitchen" style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>Kitchen ›</Link></div><div className="chips">{[...useSoonIds].slice(0,6).map(id=>{const item=getIngredient(id);const age=useSoonAge(id);return item?<button key={id} onClick={()=>{h.toggleUseSoon(id);feedback("change")}} aria-label={`Remove ${item.name} from use soon`}>{item.name}<small>{age?`${age}d`:"today"}</small><b>×</b></button>:null})}</div></div>}

  {reuse.length>0&&<><SectionHead title="Shared bases" action={<span style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{reuse[0].count>1?`${reuse[0].component.code} carries ${reuse[0].count} dinners`:"no overlap yet"}</span>}/>
   <div className="hm-card lg hm-reuse" style={{marginTop:14}}>
    <div className="days">{h.week.map((id,i)=>{const r=getRecipe(id);return <div key={`${id}-${i}`}><span>{days[i]}</span>{r.image?<img src={r.image} alt=""/>:<div className="ph"/>}</div>})}</div>
    <div className="rows">{reuse.map(x=><div key={x.id} style={{"--tone":toneFor(x.id)} as CSSProperties}><span className="code"><i/>{x.component.code}</span><span className="cells">{days.map((_,di)=><i key={di} className={x.days.includes(di)?"on":""}/>)}</span><b className={`n ${x.count>1?"multi":""}`}>{x.count}</b></div>)}</div>
   </div></>}

  <SectionHead title="Where the list comes from"/>
  <div className="hm-gap"><div><b>{required}</b><small>week needs</small></div><span>−</span><div className="sky"><b>{h.kitchenReady?Math.max(0,required-h.shoppingNeeds.length):"—"}</b><small>at home</small></div><span>=</span><div className="green"><b>{h.kitchenReady?h.shoppingNeeds.length:"—"}</b><small>to buy</small></div></div>

  {h.history.some(x=>h.ratings[x.mealId]?.josh||h.ratings[x.mealId]?.g)&&<><SectionHead title="How we did" action={<span className="muted">last 7 dinners</span>}/>
  <div className="hm-ratings">{(["josh","g"] as const).map(w=>{const last=h.history.slice(0,7).map(x=>h.ratings[x.mealId]?.[w]??0);const rated=last.filter(Boolean);const avg=rated.length?(rated.reduce((s,n)=>s+n,0)/rated.length).toFixed(1):"—";const note=Object.entries(h.recipeNotes).flatMap(([,l])=>l).filter(n=>n.author===w).sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime())[0];return <div key={w} className="hm-card lg" style={{"--bar":w==="josh"?"linear-gradient(180deg,#ffb48f,#ff8a5c)":"linear-gradient(180deg,#6fd39a,#2fae6e)"} as CSSProperties}><div className="head"><Avatar who={w} size="sm" className="hm-avatar"/><b className="avg">{avg}{avg!=="—"?"★":""}</b></div><div className="bars">{Array.from({length:7},(_,i)=>{const v=last[6-i]??0;return <i key={i} className={v?"":"empty"} style={{height:v?`${v/5*100}%`:"12%"}}/>})}</div>{note&&<q>{note.text}</q>}</div>})}</div></>}

  <SectionHead title="This month" action={<button onClick={()=>{setPoolOpen(true);setPoolFilter("All");feedback("tap")}}>{monthRecipes.length} in pool · Edit</button>}/>
  {monthRecipes.length?<div className="hm-rail">{monthRecipes.map(r=><MealTile key={r.id} recipe={r}/>)}</div>:<div className="hm-empty"><strong>The pool is empty.</strong>Add a few dinners we actually want this month.<br/><button onClick={()=>setPoolOpen(true)}>Pick dinners ›</button></div>}

  <Sheet open={swap!==null} onClose={()=>setSwap(null)} label={swap!==null?`Swap ${longDays[swap]} dinner`:"Swap"} title={swap!==null?`Swap ${longDays[swap]}`:""} sub="Ranked by what’s in the kitchen and what needs using.">
   <label className="hm-search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a recipe" aria-label="Find a recipe" autoFocus/>{q&&<button type="button" className="clear" onClick={()=>setQ("")} aria-label="Clear">×</button>}</label>
   {swapResults.length?<div className="hm-list">{swapResults.slice(0,20).map(r=>{const rd=ready(r);const title=recipeTitle(r.id,r.title);return <button key={r.id} className="hm-card solid hm-row hm-lift" onClick={()=>chooseSwap(r)} aria-label={`Choose ${title}`}>{r.image?<img className="thumb" src={r.image} alt="" loading="lazy"/>:<span className="thumb"/>}<span><strong>{title}</strong><small>{mealMeta(r)} · {reason(r)}</small></span><span className={`hm-pill ${rd.pillClass}`}>{rd.label}</span></button>})}</div>:<div className="hm-empty"><strong>No recipe matches that.</strong>Try another name.</div>}
  </Sheet>

  <Sheet open={suggested!==null} onClose={()=>setSuggested(null)} label="Suggested week" className="hm-suggest-sheet">
   <div style={{display:"flex",gap:12,alignItems:"flex-start"}}><Orb size={44}/><div><h2 className="hm-h2" style={{fontSize:24,lineHeight:1.1,letterSpacing:"-.03em"}}>A week that fits us</h2><p className="hm-sheet-sub">Uses the fridge first, reuses prep, keeps weeknights quick. Say no to any day.</p></div></div>
   <div className="hm-stats" style={{marginInline:0,marginTop:16}}><Stat v={suggestedSoon} k="use-soon foods" tint="var(--tint-peach)"/><Stat v={h.kitchenReady?suggestedReady:"—"} k="ready now"/><Stat v={suggestedReuse} k="prep reused" tint="var(--tint-sky)"/></div>
   <div className="hm-list tight" style={{paddingTop:16}}>{suggestedRecipes.map((r,i)=><div key={`${r.id}-${i}`} className="hm-card solid hm-suggest"><span className="day">{days[i]}</span>{r.image?<img src={r.image} alt=""/>:<span className="ph"/>}<span><strong>{recipeTitle(r.id,r.title)}</strong><small>{mealMeta(r)}</small></span><div className="acts"><Link className="ok" href={`/cook/${r.id}`} aria-label={`Open ${recipeTitle(r.id,r.title)}`}>›</Link><button className="swap" aria-label={`Swap ${days[i]}`} onClick={()=>swapSuggested(i)}>⇄</button></div></div>)}</div>
   <div className="hm-sheet-actions"><button className="hm-btn ghost" onClick={()=>setSuggested(null)}>Keep current</button><button className="hm-btn primary" onClick={acceptWeek}>Use this week</button></div>
  </Sheet>

  <Sheet open={poolOpen} onClose={()=>setPoolOpen(false)} label="Edit this month's pool" title={new Date().toLocaleDateString(undefined,{month:"long"})} action={<span className="muted">{h.monthlyPool.length} in pool</span>}>
   <HomeSays className="tight">A good month is favourites, a few we haven’t had lately, two quick backups and one new thing.</HomeSays>
   <div className="hm-chips" style={{padding:"14px 0 8px"}}>{poolFilters.map(f=><button key={f} className={`hm-chip sm ${poolFilter===f?"on":""}`} onClick={()=>{setPoolFilter(f);feedback("tap")}}>{f}</button>)}</div>
   <div className="hm-pool">{poolCandidates.map(r=>{const on=inMonth(r.id);return <button key={r.id} className={on?"on":""} aria-pressed={on} onClick={()=>{h.toggleMonthlyPool(r.id);feedback("change")}}>{r.image&&<img src={r.image} alt="" loading="lazy"/>}<div className="shade"/><span className="tick">{on?"✓":"+"}</span><strong>{recipeTitle(r.id,r.title)}</strong></button>})}</div>
   <button className="hm-btn primary full" style={{marginTop:18,height:56}} onClick={()=>{setPoolOpen(false);feedback("tap")}}>Done</button>
  </Sheet>

  <Sheet open={shopOpen} onClose={()=>setShopOpen(false)} label="Shopping list" title="Shopping" action={<span className="muted">{checked.length}/{h.shoppingNeeds.length}</span>}>
   <div style={{marginTop:16}}><Progress pct={shopPct}/></div>
   <HomeSays className="tight">{h.shoppingNeeds.length} things for the week{buyNames?` — ${buyNames} first`:""}. Only what you tick goes into the kitchen.</HomeSays>
   {shopGroups.map(g=><div key={g.cat} className="hm-shop-group"><div className="head"><h3 className="hm-h3">{g.cat}</h3><small>{g.items.filter(x=>h.groceryChecked[x.id]).length}/{g.items.length}</small></div><div className="items">{g.items.map(x=>{const d=getIngredient(x.id);const on=!!h.groceryChecked[x.id];return <button key={x.id} className={`hm-checkrow ${on?"done":""}`} aria-pressed={on} onClick={()=>{h.toggleGrocery(x.id);feedback("tap")}}><Check on={on}/><span className="name">{d?.name}</span><small>{formatQty(x.qty,x.unit)}</small></button>})}</div></div>)}
   <button className="hm-btn primary full" style={{marginTop:22,height:58}} disabled={!checked.length} onClick={finishShopping}>Finish · add {checked.length} to Kitchen</button>
  </Sheet>
  {toast&&<Toast text={toast}/>}
 </div>;
}
