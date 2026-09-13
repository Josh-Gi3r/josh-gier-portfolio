import {NextRequest,NextResponse} from "next/server";
import {readHousehold,SESSION_COOKIE,syncConfigured,verifySessionToken,writeHousehold} from "@/lib/server-household";

export const dynamic="force-dynamic";

function auth(req:NextRequest){return syncConfigured()&&verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
function noStore<T>(body:T,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}

export async function GET(req:NextRequest){
 if(!syncConfigured())return noStore({error:"sync_not_configured"},503);
 if(!auth(req))return noStore({error:"unauthorized"},401);
 try{
  const row=await readHousehold();
  if(!row)return noStore({version:0,payload:null,updatedAt:null});
  return noStore({version:row.version,payload:row.payload,updatedAt:row.updated_at});
 }catch(error){return noStore({error:"sync_read_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}

export async function PUT(req:NextRequest){
 if(!syncConfigured())return noStore({error:"sync_not_configured"},503);
 if(!auth(req))return noStore({error:"unauthorized"},401);
 const body=await req.json().catch(()=>null) as {baseVersion?:unknown;payload?:unknown}|null;
 const baseVersion=Number(body?.baseVersion??0);const payload=body?.payload;
 if(!Number.isInteger(baseVersion)||baseVersion<0||!payload||typeof payload!=="object"||Array.isArray(payload))return noStore({error:"invalid_payload"},400);
 const encoded=JSON.stringify(payload);if(encoded.length>1_500_000)return noStore({error:"payload_too_large"},413);
 try{
  const result=await writeHousehold(payload as Record<string,unknown>,baseVersion);
  if(result==="conflict")return noStore({error:"conflict"},409);
  return noStore({version:result.version,payload:result.payload,updatedAt:result.updated_at});
 }catch(error){return noStore({error:"sync_write_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}
