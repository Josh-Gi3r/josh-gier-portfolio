import {notFound} from "next/navigation";
import {Guide} from "@/components/app/Help";
const valid=new Set(["system","portions","prep-day","freezer"]);
export default async function GuidePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!valid.has(slug))notFound();return <Guide slug={slug}/>}
