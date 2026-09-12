export type Base = {
  slug: string;
  name: string;
  code: string;
  size: string;
  tone: string;
  summary: string;
  ingredients: string[];
  directions: string[];
  becomes: string[];
  finishers: string[];
  troubleshooting: { issue: string; fix: string }[];
};

export type Recipe = {
  slug: string;
  title: string;
  subtitle: string;
  time: number;
  cuisine: string;
  rating: number;
  base: string;
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
    slug: "red",
    name: "Concentrated tomato base",
    code: "RED",
    size: "90 ml",
    tone: "#ef5b45",
    summary: "A neutral, deeply cooked tomato foundation kept deliberately free of strong herbs so it can travel across cuisines.",
    ingredients: ["onion", "garlic", "tomatoes", "tomato paste", "olive oil", "salt"],
    directions: ["Sweat onion slowly until sweet.", "Add garlic briefly without browning.", "Cook tomato paste until brick red.", "Add tomatoes and reduce until glossy and concentrated.", "Cool completely, portion into 90 ml moulds and freeze."],
    becomes: ["Pomodoro", "Arrabbiata", "Meatballs", "Bolognese", "Shakshuka", "Tomato chickpeas", "Baked fish", "Cumin-chilli bowls"],
    finishers: ["basil + Parmesan", "cream + chilli", "cumin + smoked paprika", "GOLD + cream"],
    troubleshooting: [{ issue: "Watery after thawing", fix: "Reduce the base further before portioning. RED should be concentrated, not pasta sauce." }, { issue: "Tastes too Italian", fix: "Pull back oregano and basil. Add those only when finishing a meal." }]
  },
  {
    slug: "gold",
    name: "Onion-tomato masala",
    code: "GOLD",
    size: "60 ml",
    tone: "#e3a72f",
    summary: "The workhorse curry foundation: onion, ginger, garlic and tomato cooked down once, then finished differently every night.",
    ingredients: ["onion", "ginger", "garlic", "tomato", "cumin", "coriander", "turmeric", "chilli"],
    directions: ["Brown onion beyond translucent until properly golden.", "Add ginger and garlic; cook out the raw edge.", "Bloom spices gently.", "Add tomato and reduce until the oil begins to separate.", "Cool, portion into 60 ml moulds and freeze."],
    becomes: ["Chicken curry", "Coconut curry", "Chana masala", "Egg curry", "Paneer masala", "Fish curry", "Saag chicken", "Aloo gobi"],
    finishers: ["coconut milk", "cream + butter", "yoghurt", "spinach purée", "extra tomato"],
    troubleshooting: [{ issue: "Flat flavour", fix: "The onion likely needed more colour or the tomato needed more reduction." }, { issue: "Too spicy for reuse", fix: "Keep base chilli moderate; add heat at finishing stage." }]
  },
  {
    slug: "asian",
    name: "Asian aromatic base",
    code: "ASIAN",
    size: "60 ml",
    tone: "#5b9f76",
    summary: "Shallot, garlic, ginger and chilli cooked into a flexible aromatic base for quick stir-fries, braises, noodles and coconut dishes.",
    ingredients: ["shallot", "garlic", "ginger", "chilli", "neutral oil"],
    directions: ["Finely blend or mince aromatics.", "Cook gently until fragrant and moisture has reduced.", "Keep lemongrass separate for maximum flexibility.", "Cool and portion into 60 ml cubes."],
    becomes: ["Ginger-soy chicken", "Stir-fried beef", "Fried rice", "Chilli-garlic noodles", "Prawn noodles", "Coconut chicken", "Sambal-style dishes", "Braised chicken"],
    finishers: ["soy + honey", "fish sauce + lime", "oyster sauce", "sesame", "coconut + lime"],
    troubleshooting: [{ issue: "Bitter garlic", fix: "Heat was too high. Aromatics should soften and sweeten, not fry dark." }]
  },
  {
    slug: "dark",
    name: "Concentrated stock / jus",
    code: "DARK",
    size: "30 ml",
    tone: "#4b392f",
    summary: "The restaurant cube: concentrated chicken or beef stock that turns a fast pan sauce into something that tastes slow-cooked.",
    ingredients: ["good stock", "optional roast bones", "onion", "carrot", "celery"],
    directions: ["Start with properly flavoured stock.", "Reduce slowly until intensely savoury and lightly gelatinous.", "Strain and chill.", "Portion into 30 ml cubes."],
    becomes: ["Mustard pan sauce", "Mushroom cream chicken", "Peppercorn sauce", "Miso butter glaze", "Quick braise", "Deeper ragù"],
    finishers: ["butter + Dijon", "cream + mushroom", "black pepper + cream", "miso + butter", "RED"],
    troubleshooting: [{ issue: "Too salty", fix: "Use unsalted or lightly salted stock before reducing." }]
  },
  {
    slug: "green",
    name: "Green herb base",
    code: "GREEN",
    size: "30 ml",
    tone: "#4c9b58",
    summary: "A bright herb concentrate for fast finishing: parsley, coriander or basil, garlic, oil and citrus zest.",
    ingredients: ["mixed herbs", "garlic", "olive oil", "lemon zest"],
    directions: ["Wash and dry herbs thoroughly.", "Blend with garlic, oil and zest.", "Keep acid modest before freezing.", "Freeze in 30 ml cubes."],
    becomes: ["Pesto chicken", "Pesto salmon", "Creamy green pasta", "Herb potatoes", "Green rice bowls", "Roast fish"],
    finishers: ["Parmesan", "butter", "cream", "lemon", "toasted nuts"],
    troubleshooting: [{ issue: "Dull colour", fix: "Dry herbs well, blend quickly and freeze immediately." }]
  },
  {
    slug: "fire",
    name: "Roasted pepper & chilli base",
    code: "FIRE",
    size: "90 ml",
    tone: "#e34d38",
    summary: "A roasted pepper, tomato, chilli and garlic base that stays culturally neutral until you finish it.",
    ingredients: ["roasted peppers", "tomato", "chilli", "garlic", "olive oil"],
    directions: ["Char and peel peppers.", "Cook garlic gently.", "Add tomato and chilli, then reduce.", "Blend to desired texture.", "Portion into 90 ml moulds."],
    becomes: ["Harissa-style chicken", "Spicy tomato pasta", "Baked fish", "Spicy prawns", "Shakshuka", "Chilli beans", "Roasted vegetable stew"],
    finishers: ["cumin + yoghurt", "smoked paprika", "lemon", "cream", "coriander"],
    troubleshooting: [{ issue: "Too one-note", fix: "Add finishing acid, dairy or warm spices at cooking time rather than loading the base." }]
  }
];

