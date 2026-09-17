import {expect,test,type Page} from "@playwright/test";

const seed={version:12,week:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],weekStatus:"confirmed",suggestedWeek:null,planMode:"both",allowExtraPrep:true,monthlyPool:[],activePrepIds:["gold","sambal","red"],componentBatches:[],manualComponentStock:{gold:{qty:440,unit:"g"},sambal:{qty:240,unit:"g"},red:{qty:440,unit:"g"}},ingredientStock:{mushroom:{qty:250,unit:"g"}},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:true,migrationWarnings:[]};

async function seedPerson(page:Page,person:"josh"|"g",guideStatus?:"completed"|"dismissed"){
 await page.addInitScript(({state,person,guideStatus})=>{
  localStorage.setItem("home-meals-household-v12",JSON.stringify(state));
  localStorage.setItem("home-meals-welcome-seen-v1","1");
  localStorage.setItem("home-meals-person-v1",person);
  const seedKey=`home-meals-guide-test-seeded:${person}`;
  if(!sessionStorage.getItem(seedKey)){
   localStorage.removeItem(`home-meals-guide-v1:${person}`);
   if(guideStatus)localStorage.setItem(`home-meals-guide-v1:${person}`,JSON.stringify({status:guideStatus,at:new Date().toISOString()}));
   sessionStorage.setItem(seedKey,"1");
  }
 },{state:seed,person,guideStatus});
}

async function expectNoCollision(page:Page){
 const card=await page.locator(".hm-guide-card").boundingBox();
 const dock=await page.locator(".hm-bar-pill").boundingBox();
 const nav=await page.locator(".hm-bar-nav").boundingBox();
 expect(card).toBeTruthy();expect(dock).toBeTruthy();expect(nav).toBeTruthy();
 const overlap=(a:NonNullable<typeof card>,b:NonNullable<typeof card>)=>!(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);
 expect(overlap(card!,dock!),"talking-head card must not cover the persistent Home input dock").toBe(false);
 expect(overlap(card!,nav!),"talking-head card must not cover bottom navigation").toBe(false);
}

