const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const fail=m=>failures.push(m),read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

must('app/layout.tsx',/HouseholdSyncV12/,'v3 shell must use HouseholdSyncV12');
mustNot('app/layout.tsx',/from\s+["']@\/components\/HouseholdSync["']/,'old v11 HouseholdSync is still imported');
must('app/layout.tsx',/FirstRunKitchen/,'explicit first-run Kitchen truth choice must be mounted');
must('components/FirstRunKitchen.tsx',/confirmEmptyKitchen/,'first run must support confirmed-empty Kitchen state');
must('components/FirstRunKitchen.tsx',/Add what we have/,'manual first run must offer a real-Kitchen entry path');
must('components/FirstRunKitchen.tsx',/Start empty, then add only the food and prep that are actually here\./,'manual first run must explicitly establish empty before adding observed Kitchen stock');

must('components/HouseholdState.tsx',/HouseholdStateV12Provider/,'v3 compatibility surface must be backed by v12 state');
must('components/HouseholdState.tsx',/activePrepIds/,'v3 compatibility surface must expose active prep repertoire');
must('components/HouseholdState.tsx',/confirmEmptyKitchen/,'v3 compatibility surface must expose confirmed-empty Kitchen action');
must('components/HouseholdState.tsx',/recordMeasuredProduction/,'v3 compatibility surface must expose V6 measured-output prep logging');
mustNot('components/HouseholdState.tsx',/portionMl/,'runtime bridge still uses legacy ml-only component stepping');
must('data/household-v12.ts',/activePrepIds:string\[\]/,'v12 state must persist active prep repertoire');
must('data/household-v12.ts',/confirmEmptyKitchenV12/,'v12 state must distinguish confirmed empty from unknown Kitchen');

must('components/app/Recipe.tsx',/getRuntimeDinnerFormulationV7/,'recipe page is not rendering the unified four-serving V7 runtime formulation');
must('components/app/Cooking.tsx',/getRuntimeDinnerFormulationV7/,'cooking mode is not rendering the unified four-serving V7 runtime formulation');
must('data/runtime-dinner-v7.ts',/getOriginalRuntimeDinnerV8/,'V7 runtime must preserve the V8-corrected V4 foundation for the original catalogue');
must('data/runtime-dinner-v7.ts',/getPhase2LiveRuntimeV7/,'V7 runtime must gate promoted Phase 2 recipes');
must('data/runtime-dinner-v4.ts',/getDinnerFormulationV2/,'runtime formulation must retain v2 culinary reference provenance');
must('data/runtime-dinner-v4.ts',/targetServings:servings/,'runtime formulation must expose selected household cook servings');
must('components/app/PrepDay.tsx',/recordMeasuredProduction/,'Prep Day must record actual measured finished output');
must('components/app/PrepDay.tsx',/packetBreakdownV6/,'Prep Day must derive full V6 packets plus remainder from measured output');
mustNot('components/app/PrepDay.tsx',/batchOutputMl|batchYield|portionMl/,'Prep Day still contains assumed batch-yield arithmetic');
for(const rel of ['components/app/Kitchen.tsx','components/app/StockSheets.tsx','components/app/Scan.tsx','components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx'])mustNot(rel,/batchOutputMl|batchYield|portionMl/,'active stock/prep UI still contains legacy quantity assumptions');
for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx']){
 must(rel,/recordMeasuredProduction/,'prep detail must record actual measured finished output rather than count×legacy portion');
 must(rel,/packetBreakdownV6/,'prep detail must derive V6 storage packets plus loose remainder');
 mustNot(rel,/recordPortionedProduction\(/,'active prep detail still logs count×legacy portions');
}
for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx','components/app/PrepDay.tsx'])must(rel,/(finished output|weigh or measure|measure what you actually|how much you made)/i,'prep UX must ask for a real post-cook measurement before portioning stock');

must('components/app/Prep.tsx',/Our prep/,'Prep home must foreground household repertoire rather than only mothers');
must('components/app/Prep.tsx',/Have now/,'Prep home must separate physical prep stock from maintenance repertoire');
must('components/app/Prep.tsx',/Caramelised onion foundation/,'Prep home must demote ONION from core-base status');
must('components/app/Prep.tsx',/Core bases/,'Prep home must expose core bases in unified library');
must('components/app/Prep.tsx',/Mids & sauces/,'Prep home must expose mids and sauces');
must('components/app/Prep.tsx',/Boosters/,'Prep home must expose boosters');
must('components/app/Prep.tsx',/prepExpansionCandidatesV2|prepExpansionCandidatesV7/,'Prep home must explain what one more prep item unlocks');
must('components/app/Mids.tsx',/prepRelationshipLabelV2|prepRelationshipLabelV7/,'mids explorer must use canonical madeFrom/usedWith semantics');
mustNot('components/app/Mids.tsx',/parentMotherIds/,'mids explorer regressed to old parentMotherIds taxonomy');
must('data/prep-repertoire-v2.ts',/madeFrom/,'repertoire engine must distinguish physical parent relationships');
must('data/prep-repertoire-v2.ts',/usedWith/,'repertoire engine must distinguish pair-with relationships');

must('components/app/Cook.tsx',/By prep/,'recipe browse must support prep-based review');
must('components/app/Cook.tsx',/Cuisine/,'recipe browse must support cuisine review');
must('components/app/Cook.tsx',/Recent/,'recipe browse must expose recent meal history');
must('components/app/Cook.tsx',/Never cooked/,'recipe browse must expose never-cooked recipes');
must('components/app/Cook.tsx',/\/history/,'recipe browse must link to household meal history');
must('components/app/MealHistory.tsx',/mealHistorySummaryV2|mealHistorySummaryV7/,'history screen must derive deterministic household meal history');
must('data/meal-history-v2.ts',/recentPenaltyV2/,'legacy history engine must retain recency penalty provenance');
must('data/meal-history-v7.ts',/allLiveRecipesV7/,'V7 history engine must derive history over the live catalogue');
must('components/app/Plan.tsx',/activePrepIds/,'weekly planner must consider active prep repertoire');
must('components/app/Plan.tsx',/planMode/,'weekly planner must expose stock/repertoire/both/free planning basis');
must('components/app/Plan.tsx',/confirmSuggestedWeek/,'weekly planner must require explicit suggestion approval');
must('components/app/Plan.tsx',/recentPenaltyV2|recentPenaltyV7/,'weekly planner must penalize recent repeats');
must('components/app/Plan.tsx',/cuisineRepeat/,'weekly planner must discourage repetitive cuisine mix');

must('components/VoiceRuntime.tsx',/home-meals-household-v12/,'voice runtime must read v12 household state');
must('components/SmartAskRuntime.tsx',/useHouseholdV12/,'Ask Home runtime must operate on v12 state');
must('components/SmartAskRuntime.tsx',/set_active_prep_set/,'Ask Home client must confirm active prep proposals');
must('components/SmartAskRuntime.tsx',/confirm_empty_kitchen/,'Ask Home client must confirm empty-Kitchen proposals');
must('components/SmartAskRuntime.tsx',/set_week/,'Ask Home client must confirm whole-week proposals');
must('app/api/ask-home/route.ts',/buildAssistantContextV2|buildAssistantContextV7/,'Ask Home API must build deterministic household context');
must('app/api/ask-home/route.ts',/set_active_prep_set/,'Ask Home API must support explicit prep-repertoire changes');
must('app/api/ask-home/route.ts',/confirm_empty_kitchen/,'Ask Home API must support confirmed-empty Kitchen state');
must('app/api/ask-home/route.ts',/set_week/,'Ask Home API must support complete seven-day proposals');
must('data/assistant-context-v2.ts',/qualitativeStock/,'assistant context must preserve qualitative pantry truth');
must('data/assistant-context-v2.ts',/mealHistory/,'assistant context must include deterministic meal history');
must('data/assistant-context-v2.ts',/activePrep/,'assistant context must include active prep repertoire and expansion value');
must('data/assistant-context-v2.ts',/default cook batch is four servings/,'assistant context must preserve household cook-scale truth');

const motherHeroes=read('data/mother-hero-assets.ts');for(const id of ['red','blond','gold','sambal','rempah','clear','dark','onion'])if(!new RegExp(`\\b${id}:hf\\(`).test(motherHeroes))fail(`mother hero missing: ${id}`);
const processes=read('data/mother-process-assets.ts');for(const id of ['red','blond','gold','sambal','rempah','clear','dark','onion'])if(!new RegExp(`\\b${id}:\\[`).test(processes))fail(`mother process sequence missing: ${id}`);
const prepHeroes=read('data/prep-hero-assets.ts'),prepHeroCount=(prepHeroes.match(/^\s+(?:"[^"]+"|[a-z0-9-]+):hf\(/gm)||[]).length;if(prepHeroCount!==33)fail(`mid/booster hero coverage must be 33, found ${prepHeroCount}`);
must('lib/tones.ts',/prepHeroImages/,'prep hero helper must include mid/booster photography');
must('components/app/Prep.tsx',/prepHero/,'Prep library must render prep photography');
must('components/app/Mids.tsx',/prepHero/,'Mids explorer must render prep photography');
must('components/app/Mid.tsx',/prepHero/,'Mid detail must render prep photography');
must('components/app/Boosters.tsx',/prepHero/,'Boosters must render prep photography');

for(const rel of ['components/app/Home.tsx','components/app/Cook.tsx','components/app/Recipe.tsx','components/app/Cooking.tsx','components/app/Plan.tsx','components/app/Builder.tsx'])mustNot(rel,/recipe-nutrition|nutritionFor\s*\(/,'active v3 UI still consumes placeholder nutrition');
const nutrition=read('data/recipe-nutrition.ts');if(/"[a-z0-9-]+"\s*:\s*\{\s*kcal/i.test(nutrition))fail('data/recipe-nutrition.ts still contains hard-coded recipe nutrition');

if(failures.length){console.error(`\nHome Meals v3/v12 cutover audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals v3/v12 cutover audit passed · v3 design preserved · v12 state + V7 four-serving runtime gate locked · V7 repertoire/history/AI-ready flows locked · complete prep imagery · V6 measured-output packet prep · no placeholder nutrition or assumed prep yields');
