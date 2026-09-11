export type MotherBase={id:string;code:string;name:string;purpose:string;approxMeals:string;portionLabel:string;portionMl:number;batchYield:number;freezeFormat:string;tone:string;examples:string[]};
export type MidBase={id:string;code:string;name:string;parentMotherIds:string[];standalone:boolean;portionLabel:string;portionMl:number;batchYield:number;tone:string;examples:string[]};

export const motherBases:MotherBase[]=[
 {id:"red",code:"RED",name:"Neutral tomato base",purpose:"Slow-cooked tomato kept neutral so it can move between Italian, Spanish, Middle Eastern and Mexican dinners.",approxMeals:"25–30",portionLabel:"350 ml puck",portionMl:350,batchYield:8,freezeFormat:"300–400 ml flat pucks",tone:"#b8442f",examples:["Pomodoro","Cacciatore","Shakshuka","Chicken tinga","Chilli","Fish tagine"]},
 {id:"blond",code:"BLOND",name:"Italian soffritto",purpose:"Slow-cooked onion, carrot and celery for risotto, soups, ragù and European braises.",approxMeals:"15–20",portionLabel:"120 ml puck",portionMl:120,batchYield:10,freezeFormat:"60 ml cubes or 120–150 ml pucks",tone:"#c7954d",examples:["Risotto","Bolognese","Minestrone","Pasta e fagioli","Pot pie","Cream sauces"]},
 {id:"gold",code:"GOLD",name:"Bhuna masala",purpose:"North Indian onion, tomato, ginger and garlic cooked down properly for fast curries, dal, paneer and keema.",approxMeals:"25–30",portionLabel:"120 ml dinner portion",portionMl:60,batchYield:14,freezeFormat:"60 ml cubes; most dinners use two",tone:"#d5a327",examples:["Chicken curry","Makhani","Saag","Korma","Chana masala","Egg curry"]},
 {id:"sambal",code:"SAMBAL",name:"Sambal tumis",purpose:"Cooked Malaysian chilli-shallot-belacan paste for seafood, eggs, greens, rice and noodles.",approxMeals:"~15",portionLabel:"60 ml portion",portionMl:60,batchYield:14,freezeFormat:"60 ml cubes or small tubs",tone:"#b42a22",examples:["Sambal udang","Sambal telur","Sambal kangkung","Nasi lemak","Nasi goreng","Mee goreng"]},
 {id:"rempah",code:"REMPAH",name:"Malay / Nyonya rempah",purpose:"A broad aromatic paste of shallot, lemongrass, galangal, turmeric and candlenut for coconut curries, laksa and rendang branches.",approxMeals:"12–15",portionLabel:"60 ml portion",portionMl:60,batchYield:12,freezeFormat:"60 ml portions",tone:"#c16c2d",examples:["Rendang","Curry laksa","Masak lemak","Kari ayam","Soto","Kapitan chicken"]},
 {id:"clear",code:"CLEAR",name:"Light chicken stock",purpose:"Unsalted gelatin-rich stock for soups, noodle bowls, stir-fries, risotto and Japanese curry.",approxMeals:"20+",portionLabel:"500 ml puck",portionMl:500,batchYield:6,freezeFormat:"500 ml–1 L pucks plus small cubes",tone:"#d8bc7d",examples:["Congee","Wonton soup","Ban mian","Noodle soups","Risotto","Stir-fry sauces"]},
 {id:"dark",code:"DARK",name:"Brown jus / gel",purpose:"Roasted unsalted stock reduced hard for pan sauces, braises, gravies and deep savoury flavour.",approxMeals:"12–15",portionLabel:"30 ml cube",portionMl:30,batchYield:28,freezeFormat:"30 ml concentrate cubes",tone:"#5e4938",examples:["Beef stew","Bourguignon","Short ribs","Stroganoff","Pan sauce","Mushroom gravy"]},
 {id:"onion",code:"ONION",name:"Caramelised onion",purpose:"Deep mahogany onion for French onion soup, Japanese curry, biryani, mujaddara, gravy and korma.",approxMeals:"~10",portionLabel:"30 ml cube",portionMl:30,batchYield:18,freezeFormat:"30 ml cubes plus 200 ml soup pucks",tone:"#8b5b32",examples:["French onion soup","Japanese curry","Biryani","Mujaddara","Onion gravy","Korma"]}
];

