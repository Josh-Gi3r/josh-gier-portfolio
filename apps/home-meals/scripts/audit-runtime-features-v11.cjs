const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const errors=[];const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const has=(s,...xs)=>xs.every(x=>s.includes(x));

const bar=read("components/app/HomeBar.tsx");
const ask=read("components/SmartAskRuntime.tsx");
const vision=read("components/VisionRuntime.tsx");
const voice=read("components/VoiceRuntime.tsx");
const scan=read("components/app/Scan.tsx");
const cooking=read("components/app/Cooking.tsx");
const plan=read("components/app/Plan.tsx");
const sync=read("components/HouseholdSyncV12.tsx");
const pwa=read("components/PwaRuntime.tsx");
const status=read("app/api/system-status/route.ts");
const storage=read("data/recipe-storage-v2.ts");
const dock=read("app/styles/dock-clearance.css");

must(has(bar,'aria-label="Ask Josh"','aria-label="Talk to Josh"','aria-label="Show Josh with camera"'),"Persistent Josh dock is missing Ask/camera/voice controls");
must(has(ask,'/api/ask-home','home-meals:ask','applyMutation','set_day','set_week','set_active_prep_set','confirm_empty_kitchen'),"Typed Ask Josh is missing its API/action-confirmation contract");
must(has(vision,'/api/vision','needsConfirmation','setIngredient','setComponent'),"Vision runtime is missing proposal/confirmation or Kitchen mutation wiring");
for(const mode of ["Fridge","Freezer","Pantry","Receipt","Prep","Meal"])must(scan.includes(`"${mode}"`),`Scan mode missing: ${mode}`);
must(has(scan,'capture="environment"','accept="image/*"','saveMealPhoto'),"Camera/library image inputs or meal-photo persistence are missing");
must(has(voice,'navigator.mediaDevices?.getUserMedia','/api/live','/api/ask-home','SpeechRecognition','webkitSpeechRecognition','fillAsk(text)','home-meals:voice-proposal'),"Voice runtime lost realtime, fallback, household delegation or proposal safeguards");
must(has(cooking,'sessionStorage','wakeLock','cookMeal(id)','logMealWithoutStock(id)','rateMeal','noteMeal','recordCookObservation','Start timer','onClick={finish}>Done</button>'),"Cooking runtime is missing resume/timer/wake-lock/reconciliation/ratings/notes or observation logging");
for(const day of ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])must(plan.includes(`"${day}"`),`Plan lost ${day}`);
must(has(plan,'aria-label="This week\'s dinners"','setDay','shoppingNeeds','prepNeeds'),"Plan lost week/calendar, shopping or prep integration");
must(has(sync,'setInterval','conflict','cooking','version'),"Household sync lost polling/conflict/cooking-deferral semantics");
must(has(pwa,'serviceWorker','controllerchange','cookingRoute','SKIP_WAITING','Nothing interrupts cooking'),"PWA runtime lost service-worker or active-cooking update protection");
must(has(status,'askHome','vision','realtimeVoice','householdSync','database'),"System-status endpoint no longer reports critical runtime capabilities");
must(has(storage,'homeFridgeDays:3','reheatTargetC:74','freezeSuitability','lunchSuitability'),"Leftover/reheat policy is missing");
must(has(dock,'.hm-main:not(.cooking) .hm-cta','--hm-fixed-action-bottom'),"Fixed-action dock clearance guard is missing");
must(has(dock,'--hm-nav-dock-gap:12px','.hm-bar-pill{bottom:var(--hm-ai-dock-pill-bottom)}','--hm-fixed-action-gap:16px'),"Dock/nav/CTA separation contract is missing");

if(errors.length){console.error(`\nHome Meals runtime feature audit FAILED (${errors.length})`);for(const e of errors)console.error(` - ${e}`);process.exit(1)}
console.log("\nHome Meals runtime feature audit passed · persistent Ask/camera/voice · typed AI actions require confirmation · 6 Vision scan modes + meal photos · cooking resume/timers/wake-lock/reconciliation/ratings/notes · 7-day Plan + shopping/prep · sync/recovery · PWA update safety · leftover/reheat policy · dock/nav/CTA clearance");
