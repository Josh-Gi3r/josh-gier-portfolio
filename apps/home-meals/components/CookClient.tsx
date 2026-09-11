"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { recipes } from "@/data/home-meals";
import { FoodVisual } from "./FoodVisual";
import { Icon } from "./Icons";

export function CookClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Ready", "≤20 min", "Chicken", "Vegetarian"];
  const filtered = useMemo(() => recipes.filter((r) => {
    const text = `${r.title} ${r.cuisine} ${r.tags.join(" ")}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (filter === "Ready" && r.inventory !== "Ready") return false;
    if (filter === "≤20 min" && r.time > 20) return false;
    if (filter === "Chicken" && !r.ingredients.join(" ").toLowerCase().includes("chicken")) return false;
    if (filter === "Vegetarian" && !r.tags.includes("vegetarian")) return false;
    return true;
  }), [query, filter]);

  return <>
    <div className="search-row"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals, cuisines or ingredients"/><Link href="/scan" className="scan-inline"><Icon name="camera"/> Show me something</Link></div>
    <div className="filter-row">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div>
    <div className="recipe-grid">{filtered.map((recipe) => <Link href={`/cook/${recipe.slug}`} key={recipe.slug} className="recipe-card"><FoodVisual tone={recipe.imageTone} label={recipe.title} compact/><div className="recipe-card-body"><div className="recipe-card-meta"><span>{recipe.cuisine}</span><span className={`availability ${recipe.inventory.replace(" ", "-").toLowerCase()}`}>{recipe.inventory === "Ready" ? "Have everything" : recipe.inventory}</span></div><h3>{recipe.title}</h3><p>{recipe.subtitle}</p><div className="recipe-card-foot"><span><Icon name="clock" size={15}/>{recipe.time} min</span><span><Icon name="star" size={15}/>{recipe.rating.toFixed(1)}</span><span className="base-pill">{recipe.base} ×{recipe.cubeCount}</span></div></div></Link>)}</div>
  </>;
}
