import {getIngredient,type IngredientCategory,type IngredientDef} from "./home-data";
import {canonicalIngredientCatalogV7,getCanonicalIngredientV7} from "./ingredient-catalog-v7";

const canonicalToLegacy:Readonly<Record<string,string>>={
 "egg-large":"eggs","basmati-rice-dry":"basmati-rice","jasmine-rice-dry":"jasmine-rice","beef-sirloin":"beef","ground-chicken":"ground-meat",mushroom:"mushrooms","onion-yellow":"onion",potato:"potatoes","chickpeas-drained":"chickpeas",tortilla:"tortillas","butter-unsalted":"butter"
};
const dairy=/milk|cream|butter|ghee|yogh|yogurt|cheese|paneer|halloumi|feta|parmesan|pecorino|mozzarella|gruyere/i;
const protein=/chicken|beef|pork|lamb|turkey|salmon|tuna|fish|prawn|shrimp|anchov|egg|tofu|tempeh|mince|meat/i;
const fresh=/onion|shallot|garlic|ginger|scallion|spring-onion|coriander|cilantro|parsley|basil|mint|dill|lemongrass|galangal|makrut|lime|lemon|orange|apple|pear|avocado|tomato|cucumber|carrot|celery|leek|pepper|chilli|chili|mushroom|aubergine|eggplant|zucchini|courgette|spinach|kale|cabbage|lettuce|potato|pumpkin|squash|broccoli|broccolini|green-bean|peas|bean-sprout|bok|choy|gai-lan|radish|corn|herb/i;

function inferredCategory(id:string,name:string):IngredientCategory{const s=`${id} ${name}`;if(dairy.test(s))return"Dairy";if(protein.test(s))return"Protein";if(fresh.test(s))return"Fresh";return"Pantry"}

export const ingredientUiCatalogV7:readonly IngredientDef[]=canonicalIngredientCatalogV7.map(def=>{
 const legacy=getIngredient(canonicalToLegacy[def.id]??def.id);
 return{id:def.id,name:def.name,category:legacy?.category??inferredCategory(def.id,def.name),unit:def.canonicalUnit,tracking:legacy?.tracking??"quantity"};
});
export const ingredientUiByIdV7=new Map(ingredientUiCatalogV7.map(x=>[x.id,x]));
export function getIngredientUiV7(id:string){return ingredientUiByIdV7.get(id)}
export function ingredientUiNameV7(id:string){return getIngredientUiV7(id)?.name??getCanonicalIngredientV7(id)?.name??id}
