import {NextRequest,NextResponse} from "next/server";
import {ingredients,type IngredientUnit} from "@/data/home-data";
import {canonicalPrepComponentsV2,getCanonicalPrepV2} from "@/data/food-truth-v2";
import type {QuantityUnit} from "@/data/food-quantity";
import {SESSION_COOKIE,syncConfigured,verifySessionToken} from "@/lib/server-household";

export const dynamic="force-dynamic";
function noStore(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}})}
function outputText(data:any){if(typeof data?.output_text==="string")return data.output_text;for(const item of data?.output??[])for(const content of item?.content??[])if(content?.type==="output_text"&&typeof content.text==="string")return content.text;return ""}
const allowedModes=new Set(["Fridge","Freezer","Pantry","Receipt","Prep","Meal"]);
function unitKey(value:unknown){return String(value??"").trim().toLowerCase().replace(/\./g,"").replace(/\s+/g," ")}
function canonicalIngredientQuantity(value:unknown,unit:unknown,target:IngredientUnit){
 const q=Number(value);if(!Number.isFinite(q)||q<0)return null;const u=unitKey(unit);
 if(target==="have")return q<=0?0:Math.max(1,Math.min(3,Math.round(q)));
 if(target==="g"){if(["g","gram","grams"].includes(u))return q;if(["kg","kilogram","kilograms"].includes(u))return q*1000;return null}
 if(target==="ml"){if(["ml","milliliter","milliliters","millilitre","millilitres"].includes(u))return q;if(["l","liter","liters","litre","litres"].includes(u))return q*1000;return null}
 if(target==="count"){if(["count","item","items","piece","pieces","pc","pcs","unit","units"].includes(u))return q;return null}
 if(target==="portion"){if(["portion","portions","serving","servings"].includes(u))return q;return null}
 return null;
}
function canonicalPrepQuantity(value:unknown,unit:unknown,target:QuantityUnit){
 const q=Number(value);if(!Number.isFinite(q)||q<0)return null;const u=unitKey(unit);
 if(target==="g"){if(["g","gram","grams"].includes(u))return q;if(["kg","kilogram","kilograms"].includes(u))return q*1000;return null}
 if(target==="ml"){if(["ml","milliliter","milliliters","millilitre","millilitres"].includes(u))return q;if(["l","liter","liters","litre","litres"].includes(u))return q*1000;return null}
 if(target==="count"){if(["count","item","items","piece","pieces","pc","pcs","unit","units"].includes(u))return q;return null}
 return null;
}
export async function GET(){return noStore({configured:!!process.env.OPENAI_API_KEY?.trim()})}
export async function POST(req:NextRequest){
 if(syncConfigured()&&!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))return noStore({error:"unauthorized"},401);
 const key=process.env.OPENAI_API_KEY?.trim();if(!key)return noStore({error:"vision_not_configured"},503);
 const body=await req.json().catch(()=>null) as {mode?:unknown;imageDataUrl?:unknown;question?:unknown}|null;
 const mode=typeof body?.mode==="string"&&allowedModes.has(body.mode)?body.mode:"Meal";const imageDataUrl=typeof body?.imageDataUrl==="string"?body.imageDataUrl:"";const question=typeof body?.question==="string"?body.question.trim():"";
 if(!/^data:image\/(jpeg|png|webp);base64,/i.test(imageDataUrl))return noStore({error:"image_required"},400);if(imageDataUrl.length>10_500_000)return noStore({error:"image_too_large"},413);
 const trackedIngredients=ingredients.map(i=>({id:i.id,name:i.name,unit:i.unit,tracking:i.tracking}));const trackedPrep=canonicalPrepComponentsV2.map(c=>({id:c.id,code:c.code,name:c.name,tier:c.tier,unit:c.workingUnit.unit,workingQty:c.workingUnit.qty}));
 const schema={type:"object",additionalProperties:false,required:["summary","items","assessment","cookingCue","needsConfirmation","warnings"],properties:{summary:{type:"string"},items:{type:"array",maxItems:30,items:{type:"object",additionalProperties:false,required:["id","name","quantity","unit","confidence","useSoon"],properties:{id:{type:["string","null"]},name:{type:"string"},quantity:{type:["number","null"]},unit:{type:["string","null"]},confidence:{type:"number",minimum:0,maximum:1},useSoon:{type:"boolean"}}}},assessment:{type:["string","null"]},cookingCue:{type:["string","null"]},needsConfirmation:{type:"boolean"},warnings:{type:"array",maxItems:8,items:{type:"string"}}}};
 const prompt={mode,question:question||null,trackedIngredients,trackedPrep,rules:["Only map an item to an id when you are confident it matches a tracked item.","For a mapped quantity-tracked ingredient, return quantity in that ingredient's canonical unit exactly: g, ml, count, or portion. Convert kg to g and litres to ml yourself.","For a mapped state-tracked pantry item, quantity means stock level rather than package count: 1=Low, 2=Some, 3=Plenty; unit must be have.","For a mapped prep component in Freezer mode, return quantity only in that component's canonical v2 unit shown in trackedPrep. Never convert g to ml or ml to g.","A visible puck/cube count is not enough to infer prep quantity unless a readable label states the amount. Return null rather than assuming a cube size.","Do not map prep-component ids outside Freezer mode.","For Receipt/Fridge/Pantry/Freezer, estimate conservatively and require confirmation before stock changes.","For Prep/Meal, focus on visible cooking cues such as browning, texture, reduction, oil separation and obvious scorching; do not pretend to know internal temperature or microbial safety from appearance alone.","If quantity cannot be estimated reliably in the canonical unit, return null rather than guessing."]};
 const detail=mode==="Receipt"?"original":"high";
 try{
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_VISION_MODEL?.trim()||process.env.OPENAI_MODEL?.trim()||"gpt-5.6-sol",store:false,max_output_tokens:900,instructions:"You are Home Meals vision. Inspect the household food/cooking image carefully. Be conservative. Never claim a stock change has happened. Never infer safe internal temperature from appearance. Output only the requested structured object.",input:[{role:"user",content:[{type:"input_text",text:JSON.stringify(prompt)},{type:"input_image",image_url:imageDataUrl,detail}]}],text:{format:{type:"json_schema",name:"home_meals_vision",strict:true,schema}}})});
  if(!response.ok)return noStore({error:"vision_failed",status:response.status},502);const data=await response.json();const raw=outputText(data);if(!raw)return noStore({error:"vision_empty"},502);const parsed=JSON.parse(raw);const warnings=Array.isArray(parsed.warnings)?parsed.warnings.map(String).slice(0,8):[];
  const items=(Array.isArray(parsed.items)?parsed.items:[]).map((x:any)=>{const rawId=typeof x.id==="string"?x.id:null;const confidence=Math.max(0,Math.min(1,Number(x.confidence)||0));const ingredient=rawId?ingredients.find(i=>i.id===rawId):undefined;if(ingredient){const quantity=canonicalIngredientQuantity(x.quantity,x.unit,ingredient.unit);if(x.quantity!=null&&quantity==null)warnings.push(`${ingredient.name}: quantity ignored because the detected unit did not match ${ingredient.unit}.`);return {id:ingredient.id,name:ingredient.name,quantity,unit:ingredient.unit,confidence,useSoon:!!x.useSoon}}const prep=rawId&&mode==="Freezer"?getCanonicalPrepV2(rawId):undefined;if(prep){const targetUnit=prep.workingUnit.unit;const quantity=canonicalPrepQuantity(x.quantity,x.unit,targetUnit);if(x.quantity!=null&&quantity==null)warnings.push(`${prep.name}: quantity ignored because it could not be safely expressed in ${targetUnit}.`);return {id:prep.id,name:prep.name,quantity,unit:targetUnit,confidence,useSoon:false}}return {id:null,name:String(x.name||"Unknown item"),quantity:Number.isFinite(Number(x.quantity))?Number(x.quantity):null,unit:x.unit==null?null:String(x.unit),confidence,useSoon:!!x.useSoon}}).slice(0,30);
  return noStore({summary:String(parsed.summary||""),items,assessment:parsed.assessment==null?null:String(parsed.assessment),cookingCue:parsed.cookingCue==null?null:String(parsed.cookingCue),needsConfirmation:true,warnings:warnings.slice(0,8),source:"vision",detail});
 }catch(error){return noStore({error:"vision_failed",detail:error instanceof Error?error.message:"unknown"},502)}
}