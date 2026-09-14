import type {QuantityUnit} from "./food-quantity";

export type EnergyConfidenceV6="A_LABEL"|"B_DATABASE"|"C_RECIPE_METHOD"|"D_ANALOGUE_PROXY";
export type EnergyReferenceV6=Readonly<{
  unit:QuantityUnit;
  kcalPerUnit:number;
  confidence:EnergyConfidenceV6;
  source:string;
  note:string;
}>;
export type EnergyIngredientLikeV6=Readonly<{ingredientId?:string;id?:string;name:string;qty:number;unit:QuantityUnit;optional?:boolean;note?:string;basis?:string}>;

const USDA="USDA FoodData Central generic food-composition reference (100 g edible portion where applicable)";
const LABEL="Generic packaged-food reference; bind the household product label to upgrade to A_LABEL";
const G=(kcalPer100g:number,note:string,confidence:EnergyConfidenceV6="B_DATABASE"):EnergyReferenceV6=>({unit:"g",kcalPerUnit:kcalPer100g/100,confidence,source:confidence==="B_DATABASE"?USDA:LABEL,note});
const M=(kcalPer100ml:number,note:string,confidence:EnergyConfidenceV6="D_ANALOGUE_PROXY"):EnergyReferenceV6=>({unit:"ml",kcalPerUnit:kcalPer100ml/100,confidence,source:confidence==="B_DATABASE"?USDA:LABEL,note});
const C=(kcalPerCount:number,note:string,confidence:EnergyConfidenceV6="D_ANALOGUE_PROXY"):EnergyReferenceV6=>({unit:"count",kcalPerUnit:kcalPerCount,confidence,source:confidence==="B_DATABASE"?USDA:LABEL,note});

function textOf(row:EnergyIngredientLikeV6){return`${row.ingredientId??row.id??""} ${row.name}`.toLowerCase().replace(/[·,/()]/g," ")}
const has=(s:string,...words:string[])=>words.some(w=>s.includes(w));

/**
 * Generic ingredient-energy resolver for reference planning.
 * Exact household labels override these values later. No g↔ml conversion occurs: each
 * branch returns a value in the same unit as the recipe row.
 */
