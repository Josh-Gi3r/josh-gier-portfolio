import { notFound } from "next/navigation";
import { ResearchCookingMode } from "@/components/ResearchCookingMode";
import { mealBySlug } from "@/data/meals-researched";
export default async function CookModePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const meal=mealBySlug(slug);if(!meal)notFound();return <div className="page research-cook-screen"><ResearchCookingMode meal={meal}/></div>}
