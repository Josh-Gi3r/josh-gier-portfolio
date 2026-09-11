"use client";
import { useMemo, useState } from "react";
import { bases, midBases } from "@/data/home-meals";

const proteins=["Chicken thigh","Salmon","Prawns","Minced beef","Tofu","Eggs"];
const carbs=["Basmati rice","Jasmine rice","Pasta","Potatoes","Noodles","Flatbread"];
const finishers: Record<string,string[]>={
  RED:["Basil + Parmesan","Cream + chilli","Cumin + paprika","Lemon + herbs"],
  GOLD:["Coconut milk","Cream + butter","Yoghurt","Extra tomato"],
  ASIAN:["Soy + honey","Coconut + lime","Oyster + sesame","Fish sauce + lime"],
  DARK:["Dijon + butter","Black pepper + cream","Miso + butter"],
  GREEN:["Parmesan + lemon","Cream","Butter + herbs","Toasted nuts"],
  FIRE:["Cumin + yoghurt","Smoked paprika + lemon","Cream","Coriander + lime"],
  BLOND:["Cream + lemon","Dijon + butter","Parmesan","Tarragon"],
  SAMBAL:["Tamarind + lime","Coconut milk","Soy + lime","Crispy anchovy + peanut"]
};
const names:Record<string,string>={
  "Chicken thigh|GOLD":"Coconut curry chicken","Chicken thigh|DARK":"Mustard pan-sauce chicken","Chicken thigh|RED":"Tomato chicken","Chicken thigh|BLOND":"Lemon cream chicken","Chicken thigh|SAMBAL":"Sambal chicken",
  "Salmon|GREEN":"Herb salmon","Salmon|DARK":"Miso butter salmon","Salmon|FIRE":"Roasted pepper salmon","Salmon|BLOND":"Creamy lemon salmon",
  "Prawns|ASIAN":"Ginger soy prawns","Prawns|FIRE":"Spicy pepper prawns","Prawns|SAMBAL":"Sambal prawns",
  "Minced beef|RED":"Quick beef ragù","Minced beef|DARK":"Quick beef braise","Tofu|GOLD":"GOLD tofu masala","Tofu|ASIAN":"Ginger soy tofu","Eggs|SAMBAL":"Sambal eggs","Eggs|RED":"Shakshuka"
};
export function MealBuilder(){
  const[protein,setProtein]=useState(proteins[0]);
  const[base,setBase]=useState("GOLD");
  const[mid,setMid]=useState("NONE");
  const[finisher,setFinisher]=useState(finishers.GOLD[0]);
  const[carb,setCarb]=useState(carbs[0]);
  const availableMids=useMemo(()=>midBases.filter(m=>m.pairsWith.includes(base)),[base]);
  const result=useMemo(()=>names[`${protein}|${base}`]??`${base} ${protein.toLowerCase()} bowl`,[protein,base]);
  const selectBase=(value:string)=>{setBase(value);setMid("NONE");setFinisher(finishers[value][0])};
  const selectedMid=mid==="NONE"?"no mid-base":mid;
  return <div className="meal-builder"><div className="builder-stage"><span className="eyebrow">BUILD-A-MEAL</span><h2>{result}</h2><p>{protein} + {base} + {selectedMid} + {finisher} + {carb}</p><div className="builder-plate"><span>{base}{mid!=="NONE"?` + ${mid}`:""}</span><i/><b>{protein}</b></div><div className="builder-result-meta"><span>~15–30 min</span><span>Fresh-cooked</span><span>Freezer-first</span></div></div><div className="builder-controls"><label><span>01 · Protein</span><select value={protein} onChange={e=>setProtein(e.target.value)}>{proteins.map(x=><option key={x}>{x}</option>)}</select></label><label><span>02 · Mother base</span><div className="builder-base-buttons">{bases.map(b=><button key={b.code} onClick={()=>selectBase(b.code)} className={base===b.code?"active":""} style={{"--base-color":b.tone} as React.CSSProperties}><i/>{b.code}</button>)}</div></label><label><span>03 · Mid-base / direction</span><select value={mid} onChange={e=>setMid(e.target.value)}><option value="NONE">None — keep the base broad</option>{availableMids.map(x=><option key={x.code} value={x.code}>{x.code} · {x.name}</option>)}</select></label><label><span>04 · Fresh finisher</span><select value={finisher} onChange={e=>setFinisher(e.target.value)}>{finishers[base].map(x=><option key={x}>{x}</option>)}</select></label><label><span>05 · Carb</span><select value={carb} onChange={e=>setCarb(e.target.value)}>{carbs.map(x=><option key={x}>{x}</option>)}</select></label></div></div>
}
