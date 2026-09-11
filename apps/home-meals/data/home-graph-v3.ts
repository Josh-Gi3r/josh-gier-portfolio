import {
  motherBases,
  ingredients,
  meals,
  type MotherBase,
  type MidBase,
  type IngredientDef,
  type Meal,
  type Requirement,
  defaultWeek,
  initialComponentStock as legacyComponentStock,
  initialIngredientStock,
  getMeal,
  getMother,
  shoppingNeedsForWeek,
  prepNeedsForWeek as legacyPrepNeedsForWeek,
} from "./home-graph";

export type { MotherBase, MidBase, IngredientDef, Meal, Requirement };
export { motherBases, ingredients, meals, defaultWeek, initialIngredientStock, getMeal, getMother, shoppingNeedsForWeek };

const oldMid=(id:string)=>requireLegacy(id);
function requireLegacy(id:string):MidBase {
  const legacy = legacyMidBases.find(x=>x.id===id);
  if(!legacy) throw new Error(`Missing legacy mid ${id}`);
  return legacy;
}
import { midBases as legacyMidBases } from "./home-graph";

const patched=(id:string,patch:Partial<MidBase>):MidBase=>({...oldMid(id),...patch});

export const midBases:MidBase[]=[
  patched("makhani",{code:"MAKHANI",parentMotherIds:["gold"],standalone:false}),
  patched("saag",{code:"SAAG",parentMotherIds:["gold"],standalone:false}),
  patched("korma",{code:"KORMA",parentMotherIds:["gold","onion"],standalone:false}),
  patched("rendang",{code:"RENDANG",parentMotherIds:["rempah"],standalone:false}),
  patched("laksa",{code:"LAKSA",parentMotherIds:["rempah"],standalone:false}),
  patched("thai-green",{code:"THAI-G",parentMotherIds:[],standalone:true}),
  patched("thai-red",{code:"THAI-R",parentMotherIds:[],standalone:true}),
  patched("wok-brown",{code:"WOK-B",parentMotherIds:["clear"],standalone:false}),
  patched("wok-white",{code:"WOK-W",parentMotherIds:["clear"],standalone:false}),
  patched("teriyaki",{code:"TERI",parentMotherIds:[],standalone:true}),
  patched("jp-curry",{code:"JP-CURRY",parentMotherIds:["onion","clear"],standalone:false}),
  patched("gochujang",{code:"GOCHU",parentMotherIds:[],standalone:true}),
  patched("harissa",{code:"HARISSA",parentMotherIds:["red"],standalone:false}),
  patched("chipotle",{code:"CHIPOTLE",parentMotherIds:["red"],standalone:false}),
  patched("pesto",{code:"PESTO",parentMotherIds:[],standalone:true}),
  patched("duxelles",{code:"DUX",parentMotherIds:["blond","dark"],standalone:false}),
  {id:"malaysian-kari",code:"KARI",name:"Malaysian kari paste",parentMotherIds:[],standalone:true,portionLabel:"150 ml puck",portionMl:150,batchYield:4,tone:"#c7892d",examples:["Kari ayam","Fish head curry","Kari kambing","Curry puffs"]},
  {id:"asam-pedas",code:"ASAM",name:"Asam pedas paste",parentMotherIds:[],standalone:true,portionLabel:"150 ml puck",portionMl:150,batchYield:4,tone:"#b43b2b",examples:["Asam pedas fish","Asam pedas prawn","Asam pedas chicken","Asam pedas okra"]},
  {id:"nam-prik-pao",code:"NPP",name:"Nam prik pao",parentMotherIds:["clear"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#8f3927",examples:["Tom yum goong","Cashew chicken","Tom yum fried rice","Chilli jam toast"]},
  {id:"krapow",code:"KRAPOW",name:"Thai basil sauce",parentMotherIds:[],standalone:true,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#506f3f",examples:["Pad krapow","Pad kee mao","Basil seafood","Basil tofu"]},
  {id:"nuoc-cham",code:"NUOC",name:"Nuoc cham base",parentMotherIds:[],standalone:true,portionLabel:"60 ml fridge portion",portionMl:60,batchYield:6,tone:"#d5b55b",examples:["Bun cha","Bun thit nuong","Fresh spring rolls","Grilled chicken bowl"]},
  {id:"char-siu",code:"CHAR-SIU",name:"Char siu marinade",parentMotherIds:[],standalone:true,portionLabel:"60 ml portion",portionMl:60,batchYield:6,tone:"#a44532",examples:["Char siu rice","Char siu chicken","Char siu noodles","Fried rice"]},
  {id:"douban",code:"DOUBAN",name:"Doubanjiang mapo base",parentMotherIds:["clear"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#88362c",examples:["Mapo tofu","Mapo eggplant","Dan dan noodles","Twice-cooked beef"]},
  {id:"ginger-scallion",code:"GS-OIL",name:"Ginger-scallion oil",parentMotherIds:["clear","dark"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#7d9a55",examples:["Hainanese chicken","Ginger-scallion noodles","Steamed fish","Seafood finish"]},
  {id:"dashi",code:"DASHI",name:"Awase dashi",parentMotherIds:[],standalone:true,portionLabel:"250 ml puck",portionMl:250,batchYield:6,tone:"#b9a06e",examples:["Miso soup","Oyakodon","Katsudon","Nikujaga","Udon","Chawanmushi"]},
  {id:"k-anchovy",code:"K-STOCK",name:"Korean anchovy-kelp stock",parentMotherIds:[],standalone:true,portionLabel:"250 ml puck",portionMl:250,batchYield:8,tone:"#8b8d71",examples:["Doenjang jjigae","Kimchi jjigae","Soondubu","Kalguksu","Tteokbokki"]},
];

export const getMid=(id:string)=>midBases.find(x=>x.id===id);

export const initialComponentStock:Record<string,number>={
  ...legacyComponentStock,
  ...Object.fromEntries(midBases.filter(x=>!(x.id in legacyComponentStock)).map(x=>[x.id,0]))
};

export const prepNeedsForWeek=(week:string[],componentStock:Record<string,number>)=>{
  const demand:Record<string,number>={};
  for(const mealId of week){
    const meal=getMeal(mealId);
    for(const id of [...meal.motherIds,...meal.midIds]) demand[id]=(demand[id]??0)+1;
  }
  return Object.entries(demand).map(([id,needed])=>({id,needed,onHand:componentStock[id]??0,short:Math.max(0,needed-(componentStock[id]??0))})).filter(x=>x.short>0);
};

export const coverageByMother=motherBases.map(mother=>({
  mother,
  mids:midBases.filter(mid=>mid.parentMotherIds.includes(mother.id)),
  meals:meals.filter(meal=>meal.motherIds.includes(mother.id)),
}));

export const midsByCuisine=[
  {label:"Indian",ids:["makhani","saag","korma"]},
  {label:"Malaysian",ids:["rendang","laksa","malaysian-kari","asam-pedas"]},
  {label:"Thai",ids:["thai-green","thai-red","nam-prik-pao","krapow"]},
  {label:"Vietnamese",ids:["nuoc-cham"]},
  {label:"Chinese",ids:["wok-brown","wok-white","char-siu","douban","ginger-scallion"]},
  {label:"Japanese",ids:["dashi","teriyaki","jp-curry"]},
  {label:"Korean",ids:["k-anchovy","gochujang"]},
  {label:"Middle Eastern",ids:["harissa"]},
  {label:"Mexican",ids:["chipotle"]},
  {label:"Italian / European",ids:["pesto","duxelles"]},
];

export const totalDinnerDirections=150;
