const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const fail=m=>failures.push(m);
const must=(rel,re,msg)=>{const text=read(rel);if(!re.test(text))fail(`${rel}: ${msg}`)};
const mustNot=(rel,re,msg)=>{const text=read(rel);if(re.test(text))fail(`${rel}: ${msg}`)};

// Runtime routes must use the V9 presentation layer while leaving V8 truth engines underneath.
must('app/prep/page.tsx',/PrepV9/,'Prep route is not using the V9 phone-first presentation');
must('app/prep/mids/page.tsx',/MidsV9/,'Mids route is not using the V9 visual presentation');
must('app/globals.css',/prep-v9\.css/,'V9 Prep stylesheet is not loaded');

// Prep hierarchy: action first, maintenance second, inventory third, library last.
const prep=read('components/app/PrepV9.tsx');
for(const token of ['Prep next','Our prep','Have now','Browse prep library','Plan around our prep'])if(!prep.includes(token))fail(`PrepV9 missing hierarchy marker: ${token}`);
const hierarchyMarkers=[
  'SectionHead title={h.weekStatus==="confirmed"?"Prep next":"Preview prep"}',
  'SectionHead title="Our prep"',
  'SectionHead title="Have now"',
  'SectionHead title="Browse prep library"',
];
const order=hierarchyMarkers.map(marker=>prep.indexOf(marker));
if(order.some(x=>x<0))fail('PrepV9 hierarchy section markers could not be resolved');
else if(!(order[0]<order[1]&&order[1]<order[2]&&order[2]<order[3]))fail('PrepV9 hierarchy regressed: library/inventory is ahead of the primary task flow');

// Existing product truth and mutation paths remain in use.
for(const token of ['allLiveRecipesV7','canonicalPrepComponentsV2','prepForRecipeAtCookScaleV7','getPrepPortionPolicyV6','setPlanPreferences("repertoire"','setComponent(','toggleActivePrep'])if(!prep.includes(token))fail(`PrepV9 is missing V8/V6 truth path: ${token}`);
for(const token of ['Start small','GOLD · SAMBAL · RED','7','Core bases','Caramelised onion foundation','Add one ${c.code} packet'])if(!prep.includes(token))fail(`PrepV9 lost accepted household copy/control: ${token}`);

// Library is one coherent hero, not the old diagonal sliced multi-image collage.
for(const asset of ['public/images/prep-v9/prep-library.webp','public/images/prep-v9/core-bases.webp'])if(!exists(asset))fail(`V9 prep asset missing: ${asset}`);
must('components/app/PrepV9.tsx',/\/images\/prep-v9\/prep-library\.webp/,'Prep Library master image is not wired');
must('components/app/PrepV9.tsx',/\/images\/prep-v9\/core-bases\.webp/,'Core Bases category image is not wired');
mustNot('app/styles/prep-v9.css',/clip-path/,'V9 reintroduced the diagonal sliced-collage treatment');

// Large-card mobile behaviour is a deliberate regression gate.
for(const token of ['.hm-prep-v9-task{','.hm-prep-v9-browse{','.hm-prep-v9-library-hero{','.hm-mids-v9-card{'])if(!read('app/styles/prep-v9.css').includes(token))fail(`prep-v9.css missing large-card primitive ${token}`);
must('app/styles/prep-v9.css',/flex:0 0 min\(78vw,310px\)/,'Our prep cards no longer expose roughly 1.2 cards on a phone');
must('app/styles/prep-v9.css',/min-height:178px/,'Prep action cards regressed to compact list-row scale');

// Mids must be visual, repertoire-aware and filtered to the seven true core bases.
const mids=read('components/app/MidsV9.tsx');
for(const token of ['coreMotherIdsV7','Browse by core base','Standalone mids','All mids & sauces','Add to our prep','hm-mids-v9-grid'])if(!mids.includes(token))fail(`MidsV9 missing visual/repertoire behaviour: ${token}`);
if(!/coreMothers=motherBases\.filter\(m=>coreMotherIdsV7\.includes\(m\.id\)\)/.test(mids))fail('MidsV9 can accidentally present optional ONION as a core-base filter');
if((mids.match(/aria-label=\{active\?`Pause \$\{m\.name\}`:`Add \$\{m\.name\} to our prep`\}/g)||[]).length<3)fail('MidsV9 compact add/pause controls are not descriptively labelled');

if(failures.length){console.error(`\nHome Meals Prep UI V9 audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals Prep UI V9 audit passed · action-first Prep hierarchy · large phone cards · visual Mids · 7 true core-base filters · coherent library hero · V8/V6 truth preserved');
