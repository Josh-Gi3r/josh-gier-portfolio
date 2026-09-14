// UI colour tones and prep photography helpers.
import {getComponent} from "@/data/home-data";
import {motherHeroImages} from "@/data/mother-hero-assets";
import {prepHeroImages} from "@/data/prep-hero-assets";

const baseTones:Record<string,string>={
 red:"#e65f45",gold:"#c48a1c",rempah:"#a86a2a",sambal:"#b83a2c",dark:"#7a5a48",blond:"#a88a2a",clear:"#b9a16a",onion:"#8b5b32",
 "wok-brown":"#6a4634","wok-white":"#c8b998","thai-green":"#4c8e62","thai-red":"#b94738","ginger-garlic":"#c69058",chilli:"#b54835",
 duxelles:"#706253",krapow:"#3f7d4e",teriyaki:"#75442e","miso-ginger":"#9a704a",gochujang:"#a93b31",bulgogi:"#744c37",harissa:"#b34d38",
 chipotle:"#8f3f32",pesto:"#568b53",saag:"#356a43",laksa:"#c56a2d","massaman-finish":"#8c5835"
};

export function toneFor(id:string){return baseTones[id]??getComponent(id)?.tone??"#8f9c93"}
export function toneGradient(id:string){const t=toneFor(id);return `linear-gradient(135deg,${lighten(t)},${t})`}
export function toneSoft(id:string){return `${toneFor(id)}22`}
function lighten(hex:string){const n=parseInt(hex.slice(1),16);const r=Math.min(255,(n>>16)+38),g=Math.min(255,((n>>8)&255)+38),b=Math.min(255,(n&255)+38);return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,"0")}`}

export function motherHero(id:string):string|undefined{return motherHeroImages[id]}
export const motherHasPhoto=(id:string)=>!!motherHeroImages[id];
export function prepHero(id:string):string|undefined{return motherHeroImages[id]??prepHeroImages[id]}
export const prepHasPhoto=(id:string)=>!!prepHero(id);

// Physical freezer shape is household choice, not food truth. Keep the UI noun neutral.
export function portionWord(_id:string,count=1){return count===1?"portion":"portions"}
