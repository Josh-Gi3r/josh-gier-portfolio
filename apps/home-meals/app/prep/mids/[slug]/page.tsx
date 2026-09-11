import { notFound } from "next/navigation";
import { findMid } from "@/data/foundation";
import { FoundationDetail } from "@/components/FoundationDetail";
export default async function MidDetailPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const item=findMid(slug);if(!item)notFound();return <FoundationDetail item={item}/>}
