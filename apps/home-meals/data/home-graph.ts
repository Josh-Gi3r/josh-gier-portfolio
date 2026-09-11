import { mealImages } from "@/data/meal-assets";

export type Requirement={id:string;qty:number;unit:"g"|"ml"|"count"|"portion"};
export type MotherBase={id:string;code:string;name:string;purpose:string;approxMeals:string;portionLabel:string;portionMl:number;batchYield:number;freezeFormat:string;tone:string;examples:string[]};
export type MidBase={id:string;code:string;name:string;parentMotherIds:string[];standalone:boolean;portionLabel:string;portionMl:number;batchYield:number;tone:string;examples:string[]};
export type Meal={id:string;title:string;subtitle:string;cuisine:string;minutes:number;method:string;motherIds:string[];midIds:string[];ingredients:Requirement[];image?:string;status:"approved"|"placeholder"};
export type IngredientDef={id:string;name:string;category:"Fresh"|"Protein"|"Dairy"|"Pantry";defaultUnit:"g"|"ml"|"count"};

export const motherBases:MotherBase[]=[
 {id:"red",code:"RED",name:"Neutral tomato base",purpose:"Deep cooked tomato kept herb- and chilli-free so it can move between Italian, Middle Eastern, Spanish and Mexican directions.",approxMeals:"25–30",portionLabel:"350 ml puck",portionMl:350,batchYield:8,freezeFormat:"Flat 300–400 ml pucks",tone:"#b8442f",examples:["Pomodoro","Cacciatore","Shakshuka","Chicken tinga","Chilli","Fish tagine"]},
 {id:"blond",code:"BLOND",name:"Italian soffritto",purpose:"Slow sweet onion, carrot and celery for risotto, soups, ragù, pale sauces and European braises.",approxMeals:"15–20",portionLabel:"120 ml puck",portionMl:120,batchYield:10,freezeFormat:"60 ml cubes or 120–150 ml pucks",tone:"#c7954d",examples:["Risotto","Bolognese","Minestrone","Pasta e fagioli","Pot pie","Cream sauces"]},
 {id:"gold",code:"GOLD",name:"Bhuna masala",purpose:"North Indian onion-tomato-ginger-garlic foundation cooked to oil separation for fast curries, dal, paneer and keema.",approxMeals:"25–30",portionLabel:"225 ml puck",portionMl:225,batchYield:7,freezeFormat:"200–250 ml pucks",tone:"#d5a327",examples:["Chicken curry","Makhani","Saag","Korma","Chana masala","Egg curry"]},
 {id:"sambal",code:"SAMBAL",name:"Sambal tumis",purpose:"Cooked Malaysian chilli-shallot-belacan paste fried to pecah minyak for seafood, eggs, greens and fried rice/noodles.",approxMeals:"~15",portionLabel:"60 ml portion",portionMl:60,batchYield:14,freezeFormat:"60 ml cubes or small tubs",tone:"#b42a22",examples:["Sambal udang","Sambal telur","Sambal kangkung","Nasi lemak","Nasi goreng","Mee goreng"]},
 {id:"rempah",code:"REMPAH",name:"Malay/Nyonya rempah",purpose:"Mild cooked aromatic paste of shallot, lemongrass, galangal, turmeric and candlenut for coconut curries, laksa and rendang branches.",approxMeals:"12–15",portionLabel:"175 ml puck",portionMl:175,batchYield:6,freezeFormat:"150–200 ml pucks",tone:"#c16c2d",examples:["Rendang","Curry laksa","Masak lemak","Kari ayam","Soto","Kapitan chicken"]},
 {id:"clear",code:"CLEAR",name:"Light chicken stock",purpose:"Unsalted gelatin-rich stock that adds body to soups, noodle bowls, stir-fry sauces, risotto and Japanese curry.",approxMeals:"20+ component uses",portionLabel:"500 ml puck",portionMl:500,batchYield:6,freezeFormat:"500 ml–1 L pucks plus small cubes",tone:"#d8bc7d",examples:["Congee","Wonton soup","Ban mian","Noodle soups","Risotto","Stir-fry sauces"]},
 {id:"dark",code:"DARK",name:"Brown jus / gel",purpose:"Roasted unsalted brown stock reduced hard for pan sauces, braises, gravies and deep European flavour.",approxMeals:"12–15",portionLabel:"30 ml cube",portionMl:30,batchYield:28,freezeFormat:"30 ml concentrate cubes",tone:"#5e4938",examples:["Beef stew","Bourguignon","Short ribs","Stroganoff","Pan sauce","Mushroom gravy"]},
 {id:"onion",code:"ONION",name:"Caramelised onion",purpose:"Deep mahogany jammy onion for French onion soup, Japanese curry, biryani, mujaddara, gravy and korma branches.",approxMeals:"~10",portionLabel:"30 ml cube",portionMl:30,batchYield:18,freezeFormat:"30 ml cubes plus 200 ml soup pucks",tone:"#8b5b32",examples:["French onion soup","Japanese curry","Biryani","Mujaddara","Onion gravy","Korma"]}
];

