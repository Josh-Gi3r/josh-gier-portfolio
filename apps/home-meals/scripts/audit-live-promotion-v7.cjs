const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),out=path.join(root,'.audit-live-promotion-v7'),failures=[];
const fail=m=>failures.push(m);
try{
 fs.rmSync(out,{recursive:true,force:true});
 const tsc=path.join(root,'node_modules','.bin',process.platform==='win32'?'tsc.cmd':'tsc');
 const r=spawnSync(tsc,['--target','ES2020','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--outDir',out,'data/phase2-live-candidates-v7.ts'],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
 const candidates=require(path.join(out,'phase2-live-candidates-v7.js'));
 const result=candidates.validatePhase2LiveCandidatesV7();if(!result.valid)result.errors.forEach(fail);
 if(result.count!==100)fail(`Expected 100 promotion candidates, found ${result.count}`);
 if(result.ready!==100)fail(`Expected 100 structurally-ready candidates, found ${result.ready}`);
 if(result.live!==0)fail(`Controlled promotion must start at 0/100 live, found ${result.live}`);
 const statuses=new Set(candidates.phase2LiveCandidatesV7.map(x=>x.promotionStatus));if(statuses.size!==1||!statuses.has('formulation_locked'))fail(`Initial V7 status must be formulation_locked only, found ${[...statuses].join(',')}`);
 for(const x of candidates.phase2LiveCandidatesV7){
   if(x.targetServings!==4)fail(`${x.id}: not four servings`);
   if(!x.nutrition||x.nutrition.servings!==4)fail(`${x.id}: V6 nutrition is not four-serving`);
   if(x.nutrition&&(x.nutrition.unresolvedIngredientIds.length||x.nutrition.unresolvedPrepIds.length))fail(`${x.id}: unresolved V6 nutrition rows`);
   if(!x.imageBrief||!x.imageBrief.trim())fail(`${x.id}: image brief missing`);
   if(!x.evidence.length)fail(`${x.id}: evidence missing`);
 }
 if(fs.existsSync(path.join(repo,'.github','workflows','home-meals-ci.yml')))fail('Home Meals GitHub Actions workflow was recreated');
 if(failures.length){console.error(`\nHome Meals Live Promotion V7 readiness audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log(`\nHome Meals Live Promotion V7 readiness audit passed · ${result.ready}/100 structurally ready · 0/100 live · four-serving + V6 nutrition/prep overlays locked · evidence/image briefs present · GitHub Actions absent`);
}finally{fs.rmSync(out,{recursive:true,force:true})}
