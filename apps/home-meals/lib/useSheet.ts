"use client";
import {useEffect,useRef} from "react";
const focusable='button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
export function useSheet(open:boolean,onClose:()=>void){
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;const active=document.activeElement as HTMLElement|null;document.body.style.overflow="hidden";
  const dialog=()=>[...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].filter(x=>x.offsetParent!==null).at(-1)??null;
  const focusFirst=()=>{const d=dialog();if(!d)return;const preferred=d.querySelector<HTMLElement>('input:not([type="checkbox"]):not([disabled]),textarea:not([disabled]),select:not([disabled])');const first=preferred??d.querySelector<HTMLElement>(focusable);first?.focus({preventScroll:true})};
  const timer=window.setTimeout(focusFirst,0);
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){e.preventDefault();closeRef.current();return}if(e.key!=="Tab")return;const d=dialog();if(!d)return;const items=[...d.querySelectorAll<HTMLElement>(focusable)].filter(x=>x.offsetParent!==null);if(!items.length){e.preventDefault();d.focus();return}const first=items[0],last=items[items.length-1],current=document.activeElement;if(e.shiftKey&&current===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&current===last){e.preventDefault();first.focus()}else if(!d.contains(current)){e.preventDefault();first.focus()}};
  window.addEventListener("keydown",key);return()=>{window.clearTimeout(timer);document.body.style.overflow=old;window.removeEventListener("keydown",key);window.setTimeout(()=>active?.focus?.({preventScroll:true}),0)}},[open]);
}
