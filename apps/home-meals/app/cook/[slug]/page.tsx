import Link from "next/link";
import { notFound } from "next/navigation";
import { FoodVisual } from "@/components/FoodVisual";
import { Icon } from "@/components/Icons";
import { recipeBySlug } from "@/data/home-meals";
import { RatingPanel } from "@/components/RatingPanel";

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipeBySlug(slug);
  if (!recipe) notFound();
  return <div className="page recipe-detail"><Link href="/cook" className="back-link">← All meals</Link><div className="recipe-hero"><div className="recipe-hero-copy"><span className="eyebrow">{recipe.cuisine.toUpperCase()} · {recipe.inventory.toUpperCase()}</span><h1>{recipe.title}</h1><p>{recipe.subtitle}</p><div className="hero-stat-row"><div><small>TIME</small><strong>{recipe.time} min</strong></div><div><small>HOUSE RATING</small><strong>{recipe.rating}/10</strong></div><div><small>FREEZER</small><strong>{recipe.base} ×{recipe.cubeCount}</strong></div><div><small>SERVES</small><strong>{recipe.serves}</strong></div></div><Link href={`/cook/${recipe.slug}/cook`} className="primary-button">Start cooking <Icon name="arrow"/></Link></div><FoodVisual tone={recipe.imageTone} label={recipe.title}/></div><div className="recipe-content-grid"><section><span className="eyebrow">INGREDIENTS</span><h2>Get everything out first.</h2><ul className="ingredient-list">{recipe.ingredients.map((item) => <li key={item}><span className="check-circle"><Icon name="check" size={13}/></span>{item}</li>)}</ul></section><section><span className="eyebrow">METHOD</span><h2>{recipe.steps.length} moves.</h2><ol className="method-list">{recipe.steps.map((step, i) => <li key={step}><span>{String(i+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol></section></div><RatingPanel recipeSlug={recipe.slug}/></div>;
}
