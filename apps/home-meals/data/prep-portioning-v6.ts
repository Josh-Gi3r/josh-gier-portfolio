import {quantity,type Quantity,type QuantityUnit} from "./food-quantity";
import {getCanonicalPrepV2} from "./food-truth-v2";
import {getPrepFormulationV2,type CanonicalPrepFormulationV2} from "./prep-formulations-v2";

export type PrepPacketKindV6="meal-packet"|"stock-block"|"booster-dose"|"fridge-portion"|"pantry-dose";
export type PrepPortionPolicyV6=Readonly<{
  componentId:string;
  packet:Quantity;
  kind:PrepPacketKindV6;
  containerCapacityMl?:number;
  targetRotation:[number,number];
  householdBatchScale:number;
  note:string;
}>;

const P=(componentId:string,qty:number,unit:QuantityUnit,kind:PrepPacketKindV6,containerCapacityMl:number|undefined,targetRotation:[number,number],householdBatchScale:number,note:string):PrepPortionPolicyV6=>({componentId,packet:quantity(qty,unit),kind,containerCapacityMl,targetRotation,householdBatchScale,note});

/**
 * V6 storage/counting contract.
 *
 * packet = a practical stored unit, NOT an assumed finished yield. Production is always
 * measured after cooking. Gram packets are weighed; containerCapacityMl is only a fit
 * guide and must never be used to convert g↔ml.
 *
 * householdBatchScale changes only how much of the source/master prep formulation we
 * choose to cook in one household session. It deliberately does not change recipe demand.
 */
