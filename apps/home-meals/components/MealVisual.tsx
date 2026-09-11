import { mealImages } from "@/data/meal-assets";

export function MealVisual({slug,title,compact=false}:{slug:string;title:string;compact?:boolean}){
 const src=mealImages[slug];
 return src?<div className={`meal-photo ${compact?"compact":""}`}><img src={src} alt={title}/><span>HOME MEALS · TEST KITCHEN</span></div>:<div className={`meal-photo meal-photo-placeholder ${compact?"compact":""}`}><div/><span>HOME MEALS</span><strong>{title}</strong></div>
}