async function expectGuideComposition(page:Page,{intro=false}:{intro?:boolean}={}){
 const layer=page.locator("[data-home-guide-overlay]"),head=page.locator(".hm-guide-head"),bubble=page.locator(".hm-guide-bubble");
 const [hb,bb]=await Promise.all([head.boundingBox(),bubble.boundingBox()]);expect(hb).toBeTruthy();expect(bb).toBeTruthy();
 const overlap=!(hb!.x+hb!.width<=bb!.x||bb!.x+bb!.width<=hb!.x||hb!.y+hb!.height<=bb!.y||bb!.y+bb!.height<=hb!.y);expect(overlap,"Josh head must never be covered by the speech bubble").toBe(false);
 if(intro){expect(await layer.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");await expect(page.locator(".hm-guide-close")).toHaveCount(0)}
 else{const close=page.locator(".hm-guide-close");await expect(close).toBeVisible();const cb=await close.boundingBox(),vp=page.viewportSize();expect(cb).toBeTruthy();expect(vp).toBeTruthy();expect(cb!.width).toBeGreaterThanOrEqual(44);expect(cb!.height).toBeGreaterThanOrEqual(44);expect(cb!.x).toBeGreaterThanOrEqual(0);expect(cb!.y).toBeGreaterThanOrEqual(0);expect(cb!.x+cb!.width).toBeLessThanOrEqual(vp!.width);expect(cb!.y+cb!.height).toBeLessThanOrEqual(vp!.height);const shadow=await page.locator(".hm-guide-highlight").evaluate(el=>getComputedStyle(el).boxShadow);expect(shadow).toContain("9999px")}
}

async function expectHighlightedTargetInViewport(page:Page){
 const target=page.locator(".hm-guide-highlight");await expect(target).toBeVisible();const b=await target.boundingBox(),vp=page.viewportSize();expect(b).toBeTruthy();expect(vp).toBeTruthy();expect(b!.y).toBeGreaterThanOrEqual(0);expect(b!.y+b!.height).toBeLessThanOrEqual(vp!.height);
}

async function summonGuide(page:Page){
 await page.getByRole("button",{name:"Ask Home"}).last().click();
 const ask=page.getByRole("dialog",{name:"Ask Home"});
 await expect(ask).toBeVisible();
 await ask.getByRole("button",{name:"Show me around"}).click();
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible();
 return guide;
}

test("G gets the automatic first-run guide once and can dismiss it permanently",async({page})=>{
 await seedPerson(page,"g");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await expect(guide).toContainText("Hey sunshine");
 await expect(page.locator(".hm-guide-sprite")).toBeVisible();
 await expectGuideComposition(page,{intro:true});
 await expectNoCollision(page);
 await guide.getByRole("button",{name:"Not now"}).click();
 await expect(guide).toHaveCount(0);
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(1300);
 await expect(guide).toHaveCount(0);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-guide-v1:g")||"{}"));
 expect(state.status).toBe("dismissed");
});

test("Josh gets the automatic first-run guide once and can dismiss it permanently",async({page})=>{
 await seedPerson(page,"josh");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await expect(guide).toContainText("Quick tour");
 await expect(guide).not.toContainText("sunshine");
 await expectGuideComposition(page,{intro:true});
 await expectNoCollision(page);
 await guide.getByRole("button",{name:"Not now"}).click();
 await expect(guide).toHaveCount(0);
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(1300);
 await expect(guide).toHaveCount(0);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-guide-v1:josh")||"{}"));
 expect(state.status).toBe("dismissed");
});

test("first-run guide uses real navigation, progress and accepts detours",async({page})=>{
 await seedPerson(page,"g");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await guide.getByRole("button",{name:"Show me",exact:true}).click();
 await expectGuideComposition(page);
 await expect(page.locator(".hm-guide-copy")).toContainText("This is Home");
 await expect(page.locator(".hm-guide-progress")).toContainText("1/5");
 await page.locator('[data-home-guide="nav-cook"]').click();
 await expect(page).toHaveURL(/\/cook$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("Cook is all our recipes");
 await page.locator('[data-home-guide="nav-kitchen"]').click();
 await expect(page).toHaveURL(/\/kitchen$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("Kitchen is what we have at home");
 await expectNoCollision(page);
});

test("Show me around offers Quick refresher, Whole thing, One bit and This screen",async({page})=>{
 await seedPerson(page,"josh","completed");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=await summonGuide(page);
 for(const label of ["Quick refresher","Whole thing","One bit","This screen"])await expect(guide.getByRole("button",{name:label})).toBeVisible();
});

test("One bit exposes deep help topics and History routes to the real screen",async({page})=>{
 await seedPerson(page,"g","completed");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=await summonGuide(page);
 await guide.getByRole("button",{name:"One bit"}).click();
 for(const label of ["Home","Cook","Prep","Kitchen","Plan","Ask & voice","Camera","Cooking","History"])await expect(guide.getByRole("button",{name:label})).toBeVisible();
 await guide.getByRole("button",{name:"History"}).click();
 await expect(page).toHaveURL(/\/history$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("History remembers what we cooked");
});

test("Quick refresher replays without changing G first-run completion",async({page})=>{
 await seedPerson(page,"g","completed");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=await summonGuide(page);
 await guide.getByRole("button",{name:"Quick refresher"}).click();
 await expect(page.locator(".hm-guide-copy")).toContainText("dinner and the week at a glance");
 await page.locator('[data-home-guide="nav-cook"]').click();
 await expect(page).toHaveURL(/\/cook$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("Cook is all our recipes");
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-guide-v1:g")||"{}"));
 expect(state.status).toBe("completed");
});

test("guide has a static reduced-motion equivalent",async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const page=await context.newPage();
 await seedPerson(page,"g");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await expect(guide).toHaveClass(/reduce/);
 await expect(guide.getByRole("button",{name:"Show me",exact:true})).toBeVisible();
 await context.close();
});

test("unknown Kitchen is taught through real controls and keeps the target on-screen",async({page})=>{
 const unknown={...seed,weekStatus:"unplanned" as const,suggestedWeek:null,activePrepIds:[],componentBatches:[],manualComponentStock:{},ingredientStock:{},qualitativeIngredientStock:{},kitchenReady:false};
 await page.addInitScript(({state})=>{localStorage.setItem("home-meals-household-v12",JSON.stringify(state));localStorage.setItem("home-meals-person-v1","g");localStorage.removeItem("home-meals-guide-v1:g")},{state:unknown});
 await page.goto("/",{waitUntil:"domcontentloaded"});const guide=page.locator("[data-home-guide-overlay]");await expect(guide).toBeVisible({timeout:4000});await guide.getByRole("button",{name:"Show me",exact:true}).click();await page.locator('[data-home-guide="nav-kitchen"]').click();await expect(page).toHaveURL(/\/kitchen$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("fridge, freezer and pantry");await guide.getByRole("button",{name:"Next",exact:true}).click();await expect(page.locator(".hm-guide-copy")).toContainText("Fastest way? Show me");await guide.getByRole("button",{name:"Next",exact:true}).click();await expect(page.locator(".hm-guide-copy")).toContainText("Kitchen checked");await page.waitForTimeout(450);await expectHighlightedTargetInViewport(page);await guide.getByRole("button",{name:"Keep touring"}).click();await expect(page.locator(".hm-guide-copy")).toContainText("Tap Cook");
});

test("guide visual contract holds on canonical phones",async({browser})=>{
 for(const viewport of [{width:360,height:640},{width:390,height:667},{width:390,height:844},{width:430,height:844}]){const context=await browser.newContext({viewport});const page=await context.newPage();await seedPerson(page,"g");await page.goto("/",{waitUntil:"domcontentloaded"});await expect(page.locator("[data-home-guide-overlay]")).toBeVisible({timeout:4000});await expectGuideComposition(page,{intro:true});await page.getByRole("button",{name:"Show me",exact:true}).click();await expectGuideComposition(page);await expectNoCollision(page);await context.close();}
});
