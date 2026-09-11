import Link from "next/link";
import { PrepDayClient } from "@/components/PrepDayClient";
import { PrepTimelineGraphic, StorageGraphic } from "@/components/FoundationVisuals";
export default function PrepDayPage(){return <div className="page prep-day-page"><Link href="/prep" className="back-link">← Foundation</Link><header className="topbar"><div><span className="eyebrow">PREP DAY</span><h1>One kitchen. One sequence.</h1><p>Start the longest reductions first, use cooling time for cold sauces and boosters, then portion only once the cooked bases are properly cooled.</p></div><Link href="/prep/groceries" className="secondary-button">Check groceries</Link></header><PrepDayClient/><PrepTimelineGraphic/><StorageGraphic/></div>}
