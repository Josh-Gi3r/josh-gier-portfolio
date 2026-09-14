export type SafetyTargetKind =
  | "poultry"
  | "ground-meat"
  | "fish-shellfish"
  | "whole-beef"
  | "reheat";

export type SafetyTargetV2 = Readonly<{
  kind: SafetyTargetKind;
  minimumC: number;
  restMinutes?: number;
  source: "USDA_FSIS" | "SFA";
}>;

export type RecipeSafetyProfileV2 = Readonly<{
  recipeId: string;
  targets: readonly SafetyTargetV2[];
  variantDependent?: boolean;
  cameraCanAssess: readonly string[];
  cameraCannotProve: readonly string[];
  notes?: readonly string[];
}>;

export const householdSafetyPolicyV2 = {
  refrigeratorMaxC: 4,
  freezerMaxC: -18,
  hotHoldMinC: 60,
  dangerZoneC: [5, 60] as const,
  leftoverPolicyDays: 3,
  reheatTarget: { kind:"reheat", minimumC:74, source:"USDA_FSIS" } as SafetyTargetV2,
  reheatSfaPolicy: { minimumC:75, holdSeconds:120, source:"SFA" as const },
  cooling: [
    "Cool cooked food promptly.",
    "Divide large quantities into smaller or shallow containers before refrigeration.",
    "Do not leave cooked food sitting in the 5–60°C danger zone while other prep jobs finish.",
  ] as const,
  cameraRule: "Vision may assess appearance and cooking state, but must never certify meat, poultry, fish or leftovers as safe without the required time/temperature evidence.",
} as const;

const poultry: SafetyTargetV2 = { kind:"poultry", minimumC:75, source:"SFA" };
const groundMeat: SafetyTargetV2 = { kind:"ground-meat", minimumC:75, source:"SFA" };
const fish: SafetyTargetV2 = { kind:"fish-shellfish", minimumC:63, source:"USDA_FSIS" };
const wholeBeef: SafetyTargetV2 = { kind:"whole-beef", minimumC:63, restMinutes:3, source:"USDA_FSIS" };

const genericCamera = ["browning","sauce thickness","oil separation","surface caramelisation","obvious scorching"] as const;
const neverCameraSafety = ["internal temperature","microbial safety","elapsed cold-storage safety"] as const;

const p = (recipeId:string, targets:readonly SafetyTargetV2[], notes?:readonly string[], variantDependent=false):RecipeSafetyProfileV2 => ({
  recipeId,
  targets,
  variantDependent: variantDependent || undefined,
  cameraCanAssess: genericCamera,
  cameraCannotProve: neverCameraSafety,
  notes,
});

export const recipeSafetyProfilesV2: Readonly<Record<string, RecipeSafetyProfileV2>> = {
  "gold-chicken-curry": p("gold-chicken-curry",[poultry]),
  "gold-chana-masala": p("gold-chana-masala",[]),
  "gold-punjabi-egg-curry": p("gold-punjabi-egg-curry",[],["Eggs are already hard-boiled in the canonical formulation."]),
  "gold-saag-chicken": p("gold-saag-chicken",[poultry]),
  "gold-aloo-matar": p("gold-aloo-matar",[]),
  "sambal-udang": p("sambal-udang",[fish]),
  "sambal-telur": p("sambal-telur",[],["Eggs are already hard-boiled in the canonical formulation."]),
  "curry-laksa": p("curry-laksa",[poultry,fish],["Protein branch must be explicit before cooking; chicken and prawns do not share one safety target."],true),
  "rempah-coconut-fish": p("rempah-coconut-fish",[fish]),
  "rempah-chicken-rendang": p("rempah-chicken-rendang",[poultry]),
  "thai-green-chicken": p("thai-green-chicken",[poultry]),
  "thai-red-chicken": p("thai-red-chicken",[poultry]),
  "massaman-beef": p("massaman-beef",[wholeBeef],["Tenderness will normally require a substantially longer braise than the minimum safety endpoint."]),
  "pad-kra-pao": p("pad-kra-pao",[poultry],["Canonical v2 protein is ground chicken. Pork/beef are explicit variants with their own safety target."]),
  "pad-see-ew": p("pad-see-ew",[poultry,wholeBeef],["Protein branch must be explicit before cooking."],true),
  "beef-broccoli": p("beef-broccoli",[wholeBeef]),
  "brown-chicken-mushroom": p("brown-chicken-mushroom",[poultry]),
  "moo-goo-gai-pan": p("moo-goo-gai-pan",[poultry]),
  "white-sauce-prawns": p("white-sauce-prawns",[fish]),
  "wok-tofu-greenbeans": p("wok-tofu-greenbeans",[]),
  "teriyaki-salmon": p("teriyaki-salmon",[fish]),
  "teriyaki-chicken": p("teriyaki-chicken",[poultry]),
  "miso-salmon": p("miso-salmon",[fish]),
  "miso-aubergine-tofu": p("miso-aubergine-tofu",[]),
  "bulgogi-beef": p("bulgogi-beef",[wholeBeef]),
  "gochujang-chicken": p("gochujang-chicken",[poultry]),
  "gochujang-tofu": p("gochujang-tofu",[]),
  "beef-ragu": p("beef-ragu",[groundMeat]),
  "chicken-cacciatore": p("chicken-cacciatore",[poultry]),
  "mustard-mushroom-chicken": p("mustard-mushroom-chicken",[poultry]),
  "pesto-salmon": p("pesto-salmon",[fish]),
  "red-shakshuka": p("red-shakshuka",[],["Egg doneness is a household preference; do not infer safety from a photo."]),
  "harissa-chicken-traybake": p("harissa-chicken-traybake",[poultry]),
  "harissa-chickpeas": p("harissa-chickpeas",[]),
  "chipotle-chicken-bowl": p("chipotle-chicken-bowl",[poultry]),
  "chipotle-bean-skillet": p("chipotle-bean-skillet",[]),
};

export function safetyProfileV2(recipeId:string):RecipeSafetyProfileV2|undefined {
  return recipeSafetyProfilesV2[recipeId];
}