export const boosters = [
  { code: "GG", name: "Ginger + garlic", size: "30 ml" },
  { code: "G", name: "Pure garlic", size: "20–30 ml" },
  { code: "GB", name: "Garlic butter", size: "30 ml" },
  { code: "CH", name: "Chilli paste", size: "30 ml" },
  { code: "CO", name: "Caramelised onion", size: "30–60 ml" },
  { code: "ST", name: "Concentrated stock", size: "30 ml" },
  { code: "PE", name: "Pesto", size: "30–60 ml" },
  { code: "LE", name: "Lemongrass + ginger + chilli", size: "30 ml" }
];

export const recipes: Recipe[] = [
  { slug: "mustard-mushroom-chicken", title: "Mustard mushroom chicken", subtitle: "Silky pan sauce, proper weeknight comfort", time: 22, cuisine: "French-ish", rating: 9.2, base: "DARK", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "dark", inventory: "Ready", ingredients: ["2 chicken thighs", "2 DARK cubes", "180 g mushrooms", "120 ml cream", "1 tbsp Dijon", "parsley", "pasta or potatoes"], steps: ["Season and sear chicken until deeply golden; remove.", "Brown mushrooms in the same pan.", "Add DARK cubes and a splash of water; scrape the fond.", "Stir in Dijon and cream.", "Return chicken and simmer until cooked through.", "Finish with parsley and black pepper."], tags: ["weekday", "creamy", "one-pan"] },
  { slug: "gold-coconut-chicken", title: "GOLD coconut chicken", subtitle: "Fast curry from the freezer system", time: 24, cuisine: "Indian / SEA", rating: 9.0, base: "GOLD", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "gold", inventory: "Ready", ingredients: ["350 g chicken thigh", "2 GOLD cubes", "200 ml coconut milk", "spinach", "lime", "basmati rice"], steps: ["Sear chicken lightly.", "Melt GOLD cubes into the pan.", "Add coconut milk and simmer.", "Fold in spinach.", "Return chicken and cook through.", "Finish with lime and chilli to taste."], tags: ["curry", "freezer-first", "weekday"] },
  { slug: "pesto-salmon", title: "Pesto salmon & roast vegetables", subtitle: "Crisp-edged salmon with a bright GREEN finish", time: 25, cuisine: "Mediterranean", rating: 8.8, base: "GREEN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "green", inventory: "1 item", ingredients: ["2 salmon fillets", "1 GREEN cube", "broccoli", "zucchini", "lemon", "Parmesan"], steps: ["Roast vegetables at high heat.", "Season salmon and roast or air-fry.", "Warm GREEN cube gently.", "Loosen with lemon and a little oil.", "Spoon over salmon and finish with Parmesan."], tags: ["fish", "air-fryer", "fresh"] },
  { slug: "beef-ragu", title: "Weeknight beef ragù", subtitle: "RED + DARK for a long-cooked taste in under 30 minutes", time: 28, cuisine: "Italian", rating: 9.3, base: "RED", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "red", inventory: "Ready", ingredients: ["300 g minced beef", "2 RED cubes", "1 DARK cube", "spaghetti", "Parmesan", "optional mushrooms"], steps: ["Brown beef hard in a wide pan.", "Add RED and DARK cubes.", "Loosen with pasta water and simmer.", "Toss with spaghetti.", "Finish with Parmesan and black pepper."], tags: ["pasta", "comfort", "freezer-first"] },
  { slug: "ginger-soy-prawns", title: "Ginger soy prawns", subtitle: "Glossy, fast and built around the ASIAN aromatic cube", time: 15, cuisine: "Asian", rating: 8.9, base: "ASIAN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Shop", ingredients: ["400 g prawns", "1 ASIAN cube", "soy", "honey", "sesame oil", "green beans", "rice"], steps: ["Sear prawns quickly and remove.", "Melt ASIAN cube.", "Add soy, honey and a splash of water.", "Toss in beans, then prawns.", "Finish with sesame oil."], tags: ["15-minute", "seafood", "stir-fry"] },
  { slug: "fire-roast-chicken", title: "FIRE roast chicken", subtitle: "Roasted pepper heat, yoghurt and cumin", time: 35, cuisine: "Middle Eastern-ish", rating: 8.7, base: "FIRE", cubeCount: 2, serves: 2, difficulty: "Medium", imageTone: "fire", inventory: "Ready", ingredients: ["4 chicken thighs", "2 FIRE cubes", "2 tbsp yoghurt", "cumin", "cauliflower", "flatbread"], steps: ["Mix FIRE with yoghurt and cumin.", "Coat chicken and rest while oven heats.", "Roast chicken and cauliflower together.", "Warm flatbread.", "Finish with lemon and herbs."], tags: ["oven", "spicy", "weekend-ish"] },
  { slug: "shakshuka", title: "RED shakshuka", subtitle: "A fast brunch or emergency dinner", time: 18, cuisine: "Mediterranean", rating: 8.4, base: "RED", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "red", inventory: "Ready", ingredients: ["2 RED cubes", "4 eggs", "cumin", "smoked paprika", "feta", "flatbread"], steps: ["Warm RED with cumin and paprika.", "Add a little water to loosen.", "Make four wells and crack eggs in.", "Cover until eggs are set to preference.", "Finish with feta and herbs."], tags: ["eggs", "emergency", "vegetarian"] },
  { slug: "green-chicken-pasta", title: "Creamy GREEN chicken pasta", subtitle: "Herby, creamy, not tomato", time: 20, cuisine: "Italian-ish", rating: 8.8, base: "GREEN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "green", inventory: "Ready", ingredients: ["250 g chicken breast", "1 GREEN cube", "120 ml cream", "penne", "Parmesan", "peas"], steps: ["Boil pasta.", "Sear sliced chicken.", "Add GREEN and cream.", "Fold in peas and pasta.", "Finish with Parmesan and lemon."], tags: ["pasta", "creamy", "20-minute"] },
  { slug: "gold-chana", title: "GOLD chana masala", subtitle: "Pantry dinner with proper depth", time: 20, cuisine: "Indian", rating: 8.6, base: "GOLD", cubeCount: 2, serves: 2, difficulty: "Easy", imageTone: "gold", inventory: "Ready", ingredients: ["2 GOLD cubes", "1 can chickpeas", "tomato", "garam masala", "yoghurt", "coriander"], steps: ["Warm GOLD until sizzling.", "Add tomato and garam masala.", "Fold in chickpeas and a splash of water.", "Simmer until glossy.", "Finish with yoghurt and coriander."], tags: ["vegetarian", "pantry", "20-minute"] },
  { slug: "miso-butter-salmon", title: "Miso butter salmon", subtitle: "DARK stock turns the glaze savoury and glossy", time: 18, cuisine: "Japanese-ish", rating: 9.1, base: "DARK", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "dark", inventory: "1 item", ingredients: ["2 salmon fillets", "1 DARK cube", "1 tbsp miso", "20 g butter", "broccoli", "rice"], steps: ["Roast or air-fry salmon.", "Melt DARK with one tablespoon water.", "Whisk in miso off high heat.", "Mount with butter.", "Brush over salmon and serve with broccoli and rice."], tags: ["fish", "air-fryer", "18-minute"] },
  { slug: "asian-chilli-noodles", title: "Chilli garlic noodles", subtitle: "ASIAN + CH booster for an emergency 12-minute dinner", time: 12, cuisine: "Asian", rating: 8.5, base: "ASIAN", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "asian", inventory: "Ready", ingredients: ["1 ASIAN cube", "1 CH cube", "noodles", "soy", "egg", "spring onion"], steps: ["Boil noodles.", "Fry ASIAN and CH cubes.", "Add soy and noodle water.", "Toss noodles through sauce.", "Top with fried egg and spring onion."], tags: ["emergency", "12-minute", "noodles"] },
  { slug: "fire-prawns", title: "FIRE prawns with lemon yoghurt", subtitle: "Fast heat balanced by cool yoghurt", time: 16, cuisine: "Mediterranean-ish", rating: 8.7, base: "FIRE", cubeCount: 1, serves: 2, difficulty: "Easy", imageTone: "fire", inventory: "Shop", ingredients: ["400 g prawns", "1 FIRE cube", "yoghurt", "lemon", "couscous", "cucumber"], steps: ["Prepare couscous.", "Sear prawns.", "Add FIRE and toss until glossy.", "Mix yoghurt with lemon and salt.", "Serve over couscous with cucumber."], tags: ["seafood", "16-minute", "spicy"] }
];

export const weeklyPlan = [
  { day: "Mon", recipe: "mustard-mushroom-chicken", note: "Use mushrooms first" },
  { day: "Tue", recipe: "gold-coconut-chicken", note: "Spinach use-soon" },
  { day: "Wed", recipe: "pesto-salmon", note: "Fresh night" },
  { day: "Thu", recipe: "beef-ragu", note: "Freezer-friendly" },
  { day: "Fri", recipe: "ginger-soy-prawns", note: "Pick up prawns" },
  { day: "Sat", recipe: "fire-roast-chicken", note: "Oven dinner" },
  { day: "Sun", recipe: "miso-butter-salmon", note: "Test version 2" }
];

export const inventoryGroups = {
  freezer: [
    { name: "GOLD", qty: 8, unit: "60 ml cubes", state: "good" },
    { name: "RED", qty: 4, unit: "90 ml cubes", state: "good" },
    { name: "DARK", qty: 5, unit: "30 ml cubes", state: "good" },
    { name: "GREEN", qty: 3, unit: "30 ml cubes", state: "low" },
    { name: "FIRE", qty: 4, unit: "90 ml cubes", state: "good" },
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
  favourites: ["mustard-mushroom-chicken", "beef-ragu", "gold-coconut-chicken", "pesto-salmon"],
  revisit: ["shakshuka", "green-chicken-pasta", "gold-chana"],
  newTests: ["miso-butter-salmon", "fire-prawns"],
  emergency: ["asian-chilli-noodles", "shakshuka"],
  weekend: ["fire-roast-chicken"]
};

export const guides = [
  { slug: "system", title: "How Home Meals works", eyebrow: "Start here", blurb: "The physical cooking architecture: prep the boring 70%, then genuinely cook dinner fresh." },
  { slug: "cubes", title: "Cube sizes", eyebrow: "30 / 60 / 90", blurb: "What each module means and why standard portions make the whole kitchen repeatable." },
  { slug: "prep-day", title: "Prep-day workflow", eyebrow: "2 hours → weeks", blurb: "The order of operations for efficient batch prep without turning Sunday into a factory shift." },
  { slug: "freezer", title: "Freezer organisation", eyebrow: "3 drawers", blurb: "Bases, proteins, vegetables and carbs arranged so a photo can eventually understand them too." },
  { slug: "protein", title: "Protein portioning", eyebrow: "Raw, flat, flexible", blurb: "Why most proteins stay uncooked and how to freeze one-dinner portions." },
  { slug: "rice", title: "Freezing rice properly", eyebrow: "Thin portions", blurb: "How to freeze and reheat rice without creating one enormous frozen brick." },
  { slug: "storage", title: "JB storage rules", eyebrow: "Humidity-aware", blurb: "A freezer-first pantry strategy for a warm, humid kitchen." },
  { slug: "builder", title: "Build-a-meal matrix", eyebrow: "One set, many dinners", blurb: "Protein + base + mid-base + vegetable + carb + method." }
];

export const recipeBySlug = (slug: string) => recipes.find((r) => r.slug === slug);
export const baseBySlug = (slug: string) => bases.find((b) => b.slug === slug);
