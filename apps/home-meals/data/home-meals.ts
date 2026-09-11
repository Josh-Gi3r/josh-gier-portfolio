export type Base = {
  slug: string;
  name: string;
  code: string;
  size: string;
  tone: string;
  tier: "core" | "specialist";
  targetPortions: number;
  summary: string;
  ingredients: string[];
  batchIngredients: string[];
  directions: string[];
  becomes: string[];
  finishers: string[];
  troubleshooting: { issue: string; fix: string }[];
};

export type MidBase = {
  code: string;
  name: string;
  size: string;
  storage: string;
  summary: string;
  pairsWith: string[];
  unlocks: string[];
};

export type Recipe = {
  slug: string;
  title: string;
  subtitle: string;
  time: number;
  cuisine: string;
  rating: number;
  base: string;
  mid?: string;
  cubeCount: number;
  serves: number;
  difficulty: "Easy" | "Medium" | "Weekend";
  imageTone: string;
  inventory: "Ready" | "1 item" | "Shop";
  ingredients: string[];
  steps: string[];
  tags: string[];
};

export const bases: Base[] = [
  {
    slug: "red", name: "Concentrated tomato base", code: "RED", size: "90 ml", tone: "#ef5b45", tier: "core", targetPortions: 10,
    summary: "Neutral, deeply reduced tomato infrastructure. It stays deliberately free of oregano, basil and heavy chilli so it can move from Italian to Mediterranean, Indian and smoky-spiced directions.",
    ingredients: ["onion", "garlic", "tomato", "tomato paste", "olive oil"],
    batchIngredients: ["2 kg ripe tomatoes", "350 g onion", "60 g garlic", "120 g tomato paste", "80 ml olive oil", "salt"],
    directions: ["Sweat onion slowly until sweet, not browned.", "Add garlic briefly.", "Cook tomato paste until brick red.", "Add tomatoes and reduce until glossy and concentrated.", "Cool fully, portion 90 ml and freeze."],
    becomes: ["Pomodoro", "Arrabbiata", "Beef ragù", "Meatballs", "Shakshuka", "Tomato chickpeas", "Baked fish", "Smoky chicken bowls"],
    finishers: ["basil + Parmesan", "cream + chilli", "cumin + smoked paprika", "GOLD + cream", "harissa mid-base"],
    troubleshooting: [{ issue: "Watery after thawing", fix: "Reduce further before freezing. RED is a concentrate, not finished pasta sauce." }, { issue: "Tastes too Italian", fix: "Do not put dried oregano or basil into the mother batch." }]
  },
  {
    slug: "gold", name: "Onion-tomato masala", code: "GOLD", size: "60 ml", tone: "#e3a72f", tier: "core", targetPortions: 12,
    summary: "The curry workhorse: properly browned onion, ginger, garlic, tomato and foundational spices. The final curry identity is created later by the mid-base and finisher.",
    ingredients: ["onion", "ginger", "garlic", "tomato", "cumin", "coriander", "turmeric", "chilli"],
    batchIngredients: ["900 g onion", "650 g tomato", "110 g ginger", "110 g garlic", "2 tbsp cumin", "2 tbsp coriander", "2 tsp turmeric", "mild chilli to taste", "120 ml neutral oil"],
    directions: ["Brown onion properly; translucent is not enough.", "Cook ginger and garlic until the raw edge disappears.", "Bloom spices without scorching.", "Add tomato and reduce until glossy and the oil begins to separate.", "Cool, portion 60 ml and freeze."],
    becomes: ["Chicken curry", "Butter-chicken direction", "Coconut curry", "Chana masala", "Egg curry", "Paneer masala", "Fish curry", "Saag chicken", "Aloo gobi"],
    finishers: ["coconut milk", "cream + butter", "yoghurt", "SAAG mid-base", "extra RED", "tandoori-style spice finish"],
    troubleshooting: [{ issue: "Flat flavour", fix: "The onions probably needed more colour or the tomato needed more reduction." }, { issue: "Too specific", fix: "Keep garam masala and finishing spices out of the mother batch." }]
  },
  {
    slug: "asian", name: "Asian aromatic base", code: "ASIAN", size: "60 ml", tone: "#5b9f76", tier: "core", targetPortions: 10,
    summary: "A flexible shallot, garlic, ginger and chilli aromatic concentrate for stir-fries, noodles, braises and coconut dishes. Lemongrass stays separate so this base does not become one-note.",
    ingredients: ["shallot", "garlic", "ginger", "chilli", "neutral oil"],
    batchIngredients: ["500 g shallots", "150 g garlic", "150 g ginger", "80-100 g fresh chilli", "140 ml neutral oil"],
    directions: ["Finely mince or pulse the aromatics.", "Cook over medium-low heat until moisture drops and the aroma sweetens.", "Do not brown the garlic.", "Cool, portion 60 ml and freeze."],
    becomes: ["Ginger-soy chicken", "Stir-fried beef", "Fried rice", "Chilli-garlic noodles", "Prawn noodles", "Coconut chicken", "Asian braise", "Quick vegetable stir-fry"],
    finishers: ["soy + honey", "fish sauce + lime", "oyster + sesame", "coconut + lime", "LEMONGRASS mid-base", "GOCHU mid-base"],
    troubleshooting: [{ issue: "Bitter garlic", fix: "The pan was too hot. This base should soften and sweeten rather than fry dark." }]
  },
  {
    slug: "dark", name: "Concentrated stock / jus", code: "DARK", size: "30 ml", tone: "#4b392f", tier: "core", targetPortions: 12,
    summary: "The restaurant cube. A low-salt stock reduction that makes fast pan sauces and braises taste like they had much more time.",
    ingredients: ["unsalted chicken or beef stock", "optional roast bones", "mirepoix"],
    batchIngredients: ["2.5 L good unsalted stock", "optional 500 g roasted bones or wings", "1 onion", "1 carrot", "1 celery stalk"],
    directions: ["Start with unsalted or lightly salted stock.", "Reduce slowly until intensely savoury and lightly gelatinous.", "Strain very well.", "Chill, portion 30 ml and freeze."],
    becomes: ["Mustard pan sauce", "Mushroom cream chicken", "Peppercorn sauce", "Miso butter glaze", "Quick braise", "Deepened ragù", "Gravy", "Pan jus"],
    finishers: ["butter + Dijon", "DUX mid-base + cream", "black pepper + cream", "MISO mid-base + butter", "RED"],
    troubleshooting: [{ issue: "Too salty", fix: "Never reduce fully seasoned commercial stock. Salt the finished dish instead." }]
  },
  {
    slug: "green", name: "Fresh green herb base", code: "GREEN", size: "30 ml", tone: "#4c9b58", tier: "core", targetPortions: 10,
    summary: "A bright herb concentrate rather than finished pesto: herbs, garlic, oil and restrained citrus zest. Cheese, nuts, cream and stronger acid come later.",
    ingredients: ["parsley", "coriander", "basil", "garlic", "olive oil", "lemon zest"],
    batchIngredients: ["250 g mixed soft herbs", "40 g garlic", "250 ml olive oil", "zest of 2 lemons", "salt"],
    directions: ["Wash and dry herbs extremely well.", "Blend quickly with garlic, oil and zest.", "Keep acid modest before freezing.", "Portion 30 ml and freeze immediately."],
    becomes: ["Pesto chicken", "Pesto salmon", "Creamy green pasta", "Herb potatoes", "Green rice bowls", "Roast fish", "Herb butter vegetables", "Sandwich spread"],
    finishers: ["Parmesan", "toasted nuts", "butter", "cream", "lemon", "PESTO mid-base"],
    troubleshooting: [{ issue: "Dull colour", fix: "Dry herbs thoroughly, blend briefly and freeze immediately." }]
  },
  {
    slug: "fire", name: "Roasted pepper & chilli base", code: "FIRE", size: "90 ml", tone: "#e34d38", tier: "core", targetPortions: 8,
    summary: "Roasted pepper, tomato, chilli and garlic with sweetness, smoke and body. It stays neutral enough to become Mediterranean, North African, Iberian or smoky-spiced comfort food.",
    ingredients: ["red pepper", "tomato", "chilli", "garlic", "olive oil"],
    batchIngredients: ["1.2 kg red peppers", "600 g tomato", "70 g garlic", "fresh or dried chilli to taste", "90 ml olive oil"],
    directions: ["Char and peel peppers for sweetness and smoke.", "Cook garlic gently.", "Add tomato and chilli, then reduce.", "Blend to a thick but spoonable texture.", "Portion 90 ml and freeze."],
    becomes: ["Harissa-style chicken", "Spicy tomato pasta", "Baked fish", "Spicy prawns", "Shakshuka", "Chilli beans", "Roast vegetable stew", "Pepper chicken bake"],
    finishers: ["HARISSA mid-base", "cumin + yoghurt", "smoked paprika", "lemon", "cream", "coriander"],
    troubleshooting: [{ issue: "Too one-note", fix: "Do not load the batch with finishing spices. Add those when the meal is chosen." }]
  },
  {
    slug: "blond", name: "Slow allium & light-stock base", code: "BLOND", size: "60 ml", tone: "#d8b978", tier: "core", targetPortions: 10,
    summary: "The missing non-tomato European foundation: slow onion, leek, celery, garlic and light stock, frozen before dairy. This is what lets cream sauces, pies, risotti and white braises happen quickly without becoming repetitive.",
    ingredients: ["onion", "leek", "celery", "garlic", "light stock", "butter or olive oil"],
    batchIngredients: ["450 g onion", "350 g leek", "150 g celery", "60 g garlic", "700 ml light unsalted stock", "60 g butter or 60 ml olive oil", "optional 150 ml dry white wine"],
    directions: ["Sweat onion, leek and celery slowly until very soft and sweet with minimal colour.", "Add garlic briefly.", "Deglaze with wine if using and reduce almost dry.", "Add stock and reduce to a loose concentrate.", "Cool, portion 60 ml and freeze before any cream is added."],
    becomes: ["Lemon cream chicken", "Chicken pot pie", "Leek pasta", "White bean stew", "Creamy fish bake", "Quick risotto", "Chicken and mushroom casserole", "Light vegetable soup"],
    finishers: ["cream + lemon", "DUX mid-base", "Dijon + butter", "Parmesan", "tarragon", "GREEN"],
    troubleshooting: [{ issue: "Brown and heavy", fix: "Keep the heat lower. BLOND should be sweet and pale, not caramelised onion." }]
  },
  {
    slug: "sambal", name: "Cooked sambal tumis base", code: "SAMBAL", size: "60 ml", tone: "#a83224", tier: "specialist", targetPortions: 8,
    summary: "A deliberate Malaysian specialist base. Properly cooked chilli and shallot takes time, so this batch earns its freezer space and unlocks fast prawns, eggs, fish, chicken, noodles and rice dishes.",
    ingredients: ["dried chilli", "shallot", "garlic", "tamarind", "oil", "optional belacan"],
    batchIngredients: ["180 g dried chillies, soaked and deseeded to taste", "450 g shallots", "90 g garlic", "1-2 tbsp tamarind concentrate", "180 ml neutral oil", "20-30 g belacan optional", "small amount palm sugar"],
    directions: ["Blend soaked chillies, shallots and garlic very smooth.", "Fry patiently in oil until the paste darkens and the oil separates.", "Add belacan if using, then tamarind and a restrained amount of sugar.", "Cook until jammy and no longer raw-tasting.", "Cool, portion 60 ml and freeze."],
    becomes: ["Sambal prawns", "Sambal eggs", "Sambal fish", "Sambal chicken", "Nasi lemak sambal", "Sambal fried rice", "Spicy noodles", "Sambal vegetables"],
    finishers: ["tamarind", "lime", "coconut milk", "crispy anchovy + peanut", "soy", "brown sugar"],
    troubleshooting: [{ issue: "Raw chilli taste", fix: "It simply needs more cooking time. Sambal tumis should be fried until the oil separates and the raw edge disappears." }, { issue: "Too sweet", fix: "Sugar is a balancing tool, not the main flavour." }]
  }
];

