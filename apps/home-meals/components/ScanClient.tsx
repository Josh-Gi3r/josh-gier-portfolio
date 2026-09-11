"use client";

import { useState } from "react";
import { Icon } from "./Icons";

const modes = ["Fridge", "Freezer", "Receipt", "Ingredient", "Prep check", "Meal"];

export function ScanClient() {
  const [mode, setMode] = useState("Fridge");
  const [preview, setPreview] = useState<string | null>(null);
  const [analysed, setAnalysed] = useState(false);
  const onFile = (file?: File) => { if (!file) return; setPreview(URL.createObjectURL(file)); setAnalysed(false); };
  return <div className="scan-experience"><div className="mode-strip">{modes.map((m) => <button key={m} className={mode === m ? "active" : ""} onClick={() => { setMode(m); setAnalysed(false); }}>{m}</button>)}</div><div className="camera-stage">{preview ? <img src={preview} alt="Selected kitchen photo"/> : <><div className="camera-reticle"><i/><i/><i/><i/></div><div className="camera-copy"><Icon name="camera" size={34}/><strong>Show Home your {mode.toLowerCase()}</strong><span>Phase 1 accepts a real photo. Interpretation below is simulated until the vision pipeline is connected.</span></div></>}<label className="camera-shutter"><input type="file" accept="image/*" capture="environment" onChange={(e) => onFile(e.target.files?.[0])}/><span/></label></div>{preview && <button className="primary-button analyse-button" onClick={() => setAnalysed(true)}><Icon name="spark"/> Analyse {mode}</button>}{analysed && <div className="scan-result"><div className="scan-result-head"><span className="eyebrow">PHASE 1 SIMULATION</span><h3>{mode} understood</h3></div>{mode === "Receipt" ? <><p>Village Grocer · 11 Sep</p><ul><li>Chicken thigh 1 kg <strong>RM18.90</strong></li><li>Cooking cream ×2 <strong>RM14.60</strong></li><li>Tomatoes 1 kg <strong>RM7.90</strong></li></ul></> : <><p>I can see a representative kitchen state:</p><div className="detected-chips"><span>Chicken thighs</span><span>Eggs</span><span>Parmesan</span><span>Cream low</span><span>Broccoli</span><span>GOLD × ~7</span></div></>}<button className="secondary-button"><Icon name="check"/> Confirm & update demo inventory</button></div>}</div>;
}
