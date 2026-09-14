const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.audit-phase2-chinese-v4'),failures=[];
const fail=m=>failures.push(m),unique=(xs,label)=>{const s=new Set();for(const x of xs){if(s.has(x))fail(`duplicate ${label}: ${x}`);s.add(x)}};
try{
  fs.rmSync(out,{recursive:true,force:true});
  const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
  const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/chinese-pantry-research-v4.ts','data/phase2-chinese-recipes-v4.ts','data/food-truth-v2.ts'],{cwd:root,stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
  const pantry=require(path.join(out,'chinese-pantry-research-v4.js')).chinesePantryResearchV4;
  const recipes=require(path.join(out,'phase2-chinese-recipes-v4.js')).phase2ChineseRecipesV4;
  const prep=require(path.join(out,'food-truth-v2.js')).canonicalPrepComponentsV2;
  const pantryIds=new Set(pantry.map(x=>x.id)),prepIds=new Set(prep.map(x=>x.id));
  if(pantry.length!==10)fail(`Wave 1 shared Chinese pantry research must have 10 locked records, found ${pantry.length}`);
  unique(pantry.map(x=>x.id),'Chinese pantry id');
  for(const p of pantry){if(p.status!=='researched')fail(`${p.id} pantry status is not researched`);if(!p.role||!p.useRule||!p.storageRule||!p.evidence?.url)fail(`${p.id} pantry record incomplete`)}
  const expected=['mapo-tofu','kung-pao-chicken','black-pepper-beef','tomato-egg-stir-fry','char-siu-pork','char-siu-chicken','steamed-fish-ginger-scallion','ginger-scallion-chicken','sweet-sour-chicken','garlic-aubergine'];
  if(recipes.length!==10)fail(`Wave 1A must contain exactly 10 formulation-locked recipes, found ${recipes.length}`);
  unique(recipes.map(x=>x.id),'Wave 1A recipe id');
  for(const id of expected)if(!recipes.some(x=>x.id===id))fail(`missing Wave 1A recipe: ${id}`);
  for(const x of recipes){
    if(x.status!=='formulation_locked')fail(`${x.id} is not formulation_locked`);
    if(x.targetServings!==2)fail(`${x.id} target servings drifted from 2`);
    if(!x.ingredients.length||!x.steps.length||!x.evidence.length)fail(`${x.id} research object incomplete`);
    if(!x.imageBrief?.trim())fail(`${x.id} missing post-lock image brief`);
    if(!(x.nutrition?.kcalPerPerson>=200&&x.nutrition.kcalPerPerson<=1500&&x.nutrition.uncertaintyPct===15&&x.nutrition.status==='planning_reference'))fail(`${x.id} planning nutrition contract invalid`);
    for(const p of x.prep)if(!prepIds.has(p.componentId))fail(`${x.id} references unknown prep component ${p.componentId}`);
    for(const id of x.pantryIds)if(!pantryIds.has(id))fail(`${x.id} references pantry id without Wave 1 shared research: ${id}`);
    for(const i of x.ingredients){if(!(i.qty>0)||!['g','ml','count'].includes(i.unit))fail(`${x.id}/${i.id} invalid ingredient quantity`)}
    if(!x.evidence.some(e=>e.role==='culinary_reference'))fail(`${x.id} has no culinary reference`);
  }
  const by=id=>recipes.find(x=>x.id===id);
  if(by('mapo-tofu').pantryIds.includes('chinkiang-vinegar')||by('mapo-tofu').pantryIds.includes('light-soy')||by('mapo-tofu').pantryIds.includes('dark-soy'))fail('Mapo research regressed to generic soy/black-vinegar planning levers');
  if(!by('kung-pao-chicken').pantryIds.includes('rice-vinegar')||by('kung-pao-chicken').pantryIds.includes('chinkiang-vinegar'))fail('Kung pao vinegar truth regressed');
  if(by('tomato-egg-stir-fry').pantryIds.includes('light-soy')||!by('tomato-egg-stir-fry').pantryIds.includes('shaoxing-wine'))fail('Tomato egg pantry truth regressed');
  if(by('ginger-scallion-chicken').format!=='poach'||!by('ginger-scallion-chicken').prep.some(x=>x.componentId==='ginger-scallion'))fail('Ginger-scallion chicken lost the coherent GS-OIL poached formulation');
  if(!by('sweet-sour-chicken').pantryIds.includes('rice-vinegar')||by('sweet-sour-chicken').pantryIds.includes('chinkiang-vinegar'))fail('Sweet-sour chicken vinegar truth regressed');
  if(!by('garlic-aubergine').pantryIds.includes('rice-vinegar')||by('garlic-aubergine').pantryIds.includes('chinkiang-vinegar'))fail('Garlic aubergine vinegar truth regressed');
  if(!by('char-siu-pork').prep.some(x=>x.componentId==='char-siu')||!by('char-siu-chicken').prep.some(x=>x.componentId==='char-siu'))fail('Char siu recipes no longer use existing clean CHAR-SIU mid');
  if(failures.length){console.error(`\nHome Meals Phase 2 Chinese audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
  else console.log('\nHome Meals Phase 2 Chinese audit passed · shared pantry/technique truth · 10 formulation-locked recipes · corrected vinegar/soy assumptions · exact two-person quantities · kcal references · evidence/image briefs · no live promotion');
}finally{fs.rmSync(out,{recursive:true,force:true})}
