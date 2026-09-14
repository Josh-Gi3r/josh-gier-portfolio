const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-phase2-italian-european-v5'),failures=[];
const fail=m=>failures.push(m);
try{
  fs.rmSync(out,{recursive:true,force:true});
  const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
  const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-italian-european-recipes-v5.ts','data/italian-european-pantry-research-v5.ts','data/phase2-chinese-recipes-v4.ts','data/food-truth-v2.ts','data/food-quantity.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
  const recipes=require(path.join(out,'phase2-italian-european-recipes-v5.js')).phase2ItalianEuropeanRecipesV5;
  const foundation=require(path.join(out,'italian-european-pantry-research-v5.js')).italianEuropeanFoundationResearchV5;
  const truth=require(path.join(out,'food-truth-v2.js'));
  const expected=['spaghetti-carbonara','amatriciana','puttanesca','aglio-olio-prawns','chicken-parmigiana','meatballs-red-sauce','mushroom-risotto','potato-greens-frittata'];
  if(recipes.length!==8)fail(`Italian / European Wave 5B must contain 8 recipes, found ${recipes.length}`);
  if(new Set(recipes.map(x=>x.id)).size!==8)fail('Italian / European recipe ids are not unique');
  for(const id of expected)if(!recipes.some(x=>x.id===id))fail(`planned Italian / European recipe not formulation-locked: ${id}`);
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
  const carbonara=recipes.find(x=>x.id==='spaghetti-carbonara');if(carbonara?.prep.length)fail('Carbonara must remain no-base');if(carbonara?.ingredients.some(x=>/cream/i.test(x.id)||/cream/i.test(x.name)))fail('Carbonara must not add cream');if(!carbonara?.ingredients.some(x=>x.id==='guanciale')||!carbonara?.ingredients.some(x=>x.id==='pecorino-romano')||!carbonara?.ingredients.some(x=>x.id==='egg-yolk'))fail('Carbonara lost guanciale/pecorino/egg identity');
  const amatriciana=recipes.find(x=>x.id==='amatriciana');if(amatriciana?.prep.map(x=>x.componentId).join(',')!=='red')fail('Amatriciana must use RED only');
  const puttanesca=recipes.find(x=>x.id==='puttanesca');if(puttanesca?.prep.map(x=>x.componentId).join(',')!=='red')fail('Puttanesca must use RED only');for(const id of ['anchovy','kalamata-olive','capers'])if(!puttanesca?.ingredients.some(x=>x.id===id))fail(`Puttanesca lost ${id}`);
  const aglio=recipes.find(x=>x.id==='aglio-olio-prawns');if(aglio?.prep.map(x=>x.componentId).join(',')!=='garlic')fail('Aglio e olio prawns must use only the garlic booster shortcut');if(aglio?.ingredients.find(x=>x.id==='large-prawns')?.qty!==600)fail('Aglio e olio prawns must remain a 600g four-serving prawn batch');if(!aglio?.steps.some(x=>x.safetyTargetC===63))fail('Aglio e olio prawns lost seafood thermometer endpoint');
  const parm=recipes.find(x=>x.id==='chicken-parmigiana');if(parm?.prep.map(x=>x.componentId).join(',')!=='red')fail('Chicken parmigiana must use RED only');if(!parm?.steps.some(x=>x.safetyTargetC===75))fail('Chicken parmigiana lost 75C poultry endpoint');
  const meatballs=recipes.find(x=>x.id==='meatballs-red-sauce');if(meatballs?.prep.map(x=>x.componentId).join(',')!=='red')fail('Meatballs in red sauce must use RED only');if(!meatballs?.steps.some(x=>x.safetyTargetC===75))fail('Meatballs lost 75C ground-meat endpoint');
  const risotto=recipes.find(x=>x.id==='mushroom-risotto');if(risotto?.prep.map(x=>x.componentId).sort().join(',')!=='clear,duxelles')fail('Mushroom risotto must use CLEAR + DUX');if(!risotto?.ingredients.some(x=>x.id==='fresh-mushroom'))fail('Mushroom risotto must retain fresh mushroom texture rather than DUX-only');
  const frittata=recipes.find(x=>x.id==='potato-greens-frittata');if(frittata?.prep.length)fail('Potato & greens frittata must remain no-base');if(frittata?.ingredients.find(x=>x.id==='egg')?.qty!==10)fail('Potato & greens frittata must remain a 10-egg four-serving formulation');
  for(const x of foundation){if(x.status!=='researched'||!/^https:\/\//.test(x.evidence?.url||''))fail(`Italian / European shared foundation incomplete: ${x.id}`)}
  for(const id of ['pasta-water','pecorino','guanciale','red','duxelles','clear','aglio-olio','frittata'])if(!foundation.some(x=>x.id===id))fail(`Italian / European shared foundation missing ${id}`);
  if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
  if(failures.length){console.error(`\nHome Meals Phase 2 Italian / European v5 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
  else console.log('\nHome Meals Phase 2 Italian / European v5 audit passed · 8/8 recipes locked · all four-serving · carbonara no-cream/no-base · RED pasta/parm/meatball boundaries · G prawns · DUX+CLEAR risotto · no-base frittata · safety contracts intact · GitHub Actions absent');
}finally{fs.rmSync(out,{recursive:true,force:true})}
