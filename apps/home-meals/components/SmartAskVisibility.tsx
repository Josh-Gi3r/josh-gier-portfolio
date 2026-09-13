"use client";
import {useEffect} from "react";
import "./SmartAskVisibility.css";

export function SmartAskVisibility(){
 useEffect(()=>{let live=true;fetch("/api/ask-home",{cache:"no-store"}).then(r=>r.json()).then((data:{configured?:boolean})=>{if(!live)return;if(data.configured)document.documentElement.dataset.hmSmartAsk="1";else delete document.documentElement.dataset.hmSmartAsk}).catch(()=>{});return()=>{live=false;delete document.documentElement.dataset.hmSmartAsk}},[]);
 return null;
}
