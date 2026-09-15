import {expect,test,type Page} from "@playwright/test";

const seed={version:12,week:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],weekStatus:"confirmed",suggestedWeek:null,planMode:"both",allowExtraPrep:true,monthlyPool:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],activePrepIds:["gold","sambal","red"],componentBatches:[],manualComponentStock:{gold:{qty:440,unit:"g"},sambal:{qty:240,unit:"g"},red:{qty:440,unit:"g"}},ingredientStock:{mushroom:{qty:250,unit:"g"}},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:true,migrationWarnings:[]};

async function seedHousehold(page:Page){
  await page.addInitScript(state=>{
    localStorage.setItem("home-meals-household-v12",JSON.stringify(state));
    localStorage.setItem("home-meals-welcome-seen-v1","1");
  },seed);
}

const noneMutation={type:"none",dayIndex:null,mealId:null,mealIds:null,ingredientId:null,componentId:null,componentIds:null,quantity:null,value:null,note:null,author:null};

async function mockAskHome(page:Page,replyText="Saag chicken fits the household right now."){
  await page.route("**/api/ask-home",async route=>{
    if(route.request().method()==="GET")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({configured:true})});
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({text:replyText,mealIds:["gold-saag-chicken"],tags:["Household-aware"],href:"/cook/gold-saag-chicken",action:"Open recipe",mutation:noneMutation})});
  });
}

test("persistent Home dock never covers fixed page actions",async({page})=>{
  await seedHousehold(page);
  for(const viewport of [{width:390,height:667},{width:390,height:844},{width:430,height:844}]){
    await page.setViewportSize(viewport);
    for(const route of ["/prep/mids/saag","/prep/boosters/ginger-garlic","/cook/gold-saag-chicken"]){
      await page.goto(route,{waitUntil:"domcontentloaded"});
      const cta=page.locator(".hm-cta");
      const dock=page.locator(".hm-bar-pill");
      await expect(cta,`${route} fixed action missing`).toBeVisible();
      await expect(dock,`${route} Home dock missing`).toBeVisible();
      const a=await cta.boundingBox(),d=await dock.boundingBox();
      expect(a&&d,`${route} could not measure dock/action geometry`).toBeTruthy();
      expect(a!.y+a!.height,`${route} fixed action overlaps the Home input dock at ${viewport.width}×${viewport.height}`).toBeLessThanOrEqual(d!.y-4);
    }
  }
});

test("typed Ask Home opens, answers, links to a live recipe, and does not mutate state silently",async({page})=>{
  await seedHousehold(page);await mockAskHome(page);
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await page.waitForTimeout(80);
  await page.getByRole("button",{name:"Ask Home"}).last().click();
  const dialog=page.getByRole("dialog",{name:"Ask Home"});
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox",{name:"Ask Home"}).fill("What can we make now?");
  await dialog.getByRole("button",{name:"Send"}).click();
  await expect(dialog).toContainText("Saag chicken fits the household right now.");
  await expect(dialog.getByRole("link",{name:/Open recipe/})).toHaveAttribute("href","/cook/gold-saag-chicken");
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")||"{}"));
  expect(state.weekStatus).toBe("confirmed");
});

test("Home Vision reads an uploaded image proposal and only updates Kitchen after confirmation",async({page})=>{
  await seedHousehold(page);
  await page.route("**/api/vision",async route=>{
    if(route.request().method()==="GET")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({configured:true})});
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({summary:"Mushrooms detected",items:[{id:"mushrooms",name:"Mushrooms",quantity:325,unit:"g",confidence:.94,useSoon:true}],assessment:null,cookingCue:null,needsConfirmation:true,warnings:[],source:"vision"})});
  });
  await page.goto("/scan?mode=Fridge",{waitUntil:"domcontentloaded"});
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")||"{}").ingredientStock?.mushroom?.qty??null);
  expect(before).toBe(250);
  const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQMcAAAAASUVORK5CYII=","base64");
  await page.locator('input[aria-label="Choose a photo from the library"]').setInputFiles({name:"fridge.png",mimeType:"image/png",buffer:png});
  await expect(page.getByText("HOME VISION")).toBeVisible();
  await expect(page.getByText("Mushrooms detected")).toBeVisible();
  const stillBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")||"{}").ingredientStock?.mushroom?.qty??null);
  expect(stillBefore).toBe(250);
  await page.getByRole("button",{name:"Confirm"}).click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")||"{}").ingredientStock?.mushroom?.qty??null)).toBe(325);
  await expect.poll(()=>page.evaluate(()=>!!JSON.parse(localStorage.getItem("home-meals-household-v12")||"{}").useSoon?.mushroom)).toBe(true);
});

test("camera controls expose library and environment-camera capture paths for all scan modes",async({page})=>{
  await seedHousehold(page);
  await page.route("**/api/vision",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({configured:true})}));
  for(const mode of ["Fridge","Freezer","Pantry","Receipt","Prep","Meal"]){
    await page.goto(`/scan?mode=${mode}`,{waitUntil:"domcontentloaded"});
    await expect(page.locator('input[aria-label="Choose a photo from the library"]')).toHaveAttribute("accept","image/*");
    const camera=page.locator('input[aria-label="Take a photo"]').first();
    await expect(camera).toHaveAttribute("accept","image/*");
    await expect(camera).toHaveAttribute("capture","environment");
  }
});

test("voice fallback transcribes into the same Ask Home brain when realtime WebRTC is unavailable",async({page})=>{
  await seedHousehold(page);await mockAskHome(page,"Voice reached the same household brain.");
  await page.addInitScript(()=>{
    Object.defineProperty(window,"RTCPeerConnection",{configurable:true,value:undefined});
    class MockRecognition{
      lang="";interimResults=false;maxAlternatives=1;onstart?:()=>void;onresult?:(e:any)=>void;onerror?:()=>void;onend?:()=>void;
      start(){this.onstart?.();setTimeout(()=>this.onresult?.({results:[[{transcript:"What can we make now?"}]]}),20);setTimeout(()=>this.onend?.(),40)}
    }
    Object.defineProperty(window,"webkitSpeechRecognition",{configurable:true,value:MockRecognition});
  });
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await page.waitForTimeout(80);
  await page.getByRole("button",{name:"Talk to Home"}).last().click();
  const dialog=page.getByRole("dialog",{name:"Ask Home"});
  await expect(dialog).toBeVisible({timeout:3000});
  await expect(dialog).toContainText("Voice reached the same household brain.",{timeout:5000});
});

test("Plan remains the household week calendar and supports selecting all seven days",async({page})=>{
  await seedHousehold(page);
  await page.goto("/plan",{waitUntil:"domcontentloaded"});
  const week=page.getByLabel("This week's dinners");
  await expect(week).toBeVisible();
  for(const day of ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]){
    const button=week.getByRole("button",{name:new RegExp(`^${day}`)});
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed","true");
  }
});
