import {notFound} from "next/navigation";
import {Mother} from "@/components/app/Mother";
import {motherBases} from "@/data/home-data";
export default async function MotherPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!motherBases.some(m=>m.id===slug))notFound();return <Mother id={slug}/>}
