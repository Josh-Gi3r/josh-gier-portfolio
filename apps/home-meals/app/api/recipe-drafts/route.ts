import {NextRequest,NextResponse} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {getDraft,listDrafts,memoryConfigured,saveDraft,updateDraft,type StoredDraft} from "@/lib/server-memory";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function auth(req:NextRequest){return !syncConfigured()||verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
const statuses=new Set<StoredDraft["status"]>(["idea","draft","cooked","revised","household_approved"]);

export async function GET(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({configured:false,drafts:[]});
 const id=new URL(req.url).searchParams.get("id");if(id){const draft=await getDraft(id);return draft?noStore({configured:true,draft}):noStore({error:"not_found"},404)}
 return noStore({configured:true,drafts:await listDrafts()});
}

export async function POST(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const body=await req.json().catch(()=>null) as {title?:unknown;payload?:unknown;provenance?:unknown}|null;
 const title=typeof body?.title==="string"?body.title.trim():"",payload=body?.payload&&typeof body.payload==="object"?body.payload as Record<string,unknown>:null;
 if(!title||!payload)return noStore({error:"invalid_draft"},400);
 const draft=await saveDraft({title,status:"draft",payload,provenance:body?.provenance&&typeof body.provenance==="object"?body.provenance as Record<string,unknown>:undefined});
 return noStore({draft},201);
}

export async function PATCH(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const body=await req.json().catch(()=>null) as {id?:unknown;status?:unknown;payload?:unknown}|null,id=typeof body?.id==="string"?body.id:"",status=typeof body?.status==="string"&&statuses.has(body.status as StoredDraft["status"])?body.status as StoredDraft["status"]:undefined,payload=body?.payload&&typeof body.payload==="object"?body.payload as Record<string,unknown>:undefined;
 if(!id||(!status&&!payload))return noStore({error:"invalid_draft_update"},400);
 const draft=await updateDraft(id,{status,payload});return draft?noStore({draft}):noStore({error:"not_found"},404);
}
