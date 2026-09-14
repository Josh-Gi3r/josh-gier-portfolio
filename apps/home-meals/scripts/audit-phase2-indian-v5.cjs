const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-indian-v5'),failures=[];
const fail=m=>failures.push(m);
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-indian-recipes-v5.ts','data/indian-pantry-research-v5.ts','data/phase2-chinese-recipes-v4.ts','data/food-truth-v2.ts','data/food-quantity.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const recipes=require(path.join(out,'phase2-indian-recipes-v5.js')).phase2IndianRecipesV5,foundation=require(path.join(out,'indian-pantry-research-v5.js')).indianFoundationResearchV5,truth=require(path.join(out,'food-truth-v2.js'));
 if(recipes.length!==10)fail(`Indian Wave 2 must contain 10 recipes, found ${recipes.length}`);if(new Set(recipes.map(x=>x.id)).size!==10)fail('Indian recipe ids are not unique');
 const plan=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split('\t'));
 const planned=plan.filter(r=>r[2]?.startsWith('Indian')).slice(0,10).map(r=>r[0]);if(planned.length!==10)fail(`expansion plan no longer contains 10 Indian rows, found ${planned.length}`);for(const id of planned)if(!recipes.some(x=>x.id===id))fail(`planned Indian recipe not formulation-locked: ${id}`);
 const componentIds=new Set(truth.canonicalPrepComponentsV2.map(x=>x.id));for(const recipe of recipes){
  if(recipe.targetServings!==4)fail(`${recipe.id} is not four-serving`);if(recipe.status!=='formulation_locked')fail(`${recipe.id} is not formulation_locked`);if(!recipe.ingredients?.length||!recipe.steps?.length)fail(`${recipe.id} missing ingredient/method truth`);if(!(recipe.nutrition?.kcalPerPerson>0)||recipe.nutrition?.uncertaintyPct!==15||recipe.nutrition?.status!=='planning_reference')fail(`${recipe.id} invalid kcal reference`);if(!recipe.evidence?.some(x=>/^https:\/\//.test(x.url)))fail(`${recipe.id} lacks web culinary evidence`);if(!recipe.cookScaleNote)fail(`${recipe.id} lacks cook-scale note`);for(const p of recipe.prep)if(!componentIds.has(p.componentId))fail(`${recipe.id} references unknown prep ${p.componentId}`);
 }
 const butter=recipes.find(x=>x.id==='butter-chicken');if(!butter)fail('Butter chicken missing');else{const ids=butter.prep.map(x=>x.componentId);if(ids.join(',')!=='makhani')fail(`Butter chicken prep must be MAKHANI-only, found ${ids.join(',')}`);if(butter.ingredients.find(x=>x.id==='chicken-thigh')?.qty!==700)fail('Butter chicken should be a meal-scale 700g chicken four-serving batch');}
 const paneer=recipes.find(x=>x.id==='paneer-makhani');if(paneer?.prep.map(x=>x.componentId).join(',')!=='makhani')fail('Paneer makhani must use MAKHANI without GOLD');
 const korma=recipes.find(x=>x.id==='chicken-korma');if(korma?.prep.map(x=>x.componentId).join(',')!=='korma')fail('Chicken korma must remain KORMA-only and tomato-free at prep level');
 const tikka=recipes.find(x=>x.id==='chicken-tikka-masala');if(!tikka)fail('Chicken tikka masala missing');else{const ids=tikka.prep.map(x=>x.componentId).sort().join(',');if(ids!=='gold,red')fail(`Tikka masala should use GOLD+RED, not MAKHANI; found ${ids}`);if(tikka.prep.some(x=>x.componentId==='makhani'))fail('Tikka masala incorrectly collapses into butter-chicken MAKHANI architecture');}
 const dal=recipes.find(x=>x.id==='dal-tadka');if(dal?.prep.find(x=>x.componentId==='gold')?.qty!==180)fail('Dal tadka should use restrained 180g GOLD Home acceleration');
 const rajma=recipes.find(x=>x.id==='rajma-masala');if(!rajma?.evidence.some(x=>/fda\.gov/.test(x.url)))fail('Rajma missing authoritative raw-kidney-bean safety evidence');
 const aloo=recipes.find(x=>x.id==='aloo-gobi');if(aloo?.prep.find(x=>x.componentId==='gold')?.qty!==120)fail('Aloo gobi GOLD should remain a restrained 120g late shortcut');
 const omelette=recipes.find(x=>x.id==='masala-omelette');if(omelette?.prep.length)fail('Masala omelette must remain no-base');if(omelette?.ingredients.find(x=>x.id==='egg')?.qty!==8)fail('Masala omelette should be 8 eggs for four breakfast portions');
 for(const id of ['makhani','korma','gold','saag','tadka','kidney-bean-safety'])if(!foundation.some(x=>x.id===id))fail(`Indian shared foundation missing ${id}`);
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Phase 2 Indian v5 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals Phase 2 Indian v5 audit passed · 10/10 Indian recipes locked · Butter Chicken present · all four-serving · MAKHANI/KORMA/GOLD/SAAG semantics preserved · kidney-bean safety explicit · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
