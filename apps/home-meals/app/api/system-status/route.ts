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
  backend:"railway-postgres"
 },{headers:{"Cache-Control":"no-store"}})
}
