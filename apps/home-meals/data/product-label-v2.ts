import { getCanonicalIngredientV2 } from "./ingredient-catalog-v2";
import { makeDensityV2, type NutrientDensityV2 } from "./nutrition-engine-v2";
import type { NutritionSnapshot } from "./nutrition-v2";
import type { Quantity } from "./food-quantity";

export type ProductLabelBindingV2=Readonly<{
  bindingId:string;
  ingredientId:string;
  brand:string;
  product:string;
  barcode:string|null;
  reference:Quantity;
  nutrients:NutritionSnapshot;
  capturedAt:string;
  source:"label_photo_confirmed"|"manufacturer_page"|"manual_label_entry";
}>;

export function validateProductLabelBindingV2(binding:ProductLabelBindingV2){
  const errors:string[]=[];const ingredient=getCanonicalIngredientV2(binding.ingredientId);
  if(!ingredient)errors.push(`unknown ingredient ${binding.ingredientId}`);
  if(!binding.bindingId.trim())errors.push("bindingId required");if(!binding.brand.trim()||!binding.product.trim())errors.push("brand and product required");
  if(!(binding.reference.qty>0))errors.push("reference quantity must be positive");if(ingredient&&binding.reference.unit!==ingredient.canonicalUnit)errors.push(`label unit ${binding.reference.unit} does not match canonical ${ingredient.canonicalUnit}`);
  if(Number.isNaN(Date.parse(binding.capturedAt)))errors.push("capturedAt must be a valid timestamp");
  for(const [name,value] of Object.entries(binding.nutrients))if(value!=null&&(!Number.isFinite(value)||value<0))errors.push(`${name} must be non-negative`);
  return{valid:errors.length===0,errors};
}

export function productLabelDensityV2(binding:ProductLabelBindingV2):NutrientDensityV2{
  const check=validateProductLabelBindingV2(binding);if(!check.valid)throw new Error(check.errors.join("; "));
  return makeDensityV2(binding.reference.qty,binding.reference.unit,binding.nutrients,"manufacturer",binding.bindingId);
}

export function preferredProductBindingV2(ingredientId:string,bindings:readonly ProductLabelBindingV2[]){
  return bindings.filter(x=>x.ingredientId===ingredientId).sort((a,b)=>Date.parse(b.capturedAt)-Date.parse(a.capturedAt))[0];
}
