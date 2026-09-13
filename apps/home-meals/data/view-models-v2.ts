import { formatQuantity, type Quantity } from "./food-quantity";
import { getCanonicalPrepV2 } from "./food-truth-v2";
import { getCanonicalRecipeV2 } from "./recipe-truth-v2";
import { recipePrepAvailabilityV2, type ComponentStockV2 } from "./food-engine-v2";

export type PrepComponentViewV2 = Readonly<{
  id:string;
  code:string;
  name:string;
  tier:string;
  storageMode:string;
  stock:Quantity;
  stockLabel:string;
  workingUnit:Quantity;
  workingUnitLabel:string;
  measured:boolean;
}>;

export type RecipeCardViewV2 = Readonly<{
  id:string;
  title:string;
  cuisine:string;
  servings:2;
  prepReady:boolean;
  missingPrep:readonly {componentId:string;shortfall:Quantity;label:string}[];
  reportedMinutes:number;
  sourceStatus:string;
}>;

export function prepComponentViewV2(componentId:string,stock:ComponentStockV2):PrepComponentViewV2{
  const c=getCanonicalPrepV2(componentId);if(!c)throw new Error(`Unknown component ${componentId}`);
  const value=stock[componentId]??{qty:0,unit:c.workingUnit.unit};
  if(value.unit!==c.workingUnit.unit)throw new Error(`View-model stock unit mismatch for ${componentId}`);
  return {
    id:c.id,
    code:c.code,
    name:c.name,
    tier:c.tier,
    storageMode:c.storageMode,
    stock:value,
    stockLabel:formatQuantity(value),
    workingUnit:c.workingUnit,
    workingUnitLabel:formatQuantity(c.workingUnit),
    measured:c.measurementStatus!=="unmeasured",
  };
}

export function recipeCardViewV2(recipeId:string,stock:ComponentStockV2):RecipeCardViewV2{
  const recipe=getCanonicalRecipeV2(recipeId);if(!recipe)throw new Error(`Unknown recipe ${recipeId}`);
  const availability=recipePrepAvailabilityV2(recipeId,stock);
  return {
    id:recipe.id,
    title:recipe.title,
    cuisine:recipe.cuisine,
    servings:recipe.servings,
    prepReady:availability.ready,
    missingPrep:availability.missing.map(x=>({componentId:x.componentId,shortfall:x.shortfall,label:formatQuantity(x.shortfall)})),
    reportedMinutes:recipe.reportedTotalMinutes,
    sourceStatus:recipe.sourceStatus,
  };
}
