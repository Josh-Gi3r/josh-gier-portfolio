import { recipePrepV2 } from "./food-truth-v2";
import { getCanonicalRecipeV2 } from "./recipe-truth-v2";
import { safetyProfileV2 } from "./food-safety-v2";
import type { QuantityUnit } from "./food-quantity";

export type RecipeIngredientV2=Readonly<{
  ingredientId:string;
  name:string;
  qty:number;
  unit:QuantityUnit;
  basis:"raw"|"dry"|"drained"|"fresh"|"prepared";
  optional?:boolean;
  note?:string;
}>;
export type RecipeStepV2=Readonly<{
  instruction:string;
  timerMinutes?:number;
  visualCue?:string;
  warningCue?:string;
  safetyTargetC?:number;
  cameraAssessable:boolean;
}>;
export type CanonicalDinnerFormulationV2=Readonly<{
  recipeId:string;
  targetServings:2;
  prep:ReturnType<typeof recipePrepV2>;
  ingredients:readonly RecipeIngredientV2[];
  equipment:readonly string[];
  steps:readonly RecipeStepV2[];
  actualFinishedWeightG:null;
  actualServings:null;
  actualCookMinutes:null;
}>;

const i=(ingredientId:string,name:string,qty:number,unit:QuantityUnit,basis:RecipeIngredientV2["basis"]="raw",optional=false,note?:string):RecipeIngredientV2=>({ingredientId,name,qty,unit,basis,optional:optional||undefined,note});
const s=(instruction:string,cameraAssessable=true,visualCue?:string,safetyTargetC?:number,warningCue?:string):RecipeStepV2=>({instruction,cameraAssessable,visualCue,safetyTargetC,warningCue});
const R=(recipeId:string,ingredients:readonly RecipeIngredientV2[],equipment:readonly string[],steps:readonly RecipeStepV2[]):CanonicalDinnerFormulationV2=>({recipeId,targetServings:2,prep:recipePrepV2(recipeId),ingredients,equipment,steps,actualFinishedWeightG:null,actualServings:null,actualCookMinutes:null});
const CHICKEN=74,FISH=63,WHOLE_BEEF=63,GROUND_MEAT=71;

