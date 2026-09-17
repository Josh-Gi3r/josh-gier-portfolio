import {NextRequest,NextResponse} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {deleteMemory,listMemories,memoryConfigured,saveMemory} from "@/lib/server-memory";
import {MEMORY_KINDS,type HouseholdPerson,type MemoryKind} from "@/lib/josh-conversation";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function auth(req:NextRequest){return !syncConfigured()||verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
function personOf(value:unknown):HouseholdPerson|null{return value==="josh"||value==="g"?value:null}

export async function GET(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({configured:false,memories:[]});
 return noStore({configured:true,memories:await listMemories()});
}

export async function POST(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const body=await req.json().catch(()=>null) as {subject?:unknown;kind?:unknown;text?:unknown;sourcePerson?:unknown;provenance?:unknown}|null;
 const subject=typeof body?.subject==="string"?body.subject.trim():"",text=typeof body?.text==="string"?body.text.trim():"",kind=String(body?.kind??"") as MemoryKind;
 if(!subject||!text||!MEMORY_KINDS.includes(kind))return noStore({error:"invalid_memory"},400);
 const memory=await saveMemory({subject,kind,text,sourcePerson:personOf(body?.sourcePerson),status:"confirmed",provenance:body?.provenance&&typeof body.provenance==="object"?body.provenance as Record<string,unknown>:undefined});
 return noStore({memory},201);
}

export async function DELETE(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const url=new URL(req.url),id=url.searchParams.get("id");if(!id)return noStore({error:"id_required"},400);
 return noStore({deleted:await deleteMemory(id)});
}
