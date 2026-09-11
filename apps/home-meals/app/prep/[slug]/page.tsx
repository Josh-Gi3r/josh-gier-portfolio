import { notFound } from "next/navigation";
import { findMother } from "@/data/foundation";
import { FoundationDetail } from "@/components/FoundationDetail";
export default async function MotherPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const item=findMother(slug);if(!item)notFound();return <FoundationDetail item={item}/>}
