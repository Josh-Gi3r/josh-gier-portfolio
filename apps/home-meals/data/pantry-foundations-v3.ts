export type PantryFoundationV3=Readonly<{
  id:string;
  name:string;
  lane:string;
  role:string;
  currentOrPlanned:"current"|"planned";
}>;

/**
 * Pantry foundations complement mothers/mids/boosters. They are not freezer prep and
 * should not be promoted into a prep object merely to make the architecture look uniform.
 * Phase 2 binds exact brands/labels where kcal/sodium or ingredient identity requires it.
 */
export const pantryFoundationsV3:readonly PantryFoundationV3[]=[
  {id:"light-soy",name:"Chinese light soy sauce",lane:"Chinese",role:"salt + umami",currentOrPlanned:"current"},
  {id:"dark-soy",name:"Chinese dark soy sauce",lane:"Chinese",role:"colour + deep soy",currentOrPlanned:"current"},
  {id:"oyster-sauce",name:"Oyster sauce",lane:"Chinese / Thai",role:"sweet-savoury body",currentOrPlanned:"current"},
  {id:"shaoxing-wine",name:"Shaoxing wine",lane:"Chinese",role:"aroma + deglaze",currentOrPlanned:"current"},
  {id:"sesame-oil",name:"Toasted sesame oil",lane:"East Asian",role:"finishing aroma",currentOrPlanned:"current"},
  {id:"chinkiang-vinegar",name:"Chinkiang black vinegar",lane:"Chinese",role:"dark acidity",currentOrPlanned:"planned"},
  {id:"hoisin",name:"Hoisin sauce",lane:"Chinese",role:"sweet fermented glaze",currentOrPlanned:"planned"},
  {id:"chilli-oil",name:"Chilli oil / crisp",lane:"Chinese",role:"heat + finishing oil",currentOrPlanned:"planned"},
  {id:"fish-sauce",name:"Fish sauce",lane:"Southeast Asian",role:"salt + fermented umami",currentOrPlanned:"current"},
  {id:"tamarind",name:"Tamarind concentrate / pulp",lane:"South / Southeast Asian",role:"fruit acidity",currentOrPlanned:"current"},
  {id:"palm-sugar",name:"Palm sugar",lane:"Southeast Asian",role:"round sweetness",currentOrPlanned:"current"},
  {id:"kecap-manis",name:"Kecap manis",lane:"Indonesian / Malaysian",role:"sweet soy glaze",currentOrPlanned:"planned"},
  {id:"belacan",name:"Belacan / shrimp paste",lane:"Malaysian",role:"fermented savoury depth",currentOrPlanned:"current"},
  {id:"coconut-milk",name:"Coconut milk",lane:"South / Southeast Asian",role:"richness + curry body",currentOrPlanned:"current"},
  {id:"coconut-water",name:"Coconut water",lane:"Vietnamese",role:"braise liquid + gentle sweetness",currentOrPlanned:"planned"},
  {id:"japanese-soy",name:"Japanese soy sauce",lane:"Japanese",role:"salt + umami",currentOrPlanned:"current"},
  {id:"mirin",name:"Mirin",lane:"Japanese",role:"sweetness + glaze",currentOrPlanned:"current"},
  {id:"sake",name:"Cooking sake",lane:"Japanese",role:"aroma + deglaze",currentOrPlanned:"current"},
  {id:"white-miso",name:"White miso",lane:"Japanese",role:"fermented body",currentOrPlanned:"current"},
  {id:"gochujang",name:"Gochujang",lane:"Korean",role:"fermented heat + sweetness",currentOrPlanned:"current"},
  {id:"doenjang",name:"Doenjang",lane:"Korean",role:"fermented savoury body",currentOrPlanned:"planned"},
  {id:"korean-soy",name:"Korean soup / seasoning soy",lane:"Korean",role:"salt + savoury seasoning",currentOrPlanned:"planned"},
  {id:"worcestershire",name:"Worcestershire sauce",lane:"Western / Japanese-western",role:"acid + fermented savouriness",currentOrPlanned:"planned"},
  {id:"dijon",name:"Dijon mustard",lane:"French / Western",role:"acid + mustard heat",currentOrPlanned:"current"},
  {id:"wholegrain-mustard",name:"Wholegrain mustard",lane:"French / Western",role:"texture + mustard acidity",currentOrPlanned:"current"},
  {id:"rice-vinegar",name:"Rice vinegar",lane:"East Asian",role:"clean acidity",currentOrPlanned:"planned"},
  {id:"hot-sauce",name:"Hot sauce",lane:"Global",role:"table heat + acid",currentOrPlanned:"planned"},
  {id:"chipotle-adobo",name:"Chipotles in adobo",lane:"Mexican",role:"smoke + chilli + acid",currentOrPlanned:"current"},
  {id:"red-wine-vinegar",name:"Red wine vinegar",lane:"Mediterranean / Western",role:"sharp acidity",currentOrPlanned:"current"},
  {id:"balsamic",name:"Balsamic vinegar",lane:"Italian / Western",role:"sweet acidity",currentOrPlanned:"planned"}
] as const;

export const mealWeightDefinitionsV3={
  light:"Designed to feel lighter; Phase 2 reference target is normally <=500 kcal/person.",
  balanced:"Everyday middle lane; Phase 2 reference target is normally 500–700 kcal/person.",
  hearty:"Substantial meal; Phase 2 reference target is normally 700–900 kcal/person.",
  rich:"Deliberately indulgent/energy-dense; Phase 2 reference target is often >900 kcal/person."
} as const;
