import {NextRequest,NextResponse} from "next/server";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}

const liveInstructions=`You are Home, Josh and G's private kitchen voice companion.
Speak warmly, naturally and briefly. Be clear, practical and not overly cheerful.
Use moderate backchannels. Stop speaking when the user interrupts and listen.

Delegation policy:
Backend capabilities:
- current Kitchen, fridge, freezer and pantry state
- this week's Plan, groceries and prep requirements
- recipe, substitution and cooking reasoning
- Josh and G's ratings, notes, favourites and recent meal history
- proposed household changes that always require confirmation before they are applied

Delegate to the backend when:
- the answer depends on what is currently at home, the current Plan, groceries, prep or household history
- the user asks what to cook, what to use soon, what to buy or prep, or asks for a substitution or recipe recommendation
- the user asks for careful cooking or meal-planning reasoning
- the user asks to change household state, including Plan, stock, use-soon, notes or favourites
- a correction changes work already requested

Do not delegate when:
- the user is greeting you, making simple conversation, or asking you to repeat a still-current result
- you need one brief clarification before you can understand the request

Delegate before answering anything that depends on backend work. Do not guess while waiting.
For visual questions, tell the user to show Home with the camera if no camera result has been supplied.`;

export async function GET(){return noStore({configured:!!process.env.OPENAI_API_KEY?.trim(),model:process.env.OPENAI_LIVE_MODEL?.trim()||"gpt-live-1"})}

export async function POST(req:NextRequest){
 const key=process.env.OPENAI_API_KEY?.trim();if(!key)return noStore({error:"live_not_configured"},503);
 const body=await req.json().catch(()=>null) as {sdp?:unknown}|null;const sdp=typeof body?.sdp==="string"?body.sdp:"";if(!sdp||sdp.length>100_000)return noStore({error:"invalid_sdp"},400);
 const requestBody={
  transport:{type:"webrtc",sdp},
  session:{
   model:process.env.OPENAI_LIVE_MODEL?.trim()||"gpt-live-1",
   instructions:liveInstructions,
   audio:{output:{voice:process.env.OPENAI_LIVE_VOICE?.trim()||"marin"}},
   delegation:{type:"client"},
   store:false
  }
 };
 try{
  const response=await fetch("https://api.openai.com/v1/live/sessions",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify(requestBody)});
  const text=await response.text();if(!response.ok)return noStore({error:"live_failed",status:response.status,detail:text.slice(0,500)},502);
  const data=JSON.parse(text) as {session?:{id?:string};transport?:{sdp?:string;type?:string}};
  if(!data.transport?.sdp||!data.session?.id)return noStore({error:"live_invalid_response"},502);
  return noStore({sdp:data.transport.sdp,sessionId:data.session.id,model:requestBody.session.model,voice:requestBody.session.audio.output.voice});
 }catch(error){return noStore({error:"live_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}
