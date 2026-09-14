const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-completion-v5'),failures=[];
const fail=m=>failures.push(m);
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-research-registry-v5.ts','data/food-truth-v2.ts','data/pantry-foundations-v3.ts','data/food-quantity.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const registry=require(path.join(out,'phase2-research-registry-v5.js')),recipes=registry.phase2ResearchRecipesV5,counts=registry.phase2ResearchCountsV5,truth=require(path.join(out,'food-truth-v2.js')),pantry=require(path.join(out,'pantry-foundations-v3.js')).pantryFoundationsV3;
 if(recipes.length!==100)fail(`Phase 2 research registry must contain exactly 100 recipes, found ${recipes.length}`);
 const expectedCounts={chinese:15,indian:10,thai:8,malaysiaSingaporeIndonesia:10,vietnamese:6,japanese:8,korean:8,middleEasternMediterranean:8,italianEuropean:8,mexicanLatin:6,everyday:13,total:100};for(const [k,v] of Object.entries(expectedCounts))if(counts[k]!==v)fail(`Phase 2 wave count ${k} expected ${v}, found ${counts[k]}`);
 const ids=recipes.map(x=>x.id),idSet=new Set(ids);if(idSet.size!==100)fail(`Phase 2 ids must be unique, found ${idSet.size}/100 unique`);
 const lines=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8').trim().split(/\r?\n/),planned=lines.slice(1).map(x=>x.split('\t')[0]);if(planned.length!==100)fail(`planning TSV must contain 100 candidates, found ${planned.length}`);if(new Set(planned).size!==100)fail('planning TSV contains duplicate ids');for(const id of planned)if(!idSet.has(id))fail(`planned recipe missing locked research: ${id}`);for(const id of ids)if(!planned.includes(id))fail(`locked research not in 100-plan: ${id}`);
 if(!idSet.has('butter-chicken'))fail('Butter Chicken is missing from completed Phase 2 research');
 const componentIds=new Set(truth.canonicalPrepComponentsV2.map(x=>x.id)),pantryIds=new Set(pantry.map(x=>x.id));
 for(const recipe of recipes){
  if(recipe.targetServings!==4)fail(`${recipe.id} is not four-serving`);
  if(recipe.status!=='formulation_locked')fail(`${recipe.id} is not formulation_locked`);
  if(!recipe.ingredients?.length)fail(`${recipe.id} has no ingredient formulation`);
  if(!recipe.steps?.length)fail(`${recipe.id} has no method`);
  if(!recipe.cookScaleNote?.trim())fail(`${recipe.id} lacks cook-scale guidance`);
  if(!recipe.imageBrief?.trim())fail(`${recipe.id} lacks image brief`);
  if(!(recipe.nutrition?.kcalPerPerson>0)||recipe.nutrition?.uncertaintyPct!==15||recipe.nutrition?.status!=='planning_reference')fail(`${recipe.id} lacks valid reference kcal truth`);
  if(!recipe.evidence?.some(x=>/^https:\/\//.test(x.url)))fail(`${recipe.id} lacks web culinary evidence`);
  for(const ingredient of recipe.ingredients){if(!ingredient.id||!ingredient.name||!(ingredient.qty>0)||!['g','ml','count'].includes(ingredient.unit))fail(`${recipe.id} has invalid ingredient row ${JSON.stringify(ingredient)}`)}
  for(const req of recipe.prep??[])if(!componentIds.has(req.componentId))fail(`${recipe.id} references missing prep component ${req.componentId}`);
  for(const id of recipe.pantryIds??[])if(!pantryIds.has(id))fail(`${recipe.id} references missing pantry foundation ${id}`);
 }
 const prepStrategies=recipes.reduce((m,x)=>(m[x.prepStrategy]=(m[x.prepStrategy]||0)+1,m),{});if((prepStrategies['no-base']||0)<25)fail(`Phase 2 should retain broad no-base coverage, found ${prepStrategies['no-base']||0}`);if((prepStrategies['pantry-sauce']||0)<15)fail(`Phase 2 should retain broad pantry-sauce coverage, found ${prepStrategies['pantry-sauce']||0}`);
 const occasions=recipes.reduce((m,x)=>(m[x.occasion]=(m[x.occasion]||0)+1,m),{});if(!occasions.breakfast||!occasions.lunch||!occasions.dinner)fail(`Phase 2 occasion coverage incomplete: ${JSON.stringify(occasions)}`);
 const weights=new Set(recipes.map(x=>x.mealWeight));for(const w of ['light','balanced','hearty','rich'])if(!weights.has(w))fail(`Phase 2 meal-weight lane missing ${w}`);
 const futureSource=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8');if(!/butter-chicken/.test(futureSource))fail('Butter Chicken disappeared from future planning truth');
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Phase 2 completion v5 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log(`\nHome Meals Phase 2 completion v5 audit passed · ${recipes.length}/100 formulation-locked · all four-serving · Butter Chicken present · kcal/evidence/image briefs complete · prep/pantry references valid · no-base ${prepStrategies['no-base']||0} · pantry-sauce ${prepStrategies['pantry-sauce']||0} · GitHub Actions absent`);
}finally{fs.rmSync(out,{recursive:true,force:true})}
