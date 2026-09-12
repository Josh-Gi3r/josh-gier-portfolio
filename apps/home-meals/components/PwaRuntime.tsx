"use client";
import {useEffect,useState} from "react";

export function PwaRuntime(){
 const[offline,setOffline]=useState(false);
 useEffect(()=>{
  const sync=()=>setOffline(!navigator.onLine);sync();
  window.addEventListener("online",sync);window.addEventListener("offline",sync);
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("/sw.js").catch(()=>undefined);
  return()=>{window.removeEventListener("online",sync);window.removeEventListener("offline",sync)};
 },[]);
 if(!offline)return null;
 return <div className="hm-offline-v8" role="status">Offline · using what’s already saved on this phone</div>;
}
