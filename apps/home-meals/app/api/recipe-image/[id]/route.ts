import {NextRequest} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {getRecipeImage,memoryConfigured} from "@/lib/server-memory";

export const dynamic="force-dynamic";
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(syncConfigured()&&!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))return new Response("Unauthorized",{status:401,headers:{"Cache-Control":"no-store"}});
 if(!memoryConfigured())return new Response("Not configured",{status:503,headers:{"Cache-Control":"no-store"}});
 const{id}=await params,image=await getRecipeImage(id);if(!image)return new Response("Not found",{status:404,headers:{"Cache-Control":"no-store"}});
 return new Response(new Uint8Array(image.image_bytes),{status:200,headers:{"Content-Type":image.mime_type,"Cache-Control":"private, max-age=300","X-Content-Type-Options":"nosniff"}});
}
