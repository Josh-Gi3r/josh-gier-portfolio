import type {ReactNode} from "react";
import {JoshPresenceAnchor,type JoshExpression} from "../JoshPresence";

// Home speaks through one shared Josh presence. If another surface owns Josh, this bubble remains without creating a duplicate face.
export function HomeSays({children,actions,className="",bubbleClass="",expression="talk",withJosh=true}:{children:ReactNode;actions?:ReactNode;className?:string;bubbleClass?:string;expression?:JoshExpression;withJosh?:boolean}){
 return <div className={`hm-says ${className}`}>
  {withJosh&&<JoshPresenceAnchor priority={40} expression={expression} size={42}/>} 
  <div className={`hm-bubble ${bubbleClass}`}>{children}{actions&&<div className="hm-bubble-actions">{actions}</div>}</div>
 </div>;
}
