import type {CSSProperties} from "react";

// Home's presence: a breathing green glass sphere with drifting peach and lemon light.
// At 80px and above it also gets two expanding rings and a soft halo.
export function Orb({size=44,className="",label}:{size?:number;className?:string;label?:string}){
 const big=size>=80;
 return <span className={`hm-orb ${className}`} style={{"--size":`${size}px`} as CSSProperties} role={label?"img":undefined} aria-label={label} aria-hidden={label?undefined:true}>
  {big&&<><i className="hm-orb-ring"/><i className="hm-orb-ring two"/><i className="hm-orb-halo"/></>}
  <span className="hm-orb-core"><i className="hm-orb-light peach"/><i className="hm-orb-light lemon"/><i className="hm-orb-gloss"/></span>
 </span>;
}

export function Waves({white=false,still=false}:{white?:boolean;still?:boolean}){
 return <span className={`hm-waves ${white?"white":""} ${still?"still":""}`} aria-hidden="true"><i/><i/><i/><i/></span>;
}
