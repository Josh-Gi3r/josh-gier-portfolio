import {notFound} from "next/navigation";
import {Mid} from "@/components/app/Mid";
import {midBases} from "@/data/home-data";
export default async function MidPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!midBases.some(m=>m.id===slug))notFound();return <Mid id={slug}/>}
