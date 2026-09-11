"use client";

import { useMemo, useState } from "react";
import { recipeBySlug, recipes, weeklyPlan } from "@/data/home-meals";
import { Icon } from "./Icons";

export function PlanClient() {
  const [plan, setPlan] = useState(weeklyPlan);
  const [editing, setEditing] = useState<number | null>(null);
  const swap = (index: number, slug: string) => { setPlan((p) => p.map((item, i) => i === index ? { ...item, recipe: slug, note: "Swapped by you" } : item)); setEditing(null); };
  const shopping = useMemo(() => ["Prawns 500 g", "Cooking cream", "Coriander", "Lemons", "Fresh greens"], []);

  return <div className="plan-layout"><section className="week-board"><div className="section-heading"><div><span className="eyebrow">THIS WEEK</span><h2>Seven dinners. Nothing rigid.</h2></div><span className="pill">5 / 7 ready now</span></div><div className="day-list">{plan.map((item, i) => { const recipe = recipeBySlug(item.recipe)!; return <div className="day-row" key={item.day}><div className="day-badge">{item.day}</div><div className="day-meal"><strong>{recipe.title}</strong><small>{recipe.time} min · {item.note}</small></div><span className={`availability ${recipe.inventory.replace(" ", "-").toLowerCase()}`}>{recipe.inventory}</span><button className="text-button" onClick={() => setEditing(editing === i ? null : i)}>Swap</button>{editing === i && <div className="swap-popover">{recipes.slice(0, 8).map((r) => <button key={r.slug} onClick={() => swap(i, r.slug)}>{r.title}<small>{r.time} min · {r.base}</small></button>)}</div>}</div>})}</div></section><aside className="shopping-card"><span className="eyebrow">AUTO SHOPPING</span><h3>What the week is missing</h3><p>Fixture inventory is already subtracted from the plan.</p>{shopping.map((item) => <label key={item}><input type="checkbox"/><span>{item}</span></label>)}<button className="primary-button"><Icon name="check"/> Shopping mode</button><small className="phase-note">Phase 2 will derive quantities from live scans and consumption.</small></aside></div>;
}
