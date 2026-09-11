"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inventoryGroups } from "@/data/home-meals";
import { Icon } from "./Icons";

type Group = keyof typeof inventoryGroups;
type Item = (typeof inventoryGroups)[Group][number];

export function KitchenClient() {
  const [tab, setTab] = useState<Group>("freezer");
  const [data, setData] = useState<Record<Group, Item[]>>(inventoryGroups);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("home-meals-inventory");
    if (saved) { try { setData(JSON.parse(saved)); } catch {} }
  }, []);

  const change = (index: number, delta: number) => {
    setData((prev) => {
      const next = { ...prev, [tab]: prev[tab].map((item, i) => i === index ? { ...item, qty: Math.max(0, item.qty + delta) } : item) } as Record<Group, Item[]>;
      localStorage.setItem("home-meals-inventory", JSON.stringify(next));
      return next;
    });
  };

  const addItem = () => { const name = newName.trim(); if (!name) return; setData((prev) => { const next = { ...prev, [tab]: [...prev[tab], { name, qty: 1, unit: "item", state: "good" }] } as Record<Group, Item[]>; localStorage.setItem("home-meals-inventory", JSON.stringify(next)); return next; }); setNewName(""); setAdding(false); };

  return <div className="kitchen-panel">
    <div className="kitchen-tabs">{(["freezer", "fridge", "pantry"] as Group[]).map((group) => <button key={group} className={tab === group ? "active" : ""} onClick={() => setTab(group)}>{group}</button>)}</div>
    <div className="inventory-list">{data[tab].map((item, i) => <div className="inventory-row" key={item.name}><div className={`state-marker ${item.state}`}/><div className="inventory-name"><strong>{item.name}</strong><small>{item.unit} · {item.state === "use" ? "use soon" : item.state === "low" ? "running low" : "in good shape"}</small></div><div className="qty-control"><button onClick={() => change(i, -1)}><Icon name="minus" size={14}/></button><span>{item.qty}</span><button onClick={() => change(i, 1)}><Icon name="plus" size={14}/></button></div></div>)}</div>
    <div className="kitchen-actions"><Link href="/scan?mode=kitchen" className="primary-button"><Icon name="camera"/> Scan kitchen</Link><button className="secondary-button" onClick={() => setAdding(!adding)}><Icon name="plus"/> Add item</button></div>{adding && <div className="add-item-row"><input autoFocus value={newName} onChange={(e)=>setNewName(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addItem()} placeholder={`Add to ${tab}`}/><button className="primary-button" onClick={addItem}>Add</button></div>}
  </div>;
}
