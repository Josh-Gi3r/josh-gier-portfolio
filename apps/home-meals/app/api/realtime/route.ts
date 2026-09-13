import {NextRequest} from "next/server";

export const dynamic="force-dynamic";
function compactState(value:unknown){if(!value||typeof value!=="object")return {};const s=value as Record<string,unknown>;return {week:s.week,componentStock:s.componentStock,ingredientStock:s.ingredientStock,useSoon:s.useSoon,favourites:s.favourites,ratings:s.ratings,history:Array.isArray(s.history)?s.history.slice(0,12):[],prepBatches:Array.isArray(s.prepBatches)?s.prepBatches.slice(0,30):[],kitchenReady:s.kitchenReady}}

export async function POST(req:NextRequest){
 const key=process.env.OPENAI_API_KEY?.trim();if(!key)return Response.json({error:"realtime_not_configured"},{status:503,headers:{"Cache-Control":"no-store"}});
 const body=await req.json().catch(()=>null) as {sdp?:unknown;state?:unknown}|null;const sdp=typeof body?.sdp==="string"?body.sdp:"";if(!sdp||sdp.length>100_000)return Response.json({error:"invalid_sdp"},{status:400});
 const household=JSON.stringify(compactState(body?.state)).slice(0,60_000);
 const session={type:"realtime",model:process.env.OPENAI_REALTIME_MODEL?.trim()||"gpt-realtime-2.1-mini",instructions:`You are Home, Josh and G's private household kitchen voice assistant. Be warm, concise and practical. Use only the household state below for claims about stock, prep, plan, ratings or history. Never invent inventory and never claim you changed household state. If something is unknown, say what needs checking. Household state: ${household}`,max_output_tokens:700};
 try{
  const form=new FormData();form.set("sdp",new Blob([sdp],{type:"application/sdp"}),"offer.sdp");form.set("session",new Blob([JSON.stringify(session)],{type:"application/json"}),"session.json");
  const response=await fetch("https://api.openai.com/v1/realtime/calls",{method:"POST",headers:{Authorization:`Bearer ${key}`},body:form});
  const text=await response.text();if(!response.ok)return Response.json({error:"realtime_failed",status:response.status,detail:text.slice(0,500)},{status:502,headers:{"Cache-Control":"no-store"}});
  return new Response(text,{status:201,headers:{"Content-Type":"application/sdp","Cache-Control":"no-store"}});
 }catch(error){return Response.json({error:"realtime_failed",detail:error instanceof Error?error.message:"unknown"},{status:502,headers:{"Cache-Control":"no-store"}})}
}
