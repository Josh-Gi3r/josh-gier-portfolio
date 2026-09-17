import {NextRequest,NextResponse} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {conversationMessages,ensureConversation,latestConversation,memoryConfigured} from "@/lib/server-memory";
import type {HouseholdPerson} from "@/lib/josh-conversation";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function auth(req:NextRequest){return !syncConfigured()||verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
function personOf(value:unknown):HouseholdPerson{return value==="g"?"g":"josh"}

export async function GET(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({configured:false,conversation:null,messages:[]});
 const url=new URL(req.url),person=personOf(url.searchParams.get("person")),requested=url.searchParams.get("id");
 const conversation=requested?await ensureConversation(person,requested):await latestConversation(person);
 if(!conversation)return noStore({configured:true,conversation:null,messages:[]});
 return noStore({configured:true,conversation,messages:await conversationMessages(conversation.id,60)});
}

export async function POST(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const body=await req.json().catch(()=>null) as {person?:unknown;conversationId?:unknown}|null,person=personOf(body?.person),conversationId=typeof body?.conversationId==="string"?body.conversationId:null;
 const conversation=await ensureConversation(person,conversationId);
 return noStore({conversation});
}
