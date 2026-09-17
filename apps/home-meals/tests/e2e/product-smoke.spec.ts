import {expect,test,type Page} from "@playwright/test";
import {boosters,midBases,motherBases} from "../../data/home-data";
import {allLiveRecipesV7 as recipes} from "../../data/recipe-catalog-v7";

const coreRoutes=[
  "/","/cook","/cook/builder","/history","/prep","/prep/bases","/prep/sauces","/prep/common","/prep/day","/prep/groceries","/prep/mids","/prep/boosters","/kitchen","/plan","/scan","/learn"
];
const learnRoutes=["/learn/portions","/learn/freezer","/learn/prep-day","/learn/system"];
const scanRoutes=["/scan?mode=Fridge","/scan?mode=Freezer","/scan?mode=Pantry","/scan?mode=Receipt","/scan?mode=Prep","/scan?mode=Meal"];
const recipeRoutes=recipes.flatMap(recipe=>[`/cook/${recipe.id}`,`/cook/${recipe.id}/cook`]);
const motherRoutes=motherBases.map(base=>`/prep/${base.id}`);
const midRoutes=midBases.map(base=>`/prep/mids/${base.id}`);
const boosterRoutes=boosters.map(base=>`/prep/boosters/${base.id}`);
const fullRouteSet=Array.from(new Set([...coreRoutes,...learnRoutes,...scanRoutes,...recipeRoutes,...motherRoutes,...midRoutes,...boosterRoutes]));

async function settleViewportImages(page:Page){
  const hasPendingViewportImage=await page.locator("img").evaluateAll(images=>images.some(image=>{
    const img=image as HTMLImageElement,rect=img.getBoundingClientRect();
    return rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<window.innerHeight&&!img.complete;
  }));
  if(!hasPendingViewportImage)return;
  await page.waitForFunction(()=>[...document.querySelectorAll("img")].filter(image=>{
    const rect=image.getBoundingClientRect();
    return rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<window.innerHeight;
  }).every(image=>(image as HTMLImageElement).complete),undefined,{timeout:5_000}).catch(()=>{});
}

