const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const fail=m=>failures.push(m);
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

// Complete household loop and routes.
for(const rel of ['app/page.tsx','app/cook/page.tsx','app/prep/page.tsx','app/kitchen/page.tsx','app/plan/page.tsx','app/history/page.tsx','app/learn/page.tsx','app/scan/page.tsx','app/prep/day/page.tsx','app/prep/mids/page.tsx','app/prep/boosters/page.tsx'])if(!exists(rel))fail(`${rel}: required user route missing`);
must('components/FirstRunKitchen.tsx',/Kitchen is empty/,'confirmed-empty first run is missing');
must('components/FirstRunKitchen.tsx',/Start from zero and add what we have/,'manual first-run path is missing');
must('components/app/Prep.tsx',/Start with GOLD · SAMBAL · RED/,'small active-prep starter is missing');
must('components/app/Cook.tsx',/By prep/,'prep-based recipe browse is missing');
must('components/app/Cook.tsx',/Never cooked/,'history-aware recipe browse is missing');
must('components/app/MealHistory.tsx',/mealHistorySummaryV2/,'meal-history intelligence is not rendered');
must('components/app/Recipe.tsx',/getCanonicalRecipeV2/,'recipe page must render the current canonical culinary reference');

// Retired truth/runtime files stay retired so stale quantities and v11 sync cannot creep back into the product.
for(const rel of ['components/HouseholdSync.tsx','data/foundation.ts','data/foundation-ops.ts','data/meal-plan.ts'])if(exists(rel))fail(`${rel}: retired legacy file was reintroduced`);

// Food visuals: every current prep object must have a real hero, every mother a process sequence.
const motherHeroes=read('data/mother-hero-assets.ts'),process=read('data/mother-process-assets.ts'),prepHeroes=read('data/prep-hero-assets.ts');
const mothers=['red','blond','gold','sambal','rempah','clear','dark','onion'];
const mids=['makhani','saag','korma','rendang','laksa','malaysian-kari','asam-pedas','thai-green','thai-red','nam-prik-pao','krapow','nuoc-cham','wok-brown','wok-white','char-siu','douban','ginger-scallion','dashi','teriyaki','jp-curry','k-anchovy','gochujang','harissa','chipotle','pesto','duxelles'];
const boosters=['ginger-garlic','garlic','chilli','lemongrass','massaman-finish','miso-ginger','bulgogi'];
const keyRe=id=>new RegExp(`(?:^|\\n)\\s*(?:["']${id}["']|${id.replace(/-/g,'\\-')})\\s*:`,'m');
for(const id of mothers){if(!keyRe(id).test(motherHeroes))fail(`mother hero missing: ${id}`);if(!new RegExp(`(?:^|\\n)\\s*${id}\\s*:\\s*\\[`,'m').test(process))fail(`mother process sequence missing: ${id}`)}
for(const id of [...mids,...boosters])if(!keyRe(id).test(prepHeroes))fail(`prep hero missing: ${id}`);

// Portion-first prep UX, with exact units remaining underneath.
for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx','components/app/PrepDay.tsx']){
 must(rel,/working portion/,'prep UI is not working-portion first');
 mustNot(rel,/batchOutputMl|batchYield|portionMl/,'active prep UI regressed to assumed-yield fields');
}
must('components/HouseholdStateV12.tsx',/recordPortionedProduction/,'v12 state does not support portion-first production');

