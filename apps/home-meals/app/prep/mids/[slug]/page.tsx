import { notFound } from "next/navigation";
import { midBases } from "@/data/home-graph";
import { MidDetailV2 } from "@/components/MidDetailV2";
export default async function MidDetailPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!midBases.some(x=>x.id===slug))notFound();return <MidDetailV2 midId={slug}/>}
