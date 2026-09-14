import {quantity,type Quantity,type QuantityUnit} from "./food-quantity";
import {getPrepPortionPolicyV6} from "./prep-portioning-v6";

export type PrepEnergyMethodV6="recipe_composition_proxy"|"finished_food_proxy"|"product_label_proxy";
export type PrepEnergyReferenceV6=Readonly<{
  componentId:string;
  unit:QuantityUnit;
  kcalPerUnit:number;
  method:PrepEnergyMethodV6;
  confidence:"B"|"C"|"D";
  uncertaintyPct:number;
  source:string;
  note:string;
}>;
const FAO="FAO/INFOODS recipe calculation: ingredient composition + edible portion + yield/retention; household measured output upgrades density";
const FINISHED="Finished-food proxy for extraction/straining-sensitive liquids; household product/batch evidence can replace the proxy";
const LABEL="Generic packaged-sauce proxy; exact household label upgrades the estimate";
const R=(componentId:string,kcalPerUnit:number,unit:QuantityUnit,method:PrepEnergyMethodV6,confidence:"B"|"C"|"D",uncertaintyPct:number,note:string):PrepEnergyReferenceV6=>({componentId,kcalPerUnit,unit,method,confidence,uncertaintyPct,source:method==="finished_food_proxy"?FINISHED:method==="product_label_proxy"?LABEL:FAO,note});

/**
 * Reference finished-prep energy densities. These are planning estimates, not fake
 * household yields. For non-strained preps, actual measured finished output + ingredient
 * energy can supersede the proxy. Stocks/broths stay on a finished-food proxy unless a
 * direct household analysis/label is available.
 */
export const prepEnergyReferencesV6:readonly PrepEnergyReferenceV6[]=[
 R("red",0.55,"g","recipe_composition_proxy","C",20,"Tomato/vegetable reduction with measured oil; water loss mainly changes density."),
 R("blond",1.30,"g","recipe_composition_proxy","C",22,"Soffritto proxy reflects vegetables plus retained olive oil."),
 R("gold",1.50,"g","recipe_composition_proxy","C",22,"Bhuna-style onion/tomato masala proxy including retained oil."),
 R("sambal",3.00,"g","recipe_composition_proxy","C",25,"Oil-rich sambal tumis proxy; chilli/shallot reduction and oil retention vary."),
 R("rempah",2.50,"g","recipe_composition_proxy","C",25,"Aromatic/nut/oil paste proxy; actual reduction varies by pan and blender water."),
 R("clear",0.08,"ml","finished_food_proxy","D",30,"Strained/defatted chicken stock: do not count raw bones/solids as eaten."),
 R("dark",0.60,"g","finished_food_proxy","D",35,"Reduced brown chicken stock concentrate; straining/defatting make raw-input summation misleading."),
 R("onion",2.00,"g","recipe_composition_proxy","C",25,"Caramelised onion proxy including butter/oil after substantial water loss."),

 R("makhani",1.60,"g","recipe_composition_proxy","C",22,"Tomato-cashew-butter concentrate before dinner-time cream."),
 R("saag",0.40,"g","recipe_composition_proxy","C",20,"Reduced spinach/chilli/ginger puree."),
 R("korma",2.40,"g","recipe_composition_proxy","C",25,"Nut/onion/oil concentrate before dinner-time yoghurt/cream."),
 R("rendang",3.60,"g","recipe_composition_proxy","C",28,"Rempah/chilli/oil concentrate; kerisik/coconut milk remain dinner-time inputs."),
 R("laksa",2.50,"g","recipe_composition_proxy","C",28,"Laksa concentrate proxy; exact oil/nut/spice composition and reduction vary."),
 R("malaysian-kari",2.00,"g","recipe_composition_proxy","C",25,"Malaysian curry concentrate proxy before dinner-time coconut/liquid."),
 R("asam-pedas",1.50,"g","recipe_composition_proxy","C",25,"Aromatic chilli/tamarind-style concentrate proxy."),
 R("thai-green",1.80,"g","recipe_composition_proxy","C",25,"Fresh-herb/curry-paste proxy; one small dose is intentionally concentrated."),
 R("thai-red",1.90,"g","recipe_composition_proxy","C",25,"Red curry-paste proxy."),
 R("nam-prik-pao",3.00,"g","recipe_composition_proxy","C",28,"Oil/sugar/chilli-heavy roasted chilli jam proxy."),
 R("krapow",0.85,"ml","product_label_proxy","D",25,"Prepared kra-pao sauce proxy; soy/fish/sugar brand mix changes energy."),
 R("nuoc-cham",0.55,"ml","recipe_composition_proxy","C",20,"Diluted fish-sauce/lime/sugar dressing proxy."),
 R("wok-brown",1.10,"ml","recipe_composition_proxy","C",22,"Brown wok sauce proxy including soy/oyster/sugar/starch."),
 R("wok-white",0.80,"ml","recipe_composition_proxy","C",22,"White wok sauce proxy with lower dark/sugar load."),
 R("char-siu",2.20,"g","recipe_composition_proxy","C",25,"Sweet fermented/soy char-siu marinade-glaze proxy."),
 R("douban",1.30,"g","product_label_proxy","D",25,"Fermented chilli-bean sauce concentrate; brand labels vary."),
 R("ginger-scallion",4.20,"g","recipe_composition_proxy","C",25,"Oil-rich ginger-scallion condiment proxy."),
 R("dashi",0.03,"ml","finished_food_proxy","D",35,"Strained kombu/bonito stock proxy; discarded solids are not counted as eaten."),
 R("teriyaki",1.45,"ml","recipe_composition_proxy","C",22,"Reduced soy/mirin/sake/sugar glaze proxy."),
 R("jp-curry",4.00,"g","product_label_proxy","D",20,"Japanese curry roux is flour/fat/spice dense; exact block label should supersede."),
 R("k-anchovy",0.04,"ml","finished_food_proxy","D",35,"Strained Korean anchovy/kelp stock proxy."),
 R("gochujang",2.00,"g","recipe_composition_proxy","C",25,"Gochujang finishing-sauce proxy; brand paste energy varies."),
 R("harissa",2.00,"g","recipe_composition_proxy","C",25,"Chilli/spice/oil paste proxy."),
 R("chipotle",1.20,"g","recipe_composition_proxy","C",25,"Chipotle-adobo style sauce proxy."),
 R("pesto",4.50,"g","recipe_composition_proxy","C",22,"Basil/nut/cheese/olive-oil pesto proxy."),
 R("duxelles",1.20,"g","recipe_composition_proxy","C",25,"Reduced mushroom/onion/fat concentrate proxy."),

 R("gg",1.10,"g","recipe_composition_proxy","C",20,"Ginger-garlic paste proxy."),
 R("garlic",1.50,"g","recipe_composition_proxy","C",18,"Garlic booster proxy."),
 R("chilli",0.60,"g","recipe_composition_proxy","C",20,"Fresh/dried chilli booster proxy."),
 R("lemongrass",0.70,"g","recipe_composition_proxy","C",22,"Lemongrass/aromatic booster proxy."),
 R("massaman-finish",3.00,"g","recipe_composition_proxy","C",25,"Dry warm-spice/nut finish proxy; dose is tiny."),
 R("miso-ginger",2.20,"g","recipe_composition_proxy","C",25,"Miso/sweetener/ginger meal-scale glaze proxy."),
 R("bulgogi",1.40,"g","recipe_composition_proxy","C",25,"Soy/sugar/fruit/aromatic bulgogi marinade proxy."),
] as const;

