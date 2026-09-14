import {expect,test,type Page} from "@playwright/test";

const coreRoutes=[
  "/","/cook","/cook/builder","/history","/prep","/prep/day","/prep/mids","/prep/boosters","/kitchen","/plan","/scan","/learn",
  "/cook/gold-chicken-curry","/cook/gold-chicken-curry/cook","/prep/gold"
];

async function assertHealthyPage(page:Page,route:string){
  const pageErrors:string[]=[];
  const consoleErrors:string[]=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text())});
  const response=await page.goto(route,{waitUntil:"networkidle"});
  expect(response,`${route} returned no main-document response`).not.toBeNull();
  expect(response!.status(),`${route} returned HTTP ${response!.status()}`).toBeLessThan(400);
  await expect(page.locator("body")).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,`${route} has document-level horizontal overflow`).toBeLessThanOrEqual(1);
  const brokenImages=await page.locator("img:visible").evaluateAll(images=>images.filter(image=>!(image as HTMLImageElement).complete||(image as HTMLImageElement).naturalWidth===0).map(image=>(image as HTMLImageElement).src));
  expect(brokenImages,`${route} has broken visible images: ${brokenImages.join(", ")}`).toEqual([]);
  expect(pageErrors,`${route} raised page errors`).toEqual([]);
  expect(consoleErrors,`${route} logged console errors`).toEqual([]);
}

test.describe("canonical 390px household app",()=>{
  for(const route of coreRoutes)test(`${route} renders without browser regressions`,async({page})=>{await assertHealthyPage(page,route)});
});

test("primary app navigation remains usable on phone",async({page})=>{
  await page.goto("/",{waitUntil:"networkidle"});
  for(const [label,path] of [["Cook","/cook"],["Prep","/prep"],["Kitchen","/kitchen"],["Plan","/plan"],["Home","/"]] as const){
    const link=page.getByRole("link",{name:new RegExp(`^${label}$`,"i")}).last();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path==="/"?"/$":`${path.replaceAll("/","\\/")}$`}`));
  }
});

const responsiveRoutes=["/","/cook","/prep","/kitchen","/plan","/scan"];
const widths=[360,375,390,412,430,768,1280,1440];

test.describe("responsive release matrix",()=>{
  for(const width of widths){
    for(const route of responsiveRoutes){
      test(`${route} has no document overflow at ${width}px`,async({page})=>{
        await page.setViewportSize({width,height:width>=768?900:844});
        const response=await page.goto(route,{waitUntil:"networkidle"});
        expect(response?.status()??500).toBeLessThan(400);
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
        expect(overflow,`${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(1);
      });
    }
  }
});
