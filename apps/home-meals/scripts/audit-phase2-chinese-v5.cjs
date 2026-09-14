const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-chinese-v5'),failures=[];
const fail=m=>failures.push(m);
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-chinese-recipes-v4.ts','data/phase2-chinese-recipes-v5.ts','data/phase2-chinese-wave1b-v5.ts','data/chinese-pantry-research-v4.ts','data/pantry-foundations-v3.ts','data/household-serving-policy-v4.ts','data/food-truth-v2.ts','data/food-quantity.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const a=require(path.join(out,'phase2-chinese-recipes-v5.js')).phase2ChineseRecipesV5,b=require(path.join(out,'phase2-chinese-wave1b-v5.js')).phase2ChineseWave1BRecipesV5,pantry=require(path.join(out,'pantry-foundations-v3.js')).pantryFoundationsV3;
 if(a.length!==10)fail(`Wave 1A must contain 10 rebased recipes, found ${a.length}`);if(b.length!==5)fail(`Wave 1B must contain 5 recipes, found ${b.length}`);
 const all=[...a,...b],ids=all.map(x=>x.id);if(new Set(ids).size!==15)fail('Chinese Phase 2 ids are not unique');
 const tsv=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split('\t'));
 const planned=tsv.filter(r=>r[2]?.startsWith('Chinese')).slice(0,15).map(r=>r[0]);if(planned.length!==15)fail(`expansion plan no longer contains 15 Chinese rows, found ${planned.length}`);for(const id of planned)if(!ids.includes(id))fail(`planned Chinese recipe not locked in v5 research: ${id}`);for(const id of ids)if(!planned.includes(id))fail(`v5 Chinese recipe not in planned Chinese set: ${id}`);
 for(const recipe of all){
  if(recipe.targetServings!==4)fail(`${recipe.id} is not four-serving`);
  if(recipe.status!=='formulation_locked')fail(`${recipe.id} is not formulation_locked`);
  if(!recipe.ingredients?.length)fail(`${recipe.id} has no ingredient formulation`);
  if(!recipe.steps?.length)fail(`${recipe.id} has no cooking method`);
  if(!(recipe.nutrition?.kcalPerPerson>0)||recipe.nutrition?.uncertaintyPct!==15||recipe.nutrition?.status!=='planning_reference')fail(`${recipe.id} has invalid kcal planning reference`);
  if(!recipe.evidence?.some(x=>/^https:\/\//.test(x.url)))fail(`${recipe.id} has no web culinary evidence`);
  if(!recipe.cookScaleNote)fail(`${recipe.id} has no four-serving cook-scale note`);
  if((recipe.format.includes('wok')||recipe.format==='wok')&&!/two|uncrowd|batch/i.test(recipe.cookScaleNote))fail(`${recipe.id} lacks four-serving wok capacity guidance`);
 }
 const pantryIds=new Set(pantry.map(x=>x.id));for(const recipe of all)for(const id of recipe.pantryIds??[])if(!pantryIds.has(id))fail(`${recipe.id} references unknown pantry foundation ${id}`);
 const dan=all.find(x=>x.id==='dan-dan-noodles');if(!dan)fail('Dan dan noodles missing');else{if(dan.prep?.length)fail('Dan dan noodles should not force DOUBAN or another prep component');if(dan.prepStrategy!=='pantry-sauce')fail('Dan dan noodles should be pantry-sauce/direct assembly');if(!dan.ingredients.some(x=>x.ingredientId==='sui-mi-ya-cai')||!dan.ingredients.some(x=>x.ingredientId==='chilli-oil'))fail('Dan dan noodles lost ya cai/chilli-oil identity');}
 const chowFun=all.find(x=>x.id==='beef-chow-fun');if(chowFun?.targetServings!==4||!chowFun.ingredients.some(x=>x.ingredientId==='fresh-wide-rice-noodles'))fail('Beef chow fun four-serving fresh-noodle formulation missing');
 const chowMein=all.find(x=>x.id==='chicken-chow-mein');if(!chowMein?.ingredients.some(x=>x.ingredientId==='hk-pan-fried-noodles'))fail('Chicken chow mein lost Hong Kong pan-fried noodle identity');
 const fried=all.find(x=>x.id==='egg-fried-rice');if(fried?.ingredients.find(x=>x.ingredientId==='egg')?.qty!==6)fail('Home egg fried rice should remain a meal-scale 6-egg four-serving formulation');
 const prawns=all.find(x=>x.id==='salt-pepper-prawns');if(prawns?.ingredients.find(x=>x.ingredientId==='large-prawns')?.qty!==600)fail('Salt & pepper prawns should remain a 600g four-serving dinner formulation');
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Phase 2 Chinese v5 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals Phase 2 Chinese v5 audit passed · 15/15 Chinese recipes locked · all four-serving · pantry/technique/source/kcal contracts present · Dan Dan DOUBAN overreach removed · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
