"use client";

import { useState } from "react";
import { bases } from "@/data/home-meals";

const transformations: Record<string, { finisher: string; meal: string }> = {
  RED: { finisher: "basil + Parmesan", meal: "Italian tomato chicken" },
  GOLD: { finisher: "coconut milk", meal: "Coconut curry chicken" },
  DARK: { finisher: "mushroom + cream", meal: "Mushroom cream chicken" },
  ASIAN: { finisher: "soy + honey", meal: "Ginger soy chicken" },
  FIRE: { finisher: "cumin + yoghurt", meal: "Harissa-style chicken" },
  GREEN: { finisher: "Parmesan", meal: "Pesto chicken" }
};

export function MealTransformation() {
  const [selected, setSelected] = useState("GOLD");
  const result = transformations[selected];
  return <div className="infographic transformation-card">
    <div className="infographic-title"><span className="eyebrow">CODED INFOGRAPHIC</span><h3>Same dinner core. Six directions.</h3><p>Chicken + broccoli + rice stays constant. Change the freezer base and finishing move.</p></div>
    <div className="transform-line">
      <div className="ingredient-stack"><span>Chicken</span><span>Broccoli</span><span>Rice</span></div>
      <div className="flow-arrow">→</div>
      <div className="base-selector">{bases.map((base) => <button key={base.code} className={selected === base.code ? "selected" : ""} style={{ "--base-color": base.tone } as React.CSSProperties} onClick={() => setSelected(base.code)}><i/>{base.code}</button>)}</div>
      <div className="flow-arrow">→</div>
      <div className="transform-result"><small>ADD</small><strong>{result.finisher}</strong><span>{result.meal}</span></div>
    </div>
  </div>;
}

export function CubeScale() {
  const cubes = [{ ml: 30, label: "Booster", size: 44 }, { ml: 60, label: "Concentrated base", size: 62 }, { ml: 90, label: "Main sauce base", size: 78 }, { ml: 250, label: "Finished meal", size: 104 }];
  return <div className="infographic cube-scale"><div className="infographic-title"><span className="eyebrow">PORTION LANGUAGE</span><h3>One kitchen. Four module sizes.</h3></div><div className="cube-row">{cubes.map((cube) => <div className="cube-item" key={cube.ml}><div className="iso-cube" style={{ width: cube.size, height: cube.size }}><span>{cube.ml}</span></div><strong>{cube.ml} ml</strong><small>{cube.label}</small></div>)}</div></div>;
}

export function FreezerMap() {
  return <div className="infographic freezer-map"><div className="infographic-title"><span className="eyebrow">FREEZER ARCHITECTURE</span><h3>Three drawers. Zero mystery.</h3></div><div className="freezer-shell"><div className="freezer-drawer"><span>01</span><strong>BASES</strong><div className="mini-cubes"><i/><i/><i/><i/><i/></div></div><div className="freezer-drawer"><span>02</span><strong>PROTEIN</strong><div className="protein-packs"><i/><i/><i/></div></div><div className="freezer-drawer"><span>03</span><strong>VEG + CARBS</strong><div className="veg-packs"><i/><i/><i/><i/></div></div></div></div>;
}
