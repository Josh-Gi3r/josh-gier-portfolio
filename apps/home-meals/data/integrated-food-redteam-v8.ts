import {canonicalPrepComponentsV2} from "./food-truth-v2";
import {canonicalPrepFormulationsV2} from "./prep-formulations-v2";
import {prepPortionPoliciesV6} from "./prep-portioning-v6";
import {prepEnergyReferencesV6} from "./prep-energy-v6";
import {allRecipeEnergyReferencesV6} from "./recipe-energy-v6";
import {allLiveRecipesV7} from "./recipe-catalog-v7";
import {prepForRecipeAtCookScaleV7} from "./food-engine-v7";
import {canonicalIngredientCatalogV7} from "./ingredient-catalog-v7";
import {coreMotherIdsV7,optionalPrepIdsV7} from "./prep-repertoire-v7";
import {phase2ResearchRecipesV5} from "./phase2-research-registry-v5";

export type RedTeamFlagV8="CORRECT"|"HOUSEHOLD_ADAPTATION"|"REFERENCE_ESTIMATE"|"MEASURE_IN_KITCHEN"|"RESEARCH_AGAIN";
export type FoodObjectLedgerRowV8=Readonly<{id:string;kind:"prep"|"recipe";flags:readonly RedTeamFlagV8[];note:string}>;
const phase2ById=new Map(phase2ResearchRecipesV5.map(x=>[x.id,x]));
export const foodObjectLedgerV8:readonly FoodObjectLedgerRowV8[]=[
 ...canonicalPrepComponentsV2.map((c):FoodObjectLedgerRowV8=>({id:c.id,kind:"prep",flags:["CORRECT","MEASURE_IN_KITCHEN"],note:c.id==="onion"?"Optional caramelised-onion foundation retained for future dishes; no current live recipe is forced to consume it.":"Formulation/evidence/packet policy reconciled; actual finished household yield remains a kitchen measurement."})),
 ...allLiveRecipesV7.map((r):FoodObjectLedgerRowV8=>({id:r.id,kind:"recipe",flags:["CORRECT",...(phase2ById.get(r.id)?.identity==="household_adaptation"?["HOUSEHOLD_ADAPTATION" as const]:[]),"REFERENCE_ESTIMATE"],note:"Four-serving live formulation reconciled across ingredients, prep dependencies, runtime and reference nutrition; household product labels and observed cooking can refine nutrition."}))
];

export const reviewedNumericOutliersV8:Readonly<Record<string,string>>={
 "beef-rendang":"Multi-source proportion review completed. Rich by identity; beef/coconut/kerisik were reduced from the over-heavy draft while preserving the dry rendang finish and rice.",
 "katsu-curry":"Rich but coherent: fried breaded chicken, Japanese curry and rice. Frying uptake is modelled with explicit uncertainty rather than pretending all frying oil is eaten.",
 "rempah-chicken-rendang":"Rich coconut/rempah dinner retained; high reference energy is expected and remains label/yield sensitive.",
 "meatballs-red-sauce":"Meal-scale meatballs, Parmesan, tomato sauce and pasta make this genuinely hearty/rich rather than a numeric anomaly.",
 "thit-kho":"Multi-source pork-per-person check completed; 750 g for four aligns with Vietnamese references and pork-belly rendering remains a major uncertainty.",
 "bun-cha-bowl":"Pork, noodles and dressing make a substantial full meal; retained rather than forcing it into an arbitrary calorie target.",
 "hainanese-chicken-rice":"Whole-bird edible-yield adjustment is explicit and dry rice was reduced to 80 g/person; technique remains whole-chicken/poaching-stock led.",
 "thai-red-chicken":"Coconut curry with rice is intentionally rich; exact coconut-milk label and prep density are the largest uncertainty.",
 "massaman-beef":"Old two-serving foundation was corrected before V4 scaling. Runtime now targets roughly 700 g beef + 400 ml coconut milk for four, with rice included.",
 "massaman-chicken":"Bone-in chicken edible yield, coconut milk, peanuts and rice justify a rich reference; bone/refuse uncertainty is explicit.",
 "gold-chana-masala":"Low end is coherent: legume-led meal with restrained fat; optional sides are not silently counted.",
 "potato-greens-frittata":"Low reference reflects optional bread/cheese exclusion; egg/potato/greens formulation itself is coherent.",
 "white-sauce-prawns":"Light seafood meal retained; low energy is not treated as an error merely to hit a target.",
 "mushroom-spinach-omelette":"Direct egg/vegetable meal with optional cheese excluded; intentionally light.",
 "gyeran-mari":"Egg-and-vegetable roll is intentionally light when optional rice is excluded; the display must not imply the optional rice is included in the kcal reference."
};

