import {NextRequest,NextResponse} from "next/server";
import {createSessionToken,SESSION_COOKIE,sessionMaxAge,syncConfigured,verifyHouseholdCode,verifySessionToken} from "@/lib/server-household";

export const dynamic="force-dynamic";

export async function GET(req:NextRequest){
 const configured=syncConfigured();
 const authenticated=configured&&verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
 return NextResponse.json({configured,authenticated},{headers:{"Cache-Control":"no-store"}});
}

export async function POST(req:NextRequest){
 if(!syncConfigured())return NextResponse.json({error:"sync_not_configured"},{status:503});
 const body=await req.json().catch(()=>({})) as {code?:unknown};
 const code=typeof body.code==="string"?body.code.trim():"";
 if(!code||!verifyHouseholdCode(code))return NextResponse.json({error:"invalid_code"},{status:401});
 const res=NextResponse.json({ok:true});
 res.cookies.set(SESSION_COOKIE,createSessionToken(),{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:sessionMaxAge()});
 res.headers.set("Cache-Control","no-store");return res;
}

export async function DELETE(){
 const res=NextResponse.json({ok:true});
 res.cookies.set(SESSION_COOKIE,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});
 res.headers.set("Cache-Control","no-store");return res;
}
