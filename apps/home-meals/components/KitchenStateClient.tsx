"use client";
import { useEffect, useMemo, useState } from "react";
import { boosters, mids, mothers } from "@/data/foundation";
import { firstRunCodes } from "@/data/foundation-ops";
import { Icon } from "./Icons";

type Item={name:string;qty:number;unit:string};
const freshDefaults:Item[]=[{name:"Eggs",qty:8,unit:"eggs"},{name:"Cooking cream",qty:1,unit:"carton"},{name:"Plain yoghurt",qty:1,unit:"tub"},{name:"Parmesan",qty:1,unit:"piece"},{name:"Broccoli",qty:2,unit:"heads"},{name:"Mushrooms",qty:1,unit:"box"},{name:"Spinach",qty:1,unit:"bag"}];
const pantryDefaults:Item[]=[{name:"Basmati / jasmine rice",qty:1,unit:"bag"},{name:"Pasta",qty:2,unit:"packs"},{name:"Coconut milk",qty:4,unit:"cans"},{name:"Chickpeas",qty:4,unit:"cans"},{name:"Light soy sauce",qty:1,unit:"bottle"},{name:"Oyster sauce",qty:1,unit:"bottle"},{name:"Miso",qty:1,unit:"tub"}];

export function KitchenStateClient(){
 const foundation=[...mothers,...mids,...boosters];
 const [tab,setTab]=useState<"foundation"|"fridge"|"pantry">("foundation");
 const [stock,setStock]=useState<Record<string,number>>({});const[fresh,setFresh]=useState(freshDefaults);const[pantry,setPantry]=useState(pantryDefaults);const[newName,setNewName]=useState("");
 useEffect(()=>{try{const a=localStorage.getItem("hm-foundation-stock");if(a)setStock(JSON.parse(a));const b=localStorage.getItem("hm-fridge");if(b)setFresh(JSON.parse(b));const c=localStorage.getItem("hm-pantry");if(c)setPantry(JSON.parse(c))}catch{}},[]);
 const saveStock=(next:Record<string,number>)=>{setStock(next);localStorage.setItem("hm-foundation-stock",JSON.stringify(next))};
 const changeStock=(code:string,d:number)=>saveStock({...stock,[code]:Math.max(0,(stock[code]||0)+d)});
 const loadFirstRun=()=>{const next={...stock};foundation.forEach(x=>{const list=x.role==="mother"?firstRunCodes.mothers:x.role==="mid"?firstRunCodes.mids:firstRunCodes.boosters;if(list.includes(x.code))next[x.code]=x.starterYield});saveStock(next)};
 const list=tab==="fridge"?fresh:pantry;
 const setList=tab==="fridge"?setFresh:setPantry;
 const storageKey=tab==="fridge"?"hm-fridge":"hm-pantry";
 const changeItem=(i:number,d:number)=>{const next=list.map((x,n)=>n===i?{...x,qty:Math.max(0,x.qty+d)}:x);setList(next);localStorage.setItem(storageKey,JSON.stringify(next))};
 const addItem=()=>{const name=newName.trim();if(!name||tab==="foundation")return;const next=[...list,{name,qty:1,unit:"item"}];setList(next);localStorage.setItem(storageKey,JSON.stringify(next));setNewName("")};
 const foundationTotal=useMemo(()=>Object.values(stock).reduce((a,b)=>a+b,0),[stock]);
 return <div className="kitchen-state"><div className="kitchen-tabs"><button className={tab==="foundation"?"active":""} onClick={()=>setTab("foundation")}>Foundation freezer</button><button className={tab==="fridge"?"active":""} onClick={()=>setTab("fridge")}>Fridge</button><button className={tab==="pantry"?"active":""} onClick={()=>setTab("pantry")}>Pantry</button></div>{tab==="foundation"?<><div className="foundation-stock-head"><div><span className="eyebrow">MEASURED STOCK</span><strong>{foundationTotal}</strong><small>portions currently logged</small></div><button className="primary-button" onClick={loadFirstRun}>Load First Run output</button></div><div className="foundation-stock-groups">{(["mother","mid","booster"] as const).map(role=><section key={role}><h3>{role}s</h3>{foundation.filter(x=>x.role===role).map(x=><div className="foundation-stock-row" key={x.code}><i style={{background:x.tone}}/><div><strong>{x.code}</strong><small>{x.name} · {x.portionMl} ml</small></div><div className="qty-control"><button onClick={()=>changeStock(x.code,-1)}><Icon name="minus" size={13}/></button><span>{stock[x.code]||0}</span><button onClick={()=>changeStock(x.code,1)}><Icon name="plus" size={13}/></button></div></div>)}</section>)}</div></>:<><div className="inventory-list">{list.map((x,i)=><div className="inventory-row" key={`${x.name}-${i}`}><span className={`state-marker ${x.qty===0?"use":x.qty===1?"low":"good"}`}/><div className="inventory-name"><strong>{x.name}</strong><small>{x.unit}</small></div><div className="qty-control"><button onClick={()=>changeItem(i,-1)}><Icon name="minus" size={13}/></button><span>{x.qty}</span><button onClick={()=>changeItem(i,1)}><Icon name="plus" size={13}/></button></div></div>)}</div><div className="add-item-row"><input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()} placeholder={`Add to ${tab}`}/><button className="primary-button" onClick={addItem}>Add</button></div></>}</div>
}
