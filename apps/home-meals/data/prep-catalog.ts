// Display metadata only. Quantities, storage, physical relationships and inventory truth live in food-truth-v2.ts.
export type MotherBase={id:string;code:string;name:string;purpose:string;tone:string;examples:string[]};
export type MidBase={id:string;code:string;name:string;tone:string;examples:string[]};

export const motherBases:MotherBase[]=[
 {id:"red",code:"RED",name:"Neutral concentrated tomato",purpose:"A neutral, deeply reduced tomato foundation for Italian, Mediterranean and smoky tomato-led dinners.",tone:"#b8442f",examples:["Ragù","Cacciatore","Shakshuka","Chipotle chicken","Bean skillet"]},
 {id:"blond",code:"BLOND",name:"Home Italian-style soffritto",purpose:"Gently cooked onion, carrot and celery for ragù, mustard chicken and other European-style dinners.",tone:"#c7954d",examples:["Ragù","Mustard mushroom chicken"]},
 {id:"gold",code:"GOLD",name:"Bhuna onion-tomato masala",purpose:"Deeply cooked onion, tomato, ginger, garlic and spices for fast everyday Indian curries.",tone:"#d5a327",examples:["Chicken curry","Chana masala","Egg curry","Saag chicken","Aloo matar"]},
 {id:"sambal",code:"SAMBAL",name:"Sambal tumis concentrate",purpose:"Cooked chilli-shallot-belacan concentrate for Malaysian sambal dinners.",tone:"#b42a22",examples:["Sambal udang","Sambal telur"]},
 {id:"rempah",code:"REMPAH",name:"Home Malay/Nyonya aromatic rempah",purpose:"A reusable shallot, lemongrass, galangal, turmeric and candlenut starter for selected Malay/Nyonya-inspired branches.",tone:"#c16c2d",examples:["Lemongrass coconut fish","Chicken rendang","Curry laksa"]},
 {id:"clear",code:"CLEAR",name:"Unsalted light chicken stock",purpose:"Light unsalted stock used directly and as a physical parent of the two Home wok sauces.",tone:"#d8bc7d",examples:["Curry laksa","WOK-B","WOK-W"]},
 {id:"dark",code:"DARK",name:"Unsalted brown stock concentrate",purpose:"Deep roasted stock concentrate for selected European pan sauces and braises.",tone:"#5e4938",examples:["Ragù","Cacciatore","Mustard mushroom chicken"]},
 {id:"onion",code:"ONION",name:"Deep caramelised onion",purpose:"Deep mahogany onion for dishes that genuinely benefit from a jammy caramelised-onion profile.",tone:"#8b5b32",examples:["Future French onion / gravy / curry ideas"]}
];

export const midBases:MidBase[]=[
 {id:"makhani",code:"MAKHANI",name:"Makhani sauce concentrate",tone:"#db7b45",examples:["Future butter chicken","Future paneer makhani"]},
 {id:"saag",code:"SAAG",name:"Saag greens concentrate",tone:"#4f7f48",examples:["Saag chicken"]},
 {id:"korma",code:"KORMA",name:"Korma golden-onion nut concentrate",tone:"#c9aa77",examples:["Future chicken korma","Future vegetable korma"]},
 {id:"rendang",code:"RENDANG",name:"Rendang concentrate",tone:"#7a4d2f",examples:["Chicken rendang"]},
 {id:"laksa",code:"LAKSA",name:"Curry-laksa concentrate",tone:"#d66d35",examples:["Curry laksa"]},
 {id:"malaysian-kari",code:"KARI",name:"Home Malaysian curry paste",tone:"#c7892d",examples:["Future kari ayam","Future fish curry"]},
 {id:"asam-pedas",code:"ASAM",name:"Home asam pedas paste",tone:"#b43b2b",examples:["Future asam pedas fish","Future asam pedas prawn"]},
 {id:"thai-green",code:"THAI-G",name:"Thai green curry paste",tone:"#4e7b48",examples:["Thai green chicken curry"]},
 {id:"thai-red",code:"THAI-R",name:"Thai red curry paste",tone:"#b14b37",examples:["Thai red chicken & pumpkin curry","Massaman beef"]},
 {id:"nam-prik-pao",code:"NPP",name:"Nam prik pao",tone:"#8f3927",examples:["Future tom yum","Future chilli-jam stir-fries"]},
 {id:"krapow",code:"KRAPOW",name:"Pad-kra-pao seasoning sauce",tone:"#506f3f",examples:["Pad kra pao"]},
 {id:"nuoc-cham",code:"NUOC",name:"Nuoc cham base",tone:"#d5b55b",examples:["Future Vietnamese bowls","Future fresh rolls"]},
 {id:"wok-brown",code:"WOK-B",name:"Chinese brown stir-fry sauce",tone:"#7c5a43",examples:["Beef & broccoli","Chicken & mushrooms","Tofu & green beans"]},
 {id:"wok-white",code:"WOK-W",name:"Chinese white stir-fry sauce",tone:"#d6d0bf",examples:["Moo goo gai pan","Prawns & greens"]},
 {id:"char-siu",code:"CHAR-SIU",name:"Char siu marinade",tone:"#a44532",examples:["Future char siu rice","Future char siu chicken"]},
 {id:"douban",code:"DOUBAN",name:"Home doubanjiang aromatic concentrate",tone:"#88362c",examples:["Future mapo-style dinners"]},
 {id:"ginger-scallion",code:"GS-OIL",name:"Ginger-scallion oil",tone:"#7d9a55",examples:["Future steamed fish","Future ginger-scallion noodles"]},
 {id:"dashi",code:"DASHI",name:"Awase dashi",tone:"#b9a06e",examples:["Future miso soup","Future donburi","Future udon"]},
 {id:"teriyaki",code:"TERI",name:"Teriyaki tare",tone:"#8b552e",examples:["Teriyaki salmon","Chicken teriyaki"]},
 {id:"jp-curry",code:"JP-CURRY",name:"Japanese curry roux",tone:"#a66e33",examples:["Future Japanese curry"]},
 {id:"k-anchovy",code:"K-STOCK",name:"Korean anchovy-kelp stock",tone:"#8b8d71",examples:["Future jjigae","Future noodle soups"]},
 {id:"gochujang",code:"GOCHU",name:"Home gochujang finishing sauce",tone:"#a7352a",examples:["Gochujang chicken","Gochujang tofu"]},
 {id:"harissa",code:"HARISSA",name:"Home harissa concentrate",tone:"#b24731",examples:["Shakshuka","Harissa chicken","Harissa chickpeas"]},
 {id:"chipotle",code:"CHIPOTLE",name:"Home chipotle-adobo concentrate",tone:"#7c3428",examples:["Chipotle chicken bowl","Chipotle bean skillet"]},
 {id:"pesto",code:"PESTO",name:"Pesto freezer base",tone:"#56804e",examples:["Pesto salmon"]},
 {id:"duxelles",code:"DUX",name:"Mushroom duxelles",tone:"#6e5945",examples:["Mustard mushroom chicken"]}
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
