"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "./Icons";

export function MoreNav(){
 const path=usePathname();
 const cookingRoute=/^\/cook\/[^/]+\/cook$/.test(path);
 if(cookingRoute)return null;
 const active=path.startsWith("/learn");
 return <Link href="/learn" className={`hm-more-nav-v69 ${active?"active":""}`} aria-current={active?"page":undefined}><Icon name="learn" size={22}/><span>More</span></Link>;
}
