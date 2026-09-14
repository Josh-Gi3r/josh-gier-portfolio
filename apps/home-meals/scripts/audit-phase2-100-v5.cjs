const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-100-v5'),failures=[];
const fail=m=>failures.push(m);
const waves=[
 ['phase2-chinese-recipes-v5',10],['phase2-chinese-wave1b-v5',5],['phase2-indian-recipes-v5',10],['phase2-thai-recipes-v5',8],
 ['phase2-malaysia-recipes-v5',10],['phase2-vietnamese-recipes-v5',6],['phase2-japanese-recipes-v5',8],['phase2-korean-recipes-v5',8],
 ['phase2-mediterranean-recipes-v5',8],['phase2-italian-european-recipes-v5',8],['phase2-mexican-recipes-v5',6],['phase2-everyday-recipes-v5',13]
];
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const roots=[...waves.map(([name])=>`data/${name}.ts`),'data/food-truth-v2.ts','data/food-quantity.ts'];
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,...roots],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const research=[];
 for(const [name,expectedCount] of waves){
  const mod=require(path.join(out,`${name}.js`)),arrays=Object.values(mod).filter(Array.isArray);
  if(arrays.length!==1){fail(`${name} must export exactly one recipe array, found ${arrays.length}`);continue}
  const arr=arrays[0];if(arr.length!==expectedCount)fail(`${name} expected ${expectedCount} recipes, found ${arr.length}`);research.push(...arr);
 }
 if(research.length!==100)fail(`Phase 2 research must contain exactly 100 recipes, found ${research.length}`);
 const ids=research.map(x=>x.id),uniqueIds=new Set(ids);if(uniqueIds.size!==ids.length)fail(`Phase 2 research contains ${ids.length-uniqueIds.size} duplicate recipe ids`);
 const planRows=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split('\t'));
 const plannedIds=planRows.map(r=>r[0]),plannedSet=new Set(plannedIds);if(plannedIds.length!==100||plannedSet.size!==100)fail(`Expansion plan must contain 100 unique ids, found ${plannedIds.length}/${plannedSet.size}`);
 for(const id of plannedIds)if(!uniqueIds.has(id))fail(`planned recipe is not formulation-locked: ${id}`);for(const id of ids)if(!plannedSet.has(id))fail(`formulation-locked recipe is not in expansion plan: ${id}`);
 const truth=require(path.join(out,'food-truth-v2.js')),componentIds=new Set(truth.canonicalPrepComponentsV2.map(x=>x.id));
 for(const recipe of research){
  if(recipe.targetServings!==4)fail(`${recipe.id} is not four-serving`);
  if(recipe.status!=='formulation_locked')fail(`${recipe.id} is not formulation_locked`);
  if(!recipe.ingredients?.length||!recipe.steps?.length)fail(`${recipe.id} missing ingredient/method truth`);
  if(!(recipe.nutrition?.kcalPerPerson>0)||recipe.nutrition?.uncertaintyPct!==15||recipe.nutrition?.status!=='planning_reference')fail(`${recipe.id} invalid kcal planning reference`);
  if(!recipe.evidence?.some(x=>/^https:\/\//.test(x.url)))fail(`${recipe.id} lacks HTTPS culinary evidence`);
  if(!recipe.imageBrief?.trim())fail(`${recipe.id} missing image brief`);
  if(!recipe.cookScaleNote?.trim())fail(`${recipe.id} missing four-serving cook-scale note`);
  for(const p of recipe.prep??[])if(!componentIds.has(p.componentId))fail(`${recipe.id} references unknown prep ${p.componentId}`);
 }
 const liveText=fs.readFileSync(path.join(root,'data/recipe-formulations-v2.ts'),'utf8'),liveIds=new Set([...liveText.matchAll(/R\("([a-z0-9-]+)"/g)].map(m=>m[1]));
 const promoted=ids.filter(id=>liveIds.has(id));if(promoted.length)fail(`Phase 2 recipes were promoted live before integration acceptance: ${promoted.join(', ')}`);
 if(liveIds.size!==36)fail(`existing live dinner catalogue drifted from 36 recipes, found ${liveIds.size}`);
 if(componentIds.size!==41)fail(`existing prep catalogue drifted from 41 components, found ${componentIds.size}`);
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Phase 2 100-recipe acceptance FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
 else console.log('\nHome Meals Phase 2 100-recipe acceptance passed · 100/100 FORMULATION LOCKED · 0/100 LIVE · all four-serving · exact expansion-plan parity · evidence/kcal/image/cook-scale contracts present · prep references resolve · existing 36 dinners + 41 prep objects unchanged · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
