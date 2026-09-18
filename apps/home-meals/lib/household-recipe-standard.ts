export type HouseholdRecipeStandard={
 subtitle:string;
 cuisine:string;
 minutes:number;
 difficulty:"Easy"|"Medium"|"Weekend";
 mealStyle:"light"|"balanced"|"hearty"|"rich";
 methodLabel:string;
 allergens:string[];
 storage:string;
 leftovers:string;
};

export function householdRecipeStandardIssues(payload:Record<string,unknown>){
 const issues:string[]=[];
 const title=typeof payload.title==="string"?payload.title.trim():"";
 const servings=Number(payload.servings);
 const ingredients=Array.isArray(payload.ingredients)?payload.ingredients:[];
 const method=Array.isArray(payload.method)?payload.method:[];
 const s=payload.standard&&typeof payload.standard==="object"?payload.standard as Record<string,unknown>:null;
 if(!title)issues.push("title");
 if(!Number.isFinite(servings)||servings<2||servings>12)issues.push("servings");
 if(ingredients.length<2)issues.push("ingredients");
 if(method.length<2)issues.push("method");
 if(!s){issues.push("standard");return issues}
 for(const key of ["subtitle","cuisine","methodLabel","storage","leftovers"] as const)if(typeof s[key]!=="string"||!String(s[key]).trim())issues.push(key);
 const minutes=Number(s.minutes);if(!Number.isFinite(minutes)||minutes<5||minutes>480)issues.push("minutes");
 if(!["Easy","Medium","Weekend"].includes(String(s.difficulty)))issues.push("difficulty");
 if(!["light","balanced","hearty","rich"].includes(String(s.mealStyle)))issues.push("mealStyle");
 if(!Array.isArray(s.allergens))issues.push("allergens");
 return issues;
}
export function householdRecipeStandardReady(payload:Record<string,unknown>){return householdRecipeStandardIssues(payload).length===0}
