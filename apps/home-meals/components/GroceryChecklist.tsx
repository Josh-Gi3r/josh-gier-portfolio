"use client";
import { useEffect, useMemo, useState } from "react";
import { firstRunGroceryGroups, fullLibraryExtraGroups } from "@/data/foundation-ops";

export function GroceryChecklist(){
 const [scope,setScope]=useState<"first"|"full">("first");
 const groups=scope==="first"?firstRunGroceryGroups:[...firstRunGroceryGroups,...fullLibraryExtraGroups];
 const all=groups.flatMap(g=>g.items.map(item=>({group:g.group,item,id:`${scope}:${g.group}:${item}`})));
 const [checked,setChecked]=useState<Record<string,boolean>>({});
 const [query,setQuery]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem("home-meals-foundation-shop-v2");if(raw)setChecked(JSON.parse(raw))}catch{}},[]);
 const toggle=(id:string)=>setChecked(prev=>{const next={...prev,[id]:!prev[id]};localStorage.setItem("home-meals-foundation-shop-v2",JSON.stringify(next));return next});
 const done=all.filter(x=>checked[x.id]).length;
 const visible=useMemo(()=>groups.map(g=>({...g,items:g.items.filter(i=>`${g.group} ${i}`.toLowerCase().includes(query.toLowerCase()))})).filter(g=>g.items.length),[groups,query]);
 const reset=()=>{setChecked({});localStorage.removeItem("home-meals-foundation-shop-v2")};
 return <div className="grocery-app"><div className="shop-scope"><button type="button" className={scope==="first"?"active":""} onClick={()=>setScope("first")}><strong>First Run</strong><small>6 mothers + 4 core mids + 4 boosters</small></button><button type="button" className={scope==="full"?"active":""} onClick={()=>setScope("full")}><strong>Full Library Restock</strong><small>Add ingredients needed to unlock all 32 prep components</small></button></div><div className="grocery-toolbar"><div><span className="eyebrow">{scope==="first"?"FIRST FOUNDATION SHOP":"FULL LIBRARY SHOP"}</span><strong>{done} / {all.length}</strong><small>items checked</small></div><div className="grocery-progress"><i style={{width:`${all.length?Math.round(done/all.length*100):0}%`}}/></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the shop…"/><button type="button" className="secondary-button" onClick={reset}>Reset</button></div>{scope==="first"&&<p className="scope-explainer">This is the recommended starting shop. The app knows 32 prep components, but you should not manufacture all of them before you know what you actually use.</p>}<div className="grocery-columns">{visible.map(group=><section key={group.group}><h2>{group.group}</h2>{group.items.map(item=>{const id=`${scope}:${group.group}:${item}`;return <label key={id} className={checked[id]?"checked":""}><input type="checkbox" checked={!!checked[id]} onChange={()=>toggle(id)}/><span>{item}</span></label>})}</section>)}</div></div>
}
