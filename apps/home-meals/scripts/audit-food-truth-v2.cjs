const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.audit-food-truth-v2'),failures=[];
const fail=m=>failures.push(m),unique=(xs,label)=>{const s=new Set();for(const x of xs){if(s.has(x))fail(`duplicate ${label}: ${x}`);s.add(x)}};
try{
  fs.rmSync(out,{recursive:true,force:true});
  const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
  const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/food-truth-v2.ts','data/food-engine-v2.ts','data/home-data.ts'],{cwd:root,stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);

  const truth=require(path.join(out,'food-truth-v2.js'));
  const engine=require(path.join(out,'food-engine-v2.js'));
  const current=require(path.join(out,'home-data.js'));
  const components=truth.canonicalPrepComponentsV2,recipes=truth.recipePrepRequirementsV2;
  if(components.length!==41)fail(`canonical v2 prep set must contain 41 components, found ${components.length}`);
  const tierCounts=components.reduce((m,x)=>(m[x.tier]=(m[x.tier]||0)+1,m),{});
  if(tierCounts.mother!==8||tierCounts.mid!==26||tierCounts.booster!==7)fail(`canonical v2 tiers must be 8 mothers / 26 mids / 7 boosters, found ${JSON.stringify(tierCounts)}`);
  unique(components.map(x=>x.id),'v2 prep id');unique(components.map(x=>x.code),'v2 prep code');
  const ids=new Set(components.map(x=>x.id));
  for(const c of components){
    if(!(c.workingUnit&&Number.isFinite(c.workingUnit.qty)&&c.workingUnit.qty>0))fail(`invalid working quantity: ${c.id}`);
    if(!['g','ml','count'].includes(c.workingUnit.unit))fail(`invalid working unit: ${c.id}/${c.workingUnit.unit}`);
    if('targetBatchOutput' in c||'batchYield' in c||'portionMl' in c)fail(`v2 component must not carry unmeasured physical yield/legacy ml fields: ${c.id}`);
    const used=new Set(c.usedWith);
    for(const parent of c.madeFrom){if(!ids.has(parent))fail(`${c.id} madeFrom missing component ${parent}`);if(parent===c.id)fail(`${c.id} cannot be made from itself`);if(used.has(parent))fail(`${c.id}/${parent} cannot be both madeFrom and usedWith`)}
    for(const partner of c.usedWith){if(!ids.has(partner))fail(`${c.id} usedWith missing component ${partner}`);if(partner===c.id)fail(`${c.id} cannot be usedWith itself`)}
  }

  const currentRecipeIds=new Set(current.recipes.map(x=>x.id)),v2RecipeIds=Object.keys(recipes);
  if(v2RecipeIds.length!==36)fail(`v2 recipe prep contract must cover 36 dinners, found ${v2RecipeIds.length}`);
  for(const id of currentRecipeIds)if(!recipes[id])fail(`current recipe missing v2 prep contract: ${id}`);
  for(const id of v2RecipeIds)if(!currentRecipeIds.has(id))fail(`v2 prep contract references non-current recipe: ${id}`);
  for(const [recipeId,requirements] of Object.entries(recipes)){
    if(!requirements.length)fail(`v2 recipe has no prep requirements: ${recipeId}`);
    const seen=new Set();
    for(const req of requirements){
      const component=components.find(x=>x.id===req.componentId);
      if(!component){fail(`${recipeId} references missing v2 prep ${req.componentId}`);continue}
      if(seen.has(req.componentId))fail(`${recipeId} duplicates prep ${req.componentId}`);seen.add(req.componentId);
      if(!(req.quantity&&Number.isFinite(req.quantity.qty)&&req.quantity.qty>0))fail(`${recipeId}/${req.componentId} has invalid quantity`);
      if(req.quantity.unit!==component.workingUnit.unit)fail(`${recipeId}/${req.componentId} unit mismatch: ${req.quantity.unit} vs canonical ${component.workingUnit.unit}`);
    }
    for(const req of requirements){
      const child=components.find(x=>x.id===req.componentId);if(!child)continue;
      for(const parent of child.madeFrom)if(seen.has(parent))fail(`${recipeId} double-charges madeFrom parent ${parent} alongside child ${child.id}`);
    }
  }

  const exact=(recipeId,expected)=>{const got=recipes[recipeId]||[];const key=x=>`${x.componentId}:${x.quantity.qty}:${x.quantity.unit}`;const a=got.map(key).sort(),b=expected.sort();if(JSON.stringify(a)!==JSON.stringify(b))fail(`${recipeId} corrected dependency contract drifted: got ${a.join(', ')}`)};
  exact('curry-laksa',['laksa:120:g','clear:450:ml']);
  exact('rempah-chicken-rendang',['rendang:120:g','lemongrass:15:g']);
  exact('massaman-beef',['thai-red:30:g','massaman-finish:7:g']);
  exact('beef-broccoli',['wok-brown:125:ml']);
  exact('moo-goo-gai-pan',['wok-white:150:ml']);
  exact('pad-kra-pao',['garlic:15:g','chilli:15:g','krapow:30:ml']);
  exact('gold-chicken-curry',['gold:120:g']);

  const defaultDemand=engine.prepDemandForRecipesV2(current.defaultWeek);
  const zeroStock={};
  const emptyNeeds=engine.prepNeedsForRecipesV2(current.defaultWeek,zeroStock);
  for(const demand of defaultDemand){const need=emptyNeeds.find(x=>x.componentId===demand.componentId);if(!need||need.shortfall.qty!==demand.required.qty||need.shortfall.unit!==demand.required.unit)fail(`v2 empty-stock shortfall mismatch for ${demand.componentId}`)}
  const exactStock=Object.fromEntries(defaultDemand.map(x=>[x.componentId,x.required]));
  if(engine.prepNeedsForRecipesV2(current.defaultWeek,exactStock).length)fail('v2 exact default-week stock still reports prep shortfalls');
  const firstRecipe=current.defaultWeek[0],firstReq=recipes[firstRecipe][0];
  if(firstReq){const batch=engine.createMeasuredPrepBatchV2({batchId:'audit-batch',componentId:firstReq.componentId,measuredOutput:firstReq.quantity,producedAt:'2026-09-14T00:00:00.000Z',recipeVersion:'audit-v1'});const stock=engine.componentStockFromBatchesV2([batch]);if(!engine.recipePrepAvailabilityV2(firstRecipe,stock).ready)fail(`v2 measured stock does not mark ${firstRecipe} ready`)}
  let mismatchRejected=false;try{engine.createMeasuredPrepBatchV2({batchId:'bad-unit',componentId:'gold',measuredOutput:{qty:120,unit:'ml'},producedAt:'2026-09-14T00:00:00.000Z',recipeVersion:'audit-v1'})}catch{mismatchRejected=true}if(!mismatchRejected)fail('v2 measured batch accepted incompatible units');

  if(failures.length){console.error(`\nHome Meals food-truth v2 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}
  else console.log(`\nHome Meals food-truth v2 audit passed · ${components.length} prep components · ${v2RecipeIds.length} dinner contracts · no assumed batch yields`);
}finally{fs.rmSync(out,{recursive:true,force:true})}
