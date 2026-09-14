# Home Meals culinary verification ledger

Audit date: 2026-09-14

Scope: every current Home Meals food object, exactly 77 items: 8 mothers + 26 mids + 7 boosters + 36 dinners.

This is a culinary QA document, not a claim that Josh + G have physically cooked or approved these formulations.

## Truth rules

1. A published source can validate culinary identity, ingredient relationships, technique, safety guidance, and a reference ratio. It **cannot** prove the physical yield of a Home Meals batch.
2. Home Meals formulation quantities are allowed to be deliberate household/product decisions, but they must be labelled as such when they differ from a reference recipe.
3. Actual finished batch weight/volume, actual cook time, actual portion size and actual retained nutrient density remain unknown until measured in Josh + G's kitchen.
4. Sources are compared by function. Culinary sources validate food; official safety sources validate safety; manufacturer labels/food-composition databases validate nutrition. A food-safety page is never used as a recipe source.
5. `madeFrom` means an ingredient is physically consumed when producing the child component. `usedWith` is pairing only. This distinction controls inventory and nutrition and must not be blurred.

## Verdicts

- **PASS** — source-aligned enough to use as the current canonical formulation.
- **PASS · HOUSE** — culinarily sound, but explicitly a Home Meals reusable/adapted formulation rather than a canonical traditional recipe.
- **PASS · NAME/SOURCE FIX** — formulation is sound; wording or evidence needs correction.
- **ADJUST** — good architecture but a concrete formulation/dinner change is warranted.
- **REWORK · IDEA** — do not promote to production prep until redesigned; safe to keep as an idea.

Physical finished yield for every unmeasured Home batch: **UNKNOWN until measured**.

---

# A. 8 mothers

| # | Component | Verdict | Source comparison | Canonical decision |
|---|---|---|---|---|
| M1 | RED · Neutral concentrated tomato | PASS · HOUSE | S1 slow-cooked tomato technique + S2 Marcella tomato benchmark. Both support long reduction and clean tomato flavour; neither defines Home's neutral reusable base. | Keep 3.2 kg canned tomato formulation as Home neutral tomato mother. No herbs/cream. Keep actual finished weight unknown until measured. |
| M2 | BLOND · Italian soffritto | PASS · NAME/SOURCE FIX | S3 confirms soffritto is onion/celery/carrot gently cooked in fat; ratios vary. | Rename display identity to **Home Italian-style soffritto**. Keep 600:300:300 as a house batching ratio, not an Italian universal ratio. |
| M3 | GOLD · Bhuna onion-tomato masala | PASS · HOUSE | S4 uses ~1 kg onion, ~750 g tomato, ginger/garlic/spices and a long brown-onion cook; S5 confirms make-ahead onion-tomato masala architecture. | Keep 1 kg onion / 650 g tomato Home formula. Fix source URL to live S4. Keep cue-driven deep browning/oil separation. Do not claim copied/authentic universal bhuna masala. |
| M4 | SAMBAL · Sambal tumis concentrate | PASS · HOUSE | S6 and S7 support dried chilli, shallot/onion, garlic, belacan, oil, tamarind/sugar and pecah minyak. | Keep as lightly finished Home sambal mother. Tamarind/sugar late; sliced finishing onion stays at dinner. |
| M5 | REMPAH · Malay/Nyonya aromatic starter | PASS · HOUSE | S8 rendang and S9 curry laksa show overlapping shallot/garlic/lemongrass/galangal/turmeric/candlenut families but different pastes. | Keep explicitly as **Home Malay/Nyonya aromatic starter** with no claim that one universal rempah exists. Chilli remains branch-specific. |
| M6 | CLEAR · Unsalted light chicken stock | PASS | S10 supports bones/carcasses, gentle 3 h-ish simmer, skimming and straining. | Keep unsalted. Actual final ml is measured after cooling; never top up to an assumed batch yield. |
| M7 | DARK · Unsalted brown stock concentrate | PASS · HOUSE | S11 supports deep-roasted chicken bones, vegetables, tomato paste, deglazing, gentle stock extraction. | Keep Home additional reduction to a gel/jus concentrate. No added salt. Final mass remains measured household data only. |
| M8 | ONION · Deep caramelised onion | PASS | S12 family + standard caramelisation technique support slow cooking, fond development/deglazing and deep mahogany endpoint. | Keep. Deep caramelisation is appropriate for ONION itself, but do not automatically use it in dishes that need only golden fried onion. |

---

# B. 26 mids

