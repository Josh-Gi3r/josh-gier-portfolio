import { notFound } from "next/navigation";
import { CookingModeV2 } from "@/components/CookingModeV2";
import { meals } from "@/data/home-graph";
export default async function CookModePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!meals.some(m=>m.id===slug))notFound();return <CookingModeV2 mealId={slug}/>}
