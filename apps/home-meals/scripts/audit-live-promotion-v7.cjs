const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-live-promotion-v7'),failures=[];
const fail=m=>failures.push(m),read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const compile=['data/ingredient-catalog-v7.ts','data/phase2-live-candidates-v7.ts','data/phase2-promotion-registry-v7.ts','data/phase2-runtime-v7.ts','data/ingredient-engine-v7.ts','data/food-engine-v7.ts','data/runtime-dinner-v7.ts','data/household-runtime-v7.ts','data/phase2-recipe-assets-v7.ts','data/recipe-catalog-v7.ts'];
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,...compile],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const ingredients=require(path.join(out,'ingredient-catalog-v7.js')),candidates=require(path.join(out,'phase2-live-candidates-v7.js')),registry=require(path.join(out,'phase2-promotion-registry-v7.js')),runtime=require(path.join(out,'phase2-runtime-v7.js')),ingredientEngine=require(path.join(out,'ingredient-engine-v7.js')),foodEngine=require(path.join(out,'food-engine-v7.js')),runtimeDinner=require(path.join(out,'runtime-dinner-v7.js')),assets=require(path.join(out,'phase2-recipe-assets-v7.js')),catalog=require(path.join(out,'recipe-catalog-v7.js'));
 const iv=ingredients.validateCanonicalIngredientCatalogV7();if(!iv.valid)iv.errors.forEach(x=>fail(`ingredient catalog: ${x}`));
 const result=candidates.validatePhase2LiveCandidatesV7();if(!result.valid)result.errors.forEach(fail);
 const pv=registry.validatePromotionRegistryV7();if(!pv.valid)pv.errors.forEach(x=>fail(`promotion registry: ${x}`));
 const rv=runtime.validatePhase2RuntimeV7();if(!rv.valid)rv.errors.forEach(x=>fail(`runtime: ${x}`));
 const av=assets.validatePhase2RecipeAssetsV7();if(!av.valid)av.errors.forEach(x=>fail(`recipe assets: ${x}`));
 const cv=catalog.validateLiveRecipeCatalogV7();if(!cv.valid)cv.errors.forEach(x=>fail(`live catalog: ${x}`));
 if(result.count!==100)fail(`Expected 100 promotion candidates, found ${result.count}`);
 if(result.ready!==100)fail(`Expected 100 structurally-ready candidates, found ${result.ready}`);
 if(result.live!==0||pv.live!==0)fail(`Controlled promotion must start at 0/100 live, found candidate=${result.live} registry=${pv.live}`);
 const statuses=new Set(candidates.phase2LiveCandidatesV7.map(x=>x.promotionStatus));if(statuses.size!==1||!statuses.has('formulation_locked'))fail(`Initial V7 status must be formulation_locked only, found ${[...statuses].join(',')}`);
 if(pv.total!==100)fail(`Promotion wave registry must cover 100 recipes, found ${pv.total}`);
 if(rv.count!==100)fail(`Runtime adapter must cover 100 candidates, found ${rv.count}`);
 if(cv.total!==36||cv.phase2!==0)fail(`Pre-promotion live catalogue must remain 36 + 0, found ${cv.total} + phase2 ${cv.phase2}`);
 if(av.liveRequired!==0)fail(`No Phase 2 image may be required before a promotion wave is live, found ${av.liveRequired}`);
 for(const x of candidates.phase2LiveCandidatesV7){if(x.targetServings!==4)fail(`${x.id}: not four servings`);if(!x.nutrition||x.nutrition.servings!==4)fail(`${x.id}: V6 nutrition is not four-serving`);if(x.nutrition&&(x.nutrition.unresolvedIngredientIds.length||x.nutrition.unresolvedPrepIds.length))fail(`${x.id}: unresolved V6 nutrition rows`);if(!x.imageBrief||!x.imageBrief.trim())fail(`${x.id}: image brief missing`);if(!x.evidence.length)fail(`${x.id}: evidence missing`);for(const ing of x.ingredients){const def=ingredients.getCanonicalIngredientV7(ing.canonicalIngredientId);if(!def)fail(`${x.id}: canonical ingredient missing ${ing.canonicalIngredientId}`);else if(def.canonicalUnit!==ing.unit)fail(`${x.id}: canonical unit mismatch ${ing.canonicalIngredientId} ${ing.unit}/${def.canonicalUnit}`)}}
 const v2Files=['data/ingredient-engine-v2.ts','data/food-engine-v2.ts','data/runtime-dinner-v4.ts'];for(const rel of v2Files)if(/phase2-|ingredient-catalog-v7|runtime-dinner-v7|engine-v7/.test(read(rel)))fail(`${rel}: V2 foundation must not import V7 and recreate module cycles`);
 const v7IngredientSource=read('data/ingredient-engine-v7.ts'),v7FoodSource=read('data/food-engine-v7.ts'),v7RuntimeSource=read('data/runtime-dinner-v7.ts'),householdSource=read('components/HouseholdStateV12.tsx');
 if(!/getPhase2LiveRuntimeV7/.test(v7IngredientSource)||!/ingredientsForRecipeV2/.test(v7IngredientSource))fail('V7 ingredient wrapper must gate Phase 2 and fall back to V2');
 if(!/getPhase2LiveRuntimeV7/.test(v7FoodSource)||!/prepForRecipeAtCookScaleV4/.test(v7FoodSource))fail('V7 prep wrapper must gate Phase 2 and fall back to V2');
 if(!/getPhase2LiveRuntimeV7/.test(v7RuntimeSource)||!/getRuntimeDinnerFormulationV4/.test(v7RuntimeSource))fail('V7 dinner wrapper must gate Phase 2 and fall back to V4');
 for(const token of ['allLiveRecipesV7','prepNeedsForRecipesV7','shoppingNeedsForPlanV7','cookRecipeStateV7','setIngredientStockV7'])if(!householdSource.includes(token))fail(`Household provider is not promotion-ready: missing ${token}`);
 const original=runtimeDinner.getRuntimeDinnerFormulationV7('gold-chicken-curry',4);if(!original||original.targetServings!==4)fail('V7 runtime wrapper lost existing live recipe fallback');
 if(runtimeDinner.getRuntimeDinnerFormulationV7('mapo-tofu',4))fail('Formulation-locked Phase 2 recipe leaked live through V7 runtime wrapper');
 const originalIngredients=ingredientEngine.ingredientsForRecipeV7('gold-chicken-curry',undefined,4);if(!originalIngredients.length)fail('V7 ingredient wrapper lost existing live recipe ingredients');
 const originalPrep=foodEngine.prepForRecipeAtCookScaleV7('gold-chicken-curry',4);if(!originalPrep.length)fail('V7 prep wrapper lost existing live recipe prep');
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Live Promotion V7 readiness audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log(`\nHome Meals Live Promotion V7 readiness audit passed · ${result.ready}/100 structurally ready · 0/100 live · live catalogue 36 · ingredient catalogue ${iv.count} (${iv.phase2Added} Phase2 additions) · unit-safe canonical ingredients · 100/100 4-serving + supported 3-serving runtime adapters · sealed V2 foundation + promotion-gated V7 wrappers · household state promotion-ready · asset-gated catalogue · 11-wave promotion registry · V6 nutrition/prep overlays locked · evidence/image briefs present · GitHub Actions absent`);
}finally{fs.rmSync(out,{recursive:true,force:true})}
