import Link from "next/link";
import { ShoppingClient } from "@/components/ShoppingClient";

export default function ShoppingPage() {
  return <div className="page"><Link href="/plan" className="back-link">← Plan</Link><header className="topbar"><div><span className="eyebrow">PREP SHOP</span><h1>Buy the infrastructure.</h1><p>This is the starter shopping checklist for the expanded mother-base system, directional mids and the first long-running menu. Quantities on individual base pages are the authoritative prep batch quantities.</p></div></header><div className="prep-summary"><div><small>MOTHER BASES</small><strong>8</strong><span>RED · GOLD · ASIAN · DARK · GREEN · FIRE · BLOND · SAMBAL</span></div><div><small>MID-BASES</small><strong>10</strong><span>Directional concentrates, not duplicate sauces</span></div><div><small>RULE</small><strong>Prep to menu</strong><span>You can own the library without making every batch every week</span></div></div><ShoppingClient/></div>;
}
