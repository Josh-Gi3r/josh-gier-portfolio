import { notFound } from "next/navigation";
import { CookingMode } from "@/components/CookingMode";
import { recipeBySlug } from "@/data/home-meals";
export default async function CookModePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const recipe = recipeBySlug(slug); if (!recipe) notFound(); return <div className="page cook-screen"><div className="cook-screen-head"><span className="eyebrow">COOKING · {recipe.base} ×{recipe.cubeCount}</span><h2>{recipe.title}</h2></div><CookingMode recipe={recipe}/></div>; }