export const prepPortionPoliciesV6:readonly PrepPortionPolicyV6[]=[
  P("red",320,"g","meal-packet",500,[3,5],0.5,"One normal four-serving tomato-sauce cook is commonly around this scale; larger/smaller recipes keep exact gram truth."),
  P("blond",100,"g","meal-packet",250,[3,5],0.75,"Soffritto is concentrated; 100 g is a useful household module and two packets cover the larger four-serving uses."),
  P("gold",240,"g","meal-packet",350,[3,5],0.75,"The main four-serving curry dose. Smaller Indian dishes may intentionally use a half or three-quarter packet."),
  P("sambal",120,"g","meal-packet",250,[3,5],1,"The common four-serving sambal dose; nasi lemak/sotong may use more and keep exact grams."),
  P("rempah",220,"g","meal-packet",350,[2,4],1,"One substantial four-serving rempah cook packet; child mids may consume exact parent grams independently."),
  P("clear",400,"ml","stock-block",500,[3,6],0.5,"A useful stock block: two for laksa, 2.5 for risotto. Keep exact ml; do not call a cavity volume a mass."),
  P("dark",50,"g","booster-dose",125,[3,6],0.5,"Highly reduced brown-stock concentrate; one dose matches the common four-serving dinner requirement."),
  P("onion",100,"g","meal-packet",250,[2,4],0.5,"Caramelised onion is dense; keep a few useful portions rather than kilograms of freezer stock."),
  P("makhani",360,"g","meal-packet",500,[2,4],1,"One Butter Chicken/Paneer Makhani four-serving sauce packet before dinner-time cream/butter tuning."),
  P("saag",240,"g","meal-packet",350,[2,4],1,"One live green-curry packet; Palak Paneer may use 1.5 packets while preserving exact grams."),
  P("korma",320,"g","meal-packet",500,[2,3],1,"One four-serving chicken-korma packet."),
  P("rendang",220,"g","meal-packet",350,[2,4],1,"One live four-serving rendang-concentrate packet; the researched beef version uses a small measured top-up."),
  P("laksa",220,"g","meal-packet",350,[2,4],1,"One four-serving laksa concentrate packet."),
  P("malaysian-kari",280,"g","meal-packet",350,[2,4],1,"One Malaysian curry four-serving packet."),
  P("asam-pedas",200,"g","meal-packet",350,[2,4],1,"One asam-pedas four-serving aromatic packet; tamarind/fresh herbs remain dinner-time inputs."),
  P("thai-green",55,"g","booster-dose",125,[3,6],1,"Thai curry paste is concentrated: this small weighed dose genuinely serves a four-serving curry."),
  P("thai-red",60,"g","booster-dose",125,[3,6],1,"Concentrated red-curry paste dose sized to the four-serving Thai recipes."),
  P("nam-prik-pao",60,"g","booster-dose",125,[3,5],1,"One Tom Yum dose; Thai cashew chicken intentionally uses about half."),
  P("krapow",75,"ml","meal-packet",125,[3,5],1,"One four-serving kra-pao sauce packet."),
  P("nuoc-cham",200,"ml","fridge-portion",250,[2,4],1,"A practical dressing portion between the 180 ml and 220 ml researched four-serving bowl uses; recipes retain exact ml."),
  P("wok-brown",225,"ml","meal-packet",250,[3,5],1,"One four-serving brown wok-sauce packet."),
  P("wok-white",225,"ml","meal-packet",250,[3,5],1,"One four-serving white wok-sauce packet."),
  P("char-siu",110,"g","meal-packet",250,[2,4],1,"One four-serving pork dose; the chicken branch uses 100 g exact."),
  P("douban",50,"g","booster-dose",125,[3,5],1,"One four-serving Mapo Tofu fermented chilli-bean dose."),
  P("ginger-scallion",30,"g","booster-dose",125,[3,5],1,"One four-serving ginger-scallion oil dose."),
  P("dashi",400,"ml","stock-block",500,[3,5],1,"One four-serving donburi stock block."),
  P("teriyaki",100,"ml","meal-packet",125,[3,5],1,"One four-serving teriyaki glaze packet."),
  P("jp-curry",100,"g","meal-packet",250,[3,5],1,"One four-serving Japanese curry roux packet."),
  P("k-anchovy",500,"ml","stock-block",500,[2,4],1,"One kimchi-jjigae stock block; doenjang-jjigae uses 900 ml exact, roughly 1.8 blocks."),
  P("gochujang",100,"g","meal-packet",250,[3,5],1,"One four-serving chicken GOCHU finishing-sauce packet; tofu intentionally uses less."),
  P("harissa",100,"g","meal-packet",250,[3,5],1,"One traybake packet; chickpeas use half."),
  P("chipotle",100,"g","meal-packet",250,[3,5],1,"One chicken-bowl packet; bean/enchilada recipes use measured fractions."),
  P("pesto",55,"g","booster-dose",125,[3,5],1,"One four-serving pesto-salmon dose."),
  P("duxelles",100,"g","meal-packet",250,[2,4],1,"One live mushroom-chicken dose; risotto uses 180 g exact."),
  P("gg",25,"g","booster-dose",60,[4,8],1,"Concentrated ginger-garlic booster for a normal four-serving cook."),
  P("garlic",25,"g","booster-dose",60,[4,8],1,"Four-serving garlic booster; aglio e olio uses 30 g exact."),
  P("chilli",25,"g","booster-dose",60,[4,8],1,"Four-serving chilli booster."),
  P("lemongrass",30,"g","booster-dose",60,[4,8],1,"Four-serving aromatic booster; live rempah dishes use 25 g exact."),
  P("massaman-finish",12,"g","booster-dose",30,[4,8],1,"Highly concentrated warm-spice finish; 12 g is the reviewed four-serving dose."),
  P("miso-ginger",140,"g","meal-packet",250,[2,4],1,"Despite booster lineage this is a meal-scale four-serving miso-ginger packet."),
  P("bulgogi",175,"g","meal-packet",250,[2,4],1,"One four-serving bulgogi marinade packet."),
] as const;

export const prepPortionPolicyByIdV6=new Map(prepPortionPoliciesV6.map(x=>[x.componentId,x]));
export function getPrepPortionPolicyV6(componentId:string){return prepPortionPolicyByIdV6.get(componentId)}

function roundScaled(qty:number,unit:QuantityUnit,scale:number){
  const n=qty*scale;
  if(unit==="count")return Math.max(1,Math.round(n));
  if(n>=100)return Math.round(n/5)*5;
  if(n>=20)return Math.round(n);
  return Math.round(n*2)/2;
}

