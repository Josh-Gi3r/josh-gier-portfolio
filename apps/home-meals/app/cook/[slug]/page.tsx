import { RecipeDetailV2 } from "@/components/RecipeDetailV2";
import { meals } from "@/data/home-graph";
import { notFound } from "next/navigation";
export default async function RecipePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!meals.some(m=>m.id===slug))notFound();return <RecipeDetailV2 mealId={slug}/>}
