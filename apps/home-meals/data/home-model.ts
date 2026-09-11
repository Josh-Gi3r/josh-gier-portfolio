import { mealImages } from "./meal-assets";
import { researchedMeals, firstWeekSlugs, type ResearchedMeal } from "./meals-researched";
import { motherBases, midBases } from "./home-graph-v3";

export type IngredientCategory="Fresh"|"Protein"|"Dairy"|"Pantry";
export type IngredientUnit="g"|"ml"|"count"|"portion"|"have";
export type ComponentKind="mother"|"mid"|"booster";
export type IngredientDef={id:string;name:string;category:IngredientCategory;unit:IngredientUnit;tracking:"quantity"|"state"};
export type IngredientRequirement={id:string;qty:number;unit:IngredientUnit;raw:string};
export type PrepRequirement={id:string;portions:number;portionMl:number;totalMl:number};
export type CanonicalRecipe={
 id:string;title:string;subtitle:string;cuisine:string;minutes:number;method:string;difficulty:ResearchedMeal["difficulty"];
 prep:PrepRequirement[];ingredients:IngredientRequirement[];rawIngredients:string[];steps:string[];why:string;balance:string;
 source:ResearchedMeal["source"];tags:string[];image?:string;status:"researched";
};
export type Booster={id:string;code:string;name:string;portionMl:number;batchYield:number;tone:string;kind:"booster"};

export { motherBases, midBases };

export const boosters:Booster[]=[
 {id:"ginger-garlic",code:"GG",name:"Ginger-garlic",portionMl:15,batchYield:16,tone:"#c69058",kind:"booster"},
 {id:"garlic",code:"G",name:"Garlic",portionMl:15,batchYield:16,tone:"#d9c89e",kind:"booster"},
 {id:"chilli",code:"CH",name:"Chilli",portionMl:15,batchYield:16,tone:"#b54835",kind:"booster"},
 {id:"lemongrass",code:"LE",name:"Lemongrass aromatic",portionMl:15,batchYield:12,tone:"#9aa657",kind:"booster"},
 {id:"massaman-finish",code:"MASS",name:"Massaman spice finish",portionMl:30,batchYield:6,tone:"#9a6a3f",kind:"booster"},
 {id:"miso-ginger",code:"MISO-G",name:"Miso-ginger",portionMl:30,batchYield:8,tone:"#a87b55",kind:"booster"},
 {id:"bulgogi",code:"BUL",name:"Bulgogi marinade",portionMl:30,batchYield:8,tone:"#7b4e3a",kind:"booster"},
];

const partAliases:Record<string,string>={
 GOLD:"gold",GG:"ginger-garlic",SAAG:"saag",SAMBAL:"sambal",LAKSA:"laksa",REMPAH:"rempah",LE:"lemongrass",
 "THAI-G":"thai-green","THAI-R":"thai-red",MASS:"massaman-finish",CH:"chilli",G:"garlic","WOK-B":"wok-brown","WOK-W":"wok-white",
 "TARE-T":"teriyaki","MISO-G":"miso-ginger",BUL:"bulgogi",GOCHU:"gochujang",RED:"red",DARK:"dark",BLOND:"blond",DUX:"duxelles",
 PESTO:"pesto",HAR:"harissa",CHIP:"chipotle"
};

const componentCodes=new Set([...motherBases.map(x=>x.code),...midBases.map(x=>x.code),...boosters.map(x=>x.code),"HAR","CHIP","TARE-T"]);

const FRACTIONS:Record<string,number>={"½":.5,"¼":.25,"¾":.75,"⅓":1/3,"⅔":2/3,"1½":1.5,"1¼":1.25,"1¾":1.75};
const numberValue=(s:string)=>FRACTIONS[s]??Number(s);
const mlFrom=(qty:number,unit:string)=>unit.toLowerCase()==="tbsp"?qty*15:unit.toLowerCase()==="tsp"?qty*5:qty;

const pantryState=[
 "salt","black pepper","salt and black pepper","garam masala","paprika","amchur","roasted cumin","roasted cumin powder","cumin","cumin seeds",
 "palm sugar","sugar","oregano","rosemary","white pepper","baking soda","plain flour","cornstarch","cornstarch slurry","sesame seeds"
];

