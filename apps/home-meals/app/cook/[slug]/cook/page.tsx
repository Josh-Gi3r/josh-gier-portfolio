import {notFound} from "next/navigation";
import {Cooking} from "@/components/app/Cooking";
import {recipes} from "@/data/home-data";
export default async function CookingPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!recipes.some(r=>r.id===slug))notFound();return <Cooking id={slug}/>}
