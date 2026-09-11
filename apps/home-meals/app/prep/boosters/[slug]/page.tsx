import { notFound } from "next/navigation";
import { findBooster } from "@/data/foundation";
import { FoundationDetail } from "@/components/FoundationDetail";
export default async function BoosterDetailPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const item=findBooster(slug);if(!item)notFound();return <FoundationDetail item={item}/>}
