import {expect,test} from '@playwright/test';

const seed={version:12,week:['gold-chicken-curry','sambal-udang','thai-green-chicken','pad-kra-pao','chicken-cacciatore','mustard-mushroom-chicken','beef-broccoli'],weekStatus:'confirmed',suggestedWeek:null,planMode:'both',allowExtraPrep:true,monthlyPool:[],activePrepIds:[],componentBatches:[],manualComponentStock:{},ingredientStock:{},qualitativeIngredientStock:{},groceryChecked:{},ratings:{},recipeNotes:{},recipeVersions:{},history:[],cookObservations:[],useSoon:{},useSoonAt:{},favourites:{},kitchenReady:false,migrationWarnings:[]};

test('G learns Kitchen inside the first tutorial even when Kitchen truth is unknown',async({page})=>{
 await page.addInitScript(state=>{
  localStorage.setItem('home-meals-household-v12',JSON.stringify(state));
  localStorage.setItem('home-meals-person-v1','g');
  localStorage.setItem('home-meals-welcome-seen-v1','1');
  localStorage.removeItem('home-meals-guide-v1:g');
 },seed);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const guide=page.locator('[data-home-guide-overlay]');
 await expect(guide).toBeVisible({timeout:4000});
 await expect(guide).toContainText('Hey sunshine');
 await expect(page.getByRole('dialog',{name:'Start Home Meals'})).toHaveCount(0);
 await guide.getByRole('button',{name:'Show me',exact:true}).click();
 await expect(page.locator('.hm-guide-copy')).toContainText('Kitchen is the truth');
 await page.locator('[data-home-guide="nav-kitchen"]').click();
 await expect(page).toHaveURL(/\/kitchen$/);
 await expect(page.locator('.hm-guide-copy')).toContainText('This is Kitchen');
 await expect(page.locator('.hm-guide-copy')).toContainText('use the camera');
 await expect(page.getByRole('button',{name:/Kitchen checked/}).first()).toBeVisible();
});

test('dismissing G tutorial restores the unknown-Kitchen truth choice',async({page})=>{
 await page.addInitScript(state=>{
  localStorage.setItem('home-meals-household-v12',JSON.stringify(state));
  localStorage.setItem('home-meals-person-v1','g');
  localStorage.setItem('home-meals-welcome-seen-v1','1');
  localStorage.removeItem('home-meals-guide-v1:g');
 },seed);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const guide=page.locator('[data-home-guide-overlay]');
 await expect(guide).toBeVisible({timeout:4000});
 await expect(page.getByRole('dialog',{name:'Start Home Meals'})).toHaveCount(0);
 await guide.getByRole('button',{name:'Not now'}).click();
 await expect(page.getByRole('dialog',{name:'Start Home Meals'})).toBeVisible();
});
