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
for(const rel of ['playwright.config.ts','tests/e2e/product-smoke.spec.ts'])if(!exists(path.join(root,rel)))fail(`${rel} is missing`);
// A full GitHub checkout includes .github and validates the CI contract. Railway builds from apps/home-meals only,
// so the same application audit must remain valid when repository-level workflow files are intentionally absent.
if(exists(ciPath)){
 const ci=read(ciPath);
 must(ci,/actions\/checkout@v7/,'CI checkout action is not current');
 must(ci,/actions\/setup-node@v7/,'CI Node setup action is not current');
 must(ci,/node-version:\s*24/,'CI does not match the production Node 24 runtime');
 must(ci,/npm ci --no-audit --no-fund/,'CI install is not lockfile-deterministic');
 must(ci,/playwright install --with-deps chromium/,'CI does not install the release browser');
 must(ci,/npm run test:e2e/,'CI is not gated on browser acceptance');
}
if(failures.length){console.error(`\nHome Meals release-infrastructure audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals release-infrastructure audit passed · pinned Node/npm · deterministic dependency graph · repeatable Chromium acceptance artifacts');