export function ingredientEnergyReferenceV6(row:EnergyIngredientLikeV6):EnergyReferenceV6|null{
 const s=textOf(row),u=row.unit;
 if(has(s,"water","ice-water","ice water","stock-water","water-stock")&&u==="ml")return M(0,"Water contributes zero kcal.","B_DATABASE");
 if(has(s,"neutral oil","olive oil","sesame oil","cooking oil","frying oil","oil for","vegetable oil")&&u==="ml")return M(828,"Generic edible oil volume reference; frying retention is adjusted at recipe level.","D_ANALOGUE_PROXY");
 if(has(s,"butter","ghee")&&u==="g")return G(has(s,"ghee")?900:717,"Generic butter/ghee reference.");
 if(has(s,"sugar","gula melaka","palm sugar","brown sugar","rice syrup","honey","maple syrup")&&u==="g")return G(has(s,"honey","syrup")?304:387,"Generic sugar/syrup reference.");

 if(has(s,"coconut milk")&&u==="ml")return M(185,"Generic full-fat canned coconut milk; household can bind exact can label.","D_ANALOGUE_PROXY");
 if(has(s,"coconut water")&&u==="ml")return M(19,"Generic unsweetened coconut water.","D_ANALOGUE_PROXY");
 if(has(s,"cream")&&u==="ml")return M(300,"Generic pouring/heavy cream proxy; exact fat percentage changes energy.","D_ANALOGUE_PROXY");
 if(has(s,"milk")&&u==="ml")return M(61,"Generic whole milk reference.","B_DATABASE");
 if(has(s,"yoghurt","yogurt")&&u==="g")return G(has(s,"greek")?97:70,"Generic plain yoghurt reference; exact fat percentage is label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"mayonnaise","mayo")&&u==="g")return G(680,"Generic full-fat mayonnaise; label-sensitive.","D_ANALOGUE_PROXY");

 if(has(s,"paneer")&&u==="g")return G(265,"Generic paneer reference.","D_ANALOGUE_PROXY");
 if(has(s,"halloumi")&&u==="g")return G(321,"Generic halloumi reference.","D_ANALOGUE_PROXY");
 if(has(s,"mozzarella")&&u==="g")return G(300,"Generic low-moisture mozzarella reference.","D_ANALOGUE_PROXY");
 if(has(s,"parmesan","pecorino")&&u==="g")return G(410,"Generic hard Italian cheese reference.","D_ANALOGUE_PROXY");
 if(has(s,"gruy","comté","comte")&&u==="g")return G(410,"Generic Alpine cheese reference.","D_ANALOGUE_PROXY");
 if(has(s,"cheddar","monterey jack","jack blend","melting cheese","cheese")&&u==="g")return G(400,"Generic full-fat cheese reference; household label will refine.","D_ANALOGUE_PROXY");
 if(has(s,"feta","goat cheese")&&u==="g")return G(265,"Generic feta/goat-cheese reference.","D_ANALOGUE_PROXY");

 if(has(s,"tahini")&&u==="g")return G(595,"Sesame paste reference.");
 if(has(s,"peanut butter","peanut paste")&&u==="g")return G(588,"Peanut paste reference.");
 if(has(s,"peanut","groundnut")&&u==="g")return G(567,"Peanut reference.");
 if(has(s,"cashew","almond")&&u==="g")return G(has(s,"cashew")?553:579,"Nut reference.");
 if(has(s,"candlenut")&&u==="g")return G(650,"Candlenut analogue proxy; high-fat nut.","D_ANALOGUE_PROXY");
 if(has(s,"sesame seed")&&u==="g")return G(573,"Sesame seed reference.");

 if(has(s,"large eggs","egg yolk","egg","eggs")&&u==="count")return C(has(s,"yolk")?55:72,"Large egg/yolk count reference.","B_DATABASE");

 if(has(s,"cooked rice","cold cooked","cooked short-grain")&&u==="g")return G(130,"Cooked rice reference.");
 if(has(s,"rice","basmati","jasmine","short-grain")&&u==="g"&&has(s,"dry"))return G(365,"Dry rice reference.");
 if(has(s,"arborio","carnaroli")&&u==="g")return G(365,"Dry risotto rice reference.");
 if(has(s,"spaghetti","bucatini","pasta")&&u==="g")return G(360,"Dry pasta reference.");
 if(has(s,"rice noodle","rice noodles","vermicelli","pho noodle","chow fun","ho fun")&&u==="g")return G(has(s,"fresh")?150:360,"Rice noodle reference; fresh noodles use lower hydrated density.","D_ANALOGUE_PROXY");
 if(has(s,"egg noodle","wheat noodle","chow mein noodle","yakisoba noodle","dangmyeon","sweet potato starch noodles")&&u==="g")return G(has(s,"fresh","prepared")?170:350,"Noodle reference matched to hydrated/dry wording.","D_ANALOGUE_PROXY");
 if(has(s,"couscous","bulgur")&&u==="g")return G(376,"Dry couscous/bulgur reference.","D_ANALOGUE_PROXY");
 if(has(s,"flour","panko","breadcrumb","breadcrumbs","potato starch","cornstarch","starch")&&u==="g")return G(has(s,"panko","breadcrumb")?395:365,"Dry flour/starch/breadcrumb reference.","D_ANALOGUE_PROXY");
 if(has(s,"bread","sourdough","toast")&&u==="count")return C(100,"Generic substantial bread slice; exact loaf/slice should use label.","D_ANALOGUE_PROXY");
 if(has(s,"pita","flatbread")&&u==="count")return C(170,"Generic pita/flatbread unit proxy.","D_ANALOGUE_PROXY");
 if(has(s,"corn tortilla")&&u==="count")return C(55,"Small corn tortilla unit proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"large flour tortilla","large wrap")&&u==="count")return C(210,"Large flour tortilla/wrap unit proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"flour tortilla","tortilla")&&u==="count")return C(140,"Medium flour tortilla unit proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"rice cake")&&u==="g")return G(235,"Korean rice-cake reference.","D_ANALOGUE_PROXY");

 if(has(s,"dried chickpeas","dry chickpeas")&&u==="g")return G(364,"Dry chickpea reference.");
 if(has(s,"chickpeas","chana")&&u==="g")return G(164,"Cooked/drained chickpea reference.");
 if(has(s,"black beans","kidney bean","rajma","pinto bean","cannellini","white beans","beans")&&u==="g")return G(130,"Cooked bean reference.","D_ANALOGUE_PROXY");
 if(has(s,"lentil","dal","dhal")&&u==="g")return G(has(s,"dry","dried")?350:116,"Lentil/dal reference matched to dry/cooked wording.","D_ANALOGUE_PROXY");

 if(has(s,"chicken thigh")&&u==="g")return G(177,"Raw boneless chicken thigh reference.");
 if(has(s,"chicken breast")&&u==="g")return G(120,"Raw skinless chicken breast reference.");
 if(has(s,"whole chicken","chicken pieces","bone-in chicken","chicken drum","chicken wing")&&u==="g")return G(190,"Raw mixed chicken edible-portion proxy; bone/skin yield adds uncertainty.","D_ANALOGUE_PROXY");
 if(has(s,"cooked chicken","roast chicken","shredded chicken")&&u==="g")return G(180,"Cooked chicken reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"ground chicken","chicken mince")&&u==="g")return G(160,"Ground chicken reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"salmon")&&u==="g")return G(has(s,"smoked")?117:208,"Salmon reference matched to smoked/fresh form.","D_ANALOGUE_PROXY");
 if(has(s,"prawn","shrimp","sotong","squid")&&u==="g")return G(has(s,"sotong","squid")?92:99,"Seafood reference.","D_ANALOGUE_PROXY");
 if(has(s,"white fish","fish fillet","cod","snapper","seabass","sea bass")&&u==="g")return G(110,"Lean fish fillet reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"anchovy")&&u==="g")return G(210,"Prepared anchovy reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"canned tuna","tuna")&&u==="g")return G(132,"Drained canned tuna reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"tofu")&&u==="g")return G(85,"Firm/medium tofu reference proxy.","D_ANALOGUE_PROXY");

 if(has(s,"pork belly")&&u==="g")return G(500,"Raw pork belly proxy; rendered/discarded fat increases uncertainty.","D_ANALOGUE_PROXY");
 if(has(s,"pork shoulder","pork mince","ground pork","pork")&&u==="g")return G(250,"Raw pork shoulder/ground-pork proxy.","D_ANALOGUE_PROXY");
 if(has(s,"bacon")&&u==="g")return G(540,"Cooked/raw bacon proxy; rendered fat increases uncertainty.","D_ANALOGUE_PROXY");
 if(has(s,"ham")&&u==="g")return G(145,"Cooked ham proxy; product label preferred.","D_ANALOGUE_PROXY");
 if(has(s,"guanciale","pancetta")&&u==="g")return G(600,"Cured fatty pork proxy; rendered-fat retention is recipe-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"ground beef lamb","beef lamb","lamb")&&u==="g")return G(260,"Beef/lamb mix proxy.","D_ANALOGUE_PROXY");
 if(has(s,"ground beef","ground-beef","beef mince")&&u==="g")return G(250,"Ground beef reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"beef sirloin","ribeye","beef steak","beef chuck","thin beef","beef strips","beef")&&u==="g")return G(220,"Raw beef cut proxy; cut/fat level changes energy.","D_ANALOGUE_PROXY");

 if(has(s,"avocado")&&u==="g")return G(160,"Avocado reference.");
 if(has(s,"potato","sweet potato")&&u==="g")return G(has(s,"sweet")?86:77,"Raw potato reference.");
 if(has(s,"carrot")&&u==="g")return G(41,"Raw carrot reference.");
 if(has(s,"onion","shallot")&&u==="g")return G(has(s,"shallot")?72:40,"Raw onion/shallot reference.");
 if(has(s,"garlic")&&u==="g")return G(149,"Raw garlic reference.");
 if(has(s,"ginger")&&u==="g")return G(80,"Raw ginger reference.");
 if(has(s,"tomato paste")&&u==="g")return G(82,"Tomato paste reference.");
 if(has(s,"tomato","cherry tomato")&&u==="g")return G(18,"Raw tomato reference.");
 if(has(s,"spinach")&&u==="g")return G(23,"Raw spinach reference.");
 if(has(s,"kale","chard")&&u==="g")return G(35,"Leafy-green proxy.","D_ANALOGUE_PROXY");
 if(has(s,"cabbage","romaine","lettuce","mixed greens","greens")&&u==="g")return G(20,"Leafy/cruciferous vegetable proxy.","D_ANALOGUE_PROXY");
 if(has(s,"broccoli")&&u==="g")return G(34,"Raw broccoli reference.");
 if(has(s,"cauliflower")&&u==="g")return G(25,"Raw cauliflower reference.");
 if(has(s,"aubergine","eggplant")&&u==="g")return G(25,"Raw aubergine reference.");
 if(has(s,"zucchini","courgette")&&u==="g")return G(17,"Raw zucchini reference.");
 if(has(s,"green bean")&&u==="g")return G(31,"Raw green-bean reference.");
 if(has(s,"bean sprout","sprout")&&u==="g")return G(30,"Raw bean-sprout reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"mushroom","shiitake")&&u==="g")return G(has(s,"dried")?296:28,"Mushroom reference matched to dried/fresh form.","D_ANALOGUE_PROXY");
 if(has(s,"bell pepper","capsicum")&&u==="g")return G(31,"Raw sweet-pepper reference.");
 if(has(s,"cucumber")&&u==="g")return G(15,"Raw cucumber reference.");
 if(has(s,"daikon","radish")&&u==="g")return G(18,"Raw radish/daikon reference.");
 if(has(s,"pumpkin","squash")&&u==="g")return G(34,"Pumpkin/squash proxy.","D_ANALOGUE_PROXY");
 if(has(s,"pea","matar")&&u==="g")return G(81,"Green-pea reference.");
 if(has(s,"corn")&&u==="g")return G(86,"Sweet-corn reference.");
 if(has(s,"apple")&&u==="g")return G(52,"Raw apple reference.");
 if(has(s,"pineapple")&&u==="g")return G(50,"Raw pineapple reference.");

 if(has(s,"lime juice","lemon juice","citrus")&&u==="ml")return M(25,"Generic fresh citrus juice reference.","B_DATABASE");
 if(has(s,"lime","lemon")&&u==="count")return C(20,"Whole citrus unit proxy; usually garnish/juice source.","D_ANALOGUE_PROXY");
 if(has(s,"green chilli","jalape","serrano","chilli")&&u==="count")return C(4,"Fresh chilli unit proxy.","D_ANALOGUE_PROXY");
 if(has(s,"bay leaf","makrut","kaffir lime leaf")&&u==="count")return C(1,"Leaf spice energy is nutritionally negligible at recipe scale.","D_ANALOGUE_PROXY");

 if(has(s,"soy sauce","light soy","dark soy","korean soy","japanese soy")&&u==="ml")return M(53,"Generic soy sauce; sodium/energy label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"fish sauce")&&u==="ml")return M(35,"Generic fish sauce; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"oyster sauce")&&u==="ml")return M(115,"Generic oyster sauce; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"hoisin")&&u==="ml")return M(220,"Generic hoisin sauce; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"worcestershire")&&u==="ml")return M(78,"Generic Worcestershire sauce; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"mirin")&&u==="ml")return M(240,"Generic hon-mirin style proxy; product alcohol/sugar varies.","D_ANALOGUE_PROXY");
 if(has(s,"sake","shaoxing","wine")&&u==="ml")return M(has(s,"wine")?82:130,"Cooking alcohol reference proxy; evaporation is method-dependent.","D_ANALOGUE_PROXY");
 if(has(s,"vinegar")&&u==="ml")return M(18,"Generic vinegar reference.","D_ANALOGUE_PROXY");
 if(has(s,"tamarind")&&u==="g")return G(239,"Tamarind pulp reference.","D_ANALOGUE_PROXY");
 if(has(s,"tamarind")&&u==="ml")return M(100,"Diluted tamarind-liquid proxy; concentration varies.","D_ANALOGUE_PROXY");
 if(has(s,"kecap manis")&&u==="ml")return M(230,"Sweet soy proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"cooking caramel","kicap pekat")&&u==="ml")return M(120,"Malaysian cooking-caramel proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"hot sauce","sriracha")&&u==="ml")return M(30,"Generic chilli sauce proxy.","D_ANALOGUE_PROXY");
 if(has(s,"gochujang")&&u==="g")return G(220,"Generic gochujang; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"doenjang","miso")&&u==="g")return G(195,"Fermented soybean paste proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"douban","chilli bean","bean paste")&&u==="g")return G(130,"Fermented chilli-bean paste proxy; label-sensitive.","D_ANALOGUE_PROXY");
 if(has(s,"salsa","pico")&&u==="g")return G(30,"Fresh salsa/pico proxy.","D_ANALOGUE_PROXY");
 if(has(s,"pickle","cornichon","kimchi")&&u==="g")return G(has(s,"kimchi")?23:15,"Fermented/pickled vegetable reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"kimchi juice")&&u==="ml")return M(20,"Kimchi-brine proxy.","D_ANALOGUE_PROXY");

 if(has(s,"belacan","shrimp paste")&&u==="g")return G(100,"Shrimp-paste proxy; product varies.","D_ANALOGUE_PROXY");
 if(has(s,"kerisik")&&u==="g")return G(650,"Toasted coconut paste proxy.","D_ANALOGUE_PROXY");
 if(has(s,"nori","seaweed","gim")&&u==="g")return G(300,"Dried seaweed proxy; small mass.","D_ANALOGUE_PROXY");

 if(has(s,"coriander","parsley","basil","mint","dill","chive","scallion","spring onion","perilla","mitsuba")&&u==="g")return G(30,"Fresh herb/allium-green proxy; contribution is small.","D_ANALOGUE_PROXY");
 if(has(s,"lemongrass")&&u==="g")return G(99,"Lemongrass reference proxy.","D_ANALOGUE_PROXY");
 if(has(s,"galangal")&&u==="g")return G(71,"Galangal proxy.","D_ANALOGUE_PROXY");
 if(has(s,"turmeric fresh")&&u==="g")return G(60,"Fresh turmeric proxy.","D_ANALOGUE_PROXY");

 if(has(s,"salt")&&(u==="g"||u==="ml"))return u==="g"?G(0,"Salt contributes zero kcal.","B_DATABASE"):M(0,"Salt solution proxy.","D_ANALOGUE_PROXY");
 if(has(s,"pepper","paprika","chilli powder","chili powder","chilli flake","cumin","coriander ground","turmeric","garam masala","oregano","cinnamon","allspice","cardamom","clove","fennel","sumac","za'atar","zaatar","kasuri","amchur","five spice","sichuan","gochugaru","aleppo")&&u==="g")return G(300,"Dry spice/herb energy proxy; quantities are small and uncertainty is immaterial to meal total.","D_ANALOGUE_PROXY");
 if(has(s,"baking powder")&&u==="g")return G(50,"Baking-powder proxy; tiny recipe contribution.","D_ANALOGUE_PROXY");

 return null;
}

export function ingredientReferenceKcalV6(row:EnergyIngredientLikeV6){
 if(row.optional)return{kcal:0,reference:null as EnergyReferenceV6|null,excludedOptional:true};
 const reference=ingredientEnergyReferenceV6(row);if(!reference||reference.unit!==row.unit)return{kcal:null as number|null,reference,excludedOptional:false};
 return{kcal:Math.round(row.qty*reference.kcalPerUnit*10)/10,reference,excludedOptional:false};
}
