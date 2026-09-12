"use client";
import {useEffect,useRef,useState} from "react";
export function PwaRuntime(){
 const[offline,setOffline]=useState(false);const[updateReady,setUpdateReady]=useState(false);const waiting=useRef<ServiceWorker|null>(null);const reloading=useRef(false);
 useEffect(()=>{const sync=()=>setOffline(!navigator.onLine);sync();window.addEventListener("online",sync);window.addEventListener("offline",sync);let reg:ServiceWorkerRegistration|undefined;let focusTimer:ReturnType<typeof setTimeout>|undefined;let check:()=>void=()=>{};
  const watch=(r:ServiceWorkerRegistration)=>{reg=r;if(r.waiting){waiting.current=r.waiting;setUpdateReady(true)}r.addEventListener("updatefound",()=>{const worker=r.installing;if(!worker)return;worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller){waiting.current=r.waiting??worker;setUpdateReady(true)}})});};
  if("serviceWorker" in navigator&&location.protocol==="https:"){navigator.serviceWorker.register("/sw.js").then(watch).catch(()=>{});navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reloading.current)return;reloading.current=true;window.location.reload()});check=()=>{if(focusTimer)clearTimeout(focusTimer);focusTimer=setTimeout(()=>reg?.update().catch(()=>{}),700)};window.addEventListener("focus",check)}
  return()=>{window.removeEventListener("online",sync);window.removeEventListener("offline",sync);window.removeEventListener("focus",check);if(focusTimer)clearTimeout(focusTimer)};
 },[]);
 const applyUpdate=()=>{const worker=waiting.current;if(!worker){window.location.reload();return}worker.postMessage({type:"SKIP_WAITING"})};
 return <>{offline&&<div className="hm-offline-v8" role="status">Offline · saved household data still works on this device</div>}{updateReady&&<div className="hm-update-ready-v39" role="status"><span><strong>Home Meals updated</strong><small>Refresh when you’re ready. Nothing will interrupt cooking automatically.</small></span><button onClick={applyUpdate}>Refresh</button></div>}</>
}
