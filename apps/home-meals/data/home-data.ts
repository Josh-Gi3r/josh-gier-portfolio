import { mealImages } from "./meal-assets";
import { researchedMeals, firstWeekSlugs, type ResearchedMeal } from "./meals-researched";
import { motherBases, midBases, midsByCuisine, type MotherBase, type MidBase } from "./prep-catalog";

export type IngredientCategory="Fresh"|"Protein"|"Dairy"|"Pantry";
export type IngredientUnit="g"|"ml"|"count"|"portion"|"have";
export type IngredientTracking="quantity"|"state";
export type IngredientDef={id:string;name:string;category:IngredientCategory;unit:IngredientUnit;tracking:IngredientTracking};
export type IngredientRequirement={id:string;qty:number;unit:IngredientUnit;raw:string;display:string;optional?:boolean};
export type PrepRequirement={id:string;portions:number;portionMl:number;totalMl:number};
export type Booster={id:string;code:string;name:string;portionMl:number;batchYield:number;tone:string;examples:string[]};
export type CanonicalRecipe={
 id:string;title:string;subtitle:string;cuisine:string;minutes:number;method:string;difficulty:ResearchedMeal["difficulty"];
 prep:PrepRequirement[];motherIds:string[];midIds:string[];boosterIds:string[];
 ingredients:IngredientRequirement[];rawIngredients:string[];steps:string[];why:string;balance:string;source:ResearchedMeal["source"];tags:string[];image?:string;status:"researched";
};

export { motherBases, midBases, midsByCuisine };
export type { MotherBase, MidBase };

export const boosters:Booster[]=[
 {id:"ginger-garlic",code:"GG",name:"Ginger-garlic",portionMl:15,batchYield:16,tone:"#c69058",examples:["Everyday curry","Chana masala","Stir-fries"]},
 {id:"garlic",code:"G",name:"Garlic",portionMl:15,batchYield:16,tone:"#d9c89e",examples:["Pad see ew","Quick sautés","Pan sauces"]},
 {id:"chilli",code:"CH",name:"Chilli",portionMl:15,batchYield:16,tone:"#b54835",examples:["Pad kra pao","Wok tofu","Quick heat"]},
 {id:"lemongrass",code:"LE",name:"Lemongrass aromatic",portionMl:15,batchYield:12,tone:"#9aa657",examples:["Coconut fish","Rendang","Brothy curries"]},
 {id:"massaman-finish",code:"MASS",name:"Massaman spice finish",portionMl:30,batchYield:6,tone:"#9a6a3f",examples:["Massaman beef","Massaman chicken"]},
 {id:"miso-ginger",code:"MISO-G",name:"Miso-ginger",portionMl:30,batchYield:8,tone:"#a87b55",examples:["Miso salmon","Miso aubergine","Miso tofu"]},
 {id:"bulgogi",code:"BUL",name:"Bulgogi marinade",portionMl:60,batchYield:6,tone:"#7b4e3a",examples:["Bulgogi beef","Bulgogi chicken","Mushroom bulgogi"]}
];

const motherIds=new Set(motherBases.map(x=>x.id));
const midIds=new Set(midBases.map(x=>x.id));
const boosterIds=new Set(boosters.map(x=>x.id));

const codeToId:Record<string,string>={
 GOLD:"gold",GG:"ginger-garlic",SAAG:"saag",SAMBAL:"sambal",LAKSA:"laksa",REMPAH:"rempah",LE:"lemongrass",
 "THAI-G":"thai-green","THAI-R":"thai-red",MASS:"massaman-finish",CH:"chilli",G:"garlic","WOK-B":"wok-brown","WOK-W":"wok-white",
 "TARE-T":"teriyaki","MISO-G":"miso-ginger",BUL:"bulgogi",GOCHU:"gochujang",RED:"red",DARK:"dark",BLOND:"blond",DUX:"duxelles",
 PESTO:"pesto",HAR:"harissa",CHIP:"chipotle"
};

