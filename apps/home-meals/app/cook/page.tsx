import type { Metadata } from "next";
import Link from "next/link";
import { CookClient } from "@/components/CookClient";
export const metadata: Metadata = { title: "Cook" };
export default function CookPage() { return <div className="page"><header className="topbar"><div><span className="eyebrow">COOK</span><h1>Meals we actually want.</h1><p>A living cookbook built around what is already in the kitchen.</p></div><Link href="/cook/builder" className="primary-button">Build a meal →</Link></header><CookClient/></div>; }
