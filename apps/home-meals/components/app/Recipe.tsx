"use client";
import Link from "next/link";
import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {useHousehold} from "../HouseholdState";
import {getComponent,getIngredient,getRecipe} from "@/data/home-data";
import {recipeSubtitle,recipeTitle} from "@/data/recipe-display";
import {nutritionFor} from "@/data/recipe-nutrition";
import {ingredientRequirementMissing} from "@/data/stock-math";
import {feedback} from "@/lib/feedback";
import {getHouseholdPerson} from "@/lib/device-profile";
import {phaseCounts,phaseFor,phases,stepMinutes,stepSeconds} from "@/lib/steps";
import {portionWord,toneFor} from "@/lib/tones";
import {HomeSays} from "./HomeSays";
import {Orb,Waves} from "./Orb";
import {Avatar,RoundBack,SectionHead,Sheet,Stat,Toast,useReadiness} from "./Primitives";

const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const longDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const noteChips=["More chilli","Less salt","Bigger portion","Faster next time","Perfect as is"];
type Author="josh"|"g";
const who=(a:Author|"home")=>a==="josh"?"Josh":a==="g"?"G":"Home";

export function Recipe({id}:{id:string}){
 const h=useHousehold();const r=getRecipe(id);const ready=useReadiness()(r);
 const[weekOpen,setWeekOpen]=useState(false);const[noteOpen,setNoteOpen]=useState(false);const[note,setNote]=useState("");const[author,setAuthor]=useState<Author>("josh");const[toast,setToast]=useState("");
 useEffect(()=>{const person=getHouseholdPerson();if(person)setAuthor(person)},[]);
 const title=recipeTitle(r.id,r.title),subtitle=recipeSubtitle(r.id,r.subtitle);const n=nutritionFor(r.id);
 const today=(new Date().getDay()+6)%7;const inWeek=h.week.indexOf(id);
 const cooked=h.history.filter(x=>x.mealId===id);const rating=h.ratings[id]??{};const lastNote=h.recipeNotes[id]?.[0];const versions=h.recipeVersions[id]??[];const currentVersion=versions[0]?.number??1;const favourite=!!h.favourites[id];const photo=h.mealPhotos.find(x=>x.mealId===id);
 const events=useMemo(()=>[...cooked.map(x=>({at:x.at,title:"Cooked",text:"Dinner logged",dot:"#6fd39a"})),...(h.recipeNotes[id]??[]).map(x=>({at:x.at,title:`${who(x.author)}’s note`,text:x.text,dot:"#2fae6e"})),...versions.map(v=>({at:v.at,title:`v${v.number} · ${v.summary}`,text:`Adopted by ${who(v.author)}`,dot:"#2fae6e"}))].sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime()).slice(0,6),[cooked,h.recipeNotes,id,versions]);
 const have=r.ingredients.filter(x=>!x.optional&&!ingredientRequirementMissing(x,h.ingredientStock)).length;const need=r.ingredients.filter(x=>!x.optional).length;
 const counts=phaseCounts(r.steps.length);
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1600)};
 const promote=(summary:string,by:Author|"home"="home")=>{const clean=summary.trim();if(!clean||clean===versions[0]?.summary)return;h.promoteRecipeVersion(id,clean,by);feedback("success");flash(`Saved as our v${currentVersion+1}`)};
 const saveNote=()=>{const clean=note.trim();if(!clean)return;h.noteMeal(id,clean,author);setNote("");setNoteOpen(false);feedback("success");flash("Note saved")};
 const suggestedDay=useMemo(()=>{for(let d=0;d<7;d++){const i=(today+d)%7;if(h.week[i]!==id)return i}return today},[today,h.week,id]);
 const[pickedDay,setPickedDay]=useState<number|null>(null);const targetDay=pickedDay??suggestedDay;
 const addToWeek=()=>{h.setDay(targetDay,id);setWeekOpen(false);feedback("change");flash(`On ${longDays[targetDay]}`)};

 const says=(()=>{
  const topRating=Math.max(rating.josh??0,rating.g??0);const topWho=(rating.g??0)>=(rating.josh??0)?"G":"Josh";
  if(cooked.length===0&&!lastNote)return {text:ready.state==="ready"?<>We haven’t cooked this one yet, and everything for it is here. Want it tonight?</>:ready.state==="missing"?<>We haven’t cooked this one yet. We’d need {ready.missing} {ready.missing===1?"thing":"things"} from the shop first.</>:<>We haven’t cooked this one yet. Check the kitchen and I’ll tell you what’s missing.</>,actions:ready.state==="ready"?<><Link className="primary" href={`/cook/${id}/cook`}>Cook it now</Link><button className="ghost" onClick={()=>setWeekOpen(true)}>Add to week</button></>:<><button className="primary" onClick={()=>setWeekOpen(true)}>Add to week</button><Link className="ghost" href="/plan">See the list</Link></>};
  if(lastNote&&lastNote.text!==versions[0]?.summary)return {text:<>{topRating?`${topWho} gave this ${topRating}★ last time. `:""}{who(lastNote.author)} wrote “{lastNote.text}”. Make that our v{currentVersion+1}?</>,actions:<><button className="primary" onClick={()=>promote(lastNote.text,lastNote.author)}>Yes, v{currentVersion+1}</button><button className="ghost" onClick={()=>flash("Kept as is")}>Keep it</button></>};
  return {text:<>{topRating?`${topWho} gave this ${topRating}★ last time. `:""}Cooked {cooked.length} {cooked.length===1?"time":"times"}{versions[0]?`, now on our v${currentVersion} — “${versions[0].summary}”`:""}.</>,actions:<><button className="primary" onClick={()=>setWeekOpen(true)}>Add to week</button><button className="ghost" onClick={()=>setNoteOpen(true)}>Add a note</button></>};
 })();

 return <div className="hm-screen flush">
  <div className="hm-hero">
   {r.image?<img src={photo?.dataUrl??r.image} alt={title} width={780} height={840} loading="eager" fetchPriority="high" decoding="async"/>:<div className="initial">{title[0]}</div>}
   <div className="shade"/>
   <div className="top"><RoundBack href="/cook" onPhoto label="Back to recipes"/><button className={`hm-round onphoto ${favourite?"heart":""}`} aria-label={favourite?"Remove from favourites":"Add to favourites"} onClick={()=>{h.toggleFavourite(id);feedback("change")}}>{favourite?"♥":"♡"}</button></div>
  </div>
  <div className="hm-sheetpage" style={{paddingBottom:140}}>
   <span className="hm-kicker">{r.cuisine} · {inWeek>=0?longDays[inWeek]:"not in the week"}</span>
   <h1 className="hm-recipe-title">{title}</h1>
   <p className="hm-lead" style={{marginTop:8}}>{subtitle}</p>
   <div className="hm-stats four"><Stat v={r.minutes} k="min"/><Stat v={n?.kcal??"—"} k="kcal" tint="var(--tint-peach)"/><Stat v={n?`${n.protein} g`:"—"} k="protein"/><Stat v="2" k="portions" tint="var(--tint-sky)"/></div>
   <div className="hm-fine">Per portion · {r.method} · {r.difficulty}</div>
   <HomeSays actions={says.actions}>{says.text}</HomeSays>

   <SectionHead title="What goes in" action={<span className={h.kitchenReady?(have===need?"":"peach"):"muted"} style={{fontSize:13,fontWeight:700,color:h.kitchenReady?(have===need?"var(--green)":"var(--peach-text)"):"var(--muted)"}}>{h.kitchenReady?`${have}/${need} at home`:"kitchen not checked"}</span>}/>
   <div className="hm-ing">
    {r.prep.map(p=>{const c=getComponent(p.id);if(!c)return null;const has=(h.componentStock[p.id]??0)>=p.totalMl;return <span key={p.id} className={!h.kitchenReady?"unknown":has?"":"missing"}><i style={{background:toneFor(p.id)}}/>{c.code} · {p.portions} {portionWord(p.id,p.portions)}{h.kitchenReady&&!has?" · short":""}</span>})}
    {r.ingredients.map(x=>{const d=getIngredient(x.id);const missing=h.kitchenReady&&ingredientRequirementMissing(x,h.ingredientStock);return <span key={`${x.id}-${x.raw}`} className={`${x.optional?"optional":""} ${!h.kitchenReady?"unknown":missing?"missing":""}`}><i/>{d?.name??x.id} · {x.display}{x.optional?" · optional":""}</span>})}
   </div>

   <SectionHead title="How it goes" action={<span className="muted">{r.steps.length} steps · {r.minutes} min</span>}/>
   <div className="hm-overview">{phases.map((p,i)=>counts[i]?<i key={p.name} style={{flex:counts[i],background:p.bar}}/>:null)}</div>
   <div className="hm-overview-labels">{phases.map((p,i)=>counts[i]?<span key={p.name}>{p.name}</span>:null)}</div>
   <div className="hm-steps">{r.steps.map((s,i)=>{const p=phaseFor(i,r.steps.length);const mins=stepMinutes(s),secs=stepSeconds(s);return <div key={i} className="hm-card hm-step" style={{"--phase":p.gradient} as CSSProperties}><b>{i+1}</b><div><p>{s}</p></div>{mins?<span className="timer">{mins}:00</span>:secs?<span className="timer">0:{String(secs).padStart(2,"0")}</span>:<span/>}</div>})}</div>

   {(cooked.length>0||lastNote||versions.length>0||photo)&&<>
    <SectionHead title="Our history" action={<button onClick={()=>setNoteOpen(true)}>Add a note</button>}/>
    <div className="hm-stats"><Stat v={`${cooked.length}×`} k="cooked"/><Stat v={`v${currentVersion}`} k="our version" tint="var(--tint-peach)"/><Stat v={rating.josh||rating.g?`${(((rating.josh??0)+(rating.g??0))/((rating.josh?1:0)+(rating.g?1:0)||1)).toFixed(1)}★`:"—"} k={rating.josh||rating.g?`J ${rating.josh??"—"} · G ${rating.g??"—"}`:"not rated"} tint="var(--tint-sky)"/></div>
    {events.length>0&&<div className="hm-history"><i className="line"/><div className="items">{events.map((e,i)=><article key={`${e.at}-${i}`} className="hm-card" style={{"--dot":e.dot} as CSSProperties}><i className="dot"/><div className="head"><strong>{e.title}</strong><small>{new Date(e.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</small></div><p>{e.text}</p></article>)}</div></div>}
    <Link className="hm-card hm-version hm-lift" href={`/scan?mode=Meal&meal=${id}&back=${encodeURIComponent(`/cook/${id}`)}`}><div><span className="kick">{photo?"OUR PHOTO":"DINNER PHOTO"}</span><strong>{photo?"Replace our dinner photo":"Save a photo of our dinner"}</strong><small>Kept with this recipe on this phone.</small></div><span style={{fontSize:22,color:"var(--muted)"}}>›</span></Link>
   </>}
   {cooked.length===0&&!lastNote&&<div className="hm-empty" style={{marginInline:0,marginTop:28}}><strong>Not cooked by us yet.</strong>Cook it once and rate it — then it becomes ours.</div>}

   <div className="hm-card hm-ref"><p>{r.balance}</p><a href={r.source.url} target="_blank" rel="noreferrer">Reference ↗</a></div>
  </div>

  <div className="hm-cta split">
   <button className="hm-btn ghost icon" onClick={()=>{setPickedDay(null);setWeekOpen(true);feedback("tap")}} aria-label="Add to week">＋</button>
   <Link className="hm-btn primary" href={`/cook/${id}/cook`} onClick={()=>feedback("tap")}>Start cooking →</Link>
  </div>

  <Sheet open={weekOpen} onClose={()=>setWeekOpen(false)} label="Add recipe to week" title="Add to the week" action={<span className="muted">{title}</span>}>
   <div className="hm-days">{days.map((d,i)=>{const current=getRecipe(h.week[i]);const on=i===targetDay;return <button key={d} className={`${on?"on":""} ${i<today?"dim":""}`} onClick={()=>{setPickedDay(i);feedback("tap")}} aria-label={`${longDays[i]}, currently ${recipeTitle(current.id,current.title)}`}><span>{d}</span><div className="tile">{current.image&&<img src={current.image} alt=""/>}{on&&<span className="tick">✓</span>}{!on&&<small>{recipeTitle(current.id,current.title)}</small>}</div></button>})}</div>
   <HomeSays className="tight">{longDays[targetDay]} {targetDay===today?"is tonight":"is open"} — {inWeek>=0&&inWeek!==targetDay?`this is already on ${longDays[inWeek]}, so this adds it a second time.`:"put it there?"}</HomeSays>
   <button className="hm-btn primary full" style={{marginTop:18,height:56}} onClick={addToWeek}>Put it on {longDays[targetDay]}</button>
  </Sheet>

  <Sheet open={noteOpen} onClose={()=>setNoteOpen(false)} label="Save a note" title="Next time" action={<span className="muted">{title} · v{currentVersion}</span>}>
   <div className="hm-authors" style={{marginTop:18}}>{(["josh","g"] as const).map(a=><button key={a} className={author===a?"on":""} aria-pressed={author===a} onClick={()=>{setAuthor(a);feedback("tap")}}><Avatar who={a} size="sm"/>{who(a)}</button>)}</div>
   <div className="hm-card solid hm-notebox" style={{marginTop:14}}><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="More chilli — two CH cubes. Egg crispier at the edge." aria-label="Note for next time" autoFocus/><div className="chips">{noteChips.map(c=><button key={c} className="hm-chip tint" onClick={()=>setNote(v=>v?`${v.replace(/\.?\s*$/,"")}. ${c}.`:`${c}.`)}>{c}</button>)}</div></div>
   <div className="hm-notebox foot" style={{padding:"14px 0 0",display:"flex",alignItems:"center",gap:10,color:"var(--muted-2)",fontSize:13,fontWeight:600}}><button className="hm-round" aria-label="Talk to Home"><Waves/></button>or just say it</div>
   <div className="hm-sheet-actions"><button className="hm-btn ghost" disabled={!note.trim()} onClick={()=>{promote(note,author);setNote("");setNoteOpen(false)}}>Make it v{currentVersion+1}</button><button className="hm-btn primary" disabled={!note.trim()} onClick={saveNote}>Save note</button></div>
  </Sheet>
  {toast&&<Toast text={toast}/>}
  <span hidden><Orb size={1}/></span>
 </div>;
}
