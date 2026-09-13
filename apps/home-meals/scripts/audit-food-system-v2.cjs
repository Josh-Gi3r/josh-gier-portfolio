const fs=require("fs"),path=require("path"),{spawnSync}=require("child_process");
const root=path.resolve(__dirname,".."),out=path.join(root,".audit-food-system-v2"),failures=[],warnings=[];
const fail=m=>failures.push(m),warn=m=>warnings.push(m);
try{
  fs.rmSync(out,{recursive:true,force:true});
  const tsc=path.join(root,"node_modules",".bin",process.platform==="win32"?"tsc.cmd":"tsc");
  const r=spawnSync(tsc,[
    "--target","ES2020","--module","commonjs","--moduleResolution","node","--esModuleInterop","--skipLibCheck","--outDir",out,
    "data/food-quantity.ts",
    "data/food-truth-v2.ts",
    "data/food-engine-v2.ts",
    "data/food-safety-v2.ts",
    "data/nutrition-v2.ts",
    "data/ingredient-truth-v2.ts",
    "data/recipe-truth-v2.ts",
    "data/household-v12.ts",
    "data/planner-v2.ts",
    "data/home-data.ts"
  ],{cwd:root,stdio:"inherit"});
  if(r.status!==0)process.exit(r.status||1);

  const truth=require(path.join(out,"food-truth-v2.js"));
  const safety=require(path.join(out,"food-safety-v2.js"));
  const ingredientTruth=require(path.join(out,"ingredient-truth-v2.js"));
  const recipes=require(path.join(out,"recipe-truth-v2.js"));
  const household=require(path.join(out,"household-v12.js"));
  const engine=require(path.join(out,"food-engine-v2.js"));
  const current=require(path.join(out,"home-data.js"));

  if(recipes.canonicalRecipesV2.length!==36)fail(`recipe truth must cover 36 dinners, found ${recipes.canonicalRecipesV2.length}`);
  if(Object.keys(safety.recipeSafetyProfilesV2).length!==36)fail(`safety truth must cover 36 dinners, found ${Object.keys(safety.recipeSafetyProfilesV2).length}`);
  if(ingredientTruth.canonicalIngredientsV2.length!==current.ingredients.length)fail("ingredient truth ledger does not cover the active ingredient set");

  for(const recipe of recipes.canonicalRecipesV2){
    if(recipe.servings!==2)fail(`${recipe.id} must explicitly target 2 servings`);
    if(recipe.finishedWeightG!==null||recipe.actualServings!==null)fail(`${recipe.id} must not claim unmeasured finished yield/servings`);
    if(!recipe.prep.length)fail(`${recipe.id} has no v2 prep contract`);
    if(!recipe.safety)fail(`${recipe.id} missing safety profile`);
    if(recipe.sourceStatus==="generic_or_wrong")warn(`${recipe.id} still needs a closer culinary source`);
    const legacy=current.getRecipe(recipe.id);
    if(!legacy)fail(`${recipe.id} missing from active cookbook`);
    const vague=legacy.ingredients.filter(x=>x.unit==="portion");
    if(vague.length&&!recipe.explicitStarch)warn(`${recipe.id} still has legacy vague starch quantities`);
  }

  for(const [id,profile] of Object.entries(safety.recipeSafetyProfilesV2)){
    if(!current.getRecipe(id))fail(`safety profile references missing recipe ${id}`);
    for(const target of profile.targets){
      if(!(target.minimumC>0&&target.minimumC<100))fail(`${id} has invalid safety target`);
    }
  }

  const migrated=household.migrateHouseholdV11ToV12(
    {componentStock:{gold:120,clear:500},prepBatches:[{componentId:"gold",outputMl:120,remainingMl:60,at:"2026-09-01T00:00:00Z"}]},
    {week:current.defaultWeek,monthlyPool:current.defaultWeek}
  );
  const migratedStock=household.componentStockV12(migrated);
  if(migratedStock.gold.qty!==0||migratedStock.clear.qty!==0)fail("v11 ml-only stock was silently reinterpreted as v12 stock");
  if(!migrated.migrationWarnings.length)fail("legacy component stock migration did not produce a review warning");
  if(!migrated.legacyArchive?.componentStockV11?.gold)fail("legacy component stock was not preserved in archive");

  const gold=truth.getCanonicalPrepV2("gold");
  if(!gold||gold.workingUnit.unit!=="g")fail("GOLD must be weight-based in v2");
  let wrongUnitRejected=false;
  try{household.setManualComponentStockV12(migrated,"gold",{qty:120,unit:"ml"})}catch{wrongUnitRejected=true}
  if(!wrongUnitRejected)fail("v12 household stock accepted a wrong unit");

  const measured=engine.createMeasuredPrepBatchV2({
    batchId:"audit-gold-1",componentId:"gold",measuredOutput:{qty:180,unit:"g"},
    producedAt:"2026-09-14T00:00:00Z",recipeVersion:"research-v1"
  });
  const withBatch=household.addMeasuredBatchV12(migrated,measured);
  if(household.componentStockV12(withBatch).gold.qty!==180)fail("measured batch did not become v12 stock");

  const forbiddenFinalNutrition=/nutritionStatus\s*:\s*["']final["']/;
  const scanFiles=["data/food-truth-v2.ts","data/recipe-truth-v2.ts","data/nutrition-v2.ts"];
  for(const rel of scanFiles){
    const text=fs.readFileSync(path.join(root,rel),"utf8");
    if(forbiddenFinalNutrition.test(text))fail(`${rel} claims final nutrition before household calibration`);
  }

  if(failures.length){
    console.error(`\nHome Meals food-system v2 audit FAILED (${failures.length})`);
    for(const x of failures)console.error(` - ${x}`);
    process.exitCode=1;
  }else{
    console.log(`\nHome Meals food-system v2 audit passed · 36 recipes · ${truth.canonicalPrepComponentsV2.length} prep components · v12 migration safe`);
  }
  for(const x of warnings)console.warn(`WARN: ${x}`);
}finally{
  fs.rmSync(out,{recursive:true,force:true});
}
