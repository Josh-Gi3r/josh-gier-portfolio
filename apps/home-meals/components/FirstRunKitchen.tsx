"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useHousehold} from "./HouseholdState";
import {feedback} from "@/lib/feedback";

/**
 * First-run truth choice. Unknown is not the same thing as empty.
 * This appears only on Home/Kitchen until the household explicitly confirms reality.
 */
export function FirstRunKitchen(){
 const path=usePathname(),h=useHousehold();
 if(h.kitchenReady||!(path==="/"||path==="/kitchen"))return null;
 const empty=()=>{h.confirmEmptyKitchen();feedback("success");window.setTimeout(()=>{window.location.href="/prep"},50)};
 return <div className="hm-sheet-backdrop" role="presentation">
  <section className="hm-sheet" role="dialog" aria-modal="true" aria-label="Start Home Meals">
   <i className="hm-sheet-handle"/>
   <div className="hm-sheet-head"><h2>What’s actually in the kitchen?</h2></div>
   <p className="hm-sheet-sub">Home needs one truthful starting point. Unknown and empty are different.</p>
   <div className="hm-list tight" style={{marginTop:14}}>
    <button className="hm-card hm-row hm-lift" style={{textAlign:"left",padding:14}} onClick={empty}><span style={{fontSize:28}}>∅</span><span><strong>Kitchen is empty</strong><small>We haven’t bought anything yet. Mark everything Out and build the first shop from zero.</small></span></button>
    <Link className="hm-card hm-row hm-lift" style={{padding:14}} href="/kitchen"><span style={{fontSize:26}}>＋</span><span><strong>Add what we already have</strong><small>Update only the things that are actually here.</small></span></Link>
    <Link className="hm-card hm-row hm-lift" style={{padding:14}} href="/scan?mode=Fridge&back=%2Fkitchen"><span style={{fontSize:25}}>◉</span><span><strong>Show Home</strong><small>Use the camera as a reference, then confirm the changes.</small></span></Link>
   </div>
  </section>
 </div>;
}