| # | Component | Verdict | Source comparison | Canonical decision |
|---|---|---|---|---|
| D1 | MAKHANI | **REWORK · IDEA** | S13 butter/makhani technique is tomato-cashew-butter-led; S5 explicitly notes onion-masala shortcut butter chicken is inferior to the original route. | Remove physical `madeFrom: GOLD`. Rebuild MAKHANI as a standalone tomato-cashew-butter concentrate; cream remains a dinner finisher. Do not stock until reformulated. |
| D2 | SAAG | PASS · HOUSE | S14 supports concentrated spinach/palak with chilli and a separate onion-tomato/chicken curry base. | Keep independent SAAG used with GOLD. Add kasuri methi/lemon/cream or yoghurt at dinner as appropriate. |
| D3 | KORMA | **REWORK · IDEA** | S15 and corroborating North Indian/Pakistani korma references use golden/fried onion, yoghurt, nuts and warm spices. Home ONION is much darker/jammier. | Remove physical `madeFrom: ONION`. Give KORMA its own golden onion input or leave fresh onion at dinner. Keep as idea until corrected. |
| D4 | RENDANG | PASS · HOUSE | S8 supports chilli + lemongrass/galangal/shallot/garlic/ginger family with coconut/kerisik finishing. | Keep REMPAH-derived Home concentrate; kerisik, coconut milk, tamarind and final reduction remain dinner-specific. |
| D5 | LAKSA | PASS · HOUSE | S9 supports chilli, dried shrimp, belacan and aromatic laksa paste, with coconut/broth built later. | Keep REMPAH-derived LAKSA. Dinner consumes LAKSA + CLEAR, never REMPAH again. |
| D6 | KARI | PASS · HOUSE | S16 Malaysian curry references support curry powder plus shallot/garlic/ginger/chilli/lemongrass and oil-frying. | Keep as demand-driven **Home Malaysian curry paste**, not a universal Malaysian curry. |
| D7 | ASAM | PASS · HOUSE | S17 and regional variants support chilli/shallot/belacan/aromatics with tamarind and herbs in final curry. | Keep Nyonya-leaning Home paste. Keep tamarind/daun kesum/torch ginger as final-dish elements where available. |
| D8 | THAI-G | PASS | S18 green curry paste architecture aligns closely with current coriander/cumin/pepper/chilli/lemongrass/galangal/makrut/coriander root/shallot/garlic/shrimp paste. | Keep. Do not fry before storage; fry in coconut fat at dinner. |
| D9 | THAI-R | PASS | S19 red curry paste architecture closely matches. | Keep. |
| D10 | NPP · Nam prik pao | PASS · HOUSE | S20 supports dried chilli, shallot, garlic, dried shrimp, tamarind, palm sugar/fish sauce and oil-frying to glossy dark paste. | Keep as Home batch condiment. |
| D11 | KRAPOW | PASS | S21 separates sauce from pounded garlic/chilli and fresh holy basil. | Keep sauce-only architecture. G + CH separate; holy basil always fresh. Never duplicate sauce ingredients in dinner. |
| D12 | NUOC | PASS · HOUSE | S22 classic nuoc cham supports fish sauce, water, sugar, lime, garlic, chilli. | Keep make-ahead fish-sauce/water/sugar base; add lime/garlic/chilli fresh at serving. |
| D13 | WOK-B | PASS; DINNER DOSE ADJUST | S23 all-purpose brown sauce is stock + Shaoxing + soy/dark soy + oyster + sugar + sesame/pepper; current formulation is strongly aligned. | Keep production formula. Standard dinner use should move from 125 ml toward **150–160 ml** for the current two-person wok portions, then kitchen-test. |
| D14 | WOK-W | PASS | S24 supports stock-forward white sauce with ginger/garlic/scallion, salt/sugar/white pepper, sesame/oyster and cornstarch only at final cooking. | Keep 150 ml dinner use. Slurry remains dinner-time. |
| D15 | CHAR-SIU | PASS | S25 closely matches sugar/salt/five-spice/white pepper/sesame/Shaoxing/soy/hoisin/molasses/garlic. | Keep. Store clean marinade only; raw-meat-contact marinade never returns to the jar. |
| D16 | DOUBAN | PASS · HOUSE | S26 validates frying doubanjiang/douchi/aromatics/chilli in oil for Sichuan dishes, but not one universal concentrate. | Keep as **Home doubanjiang aromatic concentrate**. Do not label it as canonical mapo sauce. |
| D17 | GS-OIL | PASS | S27 supports ginger/scallion/salt with very hot oil poured over aromatics. | Keep fridge-first. |
| D18 | DASHI | PASS | S28 + S29 family support kombu + katsuobushi extraction around 1 L water. | Keep 960 ml water / 10 g kombu / 10 g katsuobushi. Published yield is reference only; Home measures its own final ml. |
| D19 | TERI | PASS | S30 + S31 support soy/sake/mirin/sugar and reduction to a glossy tare. | Keep general-purpose tare. Specific salmon/chicken dinners may have slightly different sauce ratios but can intentionally use the house tare. |
| D20 | JP-CURRY | PASS | S32 supports butter/flour roux with Japanese curry powder, garam masala and optional cayenne. | Keep weight-based roux. |
| D21 | K-STOCK | PASS | S33 exact Maangchi stock strongly matches anchovies/kelp/radish/scallion/onion/water. | Keep. Source yield is not Home yield; measure Home final ml. |
| D22 | GOCHU | PASS · HOUSE | S34/S35 show gochujang paired with soy/garlic/sugar/gochugaru and sometimes vinegar/syrup depending on dish. | Keep as **Home gochujang finishing sauce**, not a canonical Korean master sauce. |
| D23 | HARISSA | PASS · HOUSE | S36 family supports dried chilli, roasted pepper, garlic, cumin/coriander/caraway, oil and acid; recipes vary substantially by region. | Keep as Home harissa. Do not claim one canonical North African recipe. |
| D24 | CHIPOTLE | PASS · HOUSE | S37 supports chipotle/adobo/tomato/onion/garlic family in tinga; current concentrate is a broader smoky chipotle booster. | Keep standalone and `usedWith RED`; never call CHIPOTLE itself tinga sauce. |
| D25 | PESTO | PASS · HOUSE | S38 confirms basil/garlic/nuts/oil + cheese for finished pesto; S39 supports freezing pesto. | Keep cheese-free **freezer base** only. Finished pesto dishes must add Parmesan/Pecorino fresh or be named basil sauce. |
| D26 | DUX | PASS · HOUSE | S40 supports finely chopped mushrooms/shallot/butter/herbs cooked until moisture is gone. | Keep. BLOND/DARK are `usedWith`, not physical parents. |

