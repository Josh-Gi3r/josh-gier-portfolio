import {NextRequest,NextResponse} from "next/server";
import {createSessionToken,SESSION_COOKIE,sessionMaxAge,syncConfigured,verifyHouseholdCode,verifySessionToken} from "@/lib/server-household";
import {clearRateLimit,consumeRateLimit,requestRateKey} from "@/lib/server-rate-limit";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200,headers?:Record<string,string>){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store",...(headers??{})}})}

export async function GET(req:NextRequest){
 const configured=syncConfigured();
 const authenticated=configured&&verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
 return noStore({configured,authenticated});
}

export async function POST(req:NextRequest){
 if(!syncConfigured())return noStore({error:"sync_not_configured"},503);
 const limiterKey=requestRateKey(req.headers,"household-code"),limit=consumeRateLimit(limiterKey,10,15*60*1000);
 if(!limit.ok)return noStore({error:"too_many_attempts"},429,{"Retry-After":String(limit.retryAfterSeconds)});
 const body=await req.json().catch(()=>({})) as {code?:unknown};
 const code=typeof body.code==="string"?body.code.trim():"";
 if(!code||!verifyHouseholdCode(code))return noStore({error:"invalid_code"},401);
 clearRateLimit(limiterKey);
 const res=noStore({ok:true});
 res.cookies.set(SESSION_COOKIE,createSessionToken(),{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:sessionMaxAge()});
 return res;
}

export async function DELETE(){
 const res=noStore({ok:true});
 res.cookies.set(SESSION_COOKIE,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});
 return res;
}
