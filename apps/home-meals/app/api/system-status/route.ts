import {NextResponse} from "next/server";
import {syncConfigured} from "@/lib/server-household";
export const dynamic="force-dynamic";
export async function GET(){
 const openai=!!process.env.OPENAI_API_KEY?.trim();
 return NextResponse.json({
  householdSync:syncConfigured(),
  database:!!process.env.DATABASE_URL?.trim(),
  householdCode:!!(process.env.HOME_MEALS_HOUSEHOLD_CODE?.trim()||process.env.HOME_MEALS_SYNC_SECRET?.trim()),
  askHome:openai,
  vision:openai,
  realtimeVoice:openai,
  backend:"railway-postgres",
  model:process.env.OPENAI_MODEL?.trim()||"gpt-5.6-sol",
  visionModel:process.env.OPENAI_VISION_MODEL?.trim()||process.env.OPENAI_MODEL?.trim()||"gpt-5.6-sol",
  liveModel:process.env.OPENAI_LIVE_MODEL?.trim()||"gpt-live-1"
 },{headers:{"Cache-Control":"no-store"}})
}