---

# C. 7 boosters

| # | Component | Verdict | Source comparison | Canonical decision |
|---|---|---|---|---|
| B1 | GG · Ginger-garlic paste | PASS · HOUSE | S4/S14/S15 repeatedly use ginger+garlic in near-equal everyday Indian aromatic roles. | Keep equal-part Home convenience paste. Actual output weighed. |
| B2 | G · Garlic paste | PASS · HOUSE | Culinary role is straightforward; S41 gives the important garlic-in-oil safety boundary. | Keep freezer-first. Refrigerator window must remain conservative. |
| B3 | CH · Neutral chilli paste | PASS · HOUSE | This is a Home heat-control convenience component, not a traditional sauce. S6/S20 corroborate cooking raw chilli paste in oil. | Keep labelled Home neutral chilli paste. |
| B4 | LE · Lemongrass-galangal aromatic | PASS · HOUSE | S8/S9/S18/S19 repeatedly show this aromatic family. | Keep explicitly as Home shortcut, not a canonical standalone paste. |
| B5 | MASS · Massaman dry spice finish | PASS · HOUSE | S42 supports red curry paste plus toasted coriander/cumin and warm spices such as cardamom/cinnamon/clove/nutmeg. | Keep dry pantry booster, separate from THAI-R. Exact 7 g dinner dose is a Home formulation to taste-test. |
| B6 | MISO-G · Miso-ginger | **ADJUST** | S43 miso salmon is miso+sake+mirin+Japanese soy+tiny sesame oil; current Home batch adds substantial ginger+rice vinegar but omits soy. S44 dengaku is a different sweet miso glaze. | Rework MISO-G toward a coherent salmon/roast marinade: white miso + sake + mirin + Japanese soy + modest ginger + tiny sesame oil; remove rice vinegar. Keep Miso Dengaku dinner separate. |
| B7 | BUL · Bulgogi marinade | **ADJUST** | S45 and S46 both center soy, sugar, garlic, sesame oil, water/rice wine, thin beef; traditional versions add pear/onion. Ginger is not central. | Remove or sharply reduce ginger; add rice wine/water as needed; keep onion/scallion fresh at dinner. Current 60 g dose for 350 g beef is probably under-seasoned: test a source-scaled ~90–120 g range. |

---

# D. 36 dinners

