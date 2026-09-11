import { notFound } from "next/navigation";
import { motherBases } from "@/data/home-graph";
import { PrepDetailV2 } from "@/components/PrepDetailV2";
export default async function MotherPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!motherBases.some(x=>x.id===slug))notFound();return <PrepDetailV2 baseId={slug}/>}
