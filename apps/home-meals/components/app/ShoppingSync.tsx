"use client";
import {useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";
import {getIngredient} from "@/data/home-data";
import {feedback} from "@/lib/feedback";
import {useHousehold} from "../HouseholdState";
import styles from "./ShoppingSync.module.css";

export function ShoppingSync(){
 const h=useHousehold();const[target,setTarget]=useState<HTMLElement|null>(null);
 useEffect(()=>{const find=()=>setTarget(document.querySelector<HTMLElement>(".hm-shop-sheet-v5"));find();const observer=new MutationObserver(find);observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect()},[]);
 const checked=useMemo(()=>h.shoppingNeeds.filter(x=>h.groceryChecked[x.id]),[h.shoppingNeeds,h.groceryChecked]);
 const finish=()=>{const bought=[...checked];for(const item of bought){const def=getIngredient(item.id);const add=item.unit==="have"?1:item.qty;h.setIngredient(item.id,(h.ingredientStock[item.id]??0)+add);if(h.groceryChecked[item.id])h.toggleGrocery(item.id);if(def?.category==="Fresh"&&h.useSoon[item.id])h.toggleUseSoon(item.id)}feedback("success")};
 if(!target)return null;
 return createPortal(<div className={styles.bar}><div className={styles.copy}><strong>{checked.length?`${checked.length} ${checked.length===1?"item":"items"} in the basket`:"Nothing checked yet"}</strong><span>Finish shopping adds only checked items to Kitchen.</span></div><button className={styles.button} disabled={!checked.length} onClick={finish}>Finish shopping</button></div>,target);
}
