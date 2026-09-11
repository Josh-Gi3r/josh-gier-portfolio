import Link from "next/link";
import { HomeDashboard } from "@/components/HomeDashboard";
import { Icon } from "@/components/Icons";
export default function HomePage(){return <div className="page operational-home"><header className="topbar"><div><span className="eyebrow">HOME MEALS · JOSH + G</span><h1>What are we doing?</h1><p>Tonight, this week, the freezer foundation and what needs attention — one household operating view.</p></div><Link href="/prep" className="top-scan">Foundation <Icon name="arrow" size={16}/></Link></header><HomeDashboard/></div>}