async function assertHealthyPage(page:Page,route:string,wait:"networkidle"|"domcontentloaded"="networkidle"){
  const pageErrors:string[]=[];
  const consoleErrors:string[]=[];
  const onPageError=(error:Error)=>pageErrors.push(error.message);
  const onConsole=(message:any)=>{if(message.type()==="error")consoleErrors.push(message.text())};
  page.on("pageerror",onPageError);page.on("console",onConsole);
  try{
    const response=await page.goto(route,{waitUntil:wait});
    expect(response,`${route} returned no main-document response`).not.toBeNull();
    expect(response!.status(),`${route} returned HTTP ${response!.status()}`).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow,`${route} has document-level horizontal overflow`).toBeLessThanOrEqual(1);
    await settleViewportImages(page);
    const brokenImages=await page.locator("img:visible").evaluateAll(images=>images.filter(image=>{
      const img=image as HTMLImageElement;
      return img.complete&&img.naturalWidth===0;
    }).map(image=>(image as HTMLImageElement).src));
    expect(brokenImages,`${route} has broken visible images: ${brokenImages.join(", ")}`).toEqual([]);
    const unlabeledControls=await page.locator('button,a[href],input:not([type="hidden"]),select,textarea').evaluateAll(nodes=>nodes.filter(node=>{
      const el=node as HTMLElement,rect=el.getBoundingClientRect(),style=getComputedStyle(el);
      if(rect.width<1||rect.height<1||style.display==="none"||style.visibility==="hidden"||style.opacity==="0")return false;
      const aria=el.getAttribute("aria-label")?.trim();
      const labelled=el.getAttribute("aria-labelledby")?.split(/\s+/).map(id=>document.getElementById(id)?.textContent?.trim()||"").join(" ").trim();
      const text=el.textContent?.replace(/\s+/g," ").trim();
      const title=el.getAttribute("title")?.trim();
      const imageAlt=el.querySelector("img[alt]")?.getAttribute("alt")?.trim();
      const form=el as HTMLInputElement;const labels=form.labels?[...form.labels].map(label=>label.textContent?.trim()||"").join(" ").trim():"";
      const buttonValue=(form.type==="submit"||form.type==="button")?form.value?.trim():"";
      return !(aria||labelled||text||title||imageAlt||labels||buttonValue);
    }).map(node=>`${node.tagName.toLowerCase()}${(node as HTMLElement).id?`#${(node as HTMLElement).id}`:""}${(node as HTMLElement).className?`.${String((node as HTMLElement).className).split(/\s+/).slice(0,2).join(".")}`:""}`));
    expect(unlabeledControls,`${route} has visible controls without an accessible name: ${unlabeledControls.join(", ")}`).toEqual([]);
    expect(pageErrors,`${route} raised page errors`).toEqual([]);
    expect(consoleErrors,`${route} logged console errors`).toEqual([]);
  }finally{
    page.off("pageerror",onPageError);page.off("console",onConsole);
  }
}

test.describe("canonical 390px household app",()=>{
  for(const route of coreRoutes)test(`${route} renders without browser regressions`,async({page})=>{await assertHealthyPage(page,route)});
});

test(`full catalogue route crawl (${fullRouteSet.length} routes)`,async({page})=>{
  test.setTimeout(240_000);
  for(const route of fullRouteSet)await assertHealthyPage(page,route,"domcontentloaded");
});

test("first-run truth gates navigation, then primary navigation remains usable",async({page})=>{
  await page.goto("/",{waitUntil:"networkidle"});
  const dialog=page.getByRole("dialog",{name:"Start Home Meals"});
  await expect(dialog).toBeVisible();
  const cookBeforeSetup=page.getByRole("link",{name:/^Cook$/i}).last();
  await expect(cookBeforeSetup).toBeVisible();
  await expect(dialog).toContainText("What do we have at home?");
  await dialog.getByRole("button",{name:"Nothing yet",exact:true}).click();
  await expect(page).toHaveURL(/\/prep$/);
  await expect(dialog).toBeHidden();
  for(const [label,path] of [["Cook","/cook"],["Prep","/prep"],["Kitchen","/kitchen"],["Plan","/plan"],["Home","/"]] as const){
    const link=page.getByRole("link",{name:new RegExp(`^${label}$`,"i")}).last();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path==="/"?"/$":`${path.replaceAll("/","\\/")}$`}`));
  }
});

test("preview week, physical prep and maintenance repertoire remain distinct until explicit approval",async({page})=>{
  const seed={version:12,week:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],weekStatus:"unplanned",suggestedWeek:null,planMode:"both",allowExtraPrep:true,monthlyPool:["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"],activePrepIds:[],componentBatches:[],manualComponentStock:{},ingredientStock:{},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:true,migrationWarnings:[]};
  await page.addInitScript(state=>{const marker="home-meals-v10-lifecycle-seeded";if(localStorage.getItem(marker))return;localStorage.setItem("home-meals-household-v12",JSON.stringify(state));localStorage.setItem("home-meals-welcome-seen-v1","1");localStorage.setItem(marker,"1")},seed);
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("DINNER IDEA",{exact:true})).toBeVisible();
  await expect(page.getByText("A week to look over",{exact:true})).toBeVisible();
  await page.goto("/prep",{waitUntil:"domcontentloaded"});
  await expect(page.getByRole("tab",{name:"Browse"})).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("link",{name:/Core bases/})).toBeVisible();
  await expect(page.getByRole("link",{name:/Common prep/})).toBeVisible();
  await expect(page.getByText("Caramelised onion foundation",{exact:true})).toHaveCount(0);
  await page.getByRole("tab",{name:"Ours"}).click();
  await expect(page.getByRole("heading",{name:"Have now"})).toBeVisible();
  await page.getByRole("button",{name:"Edit stock"}).click();
  await page.getByRole("button",{name:"Add one GOLD packet"}).click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")!).activePrepIds)).toEqual([]);
  await page.getByRole("button",{name:/Start small/}).click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")!).activePrepIds)).toEqual(["gold","sambal","red"]);
  await page.goto("/plan",{waitUntil:"domcontentloaded"});
  await expect(page.getByRole("heading",{name:"Preview week"})).toBeVisible();
  await page.getByRole("button",{name:"Our prep",exact:true}).click();
  await page.getByRole("button",{name:/Build it for us/i}).click();
  await expect(page.getByRole("button",{name:"Use this week"})).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")!).weekStatus)).toBe("suggested");
  await page.getByRole("button",{name:"Use this week"}).click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("home-meals-household-v12")!).weekStatus)).toBe("confirmed");
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("TONIGHT",{exact:true})).toBeVisible();
  await expect(page.getByText("This week",{exact:true})).toBeVisible();
});

const responsiveRoutes=["/","/cook","/cook/gold-chicken-curry","/cook/gold-chicken-curry/cook","/prep","/prep/gold","/prep/mids","/prep/mids/thai-green","/prep/day","/kitchen","/plan","/scan"];
const widths=[360,375,390,393,412,430,768,820,1024,1280,1440];

test.describe("responsive release matrix",()=>{
  for(const width of widths){
    for(const route of responsiveRoutes){
      test(`${route} has no document overflow at ${width}px`,async({page})=>{
        await page.setViewportSize({width,height:width>=768?900:844});
        const response=await page.goto(route,{waitUntil:"domcontentloaded"});
        expect(response?.status()??500).toBeLessThan(400);
        await expect(page.locator("body")).toBeVisible();
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
        expect(overflow,`${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(1);
      });
    }
  }
});

test("Prep V10 category cards stay usable at phone widths",async({page})=>{
  for(const width of [360,390,430]){
    await page.setViewportSize({width,height:844});
    for(const route of ["/prep","/prep/bases","/prep/mids","/prep/sauces","/prep/boosters","/prep/common"]){
      const response=await page.goto(route,{waitUntil:"domcontentloaded"});
      expect(response?.status()??500).toBeLessThan(400);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      expect(overflow,`${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