const prepOverrides:Record<string,{code:string;count:number;sizeMl:number}[]>={
 "curry-laksa":[{code:"REMPAH",count:1,sizeMl:60},{code:"LAKSA",count:2,sizeMl:60},{code:"CLEAR",count:1,sizeMl:450}],
 "rempah-chicken-rendang":[{code:"REMPAH",count:2,sizeMl:60},{code:"RENDANG",count:1,sizeMl:60},{code:"LE",count:1,sizeMl:15}],
 "massaman-beef":[{code:"THAI-R",count:1,sizeMl:30},{code:"MASS",count:2,sizeMl:30}],
 "pad-kra-pao":[{code:"KRAPOW",count:1,sizeMl:30}],
 "beef-broccoli":[{code:"CLEAR",count:1,sizeMl:120},{code:"WOK-B",count:1,sizeMl:60}],
 "brown-chicken-mushroom":[{code:"CLEAR",count:1,sizeMl:120},{code:"WOK-B",count:1,sizeMl:60}],
 "moo-goo-gai-pan":[{code:"CLEAR",count:1,sizeMl:120},{code:"WOK-W",count:1,sizeMl:60}],
 "white-sauce-prawns":[{code:"CLEAR",count:1,sizeMl:120},{code:"WOK-W",count:1,sizeMl:60}],
 "wok-tofu-greenbeans":[{code:"CLEAR",count:1,sizeMl:120},{code:"WOK-B",count:1,sizeMl:60},{code:"CH",count:1,sizeMl:15}],
 "beef-ragu":[{code:"RED",count:2,sizeMl:90},{code:"BLOND",count:1,sizeMl:60},{code:"DARK",count:1,sizeMl:30}],
 "chipotle-chicken-bowl":[{code:"RED",count:1,sizeMl:90},{code:"CHIP",count:2,sizeMl:30}],
};

const supplementalCodeToId:Record<string,string>={CLEAR:"clear",RENDANG:"rendang",KRAPOW:"krapow"};
const resolvePart=(code:string)=>codeToId[code]??supplementalCodeToId[code];
const componentById=(id:string)=>motherBases.find(x=>x.id===id)??midBases.find(x=>x.id===id)??boosters.find(x=>x.id===id);

const FRACTIONS:Record<string,number>={"½":.5,"¼":.25,"¾":.75,"⅓":1/3,"⅔":2/3,"1½":1.5,"1¼":1.25,"1¾":1.75};
const stateNames=new Set(["salt","black pepper","salt and black pepper","garam masala","paprika","amchur","roasted cumin","roasted cumin powder","cumin","cumin seeds","palm sugar","sugar","oregano","rosemary","white pepper","baking soda","plain flour","cornstarch","cornstarch slurry","sesame seeds"]);
const stateLabels:Record<string,string>={
 "salt":"Salt","black pepper":"Black pepper","salt and black pepper":"Salt & black pepper","garam masala":"Garam masala","paprika":"Paprika","amchur":"Amchur","roasted cumin":"Roasted cumin","roasted cumin powder":"Roasted cumin powder","cumin":"Cumin","cumin seeds":"Cumin seeds","palm sugar":"Palm sugar","sugar":"Sugar","oregano":"Oregano","rosemary":"Rosemary","white pepper":"White pepper","baking soda":"Baking soda","plain flour":"Plain flour","cornstarch":"Cornstarch","cornstarch slurry":"Cornstarch","sesame seeds":"Sesame seeds"
};

