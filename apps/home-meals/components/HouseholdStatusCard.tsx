"use client";
import {useEffect,useState} from "react";
import {getHouseholdPerson,householdPersonLabel,setHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import styles from "./HouseholdStatusCard.module.css";

type Status={householdSync:boolean;database:boolean;householdCode:boolean;askHome:boolean;vision:boolean;realtimeVoice:boolean;backend:string};

export function HouseholdStatusCard(){
 const[status,setStatus]=useState<Status|null>(null);const[person,setPerson]=useState<HouseholdPerson|null>(null);
 useEffect(()=>{setPerson(getHouseholdPerson());fetch("/api/system-status",{cache:"no-store"}).then(r=>r.json()).then(setStatus).catch(()=>{})},[]);
 const choose=(next:HouseholdPerson)=>{setHouseholdPerson(next);setPerson(next)};
 const rows=[
  {label:"Josh + G sync",on:!!status?.householdSync,note:status?.householdSync?"Railway Postgres":"Local device only"},
  {label:"Ask Home",on:!!status?.askHome,note:status?.askHome?"Model connected":"Local household logic"},
  {label:"Camera intelligence",on:!!status?.vision,note:status?.vision?"Vision connected":"Manual confirmation"},
  {label:"Realtime voice",on:!!status?.realtimeVoice,note:status?.realtimeVoice?"Live conversation":"Browser speech fallback"},
 ];
 return <section className={styles.card} aria-label="Home Meals household status"><header><div><span>HOUSEHOLD</span><h2>This device</h2><p>Kitchen and Plan are shared. This only says who is holding this phone.</p></div><b>{householdPersonLabel(person)}</b></header><div className={styles.people}><button className={person==="josh"?styles.active:""} onClick={()=>choose("josh")}><i>J</i><span>Josh</span></button><button className={person==="g"?styles.active:""} onClick={()=>choose("g")}><i>G</i><span>G</span></button></div><div className={styles.rows}>{rows.map(row=><div key={row.label}><i className={row.on?styles.on:""}/><span><strong>{row.label}</strong><small>{row.note}</small></span><b>{row.on?"Live":"Fallback"}</b></div>)}</div>{status&&<footer><span>Backend</span><strong>{status.backend==="railway-postgres"?"Railway Postgres":status.backend}</strong></footer>}</section>;
}
