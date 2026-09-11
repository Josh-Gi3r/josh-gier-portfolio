import Link from "next/link";
import { notFound } from "next/navigation";
import { baseBySlug } from "@/data/home-meals";
import { Icon } from "@/components/Icons";

export default async function BasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = baseBySlug(slug);
  if (!base) notFound();
  return <div className="page base-detail" style={{ "--base-color": base.tone } as React.CSSProperties}>
    <Link href="/prep" className="back-link">← Prep system</Link>
    <section className="base-detail-hero"><div className="giant-base-code">{base.code}</div><div><span className="eyebrow">MOTHER BASE · {base.tier.toUpperCase()}</span><h1>{base.name}</h1><p>{base.summary}</p><div className="label-demo"><span>{base.code}</span><strong>{base.size.replace(" ml","")}</strong><small>BASE / ML / DATE</small></div></div></section>
    <div className="prep-summary"><div><small>PORTION SIZE</small><strong>{base.size}</strong><span>Standard Home Meals module</span></div><div><small>TARGET BATCH</small><strong>{base.targetPortions}</strong><span>portions per prep batch</span></div><div><small>MEALS SHOWN</small><strong>{base.becomes.length}</strong><span>examples, not the ceiling</span></div></div>
    <div className="base-how-grid"><section><span className="eyebrow">EXACT STARTER BATCH</span><h2>Shop and weigh this.</h2><ul className="ingredient-list">{base.batchIngredients.map((item)=><li key={item}><span className="check-circle"><Icon name="check" size={13}/></span>{item}</li>)}</ul><div className="ingredient-cloud" style={{marginTop:18}}>{base.ingredients.map((item) => <span key={item}>{item}</span>)}</div></section><section><span className="eyebrow">PREP</span><h2>Make once, freeze fast.</h2><ol className="method-list">{base.directions.map((step,i)=><li key={step}><span>{String(i+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol></section></div>
    <section className="becomes-map"><span className="eyebrow">ONE BASE → MANY DINNERS</span><h2>{base.code} branches out.</h2><div className="branch-map"><div className="branch-core" style={{ background: base.tone }}>{base.code}</div>{base.becomes.map((meal) => <div className="branch-node" key={meal}>{meal}</div>)}</div><div className="finisher-row">{base.finishers.map((f) => <span key={f}>+ {f}</span>)}</div></section>
    <section className="troubleshoot"><span className="eyebrow">TROUBLESHOOTING</span><h2>What can go wrong.</h2>{base.troubleshooting.map((item) => <div key={item.issue}><strong>{item.issue}</strong><p>{item.fix}</p></div>)}</section>
    <div className="placeholder-sequence"><span className="eyebrow">PROCESS PHOTOGRAPHY · PRODUCTION SLOTS</span><div>{["Ingredient mise en place","Correct cooking colour","Correct final texture","Measured mould fill","Frozen labelled result"].map((x,i)=><figure key={x}><div><span>0{i+1}</span></div><figcaption>{x}</figcaption></figure>)}</div></div>
    <div className="button-row"><Link href="/plan/shopping" className="primary-button">Add to prep shop <Icon name="arrow"/></Link><Link href="/prep" className="secondary-button">Back to prep</Link></div>
  </div>;
}