const aliases:[RegExp,string,string,IngredientCategory,IngredientUnit,IngredientTracking][]=[
 [/chicken thigh|chicken thighs|boneless chicken thigh|boneless chicken thighs|chicken breast or thigh/i,"chicken-thigh","Chicken thighs","Protein","g","quantity"],
 [/ground chicken or pork/i,"ground-meat","Ground chicken / pork","Protein","g","quantity"],
 [/chicken or beef/i,"chicken-or-beef","Chicken / beef","Protein","g","quantity"],
 [/minced beef/i,"beef-mince","Beef mince","Protein","g","quantity"],
 [/beef chuck/i,"beef-chuck","Beef chuck","Protein","g","quantity"],
 [/sirloin|hotpot beef|^beef$/i,"beef","Beef","Protein","g","quantity"],
 [/salmon/i,"salmon","Salmon","Protein","g","quantity"],
 [/white fish/i,"white-fish","White fish","Protein","g","quantity"],
 [/prawns or sliced chicken/i,"prawns-or-chicken","Prawns / chicken","Protein","g","quantity"],
 [/large prawns|^prawns$/i,"prawns","Prawns","Protein","g","quantity"],
 [/firm tofu/i,"tofu","Firm tofu","Protein","g","quantity"],
 [/tofu puffs/i,"tofu-puffs","Tofu puffs","Protein","count","quantity"],
 [/large eggs|^eggs$/i,"eggs","Eggs","Protein","count","quantity"],
 [/plain yoghurt|thick yoghurt/i,"yoghurt","Plain yoghurt","Dairy","g","quantity"],
 [/cooking cream/i,"cream","Cooking cream","Dairy","ml","quantity"],
 [/parmesan/i,"parmesan","Parmesan","Dairy","g","quantity"],
 [/^butter$/i,"butter","Butter","Dairy","g","quantity"],
 [/coconut milk/i,"coconut-milk","Coconut milk","Pantry","ml","quantity"],
 [/jasmine rice/i,"jasmine-rice","Jasmine rice","Pantry","portion","quantity"],
 [/basmati rice/i,"basmati-rice","Basmati rice","Pantry","portion","quantity"],
 [/^rice$/i,"rice","Rice","Pantry","portion","quantity"],
 [/fresh wide rice noodles|rice noodles/i,"rice-noodles","Rice noodles","Pantry","g","quantity"],
 [/spaghetti|rigatoni/i,"pasta","Pasta","Pantry","g","quantity"],
 [/couscous/i,"couscous","Couscous","Pantry","g","quantity"],
 [/tortillas/i,"tortillas","Tortillas","Pantry","count","quantity"],
 [/flatbread/i,"flatbread","Flatbread","Pantry","count","quantity"],
 [/potatoes or pasta/i,"starch-side","Potatoes / pasta","Pantry","portion","quantity"],
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
 [/potatoes/i,"potatoes","Potatoes","Fresh","g","quantity"],
 [/frozen peas/i,"peas","Frozen peas","Pantry","g","quantity"],
 [/bamboo shoots/i,"bamboo-shoots","Bamboo shoots","Pantry","g","quantity"],
 [/black beans/i,"black-beans","Black beans","Pantry","g","quantity"],
 [/butter beans/i,"butter-beans","Butter beans","Pantry","g","quantity"],
 [/chickpeas/i,"chickpeas","Chickpeas","Pantry","g","quantity"],
 [/corn$/i,"corn","Corn","Pantry","g","quantity"],
 [/carrot/i,"carrot","Carrot","Fresh","g","quantity"],
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
 [/fish sauce/i,"fish-sauce","Fish sauce","Pantry","ml","state"],
 [/oyster sauce/i,"oyster-sauce","Oyster sauce","Pantry","ml","state"],
 [/light soy|soy sauce/i,"soy-sauce","Soy sauce","Pantry","ml","state"],
 [/dark soy/i,"dark-soy","Dark soy","Pantry","ml","state"],
 [/sesame oil/i,"sesame-oil","Sesame oil","Pantry","ml","state"],
 [/red wine vinegar/i,"red-wine-vinegar","Red wine vinegar","Pantry","ml","state"],
 [/dry red wine/i,"red-wine","Dry red wine","Pantry","ml","state"],
 [/sake/i,"sake","Sake","Pantry","ml","state"],
 [/dijon mustard/i,"dijon","Dijon mustard","Pantry","ml","state"],
 [/tamarind water|^tamarind$/i,"tamarind","Tamarind","Pantry","ml","state"],
 [/roasted peanuts/i,"peanuts","Roasted peanuts","Pantry","g","quantity"],
 [/toasted desiccated coconut/i,"desiccated-coconut","Desiccated coconut","Pantry","g","quantity"],
 [/neutral oil|olive oil|^oil$|ghee or oil|neutral oil or ghee/i,"cooking-fat","Cooking oil / ghee","Pantry","ml","state"]
];

