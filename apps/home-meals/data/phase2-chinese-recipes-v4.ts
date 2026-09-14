export type Phase2UnitV4="g"|"ml"|"count";
export type Phase2MealWeightV4="light"|"balanced"|"hearty"|"rich";
export type Phase2IdentityV4="close_reference"|"household_adaptation"|"cuisine_inspired";
export type Phase2IngredientV4=Readonly<{id:string;name:string;qty:number;unit:Phase2UnitV4;basis:"raw"|"dry"|"fresh"|"prepared";optional?:boolean;note?:string}>;
export type Phase2PrepRequirementV4=Readonly<{componentId:string;qty:number;unit:Phase2UnitV4}>;
export type Phase2StepV4=Readonly<{instruction:string;cue?:string;warning?:string;safetyTargetC?:number}>;
export type Phase2EvidenceV4=Readonly<{label:string;url:string;role:"culinary_reference"|"technique_reference"|"safety"}>;
export type Phase2SubstitutionV4=Readonly<{from:string;to:string;grade:"good"|"acceptable"|"variant";note:string}>;
export type Phase2RecipeResearchV4=Readonly<{
  id:string;title:string;cuisine:string;occasion:"dinner"|"lunch"|"breakfast";mealWeight:Phase2MealWeightV4;format:string;
  prepStrategy:"no-base"|"mid"|"pantry-sauce"|"hybrid";identity:Phase2IdentityV4;targetServings:2;referenceMinutes:number;
  ingredients:readonly Phase2IngredientV4[];prep:readonly Phase2PrepRequirementV4[];pantryIds:readonly string[];equipment:readonly string[];
  steps:readonly Phase2StepV4[];allergens:readonly string[];substitutions:readonly Phase2SubstitutionV4[];
  nutrition:{kcalPerPerson:number;uncertaintyPct:15;status:"planning_reference";note:string};
  evidence:readonly Phase2EvidenceV4[];researchDecision:string;imageBrief:string;status:"formulation_locked";
}>;

const I=(id:string,name:string,qty:number,unit:Phase2UnitV4,basis:Phase2IngredientV4["basis"]="raw",optional=false,note?:string):Phase2IngredientV4=>({id,name,qty,unit,basis,optional:optional||undefined,note});
const P=(componentId:string,qty:number,unit:Phase2UnitV4):Phase2PrepRequirementV4=>({componentId,qty,unit});
const S=(instruction:string,cue?:string,safetyTargetC?:number,warning?:string):Phase2StepV4=>({instruction,cue,safetyTargetC,warning});
const E=(label:string,url:string,role:Phase2EvidenceV4["role"]="culinary_reference"):Phase2EvidenceV4=>({label,url,role});
const N=(kcalPerPerson:number,note:string)=>({kcalPerPerson,uncertaintyPct:15 as const,status:"planning_reference" as const,note});
const SFA=E("Singapore Food Agency — Food Safety Tips","https://www.sfa.gov.sg/food-safety-tips/safe-food-practices/food-safety-tips","safety");

/**
 * Phase 2 Wave 1A research objects.
 *
 * These ten recipes are FORMULATION_LOCKED research, not yet live catalogue objects.
 * Quantities are deliberate Home Meals two-person formulations derived from the cited
 * references and the existing component architecture. Steps are paraphrased rather than
 * copied. Final imagery waits until live-promotion work.
 */
