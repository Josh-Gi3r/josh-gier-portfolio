"use client";
import { useEffect, useMemo, useState } from "react";
import { groceryGroups } from "@/data/foundation";

export function GroceryChecklist(){
 const all=groceryGroups.flatMap(g=>g.items.map(item=>({group:g.group,item,id:`${g.group}:${item}`})));
 const [checked,setChecked]=useState<Record<string,boolean>>({});
 const [query,setQuery]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem("home-meals-foundation-shop");if(raw)setChecked(JSON.parse(raw))}catch{}},[]);
 const toggle=(id:string)=>setChecked(prev=>{const next={...prev,[id]:!prev[id]};localStorage.setItem("home-meals-foundation-shop",JSON.stringify(next));return next});
 const done=Object.values(checked).filter(Boolean).length;
 const visible=useMemo(()=>groceryGroups.map(g=>({...g,items:g.items.filter(i=>`${g.group} ${i}`.toLowerCase().includes(query.toLowerCase()))})).filter(g=>g.items.length),[query]);
 const reset=()=>{setChecked({});localStorage.removeItem("home-meals-foundation-shop")};
 return <div className="grocery-app"><div className="grocery-toolbar"><div><span className="eyebrow">FOUNDATION SHOP</span><strong>{done} / {all.length}</strong><small>items checked</small></div><div className="grocery-progress"><i style={{width:`${Math.round(done/all.length*100)}%`}}/></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the shop…"/><button type="button" className="secondary-button" onClick={reset}>Reset</button></div><div className="grocery-columns">{visible.map(group=><section key={group.group}><h2>{group.group}</h2>{group.items.map(item=>{const id=`${group.group}:${item}`;return <label key={id} className={checked[id]?"checked":""}><input type="checkbox" checked={!!checked[id]} onChange={()=>toggle(id)}/><span>{item}</span></label>})}</section>)}</div></div>
}
