// Recipe steps are grouped into four phases so the overview bar, the step badges and
// cooking-mode dots share one colour language: Prep → Cook → Finish → Plate.
export type Phase={name:"Prep"|"Cook"|"Finish"|"Plate";gradient:string;bar:string};
export const phases:Phase[]=[
 {name:"Prep",gradient:"linear-gradient(135deg,#6fd39a,#2fae6e)",bar:"linear-gradient(90deg,#6fd39a,#2fae6e)"},
 {name:"Cook",gradient:"linear-gradient(135deg,#ffb48f,#ff8a5c)",bar:"linear-gradient(90deg,#ffb48f,#ff8a5c)"},
 {name:"Finish",gradient:"linear-gradient(135deg,#a8e6c3,#4cc487)",bar:"linear-gradient(90deg,#a8e6c3,#4cc487)"},
 {name:"Plate",gradient:"linear-gradient(135deg,#a8e6c3,#6fd39a)",bar:"linear-gradient(90deg,#a8e6c3,#6fd39a)"}
];
export function phaseIndex(i:number,total:number){
 if(total<=1)return 1;
 if(i===total-1)return 3;
 const prepCount=Math.max(1,Math.round(total*.25));
 if(i<prepCount)return 0;
 const finishStart=Math.max(prepCount+1,total-1-Math.max(1,Math.round(total*.2)));
 return i>=finishStart?2:1;
}
export const phaseFor=(i:number,total:number)=>phases[phaseIndex(i,total)];
export function phaseCounts(total:number){const out=[0,0,0,0];for(let i=0;i<total;i++)out[phaseIndex(i,total)]++;return out}
export function stepMinutes(s:string){const m=s.match(/(\d+)(?:[–-](\d+))?\s*(?:minutes?|mins?)/i);return m?Number(m[1]):0}
export function stepSeconds(s:string){const m=s.match(/(\d+)\s*(?:seconds?|secs?)/i);return m?Number(m[1]):0}
// The visual cue hidden inside a step: "…until the sauce clings."
export function stepCue(s:string){const m=s.match(/until ([^.;]+)/i);return m?`Look for: ${m[1].trim()}.`:null}
