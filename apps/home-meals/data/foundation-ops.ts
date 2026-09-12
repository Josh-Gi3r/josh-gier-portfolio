export type PrepStage={minute:number;title:string;detail:string;codes?:string[]};
export type GroceryGroup={group:string;items:string[]};

export const firstRunCodes={
 mothers:["RED","GOLD","REMPAH","SAMBAL","DARK","BLOND"],
 mids:["PESTO","THAI-G","WOK-B","TARE-T"],
 boosters:["GG","CH","CO","HERB"]
};

export const hotFoundationTimeline:PrepStage[]=[
 {minute:0,title:"Set up, soak, label",detail:"Clear freezer shelf space. Label cooling containers and trays. Soak dried chillies. Weigh all six mother-base ingredient sets before heat starts.",codes:["RED","GOLD","REMPAH","SAMBAL","DARK","BLOND"]},
 {minute:15,title:"DARK on first",detail:"Put the unsalted brown stock on a wide-pot reduction. It can reduce quietly while every other base is made.",codes:["DARK"]},
 {minute:25,title:"GOLD onions start",detail:"Wide heavy pan, medium heat. Give the onions enough time to become genuinely golden before ginger, garlic or tomato enters.",codes:["GOLD"]},
 {minute:35,title:"BLOND alliums start",detail:"Second pan, lower heat. Onion and leek must soften completely without taking the deep colour of GOLD.",codes:["BLOND"]},
 {minute:45,title:"Blend RED / REMPAH / SAMBAL mise",detail:"Use the blender from mildest to strongest: RED tomato/aromatics, then REMPAH, then chilli-heavy SAMBAL. This reduces washing and cross-contamination.",codes:["RED","REMPAH","SAMBAL"]},
 {minute:60,title:"RED starts reducing",detail:"Get RED into its wide pan. The target is glossy concentration, not a loose pasta sauce.",codes:["RED"]},
 {minute:70,title:"REMPAH starts frying",detail:"Cook the aromatic paste patiently until the raw edge disappears and oil begins to release.",codes:["REMPAH"]},
 {minute:80,title:"SAMBAL starts frying",detail:"Give SAMBAL the wok and the time it needs to reach clear pecah minyak. Do not rush this stage.",codes:["SAMBAL"]},
 {minute:100,title:"Finish GOLD",detail:"Tomato should be fully cooked down and oil just beginning to show at the edges. Move to a shallow cooling container.",codes:["GOLD"]},
 {minute:115,title:"Finish BLOND",detail:"Remove thyme, reduce to a spoonable pale savoury foundation, then transfer to a shallow cooling container.",codes:["BLOND"]},
 {minute:130,title:"Check RED / REMPAH / SAMBAL",detail:"Use the visual cues, not only the clock. Pull each base when it reaches its correct texture and oil behaviour.",codes:["RED","REMPAH","SAMBAL"]},
 {minute:155,title:"Finish DARK reduction",detail:"Strain if needed and run the cold-spoon test. It should have body without tasting salty.",codes:["DARK"]},
 {minute:170,title:"Rapid cooling window",detail:"Spread hot bases in shallow containers. Keep lids loose while steam escapes; refrigerate promptly once safe to do so. Do not pour steaming food straight into crowded freezer drawers."},
 {minute:210,title:"Portion + label",detail:"Only portion once the bases are properly cooled. Use CODE / ML / DATE. Freeze trays with air space around them; bag the portions after they are solid."}
];

