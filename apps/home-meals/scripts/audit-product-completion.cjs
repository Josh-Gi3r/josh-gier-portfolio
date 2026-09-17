const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const fail=m=>failures.push(m);
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

// Complete household loop and routes.
for(const rel of ['app/page.tsx','app/cook/page.tsx','app/prep/page.tsx','app/kitchen/page.tsx','app/plan/page.tsx','app/history/page.tsx','app/learn/page.tsx','app/scan/page.tsx','app/prep/day/page.tsx','app/prep/mids/page.tsx','app/prep/boosters/page.tsx','app/cook/[slug]/page.tsx','app/cook/[slug]/cook/page.tsx'])if(!exists(rel))fail(`${rel}: required user route missing`);
must('app/cook/[slug]/page.tsx',/getLiveRecipeV7/,'recipe detail route is not gated by the live V7 catalogue');
must('app/cook/[slug]/cook/page.tsx',/getLiveRecipeV7/,'cooking route is not gated by the live V7 catalogue');
must('components/FirstRunKitchen.tsx',/Nothing yet/,'confirmed-empty first run is missing');
must('components/FirstRunKitchen.tsx',/Add what we have/,'manual first-run path is missing');
must('components/FirstRunKitchen.tsx',/Start empty, then add only the food and prep that are actually here\./,'manual first-run path must establish empty before adding observed stock');
must('components/app/Prep.tsx',/Start with GOLD · SAMBAL · RED/,'small active-prep starter is missing');
must('components/app/Cook.tsx',/By prep/,'prep-based recipe browse is missing');
must('components/app/Cook.tsx',/Never cooked/,'history-aware recipe browse is missing');
must('components/app/MealHistory.tsx',/mealHistorySummaryV7/,'V7 live meal-history intelligence is not rendered');
must('components/app/Recipe.tsx',/r\.source\.url/,'recipe page must render the evidence source carried by the gated live recipe catalogue');

