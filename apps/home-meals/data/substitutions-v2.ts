export type SubstitutionGradeV2="A"|"B"|"C"|"NO";
export type ApprovedSubstitutionV2=Readonly<{
  fromIngredientId:string;
  toIngredientId:string;
  grade:SubstitutionGradeV2;
  sameQuantityByWeight:boolean;
  requiresMethodChange:boolean;
  note:string;
  evidenceLabel:string;
  evidenceUrl:string;
}>;

/**
 * Small, explicit graph only. Absence means Home must not invent a substitution.
 * Grades: A near-equivalent, B good household substitute, C works but materially changes dish, NO explicitly avoid.
 */
export const approvedSubstitutionsV2:readonly ApprovedSubstitutionV2[]=[
  {fromIngredientId:"thai-eggplant",toIngredientId:"zucchini",grade:"B",sameQuantityByWeight:true,requiresMethodChange:true,note:"Good practical fallback for Thai curry, but softer and less bitter; add later so it does not collapse.",evidenceLabel:"Hot Thai Kitchen — Green Curry Chicken",evidenceUrl:"https://hot-thai-kitchen.com/green-curry-new-2/"},
  {fromIngredientId:"holy-basil",toIngredientId:"thai-basil",grade:"C",sameQuantityByWeight:true,requiresMethodChange:false,note:"Usable aromatic fallback for pad kra pao, but it is not the defining holy-basil flavour.",evidenceLabel:"Hot Thai Kitchen — Pad Kra Pao",evidenceUrl:"https://hot-thai-kitchen.com/pad-kra-pao-anything/"},
  {fromIngredientId:"thai-basil",toIngredientId:"sweet-basil",grade:"C",sameQuantityByWeight:true,requiresMethodChange:false,note:"Keeps a fresh basil finish but materially changes the Thai aroma; do not call it equivalent.",evidenceLabel:"Hot Thai Kitchen — Green Curry Chicken",evidenceUrl:"https://hot-thai-kitchen.com/green-curry-new-2/"},
  {fromIngredientId:"beef-flank",toIngredientId:"beef-sirloin",grade:"B",sameQuantityByWeight:true,requiresMethodChange:false,note:"Both work for thin high-heat beef-and-broccoli slices when cut across the grain.",evidenceLabel:"The Woks of Life — Beef and Broccoli",evidenceUrl:"https://thewoksoflife.com/beef-with-broccoli-all-purpose-stir-fry-sauce/"},
  {fromIngredientId:"broccoli",toIngredientId:"broccolini",grade:"A",sameQuantityByWeight:true,requiresMethodChange:true,note:"Close vegetable replacement; thinner stems generally need less blanching/cooking.",evidenceLabel:"Home Meals culinary substitution policy",evidenceUrl:"https://thewoksoflife.com/beef-with-broccoli-all-purpose-stir-fry-sauce/"},
  {fromIngredientId:"candlenut",toIngredientId:"macadamia",grade:"B",sameQuantityByWeight:true,requiresMethodChange:false,note:"Practical texture/fat substitute in rempah when candlenut is unavailable; flavour and cost differ.",evidenceLabel:"Home Meals Research 1 — rempah substitution review",evidenceUrl:"https://www.nyonyacooking.com/recipes/beef-rendang~HJg5DP_Pf5W7"},
  {fromIngredientId:"gula-melaka",toIngredientId:"brown-sugar",grade:"B",sameQuantityByWeight:true,requiresMethodChange:false,note:"Sweetness works by weight but loses the deeper palm-sugar character.",evidenceLabel:"Home Meals Research 1 — sambal substitution review",evidenceUrl:"https://www.singaporeanmalaysianrecipes.com/sambal-tumis-recipe/"},
  {fromIngredientId:"chicken-thigh",toIngredientId:"chicken-breast",grade:"B",sameQuantityByWeight:true,requiresMethodChange:true,note:"Works in many quick curries/stir-fries, but add later or shorten cooking to avoid drying; not automatic for long braises.",evidenceLabel:"Home Meals Research 2 — chicken variant review",evidenceUrl:"https://hot-thai-kitchen.com/green-curry-new-2/"},
];

export function substitutionsForIngredientV2(ingredientId:string){return approvedSubstitutionsV2.filter(x=>x.fromIngredientId===ingredientId)}
export function substitutionV2(fromIngredientId:string,toIngredientId:string){return approvedSubstitutionsV2.find(x=>x.fromIngredientId===fromIngredientId&&x.toIngredientId===toIngredientId)}
export function mayAutoSuggestSubstitutionV2(edge:ApprovedSubstitutionV2){return edge.grade==="A"||edge.grade==="B"}
export function mayAutoApplySubstitutionV2(_edge:ApprovedSubstitutionV2){return false}
