import {NextRequest,NextResponse} from "next/server";
import {readHousehold,SESSION_COOKIE,syncConfigured,verifySessionToken,writeHousehold} from "@/lib/server-household";

export const dynamic="force-dynamic";

function auth(req:NextRequest){return syncConfigured()&&verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
function noStore<T>(body:T,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function record(value:unknown):value is Record<string,unknown>{return!!value&&typeof value==="object"&&!Array.isArray(value)}
function validV12Payload(value:unknown){
 if(!record(value)||value.version!==12)return false;
 if(!Array.isArray(value.week)||value.week.length!==7||value.week.some(x=>typeof x!=="string"))return false;
 if(!Array.isArray(value.monthlyPool)||value.monthlyPool.some(x=>typeof x!=="string"))return false;
 if(!Array.isArray(value.activePrepIds)||value.activePrepIds.length>41||value.activePrepIds.some(x=>typeof x!=="string"))return false;
 if(!Array.isArray(value.componentBatches)||!Array.isArray(value.history)||!Array.isArray(value.cookObservations))return false;
 if(value.history.length>100||value.cookObservations.length>200)return false;
 for(const key of ["manualComponentStock","ingredientStock","qualitativeIngredientStock","groceryChecked","ratings","recipeNotes","recipeVersions","useSoon","useSoonAt","favourites"])if(!record(value[key]))return false;
 if(typeof value.kitchenReady!=="boolean"||!Array.isArray(value.migrationWarnings))return false;
 return true;
}

export async function GET(req:NextRequest){
 if(!syncConfigured())return noStore({error:"sync_not_configured"},503);
 if(!auth(req))return noStore({error:"unauthorized"},401);
 try{
  const row=await readHousehold();
  if(!row)return noStore({version:0,payload:null,updatedAt:null});
  if(!validV12Payload(row.payload)){console.error("Home Meals stored household payload failed v12 envelope validation");return noStore({error:"sync_state_invalid"},500)}
  return noStore({version:row.version,payload:row.payload,updatedAt:row.updated_at});
 }catch(error){console.error("Home Meals sync read failed",error);return noStore({error:"sync_read_failed"},502)}
}

export async function PUT(req:NextRequest){
 if(!syncConfigured())return noStore({error:"sync_not_configured"},503);
 if(!auth(req))return noStore({error:"unauthorized"},401);
 const body=await req.json().catch(()=>null) as {baseVersion?:unknown;payload?:unknown}|null;
 const baseVersion=Number(body?.baseVersion??0);const payload=body?.payload;
 if(!Number.isInteger(baseVersion)||baseVersion<0||!validV12Payload(payload))return noStore({error:"invalid_payload"},400);
 const encoded=JSON.stringify(payload);if(encoded.length>1_500_000)return noStore({error:"payload_too_large"},413);
 try{
  const result=await writeHousehold(payload as Record<string,unknown>,baseVersion);
  if(result==="conflict")return noStore({error:"conflict"},409);
  return noStore({version:result.version,payload:result.payload,updatedAt:result.updated_at});
 }catch(error){console.error("Home Meals sync write failed",error);return noStore({error:"sync_write_failed"},502)}
}
