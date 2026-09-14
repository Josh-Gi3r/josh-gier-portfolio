const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.audit-data'),failures=[];
const fail=m=>failures.push(m),unique=(xs,label)=>{const s=new Set();for(const x of xs){if(s.has(x))fail(`duplicate ${label}: ${x}`);s.add(x)}};
function activeFiles(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?activeFiles(p):/\.(ts|tsx)$/.test(e.name)?[p]:[]})}
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const files=['data/home-data.ts','data/food-truth-v2.ts','data/recipe-truth-v2.ts','data/prep-formulations-v2.ts','data/recipe-formulations-v2.ts','data/mid-content-v3.ts','data/base-recipes-v2.ts'];
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,...files],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const h=require(path.join(out,'home-data.js')),truth=require(path.join(out,'food-truth-v2.js')),recipeTruth=require(path.join(out,'recipe-truth-v2.js')),prepForms=require(path.join(out,'prep-formulations-v2.js')),dinnerForms=require(path.join(out,'recipe-formulations-v2.js'));
 const {midContent}=require(path.join(out,'mid-content-v3.js')),{baseRecipesV2}=require(path.join(out,'base-recipes-v2.js'));
 const {recipes,ingredients,prepComponents,motherBases,midBases,defaultWeek,getIngredient}=h;
 if(recipes.length!==36)fail(`current catalogue must contain 36 dinners, found ${recipes.length}`);
 const mothers=['red','blond','gold','sambal','rempah','clear','dark','onion'];if(motherBases.length!==8||mothers.some(id=>!motherBases.some(x=>x.id===id)))fail(`mother set must remain the canonical eight: ${mothers.join(', ')}`);if(midBases.length!==26)fail(`mid catalogue must contain 26 mids, found ${midBases.length}`);if(defaultWeek.length!==7)fail(`default week must contain 7 dinners, found ${defaultWeek.length}`);
 unique(recipes.map(x=>x.id),'recipe id');unique(ingredients.map(x=>x.id),'ingredient id');unique(prepComponents.map(x=>x.id),'prep id');unique(prepComponents.map(x=>x.code),'prep code');
 const rids=new Set(recipes.map(x=>x.id)),iids=new Set(ingredients.map(x=>x.id)),pids=new Set(prepComponents.map(x=>x.id));for(const id of defaultWeek)if(!rids.has(id))fail(`default week references missing recipe: ${id}`);
 for(const recipe of recipes){
  if(!recipe.title?.trim())fail(`recipe ${recipe.id} has no title`);if(!recipe.subtitle?.trim())fail(`recipe ${recipe.id} has no subtitle`);if(!recipe.image?.startsWith('https://'))fail(`recipe ${recipe.id} has no HTTPS image`);if(!recipe.source?.url?.startsWith('https://'))fail(`recipe ${recipe.id} has no HTTPS legacy display source`);if(!recipe.steps?.length||recipe.steps.length<3)fail(`recipe ${recipe.id} has fewer than 3 legacy-display steps`);if(recipe.steps?.some(x=>/\b(todo|placeholder|lorem|coming soon)\b/i.test(x)))fail(`recipe ${recipe.id} contains placeholder cooking text`);
  for(const p of recipe.prep??[])if(!pids.has(p.id))fail(`legacy display recipe ${recipe.id} references missing prep ${p.id}`);
  if(!recipe.ingredients?.length)fail(`recipe ${recipe.id} has no display ingredients`);for(const q of recipe.ingredients){const d=getIngredient(q.id);if(!iids.has(q.id)||!d){fail(`recipe ${recipe.id} references missing ingredient ${q.id}`);continue}if(!(q.qty>0))fail(`recipe ${recipe.id} has invalid ingredient quantity for ${q.id}`)}
 }
 // Historical content files are explanatory/display compatibility only. Quantitative production truth is v2.
 for(const [id,x] of Object.entries(midContent)){if(!midBases.some(m=>m.id===id))fail(`orphan mid content: ${id}`);if(!x.what?.trim()||!x.method?.length)fail(`mid ${id} explanatory content is incomplete`)}
 for(const [id,x] of Object.entries(baseRecipesV2)){if(!motherBases.some(m=>m.id===id))fail(`orphan mother content: ${id}`);if(!x.ingredients?.length||x.method?.length<3)fail(`mother ${id} explanatory content is incomplete`)}
 if(truth.canonicalPrepComponentsV2.length!==41)fail(`v2 must contain 41 prep components, found ${truth.canonicalPrepComponentsV2.length}`);
 if(recipeTruth.canonicalRecipesV2.length!==36)fail(`v2 must contain 36 recipes, found ${recipeTruth.canonicalRecipesV2.length}`);
 if(prepForms.canonicalPrepFormulationsV2.length!==41)fail(`v2 must contain 41 prep formulations, found ${prepForms.canonicalPrepFormulationsV2.length}`);
 if(dinnerForms.canonicalDinnerFormulationsV2.length!==36)fail(`v2 must contain 36 dinner formulations, found ${dinnerForms.canonicalDinnerFormulationsV2.length}`);
 const v2RecipeIds=new Set(recipeTruth.canonicalRecipesV2.map(x=>x.id));for(const id of rids)if(!v2RecipeIds.has(id))fail(`current dinner ${id} has no canonical v2 recipe`);
 const v2FormIds=new Set(dinnerForms.canonicalDinnerFormulationsV2.map(x=>x.recipeId));for(const id of rids)if(!v2FormIds.has(id))fail(`current dinner ${id} has no canonical v2 formulation`);
 const unresolvedSources=recipeTruth.canonicalRecipesV2.filter(x=>x.sourceStatus==='generic_or_wrong');if(unresolvedSources.length)fail(`canonical dinner sources still generic/wrong: ${unresolvedSources.map(x=>x.id).join(', ')}`);
 const goldReq=truth.recipePrepRequirementsV2['gold-chicken-curry']??[];if(goldReq.length!==1||goldReq[0].componentId!=='gold'||goldReq[0].quantity.qty!==120||goldReq[0].quantity.unit!=='g')fail('canonical GOLD chicken curry must consume exactly 120 g GOLD and no duplicate ginger-garlic prep');
 for(const c of truth.canonicalPrepComponentsV2){if('batchYield' in c||'targetBatchOutput' in c||'portionMl' in c)fail(`canonical v2 prep ${c.id} reintroduced an unmeasured yield field`);if(c.measurementStatus!=='unmeasured')fail(`canonical v2 prep ${c.id} claims household measurement before observation`)}
 for(const f of dinnerForms.canonicalDinnerFormulationsV2)if(f.actualFinishedWeightG!==null||f.actualServings!==null||f.actualCookMinutes!==null)fail(`${f.recipeId} claims unmeasured household output/time`);
 const unsafe=[['prepNeedsForWeek(',/\bprepNeedsForWeek\s*\(/],['componentConsumption(',/\bcomponentConsumption\s*\(/],['batchOutputMl(',/\bbatchOutputMl\s*\(/]];for(const file of [...activeFiles(path.join(root,'app')),...activeFiles(path.join(root,'components')),...activeFiles(path.join(root,'lib'))]){const text=fs.readFileSync(file,'utf8');for(const [name,re] of unsafe)if(re.test(text))fail(`active runtime uses legacy portion/batch API ${name}: ${path.relative(root,file)}`)}
 // Dormant research objects are intentional library ideas, not incomplete setup. Lock the exact set so any drift requires an explicit product decision.
 const usage=new Map(truth.canonicalPrepComponentsV2.map(x=>[x.id,0]));for(const requirements of Object.values(truth.recipePrepRequirementsV2))for(const p of requirements)usage.set(p.componentId,(usage.get(p.componentId)||0)+1);
 const dormantMids=midBases.filter(x=>(usage.get(x.id)||0)===0).map(x=>x.id).sort(),expectedDormantMids=['asam-pedas','char-siu','dashi','douban','ginger-scallion','jp-curry','k-anchovy','korma','makhani','malaysian-kari','nam-prik-pao','nuoc-cham'].sort();
 if(JSON.stringify(dormantMids)!==JSON.stringify(expectedDormantMids))fail(`dormant mid set changed unexpectedly: ${dormantMids.join(', ')}`);
 const dormantMothers=motherBases.filter(x=>(usage.get(x.id)||0)===0).map(x=>x.id).sort();if(JSON.stringify(dormantMothers)!==JSON.stringify(['onion']))fail(`dormant mother set changed unexpectedly: ${dormantMothers.join(', ')}`);
 if(failures.length){console.error(`\nHome Meals catalogue audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log(`\nHome Meals catalogue audit passed · ${recipes.length} recipes · ${ingredients.length} display ingredients · 41 canonical prep formulations · 36 canonical dinner formulations · canonical sources resolved · dormant library locked · no assumed batch yields`);
}finally{fs.rmSync(out,{recursive:true,force:true})}