function stem(raw:string){
 let x=raw.replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
 const patterns=[/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\s*[×x]\s*\d+\s*g/i,/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\s*(?:g|ml|tbsp|tsp|portions?|head|sprig|wedge|small)\b/i,/\s(?:\d+(?:\.\d+)?|1½|1¼|1¾|½|¼|¾|⅓|⅔)\b/];
 let idx=x.length;for(const p of patterns){const m=x.match(p);if(m&&m.index!==undefined)idx=Math.min(idx,m.index)}return x.slice(0,idx).replace(/[,;:]$/," ").trim();
}
function displayAmount(raw:string,s:string){const i=raw.toLowerCase().indexOf(s.toLowerCase());let rest=i>=0?raw.slice(i+s.length).trim():"";rest=rest.replace(/^[,;:\-–—\s]+/,"").replace(/\s+optional$/i,"").trim();if(!rest){const m=raw.match(/1½|1¼|1¾|½|¼|¾|⅓|⅔|\d+(?:\.\d+)?/);if(m?.index!==undefined)rest=raw.slice(m.index).replace(/\s+optional$/i,"").trim()}return rest||"to taste"}
function parseNumber(x:string){return FRACTIONS[x]??Number(x)}
function amount(raw:string,id:string,preferred:IngredientUnit):{qty:number;unit:IngredientUnit}{
 if(id==="lettuce"){const m=raw.match(/lettuce\s+(\d+)/i);return{qty:m?Number(m[1]):1,unit:"count"}}
 if(id==="tortillas"){const m=raw.match(/tortillas\s+(\d+)/i);return{qty:m?Number(m[1]):4,unit:"count"}}
 if(id==="starch-side"){const m=raw.match(/(\d+(?:\.\d+)?)\s*portions?/i);return{qty:m?Number(m[1]):2,unit:"portion"}}
 const multi=raw.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*g/i);if(multi)return{qty:Number(multi[1])*Number(multi[2]),unit:"g"};
 const m=raw.match(/(1½|1¼|1¾|½|¼|¾|⅓|⅔|\d+(?:\.\d+)?)\s*(g|ml|tbsp|tsp|portions?)/i);if(m){const q=parseNumber(m[1]),u=m[2].toLowerCase();if(id==="butter"&&(u==="tbsp"||u==="tsp"))return{qty:q*(u==="tbsp"?14:4.7),unit:"g"};if(u==="tbsp"||u==="tsp")return{qty:q*(u==="tbsp"?15:5),unit:"ml"};if(u.startsWith("portion"))return{qty:q,unit:"portion"};return{qty:q,unit:u as IngredientUnit}}
 const n=raw.match(/(?:^|\s)(1½|1¼|1¾|½|¼|¾|⅓|⅔|\d+(?:\.\d+)?)(?:,|\s|$)/);if(n){let q=parseNumber(n[1]);if(id==="red-pepper"&&preferred==="g")return{qty:q*150,unit:"g"};if(id==="red-onion"&&preferred==="g")return{qty:q*150,unit:"g"};return{qty:q,unit:preferred==="g"||preferred==="ml"?"count":preferred}}
 return{qty:1,unit:preferred==="have"?"have":"count"};
}
function ingredientFromRaw(raw:string):IngredientRequirement|null{
 const s=stem(raw);if(!s)return null;const optional=/\boptional\b/i.test(raw);const display=displayAmount(raw,s);
 const make=(id:string,qty:number,unit:IngredientUnit):IngredientRequirement=>({id,qty,unit,raw,display:display==="to taste"&&id==="lemon"&&/wedge/i.test(raw)?"1 wedge":display,optional:optional||undefined});
 if(/^water(?: or stock)?$/i.test(s)||/^chicken or prawn stock$/i.test(s))return null;
 const componentCodes=new Set([...motherBases,...midBases,...boosters].map(x=>x.code).concat(["HAR","CHIP","TARE-T"]));if(componentCodes.has(s.toUpperCase()))return null;
 if(/^cornstarch slurry$/i.test(s)){const a=amount(raw,"cornstarch","have");return make("cornstarch",a.qty,a.unit)}
 if(stateNames.has(s.toLowerCase())){const id=s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");const a=amount(raw,id,"have");return make(id,a.qty,a.unit)}
 for(const [re,id,, ,unit] of aliases){if(re.test(s)){const a=amount(raw,id,unit);return make(id,a.qty,a.unit)}}
 const id=s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return make(id,1,"have");
}

export const prepComponents=[...motherBases.map(x=>({...x,kind:"mother" as const})),...midBases.map(x=>({...x,kind:"mid" as const})),...boosters.map(x=>({...x,kind:"booster" as const}))];
export const getComponent=(id:string)=>prepComponents.find(x=>x.id===id);

function normalizedPrep(r:ResearchedMeal):PrepRequirement[]{const src=prepOverrides[r.slug]??r.parts;return src.map(p=>{const id=resolvePart(p.code);if(!id)throw new Error(`Unmapped prep code ${p.code} in ${r.slug}`);return{id,portions:p.count,portionMl:p.sizeMl,totalMl:p.count*p.sizeMl}})}
export const recipes:CanonicalRecipe[]=researchedMeals.map(r=>{const prep=normalizedPrep(r);return{
 id:r.slug,title:r.title,subtitle:r.subtitle,cuisine:r.cuisine,minutes:r.time,method:r.method,difficulty:r.difficulty,prep,
 motherIds:prep.filter(x=>motherIds.has(x.id)).map(x=>x.id),midIds:prep.filter(x=>midIds.has(x.id)).map(x=>x.id),boosterIds:prep.filter(x=>boosterIds.has(x.id)).map(x=>x.id),
 ingredients:r.ingredients.map(ingredientFromRaw).filter(Boolean) as IngredientRequirement[],rawIngredients:r.ingredients,steps:r.steps,why:r.why,balance:r.balance,source:r.source,tags:r.tags,image:r.imageUrl??mealImages[r.slug],status:"researched"
}});

const defs=new Map<string,IngredientDef>();
for(const r of recipes)for(const req of r.ingredients){if(defs.has(req.id))continue;const s=stem(req.raw);if(req.id==="cornstarch"||stateNames.has(s.toLowerCase())){const key=req.id==="cornstarch"?"cornstarch":s.toLowerCase();defs.set(req.id,{id:req.id,name:stateLabels[key]??s,category:"Pantry",unit:"have",tracking:"state"});continue}let hit:IngredientDef|undefined;for(const [re,id,name,category,unit,tracking] of aliases){if(id===req.id||re.test(s)){hit={id,name,category,unit,tracking};break}}defs.set(req.id,hit??{id:req.id,name:s,category:"Pantry",unit:req.unit,tracking:req.unit==="have"?"state":"quantity"})}
export const ingredients=[...defs.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
export const getIngredient=(id:string)=>ingredients.find(x=>x.id===id)!;
export const getRecipe=(id:string)=>recipes.find(x=>x.id===id)!;
export const getMeal=getRecipe;
export const getMother=(id:string)=>motherBases.find(x=>x.id===id);
export const getMid=(id:string)=>midBases.find(x=>x.id===id);
export const defaultWeek=[...firstWeekSlugs];

export const initialComponentStock:Record<string,number>=Object.fromEntries(prepComponents.map(x=>[x.id,0]));
export const initialIngredientStock:Record<string,number>=Object.fromEntries(ingredients.map(x=>[x.id,0]));

export function prepDemandForWeek(week:string[]){const out:Record<string,{portions:number,totalMl:number}>={};for(const recipeId of week){const r=getRecipe(recipeId);if(!r)continue;for(const p of r.prep){const v=out[p.id]??{portions:0,totalMl:0};v.portions+=p.portions;v.totalMl+=p.totalMl;out[p.id]=v}}return out}
export function prepNeedsForWeek(week:string[],stock:Record<string,number>){return Object.entries(prepDemandForWeek(week)).map(([id,v])=>({id,needed:v.portions,totalMl:v.totalMl,onHand:stock[id]??0,short:Math.max(0,v.portions-(stock[id]??0))})).filter(x=>x.short>0)}
export function ingredientDemandForWeek(week:string[]){const out:Record<string,{qty:number;unit:IngredientUnit}>={};for(const recipeId of week){const r=getRecipe(recipeId);if(!r)continue;for(const req of r.ingredients){if(req.optional)continue;const def=getIngredient(req.id);if(def?.tracking==="state"){out[req.id]={qty:1,unit:"have"};continue}const v=out[req.id];if(!v)out[req.id]={qty:req.qty,unit:req.unit};else if(v.unit===req.unit)v.qty+=req.qty}}return out}
export function shoppingNeedsForWeek(week:string[],stock:Record<string,number>){return Object.entries(ingredientDemandForWeek(week)).map(([id,v])=>{const def=getIngredient(id),onHand=stock[id]??0;const qty=def?.tracking==="state"?(onHand>0?0:1):Math.max(0,v.qty-onHand);return{id,qty,unit:v.unit,required:v.qty,onHand}}).filter(x=>x.qty>0)}
export function componentConsumption(recipeId:string){const r=getRecipe(recipeId);return r?r.prep.map(x=>({id:x.id,qty:x.portions})):[]}
export function ingredientConsumption(recipeId:string){return getRecipe(recipeId)?.ingredients.filter(x=>!x.optional)??[]}
export const coverageByMother=motherBases.map(mother=>({mother,mids:midBases.filter(mid=>mid.parentMotherIds.includes(mother.id)),meals:recipes.filter(r=>r.motherIds.includes(mother.id))}));
export const totalDinnerDirections=150;
export const componentLabel=(id:string)=>componentById(id);