export const phase2ChineseRecipesV4:readonly Phase2RecipeResearchV4[]=[
  {
    id:"mapo-tofu",title:"Mapo tofu",cuisine:"Chinese · Sichuan",occasion:"dinner",mealWeight:"balanced",format:"wok",prepStrategy:"mid",identity:"household_adaptation",targetServings:2,referenceMinutes:30,
    ingredients:[
      I("silken-tofu","Silken or soft tofu",400,"g","prepared"),I("ground-pork","Ground pork",120,"g"),I("garlic-fresh","Garlic",8,"g","fresh"),I("ginger-fresh","Ginger",8,"g","fresh"),
      I("sichuan-pepper","Sichuan peppercorn, finely ground",2,"g","prepared"),I("dried-red-chilli","Dried red chilli",2,"count","prepared",true),I("neutral-oil","Neutral oil",10,"ml","prepared"),
      I("chilli-oil","Chinese chilli oil",10,"ml","prepared",true),I("water-or-low-sodium-stock","Water or low-sodium stock",120,"ml","prepared"),I("cornstarch","Cornstarch",8,"g","dry"),
      I("water-slurry","Water for slurry",20,"ml","prepared"),I("sesame-oil","Toasted sesame oil",2,"ml","prepared",true),I("scallion","Scallion",20,"g","fresh"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry")
    ],
    prep:[P("douban",30,"g")],pantryIds:["chilli-oil","sesame-oil"],equipment:["wok or deep skillet","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Cook the rice separately and cube the tofu gently so it stays intact."),
      S("Bloom the fresh garlic, ginger, Sichuan pepper and optional dried chilli briefly in oil; add the ground pork and cook until no raw clumps remain."),
      S("Add DOUBAN and fry until the fermented chilli-bean aroma opens and the oil turns red.","Red aromatic oil around the pork; paste fragrant rather than raw."),
      S("Add stock/water and tofu; simmer gently without aggressively stirring so the tofu stays in cubes."),
      S("Thicken with the measured slurry only until the sauce coats the tofu; finish with scallion, optional chilli oil and sesame oil.","Glossy sauce clings around intact tofu cubes.",75,"Ground pork must reach the household ground-meat safety endpoint; appearance alone is not proof.")
    ],
    allergens:["soy","possible wheat/gluten in doubanjiang","sesame"],
    substitutions:[{from:"ground pork",to:"finely chopped mushrooms",grade:"variant",note:"Creates a vegetarian Mapo-style variant; it is not the same meat-based Sichuan formulation."},{from:"silken tofu",to:"soft tofu",grade:"good",note:"Both preserve the intended tender tofu texture."}],
    nutrition:N(520,"Rounded Home Meals reference including 50 g dry rice/person. DOUBAN and brand-sensitive sauces prevent exact sodium/nutrition until product labels and measured component output are bound."),
    evidence:[E("The Woks of Life — Mapo Tofu: The Real Deal","https://thewoksoflife.com/ma-po-tofu-real-deal/"),E("The Woks of Life — La Doubanjiang","https://thewoksoflife.com/doubanjiang/","technique_reference"),SFA],
    researchDecision:"Keep the existing DOUBAN mid, but do not pretend it is a universal Mapo sauce. Fresh Sichuan pepper remains essential. The planning-row soy/black-vinegar levers are removed because the reference identity is driven by doubanjiang, chilli and Sichuan pepper rather than generic soy/vinegar sauce.",
    imageBrief:"Sichuan mapo tofu in a shallow bowl: intact soft tofu cubes, small pork granules, glossy red chilli-bean sauce, visible red oil and scallion, rice alongside; not a thick brown takeaway gravy.",status:"formulation_locked"
  },
  {
    id:"kung-pao-chicken",title:"Kung pao chicken",cuisine:"Chinese · Sichuan",occasion:"dinner",mealWeight:"balanced",format:"wok",prepStrategy:"pantry-sauce",identity:"close_reference",targetServings:2,referenceMinutes:35,
    ingredients:[
      I("chicken-breast","Chicken breast, 2 cm cubes",350,"g"),I("roasted-peanuts","Roasted shelled peanuts",60,"g","prepared"),I("neutral-oil","Neutral oil",20,"ml","prepared"),I("cornstarch","Cornstarch",10,"g","dry"),
      I("shaoxing-wine","Shaoxing wine",5,"ml","prepared"),I("salt-fine","Salt",1,"g","prepared"),I("white-pepper","White pepper",0.5,"g","dry"),I("light-soy","Chinese light soy sauce",15,"ml","prepared"),
      I("dark-soy","Chinese dark soy sauce",2.5,"ml","prepared"),I("rice-vinegar","Rice vinegar",15,"ml","prepared"),I("sugar","Sugar",5,"g","dry"),I("water","Water",45,"ml","prepared"),
      I("garlic-fresh","Garlic",10,"g","fresh"),I("ginger-fresh","Ginger",6,"g","fresh"),I("dried-red-chilli","Dried red chillies",2,"count","prepared"),I("sichuan-pepper","Sichuan peppercorn powder",1,"g","prepared"),
      I("scallion-white","Scallion whites",40,"g","fresh"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry")
    ],
    prep:[],pantryIds:["light-soy","dark-soy","rice-vinegar","shaoxing-wine","sesame-oil"],equipment:["wok or large skillet","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Marinate the diced chicken with a small amount of oil, cornstarch, Shaoxing, salt and white pepper while the rice cooks."),
      S("Mix light soy, dark soy, rice vinegar, sugar, water and the remaining cornstarch before the wok is hot."),
      S("Sear chicken over high heat in a single layer, then remove before it dries out."),
      S("Lower heat briefly for garlic, ginger, dried chilli, Sichuan pepper and scallion whites; return chicken and raise the heat."),
      S("Stir the sauce again, add it to the wok and toss only until it turns glossy and thick; fold peanuts in at the very end.","Chicken glossy; peanuts still crisp; no puddle of sauce.",75)
    ],
    allergens:["peanut","soy","wheat/gluten in soy/Shaoxing by brand"],
    substitutions:[{from:"chicken breast",to:"boneless skinless chicken thigh",grade:"good",note:"A source-supported protein swap; thigh is more forgiving but slightly richer."},{from:"rice vinegar",to:"Chinkiang black vinegar",grade:"acceptable",note:"Adds a darker maltier profile; not the locked reference flavour."}],
    nutrition:N(700,"Rounded two-person reference including rice; peanut/oil quantity makes this an upper-balanced meal. Exact sodium is brand-sensitive."),
    evidence:[E("The Woks of Life — Kung Pao Chicken","https://thewoksoflife.com/kung-pao-chicken/"),SFA],
    researchDecision:"Correct the planning pantry from Chinkiang to rice vinegar. Preserve peanuts, dried chilli and Sichuan pepper as identity-bearing ingredients; this is a pantry-sauce meal, not another freezer mid.",
    imageBrief:"Dry-glossy Sichuan kung pao: small chicken cubes, roasted peanuts, dried red chilli pieces and scallion whites, little free sauce, served with modest white rice.",status:"formulation_locked"
  },
  {
    id:"black-pepper-beef",title:"Black pepper beef",cuisine:"Chinese · Cantonese-style",occasion:"dinner",mealWeight:"balanced",format:"wok",prepStrategy:"pantry-sauce",identity:"household_adaptation",targetServings:2,referenceMinutes:30,
    ingredients:[
      I("beef-sirloin","Sirloin, striploin or flank, sliced across the grain",300,"g"),I("bell-pepper","Bell pepper",150,"g","fresh"),I("red-onion","Red onion",75,"g","fresh"),I("garlic-fresh","Garlic",10,"g","fresh"),
      I("neutral-oil","Neutral oil",20,"ml","prepared"),I("black-pepper","Freshly ground black pepper",4,"g","dry"),I("cornstarch","Cornstarch",13,"g","dry"),I("oyster-sauce","Oyster sauce",20,"ml","prepared"),
      I("light-soy","Chinese light soy sauce",10,"ml","prepared"),I("dark-soy","Chinese dark soy sauce",5,"ml","prepared"),I("shaoxing-wine","Shaoxing wine",25,"ml","prepared"),I("water","Water",30,"ml","prepared"),
      I("sesame-oil","Toasted sesame oil",5,"ml","prepared"),I("sugar","Sugar",4,"g","dry"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry")
    ],
    prep:[],pantryIds:["light-soy","dark-soy","oyster-sauce","shaoxing-wine","sesame-oil"],equipment:["wok or heavy skillet","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Slice beef across the grain and marinate with part of the pepper, cornstarch, oyster sauce, light soy, Shaoxing, water and sesame oil."),
      S("Mix the remaining sauce ingredients before cooking; keep the final fresh black pepper separate so its aroma survives."),
      S("Sear beef fast in a very hot wok without crowding and remove while still juicy."),
      S("Stir-fry pepper, onion and garlic until crisp-tender, then add sauce and return beef."),
      S("Finish with the remaining freshly ground black pepper and toss only until the sauce coats the beef.","Pepper aroma prominent; vegetables retain shape; sauce coats rather than pools.",63,"Whole-cut beef minimum is not a cue for tenderness; apply the household rest/safety rule where practical.")
    ],
    allergens:["shellfish/oyster","soy","wheat/gluten","sesame"],
    substitutions:[{from:"sirloin/striploin/flank",to:"another tender whole beef cut sliced across the grain",grade:"good",note:"Keep slices thin and adjust cook time rather than using a stewing cut."},{from:"oyster sauce",to:"vegetarian mushroom oyster sauce",grade:"variant",note:"Removes shellfish but changes the savoury profile."}],
    nutrition:N(630,"Rounded reference including rice. Home formulation omits the source's optional red-wine flourish and keeps Shaoxing as the coherent Chinese cooking wine."),
    evidence:[E("Made With Lau — Black Pepper Beef Stir Fry","https://www.madewithlau.com/recipes/black-pepper-beef-stir-fry"),SFA],
    researchDecision:"Keep this pantry-sauce based. Fresh black pepper is the defining finish. The red wine used in the reference is not required for Home's coherent pantry and is intentionally omitted rather than adding another bottle for one recipe.",
    imageBrief:"Cantonese-style black pepper beef strips with glossy dark coating, red/green pepper and red onion, obvious coarse black pepper, no gravy lake; rice alongside.",status:"formulation_locked"
  },
  {
    id:"tomato-egg-stir-fry",title:"Tomato & egg stir-fry",cuisine:"Chinese · home-style",occasion:"dinner",mealWeight:"light",format:"wok",prepStrategy:"no-base",identity:"close_reference",targetServings:2,referenceMinutes:15,
    ingredients:[
      I("tomato-fresh","Tomatoes",500,"g","fresh"),I("egg-large","Large eggs",4,"count"),I("scallion","Scallion",20,"g","fresh"),I("salt-fine","Salt",3,"g","prepared"),I("white-pepper","White pepper",0.5,"g","dry"),
      I("sesame-oil","Toasted sesame oil",2.5,"ml","prepared"),I("shaoxing-wine","Shaoxing wine",5,"ml","prepared"),I("neutral-oil","Neutral oil",30,"ml","prepared"),I("sugar","Sugar",8,"g","dry"),I("water","Water",60,"ml","prepared"),I("jasmine-rice-dry","Jasmine rice",80,"g","dry")
    ],
    prep:[],pantryIds:["sesame-oil","shaoxing-wine"],equipment:["wok or non-stick skillet","rice cooker or saucepan"],
    steps:[
      S("Start the rice. Beat eggs with part of the seasoning and sesame oil."),
      S("Scramble eggs quickly in hot oil until just set into large soft curds; remove before they dry."),
      S("Cook tomatoes with the remaining salt and sugar until they release juice but still retain some pieces."),
      S("Add water only as needed to create a light tomato sauce; return eggs and fold gently rather than breaking the curds.","Soft egg curds surrounded by bright tomato juices; not a dry scramble."),
      S("Finish with scallion and serve immediately over the modest rice portion.")
    ],
    allergens:["egg","sesame","wheat/gluten may be present in Shaoxing"],
    substitutions:[{from:"Shaoxing wine",to:"water",grade:"acceptable",note:"For this small quantity it can be omitted/replaced with water; the aroma will be simpler."}],
    nutrition:N(465,"Rounded reference based on the source-aligned egg/tomato formula, reduced Home frying oil and 40 g dry rice/person."),
    evidence:[E("The Woks of Life — Chinese Tomato Egg Stir-fry","https://thewoksoflife.com/stir-fried-tomato-and-egg/")],
    researchDecision:"Keep genuinely no-base. Remove light soy from the planning row: the reference flavour uses tomato, egg, salt, sugar, sesame oil and a small amount of Shaoxing, not a generic soy sauce profile.",
    imageBrief:"Chinese home-style tomato egg: large soft yellow egg curds, bright red tomato wedges/juice, scallion, lightly saucy over a small white-rice portion; not omelette-style.",status:"formulation_locked"
  },
  {
    id:"char-siu-pork",title:"Char siu pork",cuisine:"Chinese · Cantonese",occasion:"dinner",mealWeight:"hearty",format:"roast",prepStrategy:"mid",identity:"household_adaptation",targetServings:2,referenceMinutes:65,
    ingredients:[
      I("pork-shoulder","Boneless pork shoulder/butt, long roasting strips",400,"g"),I("maltose-or-honey","Maltose or honey",15,"g","prepared"),I("water","Hot water for glaze",15,"ml","prepared"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry"),I("bok-choy","Bok choy or choy sum",250,"g","fresh")
    ],
    prep:[P("char-siu",60,"g")],pantryIds:["light-soy","hoisin","shaoxing-wine","sesame-oil"],equipment:["oven","sheet pan + wire rack","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Marinate the pork with the clean measured CHAR-SIU portion for at least 8 hours in the refrigerator."),
      S("Roast on a rack over a little water so drippings do not scorch; begin hot for colour, then lower the oven to finish more gently."),
      S("Turn the pork during roasting. Keep a clean portion of marinade separate from raw-meat contact; combine that clean portion with maltose/honey and hot water for glazing."),
      S("Glaze near the end and roast until deeply lacquered, watching continuously if using the broiler.","Brick-red/brown lacquer with caramelised edges, never black/bitter."),
      S("Cook to the household meat safety endpoint, rest before slicing, and serve with rice and greens.",undefined,75,"Sugar-rich glaze can burn before the centre is safe; colour is not a thermometer.")
    ],
    allergens:["soy","wheat/gluten","sesame"],
    substitutions:[{from:"pork shoulder",to:"pork neck/collar",grade:"good",note:"A well-marbled roasting cut preserves the characteristic char siu texture."},{from:"maltose",to:"honey",grade:"good",note:"Source-supported easier glaze substitute; the surface character is slightly different."}],
    nutrition:N(815,"Rounded Home Meals reference including 200 g raw pork shoulder/person, stored marinade, glaze, rice and greens; actual rendered fat creates meaningful uncertainty."),
    evidence:[E("The Woks of Life — Char Siu (Chinese BBQ Pork)","https://thewoksoflife.com/chinese-bbq-pork-cha-siu/"),SFA],
    researchDecision:"Existing CHAR-SIU mid earns its place here. Keep raw-contact marinade out of the clean jar; maltose/honey is a dinner-time finishing glaze. Planning weight moves from rich to hearty under the current two-person portion, subject to later ingredient/yield calibration.",
    imageBrief:"Cantonese char siu slices with glossy lacquer and caramelised edges, visible juicy pork grain, modest rice and green bok choy/choy sum; no neon-red artificial look required.",status:"formulation_locked"
  },
  {
    id:"char-siu-chicken",title:"Char siu chicken",cuisine:"Chinese · Cantonese-style",occasion:"dinner",mealWeight:"hearty",format:"roast",prepStrategy:"mid",identity:"household_adaptation",targetServings:2,referenceMinutes:50,
    ingredients:[
      I("chicken-thigh-bone-in","Bone-in skin-on chicken thighs",450,"g"),I("water","Water for cooked glaze",15,"ml","prepared"),I("maltose-or-honey","Maltose or honey",15,"g","prepared"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry"),I("bok-choy","Bok choy or choy sum",250,"g","fresh")
    ],
    prep:[P("char-siu",60,"g")],pantryIds:["light-soy","hoisin","shaoxing-wine","sesame-oil"],equipment:["oven","sheet pan","small saucepan","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Marinate chicken with the clean CHAR-SIU portion in the refrigerator for at least 8 hours."),
      S("Roast at moderate heat with the thighs spaced apart so the skin and exposed edges can colour rather than steam."),
      S("Any marinade that touched raw chicken must be brought to a proper simmer before it is reused as a baste; add the measured water and maltose/honey to the cooked glaze."),
      S("Baste late in the roast and continue until sticky and caramelised without scorching.","Deep glossy char-siu surface with caramelised edges."),
      S("Confirm the thickest chicken area reaches at least 75°C before serving with rice and greens.",undefined,75)
    ],
    allergens:["soy","wheat/gluten","sesame"],
    substitutions:[{from:"bone-in skin-on thighs",to:"drumsticks or leg quarters",grade:"good",note:"Source-supported dark-meat alternatives; time changes with size."},{from:"maltose",to:"honey",grade:"good",note:"Source-supported easier finishing glaze."}],
    nutrition:N(745,"Rounded reference including char-siu chicken, rice and greens; bone/skin ratio and rendered fat make this planning-level rather than calibrated nutrition."),
    evidence:[E("The Woks of Life — Char Siu Chicken","https://thewoksoflife.com/char-siu-chicken/"),SFA],
    researchDecision:"Keep the same CHAR-SIU mid but a chicken-specific roasting/safety workflow. The reference safely reuses raw-contact marinade only after simmering; Home still prefers keeping clean marinade separate when practical.",
    imageBrief:"Roasted char siu chicken thighs with mahogany-red sticky glaze and lightly blistered edges, sliced/opened to show juicy meat, served with white rice and green vegetable.",status:"formulation_locked"
  },
  {
    id:"steamed-fish-ginger-scallion",title:"Steamed fish with ginger & scallion",cuisine:"Chinese · Cantonese",occasion:"dinner",mealWeight:"light",format:"steam",prepStrategy:"pantry-sauce",identity:"close_reference",targetServings:2,referenceMinutes:30,
    ingredients:[
      I("whole-white-fish","Whole cleaned white fish such as tilapia/snapper/bass",500,"g"),I("ginger-fresh","Ginger",18,"g","fresh"),I("scallion","Scallions",3,"count","fresh"),I("coriander","Coriander",10,"g","fresh",true),I("neutral-oil","Neutral oil",15,"ml","prepared"),
      I("light-soy","Chinese light soy sauce",15,"ml","prepared"),I("dark-soy","Chinese dark soy sauce",1.5,"ml","prepared"),I("shaoxing-wine","Shaoxing or clear Chinese cooking wine",4,"ml","prepared"),I("white-pepper","White pepper",0.3,"g","dry"),I("water","Water",8,"ml","prepared"),I("sugar","Sugar",1.5,"g","dry"),I("salt-fine","Salt",1.5,"g","prepared"),I("sesame-oil","Toasted sesame oil",7.5,"ml","prepared"),I("jasmine-rice-dry","Jasmine rice",80,"g","dry")
    ],
    prep:[],pantryIds:["light-soy","dark-soy","shaoxing-wine","sesame-oil"],equipment:["steamer/wok with rack and lid","heatproof fish plate","small saucepan","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Clean and dry the fish thoroughly; make a shallow back cut on a thicker whole fish so steam reaches the thickest flesh evenly."),
      S("Steam only after the steamer is producing strong steam. Adjust time for actual fish size rather than trusting one fixed timer."),
      S("Verify the thickest edible flesh reaches the fish safety target, then discard/decant excess steaming liquid as desired.",undefined,63,"White eyes or flaking appearance can be quality cues but do not replace temperature evidence."),
      S("Top with fine fresh ginger and scallion. Heat the neutral oil until shimmering and pour carefully over the aromatics."),
      S("Finish with the pre-mixed soy/cooking-wine seasoning and sesame oil, then serve with the modest rice portion.","Delicate fish remains intact; ginger/scallion vivid and aromatic; sauce light, not a brown gravy.")
    ],
    allergens:["fish","soy","sesame","wheat/gluten may occur in soy/Shaoxing"],
    substitutions:[{from:"tilapia",to:"red snapper, striped bass or flounder",grade:"good",note:"Reference-supported whole-fish alternatives; size controls cook time."},{from:"whole fish",to:"thick fish fillets",grade:"variant",note:"Still works as steamed fish but timing/presentation change and should be treated as a variant."}],
    nutrition:N(480,"Rounded reference including a modest 40 g dry rice/person; whole-fish edible yield and sauce brands keep this approximate."),
    evidence:[E("Made With Lau — Steamed Fish with Ginger & Scallion","https://www.madewithlau.com/recipes/steamed-fish-ginger-scallion"),SFA],
    researchDecision:"Keep pantry-sauce/no-base architecture. Add dark soy and Chinese cooking wine to the planning pantry truth; the dish is defined by very fresh fish, steaming, ginger/scallion and hot-oil finish rather than a freezer base.",
    imageBrief:"Whole Cantonese steamed fish on oval plate, intact white flesh, fine ginger/scallion/coriander piled on top, glistening hot-oil finish and a shallow light soy dressing; clean, delicate presentation.",status:"formulation_locked"
  },
  {
    id:"ginger-scallion-chicken",title:"Ginger-scallion chicken",cuisine:"Chinese · Cantonese-style",occasion:"dinner",mealWeight:"balanced",format:"poach",prepStrategy:"mid",identity:"household_adaptation",targetServings:2,referenceMinutes:40,
    ingredients:[
      I("chicken-thigh","Chicken thighs or drumsticks",400,"g"),I("ginger-fresh","Ginger for poaching",15,"g","fresh"),I("scallion","Scallion for poaching/finish",2,"count","fresh"),I("light-soy","Chinese light soy sauce",15,"ml","prepared"),I("sugar","Sugar",2,"g","dry"),I("poaching-liquid","Reserved poaching liquid",60,"ml","prepared"),I("jasmine-rice-dry","Jasmine rice",100,"g","dry"),I("cucumber","Cucumber or blanched greens",200,"g","fresh")
    ],
    prep:[P("ginger-scallion",30,"g")],pantryIds:["light-soy"],equipment:["medium saucepan with lid","small saucepan","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Poach chicken gently with ginger and scallion: keep the water moving softly rather than at a hard boil."),
      S("Use covered residual heat as part of the gentle cook, but confirm the thickest chicken reaches at least 75°C before chilling/serving.","Chicken remains pale, silky and juicy rather than shredded-dry.",75),
      S("Rest briefly in cold/ice water if using the classic texture-setting method, then drain and cut or shred."),
      S("Warm light soy, sugar and reserved poaching liquid; use the pre-made GS-OIL as the ginger-scallion aromatic/fat layer rather than rebuilding a second large oil sauce."),
      S("Spoon the warm sauce and GS-OIL over the chicken; serve with rice and cucumber/greens.","Juicy pale chicken with vivid ginger-scallion topping and a light soy sheen.")
    ],
    allergens:["soy","wheat/gluten may occur in soy sauce"],
    substitutions:[{from:"chicken thighs/drumsticks",to:"chicken breast",grade:"acceptable",note:"Possible, but cook more cautiously because breast dries more easily."}],
    nutrition:N(665,"Rounded reference including rice and 30 g GS-OIL; exact GS-OIL kcal waits on measured household output/product binding."),
    evidence:[E("The Woks of Life — Poached Chicken with Ginger Scallion Sauce","https://thewoksoflife.com/poached-chicken-scallion-ginger-sauce/"),SFA],
    researchDecision:"Change the planning format from generic pan chicken to a Cantonese-style gentle poach, because it makes meaningful use of the existing GS-OIL mid and is better anchored to a coherent reference. Remove sesame oil from the planning pantry; light soy is the direct pantry seasoning.",
    imageBrief:"Cantonese-style sliced/hand-pulled poached chicken, pale juicy meat with bright minced ginger-scallion oil and a light soy sheen, cucumber or greens and white rice alongside.",status:"formulation_locked"
  },
  {
    id:"sweet-sour-chicken",title:"Sweet & sour chicken",cuisine:"Chinese-American / Cantonese restaurant-style",occasion:"dinner",mealWeight:"hearty",format:"fry + wok",prepStrategy:"pantry-sauce",identity:"household_adaptation",targetServings:2,referenceMinutes:40,
    ingredients:[
      I("chicken-breast","Chicken breast, bite-size pieces",350,"g"),I("pineapple","Pineapple",90,"g","fresh"),I("carrot","Carrot",40,"g","fresh"),I("red-pepper","Red bell pepper",70,"g","fresh"),I("onion-yellow","Onion",50,"g","fresh"),
      I("oyster-sauce","Oyster sauce",10,"ml","prepared"),I("light-soy","Chinese light soy sauce",3,"ml","prepared"),I("cornstarch","Cornstarch",35,"g","dry"),I("plain-flour","Plain flour",30,"g","dry"),I("baking-powder","Baking powder",2,"g","dry"),I("water","Water for marinade/batter/slurry",80,"ml","prepared"),
      I("ketchup","Ketchup",40,"g","prepared"),I("red-rice-vinegar","Chinese red rice vinegar",20,"ml","prepared",true,"Use rice vinegar if red vinegar is not stocked."),I("rice-vinegar","Rice vinegar",10,"ml","prepared"),I("sugar","Sugar",28,"g","dry"),I("neutral-oil-absorbed","Neutral frying oil, planning absorption allowance",25,"g","prepared",false,"Do not deduct the full fryer volume as eaten; this is a nutrition-planning allowance only."),I("jasmine-rice-dry","Jasmine rice",80,"g","dry")
    ],
    prep:[],pantryIds:["oyster-sauce","light-soy","rice-vinegar"],equipment:["wok or deep frying pan","wire rack or draining tray","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Marinate chicken briefly with oyster sauce, light soy, a little starch and water while the rice cooks."),
      S("Mix a light wet batter from flour, cornstarch, baking powder and water. Coat chicken immediately before frying."),
      S("Fry in batches so the oil temperature recovers and the coating becomes crisp rather than greasy; confirm chicken reaches at least 75°C.","Pale-golden crisp coating before sauce; batches not crowded.",75),
      S("Build the sweet-sour sauce from ketchup, red/rice vinegar and sugar. Stir-fry vegetables/pineapple briefly so they stay bright and crisp."),
      S("Thicken the sauce only enough to cling, then toss the fried chicken through at the last moment and serve immediately.","Glossy red-orange coating; crisp vegetable edges; no black-vinegar colour.")
    ],
    allergens:["shellfish/oyster","soy","wheat/gluten"],
    substitutions:[{from:"Chinese red rice vinegar",to:"rice vinegar",grade:"good",note:"Keeps the clean sweet-sour profile when red vinegar is unavailable; colour/aroma differ slightly."},{from:"oyster sauce",to:"vegetarian mushroom oyster sauce",grade:"variant",note:"Shellfish-free variant with a different savoury profile."}],
    nutrition:N(760,"Rounded planning estimate including batter, an oil-absorption allowance and a modest rice side. Frying absorption is inherently variable, so calibrated nutrition needs an observed household cook."),
    evidence:[E("Made With Lau — Sweet and Sour Chicken","https://www.madewithlau.com/recipes/sweet-and-sour-chicken"),E("The Woks of Life — Rice Vinegar","https://thewoksoflife.com/rice-vinegar/","technique_reference"),SFA],
    researchDecision:"Correct the planning row: this formulation uses red/rice vinegar, not Chinkiang black vinegar. Keep it as an occasional hearty fried meal; do not distort the dish into a generic brown Chinese sauce to reuse pantry stock.",
    imageBrief:"Crisp battered chicken pieces just glazed in bright red-orange sweet-sour sauce with pineapple, red pepper, carrot and onion; sauce clings without drowning the crust; small rice portion.",status:"formulation_locked"
  },
  {
    id:"garlic-aubergine",title:"Garlic aubergine",cuisine:"Chinese · restaurant-style",occasion:"dinner",mealWeight:"balanced",format:"wok",prepStrategy:"pantry-sauce",identity:"household_adaptation",targetServings:2,referenceMinutes:35,
    ingredients:[
      I("chinese-eggplant","Chinese or Japanese aubergine",450,"g","fresh"),I("ground-pork","Ground pork",100,"g", "raw"),I("garlic-fresh","Garlic, divided",18,"g","fresh"),I("ginger-fresh","Ginger",6,"g","fresh"),I("dried-red-chilli","Dried red chillies",3,"count","prepared",true),I("scallion","Scallion",20,"g","fresh"),
      I("neutral-oil","Neutral oil",30,"ml","prepared"),I("water","Hot water",60,"ml","prepared"),I("sugar","Sugar",6,"g","dry"),I("cornstarch","Cornstarch",5,"g","dry"),I("oyster-sauce","Oyster sauce",11,"ml","prepared"),I("rice-vinegar","Rice vinegar",7.5,"ml","prepared"),I("shaoxing-wine","Shaoxing wine",7.5,"ml","prepared"),I("light-soy","Chinese light soy sauce",7.5,"ml","prepared"),I("sesame-oil","Toasted sesame oil",2.5,"ml","prepared"),I("dark-soy","Chinese dark soy sauce",1.5,"ml","prepared"),I("white-pepper","White pepper",0.2,"g","dry"),I("jasmine-rice-dry","Jasmine rice",90,"g","dry")
    ],
    prep:[],pantryIds:["oyster-sauce","rice-vinegar","shaoxing-wine","light-soy","sesame-oil","dark-soy"],equipment:["wok or wide skillet","rice cooker or saucepan","digital thermometer"],
    steps:[
      S("Mix the sauce before cooking: hot water, sugar, cornstarch, oyster sauce, rice vinegar, Shaoxing, light/dark soy, sesame oil and white pepper."),
      S("Sear aubergine in measured oil until browned and collapsing-tender; add a little water/cover briefly only if needed to finish the centres without adding more oil.","Tender centres with browned edges; not oil-soaked deep-fried pieces."),
      S("Remove aubergine. Fry ground pork with ginger, chilli and half the garlic until the pork reaches at least 75°C.",undefined,75),
      S("Return aubergine, stir the sauce again and add it; add the remaining garlic so the finished dish retains fresh garlic aroma."),
      S("Cook only until the sauce turns glossy and coats the aubergine; finish with scallion and serve over rice.","Very tender aubergine, glossy savoury-tangy sauce, distinct garlic aroma.")
    ],
    allergens:["shellfish/oyster","soy","wheat/gluten","sesame"],
    substitutions:[{from:"ground pork",to:"ground dark-meat chicken/turkey",grade:"good",note:"Reference-supported alternative with a lighter flavour."},{from:"ground pork",to:"omit and use vegetarian oyster sauce",grade:"variant",note:"Creates the meat-free variant; adjust salt/umami to taste rather than pretending no change."},{from:"Chinese/Japanese aubergine",to:"globe aubergine",grade:"acceptable",note:"Works but takes longer because the skin/flesh are thicker."}],
    nutrition:N(520,"Rounded reference including the measured Home oil amount, pork and 45 g dry rice/person. Brand-sensitive sauces remain approximate."),
    evidence:[E("The Woks of Life — Chinese Eggplant with Garlic Sauce","https://thewoksoflife.com/chinese-eggplant-garlic-sauce/"),SFA],
    researchDecision:"Keep the safer title Garlic Aubergine rather than calling it fish-fragrant aubergine; the reference itself distinguishes the two. Correct Chinkiang to rice vinegar and add oyster sauce + Shaoxing to pantry truth. Canonical Home dinner keeps a modest 100 g ground-pork addition for protein; a vegetarian variant remains explicit.",
    imageBrief:"Long Chinese/Japanese aubergine pieces collapsed-tender with browned purple edges, glossy garlic sauce, small pork granules, dried chilli/scallion; sauce ample enough for rice but not greasy/deep-fried-looking.",status:"formulation_locked"
  }
] as const;

export const phase2ChineseRecipeByIdV4=new Map(phase2ChineseRecipesV4.map(x=>[x.id,x]));
