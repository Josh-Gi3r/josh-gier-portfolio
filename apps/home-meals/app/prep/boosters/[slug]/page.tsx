import {notFound} from "next/navigation";
import {BoosterDetail} from "@/components/app/Boosters";
import {boosters} from "@/data/home-data";
export default async function BoosterPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!boosters.some(b=>b.id===slug))notFound();return <BoosterDetail slug={slug}/>}
