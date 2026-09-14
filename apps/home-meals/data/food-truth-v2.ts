import { quantity, type Quantity, type QuantityUnit } from "./food-quantity";

export type PrepTier = "mother" | "mid" | "booster";
export type PrepForm = "cooked-base" | "stock" | "paste" | "sauce" | "marinade" | "roux" | "aromatic" | "condiment" | "spice";
export type StorageMode = "freezer-core" | "freezer-rotational" | "demand-driven" | "fridge-first" | "pantry-first";
export type ResearchConfidence = "A" | "B" | "C";
export type TruthState = "source_verified" | "formulation_locked" | "derived" | "household_measured" | "household_approved" | "unknown";
export type MeasurementStatus = "unmeasured" | "measured_once" | "household_calibrated";

export type CanonicalPrepComponentV2 = Readonly<{
  id: string;
  code: string;
  name: string;
  tier: PrepTier;
  form: PrepForm;
  storageMode: StorageMode;
  workingUnit: Quantity;
  madeFrom: readonly string[];
  usedWith: readonly string[];
  researchConfidence: ResearchConfidence;
  truthState: TruthState;
  measurementStatus: MeasurementStatus;
  note?: string;
}>;

export type RecipePrepRequirementV2 = Readonly<{
  componentId: string;
  quantity: Quantity;
}>;

const q = (qty: number, unit: QuantityUnit) => quantity(qty, unit);
const c = (value: CanonicalPrepComponentV2) => value;

/**
 * Canonical researched food semantics for Home Meals.
 *
 * Deliberately excluded from this file:
 * - unmeasured finished batch yields;
 * - assumed portions-per-batch;
 * - exact nutrient density derived from an unmeasured cooked yield;
 * - household taste/portion claims that Josh + G have not observed.
 *
 * Those become truth only after a real household measurement or deterministic calculation.
 */
