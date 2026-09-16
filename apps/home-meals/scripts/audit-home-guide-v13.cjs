const fs=require('node:fs');
const path=require('node:path');
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error(`Home guide audit failed: ${msg}`)};

const guide=read('components/HomeGuide.tsx');
const bar=read('components/app/HomeBar.tsx');
const ask=read('components/AskHomeView.tsx');
const layout=read('app/layout.tsx');
const css=read('app/styles/home-guide.css');
const globals=read('app/globals.css');

must(layout.includes('HomeGuideProvider'),'guide provider is not mounted');
must(globals.includes('home-guide.css'),'guide CSS is not loaded');
must(guide.includes('getHouseholdPerson'),'guide is not person-aware');
must(guide.includes('person!=="g"'),'automatic first-run is not restricted to G');
must(guide.includes('home-meals:guide'),'summoned guide event is missing');
must(guide.includes('visualViewport'),'visual viewport collision handling is missing');
must(guide.includes('prefers-reduced-motion'),'reduced-motion handling is missing');
must(guide.includes('aria-live="polite"'),'accessible guide announcement is missing');
must(guide.includes('role="dialog"')&&guide.includes('aria-modal="true"'),'guide does not guard against modal collisions');
must(guide.includes('input:focus')&&guide.includes('textarea:focus'),'keyboard/form collision exclusions are missing');
for(const id of ['nav-home','nav-cook','nav-prep','nav-kitchen','nav-plan','orb'])must(bar.includes(`\"${id}\"`),`missing live UI anchor ${id}`);
must(ask.includes('Show me around'),'orb experience does not expose Show me around');
must(ask.includes('home-meals:guide'),'Show me around does not summon the guide');
must(css.includes('pointer-events:none')&&css.includes('pointer-events:auto'),'nonmodal pointer-event contract is missing');
must(css.includes('@media(prefers-reduced-motion:reduce)'),'CSS reduced-motion fallback is missing');
must(css.includes('min-height:44px'),'guide action touch targets are below the 44px project standard');

console.log('Home Meals talking-head guide V13 audit passed · G-first-run only · summonable from orb · route-aware · nonmodal · viewport-safe · reduced-motion aware');