| # | Dinner | Verdict | Source comparison | Canonical decision |
|---|---|---|---|---|
| R1 | Everyday chicken curry | PASS · HOUSE | S47 + S5 support chicken in onion-tomato masala with spices/water. | GOLD-only prep dependency is correct; do not re-add GG automatically because GOLD already contains ginger/garlic. |
| R2 | Chana masala | PASS · HOUSE | S48 confirms chickpeas simmered in onion-tomato masala with amchur/lemon and garam masala. | Keep GOLD architecture. Make amchur or final lemon mandatory; kasuri methi can be optional finish. |
| R3 | Punjabi egg curry | PASS · HOUSE | S49 confirms boiled eggs in onion-tomato masala; optional blistering and kasuri methi/cream. | Keep GOLD. Add optional egg blistering and kasuri methi cue. |
| R4 | Saag chicken | PASS · HOUSE | S14 confirms chicken + spinach/palak + onion/tomato/spices; cream/yoghurt/lemon and kasuri methi are common finishers. | Keep GOLD + SAAG. Ensure kasuri methi/lemon and optional dairy finishing are explicit. |
| R5 | Aloo matar | PASS · HOUSE | S50 confirms potato+peas in onion-tomato masala, water, garam masala/coriander. | Keep GOLD architecture. |
| R6 | Sambal udang | PASS | S7 confirms prawns briefly cooked in sambal with tamarind/water/makrut and rice. | Keep. Avoid overcooking prawns. |
| R7 | Sambal telur | PASS · SMALL ADJUST | S7 confirms hard-boiled eggs + cooked sambal + fresh onion rings; optional fried/blistered eggs. | Ensure fresh onion rings are required; keep egg blistering as optional better-texture variant. |
| R8 | Curry laksa | PASS · HOUSE | S9 supports laksa paste + coconut + broth + noodles/protein/tofu/sprouts. | Keep LAKSA + CLEAR only. REMPAH is already inside LAKSA. |
| R9 | Lemongrass coconut fish | PASS · HOUSE / SOURCE UPGRADE | Regional curry references support white fish + coconut + aromatic paste + fish sauce/lime, but no single source exactly defines this Home dish. | Keep as explicit household/cuisine-inspired dish; do not market as a canonical Malaysian recipe. Source against rempah/fish-curry family rather than a generic safety page. |
| R10 | Chicken rendang | PASS · HOUSE | S8 chicken rendang supports chicken thigh, chilli/aromatics, coconut, kerisik, lime leaves and long reduction. | Keep RENDANG + LE architecture. Reduce until coating/dry-ish rather than curry-like. |
| R11 | Thai green chicken curry | PASS | S51 supports green paste, coconut milk, chicken, Thai eggplant, fish sauce/palm sugar, makrut and Thai basil. | Keep. Fry paste in concentrated coconut fat; basil goes in at end. |
| R12 | Thai red chicken & pumpkin curry | PASS | S52 supports chicken + red paste + coconut + kabocha/pumpkin + fish sauce/palm sugar + basil. | Keep. |
| R13 | Massaman beef | PASS · HOUSE | S42 and corroborating S53 support beef, coconut, warm spice, potato/onion, fish sauce, palm sugar, tamarind, peanuts. | Keep THAI-R + MASS split. Braise for tenderness; 63°C is only safety minimum, not tenderness endpoint. |
| R14 | Pad kra pao | PASS | S21 strongly supports garlic/chilli separately, sauce separately, fresh holy basil off heat, rice/fried egg. | Keep exact architecture. |
| R15 | Pad see ew | PASS | S54 current HTK formula is exactly 450 g fresh noodles + 225 g protein + 150 g gai lan + 2 eggs for 2. | Strong pass. Cook one portion at a time for best wok char; sauce 35 ml/portion. |
| R16 | Beef & broccoli | **ADJUST** | S55 validates velveting/marinating beef, blanching broccoli, searing, sauce, slurry. S23 all-purpose sauce suggests a larger sauce dose than current 125 ml. | Increase WOK-B to ~150–160 ml. Ensure beef velveting/marinade is in method. |
| R17 | Chicken & mushrooms | ADJUST · HOUSE | S56 supports tenderised chicken + mushrooms/greens + wok sauce; S57 shows a distinct braised chicken/mushroom lane. | Keep as quick takeout-style stir-fry, not braise. Increase WOK-B to ~150 ml and explicitly velvet chicken. |
| R18 | Moo goo gai pan | PASS WITH INGREDIENT CHECK | S58 defines mushroom + sliced chicken with bok choy, bamboo shoots, water chestnuts, ginger/scallion/garlic and light white sauce. | Keep WOK-W 150 ml. Ensure canonical direct ingredient set includes the characteristic vegetable mix, not just generic mushrooms. |
| R19 | Prawns & greens | PASS · HOUSE | S59 notes original shrimp & broccoli traditionally uses garlic white sauce; current prawns/greens version is a reasonable house extension. | Keep WOK-W 150 ml. |
| R20 | Crispy tofu & green beans | PASS · HOUSE | S60 supports crisp/pan-fried tofu stir-fry architecture; exact tofu+green-bean composition is a Home dinner. | Keep explicitly Chinese-style house adaptation. Move WOK-B to ~150 ml if R16 dosage change is adopted. |
| R21 | Teriyaki salmon | PASS · HOUSE | S61 authentic salmon method uses 340 g salmon for 2, flour, pan-sear/steam and soy/sake/mirin/sugar glaze. | Keep 340 g salmon and house TERI. Add flour/pan-sear/steam details if absent; house tare is slightly different from salmon-specific ratio and should be labelled house. |
| R22 | Chicken teriyaki | PASS | S62 supports ~340–454 g chicken thigh for 2 with soy/sake/mirin/sugar pan glaze. | Keep 400 g chicken + TERI. |
| R23 | Miso-ginger salmon | **ADJUST** | S43 is 340 g salmon + miso/sake/mirin/soy/tiny sesame oil; current MISO-G lacks soy and contains rice vinegar. | Keep 340 g salmon but use corrected MISO-G. Marinate 1–2 h; wipe heavy excess before broiling. |
| R24 | Miso aubergine & tofu | **REWORK DINNER** | S44 shows true dengaku glaze = miso+sake+mirin+sugar on tofu/eggplant. Current MISO-G is a different ginger-vinegar marinade. | Remove MISO-G dependency from this dinner. Use a direct dengaku-style glaze; keep name `Miso aubergine & tofu`. |
| R25 | Bulgogi beef | **ADJUST** | S45/S46 strongly agree on thin beef, soy, sugar, garlic, sesame oil and fresh scallion/onion; pear/rice wine common in fuller version. | Correct BUL booster and likely increase marinade quantity. Keep 350 g thin beef; fresh onion/scallion at dinner. |
| R26 | Gochujang chicken & roast vegetables | PASS · HOUSE | S34/S35 validate gochujang chicken seasoning family but not this traybake as a canonical Korean dish. | Keep explicitly Korean-inspired household traybake. |
| R27 | Gochujang tofu & broccoli | PASS · HOUSE | Korean gochujang/tofu dishes support the flavour pairing; exact broccoli bowl is Home composition. | Keep cuisine-inspired label. Do not cite unrelated Korean BBQ as if exact. |
| R28 | Beef ragù | PASS · HOUSE | S63 authentic Bolognese is meat-led with soffritto, wine, modest tomato and long cook. | Keep name **beef ragù**, not traditional Bolognese. Wine and Parmesan stay explicit; optional milk is a valid variant. |
| R29 | Chicken cacciatore | PASS · HOUSE / SMALL ADJUST | S64 confirms chicken with onion, tomato, wine/herbs and common mushroom/capsicum/olive version. | Current wine/mushroom/pepper foundation is sound. Add olives + oregano/bay as canonical or explicit variant; RED/DARK are Home shortcuts. |
| R30 | Mustard mushroom chicken | PASS · HOUSE / SMALL ADJUST | S65 supports chicken + cream + Dijon + wholegrain mustard, optional tarragon/parsley. | Keep BLOND+DUX+DARK house sauce; add wholegrain mustard (~10 g) and optional tarragon. |
| R31 | Pesto salmon & roast vegetables | PASS · HOUSE / SMALL ADJUST | S66 supports salmon + pesto + lemon, with optional breadcrumb texture. Finished pesto requires cheese even though Home freezer base omits it. | Make Parmesan/Pecorino a normal finisher, not merely optional, unless dish is renamed basil-sauce salmon. |
| R32 | Shakshuka | PASS | S67 exactly supports harissa + tomato + red pepper + garlic + cumin + eggs + yoghurt/labneh. | Strong pass; RED + HARISSA is a good household modularisation. |
| R33 | Harissa chicken traybake | PASS | S68 is exceptionally close: chicken, peppers, red onion, beans, harissa, oil, vinegar, oregano. | Strong pass. |
| R34 | Harissa chickpeas & roast cauliflower | PASS · HOUSE | S69/S70 independently support harissa + roasted cauliflower + chickpeas + lemon/yoghurt/tahini family. | Keep. Consider roasting some harissa with cauliflower/chickpeas together for better caramelisation; couscous stays explicit optional variant. |
| R35 | Chipotle chicken bowl | PASS · HOUSE | S37 tinga validates chicken/tomato/onion/chipotle/garlic; current bowl adds beans/corn/yoghurt and is intentionally broader. | Keep as household bowl, not tinga. RED + CHIPOTLE is coherent. |
| R36 | Chipotle black-bean skillet | PASS · HOUSE | S71/S72 support black beans with garlic/chipotle/smoky salsa family; exact skillet is Home composition. | Keep cuisine-inspired identity. Do not imply it is a canonical Mexican named dish. |

