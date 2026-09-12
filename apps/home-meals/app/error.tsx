"use client";
import Link from "next/link";
import {useEffect} from "react";
import {feedback} from "@/lib/feedback";

export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 useEffect(()=>{console.error("Home Meals route error",error)},[error]);
 return <div className="hm-page-v5 hm-error-v13" role="alert"><span>HOME MEALS</span><h1>That screen didn’t open properly.</h1><p>Your saved kitchen and meal data stays on this device. Try the screen again, or go Home and keep moving.</p><div><button onClick={()=>{feedback("tap");reset()}}>Try again</button><Link href="/">Home</Link></div>{error.digest&&<small>Reference {error.digest}</small>}</div>;
}
