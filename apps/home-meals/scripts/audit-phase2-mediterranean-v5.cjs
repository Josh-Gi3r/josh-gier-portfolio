const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-mediterranean-v5'),failures=[];
const fail=m=>failures.push(m);
try{
  fs.rmSync(out,{recursive:true,force:true});
  const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
  const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-mediterranean-recipes-v5.ts','data/mediterranean-pantry-research-v5.ts','data/phase2-chinese-recipes-v4.ts','data/food-truth-v2.ts','data/food-quantity.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
  const recipes=require(path.join(out,'phase2-mediterranean-recipes-v5.js')).phase2MediterraneanRecipesV5;
  const foundation=require(path.join(out,'mediterranean-pantry-research-v5.js')).mediterraneanFoundationResearchV5;
  const truth=require(path.join(out,'food-truth-v2.js'));
  const expected=['chicken-shawarma-bowl','kofta-tomato','falafel-bowl','hummus-eggs','zaatar-chicken-tray','lemon-herb-fish-couscous','greek-chicken-tray','halloumi-vegetable-wrap'];
  if(recipes.length!==8)fail(`Middle Eastern / Mediterranean Wave 5A must contain 8 recipes, found ${recipes.length}`);
  if(new Set(recipes.map(x=>x.id)).size!==8)fail('Middle Eastern / Mediterranean recipe ids are not unique');
  for(const id of expected)if(!recipes.some(x=>x.id===id))fail(`planned Middle Eastern / Mediterranean recipe not formulation-locked: ${id}`);
  const plan=fs.readFileSync(path.join(root,'data/recipe-expansion-plan-v3.tsv'),'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split('\t'));
  const planIds=new Set(plan.map(r=>r[0]));for(const id of expected)if(!planIds.has(id))fail(`research recipe is absent from expansion plan: ${id}`);
  const componentIds=new Set(truth.canonicalPrepComponentsV2.map(x=>x.id));
  for(const recipe of recipes){
    if(recipe.targetServings!==4)fail(`${recipe.id} is not four-serving`);
    if(recipe.status!=='formulation_locked')fail(`${recipe.id} is not formulation_locked`);
    if(!recipe.ingredients?.length||!recipe.steps?.length)fail(`${recipe.id} missing ingredient/method truth`);
    if(!(recipe.nutrition?.kcalPerPerson>0)||recipe.nutrition?.uncertaintyPct!==15||recipe.nutrition?.status!=='planning_reference')fail(`${recipe.id} invalid kcal planning reference`);
    if(!recipe.evidence?.some(x=>/^https:\/\//.test(x.url)))fail(`${recipe.id} lacks web culinary evidence`);
    if(!recipe.imageBrief?.trim())fail(`${recipe.id} missing image brief`);
    if(!recipe.cookScaleNote?.trim())fail(`${recipe.id} missing four-serving cook-scale note`);
    for(const p of recipe.prep??[])if(!componentIds.has(p.componentId))fail(`${recipe.id} references unknown prep ${p.componentId}`);
  }
  const shawarma=recipes.find(x=>x.id==='chicken-shawarma-bowl');if(shawarma?.prep.length)fail('Chicken shawarma bowl must remain direct/no-base');
  const kofta=recipes.find(x=>x.id==='kofta-tomato');if(kofta?.prep.map(x=>x.componentId).join(',')!=='red')fail('Kofta tomato must use RED only as the tomato braise shortcut');if(!kofta?.steps.some(x=>x.safetyTargetC===75))fail('Kofta tomato lost the 75C ground-meat endpoint');
  const falafel=recipes.find(x=>x.id==='falafel-bowl');if(falafel?.prep.length)fail('Falafel must remain direct/no-base');if(!falafel?.ingredients.some(x=>x.id==='dried-chickpeas'))fail('Falafel lost soaked dried chickpea identity');if(falafel?.ingredients.some(x=>x.id==='chickpeas-cooked'))fail('Falafel canonical path regressed to cooked/canned chickpeas');
  const hummus=recipes.find(x=>x.id==='hummus-eggs');if(hummus?.prep.length)fail('Hummus & eggs must remain direct/no-base');if(hummus?.ingredients.find(x=>x.id==='egg')?.qty!==8)fail('Hummus & eggs must remain an 8-egg four-serving breakfast');
  const zaatar=recipes.find(x=>x.id==='zaatar-chicken-tray');if(zaatar?.prep.length)fail("Za'atar chicken tray must remain direct/no-base");if(!/two trays|crowd|space/i.test(zaatar?.cookScaleNote||zaatar?.steps.map(x=>x.instruction).join(' ')||''))fail("Za'atar chicken tray lost four-serving tray-capacity guidance");
  const halloumi=recipes.find(x=>x.id==='halloumi-vegetable-wrap');if(!halloumi?.ingredients.some(x=>x.id==='halloumi'))fail('Halloumi vegetable wrap lost halloumi identity');
  for(const id of ['shawarma-spice','tahini','hummus','zaatar','sumac','kofta','falafel','couscous','halloumi']){const x=foundation.find(v=>v.id===id);if(!x)fail(`Mediterranean shared foundation missing ${id}`);else if(x.status!=='researched'||!/^https:\/\//.test(x.evidence?.url||''))fail(`Mediterranean shared foundation incomplete: ${id}`)}
  if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
  if(failures.length){console.error(`\nHome Meals Phase 2 Middle Eastern / Mediterranean v5 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
  else console.log('\nHome Meals Phase 2 Middle Eastern / Mediterranean v5 audit passed · 8/8 recipes locked · all four-serving · direct shawarma/falafel/hummus truth · RED-only kofta braise · tray-capacity and safety contracts intact · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
