import {notFound} from "next/navigation";
import {Recipe} from "@/components/app/Recipe";
import {recipes} from "@/data/home-data";
export default async function RecipePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!recipes.some(r=>r.id===slug))notFound();return <Recipe id={slug}/>}