export const canonicalPrepComponentsV2: readonly CanonicalPrepComponentV2[] = [
  c({ id:"red", code:"RED", name:"Neutral concentrated tomato", tier:"mother", form:"cooked-base", storageMode:"freezer-core", workingUnit:q(90,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"blond", code:"BLOND", name:"Home Italian-style soffritto", tier:"mother", form:"cooked-base", storageMode:"freezer-core", workingUnit:q(60,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Home batching ratio for Italian-style soffritto; not a claim that one universal Italian ratio exists." }),
  c({ id:"gold", code:"GOLD", name:"Bhuna onion-tomato masala", tier:"mother", form:"cooked-base", storageMode:"freezer-core", workingUnit:q(60,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"sambal", code:"SAMBAL", name:"Sambal tumis concentrate", tier:"mother", form:"paste", storageMode:"freezer-core", workingUnit:q(60,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"rempah", code:"REMPAH", name:"Home Malay/Nyonya aromatic rempah", tier:"mother", form:"paste", storageMode:"freezer-core", workingUnit:q(60,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Home Meals reusable aromatic starter; not a claim that one universal rempah exists." }),
  c({ id:"clear", code:"CLEAR", name:"Unsalted light chicken stock", tier:"mother", form:"stock", storageMode:"freezer-core", workingUnit:q(120,"ml"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"dark", code:"DARK", name:"Unsalted brown stock concentrate", tier:"mother", form:"stock", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"onion", code:"ONION", name:"Deep caramelised onion", tier:"mother", form:"cooked-base", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),

  c({ id:"makhani", code:"MAKHANI", name:"Makhani sauce concentrate", tier:"mid", form:"sauce", storageMode:"demand-driven", workingUnit:q(120,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Standalone tomato-cashew-butter concentrate. GOLD is not a physical parent; this remains demand-driven until a future dinner uses it." }),
  c({ id:"saag", code:"SAAG", name:"Saag greens concentrate", tier:"mid", form:"cooked-base", storageMode:"freezer-rotational", workingUnit:q(120,"g"), madeFrom:[], usedWith:["gold"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"korma", code:"KORMA", name:"Korma golden-onion nut concentrate", tier:"mid", form:"paste", storageMode:"demand-driven", workingUnit:q(100,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Uses its own golden onion input. Deep ONION is not a physical parent because korma should not inherit a jammy mahogany caramelised-onion profile." }),
  c({ id:"rendang", code:"RENDANG", name:"Rendang concentrate", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(60,"g"), madeFrom:["rempah"], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"laksa", code:"LAKSA", name:"Curry-laksa concentrate", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(60,"g"), madeFrom:["rempah"], usedWith:["clear"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"malaysian-kari", code:"KARI", name:"Home Malaysian curry paste", tier:"mid", form:"paste", storageMode:"demand-driven", workingUnit:q(150,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"asam-pedas", code:"ASAM", name:"Home asam pedas paste", tier:"mid", form:"paste", storageMode:"demand-driven", workingUnit:q(100,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"thai-green", code:"THAI-G", name:"Thai green curry paste", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"thai-red", code:"THAI-R", name:"Thai red curry paste", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:["massaman-finish"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"nam-prik-pao", code:"NPP", name:"Nam prik pao", tier:"mid", form:"condiment", storageMode:"demand-driven", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"krapow", code:"KRAPOW", name:"Pad-kra-pao seasoning sauce", tier:"mid", form:"sauce", storageMode:"fridge-first", workingUnit:q(30,"ml"), madeFrom:[], usedWith:["garlic","chilli"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Seasoning sauce only; holy basil stays fresh and dinner must not duplicate the stored sauces." }),
  c({ id:"nuoc-cham", code:"NUOC", name:"Nuoc cham base", tier:"mid", form:"condiment", storageMode:"fridge-first", workingUnit:q(60,"ml"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"wok-brown", code:"WOK-B", name:"Chinese brown stir-fry sauce", tier:"mid", form:"sauce", storageMode:"fridge-first", workingUnit:q(150,"ml"), madeFrom:["clear"], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"CLEAR is consumed when WOK-B is produced; dinner must not deduct CLEAR again. 150 ml is the Home two-person formulation dose derived from a source range around 2/3 cup, pending household taste calibration." }),
  c({ id:"wok-white", code:"WOK-W", name:"Chinese white stir-fry sauce", tier:"mid", form:"sauce", storageMode:"fridge-first", workingUnit:q(150,"ml"), madeFrom:["clear"], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"CLEAR is consumed when WOK-W is produced; dinner must not deduct CLEAR again." }),
  c({ id:"char-siu", code:"CHAR-SIU", name:"Char siu marinade", tier:"mid", form:"marinade", storageMode:"demand-driven", workingUnit:q(60,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"douban", code:"DOUBAN", name:"Home doubanjiang aromatic concentrate", tier:"mid", form:"paste", storageMode:"demand-driven", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"ginger-scallion", code:"GS-OIL", name:"Ginger-scallion oil", tier:"mid", form:"condiment", storageMode:"fridge-first", workingUnit:q(15,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"dashi", code:"DASHI", name:"Awase dashi", tier:"mid", form:"stock", storageMode:"demand-driven", workingUnit:q(200,"ml"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"teriyaki", code:"TERI", name:"Teriyaki tare", tier:"mid", form:"sauce", storageMode:"fridge-first", workingUnit:q(30,"ml"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"jp-curry", code:"JP-CURRY", name:"Japanese curry roux", tier:"mid", form:"roux", storageMode:"demand-driven", workingUnit:q(25,"g"), madeFrom:[], usedWith:["onion","clear"], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"k-anchovy", code:"K-STOCK", name:"Korean anchovy-kelp stock", tier:"mid", form:"stock", storageMode:"demand-driven", workingUnit:q(250,"ml"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"gochujang", code:"GOCHU", name:"Home gochujang finishing sauce", tier:"mid", form:"sauce", storageMode:"fridge-first", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"harissa", code:"HARISSA", name:"Home harissa concentrate", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:["red"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"chipotle", code:"CHIPOTLE", name:"Home chipotle-adobo concentrate", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:["red"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"pesto", code:"PESTO", name:"Pesto freezer base", tier:"mid", form:"paste", storageMode:"freezer-rotational", workingUnit:q(30,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Cheese-free freezer base for quality. Finished pesto dishes add Parmesan/Pecorino fresh; the frozen object is not represented as complete pesto Genovese." }),
  c({ id:"duxelles", code:"DUX", name:"Mushroom duxelles", tier:"mid", form:"cooked-base", storageMode:"freezer-rotational", workingUnit:q(60,"g"), madeFrom:[], usedWith:["blond","dark"], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"BLOND and DARK are used with DUX in some dinners; they are not automatically physical parents of canonical duxelles." }),

  c({ id:"ginger-garlic", code:"GG", name:"Ginger-garlic paste", tier:"booster", form:"aromatic", storageMode:"freezer-core", workingUnit:q(15,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"garlic", code:"G", name:"Garlic paste", tier:"booster", form:"aromatic", storageMode:"freezer-core", workingUnit:q(15,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"chilli", code:"CH", name:"Home neutral chilli paste", tier:"booster", form:"aromatic", storageMode:"freezer-core", workingUnit:q(15,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"lemongrass", code:"LE", name:"Home lemongrass-galangal aromatic", tier:"booster", form:"aromatic", storageMode:"freezer-core", workingUnit:q(15,"g"), madeFrom:[], usedWith:[], researchConfidence:"B", truthState:"formulation_locked", measurementStatus:"unmeasured" }),
  c({ id:"massaman-finish", code:"MASS", name:"Massaman dry spice finish", tier:"booster", form:"spice", storageMode:"pantry-first", workingUnit:q(7,"g"), madeFrom:[], usedWith:["thai-red"], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Dry warm-spice booster. It must not contain a second dose of Thai red curry paste." }),
  c({ id:"miso-ginger", code:"MISO-G", name:"Miso-ginger marinade", tier:"booster", form:"marinade", storageMode:"fridge-first", workingUnit:q(40,"g"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Home ginger variant anchored to Japanese miso salmon proportions: miso, sake, mirin, Japanese soy and a very small amount of sesame oil. Rice vinegar is not part of this canonical marinade." }),
  c({ id:"bulgogi", code:"BUL", name:"Bulgogi marinade", tier:"booster", form:"marinade", storageMode:"demand-driven", workingUnit:q(50,"g"), madeFrom:[], usedWith:[], researchConfidence:"A", truthState:"formulation_locked", measurementStatus:"unmeasured", note:"Soy, pear/apple, sugar, rice wine/mirin, garlic and sesame oil; ginger is not part of the canonical Home formulation. Onion/scallion remain fresh dinner inputs." }),
] as const;

const r = (componentId: string, qty: number, unit: QuantityUnit): RecipePrepRequirementV2 => ({ componentId, quantity:q(qty, unit) });

/**
 * Researched two-person prep consumption contract.
 * These are formulation decisions to validate in the household, not claims about batch output.
 * An empty array is valid when a dinner is intentionally built entirely from direct ingredients.
 */
export const recipePrepRequirementsV2: Readonly<Record<string, readonly RecipePrepRequirementV2[]>> = {
  "gold-chicken-curry":[r("gold",120,"g")],
  "gold-chana-masala":[r("gold",120,"g")],
  "gold-punjabi-egg-curry":[r("gold",120,"g")],
  "gold-saag-chicken":[r("gold",120,"g"),r("saag",120,"g")],
  "gold-aloo-matar":[r("gold",120,"g")],
  "sambal-udang":[r("sambal",60,"g")],
  "sambal-telur":[r("sambal",60,"g")],
  "curry-laksa":[r("laksa",120,"g"),r("clear",450,"ml")],
  "rempah-coconut-fish":[r("rempah",120,"g"),r("lemongrass",15,"g")],
  "rempah-chicken-rendang":[r("rendang",120,"g"),r("lemongrass",15,"g")],
  "thai-green-chicken":[r("thai-green",30,"g")],
  "thai-red-chicken":[r("thai-red",30,"g")],
  "massaman-beef":[r("thai-red",30,"g"),r("massaman-finish",7,"g")],
  "pad-kra-pao":[r("garlic",15,"g"),r("chilli",15,"g"),r("krapow",30,"ml")],
  "pad-see-ew":[r("garlic",15,"g")],
  "beef-broccoli":[r("wok-brown",150,"ml")],
  "brown-chicken-mushroom":[r("wok-brown",150,"ml")],
  "moo-goo-gai-pan":[r("wok-white",150,"ml")],
  "white-sauce-prawns":[r("wok-white",150,"ml")],
  "wok-tofu-greenbeans":[r("wok-brown",150,"ml"),r("chilli",15,"g")],
  "teriyaki-salmon":[r("teriyaki",60,"ml")],
  "teriyaki-chicken":[r("teriyaki",60,"ml")],
  "miso-salmon":[r("miso-ginger",80,"g")],
  "miso-aubergine-tofu":[],
  "bulgogi-beef":[r("bulgogi",100,"g")],
  "gochujang-chicken":[r("gochujang",60,"g")],
  "gochujang-tofu":[r("gochujang",30,"g")],
  "beef-ragu":[r("red",180,"g"),r("blond",60,"g"),r("dark",30,"g")],
  "chicken-cacciatore":[r("red",180,"g"),r("dark",30,"g")],
  "mustard-mushroom-chicken":[r("blond",120,"g"),r("duxelles",60,"g"),r("dark",30,"g")],
  "pesto-salmon":[r("pesto",30,"g")],
  "red-shakshuka":[r("red",180,"g"),r("harissa",30,"g")],
  "harissa-chicken-traybake":[r("harissa",60,"g")],
  "harissa-chickpeas":[r("harissa",30,"g")],
  "chipotle-chicken-bowl":[r("red",90,"g"),r("chipotle",60,"g")],
  "chipotle-bean-skillet":[r("red",90,"g"),r("chipotle",30,"g")],
} as const;

export const canonicalPrepByIdV2 = new Map(canonicalPrepComponentsV2.map(component => [component.id, component]));

export function getCanonicalPrepV2(id: string): CanonicalPrepComponentV2 | undefined {
  return canonicalPrepByIdV2.get(id);
}

export function componentUnlocksV2(componentId: string): string[] {
  return Object.entries(recipePrepRequirementsV2)
    .filter(([, requirements]) => requirements.some(requirement => requirement.componentId === componentId))
    .map(([recipeId]) => recipeId);
}

export function recipePrepV2(recipeId: string): readonly RecipePrepRequirementV2[] {
  return recipePrepRequirementsV2[recipeId] ?? [];
}
