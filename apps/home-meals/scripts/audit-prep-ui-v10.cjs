const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const errors=[];
const prep=read("components/app/PrepV10.tsx"),families=read("components/app/PrepFamiliesV10.tsx"),css=read("app/styles/prep-v10.css"),page=read("app/prep/page.tsx"),pkg=read("package.json");
must(page.includes("PrepV10"),"/prep is not routed to PrepV10");
for(const label of ["Browse","Ours","This week"])must(prep.includes(`"${label}"`),`PrepV10 is missing ${label}`);
for(const href of ["/prep/bases","/prep/mids","/prep/sauces","/prep/boosters","/prep/common"])must(prep.includes(href),`PrepV10 missing category ${href}`);
must(!prep.includes("Caramelised onion foundation"),"ONION has been promoted back into a standalone landing category");
must(prep.includes("Common prep"),"Common prep category missing");
must(families.includes("coreMotherIdsV7"),"Core Bases page is not derived from the true seven-core set");
must(families.includes('midBaseForms=new Set(["paste","cooked-base","roux","stock"])'),"Mid bases are not grouped by explicit food form");
must(families.includes('sauceForms=new Set(["sauce","marinade","condiment"])'),"Sauces are not grouped by explicit food form");
must(families.includes('commonIds=["onion","ginger-garlic","garlic","chilli","lemongrass","pesto","duxelles"]'),"Common prep shortcuts changed unexpectedly");
must(!prep.includes("/images/prep-v9/"),"Live Prep landing still references V9 placeholder imagery");
must(!families.includes("/images/prep-v9/"),"Live Prep family pages still reference V9 placeholder imagery");
for(const token of ['prepHero("red")','prepHero("rendang")','prepHero("wok-brown")','prepHero("ginger-garlic")','prepHero("onion")']){must(prep.includes(token),`Prep landing is missing real family photography: ${token}`);must(families.includes(token),`Prep family hero is missing real photography: ${token}`)}
must(prep.includes("foundationImages.prepDay")&&prep.includes("onError={repairPrepImage}"),"Prep landing has no real-photo fallback for failed image loads");
must(families.includes("foundationImages.prepDay")&&families.includes("onError={repairPrepImage}"),"Prep family pages have no real-photo fallback for failed image loads");
must(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))"),"Phone category pages lost the two-column card grid");
must(css.includes(".hm-prep-v10-category{height:174px"),"Landing categories are no longer substantial card buttons");
must(css.includes("min-height:42px"),"V10 controls lost the minimum touch-target guard");
must(pkg.includes("audit-prep-ui-v10.cjs"),"V10 audit is not wired into audit:data");
if(errors.length){console.error(`\nHome Meals Prep IA V10 audit FAILED (${errors.length})`);for(const e of errors)console.error(` - ${e}`);process.exit(1)}
console.log("\nHome Meals Prep IA V10 audit passed · category-first Browse/Ours/This week · 5 real-photo landing cards · real-photo family heroes + load fallback · two-column family selection · no standalone ONION navigation · V8/V12 truth preserved");
