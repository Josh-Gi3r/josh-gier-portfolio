"use client";
import { useEffect, useState } from "react";
import { bases } from "@/data/home-meals";
import { Icon } from "./Icons";

type Batch = { id: number; code: string; qty: number; size: string; date: string };
export function PrepLogger() {
  const [open,setOpen]=useState(false); const [code,setCode]=useState("GOLD"); const [qty,setQty]=useState(8); const [batches,setBatches]=useState<Batch[]>([]);
  useEffect(()=>{const raw=localStorage.getItem("home-meals-prep-batches");if(raw){try{setBatches(JSON.parse(raw))}catch{}}},[]);
  const add=()=>{const base=bases.find(b=>b.code===code)!;const next=[{id:Date.now(),code,qty,size:base.size,date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"})},...batches];setBatches(next);localStorage.setItem("home-meals-prep-batches",JSON.stringify(next));setOpen(false)};
  return <div className="prep-logger"><button className="primary-button" onClick={()=>setOpen(!open)}><Icon name="plus"/> Log prep batch</button>{open&&<div className="prep-log-form"><label>Base<select value={code} onChange={e=>setCode(e.target.value)}>{bases.map(b=><option key={b.code}>{b.code}</option>)}</select></label><label>Portions<input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))}/></label><button className="primary-button" onClick={add}>Save batch</button></div>}{batches.length>0&&<div className="recent-batch"><span className="eyebrow">YOUR RECENT LOG</span>{batches.slice(0,3).map(b=><div key={b.id}><strong>{b.code} ×{b.qty}</strong><small>{b.size} · {b.date}</small></div>)}</div>}</div>;
}
