import {notFound} from "next/navigation";
import {Cooking} from "@/components/app/Cooking";
import {getLiveRecipeV7} from "@/data/recipe-catalog-v7";
export default async function CookingPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!getLiveRecipeV7(slug))notFound();return <Cooking id={slug}/>}
