export type FeedbackKind="tap"|"change"|"success";
export function feedback(kind:FeedbackKind="tap"){
 if(typeof window==="undefined"||!("vibrate" in navigator))return;
 const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
 if(reduce)return;
 try{navigator.vibrate(kind==="success"?[18,45,18]:kind==="change"?20:10)}catch{}
}
