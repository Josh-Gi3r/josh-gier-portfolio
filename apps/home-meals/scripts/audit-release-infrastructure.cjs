const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),failures=[];
const read=p=>fs.readFileSync(p,'utf8'),exists=p=>fs.existsSync(p),fail=m=>failures.push(m);
const must=(text,re,msg)=>{if(!re.test(text))fail(msg)};
const pkgPath=path.join(root,'package.json'),lockPath=path.join(root,'package-lock.json'),ciPath=path.join(repo,'.github','workflows','home-meals-ci.yml');
const pkg=read(pkgPath);
if(!exists(lockPath))fail('package-lock.json is missing');
must(pkg,/"packageManager"\s*:\s*"npm@10\.9\.8"/,'npm runtime is not pinned');
must(pkg,/"node"\s*:\s*">=24 <25"/,'Node 24 production runtime is not pinned');
must(pkg,/"@playwright\/test"\s*:\s*"1\.63\.0"/,'browser acceptance dependency is not pinned');
must(pkg,/"test:e2e"\s*:\s*"playwright test"/,'browser acceptance script is missing');
for(const rel of ['playwright.config.ts','tests/e2e/product-smoke.spec.ts','tests/e2e/sync-recovery.spec.ts'])if(!exists(path.join(root,rel)))fail(`${rel} is missing`);
// Product decision: Home Meals does not use GitHub Actions. Repository audits must keep this true.
if(exists(ciPath))fail('Home Meals GitHub Actions workflow must remain removed');
const workflowDir=path.join(repo,'.github','workflows');if(exists(workflowDir)){
 for(const name of fs.readdirSync(workflowDir)){
  const full=path.join(workflowDir,name);if(!fs.statSync(full).isFile())continue;const text=read(full);
  if(/apps\/home-meals|home-meals/i.test(text))fail(`GitHub Actions workflow ${name} still targets Home Meals`);
 }
}
if(failures.length){console.error(`\nHome Meals release-infrastructure audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals release-infrastructure audit passed · Node 24 + npm 10.9.8 pinned · deterministic dependency graph · repo-native/browser acceptance artifacts present · GitHub Actions intentionally absent');
