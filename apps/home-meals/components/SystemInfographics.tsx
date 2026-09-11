"use client";

import { useState } from "react";
import { bases, midBases } from "@/data/home-meals";

const transformations: Record<string, { finisher: string; meal: string }> = {
  RED: { finisher: "basil + Parmesan", meal: "Italian tomato chicken" },
  GOLD: { finisher: "coconut milk", meal: "Coconut curry chicken" },
  ASIAN: { finisher: "soy + honey", meal: "Ginger soy chicken" },
  DARK: { finisher: "DUX + cream", meal: "Mushroom cream chicken" },
  GREEN: { finisher: "PESTO + lemon", meal: "Pesto chicken" },
  FIRE: { finisher: "HAR + yoghurt", meal: "Harissa-style chicken" },
  BLOND: { finisher: "cream + lemon", meal: "Lemon cream chicken" },
  SAMBAL: { finisher: "tamarind + lime", meal: "Sambal chicken" }
};

export function MealTransformation() {
  const [selected, setSelected] = useState("GOLD");
  const result = transformations[selected];
  return <div className="infographic transformation-card">
    <div className="infographic-title"><span className="eyebrow">CODED INFOGRAPHIC</span><h3>Same dinner core. Eight directions.</h3><p>Chicken + broccoli + rice stays constant. The mother base changes the architecture; the mid-base or finisher gives it a specific identity.</p></div>
    <div className="transform-line">
      <div className="ingredient-stack"><span>Chicken</span><span>Broccoli</span><span>Rice</span></div>
      <div className="flow-arrow">→</div>
      <div className="base-selector">{bases.map((base) => <button key={base.code} className={selected === base.code ? "selected" : ""} style={{ "--base-color": base.tone } as React.CSSProperties} onClick={() => setSelected(base.code)}><i/>{base.code}</button>)}</div>
      <div className="flow-arrow">→</div>
      <div className="transform-result"><small>MID / FINISH</small><strong>{result.finisher}</strong><span>{result.meal}</span></div>
    </div>
  </div>;
}

export function SystemLayers() {
  return <div className="infographic system-layers"><div className="infographic-title"><span className="eyebrow">THE HOME MEALS ENGINE</span><h3>Foundation first. Specificity later.</h3><p>The mother base holds the slow work. Mid-bases create directional identity. Boosters and fresh finishers stay modular.</p></div><div className="layer-flow"><div><small>01</small><strong>MOTHER BASE</strong><span>8 foundations</span></div><b>→</b><div><small>02</small><strong>MID-BASE</strong><span>{midBases.length} directions</span></div><b>→</b><div><small>03</small><strong>BOOST / FINISH</strong><span>fresh specificity</span></div><b>→</b><div><small>04</small><strong>DINNER</strong><span>fresh-cooked</span></div></div></div>;
}

export function CubeScale() {
  const cubes = [{ ml: 30, label: "Booster / mid", size: 44 }, { ml: 60, label: "Aromatic base", size: 62 }, { ml: 90, label: "Sauce foundation", size: 78 }, { ml: 250, label: "Finished meal only", size: 104 }];
  return <div className="infographic cube-scale"><div className="infographic-title"><span className="eyebrow">PORTION LANGUAGE</span><h3>One kitchen. Four module sizes.</h3></div><div className="cube-row">{cubes.map((cube) => <div className="cube-item" key={cube.ml}><div className="iso-cube" style={{ width: cube.size, height: cube.size }}><span>{cube.ml}</span></div><strong>{cube.ml} ml</strong><small>{cube.label}</small></div>)}</div></div>;
}

export function FreezerMap() {
  return <div className="infographic freezer-map"><div className="infographic-title"><span className="eyebrow">FREEZER ARCHITECTURE</span><h3>Three drawers. Zero mystery.</h3></div><div className="freezer-shell"><div className="freezer-drawer"><span>01</span><strong>BASES + MIDS</strong><div className="mini-cubes"><i/><i/><i/><i/><i/><i/><i/><i/></div></div><div className="freezer-drawer"><span>02</span><strong>PROTEIN</strong><div className="protein-packs"><i/><i/><i/></div></div><div className="freezer-drawer"><span>03</span><strong>VEG + CARBS</strong><div className="veg-packs"><i/><i/><i/><i/></div></div></div></div>;
}
