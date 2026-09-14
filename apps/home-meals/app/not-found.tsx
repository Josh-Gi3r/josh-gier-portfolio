import Link from "next/link";
import {Orb} from "@/components/app/Orb";
export default function NotFound(){return <div className="hm-state"><div className="center"><Orb size={110}/><h1>That page isn’t in the kitchen.</h1><p>Maybe the recipe moved, or the link is old.</p><Link className="hm-btn primary sm" href="/">Back to Home</Link></div><div className="foot"/></div>}