const aliases:[RegExp,string,string,IngredientCategory,IngredientUnit,"quantity"|"state"][]=[
 [/chicken thigh|chicken thighs|boneless chicken thigh|boneless chicken thighs|chicken breast or thigh/i,"chicken-thigh","Chicken thighs","Protein","g","quantity"],
 [/ground chicken or pork/i,"ground-meat","Ground chicken / pork","Protein","g","quantity"],
 [/minced beef/i,"beef-mince","Beef mince","Protein","g","quantity"],
 [/beef chuck/i,"beef-chuck","Beef chuck","Protein","g","quantity"],
 [/sirloin|hotpot beef|^beef$/i,"beef","Beef","Protein","g","quantity"],
 [/salmon/i,"salmon","Salmon","Protein","g","quantity"],
 [/white fish/i,"white-fish","White fish","Protein","g","quantity"],
 [/large prawns|^prawns$/i,"prawns","Prawns","Protein","g","quantity"],
 [/prawns or sliced chicken/i,"prawns-or-chicken","Prawns / chicken","Protein","g","quantity"],
 [/firm tofu/i,"tofu","Firm tofu","Protein","g","quantity"],
 [/tofu puffs/i,"tofu-puffs","Tofu puffs","Protein","count","quantity"],
 [/large eggs|^eggs$/i,"eggs","Eggs","Protein","count","quantity"],
 [/plain yoghurt|thick yoghurt/i,"yoghurt","Plain yoghurt","Dairy","g","quantity"],
 [/cooking cream/i,"cream","Cooking cream","Dairy","ml","quantity"],
 [/parmesan/i,"parmesan","Parmesan","Dairy","g","quantity"],
 [/butter$/i,"butter","Butter","Dairy","g","quantity"],
 [/coconut milk/i,"coconut-milk","Coconut milk","Pantry","ml","quantity"],
 [/jasmine rice/i,"jasmine-rice","Jasmine rice","Pantry","portion","quantity"],
 [/basmati rice/i,"basmati-rice","Basmati rice","Pantry","portion","quantity"],
 [/^rice$/i,"rice","Rice","Pantry","portion","quantity"],
 [/rice noodles/i,"rice-noodles","Rice noodles","Pantry","g","quantity"],
 [/wide rice noodles/i,"wide-rice-noodles","Wide rice noodles","Pantry","g","quantity"],
 [/spaghetti|rigatoni/i,"pasta","Pasta","Pantry","g","quantity"],
 [/couscous/i,"couscous","Couscous","Pantry","g","quantity"],
 [/tortillas/i,"tortillas","Tortillas","Pantry","count","quantity"],
 [/flatbread/i,"flatbread","Flatbread","Pantry","count","quantity"],
 [/mushrooms/i,"mushrooms","Mushrooms","Fresh","g","quantity"],
 [/broccoli|cabbage or broccoli/i,"broccoli","Broccoli / greens","Fresh","g","quantity"],
 [/cauliflower/i,"cauliflower","Cauliflower","Fresh","g","quantity"],
 [/green beans/i,"green-beans","Green beans","Fresh","g","quantity"],
 [/bean sprouts/i,"bean-sprouts","Bean sprouts","Fresh","g","quantity"],
 [/gai lan/i,"gai-lan","Gai lan","Fresh","g","quantity"],
 [/bok choy/i,"bok-choy","Bok choy / choy sum","Fresh","g","quantity"],
 [/thai eggplant|zucchini/i,"zucchini","Thai eggplant / zucchini","Fresh","g","quantity"],
 [/^zucchini/i,"zucchini","Zucchini","Fresh","g","quantity"],
 [/aubergine/i,"aubergine","Aubergine","Fresh","count","quantity"],
 [/kabocha|pumpkin/i,"pumpkin","Pumpkin","Fresh","g","quantity"],
 [/sweet potato/i,"sweet-potato","Sweet potato","Fresh","g","quantity"],
 [/potatoes or pasta/i,"potatoes-or-pasta","Potatoes / pasta","Fresh","g","quantity"],
 [/potatoes/i,"potatoes","Potatoes","Fresh","g","quantity"],
 [/frozen peas/i,"peas","Frozen peas","Pantry","g","quantity"],
 [/bamboo shoots/i,"bamboo-shoots","Bamboo shoots","Pantry","g","quantity"],
 [/black beans/i,"black-beans","Black beans","Pantry","g","quantity"],
 [/butter beans/i,"butter-beans","Butter beans","Pantry","g","quantity"],
 [/chickpeas/i,"chickpeas","Chickpeas","Pantry","g","quantity"],
 [/corn$/i,"corn","Corn","Pantry","g","quantity"],
 [/carrot/i,"carrot","Carrot","Fresh","count","quantity"],
 [/red pepper|red peppers/i,"red-pepper","Red pepper","Fresh","g","quantity"],
 [/red onion/i,"red-onion","Red onion","Fresh","g","quantity"],
 [/^onion/i,"onion","Onion","Fresh","count","quantity"],
 [/cucumber/i,"cucumber","Cucumber","Fresh","count","quantity"],
 [/lettuce/i,"lettuce","Lettuce","Fresh","count","quantity"],
 [/green chilli/i,"green-chilli","Green chilli","Fresh","count","quantity"],
 [/thai basil|holy basil/i,"thai-basil","Thai / holy basil","Fresh","g","quantity"],
 [/coriander$/i,"coriander","Coriander","Fresh","g","quantity"],
 [/spring onion|spring onions/i,"spring-onion","Spring onion","Fresh","count","quantity"],
 [/parsley/i,"parsley","Parsley","Fresh","g","quantity"],
 [/makrut lime leaves/i,"makrut-lime","Makrut lime leaves","Fresh","count","quantity"],
 [/lime$/i,"lime","Lime","Fresh","count","quantity"],
 [/lemon/i,"lemon","Lemon","Fresh","count","quantity"],
 [/fish sauce/i,"fish-sauce","Fish sauce","Pantry","ml","quantity"],
 [/oyster sauce/i,"oyster-sauce","Oyster sauce","Pantry","ml","quantity"],
 [/light soy|soy sauce/i,"soy-sauce","Soy sauce","Pantry","ml","quantity"],
 [/dark soy/i,"dark-soy","Dark soy","Pantry","ml","quantity"],
 [/sesame oil/i,"sesame-oil","Sesame oil","Pantry","ml","quantity"],
 [/red wine vinegar/i,"red-wine-vinegar","Red wine vinegar","Pantry","ml","quantity"],
 [/dry red wine/i,"red-wine","Dry red wine","Pantry","ml","quantity"],
 [/sake/i,"sake","Sake","Pantry","ml","quantity"],
 [/dijon mustard/i,"dijon","Dijon mustard","Pantry","ml","quantity"],
 [/tamarind water|^tamarind$/i,"tamarind","Tamarind","Pantry","ml","quantity"],
 [/roasted peanuts/i,"peanuts","Roasted peanuts","Pantry","g","quantity"],
 [/toasted desiccated coconut/i,"desiccated-coconut","Desiccated coconut","Pantry","g","quantity"],
 [/neutral oil|olive oil|^oil$|ghee or oil|neutral oil or ghee/i,"cooking-fat","Cooking oil / ghee","Pantry","ml","quantity"],
];