---

# E. Required corrections before kitchen calibration

## P0 — culinary correctness / architecture

1. **MAKHANI:** remove `madeFrom GOLD`; redesign as standalone tomato-cashew-butter concentrate.
2. **KORMA:** remove `madeFrom ONION`; Home ONION is too deeply caramelised for a generic korma base. Give KORMA its own golden fried onion input.
3. **MISO-G:** reformulate from the current miso+ginger+mirin+sake+rice-vinegar mix to a coherent miso/sake/mirin/Japanese-soy + modest ginger + tiny sesame-oil marinade.
4. **Miso aubergine & tofu:** remove MISO-G dependency and use a direct dengaku-style glaze.
5. **BUL:** remove/reduce ginger, restore source-supported liquid balance (water/rice wine as appropriate), keep scallion/onion fresh, and increase dinner marinade quantity from the underpowered 60 g starting point.
6. **WOK-B dinners:** change two-person standard from 125 ml to approximately 150–160 ml for beef & broccoli / chicken & mushrooms / tofu & green beans, then kitchen-test.

## P1 — recipe quality improvements

7. Beef & broccoli / chicken & mushrooms: add explicit velveting/marinade technique.
8. Moo goo gai pan: ensure characteristic mushrooms + bok choy + bamboo shoots + water chestnuts are explicit.
9. Pesto salmon: Parmesan/Pecorino becomes a normal fresh finisher because PESTO is deliberately cheese-free in the freezer.
10. Chicken cacciatore: add olives and oregano/bay (canonical or explicit variant).
11. Mustard mushroom chicken: add wholegrain mustard; optional tarragon.
12. Chana masala: amchur or lemon final acidity is required, not decorative.
13. Saag chicken: add kasuri methi/lemon finishing logic.
14. Sambal telur: fresh onion rings; optional blistered/fried egg variant.
15. GOLD/BLOND/REMPAH/GOCHU/CHIPOTLE/DOUBAN/boosters: keep **Home** wording so modular convenience is never misrepresented as one universal traditional sauce.

