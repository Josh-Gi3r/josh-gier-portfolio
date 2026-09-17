"use client";

import {createContext,useCallback,useContext,useEffect,useId,useMemo,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";

export type JoshExpression="idle"|"talk"|"happy"|"surprised"|"affectionate"|"wink"|"thinking"|"laughing"|"sheepish";

type Slot={id:string;element:HTMLElement;priority:number;expression:JoshExpression;size:number;active:boolean;visible:boolean;ratio:number;sequence:number};
type SlotOptions={priority:number;expression:JoshExpression;size:number;active:boolean};
type PresenceContextValue={register:(id:string,element:HTMLElement,options:SlotOptions)=>void;update:(id:string,patch:Partial<Omit<Slot,"id"|"element"|"sequence">>)=>void;remove:(id:string)=>void;activeId:string|null};
const PresenceContext=createContext<PresenceContextValue|null>(null);

export function JoshHead({expression="idle",size=58,label}:{expression?:JoshExpression;size?:number;label?:string}){
 return <span className={`hm-josh-head ${expression}`} style={{"--josh-size":`${size}px`} as React.CSSProperties} role={label?"img":undefined} aria-label={label} aria-hidden={label?undefined:true}><span className="hm-josh-sprite"/></span>;
}

export function JoshPresenceProvider({children}:{children:ReactNode}){
 const[slots,setSlots]=useState<Record<string,Slot>>({});const sequence=useRef(0);
 const register=useCallback((id:string,element:HTMLElement,options:SlotOptions)=>{setSlots(prev=>({...prev,[id]:{id,element,...options,visible:true,ratio:1,sequence:++sequence.current}}))},[]);
 const update=useCallback((id:string,patch:Partial<Omit<Slot,"id"|"element"|"sequence">>)=>{setSlots(prev=>prev[id]?{...prev,[id]:{...prev[id],...patch}}:prev)},[]);
 const remove=useCallback((id:string)=>{setSlots(prev=>{if(!prev[id])return prev;const next={...prev};delete next[id];return next})},[]);
 const active=useMemo(()=>Object.values(slots).filter(slot=>slot.active&&slot.visible&&slot.element.isConnected).sort((a,b)=>b.priority-a.priority||b.ratio-a.ratio||b.sequence-a.sequence)[0]??null,[slots]);
 const value=useMemo(()=>({register,update,remove,activeId:active?.id??null}),[register,update,remove,active?.id]);
 return <PresenceContext.Provider value={value}>{children}{active?.element?createPortal(<JoshHead expression={active.expression} size={active.size}/>,active.element):null}</PresenceContext.Provider>;
}

export function JoshPresenceAnchor({priority,expression="idle",size=58,active=true,observeVisibility=true,className=""}:{priority:number;expression?:JoshExpression;size?:number;active?:boolean;observeVisibility?:boolean;className?:string}){
 const context=useContext(PresenceContext);if(!context)throw new Error("JoshPresenceAnchor must be inside JoshPresenceProvider");const id=useId();const[node,setNode]=useState<HTMLElement|null>(null);const{register,update,remove,activeId}=context;
 useEffect(()=>{if(!node)return;register(id,node,{priority,expression,size,active});return()=>remove(id)},[node,id,register,remove]);
 useEffect(()=>{update(id,{priority,expression,size,active})},[id,priority,expression,size,active,update]);
 useEffect(()=>{if(!node)return;if(!observeVisibility||typeof IntersectionObserver==="undefined"){update(id,{visible:true,ratio:1});return}const observer=new IntersectionObserver(entries=>{const entry=entries[0];update(id,{visible:entry.isIntersecting&&entry.intersectionRatio>0,ratio:entry.intersectionRatio})},{threshold:[0,.15,.5,.85,1]});observer.observe(node);return()=>observer.disconnect()},[node,id,observeVisibility,update]);
 const on=activeId===id;
 return <span ref={setNode} className={`hm-josh-slot ${className} ${on?"on":""}`} data-josh-presence-slot data-josh-active={on?"true":"false"}/>;
}
