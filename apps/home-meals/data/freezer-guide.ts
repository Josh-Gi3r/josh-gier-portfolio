import {baseRecipesV2} from "./base-recipes-v2";

export type FreezerGuide={label:string;lowerDays:number;upperDays:number|null};
export type FreezerAge={ageDays:number;guide:FreezerGuide|null;status:"recorded"|"approaching-guide"|"past-lower-guide"};

export function freezerGuide(componentId:string):FreezerGuide|null{
 const storage=baseRecipesV2[componentId]?.storage;
 if(!storage)return null;
 const match=storage.match(/freezer\s*(?:~\s*)?(\d+)\s*(?:[–-]\s*(\d+)\s*)?(months?|weeks?|days?)/i);
 if(!match)return null;
 const low=Number(match[1]);const high=match[2]?Number(match[2]):null;const unit=match[3].toLowerCase();
 const factor=unit.startsWith("month")?30:unit.startsWith("week")?7:1;
 return {label:match[0].replace(/^freezer\s*/i,"").trim(),lowerDays:low*factor,upperDays:high?high*factor:null};
}

export function freezerAge(componentId:string,at:string):FreezerAge{
 const ageDays=Math.max(0,Math.floor((Date.now()-new Date(at).getTime())/86400000));const guide=freezerGuide(componentId);
 if(!guide)return {ageDays,guide:null,status:"recorded"};
 if(ageDays>=guide.lowerDays)return {ageDays,guide,status:"past-lower-guide"};
 if(ageDays>=Math.round(guide.lowerDays*.75))return {ageDays,guide,status:"approaching-guide"};
 return {ageDays,guide,status:"recorded"};
}
