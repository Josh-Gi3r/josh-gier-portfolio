"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {feedback} from "@/lib/feedback";
import {getHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import {JoshPresenceAnchor} from "./JoshPresence";

type DraftStatus="idea"|"draft"|"cooked"|"revised"|"household_approved";
type Ingredient={name:string;quantity:number|null;unit:string|null};
type DraftPayload={title?:string;servings?:number|null;ingredients?:Ingredient[];method?:string[];notes?:string[];postCookNotes?:string[];lastCookedAt?:string;ratings?:Partial<Record<HouseholdPerson,number>>;cookLog?:{at:string;by:HouseholdPerson}[];standard?:{subtitle:string;cuisine:string;minutes:number;difficulty:"Easy"|"Medium"|"Weekend";mealStyle:"light"|"balanced"|"hearty"|"rich";methodLabel:string;allergens:string[];storage:string;leftovers:string}};
type Draft={id:string;title:string;status:DraftStatus;payload:DraftPayload;provenance:Record<string,unknown>;updated_at:string};
type RecipeImage={id:string;draft_id:string;url:string;mime_type:string;model:string;quality:string;look:string|null;selected:boolean;created_at:string};
type RecipeImageState={configured:boolean;selected:RecipeImage|null;images:RecipeImage[]};
const labels:Record<DraftStatus,string>={idea:"Idea",draft:"Working draft",cooked:"Cooked once",revised:"Revised",household_approved:"One of ours"};

function quantityLabel(item:Ingredient){
 if(item.quantity==null)return item.unit||"to taste";
 return String(item.quantity)+(item.unit?" "+item.unit:"");
}
function cleanPayload(value:unknown,title:string):DraftPayload{
 const x=value&&typeof value==="object"?value as DraftPayload:{};
 return{
  ...x,
  title:typeof x.title==="string"&&x.title.trim()?x.title:title,
  servings:Number.isFinite(x.servings)?Number(x.servings):null,
  ingredients:Array.isArray(x.ingredients)?x.ingredients.filter(i=>i&&typeof i.name==="string").slice(0,50):[],
  method:Array.isArray(x.method)?x.method.filter(s=>typeof s==="string"&&s.trim()).slice(0,30):[],
  notes:Array.isArray(x.notes)?x.notes.filter(s=>typeof s==="string"&&s.trim()).slice(0,20):[],
  postCookNotes:Array.isArray(x.postCookNotes)?x.postCookNotes.filter(s=>typeof s==="string"&&s.trim()).slice(0,20):[],
  ratings:x.ratings&&typeof x.ratings==="object"?x.ratings:{},
  cookLog:Array.isArray(x.cookLog)?x.cookLog.filter(e=>e&&typeof e.at==="string"&&(e.by==="josh"||e.by==="g")).slice(0,30):[],
  standard:x.standard&&typeof x.standard==="object"?x.standard:undefined
 };
}

export function DraftRecipe({id}:{id:string}){
 const[draft,setDraft]=useState<Draft|null>(null);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState("");
 const[cooking,setCooking]=useState(false);
 const[step,setStep]=useState(0);
 const[note,setNote]=useState("");
 const[saving,setSaving]=useState(false);
 const[person,setPerson]=useState<HouseholdPerson>("josh");
 const[imageState,setImageState]=useState<RecipeImageState|null>(null),[candidate,setCandidate]=useState<RecipeImage|null>(null),[imageBusy,setImageBusy]=useState(false),[imageError,setImageError]=useState("");

 useEffect(()=>{setPerson(getHouseholdPerson()??"josh")},[]);
 useEffect(()=>{let live=true;const refresh=()=>fetch("/api/recipe-image?draftId="+encodeURIComponent(id),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>{if(live&&x)setImageState(x as RecipeImageState)}).catch(()=>{});void refresh();const handler=()=>void refresh();window.addEventListener("home-meals:recipe-image-changed",handler);return()=>{live=false;window.removeEventListener("home-meals:recipe-image-changed",handler)}},[id]);
 useEffect(()=>{
  let live=true;
  const refresh=(initial=false)=>{if(initial)setLoading(true);return fetch("/api/recipe-drafts?id="+encodeURIComponent(id),{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("draft");return r.json()}).then(x=>{if(live)setDraft(x.draft??null)}).catch(()=>{if(live)setError("I couldn’t open that working recipe.")}).finally(()=>{if(live&&initial)setLoading(false)})};
  void refresh(true);
  const handler=()=>{void refresh(false)};
  window.addEventListener("home-meals:drafts-changed",handler);
  return()=>{live=false;window.removeEventListener("home-meals:drafts-changed",handler)};
 },[id]);

 const payload=useMemo(()=>draft?cleanPayload(draft.payload,draft.title):null,[draft]);

 const patch=async(status?:DraftStatus,nextPayload?:DraftPayload)=>{
  if(!draft||saving)return null;
  setSaving(true);setError("");
  try{
   const res=await fetch("/api/recipe-drafts",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:draft.id,status,payload:nextPayload})});
   if(!res.ok)throw new Error("save");
   const x=await res.json() as {draft:Draft};
   setDraft(x.draft);
   window.dispatchEvent(new Event("home-meals:drafts-changed"));
   feedback("success");
   return x.draft;
  }catch{
   setError("That didn’t save. Try again in a sec.");
   return null;
  }finally{setSaving(false)}
 };

 const start=()=>{setStep(0);setCooking(true);feedback("tap")};
 const finish=async()=>{
  if(!payload)return;
  const at=new Date().toISOString();
  const next={...payload,lastCookedAt:at,cookLog:[{at,by:person},...(payload.cookLog??[])].slice(0,30)};
  const saved=await patch("cooked",next);
  if(saved){setCooking(false);setStep(0)}
 };
 const saveNote=async()=>{
  if(!payload||!note.trim())return;
  const next={...payload,postCookNotes:[note.trim(),...(payload.postCookNotes??[])].slice(0,20)};
  const saved=await patch(draft?.status==="draft"?"cooked":draft?.status,next);
  if(saved)setNote("");
 };
 const askRevise=()=>{
  if(!draft||!payload)return;
  window.dispatchEvent(new CustomEvent("home-meals:ask",{detail:{
   prefill:draft.status==="cooked"?"We just cooked this. Help us improve it.":"Help us improve this working recipe.",
   draftContext:{id:draft.id,title:draft.title,status:draft.status,payload}
  }}));
  feedback("tap");
 };
 const rate=async(value:number)=>{if(!payload)return;await patch(draft?.status==="draft"?"cooked":draft?.status,{...payload,ratings:{...(payload.ratings??{}),[person]:value}})};
 const standard=payload?.standard,standardReady=!!standard&&!!standard.subtitle?.trim()&&!!standard.cuisine?.trim()&&Number.isFinite(standard.minutes)&&!!standard.methodLabel?.trim()&&!!standard.storage?.trim()&&!!standard.leftovers?.trim()&&Array.isArray(standard.allergens)&&(payload?.ingredients?.length??0)>=2&&(payload?.method?.length??0)>=2&&!!imageState?.selected;
 const generateImage=async(mode:"initial"|"replace"|"candidate",lookHint?:string)=>{if(imageBusy)return;setImageBusy(true);setImageError("");try{const res=await fetch("/api/recipe-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({draftId:id,mode,lookHint:lookHint??null})});if(!res.ok)throw new Error("image");const x=await res.json() as {image:RecipeImage};if(mode==="candidate")setCandidate(x.image);else{setCandidate(null);setImageState(v=>v?{...v,selected:x.image,images:[x.image,...v.images.filter(i=>i.id!==x.image.id)]}:{configured:true,selected:x.image,images:[x.image]})}window.dispatchEvent(new Event("home-meals:recipe-image-changed"));window.dispatchEvent(new Event("home-meals:drafts-changed"));feedback("success")}catch{setImageError("Couldn’t make that image just now. Try again.")}finally{setImageBusy(false)}};
 const useCandidate=async()=>{if(!candidate||imageBusy)return;setImageBusy(true);setImageError("");try{const res=await fetch("/api/recipe-image",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({draftId:id,imageId:candidate.id})});if(!res.ok)throw new Error("select");const x=await res.json() as {image:RecipeImage};setImageState(v=>v?{...v,selected:x.image,images:v.images.map(i=>({...i,selected:i.id===x.image.id}))}:{configured:true,selected:x.image,images:[x.image]});setCandidate(null);window.dispatchEvent(new Event("home-meals:recipe-image-changed"));window.dispatchEvent(new Event("home-meals:drafts-changed"));feedback("success")}catch{setImageError("Couldn’t keep that image. Try again.")}finally{setImageBusy(false)}};
  const approve=()=>void patch("household_approved",payload??undefined);

 if(loading)return <div className="hm-screen hm-draft-recipe"><div className="hm-state"><div className="center"><JoshPresenceAnchor priority={20} expression="thinking" size={72}/><h1>Opening our recipe…</h1></div></div></div>;
 if(error&&!draft)return <div className="hm-screen hm-draft-recipe"><Link href="/cook" className="hm-round" aria-label="Back to recipes">‹</Link><div className="hm-empty"><strong>{error}</strong><br/><Link href="/cook">Back to our recipes ›</Link></div></div>;
 if(!draft||!payload)return null;

 const method=payload.method??[],ingredients=payload.ingredients??[];

 if(cooking){
  const current=method[step];
  return <div className="hm-screen hm-draft-cooking">
   <div className="hm-draft-cook-top"><button className="hm-round" onClick={()=>setCooking(false)} aria-label="Leave working recipe">×</button><span className="hm-pill">WORKING RECIPE</span><span>{step+1}/{Math.max(1,method.length)}</span></div>
   <div className="hm-draft-cook-josh"><JoshPresenceAnchor priority={30} expression="idle" size={54}/><div><span>WE’RE TRYING</span><strong>{draft.title}</strong><small>This cook won’t change Kitchen. We’re still shaping this one.</small></div></div>
   {current?<><div className="hm-draft-cook-step"><b>{step+1}</b><p>{current}</p></div>
    <details className="hm-card lg hm-draft-ingredients"><summary>Ingredients · {payload.servings?String(payload.servings)+" servings":"working amounts"}</summary>{ingredients.map((item,index)=><div key={index}><span>{item.name}</span><strong>{quantityLabel(item)}</strong></div>)}</details>
    <p className="hm-note">Use normal safe internal temperatures for meat and seafood. A photo can help with colour and texture, not food safety.</p>
    <div className="hm-draft-cook-nav"><button className="hm-btn ghost" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Back</button>{step<method.length-1?<button className="hm-btn primary" onClick={()=>setStep(s=>Math.min(method.length-1,s+1))}>Next</button>:<button className="hm-btn primary" disabled={saving} onClick={()=>void finish()}>{saving?"Saving…":"Cooked it"}</button>}</div>
   </>:<div className="hm-empty"><strong>This draft doesn’t have cooking steps yet.</strong><br/><button className="hm-btn primary sm" onClick={askRevise}>Build it with Josh</button></div>}
  </div>;
 }

 return <div className="hm-screen hm-draft-recipe">
  <div className="hm-title-row"><Link href="/cook" className="hm-round" aria-label="Back to recipes">‹</Link><div><span className="hm-kicker">OUR WORKING RECIPE</span><h1 className="hm-h1">{draft.title}</h1></div></div>
  <section className={`hm-draft-hero ${candidate?"candidate":""}`}>{(candidate??imageState?.selected)?<img src={(candidate??imageState?.selected)!.url} alt={draft.title+" generated recipe illustration"}/>:<div className="hm-draft-hero-empty"><JoshPresenceAnchor priority={18} expression="thinking" size={74}/><span>NO IMAGE YET</span><strong>Want me to picture this one?</strong></div>}<div className="hm-draft-hero-label"><span>{candidate?"NEW LOOK":imageState?.selected?"GENERATED PREVIEW":"WORKING RECIPE"}</span><small>{candidate||imageState?.selected?"AI-generated illustration · not a real photo":"Built from our recipe draft"}</small></div></section>
  <div className="hm-draft-image-actions">{candidate?<><button className="hm-btn primary" disabled={imageBusy} onClick={()=>void useCandidate()}>{imageBusy?"Keeping…":"Use this image"}</button><button className="hm-btn ghost" disabled={imageBusy} onClick={()=>setCandidate(null)}>Keep current</button></>:imageState?.selected?<><button className="hm-btn ghost" disabled={imageBusy} onClick={()=>void generateImage("replace")}>{imageBusy?"Generating…":"Regenerate"}</button><button className="hm-btn ghost" disabled={imageBusy} onClick={()=>void generateImage("candidate","A distinctly different camera angle and plating composition, while keeping the same dish.")}>Try another look</button></>:<button className="hm-btn primary" disabled={imageBusy||imageState?.configured===false} onClick={()=>void generateImage("initial")}>{imageBusy?"Generating image…":imageState?.configured===false?"Image generation unavailable":"Generate image"}</button>}</div>
  {imageError&&<p className="hm-draft-image-error">{imageError}</p>}
  <div className="hm-draft-status"><span>{labels[draft.status]}</span><small>{draft.status==="household_approved"?"We chose to keep this one. It follows the same household recipe standard, while staying separate from Home’s verified research catalogue.":"Discussion and edits stay here until we deliberately keep them."}</small></div>
  {standard&&<><p className="hm-lead hm-draft-subtitle">{standard.subtitle}</p><div className="hm-stats four hm-draft-stats"><div><strong>{standard.minutes}</strong><small>minutes</small></div><div><strong>{standard.mealStyle}</strong><small>meal style</small></div><div><strong>{payload.servings??"—"}</strong><small>servings</small></div><div><strong>{standard.difficulty}</strong><small>difficulty</small></div></div><div className="hm-fine hm-draft-standardline">{standard.cuisine} · {standard.methodLabel}{standard.allergens.length?` · Allergens: ${standard.allergens.join(", ")}`:" · No named allergens in the draft"}</div></>}
  {!standard&&<div className="hm-card lg hm-draft-standard-missing"><strong>Still a working draft</strong><span>Josh needs to finish the normal recipe details before this can become one of ours.</span></div>}
  {payload.servings&&!standard&&<p className="hm-note">{payload.servings} servings</p>}
  <section className="hm-card lg hm-draft-detail"><h2>Ingredients</h2>{ingredients.length?ingredients.map((item,index)=><div key={index}><span>{item.name}</span><strong>{quantityLabel(item)}</strong></div>):<p>No amounts written down yet.</p>}</section>
  <section className="hm-card lg hm-draft-detail"><h2>How we’re making it</h2>{method.length?method.map((line,index)=><p className="method" key={index}><i>{index+1}</i><span>{line}</span></p>):<p>No method yet. Josh can help us build it.</p>}</section>
  {(payload.notes?.length??0)>0&&<section className="hm-card lg hm-draft-detail"><h2>Notes</h2>{payload.notes!.map((line,index)=><p key={index}>{line}</p>)}</section>}
  {standard&&<section className="hm-card lg hm-draft-detail"><h2>Keeping it</h2><p><strong>Storage:</strong> {standard.storage}</p><p><strong>Leftovers:</strong> {standard.leftovers}</p></section>}
  {(payload.postCookNotes?.length??0)>0&&<section className="hm-card lg hm-draft-detail"><h2>After cooking</h2>{payload.postCookNotes!.map((line,index)=><p key={index}>{line}</p>)}</section>}
  <div className="hm-draft-actions"><button className="hm-btn primary" onClick={start} disabled={!method.length}>Start cooking</button><button className="hm-btn ghost" onClick={askRevise}>{draft.status==="cooked"?"Improve it with Josh":"Revise with Josh"}</button>{draft.status!=="household_approved"&&(draft.status==="cooked"||draft.status==="revised")&&(standardReady?<button className="hm-btn ghost" disabled={saving} onClick={approve}>{saving?"Saving…":"Make this one of ours"}</button>:<button className="hm-btn ghost" onClick={askRevise}>Finish for our library</button>)}</div>
  {(draft.status==="cooked"||draft.status==="revised"||draft.status==="household_approved")&&<section className="hm-card lg hm-draft-feedback"><div className="hm-draft-rating"><span><b>{person==="g"?"G":"Josh"}’s rating</b><small>{payload.cookLog?.length?"Cooked "+payload.cookLog.length+" "+(payload.cookLog.length===1?"time":"times"):"First cook"}</small></span><div aria-label={(person==="g"?"G":"Josh")+" rating"}>{[1,2,3,4,5].map(n=><button key={n} aria-label={"Rate "+n+" stars"} aria-pressed={(payload.ratings?.[person]??0)===n} className={(payload.ratings?.[person]??0)>=n?"on":""} onClick={()=>void rate(n)}>★</button>)}</div></div><label htmlFor="draft-note">Next time</label><textarea id="draft-note" value={note} onChange={e=>setNote(e.target.value)} placeholder="More chilli. Less wine. Cook the clams a little less."/><button className="hm-btn primary sm" disabled={!note.trim()||saving} onClick={()=>void saveNote()}>Save note</button></section>}
  {error&&<p className="hm-note">{error}</p>}
 </div>;
}
