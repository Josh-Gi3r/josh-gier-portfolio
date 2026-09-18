import {NextRequest,NextResponse} from "next/server";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";
import {consumeRateLimit,requestRateKey} from "@/lib/server-rate-limit";
import {getDraft,listRecipeImages,memoryConfigured,saveRecipeImage,selectRecipeImage,selectedRecipeImage} from "@/lib/server-memory";
import {buildRecipeImagePrompt,RECIPE_IMAGE_FORMAT,RECIPE_IMAGE_MODEL,RECIPE_IMAGE_QUALITY,RECIPE_IMAGE_SIZE,type RecipeImageMode,type WorkingRecipeForImage} from "@/lib/recipe-image";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200,headers?:Record<string,string>){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store",...(headers??{})}})}
function auth(req:NextRequest){return !syncConfigured()||verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)}
function meta(x:{id:string;draft_id:string;mime_type:string;prompt:string;model:string;quality:string;width:number;height:number;look:string|null;selected:boolean;created_at:string}){return{...x,url:`/api/recipe-image/${encodeURIComponent(x.id)}`}}
function recipePayload(value:Record<string,unknown>,fallbackTitle:string):WorkingRecipeForImage{
 const ingredients=Array.isArray(value.ingredients)?value.ingredients.filter(x=>x&&typeof x==="object").slice(0,40).map(x=>{const y=x as Record<string,unknown>;return{name:String(y.name??"").slice(0,140),quantity:Number.isFinite(Number(y.quantity))?Number(y.quantity):null,unit:y.unit==null?null:String(y.unit).slice(0,30)}}).filter(x=>x.name):[];
 const method=Array.isArray(value.method)?value.method.map(String).filter(Boolean).slice(0,24):[];
 const notes=Array.isArray(value.notes)?value.notes.map(String).filter(Boolean).slice(0,16):[];
 return{title:typeof value.title==="string"&&value.title.trim()?value.title.trim():fallbackTitle,servings:Number.isFinite(Number(value.servings))?Number(value.servings):null,ingredients,method,notes};
}

export async function GET(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 const draftId=new URL(req.url).searchParams.get("draftId")?.trim()||"";
 if(!draftId)return noStore({error:"draft_id_required"},400);
 if(!memoryConfigured())return noStore({configured:false,selected:null,images:[]});
 const draft=await getDraft(draftId);if(!draft)return noStore({error:"draft_not_found"},404);
 const [selected,images]=await Promise.all([selectedRecipeImage(draftId),listRecipeImages(draftId)]);
 return noStore({configured:!!process.env.OPENAI_API_KEY?.trim(),model:RECIPE_IMAGE_MODEL,quality:RECIPE_IMAGE_QUALITY,selected:selected?meta(selected):null,images:images.map(meta)});
}

export async function POST(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const key=process.env.OPENAI_API_KEY?.trim();if(!key)return noStore({error:"image_generation_not_configured"},503);
 const limiter=consumeRateLimit(requestRateKey(req.headers,"recipe-image"),12,60*60*1000);
 if(!limiter.ok)return noStore({error:"too_many_image_requests"},429,{"Retry-After":String(limiter.retryAfterSeconds)});
 const body=await req.json().catch(()=>null) as {draftId?:unknown;mode?:unknown;lookHint?:unknown}|null;
 const draftId=typeof body?.draftId==="string"?body.draftId.trim():"";
 const mode=(body?.mode==="replace"||body?.mode==="candidate"||body?.mode==="initial"?body.mode:"initial") as RecipeImageMode;
 const lookHint=typeof body?.lookHint==="string"?body.lookHint.trim().slice(0,240):null;
 if(!draftId)return noStore({error:"draft_id_required"},400);
 const draft=await getDraft(draftId);if(!draft)return noStore({error:"draft_not_found"},404);
 const recipe=recipePayload(draft.payload,draft.title),prompt=buildRecipeImagePrompt(recipe,lookHint,mode==="candidate");
 try{
  const response=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:RECIPE_IMAGE_MODEL,prompt,n:1,size:RECIPE_IMAGE_SIZE,quality:RECIPE_IMAGE_QUALITY,output_format:RECIPE_IMAGE_FORMAT,output_compression:88,background:"opaque"})});
  const data=await response.json().catch(()=>null) as {data?:{b64_json?:string}[];error?:{message?:string}}|null;
  if(!response.ok)return noStore({error:"image_generation_failed",status:response.status,detail:data?.error?.message?.slice(0,300)??null},502);
  const b64=data?.data?.[0]?.b64_json;if(!b64)return noStore({error:"image_generation_empty"},502);
  const bytes=Buffer.from(b64,"base64");if(!bytes.length||bytes.length>16*1024*1024)return noStore({error:"image_generation_invalid"},502);
  const [width,height]=RECIPE_IMAGE_SIZE.split("x").map(Number),selected=mode!=="candidate";
  const image=await saveRecipeImage({draftId,mimeType:"image/webp",bytes,prompt,model:RECIPE_IMAGE_MODEL,quality:RECIPE_IMAGE_QUALITY,width,height,look:lookHint||(mode==="candidate"?"alternate":null),selected});
  return noStore({image:meta(image),selected,mode},201);
 }catch(error){return noStore({error:"image_generation_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}

export async function PATCH(req:NextRequest){
 if(!auth(req))return noStore({error:"unauthorized"},401);
 if(!memoryConfigured())return noStore({error:"memory_not_configured"},503);
 const body=await req.json().catch(()=>null) as {draftId?:unknown;imageId?:unknown}|null;
 const draftId=typeof body?.draftId==="string"?body.draftId.trim():"",imageId=typeof body?.imageId==="string"?body.imageId.trim():"";
 if(!draftId||!imageId)return noStore({error:"invalid_image_selection"},400);
 const image=await selectRecipeImage(draftId,imageId);return image?noStore({image:meta(image)}):noStore({error:"not_found"},404);
}
