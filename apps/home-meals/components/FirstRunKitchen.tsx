"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
import {useHousehold} from "./HouseholdState";
import {getHouseholdPerson} from "@/lib/device-profile";
import {feedback} from "@/lib/feedback";

/** First-run kitchen choice. Unknown is not the same thing as confirmed empty. */
export function FirstRunKitchen(){
 const path=usePathname(),h=useHousehold(),[syncReady,setSyncReady]=useState(false),[guidePending,setGuidePending]=useState(true);
 useEffect(()=>{let live=true;const check=async()=>{try{const res=await fetch("/api/household/session",{cache:"no-store"}),info=await res.json() as {configured?:boolean;authenticated?:boolean};if(!live)return;setSyncReady(!info.configured|| (!!info.authenticated&&!!getHouseholdPerson()))}catch{if(live)setSyncReady(true)}};void check();const ready=()=>setSyncReady(true);window.addEventListener("home-meals:sync-ready",ready);return()=>{live=false;window.removeEventListener("home-meals:sync-ready",ready)}},[]);
 useEffect(()=>{const checkGuide=()=>{try{const person=getHouseholdPerson(),raw=person?localStorage.getItem(`home-meals-guide-v1:${person}`):null;setGuidePending(!!person&&!raw)}catch{setGuidePending(false)}};checkGuide();window.addEventListener("home-meals:person",checkGuide);window.addEventListener("home-meals:guide-state",checkGuide);return()=>{window.removeEventListener("home-meals:person",checkGuide);window.removeEventListener("home-meals:guide-state",checkGuide)}},[]);
 // Josh and G both learn Kitchen inside the talking-head walkthrough first. Do not let this fallback setup sheet pre-empt either first-use tour.
 if(!syncReady||guidePending||h.kitchenReady||!(path==="/"||path==="/kitchen"))return null;
 const empty=()=>{h.confirmEmptyKitchen();feedback("success");window.setTimeout(()=>{window.location.href="/prep"},40)};
 const manual=()=>{h.confirmEmptyKitchen();feedback("success");window.setTimeout(()=>{window.location.href="/kitchen"},40)};
 return <div className="hm-sheet-backdrop" role="presentation">
  <section className="hm-sheet" role="dialog" aria-modal="true" aria-label="Start Home Meals">
   <i className="hm-sheet-handle"/>
   <div className="hm-sheet-head"><h2>What’s actually in the kitchen?</h2></div>
   <p className="hm-sheet-sub">Start with what’s really at home. If the kitchen is empty, say so once. Otherwise add what you have or show Home with the camera.</p>
   <div className="hm-list tight" style={{marginTop:14}}>
    <button className="hm-card hm-row hm-lift" style={{textAlign:"left",padding:14}} onClick={empty}><span style={{fontSize:28}}>∅</span><span><strong>Kitchen is empty</strong><small>We haven’t bought anything yet. Start the first shop from zero.</small></span></button>
    <button className="hm-card hm-row hm-lift" style={{textAlign:"left",padding:14}} onClick={manual}><span style={{fontSize:26}}>＋</span><span><strong>Add what we have</strong><small>Start empty, then add only the food and prep that are actually here.</small></span></button>
    <Link className="hm-card hm-row hm-lift" style={{padding:14}} href="/scan?mode=Fridge&back=%2Fkitchen"><span style={{fontSize:25}}>◉</span><span><strong>Show Home</strong><small>Use the camera as a reference, then confirm anything before Kitchen changes.</small></span></Link>
   </div>
  </section>
 </div>;
}
