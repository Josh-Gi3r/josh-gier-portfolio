"use client";
import {useEffect,useState,type CSSProperties} from "react";
import {getHouseholdPerson,setHouseholdPerson,type HouseholdPerson} from "@/lib/device-profile";
import {feedback} from "@/lib/feedback";
import {useHousehold} from "./HouseholdState";
import {Icon} from "./Icons";
import {SectionHead} from "./app/Primitives";

type Status={householdSync:boolean;database:boolean;householdCode:boolean;askHome:boolean;vision:boolean;realtimeVoice:boolean;backend:string;model?:string;visionModel?:string;liveModel?:string};

// Who's holding this phone, and what Home is connected to.
export function HouseholdStatusCard(){
 const h=useHousehold();const[status,setStatus]=useState<Status|null>(null);const[person,setPerson]=useState<HouseholdPerson|null>(null);
 useEffect(()=>{setPerson(getHouseholdPerson());fetch("/api/system-status",{cache:"no-store"}).then(r=>r.json()).then(setStatus).catch(()=>{})},[]);
 const choose=(next:HouseholdPerson)=>{setHouseholdPerson(next);setPerson(next);feedback("change")};
 const rated=(who:"josh"|"g")=>Object.values(h.ratings).filter(r=>r[who]).length;
 const rows=[
  {label:"Josh + G",on:!!status?.householdSync,note:status?.householdSync?"Shared between us":"Only on this phone",icon:"kitchen" as const},
  {label:"Ask Home",on:!!status?.askHome,note:status?.askHome?"Ready to help":"Basic help",icon:"spark" as const},
  {label:"Camera",on:!!status?.vision,note:status?.vision?"Ready for photos":"Add things yourself",icon:"camera" as const},
  {label:"Voice",on:!!status?.realtimeVoice,note:status?.realtimeVoice?"Ready to talk":"Basic voice",icon:"mic" as const}
 ];
 return <section id="household" aria-label="Household">
  <SectionHead title="Our home" action={<span className="muted">who’s holding this phone</span>}/>
  <div className="hm-people">
   <button className={`josh ${person==="josh"?"on":""}`} aria-pressed={person==="josh"} onClick={()=>choose("josh")}><span className="av">J</span><strong>Josh</strong><small>{rated("josh")} dinners rated</small></button>
   <button className={`g ${person==="g"?"on":""}`} aria-pressed={person==="g"} onClick={()=>choose("g")}><span className="av">G</span><strong>G</strong><small>{rated("g")} dinners rated</small></button>
  </div>
  <SectionHead title="Home is ready" action={status&&<span className="muted">{status.backend==="railway-postgres"?"shared":"this phone"}</span>}/>
  <div className="hm-devices">{rows.map(r=><div key={r.label} className="hm-card" style={{"--bg":r.on?"var(--tint-green)":"var(--track)"} as CSSProperties}><span className="ic"><Icon name={r.icon} size={20}/></span><span><strong>{r.label}</strong><small>{r.note}</small></span><i className={`dot ${r.on?"on":""}`}/></div>)}</div>
 </section>;
}
