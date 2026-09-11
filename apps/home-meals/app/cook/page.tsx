import type { Metadata } from "next";
import Link from "next/link";
import { ResearchMealLibrary } from "@/components/ResearchMealLibrary";
import { researchedMeals } from "@/data/meals-researched";
export const metadata: Metadata={title:"Cook"};
export default function CookPage(){return <div className="page researched-cook-page"><header className="topbar"><div><span className="eyebrow">RESEARCHED COOKBOOK · V1</span><h1>{researchedMeals.length} meals built from the foundation.</h1><p>JB/SG-friendly ingredients, measured freezer modules, varied cooking methods and reference recipes worth learning from. Ratings will evolve as Josh + G actually cook them.</p></div><Link href="/cook/builder" className="secondary-button">Meal builder →</Link></header><ResearchMealLibrary/></div>}
