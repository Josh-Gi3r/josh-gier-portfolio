export type FeedbackKind="tap"|"change"|"success";
let lastAt=0;let lastPriority=0;
const priority:Record<FeedbackKind,number>={tap:1,change:2,success:3};
export function feedback(kind:FeedbackKind="tap"){
 if(typeof window==="undefined"||!("vibrate" in navigator))return;
 const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;if(reduce)return;
 const now=Date.now(),p=priority[kind];
 // A richer state-change/success pattern may replace a tap from the same click;
 // a generic tap never duplicates a stronger pattern that just fired.
 if(now-lastAt<70&&p<=lastPriority)return;
 lastAt=now;lastPriority=p;setTimeout(()=>{if(Date.now()-lastAt>80)lastPriority=0},90);
 try{navigator.vibrate(kind==="success"?[18,45,18]:kind==="change"?20:10)}catch{}
}

export function bindGlobalHaptics(){
 if(typeof document==="undefined")return()=>{};
 const onClick=(event:MouseEvent)=>{const target=event.target as Element|null;const el=target?.closest?.("button,a,label,input[type='checkbox']") as HTMLElement|null;if(!el||el.hasAttribute("disabled")||el.dataset.haptic==="off")return;setTimeout(()=>feedback("tap"),0)};
 document.addEventListener("click",onClick);
 return()=>document.removeEventListener("click",onClick);
}
