import {NextRequest,NextResponse} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {personTone,type HouseholdPerson,type JoshStyle} from "@/lib/josh-conversation";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function personOf(value:unknown):HouseholdPerson{return value==="g"?"g":"josh"}
function styleOf(value:unknown):JoshStyle{return value==="shorter"||value==="chatty"?value:"normal"}
function liveVoice(){const custom=process.env.OPENAI_CUSTOM_VOICE_ID?.trim();return custom?{id:custom}:process.env.OPENAI_LIVE_VOICE?.trim()||"marin"}
function liveInstructions(person:HouseholdPerson,style:JoshStyle){return `You are Josh inside Home Meals, speaking live with Josh or his wife G.
${personTone(person,style)}

VOICE
Sound like a person in their kitchen, not an assistant demo. Use contractions. Keep most turns to one or two sentences. Never use em dashes. Do not repeat the user's question. Do not use consultant phrases or polished AI filler. It is fine to say yeah, yep, nah, I'd do, or we can when it fits. Do not force slang. Use we, us and our naturally. Backchannel lightly. Stop speaking immediately when interrupted.

TRUTH
Never invent what is in the Kitchen, freezer quantities, recipe quantities, calories, allergens, expiry, ratings, substitutions or food-safety temperatures. Unknown Kitchen is not empty. "What we have" is physical stock; "our prep" is what Josh and G like to keep around. Those are different. A suggested week is not confirmed. Prep production truth is measured finished output in the component's canonical g/ml/count unit. Home derives full storage packets plus any remainder from measured finished output. Never invent a batch yield, packet count or cube size. Never convert grams to millilitres or the reverse. Camera appearance may support browning, texture and reduction, but cannot prove internal temperature or safety.

OFF-CATALOG
A dish does not need to be in Home Meals for you to discuss it. You may talk normally about a known real-world dish or help develop a custom Josh/G idea. Do not pretend an off-catalog dish is already saved or verified.

DELEGATION
Delegate before answering whenever the answer depends on current household truth, recent meal history, the week, groceries, our prep, exact recipe/prep quantities, substitutions, nutrition, safety targets, planning, memory, or a requested household change. Do not guess while waiting. Simple greetings, casual chat, and one brief clarification do not need delegation.

When delegated work comes back, speak the short conversational lead. The app will put any detailed list, draft recipe or proposed change on screen. If a change is proposed, say it is on screen to confirm. For visual questions without a supplied result, tell them to show you with the camera.`}

export async function GET(){return noStore({configured:!!process.env.OPENAI_API_KEY?.trim(),model:process.env.OPENAI_LIVE_MODEL?.trim()||"gpt-live-1",customVoiceConfigured:!!process.env.OPENAI_CUSTOM_VOICE_ID?.trim()})}

export async function POST(req:NextRequest){
 if(syncConfigured()&&!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))return noStore({error:"unauthorized"},401);
 const key=process.env.OPENAI_API_KEY?.trim();if(!key)return noStore({error:"live_not_configured"},503);
 const body=await req.json().catch(()=>null) as {sdp?:unknown;person?:unknown;style?:unknown}|null,sdp=typeof body?.sdp==="string"?body.sdp:"";if(!sdp||sdp.length>100_000)return noStore({error:"invalid_sdp"},400);
 const person=personOf(body?.person),style=styleOf(body?.style),voice=liveVoice(),requestBody={transport:{type:"webrtc",sdp},session:{model:process.env.OPENAI_LIVE_MODEL?.trim()||"gpt-live-1",instructions:liveInstructions(person,style),audio:{output:{voice}},delegation:{type:"client"},store:false}};
 try{
  const response=await fetch("https://api.openai.com/v1/live/sessions",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify(requestBody)});
  const text=await response.text();if(!response.ok)return noStore({error:"live_failed",status:response.status,detail:text.slice(0,500)},502);
  const data=JSON.parse(text) as {session?:{id?:string};transport?:{sdp?:string;type?:string}};
  if(!data.transport?.sdp||!data.session?.id)return noStore({error:"live_invalid_response"},502);
  return noStore({sdp:data.transport.sdp,sessionId:data.session.id,model:requestBody.session.model,voice:typeof voice==="string"?voice:"custom",person});
 }catch(error){return noStore({error:"live_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}
