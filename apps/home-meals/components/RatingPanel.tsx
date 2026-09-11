"use client";
import { useEffect, useState } from "react";

export function RatingPanel({ recipeSlug }: { recipeSlug: string }) {
  const [ratings, setRatings] = useState({ Josh: 0, G: 0 });
  const [note, setNote] = useState("");
  useEffect(() => { const raw = localStorage.getItem(`home-meals-rating-${recipeSlug}`); if (raw) { try { const saved = JSON.parse(raw); setRatings(saved.ratings ?? ratings); setNote(saved.note ?? ""); } catch {} } }, [recipeSlug]);
  const save = (next = ratings, nextNote = note) => { setRatings(next); setNote(nextNote); localStorage.setItem(`home-meals-rating-${recipeSlug}`, JSON.stringify({ ratings: next, note: nextNote })); };
  return <section className="rating-preview rating-live"><div><span className="eyebrow">AFTER DINNER</span><h2>Make the recipe better.</h2><p>Rate separately. Keep one household note that can become the next version.</p><textarea value={note} onChange={(e)=>save(ratings,e.target.value)} placeholder="More chilli? More sauce? Different carb?"/></div>{(["Josh","G"] as const).map((person)=><div className="rating-person" key={person}><strong>{person}</strong><div className="star-buttons">{[1,2,3,4,5].map((star)=><button aria-label={`${person} ${star} stars`} key={star} onClick={()=>save({...ratings,[person]:star})} className={ratings[person]>=star?"on":""}>★</button>)}</div><small>{ratings[person] ? `${ratings[person]}/5 saved on this device` : "Tap to rate"}</small></div>)}</section>;
}
