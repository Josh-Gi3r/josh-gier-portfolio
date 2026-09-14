const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const fail=m=>failures.push(m),read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

must('app/layout.tsx',/HouseholdSyncV12/,'v3 shell must use HouseholdSyncV12');
mustNot('app/layout.tsx',/from\s+["']@\/components\/HouseholdSync["']/,'old v11 HouseholdSync is still imported');
must('components/HouseholdState.tsx',/HouseholdStateV12Provider/,'v3 compatibility surface must be backed by v12 state');
mustNot('components/HouseholdState.tsx',/portionMl/,'runtime bridge still uses legacy ml-only component stepping');
must('components/app/Recipe.tsx',/getDinnerFormulationV2/,'recipe page is not rendering canonical v2 formulation');
must('components/app/Cooking.tsx',/getDinnerFormulationV2/,'cooking mode is not rendering canonical v2 formulation');
must('components/app/PrepDay.tsx',/recordMeasuredProduction/,'Prep Day must log measured production');
mustNot('components/app/PrepDay.tsx',/batchOutputMl|batchYield|portionMl/,'Prep Day still contains assumed batch-yield arithmetic');
for(const rel of ['components/app/Kitchen.tsx','components/app/StockSheets.tsx','components/app/Scan.tsx','components/app/Mother.tsx','components/app/Mid.tsx'])mustNot(rel,/portionMl|batchOutputMl|batchYield/,'active stock/prep UI still contains legacy quantity assumptions');
must('components/VoiceRuntime.tsx',/home-meals-household-v12/,'voice runtime must read v12 household state');
must('components/SmartAskRuntime.tsx',/useHouseholdV12/,'Ask Home runtime must operate on v12 state');
must('app/api/ask-home/route.ts',/buildAssistantContextV2/,'Ask Home API must build deterministic v12 context');
must('data/assistant-context-v2.ts',/qualitativeStock/,'assistant context must preserve qualitative pantry truth');
for(const rel of ['components/app/Home.tsx','components/app/Cook.tsx','components/app/Recipe.tsx','components/app/Cooking.tsx','components/app/Plan.tsx','components/app/Builder.tsx'])mustNot(rel,/recipe-nutrition|nutritionFor\s*\(/,'active v3 UI still consumes placeholder nutrition');
const nutrition=read('data/recipe-nutrition.ts');if(/"[a-z0-9-]+"\s*:\s*\{\s*kcal/i.test(nutrition))fail('data/recipe-nutrition.ts still contains hard-coded recipe nutrition');
for(const rel of ['components/app/Mother.tsx','components/app/Mid.tsx'])must(rel,/recordMeasuredProduction/,'prep detail must require measured output before stock logging');

if(failures.length){console.error(`\nHome Meals v3/v12 cutover audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals v3/v12 cutover audit passed · v3 design preserved · v12 truth/state/sync integrated · no placeholder nutrition or assumed prep yields');
