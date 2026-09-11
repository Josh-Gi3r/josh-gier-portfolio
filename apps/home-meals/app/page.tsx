import Link from "next/link";
import { bases, inventoryGroups, recipeBySlug, weeklyPlan } from "@/data/home-meals";
import { FoodVisual } from "@/components/FoodVisual";
import { Icon } from "@/components/Icons";
import { MealTransformation } from "@/components/SystemInfographics";

export default function HomePage() {
  const tonight = recipeBySlug(weeklyPlan[0].recipe)!;
  const low = [...inventoryGroups.fridge, ...inventoryGroups.freezer].filter((i) => i.state === "low" || i.state === "use").slice(0, 4);
  return <div className="page home-page">
    <header className="topbar"><div><span className="eyebrow">FRIDAY · HOME</span><h1>What are we doing?</h1><p>Your kitchen, this week, and the fastest good decision.</p></div><Link href="/scan" className="top-scan"><Icon name="camera"/> Scan</Link></header>

    <section className="tonight-card"><div className="tonight-copy"><span className="eyebrow">TONIGHT · READY NOW</span><h2>{tonight.title}</h2><p>{tonight.subtitle}</p><div className="tonight-meta"><span><Icon name="clock"/> {tonight.time} min</span><span><Icon name="star"/> {tonight.rating}</span><span className="base-pill">{tonight.base} ×{tonight.cubeCount}{tonight.mid ? ` + ${tonight.mid}` : ""}</span></div><div className="button-row"><Link className="primary-button" href={`/cook/${tonight.slug}/cook`}>Start cooking <Icon name="arrow"/></Link><Link className="secondary-button" href={`/cook/${tonight.slug}`}>View recipe</Link></div></div><FoodVisual tone={tonight.imageTone} label={tonight.title}/></section>

    <section className="home-grid"><div className="home-module week-module"><div className="module-head"><div><span className="eyebrow">THIS WEEK</span><h3>Seven dinners</h3></div><Link href="/plan">Plan <Icon name="chevron" size={16}/></Link></div><div className="mini-week">{weeklyPlan.slice(0, 5).map((item, i) => { const recipe = recipeBySlug(item.recipe)!; return <div key={item.day} className={i === 0 ? "active" : ""}><span>{item.day}</span><strong>{recipe.title}</strong><small>{recipe.time}m</small></div> })}</div></div>
      <div className="home-module use-module"><div className="module-head"><div><span className="eyebrow">USE SOON</span><h3>Protect the fridge</h3></div><Link href="/kitchen">Kitchen <Icon name="chevron" size={16}/></Link></div><div className="use-list">{low.map((item) => <div key={item.name}><span className={`state-marker ${item.state}`}/><strong>{item.name}</strong><small>{item.state === "use" ? "Use in next 48h" : "Running low"}</small></div>)}</div></div>
      <div className="home-module freezer-module"><div className="module-head"><div><span className="eyebrow">FREEZER</span><h3>Mother-base stock</h3></div><Link href="/prep">Prep <Icon name="chevron" size={16}/></Link></div><div className="base-stock">{bases.map((base) => { const inv = inventoryGroups.freezer.find((i) => i.name === base.code); return <div key={base.code}><i style={{ background: base.tone }}/><span>{base.code}</span><strong>{inv?.qty ?? "—"}</strong></div> })}</div><div className="prep-nudge"><span>Architecture</span><strong>8 mother bases + directional mids.</strong><small>Prep what the menu needs, not everything every Sunday.</small></div></div>
      <div className="home-module ai-module"><span className="eyebrow">HOME AI</span><h3>Ask with words, voice or a camera.</h3><p>“I want chicken, something creamy, maybe pasta, but not tomato.”</p><div className="ai-actions"><button><Icon name="mic"/> Talk</button><Link href="/scan"><Icon name="camera"/> Show</Link></div><small>Voice + vision surface is designed now; deeper intelligence arrives in Phase 2.</small></div>
    </section>

    <MealTransformation />

    <section className="base-ribbon"><div className="section-heading"><div><span className="eyebrow">PHYSICAL SYSTEM</span><h2>Eight foundations. A long-running menu.</h2></div><Link href="/prep">See prep system <Icon name="arrow"/></Link></div><div className="base-ribbon-grid">{bases.map((base) => <Link href={`/prep/${base.slug}`} key={base.code} style={{ "--base-color": base.tone } as React.CSSProperties}><i/><span>{base.code}</span><strong>{base.name}</strong><small>{base.size} · {base.tier}</small></Link>)}</div></section>
  </div>;
}
