"use client";

import { useEffect, useMemo, useState } from "react";
import { starterPrepShop } from "@/data/home-meals";

export function ShoppingClient() {
  const allItems = useMemo(() => Object.entries(starterPrepShop).flatMap(([category, items]) => items.map((item) => ({ category, item }))), []);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => { const raw = localStorage.getItem("home-meals-shopping"); if (raw) { try { setChecked(JSON.parse(raw)); } catch {} } }, []);
  const toggle = (item: string) => setChecked((prev) => { const next = { ...prev, [item]: !prev[item] }; localStorage.setItem("home-meals-shopping", JSON.stringify(next)); return next; });
  const done = allItems.filter((x) => checked[x.item]).length;
  return <div className="shopping-full"><div className="shopping-progress"><strong>{done}/{allItems.length}</strong><span>items checked</span><button onClick={() => { setChecked({}); localStorage.removeItem("home-meals-shopping"); }}>Clear</button></div>{Object.entries(starterPrepShop).map(([category, items]) => <section key={category} className="shopping-section"><div className="section-heading"><div><span className="eyebrow">SHOPPING</span><h2>{category}</h2></div><span className="pill">{items.filter((item) => checked[item]).length}/{items.length}</span></div><div className="shopping-check-grid">{items.map((item) => <label key={item} className={checked[item] ? "checked" : ""}><input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)}/><span>{item}</span></label>)}</div></section>)}</div>;
}