// V7 live promotion must be visible across every user-facing decision surface, not only the recipe browser.
for(const [rel,token] of [['components/app/Cook.tsx','allLiveRecipesV7'],['components/app/Home.tsx','allLiveRecipesV7'],['components/app/Plan.tsx','allLiveRecipesV7'],['components/app/Builder.tsx','allLiveRecipesV7'],['components/app/Kitchen.tsx','ingredientUiCatalogV7'],['components/app/Scan.tsx','ingredientUiCatalogV7'],['components/app/Shell.tsx','allLiveRecipesV7'],['components/AskHomeView.tsx','getLiveRecipeV7'],['app/api/ask-home/route.ts','buildAssistantContextV7'],['components/app/PrepDay.tsx','prepJobsForWeekV7']])must(rel,new RegExp(token),`V7 live surface missing ${token}`);
mustNot('components/AskHomeView.tsx',/recipe-nutrition|nutritionFor\s*\(/,'Ask Home cards regressed to placeholder nutrition');
for(const rel of ['components/HouseholdSync.tsx','data/foundation.ts','data/foundation-ops.ts','data/meal-plan.ts'])if(exists(rel))fail(`${rel}: retired legacy file was reintroduced`);
mustNot('components/app/Shell.tsx',/remainingMl|outputMl|shortMl|\bml in the freezer\b/,'local Home answers regressed to ml-only prep assumptions');
mustNot('components/HouseholdState.tsx',/neededMl|onHandMl|shortMl|outputMl|remainingMl/,'v3 bridge reintroduced ml-only aliases');
mustNot('lib/tones.ts',/portionLabel|freezeFormat/,'UI shape copy depends on retired freezer-shape assumptions');
mustNot('data/home-data.ts',/portionMl|batchYield|totalMl|parentMotherIds/,'display catalogue reintroduced unmeasured prep-yield/relationship fields');
mustNot('data/prep-catalog.ts',/parentMotherIds|portionMl|batchYield/,'prep display metadata reintroduced a parallel relationship/yield truth');
mustNot('data/stock-math.ts',/neededMl|onHandMl|shortMl|outputMl|remainingMl|batchOutputMl|componentConsumptionMl|prepDemandForWeekMl/,'stock compatibility math regressed to ml-only aliases');

const motherHeroes=read('data/mother-hero-assets.ts'),process=read('data/mother-process-assets.ts'),prepHeroes=read('data/prep-hero-assets.ts');
const mothers=['red','blond','gold','sambal','rempah','clear','dark','onion'];
const mids=['makhani','saag','korma','rendang','laksa','malaysian-kari','asam-pedas','thai-green','thai-red','nam-prik-pao','krapow','nuoc-cham','wok-brown','wok-white','char-siu','douban','ginger-scallion','dashi','teriyaki','jp-curry','k-anchovy','gochujang','harissa','chipotle','pesto','duxelles'];
const boosters=['ginger-garlic','garlic','chilli','lemongrass','massaman-finish','miso-ginger','bulgogi'];
const keyRe=id=>new RegExp(`(?:^|\\n)\\s*(?:["']${id}["']|${id.replace(/-/g,'\\-')})\\s*:`,'m');
for(const id of mothers){if(!keyRe(id).test(motherHeroes))fail(`mother hero missing: ${id}`);if(!new RegExp(`(?:^|\\n)\\s*${id}\\s*:\\s*\\[`,'m').test(process))fail(`mother process sequence missing: ${id}`)}
for(const id of [...mids,...boosters])if(!keyRe(id).test(prepHeroes))fail(`prep hero missing: ${id}`);

for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx','components/app/PrepDay.tsx']){
 must(rel,/recordMeasuredProduction/,'prep UI must record actual measured finished output');
 must(rel,/packetBreakdownV6/,'prep UI must derive full storage packets plus loose remainder');
 must(rel,/(finished output|How much did you make|Tell me how much you made|what you actually made)/i,'prep UI must tell the household to measure actual finished output');
 mustNot(rel,/recordPortionedProduction\(/,'active prep UI still logs count×legacy portions');
 mustNot(rel,/batchOutputMl|batchYield|portionMl/,'active prep UI regressed to assumed-yield fields');
}
must('components/HouseholdStateV12.tsx',/recordMeasuredProduction/,'v12 state does not support V6 measured-output production');
must('components/HouseholdStateV12.tsx',/confirmSuggestedWeek/,'v12 state does not expose explicit week approval');
must('components/app/Home.tsx',/DINNER IDEA/,'Home preview still masquerades as a confirmed Tonight');
must('components/app/Prep.tsx',/hm-prep-library-card/,'Prep library is not image-led/interactive');
must('components/app/Prep.tsx',/Caramelised onion foundation/,'ONION is still presented as a core base');

must('components/HouseholdState.tsx',/logMealWithoutStock/,'v3 bridge does not expose explicit log-only cooking');
must('components/app/Cooking.tsx',/stockConsumed/,'cooking completion does not distinguish reconciled stock from log-only history');
must('components/app/Cooking.tsx',/logMealWithoutStock/,'cooking does not explicitly select the log-only fallback');
mustNot('components/HouseholdStateV12.tsx',/catch\s*\{\s*return\s+historyOnly/,'cookMeal still silently records history when stock reconciliation fails');

must('components/VisionRuntime.tsx',/fetch\("\/api\/vision",\{cache:"no-store"\}\)/,'vision configuration check must be GET-only');
mustNot('components/VisionRuntime.tsx',/imageDataUrl:\s*""/,'vision still sends an empty image request');
must('components/SmartAskRuntime.tsx',/set_active_prep_set/,'Ask Home cannot confirm repertoire changes');
must('components/SmartAskRuntime.tsx',/set_week/,'Ask Home cannot confirm full-week changes');
must('components/VoiceRuntime.tsx',/home-meals-household-v12/,'voice is not using v12 household state');
must('app/api/ask-home/route.ts',/function cleanHref\(/,'AI navigation routes must be validated against real Home Meals routes');
must('app/api/ask-home/route.ts',/never invent route names such as \/week/,'AI route instructions must explicitly forbid invented navigation paths');
must('app/api/ask-home/route.ts',/max_output_tokens:\s*3000/,'full-week structured planning lost the response budget proven in production');

// Accessible controls. V19 replaces the old icon-only Kitchen button with a text-labelled manual path.
must('components/app/Scan.tsx',/aria-label="Choose a photo from the library"/,'photo-library control is unlabeled');
must('components/app/Scan.tsx',/aria-label="Take a photo"/,'camera shutter control is unlabeled');
must('components/app/Scan.tsx',/hm-show-manual/,'Show Me manual-entry escape is missing');
must('components/app/Scan.tsx',/aria-label="Take (?:a|the) photo"/,'camera CTA input is unlabeled');
must('components/app/Kitchen.tsx',/aria-label=\{`Find in the \$\{tab\.toLowerCase\(\)\}`\}/,'Kitchen search input lost its accessible name');

const completion=read('app/styles/completion.css');
for(const token of ['.hm-btn.xs','.hm-chip{','.hm-sec a,.hm-sec button','.hm-stepper button','.hm-scan-panel .modes button','.hm-bar-tab','[aria-label="Loading Home Meals"]'])if(!completion.includes(token))fail(`completion.css missing guardrail: ${token}`);
must('app/globals.css',/completion\.css/,'completion accessibility guardrails are not loaded');
must('public/sw.js',/home-meals-v12/,'service-worker cache version is stale');
for(const route of ["'/history'","'/prep/boosters'","'/prep/day'","'/scan'"])if(!read('public/sw.js').includes(route))fail(`service worker CORE missing ${route}`);
must('app/api/household/session/route.ts',/httpOnly:true/,'household session cookie must be httpOnly');
must('app/api/household/session/route.ts',/secure:true/,'household session cookie must be secure');
must('lib/server-household.ts',/timingSafeEqual/,'household secret comparison is not timing-safe');
for(const rel of ['components/app/Plan.tsx','components/app/PrepDay.tsx','components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx']){mustNot(rel,/>\s*Canonical formulation\s*</i,'user-facing canonical-formulation jargon returned');mustNot(rel,/canonical prep graph/i,'user-facing dependency jargon returned')}
must('package.json',/audit-intelligence-v2\.cjs/,'intelligence audit is not in audit:data');
must('package.json',/audit-household-journey\.cjs/,'household journey audit is not in audit:data');
must('package.json',/audit-household-api\.cjs/,'household API hardening audit is not in audit:data');
must('package.json',/audit-private-ai\.cjs/,'private AI security audit is not in audit:data');
must('package.json',/audit-sync-recovery\.cjs/,'sync recovery audit is not in audit:data');
must('package.json',/audit-live-promotion-v7\.cjs/,'V7 live-promotion audit is not in audit:data');
must('package.json',/audit-integrated-redteam-v8\.cjs/,'V8 integrated red-team audit is not in audit:data');
must('package.json',/audit-josh-presence-v19\.cjs/,'V19 Josh-presence audit is not in audit:data');
must('package.json',/audit-product-completion\.cjs/,'product-completion audit is not in audit:data');
if(failures.length){console.error(`\nHome Meals product-completion audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals product-completion audit passed · complete household loop · V7 live promotion surfaces · stale legacy truth removed · full prep imagery · V6 measured-output prep · explicit cook reconciliation · validated AI routes · Josh/Ask/Vision/Voice wiring · accessible controls · mobile/PWA/privacy guardrails');
