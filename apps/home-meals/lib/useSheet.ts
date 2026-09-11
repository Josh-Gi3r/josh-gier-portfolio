"use client";
import {useEffect} from "react";
export function useSheet(open:boolean,onClose:()=>void){
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;const active=document.activeElement as HTMLElement|null;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};window.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key);active?.focus?.()}},[open,onClose]);
}