export function getHouseholdPrepFormulationV6(componentId:string):CanonicalPrepFormulationV2|undefined{
  const source=getPrepFormulationV2(componentId),policy=getPrepPortionPolicyV6(componentId);if(!source||!policy)return source;
  const scale=policy.householdBatchScale;
  if(scale===1)return source;
  return {...source,
    ingredientInputs:source.ingredientInputs.map(x=>({...x,qty:roundScaled(x.qty,x.unit,scale)})),
    componentInputs:source.componentInputs.map(x=>({...x,qty:roundScaled(x.qty,x.unit,scale)})),
  };
}

export type PacketBreakdownV6=Readonly<{fullPackets:number;remainder:Quantity;packet:Quantity;exactPackets:number}>;
export function packetBreakdownV6(componentId:string,value:Quantity):PacketBreakdownV6{
  const policy=getPrepPortionPolicyV6(componentId);if(!policy)throw new Error(`Missing V6 prep packet policy for ${componentId}`);if(policy.packet.unit!==value.unit)throw new Error(`Packet unit mismatch for ${componentId}: ${value.unit} vs ${policy.packet.unit}`);
  const exactPackets=Math.max(0,value.qty)/policy.packet.qty,fullPackets=Math.floor(exactPackets+1e-9),remainderQty=Math.max(0,value.qty-fullPackets*policy.packet.qty);
  return{fullPackets,remainder:quantity(Math.round(remainderQty*10)/10,value.unit),packet:policy.packet,exactPackets:Math.round(exactPackets*100)/100};
}

export function packetCountV6(componentId:string,value:Quantity){return packetBreakdownV6(componentId,value).exactPackets}

export function formatPacketCountV6(n:number){
  const rounded=Math.round(n*4)/4;
  if(Math.abs(rounded-Math.round(rounded))<1e-9)return String(Math.round(rounded));
  return String(rounded).replace(".25","¼").replace(".5","½").replace(".75","¾");
}

export function prepRequirementPacketTextV6(componentId:string,value:Quantity){
  const c=getCanonicalPrepV2(componentId),p=getPrepPortionPolicyV6(componentId);if(!p||p.packet.unit!==value.unit)return`${c?.code??componentId} · ${value.qty} ${value.unit}`;
  const count=value.qty/p.packet.qty,pretty=formatPacketCountV6(count),label=p.kind==="stock-block"?"stock block":p.kind==="booster-dose"?"dose":p.kind==="fridge-portion"?"portion":"meal packet";
  return`${c?.code??componentId} · ${value.qty} ${value.unit} · ${pretty} ${label}${pretty==="1"?"":"s"}`;
}

export function containerGuidanceV6(componentId:string){
  const p=getPrepPortionPolicyV6(componentId);if(!p)return null;
  if(!p.containerCapacityMl)return p.packet.unit==="g"?`Weigh ${p.packet.qty} g per stored ${p.kind}.`: `Measure ${p.packet.qty} ${p.packet.unit} per stored ${p.kind}.`;
  return p.packet.unit==="g"
    ?`Weigh ${p.packet.qty} g per stored ${p.kind}. A ~${p.containerCapacityMl} ml container/cavity is only a fit guide; do not treat ml as grams.`
    :`Measure ${p.packet.qty} ml per stored ${p.kind}; a ~${p.containerCapacityMl} ml container/cavity gives practical headroom.`;
}

export function validatePrepPortionPoliciesV6(){
  const errors:string[]=[];
  for(const p of prepPortionPoliciesV6){const c=getCanonicalPrepV2(p.componentId),f=getPrepFormulationV2(p.componentId);if(!c)errors.push(`Unknown component ${p.componentId}`);if(!f)errors.push(`Missing prep formulation ${p.componentId}`);if(c&&c.workingUnit.unit!==p.packet.unit)errors.push(`${p.componentId} packet unit ${p.packet.unit} != canonical unit ${c.workingUnit.unit}`);if(!(p.packet.qty>0))errors.push(`${p.componentId} packet must be positive`);if(!(p.householdBatchScale>0&&p.householdBatchScale<=1))errors.push(`${p.componentId} householdBatchScale out of range`);if(p.targetRotation[0]<1||p.targetRotation[1]<p.targetRotation[0])errors.push(`${p.componentId} invalid rotation target`)}
  const ids=new Set(prepPortionPoliciesV6.map(x=>x.componentId));if(ids.size!==prepPortionPoliciesV6.length)errors.push("Duplicate V6 prep packet policy");
  return{valid:errors.length===0,errors};
}
