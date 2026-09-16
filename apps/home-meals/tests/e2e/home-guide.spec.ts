import {expect,test,type Page} from "@playwright/test";

const seed={version:12,week:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],weekStatus:"confirmed",suggestedWeek:null,planMode:"both",allowExtraPrep:true,monthlyPool:[],activePrepIds:["gold","sambal","red"],componentBatches:[],manualComponentStock:{gold:{qty:440,unit:"g"},sambal:{qty:240,unit:"g"},red:{qty:440,unit:"g"}},ingredientStock:{mushroom:{qty:250,unit:"g"}},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:true,migrationWarnings:[]};

async function seedPerson(page:Page,person:"josh"|"g",guideStatus?:"completed"|"dismissed"){
 await page.addInitScript(({state,person,guideStatus})=>{
  localStorage.setItem("home-meals-household-v12",JSON.stringify(state));
  localStorage.setItem("home-meals-welcome-seen-v1","1");
  localStorage.setItem("home-meals-person-v1",person);
  localStorage.removeItem(`home-meals-guide-v1:${person}`);
  if(guideStatus)localStorage.setItem(`home-meals-guide-v1:${person}`,JSON.stringify({status:guideStatus,at:new Date().toISOString()}));
 },{state:seed,person,guideStatus});
}

async function expectNoCollision(page:Page){
 const card=await page.locator(".hm-guide-card").boundingBox();
 const dock=await page.locator(".hm-bar-pill").boundingBox();
 expect(card).toBeTruthy();expect(dock).toBeTruthy();
 const overlaps=!(card!.x+card!.width<=dock!.x||dock!.x+dock!.width<=card!.x||card!.y+card!.height<=dock!.y||dock!.y+dock!.height<=card!.y);
 expect(overlaps,"talking-head card must not cover the persistent Home input dock").toBe(false);
}

test("G gets the automatic first-run guide once and can dismiss it permanently",async({page})=>{
 await seedPerson(page,"g");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await expect(guide).toContainText("Hey sunshine");
 await expectNoCollision(page);
 await guide.getByRole("button",{name:"Not now"}).click();
 await expect(guide).toHaveCount(0);
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(1300);
 await expect(guide).toHaveCount(0);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-guide-v1:g")||"{}"));
 expect(state.status).toBe("dismissed");
});

test("Josh never gets automatic G onboarding",async({page})=>{
 await seedPerson(page,"josh");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(1300);
 await expect(page.locator("[data-home-guide-overlay]")).toHaveCount(0);
});

test("first-run guide advances through real navigation and accepts detours",async({page})=>{
 await seedPerson(page,"g");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible({timeout:4000});
 await guide.getByRole("button",{name:"Show me",exact:true}).click();
 await expect(page.locator(".hm-guide-copy")).toContainText("recipes are in Cook");
 await page.locator('[data-home-guide="nav-cook"]').click();
 await expect(page).toHaveURL(/\/cook$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("All our recipes live here");
 // Deliberately ignore Prep and visit Kitchen. The guide follows instead of blocking the user.
 await page.locator('[data-home-guide="nav-kitchen"]').click();
 await expect(page).toHaveURL(/\/kitchen$/);
 await expect(page.locator(".hm-guide-copy")).toContainText("Kitchen is what we actually have");
 await expectNoCollision(page);
});

test("Show me around is deliberately summonable from the green orb after onboarding",async({page})=>{
 await seedPerson(page,"josh","completed");
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await page.getByRole("button",{name:"Ask Home"}).last().click();
 const ask=page.getByRole("dialog",{name:"Ask Home"});
 await expect(ask).toBeVisible();
 await ask.getByRole("button",{name:"Show me around"}).click();
 const guide=page.locator("[data-home-guide-overlay]");
 await expect(guide).toBeVisible();
 await expect(guide).toContainText("Quick lap");
 await expect(guide.getByRole("button",{name:"Cook"})).toBeVisible();
 await expect(guide.getByRole("button",{name:"Prep"})).toBeVisible();
 await expect(guide.getByRole("button",{name:"Kitchen"})).toBeVisible();
 await expect(guide.getByRole("button",{name:"Plan"})).toBeVisible();
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