function stem(raw:string){
 let x=raw.replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
 const patterns=[/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\s*[×x]\s*\d+\s*g/i,/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\s*(?:g|ml|tbsp|tsp|portions?|cm\b)/i,/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\b/];
 let idx=x.length;for(const p of patterns){const m=x.match(p);if(m&&m.index!==undefined)idx=Math.min(idx,m.index)}
 return x.slice(0,idx).replace(/[,;:]$/," ").trim();
}
function parseAmount(raw:string,preferred:IngredientUnit):{qty:number;unit:IngredientUnit}{
 const multi=raw.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*g/i);if(multi)return{qty:Number(multi[1])*Number(multi[2]),unit:"g"};
 const m=raw.match(/(1½|1¼|1¾|½|¼|¾|⅓|⅔|\d+(?:\.\d+)?)\s*(g|ml|tbsp|tsp|portions?)/i);if(m){const q=numberValue(m[1]);const u=m[2].toLowerCase();if(u==="tbsp"||u==="tsp")return{qty:mlFrom(q,u),unit:"ml"};if(u.startsWith("portion"))return{qty:q,unit:"portion"};return{qty:q,unit:u as IngredientUnit}}
 const n=raw.match(/(?:^|\s)(1½|1¼|1¾|½|¼|¾|⅓|⅔|\d+(?:\.\d+)?)(?:,|\s|$)/);if(n)return{qty:numberValue(n[1]),unit:preferred==="g"||preferred==="ml"?"count":preferred};
 return{qty:1,unit:preferred==="have"?"have":"count"};
}
function ingredientFromRaw(raw:string):IngredientRequirement|null{
 const s=stem(raw); if(!s)return null;
 if(/^water(?: or stock)?$/i.test(s)||/^chicken or prawn stock$/i.test(s))return null;
 if(componentCodes.has(s.toUpperCase()))return null;
 if(pantryState.some(x=>s.toLowerCase()===x.toLowerCase())){const id=s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return{id,qty:1,unit:"have",raw}}
 for(const [re,id,name,category,unit] of aliases){if(re.test(s)){const a=parseAmount(raw,unit);return{id,qty:a.qty,unit:a.unit,raw}}}
 const id=s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");const a=parseAmount(raw,"have");return{id,qty:a.qty,unit:a.unit==="count"?"have":a.unit,raw};
}

export const prepComponents=[
 ...motherBases.map(x=>({...x,kind:"mother" as const})),
 ...midBases.map(x=>({...x,kind:"mid" as const})),
 ...boosters,
];
export const getComponent=(id:string)=>prepComponents.find(x=>x.id===id);
export const getComponentByCode=(code:string)=>prepComponents.find(x=>x.code===code);

