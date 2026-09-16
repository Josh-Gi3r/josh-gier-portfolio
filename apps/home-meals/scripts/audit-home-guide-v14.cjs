const fs=require('node:fs');
const path=require('node:path');
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error(`Home guide V14 audit failed: ${msg}`)};

const guide=read('components/HomeGuide.tsx');
const bar=read('components/app/HomeBar.tsx');
const ask=read('components/AskHomeView.tsx');
const layout=read('app/layout.tsx');
const css=read('app/styles/home-guide.css');
const globals=read('app/globals.css');
const tests=read('tests/e2e/home-guide.spec.ts');
const spec=read('HOME_GUIDE_WALKTHROUGH_V14.md');
const frames=['idle','talk','happy','affectionate','wink'];

must(layout.includes('HomeGuideProvider'),'guide provider is not mounted');
must(globals.includes('home-guide.css'),'guide CSS is not loaded');
must(guide.includes('getHouseholdPerson'),'guide is not person-aware');
must(guide.includes('person!=="g"'),'automatic first-run is not restricted to G');
must(guide.includes('home-meals:guide'),'summoned guide event is missing');
must(guide.includes('Quick refresher')&&guide.includes('Whole thing')&&guide.includes('One bit'),'summoned refresher modes are incomplete');
must(guide.includes('This screen'),'contextual refresher is missing');
for(const topic of ['Ask & voice','Camera','Cooking','History'])must(guide.includes(topic),`missing refresher topic ${topic}`);
must(guide.includes('visualViewport'),'visual viewport collision handling is missing');
must(guide.includes('MutationObserver(place)'),'late-mounted target recovery is missing');
must(guide.includes('prefers-reduced-motion'),'reduced-motion handling is missing');
must(guide.includes('event.key==="Escape"'),'Escape dismissal is missing');
must(guide.includes('aria-live="polite"'),'accessible guide announcement is missing');
must(guide.includes('role="dialog"')&&guide.includes('aria-modal="true"'),'guide does not guard against modal collisions');
must(guide.includes('input:focus')&&guide.includes('textarea:focus'),'keyboard/form collision exclusions are missing');
for(const id of ['nav-home','nav-cook','nav-prep','nav-kitchen','nav-plan','orb','camera','voice'])must(bar.includes(`\"${id}\"`),`missing live UI anchor ${id}`);
must(ask.includes('Show me around'),'orb experience does not expose Show me around');
must(ask.includes('home-meals:guide'),'Show me around does not summon the guide');
must(css.includes('pointer-events:none')&&css.includes('pointer-events:auto'),'nonmodal pointer-event contract is missing');
must(css.includes('@media(prefers-reduced-motion:reduce)'),'CSS reduced-motion fallback is missing');
must(css.includes('min-height:44px'),'guide action touch targets are below the 44px project standard');
must(!css.includes('.hm-guide-face'),'temporary CSS-drawn face returned');
for(const name of frames){const p=path.join(root,`public/images/home-guide/${name}.webp`);must(fs.existsSync(p),`Josh guide frame ${name} is missing`);const buf=fs.readFileSync(p);must(buf.length>2500,`Josh guide frame ${name} looks like a placeholder`);must(buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP',`Josh guide frame ${name} is not a valid WebP container`);must(css.includes(`/images/home-guide/${name}.webp`),`Josh guide frame ${name} is not wired into the guide`)}
must(spec.includes('First-run journey for G')&&spec.includes('Summoned guide: Josh or G'),'walkthrough implementation spec is incomplete');
for(const phrase of ['automatic first-run guide once','Quick refresher','Whole thing','One bit','reduced-motion'])must(tests.includes(phrase),`browser acceptance missing ${phrase}`);

console.log('Home Meals talking-head guide V14 audit passed · approved Josh head frames · G-first-run only · quick/full/topic replay · detour-tolerant · deep-topic help · viewport-safe · reduced-motion aware');
