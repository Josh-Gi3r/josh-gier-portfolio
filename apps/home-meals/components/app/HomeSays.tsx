import type {ReactNode} from "react";
import {Orb} from "./Orb";

// "Home says" — the orb plus a white glass speech bubble, with optional action chips.
export function HomeSays({children,actions,size=36,className="",bubbleClass=""}:{children:ReactNode;actions?:ReactNode;size?:number;className?:string;bubbleClass?:string}){
 return <div className={`hm-says ${className}`}>
  <Orb size={size}/>
  <div className={`hm-bubble ${bubbleClass}`}>{children}{actions&&<div className="hm-bubble-actions">{actions}</div>}</div>
 </div>;
}