const byId=new Map(prepEnergyReferencesV6.map(x=>[x.componentId,x]));
export function prepEnergyReferenceV6(componentId:string){return byId.get(componentId)}
export function prepReferenceKcalV6(componentId:string,value:Quantity){const r=prepEnergyReferenceV6(componentId);if(!r||r.unit!==value.unit)return null;return Math.round(value.qty*r.kcalPerUnit*10)/10}
export function prepPacketReferenceKcalV6(componentId:string){const p=getPrepPortionPolicyV6(componentId),r=prepEnergyReferenceV6(componentId);if(!p||!r||p.packet.unit!==r.unit)return null;return Math.round(p.packet.qty*r.kcalPerUnit)}

export function calibratedPrepDensityV6(componentId:string,batchInputKcal:number,measuredOutput:Quantity){
 const r=prepEnergyReferenceV6(componentId);if(!r||r.method==="finished_food_proxy")return null;if(r.unit!==measuredOutput.unit||!(measuredOutput.qty>0)||!(batchInputKcal>=0))return null;
 return{componentId,unit:measuredOutput.unit,kcalPerUnit:batchInputKcal/measuredOutput.qty,method:"household_measured_output" as const,measuredOutput:quantity(measuredOutput.qty,measuredOutput.unit)};
}

export function validatePrepEnergyReferencesV6(){const errors:string[]=[];if(prepEnergyReferencesV6.length!==41)errors.push(`Expected 41 prep energy references, found ${prepEnergyReferencesV6.length}`);const ids=new Set(prepEnergyReferencesV6.map(x=>x.componentId));if(ids.size!==prepEnergyReferencesV6.length)errors.push("Duplicate prep energy reference");for(const r of prepEnergyReferencesV6){const p=getPrepPortionPolicyV6(r.componentId);if(!p)errors.push(`Missing portion policy for ${r.componentId}`);else if(p.packet.unit!==r.unit)errors.push(`${r.componentId} energy unit ${r.unit} != packet unit ${p.packet.unit}`);if(!(r.kcalPerUnit>=0))errors.push(`${r.componentId} invalid kcal density`)}return{valid:errors.length===0,errors}}