export const midBases:MidBase[]=[
 {id:"makhani",code:"MAKHANI",name:"Makhani",parentMotherIds:["gold"],standalone:false,portionLabel:"100 ml puck",portionMl:100,batchYield:4,tone:"#db7b45",examples:["Butter chicken","Paneer makhani","Makhani beans"]},
 {id:"saag",code:"SAAG",name:"Saag",parentMotherIds:["gold"],standalone:false,portionLabel:"60 ml cube",portionMl:60,batchYield:8,tone:"#4f7f48",examples:["Saag paneer","Palak chicken","Saag dal"]},
 {id:"korma",code:"KORMA",name:"Korma",parentMotherIds:["gold","onion"],standalone:false,portionLabel:"100 ml puck",portionMl:100,batchYield:4,tone:"#c9aa77",examples:["Chicken korma","Vegetable korma","Lamb korma"]},
 {id:"rendang",code:"RENDANG",name:"Rendang concentrate",parentMotherIds:["rempah"],standalone:false,portionLabel:"60 ml portion",portionMl:60,batchYield:6,tone:"#7a4d2f",examples:["Beef rendang","Chicken rendang","Tempeh rendang"]},
 {id:"laksa",code:"LAKSA",name:"Laksa paste",parentMotherIds:["rempah"],standalone:false,portionLabel:"60 ml cube",portionMl:60,batchYield:8,tone:"#d66d35",examples:["Curry laksa","Laksa lemak","Seafood laksa"]},
 {id:"malaysian-kari",code:"KARI",name:"Malaysian kari paste",parentMotherIds:[],standalone:true,portionLabel:"150 ml puck",portionMl:150,batchYield:4,tone:"#c7892d",examples:["Kari ayam","Fish head curry","Kari kambing","Curry puffs"]},
 {id:"asam-pedas",code:"ASAM",name:"Asam pedas paste",parentMotherIds:[],standalone:true,portionLabel:"150 ml puck",portionMl:150,batchYield:4,tone:"#b43b2b",examples:["Asam pedas fish","Asam pedas prawn","Asam pedas chicken","Asam pedas okra"]},
 {id:"thai-green",code:"THAI-G",name:"Thai green curry paste",parentMotherIds:[],standalone:true,portionLabel:"30 ml portion",portionMl:30,batchYield:12,tone:"#4e7b48",examples:["Green chicken curry","Green fish curry","Green tofu curry"]},
 {id:"thai-red",code:"THAI-R",name:"Thai red curry paste",parentMotherIds:[],standalone:true,portionLabel:"30 ml portion",portionMl:30,batchYield:12,tone:"#b14b37",examples:["Red chicken curry","Panang-style beef","Red prawn curry"]},
 {id:"nam-prik-pao",code:"NPP",name:"Nam prik pao",parentMotherIds:["clear"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#8f3927",examples:["Tom yum goong","Cashew chicken","Tom yum fried rice"]},
 {id:"krapow",code:"KRAPOW",name:"Thai basil sauce",parentMotherIds:[],standalone:true,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#506f3f",examples:["Pad krapow","Pad kee mao","Basil seafood","Basil tofu"]},
 {id:"nuoc-cham",code:"NUOC",name:"Nuoc cham base",parentMotherIds:[],standalone:true,portionLabel:"60 ml fridge portion",portionMl:60,batchYield:6,tone:"#d5b55b",examples:["Bun cha","Bun thit nuong","Fresh spring rolls","Grilled chicken bowl"]},
 {id:"wok-brown",code:"WOK-B",name:"Chinese brown stir-fry sauce",parentMotherIds:["clear"],standalone:false,portionLabel:"60 ml portion",portionMl:60,batchYield:8,tone:"#7c5a43",examples:["Beef & broccoli","Chicken & mushrooms","Tofu & vegetables"]},
 {id:"wok-white",code:"WOK-W",name:"Chinese white stir-fry sauce",parentMotherIds:["clear"],standalone:false,portionLabel:"60 ml portion",portionMl:60,batchYield:8,tone:"#d6d0bf",examples:["Moo goo gai pan","Prawns & snow peas","Velveted fish"]},
 {id:"char-siu",code:"CHAR-SIU",name:"Char siu marinade",parentMotherIds:[],standalone:true,portionLabel:"60 ml portion",portionMl:60,batchYield:6,tone:"#a44532",examples:["Char siu rice","Char siu chicken","Char siu noodles","Fried rice"]},
 {id:"douban",code:"DOUBAN",name:"Doubanjiang mapo base",parentMotherIds:["clear"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#88362c",examples:["Mapo tofu","Mapo eggplant","Dan dan noodles"]},
 {id:"ginger-scallion",code:"GS-OIL",name:"Ginger-scallion oil",parentMotherIds:["clear","dark"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#7d9a55",examples:["Hainanese chicken","Ginger-scallion noodles","Steamed fish"]},
 {id:"dashi",code:"DASHI",name:"Awase dashi",parentMotherIds:[],standalone:true,portionLabel:"250 ml puck",portionMl:250,batchYield:6,tone:"#b9a06e",examples:["Miso soup","Oyakodon","Katsudon","Nikujaga","Udon","Chawanmushi"]},
 {id:"teriyaki",code:"TERI",name:"Teriyaki tare",parentMotherIds:[],standalone:true,portionLabel:"30 ml portion",portionMl:30,batchYield:8,tone:"#8b552e",examples:["Chicken teriyaki","Salmon teriyaki","Tofu teriyaki"]},
 {id:"jp-curry",code:"JP-CURRY",name:"Japanese curry roux",parentMotherIds:["onion","clear"],standalone:false,portionLabel:"45 ml roux portion",portionMl:45,batchYield:10,tone:"#a66e33",examples:["Chicken curry","Beef curry","Vegetable curry","Curry udon"]},
 {id:"k-anchovy",code:"K-STOCK",name:"Korean anchovy-kelp stock",parentMotherIds:[],standalone:true,portionLabel:"250 ml puck",portionMl:250,batchYield:8,tone:"#8b8d71",examples:["Doenjang jjigae","Kimchi jjigae","Soondubu","Kalguksu","Tteokbokki"]},
 {id:"gochujang",code:"GOCHU",name:"Gochujang sauce",parentMotherIds:[],standalone:true,portionLabel:"30 ml portion",portionMl:30,batchYield:8,tone:"#a7352a",examples:["Tteokbokki","Dak galbi","Bibimbap sauce"]},
 {id:"harissa",code:"HARISSA",name:"Harissa",parentMotherIds:["red"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:12,tone:"#b24731",examples:["Shakshuka","Harissa chicken","Harissa vegetables"]},
 {id:"chipotle",code:"CHIPOTLE",name:"Chipotle adobo",parentMotherIds:["red"],standalone:false,portionLabel:"30 ml cube",portionMl:30,batchYield:10,tone:"#7c3428",examples:["Chicken tinga","Smoky chilli","Enchiladas"]},
 {id:"pesto",code:"PESTO",name:"Pesto Genovese",parentMotherIds:[],standalone:true,portionLabel:"30 ml portion",portionMl:30,batchYield:10,tone:"#56804e",examples:["Pesto pasta","Pesto salmon","Pesto minestrone"]},
 {id:"duxelles",code:"DUX",name:"Mushroom duxelles",parentMotherIds:["blond","dark"],standalone:false,portionLabel:"60 ml portion",portionMl:60,batchYield:6,tone:"#6e5945",examples:["Mushroom risotto","Mushroom cream pasta","Mushroom gravy"]}
];

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
 {label:"Italian / European",ids:["pesto","duxelles"]}
];