export const midBases:MidBase[]=[
 {id:"makhani",code:"MAKHANI",name:"Makhani",parentMotherIds:["gold"],standalone:false,portionLabel:"100 ml puck",portionMl:100,batchYield:4,tone:"#db7b45",examples:["Butter chicken","Paneer makhani","Makhani beans"]},
 {id:"saag",code:"SAAG",name:"Saag",parentMotherIds:["gold"],standalone:false,portionLabel:"140 ml puck",portionMl:140,batchYield:4,tone:"#4f7f48",examples:["Saag paneer","Palak chicken","Saag dal"]},
 {id:"korma",code:"KORMA",name:"Korma",parentMotherIds:["gold","onion"],standalone:false,portionLabel:"100 ml puck",portionMl:100,batchYield:4,tone:"#c9aa77",examples:["Chicken korma","Vegetable korma","Lamb korma"]},
 {id:"rendang",code:"RENDANG",name:"Rendang concentrate",parentMotherIds:["rempah"],standalone:false,portionLabel:"1 portion",portionMl:60,batchYield:4,tone:"#7a4d2f",examples:["Beef rendang","Chicken rendang","Tempeh rendang"]},
 {id:"laksa",code:"LAKSA",name:"Laksa paste",parentMotherIds:["rempah","clear"],standalone:false,portionLabel:"150 ml puck",portionMl:150,batchYield:4,tone:"#d66d35",examples:["Curry laksa","Laksa lemak","Seafood laksa"]},
 {id:"thai-green",code:"THAI-G",name:"Thai green curry paste",parentMotherIds:[],standalone:true,portionLabel:"45 ml portion",portionMl:45,batchYield:9,tone:"#4e7b48",examples:["Green chicken curry","Green fish curry","Green tofu curry"]},
 {id:"thai-red",code:"THAI-R",name:"Thai red curry paste",parentMotherIds:[],standalone:true,portionLabel:"45 ml portion",portionMl:45,batchYield:9,tone:"#b14b37",examples:["Red chicken curry","Panang-style beef","Red prawn curry"]},
 {id:"wok-brown",code:"WOK-B",name:"Chinese brown stir-fry sauce",parentMotherIds:["clear"],standalone:false,portionLabel:"120 ml portion",portionMl:120,batchYield:4,tone:"#7c5a43",examples:["Beef & broccoli","Chicken & mushrooms","Tofu & vegetables"]},
 {id:"wok-white",code:"WOK-W",name:"Chinese white stir-fry sauce",parentMotherIds:["clear"],standalone:false,portionLabel:"120 ml portion",portionMl:120,batchYield:4,tone:"#d6d0bf",examples:["Moo goo gai pan","Prawns & snow peas","Velveted fish"]},
 {id:"teriyaki",code:"TERI",name:"Teriyaki",parentMotherIds:[],standalone:true,portionLabel:"60 ml portion",portionMl:60,batchYield:4,tone:"#8b552e",examples:["Chicken teriyaki","Salmon teriyaki","Tofu teriyaki"]},
 {id:"jp-curry",code:"JP-CURRY",name:"Japanese curry roux",parentMotherIds:["onion","clear"],standalone:false,portionLabel:"2–3 roux cubes",portionMl:45,batchYield:10,tone:"#a66e33",examples:["Chicken curry","Beef curry","Vegetable curry","Curry udon"]},
 {id:"gochujang",code:"GOCHU",name:"Gochujang sauce",parentMotherIds:["clear"],standalone:false,portionLabel:"60 ml portion",portionMl:60,batchYield:4,tone:"#a7352a",examples:["Tteokbokki","Dak galbi","Bibimbap sauce"]},
 {id:"harissa",code:"HARISSA",name:"Harissa",parentMotherIds:["red"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:12,tone:"#b24731",examples:["Shakshuka","Harissa chicken","Harissa vegetables"]},
 {id:"chipotle",code:"CHIPOTLE",name:"Chipotle adobo",parentMotherIds:["red"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#7c3428",examples:["Chicken tinga","Smoky chilli","Enchiladas"]},
 {id:"pesto",code:"PESTO",name:"Pesto Genovese",parentMotherIds:["blond"],standalone:true,portionLabel:"45 ml cube",portionMl:45,batchYield:8,tone:"#56804e",examples:["Pesto pasta","Pesto salmon","Pesto minestrone"]},
 {id:"duxelles",code:"DUX",name:"Mushroom duxelles",parentMotherIds:["blond","dark"],standalone:false,portionLabel:"90 ml puck",portionMl:90,batchYield:4,tone:"#6e5945",examples:["Mushroom risotto","Mushroom cream pasta","Mushroom gravy"]}
];

export const ingredients:IngredientDef[]=[
 {id:"chicken-thigh",name:"Chicken thighs",category:"Protein",defaultUnit:"g"},{id:"salmon",name:"Salmon",category:"Protein",defaultUnit:"g"},{id:"beef-mince",name:"Beef mince",category:"Protein",defaultUnit:"g"},{id:"prawns",name:"Prawns",category:"Protein",defaultUnit:"g"},{id:"mushrooms",name:"Mushrooms",category:"Fresh",defaultUnit:"g"},{id:"cream",name:"Cooking cream",category:"Dairy",defaultUnit:"ml"},{id:"broccoli",name:"Broccoli",category:"Fresh",defaultUnit:"g"},{id:"coriander",name:"Coriander",category:"Fresh",defaultUnit:"g"},{id:"red-pepper",name:"Red pepper",category:"Fresh",defaultUnit:"g"},{id:"red-onion",name:"Red onion",category:"Fresh",defaultUnit:"g"},{id:"bean-sprouts",name:"Bean sprouts",category:"Fresh",defaultUnit:"g"},{id:"lime",name:"Limes",category:"Fresh",defaultUnit:"count"},{id:"lemon",name:"Lemons",category:"Fresh",defaultUnit:"count"},{id:"tofu-puffs",name:"Tofu puffs",category:"Protein",defaultUnit:"g"},{id:"butter-beans",name:"Butter beans",category:"Pantry",defaultUnit:"g"},{id:"coconut-milk",name:"Coconut milk",category:"Pantry",defaultUnit:"ml"},{id:"basmati",name:"Basmati rice",category:"Pantry",defaultUnit:"g"},{id:"jasmine",name:"Jasmine rice",category:"Pantry",defaultUnit:"g"},{id:"pasta",name:"Pasta",category:"Pantry",defaultUnit:"g"},{id:"noodles",name:"Noodles",category:"Pantry",defaultUnit:"g"},{id:"parmesan",name:"Parmesan",category:"Dairy",defaultUnit:"g"},{id:"dijon",name:"Dijon mustard",category:"Pantry",defaultUnit:"g"},{id:"potatoes",name:"Potatoes",category:"Fresh",defaultUnit:"g"}
];

const r=(id:string,qty:number,unit:Requirement["unit"]):Requirement=>({id,qty,unit});

export const meals:Meal[]=[
 {id:"mustard-mushroom-chicken",title:"Mustard mushroom chicken",subtitle:"DARK + DUX make the weeknight pan sauce worth having",cuisine:"European",minutes:25,method:"Pan",motherIds:["dark","blond"],midIds:["duxelles"],ingredients:[r("chicken-thigh",400,"g"),r("mushrooms",200,"g"),r("cream",120,"ml"),r("dijon",25,"g"),r("potatoes",400,"g")],image:mealImages["mustard-mushroom-chicken"],status:"approved"},
 {id:"gold-chicken-curry",title:"Everyday GOLD chicken curry",subtitle:"The reason GOLD earns permanent freezer space",cuisine:"Indian",minutes:25,method:"One-pot",motherIds:["gold"],midIds:[],ingredients:[r("chicken-thigh",400,"g"),r("basmati",160,"g"),r("coriander",15,"g")],image:mealImages["gold-chicken-curry"],status:"approved"},
 {id:"pesto-salmon",title:"Pesto salmon + roast greens",subtitle:"Fast fresh dinner with a freezer pesto finish",cuisine:"Mediterranean",minutes:24,method:"Oven",motherIds:[],midIds:["pesto"],ingredients:[r("salmon",320,"g"),r("broccoli",300,"g"),r("lemon",1,"count"),r("parmesan",20,"g")],image:mealImages["pesto-salmon"],status:"approved"},
 {id:"beef-ragu",title:"Fast beef ragù",subtitle:"RED + BLOND + DARK stack together instead of starting from onions",cuisine:"Italian",minutes:30,method:"Pan",motherIds:["red","blond","dark"],midIds:[],ingredients:[r("beef-mince",400,"g"),r("pasta",180,"g"),r("parmesan",25,"g")],image:mealImages["beef-ragu"],status:"approved"},
 {id:"curry-laksa",title:"Curry laksa",subtitle:"REMPAH + CLEAR + LAKSA prove why the layers matter",cuisine:"Malaysian",minutes:25,method:"Soup",motherIds:["rempah","clear"],midIds:["laksa"],ingredients:[r("prawns",250,"g"),r("coconut-milk",400,"ml"),r("noodles",220,"g"),r("tofu-puffs",120,"g"),r("bean-sprouts",120,"g"),r("lime",1,"count")],image:mealImages["curry-laksa"],status:"approved"},
 {id:"teriyaki-salmon",title:"Teriyaki salmon",subtitle:"Standalone mid-base, fast enough for a weekday",cuisine:"Japanese",minutes:20,method:"Pan",motherIds:[],midIds:["teriyaki"],ingredients:[r("salmon",320,"g"),r("jasmine",160,"g"),r("broccoli",250,"g")],image:mealImages["teriyaki-salmon"],status:"approved"},
 {id:"harissa-chicken-traybake",title:"Harissa chicken traybake",subtitle:"RED + HARISSA, then the oven does the work",cuisine:"Middle Eastern",minutes:35,method:"Traybake",motherIds:["red"],midIds:["harissa"],ingredients:[r("chicken-thigh",450,"g"),r("red-pepper",250,"g"),r("red-onion",150,"g"),r("butter-beans",240,"g")],image:mealImages["harissa-chicken-traybake"],status:"approved"},
 {id:"gold-saag-chicken",title:"Saag chicken",subtitle:"GOLD + SAAG gives a second Indian lane without another mother base",cuisine:"Indian",minutes:24,method:"One-pot",motherIds:["gold"],midIds:["saag"],ingredients:[r("chicken-thigh",400,"g"),r("basmati",160,"g")],image:mealImages["gold-saag-chicken"],status:"approved"},
 {id:"sambal-udang",title:"Sambal udang",subtitle:"SAMBAL straight from the freezer into the wok",cuisine:"Malaysian",minutes:18,method:"Wok",motherIds:["sambal"],midIds:[],ingredients:[r("prawns",350,"g"),r("jasmine",160,"g"),r("lime",1,"count")],image:mealImages["sambal-udang"],status:"approved"},
 {id:"rempah-chicken-rendang",title:"Chicken rendang",subtitle:"REMPAH + RENDANG concentrate",cuisine:"Malaysian",minutes:50,method:"Braise",motherIds:["rempah"],midIds:["rendang"],ingredients:[r("chicken-thigh",500,"g"),r("coconut-milk",300,"ml")],image:mealImages["rempah-chicken-rendang"],status:"approved"},
 {id:"brown-chicken-mushroom",title:"Brown-sauce chicken & mushrooms",subtitle:"CLEAR becomes restaurant-style wok sauce through WOK-B",cuisine:"Chinese",minutes:18,method:"Wok",motherIds:["clear"],midIds:["wok-brown"],ingredients:[r("chicken-thigh",350,"g"),r("mushrooms",200,"g"),r("jasmine",160,"g")],image:mealImages["brown-chicken-mushroom"],status:"approved"},
 {id:"moo-goo-gai-pan",title:"Moo goo gai pan",subtitle:"CLEAR + WOK-W for a lighter stir-fry lane",cuisine:"Chinese",minutes:20,method:"Wok",motherIds:["clear"],midIds:["wok-white"],ingredients:[r("chicken-thigh",350,"g"),r("mushrooms",180,"g"),r("jasmine",160,"g")],image:mealImages["moo-goo-gai-pan"],status:"approved"},
 {id:"thai-green-chicken",title:"Thai green chicken curry",subtitle:"Standalone THAI-G paste, kept separate because it does not need a mother base",cuisine:"Thai",minutes:25,method:"One-pot",motherIds:[],midIds:["thai-green"],ingredients:[r("chicken-thigh",400,"g"),r("coconut-milk",400,"ml"),r("jasmine",160,"g")],image:mealImages["thai-green-chicken"],status:"approved"},
 {id:"thai-red-chicken",title:"Thai red chicken curry",subtitle:"Standalone THAI-R gives a second Thai lane",cuisine:"Thai",minutes:25,method:"One-pot",motherIds:[],midIds:["thai-red"],ingredients:[r("chicken-thigh",400,"g"),r("coconut-milk",400,"ml"),r("jasmine",160,"g")],image:mealImages["thai-red-chicken"],status:"approved"},
 {id:"red-shakshuka",title:"Harissa shakshuka",subtitle:"RED + HARISSA becomes dinner with eggs",cuisine:"Middle Eastern",minutes:20,method:"Pan",motherIds:["red"],midIds:["harissa"],ingredients:[],image:mealImages["red-shakshuka"],status:"approved"},
 {id:"japanese-curry",title:"Japanese chicken curry",subtitle:"ONION + CLEAR + JP-CURRY",cuisine:"Japanese",minutes:35,method:"One-pot",motherIds:["onion","clear"],midIds:["jp-curry"],ingredients:[r("chicken-thigh",400,"g"),r("potatoes",300,"g")],status:"placeholder"},
 {id:"korma-chicken",title:"Chicken korma",subtitle:"GOLD + ONION + KORMA",cuisine:"Indian",minutes:30,method:"One-pot",motherIds:["gold","onion"],midIds:["korma"],ingredients:[r("chicken-thigh",400,"g")],status:"placeholder"},
 {id:"chipotle-chicken-bowl",title:"Chipotle chicken bowl",subtitle:"RED + CHIPOTLE takes the tomato mother into a completely different dinner",cuisine:"Mexican-ish",minutes:25,method:"Bowl",motherIds:["red"],midIds:["chipotle"],ingredients:[r("chicken-thigh",400,"g"),r("jasmine",160,"g"),r("lime",1,"count")],image:mealImages["chipotle-chicken-bowl"],status:"approved"}
];

export const defaultWeek=["mustard-mushroom-chicken","gold-chicken-curry","pesto-salmon","beef-ragu","curry-laksa","teriyaki-salmon","harissa-chicken-traybake"];

export const initialComponentStock:Record<string,number>={red:1,blond:1,gold:0,sambal:5,rempah:1,clear:1,dark:3,onion:5,makhani:0,saag:1,korma:0,rendang:1,laksa:0,"thai-green":2,"thai-red":1,"wok-brown":2,"wok-white":2,teriyaki:1,"jp-curry":0,gochujang:1,harissa:0,chipotle:1,pesto:1,duxelles:0};
export const initialIngredientStock:Record<string,number>={"chicken-thigh":700,salmon:320,"beef-mince":0,prawns:0,mushrooms:180,cream:80,broccoli:250,coriander:0,"red-pepper":0,"red-onion":80,"bean-sprouts":0,lime:2,lemon:1,"tofu-puffs":0,"butter-beans":0,"coconut-milk":400,basmati:500,jasmine:500,pasta:400,noodles:0,parmesan:70,dijon:80,potatoes:600};

export const getMeal=(id:string)=>meals.find(m=>m.id===id)!;
export const getMother=(id:string)=>motherBases.find(x=>x.id===id)!;
export const getMid=(id:string)=>midBases.find(x=>x.id===id)!;
export const getIngredient=(id:string)=>ingredients.find(x=>x.id===id)!;

export function componentNeedsForWeek(week:string[]){
 const needs:Record<string,number>={};
 for(const mealId of week){const meal=getMeal(mealId); for(const id of [...meal.motherIds,...meal.midIds]) needs[id]=(needs[id]??0)+1;}
 return needs;
}
export function prepNeedsForWeek(week:string[],stock:Record<string,number>){
 const needs=componentNeedsForWeek(week);
 return Object.entries(needs).map(([id,qty])=>({id,needed:qty,onHand:stock[id]??0,short:Math.max(0,qty-(stock[id]??0))})).filter(x=>x.short>0);
}
export function ingredientNeedsForWeek(week:string[]){
 const out:Record<string,{qty:number;unit:Requirement["unit"]}>={};
 for(const mealId of week){for(const req of getMeal(mealId).ingredients){const current=out[req.id]; if(!current) out[req.id]={qty:req.qty,unit:req.unit}; else current.qty+=req.qty;}}
 return out;
}
export function shoppingNeedsForWeek(week:string[],stock:Record<string,number>){
 const needs=ingredientNeedsForWeek(week);
 return Object.entries(needs).map(([id,v])=>({id,qty:Math.max(0,v.qty-(stock[id]??0)),unit:v.unit,required:v.qty,onHand:stock[id]??0})).filter(x=>x.qty>0);
}

export const coverageByMother=motherBases.map(m=>({mother:m,mids:midBases.filter(mid=>mid.parentMotherIds.includes(m.id)),meals:meals.filter(meal=>meal.motherIds.includes(m.id))}));