export const midBases: MidBase[] = [
  { code: "SAAG", name: "Spinach-ginger purée", size: "60 ml", storage: "Freezer", summary: "Concentrated spinach, ginger and green chilli that turns GOLD into a saag direction without making every GOLD batch green.", pairsWith: ["GOLD", "BLOND"], unlocks: ["Saag chicken", "Saag paneer", "Green dhal", "Spinach cream sauce"] },
  { code: "DUX", name: "Mushroom-shallot duxelles", size: "60 ml", storage: "Freezer", summary: "Mushrooms cooked until genuinely dry and savoury, ready to turn DARK or BLOND into mushroom sauces, pies and stroganoff-style dishes.", pairsWith: ["DARK", "BLOND"], unlocks: ["Mushroom cream chicken", "Mushroom pasta", "Pot pie", "Quick stroganoff", "Mushroom risotto"] },
  { code: "LEM", name: "Lemongrass-galangal paste", size: "30 ml", storage: "Freezer", summary: "The Southeast Asian direction kept separate from ASIAN so the mother base remains versatile.", pairsWith: ["ASIAN", "SAMBAL"], unlocks: ["Lemongrass chicken", "Coconut lime prawns", "Thai-style soup", "Aromatic fish"] },
  { code: "THAI", name: "Thai green curry paste", size: "30 ml", storage: "Freezer", summary: "A directional curry paste used in small amounts with ASIAN plus coconut milk.", pairsWith: ["ASIAN"], unlocks: ["Green curry chicken", "Green curry tofu", "Green curry fish", "Coconut vegetable curry"] },
  { code: "MISO", name: "Miso-sesame paste", size: "30 ml", storage: "Fridge / freezer", summary: "Miso, sesame and ginger concentrated for glazes, broths and buttery pan sauces.", pairsWith: ["DARK", "ASIAN", "BLOND"], unlocks: ["Miso butter salmon", "Miso chicken", "Miso noodles", "Miso mushroom broth"] },
  { code: "GOCHU", name: "Gochujang-soy paste", size: "30 ml", storage: "Fridge / freezer", summary: "Sweet-hot fermented chilli direction for fast Korean-ish bowls, glazes and noodles.", pairsWith: ["ASIAN", "DARK"], unlocks: ["Gochujang chicken", "Spicy beef bowl", "Sticky tofu", "Gochujang noodles"] },
  { code: "HAR", name: "Harissa spice paste", size: "30 ml", storage: "Fridge / freezer", summary: "Warm chilli, cumin, coriander and garlic that pushes FIRE toward North African and Mediterranean meals.", pairsWith: ["FIRE", "RED"], unlocks: ["Harissa chicken", "Harissa chickpeas", "Spicy roast fish", "Harissa vegetables"] },
  { code: "CHIP", name: "Chipotle-adobo paste", size: "30 ml", storage: "Freezer", summary: "Smoky chilli, cumin and vinegar direction for RED or FIRE without dedicating another mother sauce to Tex-Mex flavours.", pairsWith: ["RED", "FIRE"], unlocks: ["Smoky beef bowl", "Chipotle chicken", "Black bean stew", "Smoky tomato rice"] },
  { code: "PESTO", name: "Finished pesto concentrate", size: "30 ml", storage: "Freezer", summary: "GREEN plus nuts and Parmesan for nights when the full pesto identity is wanted immediately.", pairsWith: ["GREEN", "BLOND"], unlocks: ["Pesto pasta", "Pesto salmon", "Pesto chicken", "Pesto potatoes"] },
  { code: "CO", name: "Deep caramelised onion", size: "60 ml", storage: "Freezer", summary: "A slow-cooked allium direction kept separate from pale BLOND so it can add sweetness and brown depth only when wanted.", pairsWith: ["DARK", "BLOND", "RED"], unlocks: ["French onion chicken", "Onion gravy", "Quick beef braise", "Caramelised onion pasta"] }
];

