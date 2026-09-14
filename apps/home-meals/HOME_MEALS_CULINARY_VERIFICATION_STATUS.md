# Home Meals — Culinary Verification Implementation Status

Updated: 2026-09-14

This file is the implementation companion to `HOME_MEALS_CULINARY_VERIFICATION.md`.

The research ledger records the 77-item verification pass as it happened. Some rows in that ledger intentionally retain the verdict at the moment of review (`ADJUST`, `REWORK · IDEA`, etc.). This status file records what was subsequently changed in the product so those historical verdicts are not mistaken for unresolved software work.

## Current implementation status

### Mothers

All eight mothers remain in the food architecture. Their current identities, working units, formulations, storage rules and relationships live in the v2 food system. CLEAR and ONION now also have complete hero and process imagery.

BLOND is explicitly a **Home Italian-style soffritto**, not a claim that one universal Italian ratio exists.

### Material mid/booster corrections implemented

- **MAKHANI** — corrected to a standalone tomato-cashew-butter concentrate. It no longer consumes GOLD as a physical parent. It remains a dormant/demand-led library idea because no current saved dinner consumes it.
- **KORMA** — corrected to use its own golden onion + nut base. It no longer inherits the deep jammy ONION mother. It remains a dormant/demand-led library idea because no current saved dinner consumes it.
- **WOK-B** — working dinner dose corrected to 150 ml for the Home two-person formulation.
- **MISO-G** — corrected to the miso + sake + mirin + Japanese soy + small sesame-oil profile; rice vinegar removed. Working portion is 40 g.
- **BUL** — corrected to soy + pear/apple + sugar + rice wine/mirin + garlic + sesame profile; ginger removed from the stored marinade. Working portion is 50 g.
- Relationship semantics are now explicit: `madeFrom`, `usedWith`, or standalone. `usedWith` never silently consumes a component during child production.

### Material dinner corrections implemented

- **Beef & broccoli** — WOK-B dose corrected to 150 ml; velveting workflow retained.
- **Brown chicken & mushrooms** — WOK-B 150 ml; explicit velveting/slurry workflow.
- **Moo goo gai pan** — water chestnuts and Shaoxing restored; white-sauce workflow corrected.
- **Miso salmon** — MISO-G 80 g; 1–2 hour refrigerated marinade; avoid overnight.
- **Miso aubergine & tofu** — no MISO-G dependency; direct dengaku-style glaze from miso, sake, mirin and sugar.
- **Bulgogi beef** — BUL 100 g; onion and fresh finish restored; minimum marinade step included.
- **Chicken cacciatore** — herb/olive finish corrected.
- **Mustard mushroom chicken** — Dijon + wholegrain mustard, with optional tarragon.
- **Pesto salmon** — cheese-free freezer PESTO base is finished with fresh Parmesan/Pecorino at dinner time.
- **Saag chicken** — kasuri methi finish added.
- **Sambal telur** — onion-ring workflow and optional egg blistering represented.

### Source status

The canonical recipe layer now overrides stale/generic legacy display references with closer culinary or adaptation references where required. The catalogue audit fails if a canonical dinner falls back to a `generic_or_wrong` source state.

Current canonical source overrides include the corrected references for:

- beef ragù;
- mustard mushroom chicken;
- pesto salmon;
- miso aubergine & tofu;
- gochujang chicken;
- gochujang tofu;
- chipotle chicken bowl;
- chipotle bean skillet.

### Starch truth

Every current dinner that previously carried a vague legacy `portion` starch now has an explicit canonical starch definition that matches the current dinner formulation. Legacy display ambiguity is not allowed to determine grocery or cooking arithmetic.

### Household validation still belongs to Josh + G

The following are intentionally **not** promoted into universal truth by research:

- preferred salt/acid/heat balance;
- preferred portion size;
- whether a researched dormant prep is worth maintaining;
- household cook-time calibration;
- exact brand-sensitive nutrition;
- actual favourites before Josh/G have eaten and rated them.

Those are learned through real use rather than invented to make the data look complete.

## Release interpretation

The historical verification ledger should be read as research provenance.

This file should be read as current implementation status.

A historical `ADJUST` or `REWORK · IDEA` verdict is not an unresolved software defect when the correction above has been implemented. Dormant ideas remain in the 41-item capability library without becoming setup homework.
