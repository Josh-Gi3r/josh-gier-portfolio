import {notFound} from "next/navigation";
import {Recipe} from "@/components/app/Recipe";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
export default async function RecipePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!getLiveRecipeV7(slug))notFound();return <Recipe id={slug}/>}
