const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-serving-policy-v4'),failures=[];
const fail=m=>failures.push(m),read=rel=>fs.readFileSync(path.join(root,rel),'utf8'),exists=p=>fs.existsSync(p);
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/household-serving-policy-v4.ts','data/food-engine-v2.ts','data/ingredient-engine-v2.ts','data/recipe-truth-v2.ts','data/runtime-dinner-v4.ts','data/recipe-formulations-v2.ts','data/food-truth-v2.ts','data/home-data.ts'],{cwd:root,stdio:'inherit'});
 if(r.status!==0)process.exit(r.status||1);
 const policy=require(path.join(out,'household-serving-policy-v4.js'));
 const runtime=require(path.join(out,'runtime-dinner-v4.js'));
 const truth=require(path.join(out,'recipe-truth-v2.js'));
 const engine=require(path.join(out,'food-engine-v2.js'));
 if(policy.TYPICAL_DINERS_V4!==2)fail('typical diners must remain 2');
 if(policy.DEFAULT_COOK_SERVINGS_V4!==4)fail('default cook batch must remain 4 servings');
 if(policy.MIN_COOK_SERVINGS_V4!==3)fail('supported smaller cook must remain 3 servings');
 if(policy.DEFAULT_LEFTOVER_SERVINGS_V4!==2)fail('default leftover expectation must remain 2 servings');
 if(truth.canonicalRecipesV2.length!==36||truth.canonicalRecipesV2.some(x=>x.servings!==4))fail('all 36 live canonical recipes must expose 4 servings');
 const curry=runtime.getRuntimeDinnerFormulationV4('gold-chicken-curry');
 if(!curry||curry.targetServings!==4)fail('runtime chicken curry is not four-serving');
 const chicken=curry?.ingredients.find(x=>x.ingredientId==='chicken-thigh'),oil=curry?.ingredients.find(x=>x.ingredientId==='neutral-oil');
 if(chicken?.qty!==800)fail(`four-serving chicken curry chicken should be 800g, found ${chicken?.qty}`);
 if(!(oil?.qty>15&&oil?.qty<30))fail(`cooking oil should scale non-linearly, found ${oil?.qty}`);
 const gold=engine.prepForRecipeAtCookScaleV4('gold-chicken-curry').find(x=>x.componentId==='gold');if(gold?.quantity.qty!==240)fail(`GOLD four-serving use should be 240g, found ${gold?.quantity.qty}`);
 const krapow=engine.prepForRecipeAtCookScaleV4('pad-kra-pao').find(x=>x.componentId==='krapow');if(krapow?.quantity.qty!==75)fail(`KRAPOW four-serving use should be 75ml, found ${krapow?.quantity.qty}`);
 const wok=engine.prepForRecipeAtCookScaleV4('beef-broccoli').find(x=>x.componentId==='wok-brown');if(wok?.quantity.qty!==225)fail(`WOK-B four-serving use should be 225ml, found ${wok?.quantity.qty}`);
 const curry3=runtime.getRuntimeDinnerFormulationV4('gold-chicken-curry',3);const chicken3=curry3?.ingredients.find(x=>x.ingredientId==='chicken-thigh');if(!(chicken3?.qty>400&&chicken3?.qty<800))fail(`three-serving chicken should sit between legacy 2 and default 4, found ${chicken3?.qty}`);
 const recipeUi=read('components/app/Recipe.tsx'),cookUi=read('components/app/Cooking.tsx'),household=read('data/household-v12.ts'),runtimeV7=read('data/runtime-dinner-v7.ts');
 // V7 is now the user-facing gate. It must delegate original live recipes to the proven V4 runtime rather than replacing serving truth.
 if(!/getRuntimeDinnerFormulationV7/.test(recipeUi)||!/getRuntimeDinnerFormulationV7/.test(cookUi))fail('recipe/cooking UI is not bound to the unified four-serving V7 runtime gate');
 if(!/getOriginalRuntimeDinnerV8/.test(runtimeV7)||!/getPhase2LiveRuntimeV7/.test(runtimeV7))fail('V7 runtime gate must preserve the V8-corrected V4 foundation and promotion-gated Phase 2 runtime');
 if(!/prepForRecipeAtCookScaleV4/.test(household))fail('v12 cook completion does not preserve four-serving prep truth for the original 36');
 if(/for\(const requirement of recipePrepV2\(recipeId\)\)/.test(household))fail('cook completion still consumes raw two-serving prep reference');
 const workflow=path.join(repo,'.github','workflows','home-meals-ci.yml');if(exists(workflow))fail('Home Meals GitHub Actions workflow must remain removed');
 const v5=read('data/phase2-chinese-recipes-v5.ts');if(!/targetServings:4/.test(v5))fail('Phase 2 Chinese v5 research is not rebased to four servings');
 if(failures.length){console.error(`\nHome Meals serving-policy v4 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
 else console.log('\nHome Meals serving-policy v4 audit passed · 2 diners · 4-serving default cook · 3-serving option · V7 UI gate preserves V4 serving truth · leftovers explicit · non-linear seasoning/fat scaling · runtime/grocery/prep/cook truth aligned · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
