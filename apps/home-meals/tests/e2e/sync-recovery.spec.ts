import {expect,test,type Page} from "@playwright/test";

const week=["gold-chicken-curry","sambal-udang","thai-green-chicken","pad-kra-pao","chicken-cacciatore","mustard-mushroom-chicken","beef-broccoli"];
const STATE_KEY="home-meals-household-v12",META_KEY="home-meals-sync-meta-v12",PENDING_KEY="home-meals-sync-pending-v12",PERSON_KEY="home-meals-person-v1";

function state(activePrepIds:string[]=[]){return {version:12 as const,week:[...week],monthlyPool:[...week],activePrepIds,componentBatches:[],manualComponentStock:{},ingredientStock:{},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:true,migrationWarnings:[]}}
function stableValue(value:any):any{if(Array.isArray(value))return value.map(stableValue);if(value&&typeof value==="object"){const out:Record<string,any>={};for(const key of Object.keys(value).sort())out[key]=stableValue(value[key]);return out}return value}
function stableStringify(value:unknown){return JSON.stringify(stableValue(value))}
async function seed(page:Page,current:ReturnType<typeof state>,meta?:{version:number;lastSyncedPayload:string}){await page.addInitScript(({current,meta,keys})=>{localStorage.setItem(keys.state,JSON.stringify(current));localStorage.setItem(keys.person,"josh");if(meta)localStorage.setItem(keys.meta,JSON.stringify(meta));else localStorage.removeItem(keys.meta);localStorage.removeItem(keys.pending)}, {current,meta,keys:{state:STATE_KEY,meta:META_KEY,pending:PENDING_KEY,person:PERSON_KEY}})}
async function sessionReady(page:Page){await page.route("**/api/household/session",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({configured:true,authenticated:true})}))}
function remote(version:number,payload:ReturnType<typeof state>|null){return {version,payload,updatedAt:"2026-09-14T12:00:00.000Z"}}

// These tests exercise the actual browser sync runtime with a deterministic fake server. They must never hit production household data.
test("join conflict preserves both states until the household chooses",async({page})=>{
  const local=state(["red"]),shared=state(["gold"]);
  await seed(page,local);await sessionReady(page);
  await page.route("**/api/household",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(remote(4,shared))}));
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("This device already has Home Meals data")).toBeVisible();
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["red"]);
  await page.getByRole("button",{name:"Use shared household"}).click();
  await page.waitForLoadState("domcontentloaded");
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["gold"]);
});

test("concurrent local and remote edits surface an explicit conflict",async({page})=>{
  const base=state([]),local=state(["red"]),shared=state(["gold"]);
  await seed(page,local,{version:4,lastSyncedPayload:stableStringify(base)});await sessionReady(page);
  await page.route("**/api/household",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(remote(5,shared))}));
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("Two devices changed Home Meals")).toBeVisible();
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["red"]);
});

test("remote household changes are deferred during cooking then safely reconciled",async({page})=>{
  const base=state([]),shared=state(["gold"]);
  await seed(page,base,{version:4,lastSyncedPayload:stableStringify(base)});await sessionReady(page);
  await page.route("**/api/household",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(remote(5,shared))}));
  await page.goto("/cook/gold-chicken-curry/cook",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("Household updated")).toBeVisible();
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual([]);
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).version,META_KEY)).toBe(4);
  expect(await page.evaluate(k=>!!localStorage.getItem(k),PENDING_KEY)).toBe(true);
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["gold"]);
  expect(await page.evaluate(k=>localStorage.getItem(k),PENDING_KEY)).toBeNull();
});

test("first-write race fetches the winning household before asking for a choice",async({page})=>{
  const local=state(["red"]),winner=state(["gold"]);let gets=0;
  await seed(page,local);await sessionReady(page);
  await page.route("**/api/household",async route=>{const method=route.request().method();if(method==="PUT")return route.fulfill({status:409,contentType:"application/json",body:JSON.stringify({error:"version_conflict"})});gets++;return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(gets===1?remote(0,null):remote(1,winner))})});
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("Two devices changed Home Meals")).toBeVisible();
  expect(gets).toBeGreaterThanOrEqual(2);
  await page.getByRole("button",{name:"Use shared household"}).click();
  await page.waitForLoadState("domcontentloaded");
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["gold"]);
});

test("failed write keeps local household truth and surfaces automatic recovery",async({page})=>{
  const base=state([]),local=state(["red"]);
  await seed(page,local,{version:1,lastSyncedPayload:stableStringify(base)});await sessionReady(page);
  await page.route("**/api/household",route=>route.request().method()==="PUT"?route.fulfill({status:500,contentType:"application/json",body:JSON.stringify({error:"write_failed"})}):route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(remote(1,base))}));
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("Household sync needs attention")).toBeVisible();
  await expect(page.getByText("Your local Home Meals still works and will retry automatically.")).toBeVisible();
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).activePrepIds,STATE_KEY)).toEqual(["red"]);
});
