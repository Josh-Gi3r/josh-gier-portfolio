"use client";
import Link from "next/link";
import {useEffect} from "react";
import {feedback} from "@/lib/feedback";
import {Orb} from "@/components/app/Orb";

export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 useEffect(()=>{console.error("Home Meals route error",error)},[error]);
 return <div className="hm-state" role="alert"><div className="center"><Orb size={110}/><h1>That screen didn’t open properly.</h1><p>The week, recipes and kitchen are saved on this phone. Try again, or go Home and keep moving.</p><div style={{display:"flex",gap:10}}><button className="hm-btn primary sm" onClick={()=>{feedback("tap");reset()}}>Try again</button><Link className="hm-btn ghost sm" href="/">Home</Link></div></div><div className="foot">{error.digest?`Reference ${error.digest}`:""}</div></div>;
}