/** Canonical two-person formulations. Quantities are Home Meals formulation decisions, not claimed household appetite observations. */
export const canonicalDinnerFormulationsV2:readonly CanonicalDinnerFormulationV2[]=[
R("gold-chicken-curry",[
 i("chicken-thigh","Boneless skinless chicken thigh",400,"g"),i("neutral-oil","Neutral oil or ghee",15,"ml"),i("cumin-seed","Cumin seeds",2,"g"),i("garam-masala","Garam masala",2,"g"),i("kashmiri-chilli","Mild Kashmiri chilli or paprika",2,"g"),i("water","Water",100,"ml"),i("coriander","Fresh coriander",15,"g","fresh"),i("basmati-rice-dry","Basmati rice",120,"g","dry")
],["26–28 cm sauté pan or deep skillet","rice cooker or saucepan","digital thermometer"],[
 s("Cook the rice separately."),s("Bloom cumin in the hot fat until aromatic.",true,"Seeds fragrant, not black."),s("Brown chicken lightly and bloom the remaining dry spices briefly.",true,"Chicken lightly browned; spices aromatic, not scorched."),s("Add GOLD and water; simmer until the sauce clings and the thickest chicken piece reaches the safety target.",true,"Glossy masala coats the chicken rather than pooling.",CHICKEN),s("Finish with coriander and season only after tasting the GOLD-based sauce.",false)
]),
R("gold-chana-masala",[
 i("chickpeas-drained","Canned chickpeas, drained",240,"g","drained"),i("neutral-oil","Neutral oil",15,"ml"),i("roasted-cumin","Roasted cumin powder",2,"g"),i("garam-masala","Garam masala",2,"g"),i("amchur","Amchur",2,"g"),i("water","Water",120,"ml"),i("coriander","Fresh coriander",15,"g","fresh"),i("lemon","Lemon",30,"g","fresh")
],["saucepan or deep skillet"],[s("Warm GOLD in oil until sizzling."),s("Add chickpeas, cumin, garam masala, amchur and water."),s("Simmer, crushing a few chickpeas to thicken.",true,"Sauce thick enough to coat chickpeas."),s("Finish with coriander and lemon; the final acidity is part of the dish, not decorative.",false)]),
R("gold-punjabi-egg-curry",[
 i("egg-large","Large eggs, hard-boiled",4,"count","prepared"),i("neutral-oil","Neutral oil",15,"ml"),i("green-chilli","Green chilli",1,"count","fresh"),i("garam-masala","Garam masala",2,"g"),i("paprika","Paprika",2,"g"),i("water","Water",120,"ml"),i("coriander","Fresh coriander",10,"g","fresh")
],["saucepan or deep skillet"],[s("Optional but better textured: lightly score and blister the peeled eggs in a little of the measured oil; remove."),s("Warm remaining oil and sliced green chilli."),s("Add GOLD, spices and water; simmer until glossy.",true,"Sauce glossy and no watery separation."),s("Return the eggs and coat for several minutes."),s("Finish with coriander.",false)]),
R("gold-saag-chicken",[
 i("chicken-thigh","Boneless skinless chicken thigh",400,"g"),i("neutral-oil","Ghee or neutral oil",15,"ml"),i("garam-masala","Garam masala",2,"g"),i("kasuri-methi","Kasuri methi",2,"g"),i("water","Water",80,"ml"),i("yoghurt","Plain yoghurt",80,"g","prepared"),i("lemon","Lemon",30,"g","fresh")
],["deep skillet","digital thermometer"],[s("Brown chicken in fat with garam masala."),s("Add GOLD and water and simmer briefly."),s("Add SAAG and continue gently until chicken reaches the safety target.",true,"Green sauce thick and clinging.",CHICKEN),s("Crush kasuri methi between your palms and stir it through. Lower heat before adding yoghurt; finish with lemon.",true,"Yoghurt stays smooth rather than splitting.")]),
R("gold-aloo-matar",[
 i("potato","Potatoes, 2 cm cubes",350,"g"),i("peas","Frozen peas",180,"g"),i("neutral-oil","Neutral oil",15,"ml"),i("roasted-cumin","Roasted cumin",2,"g"),i("garam-masala","Garam masala",2,"g"),i("water","Water",200,"ml"),i("coriander","Fresh coriander",10,"g","fresh")
],["saucepan with lid"],[s("Warm GOLD in oil with cumin and garam masala."),s("Add potato and water; cover and simmer until nearly tender."),s("Add peas for the final few minutes."),s("Reduce uncovered until sauce coats the vegetables.",true,"Potatoes tender; sauce thick, not soupy.")]),

R("sambal-udang",[
 i("prawns","Large prawns, peeled and deveined",320,"g"),i("neutral-oil","Neutral oil",5,"ml"),i("water","Water",30,"ml"),i("makrut-lime","Makrut lime leaves",2,"count","fresh"),i("cucumber","Cucumber",200,"g","fresh"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok or wide skillet","rice cooker or saucepan","digital thermometer"],[s("Start the rice. Pat prawns dry."),s("Sear prawns briefly and remove before fully finished.",true,"Surface opaque with some translucency remaining inside."),s("Warm SAMBAL until sizzling; add water and torn makrut leaves."),s("Return prawns only until firm and at the safety target.",true,"Prawns pearly and opaque, not tightly curled/rubbery.",FISH),s("Serve immediately with rice and cold cucumber.",false)]),
R("sambal-telur",[
 i("egg-large","Large eggs, hard-boiled",4,"count","prepared"),i("onion-yellow","Onion, cut into rings",100,"g","fresh"),i("neutral-oil","Neutral oil",5,"ml"),i("cucumber","Cucumber",200,"g","fresh"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok or skillet","rice cooker or saucepan"],[s("Cook the rice separately."),s("Optional: lightly blister the peeled eggs in the measured oil, then remove."),s("Add onion rings and SAMBAL; sauté until the onion is translucent and coated."),s("Return eggs and coat for several minutes."),s("Serve with cucumber and rice.",false)]),
R("curry-laksa",[
 i("coconut-milk","Full-fat coconut milk",300,"ml","prepared"),i("rice-noodles","Rice noodles",240,"g","fresh"),i("prawns","Prawns, peeled/deveined",300,"g"),i("tofu-puffs","Tofu puffs",8,"count","prepared"),i("bean-sprouts","Bean sprouts",150,"g","fresh"),i("lime","Lime",1,"count","fresh")
],["large saucepan","separate noodle pot","digital thermometer"],[s("Warm LAKSA concentrate until aromatic."),s("Add CLEAR and coconut milk; simmer to combine."),s("Cook prawns in the broth only until the safety target, then add tofu puffs.",true,"Broth emulsified; prawns opaque and just firm.",FISH),s("Divide cooked noodles and sprouts between bowls; ladle broth over and finish with lime.",false)]),
R("rempah-coconut-fish",[
 i("white-fish","White fish fillets",400,"g"),i("coconut-milk","Coconut milk",220,"ml","prepared"),i("water","Water",120,"ml"),i("green-beans","Green beans",180,"g","fresh"),i("fish-sauce","Fish sauce",10,"ml","prepared"),i("lime","Lime",1,"count","fresh"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wide saucepan","rice cooker or saucepan","digital thermometer"],[s("Cook rice separately."),s("Fry REMPAH and LE briefly until aromatic."),s("Add coconut milk and water; simmer."),s("Add beans, then nestle fish into the sauce and cook gently to the safety target.",true,"Fish flakes at edges but remains moist.",FISH),s("Finish with fish sauce and lime.",false)]),
R("rempah-chicken-rendang",[
 i("chicken-thigh","Chicken thighs",500,"g"),i("coconut-milk","Coconut milk",300,"ml","prepared"),i("desiccated-coconut","Toasted desiccated coconut / kerisik",35,"g","prepared"),i("makrut-lime","Makrut lime leaves",3,"count","fresh"),i("tamarind","Tamarind",5,"g","prepared"),i("palm-sugar","Palm sugar",5,"g")
],["wide heavy pan or Dutch oven","digital thermometer"],[s("Fry RENDANG concentrate and LE until fragrant."),s("Add chicken and coat thoroughly."),s("Add coconut milk and lime leaves; simmer uncovered."),s("Add kerisik, tamarind and palm sugar; continue reducing until the sauce clings and chicken is safe.",true,"Sauce deeply reduced and coating the chicken, not a coconut soup.",CHICKEN)]),

R("thai-green-chicken",[
 i("chicken-thigh","Boneless skinless chicken thigh",300,"g"),i("coconut-milk","Full-fat coconut milk",300,"ml","prepared"),i("water","Water",120,"ml"),i("thai-eggplant","Thai eggplant",200,"g","fresh"),i("fish-sauce","Fish sauce",15,"ml","prepared"),i("palm-sugar","Palm sugar",8,"g"),i("makrut-lime","Makrut lime leaves",3,"count","fresh"),i("thai-basil","Thai basil",30,"g","fresh"),i("red-pepper","Red pepper",50,"g","fresh"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["saucepan","rice cooker or saucepan","digital thermometer"],[s("Cook the rice separately."),s("Reduce some thick coconut milk until concentrated; fry THAI-G in the coconut fat."),s("Add chicken, remaining coconut milk, water, palm sugar, fish sauce and makrut leaves."),s("Add eggplant near the end and cook chicken to the safety target.",true,"Controlled oil separation is acceptable; eggplant tender but intact.",CHICKEN),s("Remove from heat and fold in basil and red pepper.",true,"Basil just wilted, still aromatic.")]),
R("thai-red-chicken",[
 i("chicken-thigh","Boneless skinless chicken thigh",400,"g"),i("coconut-milk","Full-fat coconut milk",400,"ml","prepared"),i("pumpkin","Kabocha or pumpkin",300,"g"),i("fish-sauce","Fish sauce",22.5,"ml","prepared"),i("palm-sugar","Palm sugar",5,"g"),i("thai-basil","Thai basil",15,"g","fresh"),i("makrut-lime","Makrut lime leaves",3,"count","fresh")
],["saucepan","digital thermometer"],[s("Fry THAI-R in concentrated coconut cream until aromatic."),s("Add chicken and coat in paste."),s("Add remaining coconut milk, pumpkin and makrut leaves; simmer until pumpkin is tender and chicken is safe.",true,"Pumpkin tender but not collapsed; sauce aromatic with light oil separation.",CHICKEN),s("Balance with fish sauce and palm sugar; finish with basil.")]),
R("massaman-beef",[
 i("beef-chuck","Beef chuck, 3 cm cubes",500,"g"),i("coconut-milk","Coconut milk",400,"ml","prepared"),i("potato","Potatoes",300,"g"),i("onion-yellow","Onion",150,"g"),i("peanuts","Roasted peanuts",35,"g"),i("tamarind","Tamarind",15,"ml","prepared"),i("fish-sauce","Fish sauce",22.5,"ml","prepared"),i("palm-sugar","Palm sugar",12,"g")
],["Dutch oven or heavy saucepan","digital thermometer"],[s("Brown beef well."),s("Fry THAI-R and MASS briefly, then add coconut milk and beef."),s("Braise gently until beef begins to tenderise; then add potato and onion."),s("Finish with tamarind, fish sauce, palm sugar and peanuts; reduce until rich.",true,"Beef tender and sauce rich; safety minimum is not the same as tenderness.",WHOLE_BEEF)]),
R("pad-kra-pao",[
 i("ground-chicken","Ground chicken thigh",350,"g"),i("holy-basil","Holy basil leaves",35,"g","fresh"),i("egg-large","Large eggs",2,"count"),i("neutral-oil","Neutral oil",20,"ml"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok","small frying pan for eggs","rice cooker or saucepan","digital thermometer"],[s("Start rice and fry eggs separately to the preferred doneness."),s("Heat wok very hot; fry G and CH briefly."),s("Add ground chicken and cook quickly without drying it out."),s("Add KRAPOW and toss until glossy; cook chicken to the safety target.",true,"No watery pool; seasoning coats the meat.",CHICKEN),s("Turn off heat and fold in holy basil only until wilted.",true,"Basil vivid and just collapsed.")]),
R("pad-see-ew",[
 i("rice-noodles","Fresh wide rice noodles",450,"g","fresh"),i("chicken-thigh","Chicken thigh, thinly sliced",225,"g"),i("gai-lan","Gai lan",150,"g","fresh"),i("egg-large","Large eggs",2,"count"),i("oyster-sauce","Oyster sauce",30,"ml","prepared"),i("soy-sauce","Light soy sauce",15,"ml","prepared"),i("fish-sauce","Fish sauce",7,"ml","prepared"),i("dark-soy","Dark soy sauce",10,"ml","prepared"),i("sugar","Sugar",20,"g"),i("neutral-oil","Neutral oil",45,"ml")
],["wok","digital thermometer"],[s("Sear chicken and remove once safely cooked; keep it tender.",true,"Chicken browned but not dry.",CHICKEN),s("Cook noodles in small batches so the wok stays hot."),s("Add G, egg, gai lan, noodles and sauce; let noodles sit briefly against the wok instead of constantly stirring.",true,"Noodles blister/char in spots rather than steaming into a soft mass."),s("Return chicken and toss only to combine.")]),

R("beef-broccoli",[
 i("beef-flank","Flank or sirloin beef, thinly sliced across grain",300,"g"),i("broccoli","Broccoli florets",300,"g","fresh"),i("water","Water for beef hydration",15,"ml"),i("baking-soda","Baking soda",1,"g"),i("cornstarch","Cornstarch for beef",4,"g"),i("oyster-sauce","Oyster sauce for beef",5,"ml","prepared"),i("neutral-oil","Neutral oil",20,"ml"),i("water","Water for sauce adjustment",30,"ml"),i("cornstarch","Cornstarch for slurry",8,"g"),i("water","Water for slurry",15,"ml"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok or large skillet","saucepan/kettle for blanching","rice cooker","digital thermometer"],[s("Hydrate/velvet beef with water, baking soda, cornstarch, oyster sauce and part of the oil; rest chilled."),s("Blanch broccoli briefly until vivid green and crisp-tender; drain very well."),s("Sear beef hard in a very hot wok; remove once at the whole-cut safety target.",true,"Good sear, no grey steaming pool.",WHOLE_BEEF),s("Add WOK-B and water, simmer, then add slurry only until lightly glossy."),s("Return beef and broccoli and toss briefly.",true,"Glossy sauce, broccoli still crisp-tender.")]),
R("brown-chicken-mushroom",[
 i("chicken-thigh","Chicken thigh, thinly sliced",350,"g"),i("mushroom","Mushrooms",250,"g","fresh"),i("spring-onion","Spring onions",45,"g","fresh"),i("neutral-oil","Neutral oil",20,"ml"),i("cornstarch","Cornstarch, total for chicken + slurry",12,"g"),i("water","Water, total for chicken + slurry",30,"ml"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok","rice cooker","digital thermometer"],[s("Massage chicken with roughly half the measured water, 4 g of the cornstarch and a small spoon of the oil; rest about 20 minutes chilled."),s("Sear chicken in a very hot wok and remove once at the safety target.",true,"Chicken tender with light browning, not a grey steaming pool.",CHICKEN),s("Brown mushrooms until released water is gone."),s("Add WOK-B and bring to a simmer; use the remaining cornstarch and water as a light slurry."),s("Return chicken and finish with spring onion.",true,"Mushrooms browned and sauce glossy, not watery.")]),
R("moo-goo-gai-pan",[
 i("chicken-thigh","Chicken thigh, thinly sliced",300,"g"),i("mushroom","Mushrooms",180,"g","fresh"),i("bok-choy","Bok choy",200,"g","fresh"),i("carrot","Carrot",80,"g","fresh"),i("bamboo-shoots","Bamboo shoots",80,"g","prepared"),i("water-chestnuts","Water chestnuts",80,"g","prepared"),i("shaoxing-wine","Shaoxing wine",15,"ml","prepared"),i("neutral-oil","Neutral oil",20,"ml"),i("cornstarch","Cornstarch for slurry",8,"g"),i("water","Water for slurry",15,"ml")
],["wok","digital thermometer"],[s("Velvet or lightly marinate chicken, sear and remove while still tender; final cooking happens after it returns to the wok."),s("Stir-fry mushrooms, bamboo shoots and water chestnuts, then add bok choy and carrot until crisp-tender."),s("Add Shaoxing wine, then WOK-W and simmer briefly; thicken lightly with slurry."),s("Return chicken and cook through to the safety target, tossing only until coated.",true,"Pale glossy sauce and crisp vegetables.",CHICKEN)]),
R("white-sauce-prawns",[
 i("prawns","Prawns, peeled/deveined",350,"g"),i("bok-choy","Bok choy or choy sum",300,"g","fresh"),i("mushroom","Mushrooms",120,"g","fresh"),i("neutral-oil","Neutral oil",15,"ml"),i("cornstarch","Cornstarch for slurry",8,"g"),i("water","Water for slurry",15,"ml"),i("white-pepper","White pepper",1,"g")
],["wok","digital thermometer"],[s("Sear prawns quickly and remove before overcooking."),s("Stir-fry vegetables and mushrooms until just tender."),s("Add WOK-W and thicken lightly with slurry."),s("Return prawns only until the safety target; finish with white pepper.",true,"Prawns pearly and just firm; sauce pale and glossy.",FISH)]),
R("wok-tofu-greenbeans",[
 i("tofu","Firm tofu, pressed and cubed",350,"g","prepared"),i("green-beans","Green beans",300,"g","fresh"),i("neutral-oil","Neutral oil",30,"ml"),i("cornstarch","Cornstarch",12,"g"),i("sesame-seed","Sesame seeds",3,"g"),i("jasmine-rice-dry","Jasmine rice",120,"g","dry")
],["wok","rice cooker"],[s("Dust tofu lightly with cornstarch and crisp in oil; remove."),s("Blister green beans in the same wok."),s("Add WOK-B and CH and reduce briefly."),s("Return tofu and toss until glazed; finish with sesame.",true,"Tofu crisp-edged and beans blistered, sauce clinging.")]),

R("teriyaki-salmon",[
 i("salmon","Skin-on salmon fillets",340,"g"),i("flour-plain","Plain flour",12,"g"),i("neutral-oil","Neutral oil",7,"ml"),i("butter-unsalted","Unsalted butter",14,"g"),i("sake","Sake",15,"ml"),i("broccoli","Broccoli",250,"g","fresh"),i("jasmine-rice-dry","Rice",120,"g","dry")
],["frying pan with lid","rice cooker","digital thermometer"],[s("Cook rice and broccoli separately."),s("Lightly flour salmon and sear skin-side first, then the second side."),s("Add sake, cover and steam gently until salmon reaches the safety target.",true,"Salmon just opaque/flaking at edges; use thermometer for safety.",FISH),s("Remove fish, reduce TERI in the pan and glaze the salmon.",true,"Glossy glaze, not burnt syrup.")]),
R("teriyaki-chicken",[
 i("chicken-thigh","Boneless chicken thighs",400,"g"),i("neutral-oil","Neutral oil",5,"ml"),i("sake","Sake",15,"ml"),i("broccoli","Cabbage or broccoli",250,"g","fresh"),i("jasmine-rice-dry","Rice",120,"g","dry")
],["frying pan","rice cooker","digital thermometer"],[s("Cook rice and vegetables separately."),s("Score thick areas of chicken for even cooking."),s("Pan-fry until browned and the thickest portion reaches the safety target.",true,"Good browning; use thermometer for safety.",CHICKEN),s("Remove excess fat, add TERI and reduce to a glossy glaze.",true,"Sauce clings without burning.")]),
R("miso-salmon",[
 i("salmon","Salmon fillets",340,"g"),i("mushroom","Mushrooms",150,"g","fresh"),i("broccoli","Broccoli",200,"g","fresh"),i("jasmine-rice-dry","Rice",120,"g","dry")
],["oven/broiler or air fryer","sheet pan","digital thermometer"],[s("Coat salmon with MISO-G and marinate 1–2 hours refrigerated; avoid an overnight marinade because miso/soy can become overly salty."),s("Wipe off heavy excess surface marinade to reduce burning."),s("Broil/bake until caramelised and salmon reaches the safety target.",true,"Caramelised surface, not blackened miso.",FISH),s("Cook mushrooms and broccoli alongside or separately; serve with rice.")]),
R("miso-aubergine-tofu",[
 i("aubergine","Aubergine",500,"g"),i("tofu","Firm tofu",300,"g","prepared"),i("sesame-oil","Sesame oil",15,"ml"),i("white-miso","White or red miso",65,"g","prepared"),i("sake","Sake",30,"ml","prepared"),i("mirin","Mirin",30,"ml","prepared"),i("sugar","Sugar",20,"g"),i("spring-onion","Spring onion",30,"g","fresh"),i("sesame-seed","Sesame seeds",5,"g"),i("jasmine-rice-dry","Rice",100,"g","dry")
],["oven or air fryer","small saucepan","frying pan optional"],[s("Press tofu. Score aubergine and roast until nearly tender."),s("Crisp tofu in a pan or air fryer."),s("For the dengaku-style glaze, combine sake, mirin, miso and sugar over very low heat for 2–3 minutes, stirring constantly until thickened; do not burn the miso."),s("Brush aubergine and tofu with the sweet miso glaze and return to high heat until caramelised.",true,"Aubergine soft inside; glaze caramelised but not blackened."),s("Finish with spring onion and sesame; serve with rice.")]),
R("bulgogi-beef",[
 i("beef-sirloin","Thinly sliced sirloin/hotpot beef",350,"g"),i("onion-yellow","Onion, thinly sliced",75,"g","fresh"),i("spring-onion","Spring onion",30,"g","fresh"),i("sesame-seed","Sesame seeds",5,"g"),i("jasmine-rice-dry","Rice",120,"g","dry")
],["very hot skillet or grill","rice cooker","digital thermometer"],[s("Marinate beef in BUL for at least 30 minutes in the refrigerator."),s("Heat skillet/grill very hot and cook beef and onion in a thin layer so they caramelise rather than steam."),s("Cook to the whole-cut safety target, then finish with spring onion and sesame.",true,"Edges browned and caramelised, no wet steaming pool.",WHOLE_BEEF),s("Serve with rice; lettuce-wrap variant is modeled separately.")]),
R("gochujang-chicken",[
 i("chicken-thigh","Chicken thighs",450,"g"),i("cauliflower","Cauliflower",300,"g","fresh"),i("sweet-potato","Sweet potato",250,"g"),i("neutral-oil","Neutral oil",15,"ml"),i("sesame-seed","Sesame seeds",5,"g"),i("spring-onion","Spring onion",30,"g","fresh")
],["sheet pan","oven","digital thermometer"],[s("Start roasting vegetables with oil."),s("Coat chicken in GOCHU and add to the tray."),s("Roast until chicken reaches the safety target and edges caramelise.",true,"Chicken glazed/caramelised; vegetables browned.",CHICKEN),s("Finish with sesame and spring onion.")]),
R("gochujang-tofu",[
 i("tofu","Firm tofu",350,"g","prepared"),i("broccoli","Broccoli",300,"g","fresh"),i("cornstarch","Cornstarch",12,"g"),i("neutral-oil","Neutral oil",15,"ml"),i("jasmine-rice-dry","Rice",100,"g","dry"),i("sesame-seed","Sesame seeds",5,"g")
],["air fryer or frying pan","rice cooker"],[s("Press/cube tofu, dust with cornstarch and crisp until golden."),s("Steam or stir-fry broccoli until crisp-tender."),s("Warm GOCHU with a measured splash of water and glaze tofu."),s("Serve with broccoli and rice; finish with sesame.",true,"Tofu crisp-edged before glaze; sauce glossy.")]),

R("beef-ragu",[
 i("beef-mince","Beef mince",350,"g"),i("olive-oil","Olive oil",5,"ml"),i("red-wine","Dry red wine",80,"ml","prepared",true),i("pasta","Spaghetti or rigatoni",180,"g","dry"),i("parmesan","Parmesan",25,"g","prepared")
],["wide pan","pasta pot","digital thermometer"],[s("Brown beef hard until fond develops and ground meat reaches the safety target.",true,"Deep browning, no grey watery mince.",GROUND_MEAT),s("Deglaze with wine or the alcohol-free variant liquid."),s("Add RED, BLOND and DARK; simmer until concentrated."),s("Toss with cooked pasta and pasta water; finish with Parmesan.",true,"Sauce clings to pasta.")]),
R("chicken-cacciatore",[
 i("chicken-thigh","Boneless skinless chicken thighs",450,"g"),i("olive-oil","Olive oil",10,"ml"),i("red-pepper","Red bell pepper",150,"g","fresh"),i("mushroom","Mushrooms",180,"g","fresh"),i("red-wine","Dry red wine",60,"ml","prepared"),i("rosemary","Rosemary",2,"g","fresh"),i("oregano-dried","Dried oregano",1,"g","prepared"),i("bay-leaf","Bay leaf",1,"count","prepared"),i("kalamata-olives","Kalamata olives, pitted",60,"g","prepared"),i("parsley","Parsley",10,"g","fresh"),i("black-pepper","Black pepper",1,"g"),i("potato","Baby potatoes",300,"g")
],["wide covered pan","pot for potatoes","digital thermometer"],[s("Cook potatoes concurrently."),s("Brown chicken deeply and remove."),s("Brown mushrooms until moisture has largely evaporated; soften pepper."),s("Deglaze with wine and reduce, then add RED, DARK, rosemary, oregano and bay."),s("Return chicken, braise gently to the safety target, then uncover, add olives and reduce until the sauce coats.",true,"Sauce coats; chicken browned and tender; olives integrated rather than raw-tasting.",CHICKEN),s("Remove bay leaf and finish with parsley and black pepper.")]),
R("mustard-mushroom-chicken",[
 i("chicken-thigh","Boneless skinless chicken thighs",400,"g"),i("neutral-oil","Neutral oil",10,"ml"),i("mushroom","Fresh mushrooms",150,"g","fresh"),i("dijon","Dijon mustard",20,"g","prepared"),i("wholegrain-mustard","Wholegrain mustard",10,"g","prepared"),i("cream","Cooking cream, ~20% fat",80,"ml","prepared"),i("water","Water",80,"ml"),i("tarragon","Fresh tarragon",2,"g","fresh",true),i("parsley","Parsley",10,"g","fresh"),i("black-pepper","Black pepper",1,"g"),i("potato","Baby potatoes",300,"g"),i("green-beans","Green beans",200,"g","fresh")
],["wide skillet","pot/steamer for sides","digital thermometer"],[s("Cook potatoes and green beans alongside the main."),s("Sear chicken deeply and remove."),s("Brown mushrooms until their water is gone."),s("Add BLOND, DUX and DARK; fry briefly, then add Dijon, wholegrain mustard and water."),s("Lower heat before cream; return chicken and cook to the safety target.",true,"Sauce smooth and coating; mushrooms browned rather than pale.",CHICKEN),s("Finish with parsley, black pepper and optional fresh tarragon.")]),
R("pesto-salmon",[
 i("salmon","Salmon fillets",340,"g"),i("broccoli","Broccoli",250,"g","fresh"),i("zucchini","Zucchini",250,"g","fresh"),i("lemon","Lemon",30,"g","fresh"),i("parmesan","Parmesan or Pecorino",10,"g","prepared")
],["oven or air fryer","sheet pan","digital thermometer"],[s("Roast/air-fry vegetables until browned at the edges."),s("Cook salmon to the safety target.",true,"Salmon moist and just flaking; verify with thermometer.",FISH),s("Loosen PESTO with lemon and a small spoon of warm water if needed, then stir in the fresh Parmesan/Pecorino so the cheese-free freezer base becomes finished pesto."),s("Spoon finished pesto over fish and vegetables.",false)]),
R("red-shakshuka",[
 i("red-pepper","Red pepper",150,"g","fresh"),i("cumin-ground","Ground cumin",2,"g"),i("egg-large","Large eggs",4,"count"),i("yoghurt","Thick yoghurt",80,"g","prepared"),i("flatbread","Small flatbreads",2,"count","prepared")
],["wide lidded skillet"],[s("Cook red pepper until softened."),s("Add RED, HARISSA and cumin; loosen with a small splash of water if needed and simmer until thick."),s("Make four wells and add eggs; cover until whites reach the household-preferred set.",true,"Whites set to preference; yolks according to household choice.",undefined,"Camera cannot prove egg safety."),s("Serve with yoghurt and flatbread.")]),
R("harissa-chicken-traybake",[
 i("chicken-thigh","Chicken thighs",500,"g"),i("red-pepper","Red peppers",300,"g","fresh"),i("red-onion","Red onion",150,"g","fresh"),i("butter-beans","Butter beans, drained",240,"g","drained"),i("olive-oil","Olive oil",22.5,"ml"),i("red-wine-vinegar","Red wine vinegar",15,"ml","prepared"),i("oregano","Oregano",2,"g","fresh")
],["sheet pan","oven","digital thermometer"],[s("Toss chicken, peppers, onion and beans with HARISSA and oil."),s("Arrange chicken on top and roast, stirring vegetables once."),s("Cook chicken to the safety target and brown well.",true,"Chicken browned; peppers/onion caramelised.",CHICKEN),s("Finish with vinegar and oregano.")]),
R("harissa-chickpeas",[
 i("chickpeas-drained","Chickpeas, drained",240,"g","drained"),i("cauliflower","Cauliflower florets",500,"g","fresh"),i("olive-oil","Olive oil",22.5,"ml"),i("yoghurt","Plain yoghurt",120,"g","prepared"),i("lemon","Lemon",30,"g","fresh"),i("couscous","Couscous",120,"g","dry",true)
],["oven","saucepan"],[s("Roast cauliflower with oil until browned."),s("Warm chickpeas with HARISSA and a small splash of water until glossy."),s("Mix yoghurt with lemon."),s("Serve cauliflower and chickpeas with yoghurt; couscous is an explicit optional variant.",true,"Cauliflower well browned, chickpeas glossy.")]),
R("chipotle-chicken-bowl",[
 i("chicken-thigh","Chicken thigh",400,"g"),i("black-beans","Black beans, drained",200,"g","drained"),i("corn","Corn",150,"g","prepared"),i("jasmine-rice-dry","Rice",120,"g","dry"),i("lime","Lime",1,"count","fresh"),i("yoghurt","Plain yoghurt",80,"g","prepared"),i("coriander","Fresh coriander",10,"g","fresh")
],["skillet","rice cooker","digital thermometer"],[s("Cook rice separately."),s("Sear chicken until browned."),s("Add RED and CHIPOTLE plus a measured splash of water; simmer until chicken reaches the safety target and is glazed.",true,"Sauce smoky-red and clinging.",CHICKEN),s("Warm beans and corn; build bowls with yoghurt, lime and coriander.")]),
R("chipotle-bean-skillet",[
 i("black-beans","Black beans, drained",480,"g","drained"),i("corn","Corn",150,"g","prepared"),i("lime","Lime",1,"count","fresh"),i("coriander","Fresh coriander",10,"g","fresh"),i("tortilla","Small tortillas",4,"count","prepared")
],["wide skillet"],[s("Warm RED and CHIPOTLE together."),s("Add beans, corn and a measured splash of water; simmer until thick."),s("Crush a small portion of beans to thicken further."),s("Finish with lime and coriander; serve with tortillas. Rice is modeled as a separate variant.",true,"Sauce thick enough to coat beans.")]),
];

export const dinnerFormulationByIdV2=new Map(canonicalDinnerFormulationsV2.map(x=>[x.recipeId,x]));
export function getDinnerFormulationV2(recipeId:string){return dinnerFormulationByIdV2.get(recipeId)}
export function validateDinnerFormulationsV2(){
  const errors:string[]=[];
  if(canonicalDinnerFormulationsV2.length!==36)errors.push(`expected 36 dinner formulations, found ${canonicalDinnerFormulationsV2.length}`);
  const ids=new Set(canonicalDinnerFormulationsV2.map(x=>x.recipeId));if(ids.size!==canonicalDinnerFormulationsV2.length)errors.push("duplicate dinner formulation id");
  for(const f of canonicalDinnerFormulationsV2){
    if(!getCanonicalRecipeV2(f.recipeId))errors.push(`unknown recipe ${f.recipeId}`);
    if(f.targetServings!==2)errors.push(`${f.recipeId} servings must be 2`);
    if(f.actualFinishedWeightG!==null||f.actualServings!==null||f.actualCookMinutes!==null)errors.push(`${f.recipeId} claims unmeasured household output/time`);
    if(!f.ingredients.length)errors.push(`${f.recipeId} has no direct ingredients`);
    if(!f.steps.length)errors.push(`${f.recipeId} has no structured steps`);
    const expected=recipePrepV2(f.recipeId);if(JSON.stringify(f.prep)!==JSON.stringify(expected))errors.push(`${f.recipeId} prep contract differs from food-truth-v2`);
    if(!safetyProfileV2(f.recipeId))errors.push(`${f.recipeId} missing safety profile`);
    for(const ingredient of f.ingredients)if(!(ingredient.qty>0))errors.push(`${f.recipeId}/${ingredient.ingredientId} invalid quantity`);
  }
  return {valid:errors.length===0,errors};
}