export const recipes:CanonicalRecipe[]=researchedMeals.map(r=>({
 id:r.slug,title:r.title,subtitle:r.subtitle,cuisine:r.cuisine,minutes:r.time,method:r.method,difficulty:r.difficulty,
 prep:r.parts.map(p=>{const id=partAliases[p.code];if(!id)throw new Error(`Unmapped prep code ${p.code} in ${r.slug}`);return{id,portions:p.count,portionMl:p.sizeMl,totalMl:p.count*p.sizeMl}}),
 ingredients:r.ingredients.map(ingredientFromRaw).filter(Boolean) as IngredientRequirement[],rawIngredients:r.ingredients,steps:r.steps,why:r.why,balance:r.balance,source:r.source,tags:r.tags,image:r.imageUrl??mealImages[r.slug],status:"researched"
}));

const defs=new Map<string,IngredientDef>();
for(const recipe of recipes){for(const req of recipe.ingredients){if(defs.has(req.id))continue;const raw=req.raw;const s=stem(raw);let found:IngredientDef|undefined;if(pantryState.some(x=>s.toLowerCase()===x.toLowerCase()))found={id:req.id,name:s.replace(/\b\w/g,c=>c.toUpperCase()),category:"Pantry",unit:"have",tracking:"state"};else for(const [re,id,name,category,unit,tracking] of aliases){if(id===req.id||re.test(s)){found={id,name,category,unit,tracking};break}}defs.set(req.id,found??{id:req.id,name:s,category:"Pantry",unit:req.unit,tracking:req.unit==="have"?"state":"quantity"})}}
export const ingredients=[...defs.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
export const getIngredient=(id:string)=>ingredients.find(x=>x.id===id)!;
export const getRecipe=(id:string)=>recipes.find(x=>x.id===id)!;
export const defaultWeek=[...firstWeekSlugs];

export const initialComponentStock:Record<string,number>={
 red:3,blond:3,gold:4,sambal:4,rempah:3,clear:4,dark:5,onion:4,
 saag:2,laksa:2,"thai-green":2,"thai-red":2,"wok-brown":2,"wok-white":2,teriyaki:2,harissa:2,chipotle:2,pesto:2,duxelles:2,
 "ginger-garlic":6,garlic:6,chilli:6,lemongrass:4,"massaman-finish":0,"miso-ginger":0,bulgogi:0
};

export const initialIngredientStock:Record<string,number>=Object.fromEntries(ingredients.map(x=>[x.id,x.tracking==="state"?1:0]));
Object.assign(initialIngredientStock,{"chicken-thigh":900,eggs:8,mushrooms:300,cream:250,broccoli:500,coriander:30,"coconut-milk":800,"jasmine-rice":4,"basmati-rice":4,rice:4,"cooking-fat":500,"fish-sauce":250,"soy-sauce":250,"oyster-sauce":250,lime:3,lemon:2,onion:3,"red-onion":500});

export function prepDemandForWeek(week:string[]){const out:Record<string,{portions:number,totalMl:number}>={};for(const recipeId of week){const r=getRecipe(recipeId);for(const p of r.prep){const v=out[p.id]??{portions:0,totalMl:0};v.portions+=p.portions;v.totalMl+=p.totalMl;out[p.id]=v}}return out}
export function prepNeedsForWeek(week:string[],stock:Record<string,number>){const demand=prepDemandForWeek(week);return Object.entries(demand).map(([id,v])=>({id,needed:v.portions,totalMl:v.totalMl,onHand:stock[id]??0,short:Math.max(0,v.portions-(stock[id]??0))})).filter(x=>x.short>0)}

export function ingredientDemandForWeek(week:string[]){const out:Record<string,{qty:number;unit:IngredientUnit}>={};for(const recipeId of week){for(const req of getRecipe(recipeId).ingredients){const def=getIngredient(req.id);if(def?.tracking==="state"){out[req.id]={qty:1,unit:"have"};continue}const v=out[req.id];if(!v)out[req.id]={qty:req.qty,unit:req.unit};else if(v.unit===req.unit)v.qty+=req.qty}}return out}
export function shoppingNeedsForWeek(week:string[],stock:Record<string,number>){const demand=ingredientDemandForWeek(week);return Object.entries(demand).map(([id,v])=>{const def=getIngredient(id);const onHand=stock[id]??0;const qty=def?.tracking==="state"?(onHand>0?0:1):Math.max(0,v.qty-onHand);return{id,qty,unit:v.unit,required:v.qty,onHand}}).filter(x=>x.qty>0)}

export function componentConsumption(recipeId:string){return getRecipe(recipeId).prep.map(x=>({id:x.id,qty:x.portions}))}
export function ingredientConsumption(recipeId:string){return getRecipe(recipeId).ingredients}

export const recipesByMother=motherBases.map(m=>({mother:m,recipes:recipes.filter(r=>r.prep.some(p=>p.id===m.id)),mids:midBases.filter(x=>x.parentMotherIds.includes(m.id))}));
