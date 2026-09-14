import {expect,test,type Page} from "@playwright/test";
import {boosters,midBases,motherBases,recipes} from "../../data/home-data";

const coreRoutes=[
  "/","/cook","/cook/builder","/history","/prep","/prep/day","/prep/groceries","/prep/mids","/prep/boosters","/kitchen","/plan","/scan","/learn"
];
const learnRoutes=["/learn/portions","/learn/freezer","/learn/prep-day","/learn/system"];
const scanRoutes=["/scan?mode=Fridge","/scan?mode=Freezer","/scan?mode=Pantry","/scan?mode=Receipt","/scan?mode=Prep","/scan?mode=Meal"];
const recipeRoutes=recipes.flatMap(recipe=>[`/cook/${recipe.id}`,`/cook/${recipe.id}/cook`]);
const motherRoutes=motherBases.map(base=>`/prep/${base.id}`);
const midRoutes=midBases.map(base=>`/prep/mids/${base.id}`);
const boosterRoutes=boosters.map(base=>`/prep/boosters/${base.id}`);
const fullRouteSet=Array.from(new Set([...coreRoutes,...learnRoutes,...scanRoutes,...recipeRoutes,...motherRoutes,...midRoutes,...boosterRoutes]));

async function waitForVisibleImages(page:Page){
  const pending=await page.locator("img:visible").evaluateAll(images=>images.some(image=>!(image as HTMLImageElement).complete));
  if(!pending)return;
  await page.waitForFunction(()=>[...document.querySelectorAll("img")].filter(image=>{
    const rect=image.getBoundingClientRect();
    return rect.width>0&&rect.height>0;
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
    await waitForVisibleImages(page);
    const brokenImages=await page.locator("img:visible").evaluateAll(images=>images.filter(image=>{
      const img=image as HTMLImageElement;
      return !img.complete||img.naturalWidth===0;
    }).map(image=>(image as HTMLImageElement).src));
    expect(brokenImages,`${route} has broken or timed-out visible images: ${brokenImages.join(", ")}`).toEqual([]);
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
  await expect(dialog).toContainText("Unknown and empty are different");
  await dialog.getByRole("button",{name:/Kitchen is empty/i}).click();
  await expect(page).toHaveURL(/\/prep$/);
  await expect(dialog).toBeHidden();
  for(const [label,path] of [["Cook","/cook"],["Prep","/prep"],["Kitchen","/kitchen"],["Plan","/plan"],["Home","/"]] as const){
    const link=page.getByRole("link",{name:new RegExp(`^${label}$`,"i")}).last();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path==="/"?"/$":`${path.replaceAll("/","\\/")}$`}`));
  }
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
