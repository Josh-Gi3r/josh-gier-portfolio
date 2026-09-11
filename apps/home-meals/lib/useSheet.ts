"use client";
import {useEffect,useRef} from "react";
export function useSheet(open:boolean,onClose:()=>void){
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;const active=document.activeElement as HTMLElement|null;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")closeRef.current()};window.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key);active?.focus?.()}},[open]);
}
