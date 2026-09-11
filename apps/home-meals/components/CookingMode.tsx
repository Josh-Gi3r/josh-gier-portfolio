"use client";

import { useEffect, useState } from "react";
import type { Recipe } from "@/data/home-meals";
import { Icon } from "./Icons";

export function CookingMode({ recipe }: { recipe: Recipe }) {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const timer = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(timer); }, [running]);
  const format = (value: number) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  return <div className="cooking-mode"><div className="cook-progress"><span>STEP {step + 1} OF {recipe.steps.length}</span><div><i style={{ width: `${((step + 1) / recipe.steps.length) * 100}%` }}/></div></div><div className="cook-step-card"><span className="cook-step-number">{String(step + 1).padStart(2, "0")}</span><h1>{recipe.steps[step]}</h1><p>Hands busy? The permanent Ask Home control will become realtime voice in Phase 2.</p></div><div className="cook-timer"><Icon name="clock"/><strong>{format(seconds)}</strong><button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start timer"}</button><button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button></div><div className="cook-controls"><button className="secondary-button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Previous</button><button className="primary-button" onClick={() => setStep((s) => Math.min(recipe.steps.length - 1, s + 1))}>{step === recipe.steps.length - 1 ? "Finish cooking" : "Next step"}<Icon name="arrow"/></button></div></div>;
}