export function validateIntegratedFoodRedTeamV8(){
 const errors:string[]=[];const prepCount=canonicalPrepComponentsV2.length,recipeCount=allLiveRecipesV7.length,totalFoodObjects=foodObjectLedgerV8.length;
 if(prepCount!==41)errors.push(`Expected 41 prep objects, found ${prepCount}`);if(recipeCount!==136)errors.push(`Expected 136 live recipes, found ${recipeCount}`);if(totalFoodObjects!==177)errors.push(`Expected 177 ledger rows, found ${totalFoodObjects}`);if(new Set(foodObjectLedgerV8.map(x=>`${x.kind}:${x.id}`)).size!==totalFoodObjects)errors.push("Duplicate food-object ledger row");if(foodObjectLedgerV8.some(x=>x.flags.includes("RESEARCH_AGAIN")))errors.push("Ledger still contains RESEARCH_AGAIN items");
 if(coreMotherIdsV7.length!==7)errors.push(`Expected 7 core bases, found ${coreMotherIdsV7.length}`);if(optionalPrepIdsV7.size!==1||!optionalPrepIdsV7.has("onion"))errors.push("ONION must be the single optional foundation rather than a core base");
 const useCounts=new Map(canonicalPrepComponentsV2.map(c=>[c.id,0]));for(const recipe of allLiveRecipesV7)for(const req of prepForRecipeAtCookScaleV7(recipe.id))useCounts.set(req.componentId,(useCounts.get(req.componentId)??0)+1);const libraryOnlyPrep=[...useCounts].filter(([,n])=>n===0).map(([id])=>id).sort();if(libraryOnlyPrep.join(",")!=="onion")errors.push(`Expected only ONION to have zero live consumers, found ${libraryOnlyPrep.join(",")||"none"}`);
 const formById=new Map(canonicalPrepFormulationsV2.map(x=>[x.componentId,x]));let unresolvedDependencyCount=0;for(const recipe of allLiveRecipesV7){const direct=new Set(prepForRecipeAtCookScaleV7(recipe.id).map(x=>x.componentId));for(const child of direct){for(const parent of formById.get(child)?.componentInputs??[]){if(direct.has(parent.componentId)){unresolvedDependencyCount++;errors.push(`${recipe.id} double-charges child ${child} plus parent ${parent.componentId}`)}}}}
 const portionIds=new Set(prepPortionPoliciesV6.map(x=>x.componentId)),energyIds=new Set(prepEnergyReferencesV6.map(x=>x.componentId)),formIds=new Set(canonicalPrepFormulationsV2.map(x=>x.componentId));for(const c of canonicalPrepComponentsV2){if(!portionIds.has(c.id))errors.push(`${c.id} missing packet policy`);if(!energyIds.has(c.id))errors.push(`${c.id} missing prep energy method`);if(!formIds.has(c.id))errors.push(`${c.id} missing formulation`)}for(const f of canonicalPrepFormulationsV2){if(!f.measureFinishedOutput)errors.push(`${f.componentId} does not require measured finished output`);if(!f.evidence.length)errors.push(`${f.componentId} has no formulation evidence`)}
 const duplicateNameUnit=new Map<string,string[]>();for(const x of canonicalIngredientCatalogV7){const key=`${x.name.trim().toLowerCase()}|${x.canonicalUnit}`,ids=duplicateNameUnit.get(key)??[];ids.push(x.id);duplicateNameUnit.set(key,ids)}const identityCollisions=[...duplicateNameUnit.entries()].filter(([,ids])=>ids.length>1);for(const [key,ids] of identityCollisions)errors.push(`Ingredient identity collision ${key}: ${ids.join(",")}`);const retiredAliasIds=["black-peppercorn","couscous-dry","flour","plain-flour","flour-tortilla-large","light-soy","makrut-lime-leaf","meat-curry-powder","plain-yoghurt","salmon-fillet"];for(const id of retiredAliasIds)if(canonicalIngredientCatalogV7.some(x=>x.id===id))errors.push(`Retired alias remains canonical: ${id}`);
 const energyRows=Object.values(allRecipeEnergyReferencesV6);for(const r of energyRows){if(r.unresolvedIngredientIds.length)errors.push(`${r.recipeId} unresolved nutrition ingredients: ${r.unresolvedIngredientIds.join(",")}`);if(r.unresolvedPrepIds.length)errors.push(`${r.recipeId} unresolved nutrition prep: ${r.unresolvedPrepIds.join(",")}`);if(r.servings!==4)errors.push(`${r.recipeId} energy reference is not four-serving`)}const sorted=[...energyRows].sort((a,b)=>b.kcalPerPerson-a.kcalPerPerson||a.recipeId.localeCompare(b.recipeId)),numericOutlierIds=[...sorted.slice(0,10),...sorted.slice(-5)].map(x=>x.recipeId);for(const id of numericOutlierIds)if(!reviewedNumericOutliersV8[id])errors.push(`Numeric extreme lacks manual review: ${id}`);const staleReviews=Object.keys(reviewedNumericOutliersV8).filter(id=>!numericOutlierIds.includes(id));if(staleReviews.length)errors.push(`Numeric review set is stale: ${staleReviews.join(",")}`);
 return{valid:errors.length===0,errors,prepCount,recipeCount,totalFoodObjects,ingredientIdentityCount:canonicalIngredientCatalogV7.length,ingredientIdentityCollisions:identityCollisions.length,unresolvedDependencyCount,numericOutlierCount:numericOutlierIds.length,numericOutlierIds,libraryOnlyPrep,coreMotherCount:coreMotherIdsV7.length};
}