export const boosters = [
  { code: "GG", name: "Ginger + garlic", size: "30 ml" },
  { code: "G", name: "Pure garlic", size: "20-30 ml" },
  { code: "GB", name: "Garlic butter", size: "30 ml" },
  { code: "CH", name: "Plain chilli paste", size: "30 ml" },
  { code: "ST", name: "Extra concentrated stock", size: "30 ml" },
  { code: "LE", name: "Lemongrass + ginger + chilli", size: "30 ml" },
  { code: "HB", name: "Herb butter", size: "30 ml" },
  { code: "RG", name: "Roasted garlic", size: "30 ml" }
];

export const recipes: Recipe[] = [
  { slug: "mustard-mushroom-chicken", title: "Mustard mushroom chicken", subtitle: "DARK + DUX, cream and Dijon", time: 22, cuisine: "French-ish", rating: 9.2, base: "DARK", mid: "DUX", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "dark", inventory: "Ready", ingredients: ["2 chicken thighs", "2 DARK cubes", "1 DUX cube", "120 ml cream", "1 tbsp Dijon", "parsley", "pasta or potatoes"], steps: ["Season and sear chicken until deeply golden; remove.", "Warm DUX in the same pan.", "Add DARK cubes and a splash of water; scrape the fond.", "Stir in Dijon and cream.", "Return chicken and simmer until cooked through.", "Finish with parsley and black pepper."], tags: ["weekday", "creamy", "one-pan"] },
  { slug: "gold-coconut-chicken", title: "GOLD coconut chicken", subtitle: "GOLD finished with coconut, lime and spinach", time: 24, cuisine: "Indian / SEA", rating: 9.0, base: "GOLD", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "gold", inventory: "Ready", ingredients: ["350 g chicken thigh", "2 GOLD cubes", "200 ml coconut milk", "spinach", "lime", "basmati rice"], steps: ["Sear chicken lightly.", "Melt GOLD cubes into the pan.", "Add coconut milk and simmer.", "Fold in spinach.", "Return chicken and cook through.", "Finish with lime and chilli."], tags: ["curry", "freezer-first", "weekday"] },
  { slug: "saag-chicken", title: "GOLD saag chicken", subtitle: "GOLD + SAAG makes a completely different curry", time: 23, cuisine: "Indian", rating: 8.9, base: "GOLD", mid: "SAAG", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "gold", inventory: "Ready", ingredients: ["350 g chicken thigh", "2 GOLD cubes", "2 SAAG cubes", "100 ml yoghurt or cream", "basmati"], steps: ["Sear chicken and remove.", "Warm GOLD until aromatic.", "Add SAAG and a splash of water.", "Return chicken and simmer.", "Finish with yoghurt or cream off high heat."], tags: ["curry", "spinach", "weekday"] },
  { slug: "pesto-salmon", title: "Pesto salmon & roast vegetables", subtitle: "GREEN + PESTO with crisp-edged salmon", time: 25, cuisine: "Mediterranean", rating: 8.8, base: "GREEN", mid: "PESTO", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "green", inventory: "1 item", ingredients: ["2 salmon fillets", "1 GREEN cube", "1 PESTO cube", "broccoli", "zucchini", "lemon"], steps: ["Roast vegetables at high heat.", "Season salmon and roast or air-fry.", "Warm GREEN and PESTO gently.", "Loosen with lemon and olive oil.", "Spoon over salmon."], tags: ["fish", "air-fryer", "fresh"] },
  { slug: "beef-ragu", title: "Weeknight beef ragù", subtitle: "RED + DARK tastes much longer-cooked than it is", time: 28, cuisine: "Italian", rating: 9.3, base: "RED", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "red", inventory: "Ready", ingredients: ["300 g minced beef", "2 RED cubes", "1 DARK cube", "spaghetti", "Parmesan"], steps: ["Brown beef hard in a wide pan.", "Add RED and DARK.", "Loosen with pasta water and simmer.", "Toss with spaghetti.", "Finish with Parmesan and pepper."], tags: ["pasta", "comfort", "freezer-first"] },
  { slug: "ginger-soy-prawns", title: "Ginger soy prawns", subtitle: "ASIAN with soy, honey and sesame", time: 15, cuisine: "Asian", rating: 8.9, base: "ASIAN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Shop", ingredients: ["400 g prawns", "1 ASIAN cube", "soy", "honey", "sesame oil", "green beans", "rice"], steps: ["Sear prawns quickly and remove.", "Melt ASIAN cube.", "Add soy, honey and water.", "Toss in beans, then prawns.", "Finish with sesame oil."], tags: ["15-minute", "seafood", "stir-fry"] },
  { slug: "lemongrass-coconut-chicken", title: "Lemongrass coconut chicken", subtitle: "ASIAN + LEM + coconut + lime", time: 24, cuisine: "Southeast Asian", rating: 9.0, base: "ASIAN", mid: "LEM", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Ready", ingredients: ["350 g chicken thigh", "1 ASIAN cube", "1 LEM cube", "200 ml coconut milk", "lime", "rice"], steps: ["Sear chicken lightly.", "Cook ASIAN and LEM until fragrant.", "Add coconut milk.", "Return chicken and simmer gently.", "Finish with lime and herbs."], tags: ["coconut", "weekday", "one-pan"] },
  { slug: "fire-roast-chicken", title: "Harissa FIRE roast chicken", subtitle: "FIRE + HAR, yoghurt and cumin", time: 35, cuisine: "Middle Eastern-ish", rating: 8.7, base: "FIRE", mid: "HAR", cubeCount: 2, serves: 2, difficulty: "Medium", imageTone: "fire", inventory: "Ready", ingredients: ["4 chicken thighs", "2 FIRE cubes", "1 HAR cube", "2 tbsp yoghurt", "cauliflower", "flatbread"], steps: ["Mix FIRE and HAR with yoghurt.", "Coat chicken while the oven heats.", "Roast with cauliflower.", "Warm flatbread.", "Finish with lemon and herbs."], tags: ["oven", "spicy", "weekend-ish"] },
  { slug: "shakshuka", title: "RED shakshuka", subtitle: "Emergency dinner from RED and eggs", time: 18, cuisine: "Mediterranean", rating: 8.4, base: "RED", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "red", inventory: "Ready", ingredients: ["2 RED cubes", "4 eggs", "cumin", "smoked paprika", "feta", "flatbread"], steps: ["Warm RED with cumin and paprika.", "Loosen slightly with water.", "Make four wells and add eggs.", "Cover until set to preference.", "Finish with feta and herbs."], tags: ["eggs", "emergency", "vegetarian"] },
  { slug: "green-chicken-pasta", title: "Creamy GREEN chicken pasta", subtitle: "Herby, creamy and intentionally not tomato", time: 20, cuisine: "Italian-ish", rating: 8.8, base: "GREEN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "green", inventory: "Ready", ingredients: ["250 g chicken breast", "1 GREEN cube", "120 ml cream", "penne", "Parmesan", "peas"], steps: ["Boil pasta.", "Sear sliced chicken.", "Add GREEN and cream.", "Fold in peas and pasta.", "Finish with Parmesan and lemon."], tags: ["pasta", "creamy", "20-minute"] },
  { slug: "gold-chana", title: "GOLD chana masala", subtitle: "A pantry dinner with proper depth", time: 20, cuisine: "Indian", rating: 8.6, base: "GOLD", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "gold", inventory: "Ready", ingredients: ["2 GOLD cubes", "1 can chickpeas", "garam masala", "yoghurt", "coriander"], steps: ["Warm GOLD until sizzling.", "Add garam masala.", "Fold in chickpeas and water.", "Simmer until glossy.", "Finish with yoghurt and coriander."], tags: ["vegetarian", "pantry", "20-minute"] },
  { slug: "miso-butter-salmon", title: "Miso butter salmon", subtitle: "DARK + MISO creates a glossy savoury glaze", time: 18, cuisine: "Japanese-ish", rating: 9.1, base: "DARK", mid: "MISO", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "dark", inventory: "1 item", ingredients: ["2 salmon fillets", "1 DARK cube", "1 MISO cube", "20 g butter", "broccoli", "rice"], steps: ["Roast or air-fry salmon.", "Melt DARK with water.", "Whisk in MISO off high heat.", "Mount with butter.", "Brush over salmon."], tags: ["fish", "air-fryer", "18-minute"] },
  { slug: "asian-chilli-noodles", title: "Chilli garlic noodles", subtitle: "ASIAN + CH booster for a 12-minute dinner", time: 12, cuisine: "Asian", rating: 8.5, base: "ASIAN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Ready", ingredients: ["1 ASIAN cube", "1 CH cube", "noodles", "soy", "egg", "spring onion"], steps: ["Boil noodles.", "Fry ASIAN and CH.", "Add soy and noodle water.", "Toss noodles through sauce.", "Top with egg and spring onion."], tags: ["emergency", "12-minute", "noodles"] },
  { slug: "blond-lemon-chicken", title: "BLOND lemon cream chicken", subtitle: "The non-tomato European workhorse in action", time: 22, cuisine: "European", rating: 9.0, base: "BLOND", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "blond", inventory: "Ready", ingredients: ["2 chicken thighs", "2 BLOND cubes", "120 ml cream", "lemon", "Dijon", "green beans", "potatoes"], steps: ["Sear chicken and remove.", "Melt BLOND into the pan.", "Add cream and a little Dijon.", "Return chicken until cooked through.", "Finish with lemon and pepper."], tags: ["creamy", "one-pan", "weekday"] },
  { slug: "blond-mushroom-pasta", title: "BLOND mushroom pasta", subtitle: "BLOND + DUX + Parmesan", time: 18, cuisine: "Italian-ish", rating: 8.9, base: "BLOND", mid: "DUX", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "blond", inventory: "Ready", ingredients: ["1 BLOND cube", "1 DUX cube", "spaghetti", "100 ml cream or pasta water", "Parmesan", "parsley"], steps: ["Boil pasta.", "Warm BLOND and DUX together.", "Loosen with pasta water or cream.", "Toss through pasta.", "Finish with Parmesan and parsley."], tags: ["18-minute", "vegetarian", "pasta"] },
  { slug: "sambal-prawns", title: "Sambal prawns", subtitle: "Proper sambal work done ahead, prawns cooked fresh", time: 14, cuisine: "Malaysian", rating: 9.1, base: "SAMBAL", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "sambal", inventory: "Shop", ingredients: ["400 g prawns", "2 SAMBAL cubes", "tamarind", "lime", "cucumber", "rice"], steps: ["Sear prawns quickly and remove.", "Warm SAMBAL with a splash of water.", "Balance with tamarind if needed.", "Return prawns only long enough to glaze.", "Finish with lime."], tags: ["Malaysian", "seafood", "14-minute"] },
  { slug: "sambal-eggs", title: "Sambal eggs", subtitle: "A very fast dinner when the sambal already exists", time: 15, cuisine: "Malaysian", rating: 8.8, base: "SAMBAL", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "sambal", inventory: "Ready", ingredients: ["4-6 eggs", "2 SAMBAL cubes", "cucumber", "rice", "optional fried anchovy + peanut"], steps: ["Boil or fry eggs.", "Warm SAMBAL gently with a little water.", "Coat or spoon over eggs.", "Serve with rice and cucumber."], tags: ["eggs", "emergency", "Malaysian"] },
  { slug: "gochujang-chicken-bowl", title: "Gochujang chicken bowl", subtitle: "ASIAN + GOCHU gives a sticky fermented-chilli direction", time: 20, cuisine: "Korean-ish", rating: 8.9, base: "ASIAN", mid: "GOCHU", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Ready", ingredients: ["350 g chicken thigh", "1 ASIAN cube", "1 GOCHU cube", "rice", "edamame", "sesame"], steps: ["Sear chicken until browned.", "Add ASIAN and GOCHU.", "Loosen with a spoon of water and glaze the chicken.", "Serve over rice with edamame.", "Finish with sesame."], tags: ["bowl", "20-minute", "spicy"] }
];

export const weeklyPlan = [
  { day: "Mon", recipe: "mustard-mushroom-chicken", note: "Use mushrooms first" },
  { day: "Tue", recipe: "gold-coconut-chicken", note: "Spinach use-soon" },
  { day: "Wed", recipe: "sambal-prawns", note: "Fresh prawns" },
  { day: "Thu", recipe: "beef-ragu", note: "RED + DARK" },
  { day: "Fri", recipe: "blond-lemon-chicken", note: "Non-tomato night" },
  { day: "Sat", recipe: "fire-roast-chicken", note: "Oven dinner" },
  { day: "Sun", recipe: "miso-butter-salmon", note: "Test version 2" }
];

export const inventoryGroups = {
  freezer: [
    { name: "GOLD", qty: 8, unit: "60 ml cubes", state: "good" },
    { name: "RED", qty: 6, unit: "90 ml cubes", state: "good" },
    { name: "ASIAN", qty: 6, unit: "60 ml cubes", state: "good" },
    { name: "DARK", qty: 8, unit: "30 ml cubes", state: "good" },
    { name: "GREEN", qty: 4, unit: "30 ml cubes", state: "good" },
    { name: "FIRE", qty: 4, unit: "90 ml cubes", state: "good" },
    { name: "BLOND", qty: 5, unit: "60 ml cubes", state: "good" },
    { name: "SAMBAL", qty: 4, unit: "60 ml cubes", state: "good" },
    { name: "Chicken portions", qty: 4, unit: "dinners", state: "good" },
    { name: "Beef", qty: 2, unit: "portions", state: "good" },
    { name: "Salmon", qty: 1, unit: "dinner", state: "low" },
    { name: "Cooked rice", qty: 5, unit: "portions", state: "good" }
  ],
  fridge: [
    { name: "Cream", qty: 1, unit: "half carton", state: "low" },
    { name: "Eggs", qty: 8, unit: "eggs", state: "good" },
    { name: "Parmesan", qty: 1, unit: "piece", state: "good" },
    { name: "Broccoli", qty: 2, unit: "heads", state: "good" },
    { name: "Mushrooms", qty: 1, unit: "box", state: "use" },
    { name: "Spinach", qty: 1, unit: "bag", state: "use" }
  ],
  pantry: [
    { name: "Spaghetti", qty: 2, unit: "packs", state: "good" },
    { name: "Asian noodles", qty: 3, unit: "packs", state: "good" },
    { name: "Basmati rice", qty: 1, unit: "bag", state: "good" },
    { name: "Coconut milk", qty: 3, unit: "cans", state: "good" },
    { name: "Miso", qty: 1, unit: "tub", state: "good" }
  ]
};

export const monthPool = {
  favourites: ["mustard-mushroom-chicken", "beef-ragu", "gold-coconut-chicken", "sambal-prawns", "blond-lemon-chicken"],
  revisit: ["shakshuka", "green-chicken-pasta", "gold-chana", "sambal-eggs"],
  newTests: ["miso-butter-salmon", "saag-chicken", "gochujang-chicken-bowl", "blond-mushroom-pasta"],
  emergency: ["asian-chilli-noodles", "shakshuka", "sambal-eggs"],
  weekend: ["fire-roast-chicken", "lemongrass-coconut-chicken"]
};

export const guides = [
  { slug: "system", title: "How Home Meals works", eyebrow: "Start here", blurb: "Mother base → mid-base → booster → fresh finisher → fresh-cooked dinner." },
  { slug: "cubes", title: "Cube sizes", eyebrow: "30 / 60 / 90", blurb: "What each module means and why standard portions make the kitchen repeatable." },
  { slug: "prep-day", title: "Prep-day workflow", eyebrow: "Work in parallel", blurb: "The order of operations for batch prep without turning the weekend into a factory shift." },
  { slug: "freezer", title: "Freezer organisation", eyebrow: "Physical system", blurb: "Bases, mids, proteins, vegetables and carbs arranged for fast human use and future camera recognition." },
  { slug: "protein", title: "Protein portioning", eyebrow: "Raw, flat, flexible", blurb: "Why most proteins stay uncooked and how to freeze one-dinner portions." },
  { slug: "rice", title: "Freezing rice properly", eyebrow: "Thin portions", blurb: "How to freeze and reheat rice without making one enormous frozen block." },
  { slug: "storage", title: "JB storage rules", eyebrow: "Humidity-aware", blurb: "A freezer-first pantry strategy for a warm, humid kitchen." },
  { slug: "builder", title: "Build-a-meal matrix", eyebrow: "One set, many dinners", blurb: "Protein + mother base + mid-base + finisher + vegetable + carb + method." }
];

export const starterPrepShop = {
  "Produce": ["Tomatoes 2.6-3 kg", "Onions 1.7-2 kg", "Shallots 1 kg", "Leeks 350 g", "Celery 2-3 stalks", "Garlic 500-600 g", "Ginger 300 g", "Red peppers 1.2 kg", "Fresh chillies", "Soft herbs 250 g", "Lemons 4", "Limes 4", "Spinach 600 g", "Mushrooms 700 g"],
  "Pantry & spices": ["Tomato paste 120 g", "Dried chillies 180 g", "Tamarind concentrate", "Cumin", "Coriander", "Turmeric", "Smoked paprika", "Miso", "Gochujang", "Soy sauce", "Sesame oil", "Coconut milk 4-6 cans", "Olive oil", "Neutral oil"],
  "Cold": ["Butter", "Cooking cream", "Yoghurt", "Parmesan"],
  "Stocks & proteins": ["2.5 L unsalted stock or stock-making ingredients", "Chicken thighs", "Salmon", "Prawns", "Minced beef", "Eggs", "Tofu optional"],
  "Carbs & freezer veg": ["Basmati rice", "Jasmine rice", "Pasta", "Asian noodles", "Potatoes", "Flatbread", "Frozen broccoli", "Frozen peas", "Frozen green beans", "Frozen edamame"]
};

export const recipeBySlug = (slug: string) => recipes.find((r) => r.slug === slug);
export const baseBySlug = (slug: string) => bases.find((b) => b.slug === slug);