## P2 — source/evidence hygiene

16. Replace broken/old My Food Story GOLD URL with S4.
17. Keep a culinary source and safety source as separate evidence roles.
18. Replace any remaining generic SFA-as-recipe source with a dish-specific culinary source.
19. For household-inspired dishes (R9, R20, R26, R27, R34, R35, R36), say `household_adaptation`/`cuisine_inspired`; do not chase fake authenticity.

---

# F. Source ledger

The sources below are the main evidence set used for this pass. Where a Home formulation intentionally spans multiple references, that is stated in the verdict rather than disguised as an exact reproduction.

- **S1** Serious Eats — Slow-Cooked Italian-American Tomato Sauce: https://www.seriouseats.com/the-best-slow-cooked-italian-american-tomato-sauce-red-sauce-recipe
- **S2** Marcella Hazan tomato/onion/butter benchmark (PBS): https://www.pbs.org/food/recipes/marcella-hazans-tomato-sauce-with-onion-and-butter
- **S3** La Cucina Italiana — Soffritto: https://www.lacucinaitaliana.com/glossary/soffritto
- **S4** My Food Story — Bhuna Masala / Everyday Indian Curry Paste: https://myfoodstory.com/bhuna-masala-or-everyday-indian-curry-paste-recipe/
- **S5** My Heart Beets — Indian Onion Masala: https://myheartbeets.com/indian-onion-masala/
- **S6** Nomadette — Sambal Tumis: https://nomadette.com/how-to-make-sambal-tumis/
- **S7** Rasa Malaysia — Sambal Udang + Sambal Telur: https://rasamalaysia.com/sambal-udang-prawn-sambal/ ; https://rasamalaysia.com/sambal-telur-recipe-egg-sambal/
- **S8** Nyonya Cooking — Chicken/Beef Rendang: https://www.nyonyacooking.com/recipes/chicken-rendang~rkU1dPiPG5b7 ; https://www.nyonyacooking.com/recipes/beef-rendang~HJg5DP_Pf5W7
- **S9** Nyonya Cooking — Curry Laksa: https://www.nyonyacooking.com/recipes/curry-laksa~H1uJw8vDMcZ7
- **S10** RecipeTin Eats — Chicken Stock: https://www.recipetineats.com/homemade-chicken-stock/
- **S11** Saveur — Brown Chicken Stock: https://www.saveur.com/article/Recipes/Brown-Chicken-Stock/
- **S12** Serious Eats / classical caramelised-onion technique: https://www.seriouseats.com/caramelized-onions
- **S13** Swasthi — Butter Chicken / Makhani: https://www.indianhealthyrecipes.com/butter-chicken/
- **S14** Swasthi — Palak Chicken: https://www.indianhealthyrecipes.com/palak-spinach-chicken/
- **S15** Swasthi — Chicken Korma: https://www.indianhealthyrecipes.com/chicken-korma-recipe/
- **S16** Nyonya Cooking — Malaysian Chicken Curry: https://www.nyonyacooking.com/recipes/chicken-curry~HJg5_PvPM5W7
- **S17** Rasa Malaysia — Asam Pedas: https://rasamalaysia.com/asam-pedas-ikan/
- **S18** Hot Thai Kitchen — Green Curry Paste: https://hot-thai-kitchen.com/green-curry-paste/
- **S19** Hot Thai Kitchen — Red Curry Paste: https://hot-thai-kitchen.com/red-curry-paste/
- **S20** Hot Thai Kitchen — Nam Prik Pao: https://hot-thai-kitchen.com/nam-prik-pao/
- **S21** Hot Thai Kitchen — Pad Kra Pao: https://hot-thai-kitchen.com/pad-kra-pao-anything/
- **S22** Saveur / Andrea Nguyen — Vietnamese dipping sauce: https://www.saveur.com/article/Recipes/Classic-Vietnamese-Dipping-Sauce/
- **S23** The Woks of Life — All-Purpose Brown Stir-Fry Sauce: https://thewoksoflife.com/stir-fry-sauce-recipe/
- **S24** The Woks of Life — Chinese White Sauce: https://thewoksoflife.com/chinese-white-sauce/
- **S25** The Woks of Life — Char Siu: https://thewoksoflife.com/chinese-bbq-pork-cha-siu/
- **S26** The Woks of Life — Mapo Tofu: https://thewoksoflife.com/ma-po-tofu-real-deal/
- **S27** The Woks of Life — Ginger Scallion Oil: https://thewoksoflife.com/raw-ginger-scallion-oil/
- **S28** Just One Cookbook — Awase Dashi: https://www.justonecookbook.com/how-to-make-dashi/
- **S29** Japanese Cooking 101 — Ichiban Dashi: https://www.japanesecooking101.com/ichiban-dashi-recipe/
- **S30** Just One Cookbook — Teriyaki Sauce: https://www.justonecookbook.com/teriyaki-sauce/
- **S31** Japanese Cooking 101 — Teriyaki Chicken: https://japanesecooking101.com/teriyaki-chicken-bento-recipe/
- **S32** Just One Cookbook — Japanese Curry Roux: https://www.justonecookbook.com/how-to-make-curry-roux/
- **S33** Maangchi — Anchovy Kelp Stock: https://www.maangchi.com/recipe/myeolchi-dasima-yuksu
- **S34** Maangchi — Dakbokkeumtang: https://www.maangchi.com/recipe/traditional-dakbokkeumtang
- **S35** Maangchi — Spicy Korean Chicken Skewers: https://www.maangchi.com/recipe/dak-kkochi
- **S36** Mediterranean/harissa technique family; current Home paste remains a house formulation. Harissa cauliflower reference: https://www.themediterraneandish.com/baked-cauliflower-with-garlic-and-harissa/
- **S37** Rick Bayless — Chicken Tinga: https://www.rickbayless.com/recipe/chicken-tinga-tacos/
- **S38** Serious Eats — Pesto technique: https://www.seriouseats.com/best-pesto-recipe
- **S39** National Center for Home Food Preservation — Pesto/garlic-in-oil freezing guidance: https://nchfp.uga.edu/how/freeze/vegetable/freezing-garlic-in-oil/
- **S40** Serious Eats — Duxelles technique family: https://www.seriouseats.com/duxelles-recipe
- **S41** National Center for Home Food Preservation — Garlic in Oil: https://nchfp.uga.edu/how/freeze/vegetable/freezing-garlic-in-oil/
- **S42** Hot Thai Kitchen — Massaman Curry: https://hot-thai-kitchen.com/massaman-curry/
- **S43** Just One Cookbook — Miso Salmon: https://www.justonecookbook.com/miso-salmon/
- **S44** Just One Cookbook — Miso Dengaku: https://www.justonecookbook.com/miso-dengaku/
- **S45** Korean Bapsang — Bulgogi: https://www.koreanbapsang.com/bulgogi-korean-bbq-beef/
- **S46** Maangchi — Easy Bulgogi: https://www.maangchi.com/recipe/easy-bulgogi
- **S47** Swasthi — Chicken Curry: https://www.indianhealthyrecipes.com/chicken-curry/
- **S48** Dassana — Chana Masala: https://www.vegrecipesofindia.com/chana-masala-recipe/
- **S49** Swasthi — Punjabi Egg Curry: https://www.indianhealthyrecipes.com/punjabi-egg-curry-anda-curry-dhaba-style/
- **S50** Dassana — Aloo Matar: https://www.vegrecipesofindia.com/aloo-matar-curry-aloo-matar-gravy/
- **S51** Hot Thai Kitchen — Green Curry Chicken: https://hot-thai-kitchen.com/green-curry-new-2/
- **S52** Hot Thai Kitchen — Red Curry Chicken & Kabocha: https://hot-thai-kitchen.com/red-curry-chicken-squash/
- **S53** Rasa Malaysia — Beef Massaman Curry: https://rasamalaysia.com/beef-massaman-curry-recipe
- **S54** Hot Thai Kitchen — Pad See Ew: https://hot-thai-kitchen.com/pad-see-ew-new/
- **S55** The Woks of Life — Beef & Broccoli: https://thewoksoflife.com/beef-with-broccoli-all-purpose-stir-fry-sauce/
- **S56** The Woks of Life — Chicken with Chinese Broccoli & Mushrooms: https://thewoksoflife.com/chicken-and-chinese-broccoli/
- **S57** The Woks of Life — Chinese Braised Chicken with Mushrooms: https://thewoksoflife.com/chinese-braised-chicken-with-mushrooms/
- **S58** The Woks of Life — Moo Goo Gai Pan: https://thewoksoflife.com/moo-goo-gai-pan/
- **S59** The Woks of Life — Shrimp & Broccoli: https://thewoksoflife.com/shrimp-and-broccoli/
- **S60** The Woks of Life — Home-Style Tofu: https://thewoksoflife.com/home-style-tofu-stir-fry/
- **S61** Just One Cookbook — Teriyaki Salmon: https://www.justonecookbook.com/teriyaki-salmon-recipe/
- **S62** Just One Cookbook — Chicken Teriyaki: https://www.justonecookbook.com/chicken-teriyaki/
- **S63** GialloZafferano — Ragù alla Bolognese: https://www.giallozafferano.com/recipes/Ragu-alla-bolognese.html
- **S64** RecipeTin Eats — Chicken Cacciatore: https://www.recipetineats.com/chicken-cacciatore-italian-chicken-stew/
- **S65** RecipeTin Eats — Chicken in Creamy Mustard Sauce: https://www.recipetineats.com/chicken-in-creamy-mustard-sauce/
- **S66** The Mediterranean Dish — Pesto Salmon: https://www.themediterraneandish.com/pesto-salmon/
- **S67** Ottolenghi — Shakshuka: https://ottolenghi.co.uk/pages/recipes/shakshuka
- **S68** Ottolenghi — Orange Harissa Chicken Traybake: https://ottolenghi.co.uk/pages/recipes/orange-harissa-chicken-traybake
- **S69** Good Food Middle East — Roasted Cauliflower with Harissa & Chickpea Sauce: https://www.bbcgoodfoodme.com/recipes/roasted-cauliflower-harissa-chickpea-sauce/
- **S70** Olive — Roasted Cauliflower & Harissa Chickpeas: https://www.olivemagazine.com/recipes/vegetarian/roasted-cauliflower-and-harissa-chickpeas-with-a-herby-lemon-pangritata/
- **S71** Rick Bayless — Chipotle/Black Bean family: https://www.rickbayless.com/recipe/black-bean-bathed-enchiladas-with-chorizo/
- **S72** Rick Bayless — Simple Black Beans: https://www.rickbayless.com/recipe/simple-mashed-black-beans/

## Safety cross-check

Kitchen food safety remains governed separately by current Singapore Food Agency guidance and food-specific authoritative temperature guidance. Culinary appearance cues such as browning, oil separation, sauce thickness or fish flaking are quality cues only; they do not override temperature/time safety rules.

## Bottom line

The architecture is broadly strong. Most of the 77 objects survive verification. The pass found a small number of material food-quality problems worth fixing **before** kitchen calibration: MAKHANI/GOLD, KORMA/ONION, MISO-G, miso aubergine/tofu, BUL, and WOK-B dinner dosing. Everything else is either source-aligned or an honest Home Meals adaptation that should be labelled as such rather than forced into false authenticity.
