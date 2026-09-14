export type ChinesePantryResearchV4=Readonly<{
  id:string;
  name:string;
  role:string;
  useRule:string;
  storageRule:string;
  allergenNotes:readonly string[];
  substitution:string;
  evidence:{label:string;url:string};
  status:"researched";
}>;

/**
 * Shared pantry truth for Phase 2 Wave 1 Chinese research.
 *
 * These are culinary semantics, not brand nutrition. Sodium, sugar, allergen and kcal
 * values remain product-label sensitive. The purpose is to keep recipe research consistent
 * so light soy, dark soy, vinegar, wine and fermented sauces are not treated as generic
 * interchangeable brown liquids.
 */
export const chinesePantryResearchV4:readonly ChinesePantryResearchV4[]=[
  {
    id:"light-soy",name:"Chinese light soy sauce",role:"primary liquid seasoning; salt + fermented soy umami",
    useRule:"Use as the everyday seasoning soy. 'Light' means lighter colour/texture relative to dark soy, not lower sodium. Do not replace it blindly with Japanese dark/all-purpose soy when recipe identity matters.",
    storageRule:"Follow the bottle label; keep clean and tightly capped. Refrigeration is appropriate when the manufacturer directs it or for long-term quality.",
    allergenNotes:["soy","usually wheat/gluten; verify the purchased label"],
    substitution:"A naturally brewed Chinese regular soy is the closest intended substitute. Gluten-free tamari changes the flavour profile but can be used when dietary constraints require it.",
    evidence:{label:"The Woks of Life — Soy Sauce: Everything You Need to Know",url:"https://thewoksoflife.com/soy-sauce/"},status:"researched"
  },
  {
    id:"dark-soy",name:"Chinese dark soy sauce",role:"colour + deeper soy flavour in small amounts",
    useRule:"Use much more sparingly than light soy. It is thicker/darker and primarily deepens colour and savoury depth in rice, noodles, braises and stronger stir-fries.",
    storageRule:"Cool dry pantry is acceptable; the cited guidance notes refrigeration can greatly extend opened-bottle life. Follow the product label.",
    allergenNotes:["soy","usually wheat/gluten; verify the purchased label"],
    substitution:"Regular/light soy can replace it when necessary, but the dish will be lighter and the balance changes. Double-black/mushroom dark soy are closer substitutes.",
    evidence:{label:"The Woks of Life — Dark Soy Sauce",url:"https://thewoksoflife.com/dark-soy-sauce/"},status:"researched"
  },
  {
    id:"oyster-sauce",name:"Oyster sauce",role:"sweet-savoury body + concentrated umami",
    useRule:"Use as a seasoning sauce, especially in Cantonese/southern Chinese cooking and stir-fries. Treat it as flavour-bearing and salty rather than adding it as an invisible thickener.",
    storageRule:"Refrigerate after opening and follow the manufacturer label.",
    allergenNotes:["shellfish/oyster in conventional oyster sauce","soy/wheat may occur by brand; verify label"],
    substitution:"Vegetarian mushroom 'oyster' sauce is the preferred shellfish-free culinary branch, but it is a variant rather than an identical product.",
    evidence:{label:"The Woks of Life — Oyster Sauce",url:"https://thewoksoflife.com/oyster-sauce/"},status:"researched"
  },
  {
    id:"shaoxing-wine",name:"Shaoxing cooking wine",role:"aroma + depth in marinades, deglazing, stir-fries and braises",
    useRule:"Small stir-fry/marinade quantities add a characteristic Chinese cooking-wine depth. Cooking Shaoxing is not interchangeable with sweet mirin without reducing other sugar.",
    storageRule:"The cited source stores cooking Shaoxing well in the pantry. Keep capped and follow the product date/label.",
    allergenNotes:["commonly contains wheat/gluten; verify label","contains alcohol before cooking"],
    substitution:"Dry cooking sherry is the closest practical substitute; other Chinese rice wine, dry white wine or sake can work in small quantities with flavour trade-offs.",
    evidence:{label:"The Woks of Life — Shaoxing Wine",url:"https://thewoksoflife.com/shaoxing-wine-the-key-to-authentic-chinese-cooking/"},status:"researched"
  },
  {
    id:"sesame-oil",name:"Toasted sesame oil",role:"finishing aroma + seasoning",
    useRule:"When Home Meals says sesame oil in this Chinese lane it means toasted sesame oil. Use in small amounts for fragrance; do not treat it as the neutral high-heat frying oil.",
    storageRule:"Keep tightly capped away from heat/light and follow the product label.",
    allergenNotes:["sesame"],
    substitution:"There is no close neutral substitute for its toasted aroma. Omit if necessary rather than replacing it with the same volume of neutral oil and pretending the flavour is unchanged.",
    evidence:{label:"The Woks of Life — Sesame Oil",url:"https://thewoksoflife.com/sesame-oil/"},status:"researched"
  },
  {
    id:"chinkiang-vinegar",name:"Chinkiang / Zhenjiang black vinegar",role:"malty dark acidity + mild sweetness",
    useRule:"Use where a recipe wants the complex dark-vinegar profile. Do not use it automatically in every Chinese sweet-sour sauce simply because it is the best-known Chinese vinegar.",
    storageRule:"Store in a cool dry pantry according to the cited ingredient guidance.",
    allergenNotes:["some products may contain wheat or other grains; verify label"],
    substitution:"White rice vinegar can provide acidity in a pinch but is cleaner/lighter and not identical; balsamic is only a last-resort flavour compromise.",
    evidence:{label:"The Woks of Life — Chinese Black Vinegar",url:"https://thewoksoflife.com/chinese-black-vinegar/"},status:"researched"
  },
  {
    id:"rice-vinegar",name:"Chinese white rice vinegar",role:"clean, relatively mild acidity",
    useRule:"Use where the recipe calls for a brighter/cleaner sourness. Keep it distinct from black Chinkiang vinegar and red rice vinegar.",
    storageRule:"Store according to the bottle label in a cool dry pantry.",
    allergenNotes:["check label for grain/additive allergens"],
    substitution:"Another mild rice vinegar is the closest substitute. Black vinegar changes colour and flavour and should only be used when that trade-off is acceptable.",
    evidence:{label:"The Woks of Life — Rice Vinegar",url:"https://thewoksoflife.com/rice-vinegar/"},status:"researched"
  },
  {
    id:"hoisin",name:"Hoisin sauce",role:"thick sweet-salty fermented-bean seasoning/glaze",
    useRule:"Useful in Cantonese-style roast marinades such as char siu and selected sauces; it is not the same ingredient as sweet bean sauce or doubanjiang.",
    storageRule:"Follow the product label after opening; keep the jar clean and tightly closed.",
    allergenNotes:["soy","wheat/gluten commonly present","sesame may occur by brand; verify label"],
    substitution:"Sweet bean sauce can work in some contexts but has a different seasoning profile; do not substitute spicy doubanjiang 1:1.",
    evidence:{label:"The Woks of Life — Hoisin Sauce",url:"https://thewoksoflife.com/hoisin-sauce/"},status:"researched"
  },
  {
    id:"pixian-doubanjiang",name:"Pixian / la doubanjiang",role:"salty, spicy fermented broad-bean foundation for Sichuan dishes",
    useRule:"Frying it in oil releases its red colour and aroma. It is highly seasoned: reduce/sequence other salty ingredients accordingly. This is a defining flavour for dishes such as mapo tofu, not a generic chilli sauce.",
    storageRule:"Refrigerate after opening, use clean utensils and follow the package date.",
    allergenNotes:["broad beans/soy may be present by product","wheat/gluten may occur; verify label"],
    substitution:"A bean paste + chilli oil mixture can approximate the function in a pinch, but it is a downgrade and must not be presented as equivalent Pixian doubanjiang.",
    evidence:{label:"The Woks of Life — La Doubanjiang",url:"https://thewoksoflife.com/doubanjiang/"},status:"researched"
  },
  {
    id:"chilli-oil",name:"Chinese chilli oil",role:"heat + red-chilli aroma; condiment or cooking ingredient depending on regional dish",
    useRule:"In Sichuan food it may be a cooking ingredient as well as a condiment; in Cantonese contexts it is more often a table condiment. Chilli crisp is not automatically equivalent to plain chilli oil because commercial crisps add other solids/flavours.",
    storageRule:"For Home Meals, keep tightly sealed in the refrigerator and always use a clean utensil, matching the cited safety/storage guidance.",
    allergenNotes:["commercial chilli crisps may contain peanuts, soy, sesame or other allergens; verify label"],
    substitution:"A neutral chilli oil can stand in for another plain chilli oil. Chilli crisp is a flavour/texture variant, not a silent 1:1 truth substitution.",
    evidence:{label:"The Woks of Life — Chili Oil",url:"https://thewoksoflife.com/what-is-chili-oil/"},status:"researched"
  }
] as const;

export const chineseTechniqueRulesV4={
  wok:"Preheat a dry wok/pan adequately, stage ingredients by cook time, avoid crowding, and return pre-cooked protein only when the sauce/aromatics are ready. High heat is useful only when ingredients and mise en place are ready.",
  beef:"Slice across the grain. Where a recipe needs restaurant-style tenderness, use a recipe-specific starch/oil/water or baking-soda velveting step rather than applying one universal marinade.",
  chicken:"Where the recipe calls for velveting, coat/marinate before the high-heat cook and keep the chicken treatment separate from the final sauce.",
  roastGlaze:"Char siu uses a clean marinade before raw-meat contact and a separately managed finishing glaze. Raw-contact marinade is never returned to clean stored sauce.",
  steaming:"Steam fish over fully boiling water and use size/thickness plus thermometer truth rather than visual appearance alone. Aromatics/hot oil are finishing technique, not a safety test.",
  safety:"Home Meals uses the existing household safety policy: poultry and ground meat >=75°C; fish >=63°C; whole-cut beef >=63°C with the relevant rest/tenderness distinction. Appearance may guide quality but cannot certify internal safety."
} as const;
