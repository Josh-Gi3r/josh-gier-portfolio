import { quantity, subtractQuantity, type Quantity } from "./food-quantity";
import { getCanonicalIngredientV2 } from "./ingredient-catalog-v2";
import { ingredientDemandForPlanV2, type PlannedRecipeV2 } from "./ingredient-engine-v2";

export type IngredientPackageV2=Readonly<{
  packageId:string;
  ingredientId:string;
  original:Quantity;
  remaining:Quantity;
  pricePaid:number|null;
  currency:"MYR"|"SGD"|null;
  purchasedAt:string|null;
  openedAt:string|null;
  useBy:string|null;
  bestBefore:string|null;
}>;

export function validateIngredientPackageV2(pkg:IngredientPackageV2){
 const errors:string[]=[];const ingredient=getCanonicalIngredientV2(pkg.ingredientId);
 if(!pkg.packageId.trim())errors.push("packageId required");if(!ingredient)errors.push(`unknown ingredient ${pkg.ingredientId}`);
 if(ingredient&&(pkg.original.unit!==ingredient.canonicalUnit||pkg.remaining.unit!==ingredient.canonicalUnit))errors.push(`package unit mismatch for ${pkg.ingredientId}`);
 if(pkg.original.qty<0||pkg.remaining.qty<0||pkg.remaining.qty>pkg.original.qty)errors.push("invalid package quantities");
 if(pkg.pricePaid!=null&&(!(pkg.pricePaid>=0)||!Number.isFinite(pkg.pricePaid)))errors.push("invalid pricePaid");
 for(const [label,value] of [["purchasedAt",pkg.purchasedAt],["openedAt",pkg.openedAt],["useBy",pkg.useBy],["bestBefore",pkg.bestBefore]] as const)if(value&&Number.isNaN(Date.parse(value)))errors.push(`${label} must be a valid timestamp`);
 return{valid:errors.length===0,errors};
}

export function ingredientStockFromPackagesV2(packages:readonly IngredientPackageV2[]){
 const out:Record<string,Quantity>={};for(const pkg of packages){const check=validateIngredientPackageV2(pkg);if(!check.valid)throw new Error(check.errors.join("; "));const current=out[pkg.ingredientId]??quantity(0,pkg.remaining.unit);if(current.unit!==pkg.remaining.unit)throw new Error(`package stock unit mismatch for ${pkg.ingredientId}`);out[pkg.ingredientId]=quantity(current.qty+pkg.remaining.qty,current.unit)}return out;
}

export function estimatedIngredientCostV2(ingredientId:string,required:Quantity,packages:readonly IngredientPackageV2[]){
 const priced=packages.filter(p=>p.ingredientId===ingredientId&&p.pricePaid!=null&&p.currency&&p.original.qty>0&&p.original.unit===required.unit);
 if(!priced.length)return{status:"unknown" as const,cost:null,currency:null,reason:"No observed package price in the required unit"};
 const currencies=new Set(priced.map(p=>p.currency));if(currencies.size!==1)return{status:"unknown" as const,cost:null,currency:null,reason:"Observed prices use multiple currencies"};
 const totalUnits=priced.reduce((sum,p)=>sum+p.original.qty,0),totalCost=priced.reduce((sum,p)=>sum+(p.pricePaid??0),0),unitCost=totalCost/totalUnits;
 return{status:"known" as const,cost:unitCost*required.qty,currency:[...currencies][0],reason:"Derived from observed household package prices"};
}

export function planPackageRemaindersV2(plan:readonly PlannedRecipeV2[],packages:readonly IngredientPackageV2[]){
 const demand=ingredientDemandForPlanV2(plan),stock=ingredientStockFromPackagesV2(packages);return demand.map(({ingredientId,required})=>{const onHand=stock[ingredientId]??quantity(0,required.unit);if(onHand.unit!==required.unit)throw new Error(`plan/package unit mismatch for ${ingredientId}`);const remaining=onHand.qty>=required.qty?subtractQuantity(onHand,required):quantity(0,required.unit);return{ingredientId,required,onHand,remaining,shortfall:Math.max(0,required.qty-onHand.qty)}});
}

export function packagesUseSoonV2(packages:readonly IngredientPackageV2[],now=new Date(),withinDays=3){
 const cutoff=now.getTime()+withinDays*86400000;return packages.filter(pkg=>{const date=pkg.useBy??pkg.bestBefore;if(!date||pkg.remaining.qty<=0)return false;const t=Date.parse(date);return Number.isFinite(t)&&t>=now.getTime()&&t<=cutoff}).sort((a,b)=>Date.parse((a.useBy??a.bestBefore)!)-Date.parse((b.useBy??b.bestBefore)!));
}