// Cooking may log history without changing stock, but only explicitly; silent fallback is forbidden.
must('components/HouseholdState.tsx',/logMealWithoutStock/,'v3 bridge does not expose explicit log-only cooking');
must('components/app/Cooking.tsx',/stockConsumed/,'cooking completion does not distinguish reconciled stock from log-only history');
must('components/app/Cooking.tsx',/logMealWithoutStock/,'cooking does not explicitly select the log-only fallback');
mustNot('components/HouseholdStateV12.tsx',/catch\s*\{\s*return\s+historyOnly/,'cookMeal still silently records history when stock reconciliation fails');

// AI/vision/voice are wired to real household truth; vision must not POST an empty image on page load.
must('components/VisionRuntime.tsx',/fetch\("\/api\/vision",\{cache:"no-store"\}\)/,'vision configuration check must be GET-only');
mustNot('components/VisionRuntime.tsx',/imageDataUrl:\s*""/,'vision still sends an empty image request');
must('components/SmartAskRuntime.tsx',/set_active_prep_set/,'Ask Home cannot confirm repertoire changes');
must('components/SmartAskRuntime.tsx',/set_week/,'Ask Home cannot confirm full-week changes');
must('components/VoiceRuntime.tsx',/home-meals-household-v12/,'voice is not using v12 household state');
must('app/api/ask-home/route.ts',/function cleanHref\(/,'AI navigation routes must be validated against real Home Meals routes');
must('app/api/ask-home/route.ts',/never invent route names such as \/week/,'AI route instructions must explicitly forbid invented navigation paths');
must('app/api/ask-home/route.ts',/max_output_tokens:\s*3000/,'full-week structured planning lost the response budget proven in production');

// Scan controls must be understandable to screen readers as well as sighted users.
must('components/app/Scan.tsx',/aria-label="Choose a photo from the library"/,'photo-library control is unlabeled');
must('components/app/Scan.tsx',/aria-label="Take a photo"/,'camera shutter control is unlabeled');
must('components/app/Scan.tsx',/aria-label="Open Kitchen"/,'icon-only Kitchen control is unlabeled');
must('components/app/Scan.tsx',/aria-label="Take the photo"/,'camera CTA input is unlabeled');

// Mobile ergonomics and hydration.
const completion=read('app/styles/completion.css');
for(const token of ['.hm-btn.xs','.hm-chip{','.hm-sec a,.hm-sec button','.hm-stepper button','.hm-scan-panel .modes button','.hm-bar-tab','[aria-label="Loading Home Meals"]'])if(!completion.includes(token))fail(`completion.css missing guardrail: ${token}`);
must('app/globals.css',/completion\.css/,'completion accessibility guardrails are not loaded');

// PWA/offline shell covers all primary completed routes and uses a fresh v12 cache.
must('public/sw.js',/home-meals-v12/,'service-worker cache version is stale');
for(const route of ["'/history'","'/prep/boosters'","'/prep/day'","'/scan'"])if(!read('public/sw.js').includes(route))fail(`service worker CORE missing ${route}`);

// Security/privacy basics for the private household sync.
must('app/api/household/session/route.ts',/httpOnly:true/,'household session cookie must be httpOnly');
must('app/api/household/session/route.ts',/secure:true/,'household session cookie must be secure');
must('lib/server-household.ts',/timingSafeEqual/,'household secret comparison is not timing-safe');

// User-facing product copy should not expose implementation language.
for(const rel of ['components/app/Plan.tsx','components/app/PrepDay.tsx','components/app/Mother.tsx','components/app/Mid.tsx','components/app/Boosters.tsx']){
 mustNot(rel,/>\s*Canonical formulation\s*</i,'user-facing canonical-formulation jargon returned');
 mustNot(rel,/canonical prep graph/i,'user-facing dependency jargon returned');
}

// CI must exercise intelligence as well as food truth.
must('package.json',/audit-intelligence-v2\.cjs/,'intelligence audit is not in audit:data');
must('package.json',/audit-product-completion\.cjs/,'product-completion audit is not in audit:data');

if(failures.length){console.error(`\nHome Meals product-completion audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals product-completion audit passed · complete household loop · stale legacy truth removed · full prep imagery · canonical culinary references · explicit cook reconciliation · validated AI routes · AI/vision/voice wiring · accessible scan controls · mobile/PWA/privacy guardrails');
