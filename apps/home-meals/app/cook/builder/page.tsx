import Link from "next/link";
import { MealBuilder } from "@/components/MealBuilder";
export default function BuilderPage(){return <div className="page"><Link href="/cook" className="back-link">← Cook</Link><header className="topbar"><div><span className="eyebrow">MEAL BUILDER</span><h1>Start with what you have.</h1><p>The physical Home Meals formula made interactive: protein + base + finisher + carb.</p></div></header><MealBuilder/></div>}
