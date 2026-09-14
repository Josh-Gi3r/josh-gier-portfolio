import {notFound} from "next/navigation";
import {BoosterDetail} from "@/components/app/Boosters";
import {findBooster} from "@/data/foundation";
export default async function BoosterPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!findBooster(slug))notFound();return <BoosterDetail slug={slug}/>}
