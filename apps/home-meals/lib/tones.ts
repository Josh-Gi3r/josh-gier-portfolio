// UI colour tones for prep components. The design system uses one warm tone per
// base so photos, chips and badges agree across screens; anything not listed
// falls back to the tone stored with the component data.
import {getComponent,motherBases} from "@/data/home-data";
import {motherHeroImages} from "@/data/mother-hero-assets";

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

// Hero photography for the mother bases; bases without one render a tone tile.
export function motherHero(id:string):string|undefined{return motherHeroImages[id]}
export const motherHasPhoto=(id:string)=>!!motherHeroImages[id];

// Short household word for one frozen portion of a base: "puck", "cube" or "portion".
export function portionWord(id:string,count=1){const m=(motherBases.find(x=>x.id===id)??getComponent(id)) as {portionLabel?:string;freezeFormat?:string}|undefined;const label=`${m?.portionLabel??""} ${m?.freezeFormat??""}`;const word=/puck/i.test(label)?"puck":/cube/i.test(label)?"cube":"portion";return count===1?word:`${word}s`}