export const modifierSessionTimeline:PrepStage[]=[
 {minute:0,title:"Cold setup",detail:"Sanitise blender, dry herbs completely, lay out 15/30/60 ml trays and labels.",codes:["PESTO","THAI-G","WOK-B","TARE-T","GG","CH","CO","HERB"]},
 {minute:5,title:"Caramelised onion first",detail:"CO is the only slow modifier in this session. Start it immediately and let it cook while the cold sauces are made.",codes:["CO"]},
 {minute:10,title:"Teriyaki tare",detail:"Combine sake, mirin, Japanese soy and sugar; simmer briefly, then set aside to cool.",codes:["TARE-T"]},
 {minute:20,title:"Wok brown sauce",detail:"Mix the all-purpose brown sauce without starch. Starch is added only at final cooking.",codes:["WOK-B"]},
 {minute:30,title:"Thai green curry paste",detail:"Toast dry spices first, then process fresh aromatics to a fine cohesive paste. Add shrimp paste last.",codes:["THAI-G"]},
 {minute:50,title:"Pesto + herb oil",detail:"Work quickly and keep herbs cool. Make pesto first, then the cheese-free HERB booster.",codes:["PESTO","HERB"]},
 {minute:65,title:"GG + chilli booster",detail:"Blend ginger-garlic and neutral chilli pastes. Cook the chilli paste briefly before cooling.",codes:["GG","CH"]},
 {minute:80,title:"Finish CO",detail:"Caramelised onion should be deep mahogany, jammy and sweet without burnt bitterness.",codes:["CO"]},
 {minute:90,title:"Portion modifier set",detail:"15 ml boosters, 30 ml strong mids, 60 ml WOK-B. Label CODE / ML / DATE and freeze."}
];

export const firstRunGroceryGroups:GroceryGroup[]=[
 {group:"Core aromatics & produce",items:["yellow onions 2.75 kg","shallots 800 g","garlic 500 g","ginger 300 g","galangal 120 g","lemongrass 6 stalks","leeks 400 g","fresh turmeric 80 g","fresh basil 150 g","mixed parsley/coriander 150 g","green chillies 100 g","fresh red chillies 200 g","dried red chillies 120 g","carrot 200 g","celery 200 g","lemons 3","limes 4","coriander roots or extra stems 1 bunch"]},
 {group:"Tomato & stock",items:["whole peeled tomatoes 2 × 800 g cans","fresh tomatoes 700 g","tomato paste 1 × 170–200 g","unsalted chicken/brown stock 5.2 litres total, or ingredients to make it"]},
 {group:"Fats, nuts & dairy",items:["neutral cooking oil 1 litre","olive oil 500 ml","butter 250 g","Parmesan 100 g","candlenuts 60 g","pine nuts or cashews 60 g"]},
 {group:"Asian pantry",items:["belacan 50 g","shrimp paste 1 small jar","light soy sauce 1 bottle","dark soy sauce 1 small bottle","oyster sauce 1 bottle","sesame oil 1 bottle","Shaoxing wine 1 bottle","Japanese soy sauce 1 bottle","sake 250 ml","mirin 250 ml","tamarind concentrate 1 small pack/jar"]},
 {group:"Spices & sweeteners",items:["ground cumin","ground coriander","cumin seed","coriander seed","turmeric","Kashmiri chilli powder","white pepper","black peppercorns","bay leaves","thyme","palm sugar or brown sugar","white sugar","fine salt"]},
 {group:"Freezer hardware",items:["15 ml tray or small ice-cube tray","30 ml silicone tray","60 ml silicone tray","90 ml silicone tray","shallow cooling containers","freezer bags","freezer tape or labels","permanent marker"]}
];

export const fullLibraryExtraGroups:GroceryGroup[]=[
 {group:"Extra fresh ingredients for all mids",items:["spinach 700 g","mushrooms 800 g","roasted red peppers 2 large or 1 jar","extra green/red chillies 150 g","extra lemongrass 4 stalks","makrut lime 2 or zest source","Asian pear or apples 2"]},
 {group:"Extra Asian pantry for all mids",items:["white miso 200 g","gochujang 1 tub","rice vinegar","dried shrimp 50 g","chipotle in adobo 1 small can"]},
 {group:"Extra spice lane",items:["smoked paprika","cinnamon","cardamom","cloves","nutmeg","caraway","extra cumin/coriander seed"]},
 {group:"Optional fresh finishing stock",items:["yoghurt","cooking cream","coconut milk","spring onions","fresh limes/lemons","fresh herbs for the current week"]}
];

export const firstRunSummary={
 hotMinutes:210,
 modifierMinutes:90,
 sessions:2,
 mothers:6,
 mids:4,
 boosters:4,
 note:"The library contains 32 prep components, but the first run intentionally makes only 14. Add rotational mids when the menu calls for them."
};
