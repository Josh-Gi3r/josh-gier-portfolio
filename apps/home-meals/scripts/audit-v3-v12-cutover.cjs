const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const fail=m=>failures.push(m),read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

must('app/layout.tsx',/HouseholdSyncV12/,'v3 shell must use HouseholdSyncV12');
mustNot('app/layout.tsx',/from\s+["']@\/components\/HouseholdSync["']/,'old v11 HouseholdSync is still imported');
must('app/layout.tsx',/FirstRunKitchen/,'explicit first-run Kitchen truth choice must be mounted');
must('components/FirstRunKitchen.tsx',/confirmEmptyKitchen/,'first run must support confirmed-empty Kitchen state');
must('components/FirstRunKitchen.tsx',/Start from zero and add what we have/,'manual first run must not confuse unknown with empty');

must('components/HouseholdState.tsx',/HouseholdStateV12Provider/,'v3 compatibility surface must be backed by v12 state');
must('components/HouseholdState.tsx',/activePrepIds/,'v3 compatibility surface must expose active prep repertoire');
must('components/HouseholdState.tsx',/confirmEmptyKitchen/,'v3 compatibility surface must expose confirmed-empty Kitchen action');
mustNot('components/HouseholdState.tsx',/portionMl/,'runtime bridge still uses legacy ml-only component stepping');
must('data/household-v12.ts',/activePrepIds:string\[\]/,'v12 state must persist active prep repertoire');
must('data/household-v12.ts',/confirmEmptyKitchenV12/,'v12 state must distinguish confirmed empty from unknown Kitchen');

must('components/app/Recipe.tsx',/getDinnerFormulationV2/,'recipe page is not rendering canonical v2 formulation');
must('components/app/Cooking.tsx',/getDinnerFormulationV2/,'cooking mode is not rendering canonical v2 formulation');
must('components/app/PrepDay.tsx',/recordMeasuredProduction/,'Prep Day must log measured production');
mustNot('components/app/PrepDay.tsx',/batchOutputMl|batchYield|portionMl/,'Prep Day still contains assumed batch-yield arithmetic');
for(const rel of ['components/app/Kitchen.tsx','components/app/StockSheets.tsx','components/app/Scan.tsx','components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx'])mustNot(rel,/batchOutputMl|batchYield|portionMl/,'active stock/prep UI still contains legacy quantity assumptions');
for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx'])must(rel,/recordMeasuredProduction/,'prep detail must require measured output before stock logging');

must('components/app/Prep.tsx',/Your prep/,'Prep home must foreground household repertoire rather than only mothers');
must('components/app/Prep.tsx',/Core bases/,'Prep home must expose core bases in unified library');
must('components/app/Prep.tsx',/Mids & sauces/,'Prep home must expose mids and sauces');
must('components/app/Prep.tsx',/Boosters/,'Prep home must expose boosters');
must('components/app/Prep.tsx',/prepExpansionCandidatesV2/,'Prep home must explain what one more prep item unlocks');
must('components/app/Mids.tsx',/prepRelationshipLabelV2/,'mids explorer must use canonical madeFrom/usedWith semantics');
mustNot('components/app/Mids.tsx',/parentMotherIds/,'mids explorer regressed to old parentMotherIds taxonomy');
must('data/prep-repertoire-v2.ts',/madeFrom/,'repertoire engine must distinguish physical parent relationships');
must('data/prep-repertoire-v2.ts',/usedWith/,'repertoire engine must distinguish pair-with relationships');

must('components/app/Cook.tsx',/By prep/,'recipe browse must support prep-based review');
must('components/app/Cook.tsx',/Cuisine/,'recipe browse must support cuisine review');
must('components/app/Cook.tsx',/Recent/,'recipe browse must expose recent meal history');
must('components/app/Cook.tsx',/Never cooked/,'recipe browse must expose never-cooked recipes');
must('components/app/Cook.tsx',/\/history/,'recipe browse must link to household meal history');
must('components/app/MealHistory.tsx',/mealHistorySummaryV2/,'history screen must derive deterministic household meal history');
must('data/meal-history-v2.ts',/recentPenaltyV2/,'history engine must expose recency penalty for planning');
must('components/app/Plan.tsx',/activePrepIds/,'weekly planner must consider active prep repertoire');
must('components/app/Plan.tsx',/recentPenaltyV2/,'weekly planner must penalize recent repeats');
must('components/app/Plan.tsx',/cuisineRepeat/,'weekly planner must discourage repetitive cuisine mix');

must('components/VoiceRuntime.tsx',/home-meals-household-v12/,'voice runtime must read v12 household state');
must('components/SmartAskRuntime.tsx',/useHouseholdV12/,'Ask Home runtime must operate on v12 state');
must('components/SmartAskRuntime.tsx',/set_active_prep_set/,'Ask Home client must confirm active prep proposals');
must('components/SmartAskRuntime.tsx',/confirm_empty_kitchen/,'Ask Home client must confirm empty-Kitchen proposals');
must('components/SmartAskRuntime.tsx',/set_week/,'Ask Home client must confirm whole-week proposals');
must('app/api/ask-home/route.ts',/buildAssistantContextV2/,'Ask Home API must build deterministic v12 context');
must('app/api/ask-home/route.ts',/set_active_prep_set/,'Ask Home API must support explicit prep-repertoire changes');
must('app/api/ask-home/route.ts',/confirm_empty_kitchen/,'Ask Home API must support confirmed-empty Kitchen state');
must('app/api/ask-home/route.ts',/set_week/,'Ask Home API must support complete seven-day proposals');
must('data/assistant-context-v2.ts',/qualitativeStock/,'assistant context must preserve qualitative pantry truth');
must('data/assistant-context-v2.ts',/mealHistory/,'assistant context must include deterministic meal history');
must('data/assistant-context-v2.ts',/activePrep/,'assistant context must include active prep repertoire and expansion value');

for(const rel of ['components/app/Home.tsx','components/app/Cook.tsx','components/app/Recipe.tsx','components/app/Cooking.tsx','components/app/Plan.tsx','components/app/Builder.tsx'])mustNot(rel,/recipe-nutrition|nutritionFor\s*\(/,'active v3 UI still consumes placeholder nutrition');
const nutrition=read('data/recipe-nutrition.ts');if(/"[a-z0-9-]+"\s*:\s*\{\s*kcal/i.test(nutrition))fail('data/recipe-nutrition.ts still contains hard-coded recipe nutrition');

if(failures.length){console.error(`\nHome Meals v3/v12 cutover audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals v3/v12 cutover audit passed · v3 design preserved · v12 truth/state/sync integrated · repertoire/history/AI flows locked · no placeholder nutrition or assumed prep yields');
