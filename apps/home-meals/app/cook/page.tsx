import type { Metadata } from "next";
import Link from "next/link";
import { CookClient } from "@/components/CookClient";
export const metadata: Metadata = { title: "Cook" };
export default function CookPage() { return <div className="page"><header className="topbar"><div><span className="eyebrow">COOK</span><h1>Meals built from the system.</h1><p>A living cookbook powered by eight mother bases, directional mid-bases and what is actually in the kitchen.</p></div><div className="button-row"><Link href="/cook/builder" className="primary-button">Build a meal →</Link><Link href="/plan/shopping" className="secondary-button">Groceries</Link></div></header><CookClient/></div>; }
