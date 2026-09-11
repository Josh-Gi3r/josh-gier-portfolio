"use client";
import { useState } from "react";
import { useHousehold } from "./HouseholdState";

export function RecipeEvolution({mealId}:{mealId:string}){
 const h=useHousehold();const r=h.ratings[mealId]??{};const [note,setNote]=useState(r.note??"");
 const cooks=h.history.filter(x=>x.mealId===mealId);
 const save=()=>h.noteMeal(mealId,note.trim());
 return <section className="hm-evolution-card">
  <header><div><span>OUR VERSION</span><h2>Make it better next time.</h2></div><strong>{cooks.length?`cooked ${cooks.length}×`:"first test"}</strong></header>
  <div className="hm-evolution-track"><div className="current"><b>v1</b><span>current recipe</span></div><i/><div className={r.josh||r.g?"active":""}><b>★</b><span>{r.josh?`Josh ${r.josh}/5`:"Josh —"} · {r.g?`G ${r.g}/5`:"G —"}</span></div><i/><div className={r.note?"active":""}><b>✎</b><span>{r.note||"add a note after dinner"}</span></div></div>
  <div className="hm-evolution-note"><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="More chilli? Less sweet? Better with rice? What should change next time?"/><button onClick={save}>{r.note?"Update note":"Save note"}</button></div>
 </section>
}
