const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error(`Home Meals product-safety V16 audit failed: ${msg}`)};

const status=read('components/HouseholdStatusCard.tsx');
const state=read('components/HouseholdState.tsx');
const sync=read('components/HouseholdSyncV12.tsx');

must(!status.includes('resetDemo('),'More / Our home must not expose the shared reset helper as a phone-only action');
must(!status.includes('Start the kitchen over'),'destructive Kitchen reset returned to the normal UI');
must(!status.includes('Clears the week, the kitchen counts, ratings and notes on this phone'),'misleading phone-only destructive reset copy returned');
must(state.includes('const resetDemo=()=>{v.resetV12()'),'underlying reset helper changed unexpectedly; redesign shared reset deliberately before exposing it again');
must(sync.includes('localChanged')&&sync.includes('pushLocal'),'sync semantics changed; re-review reset propagation before exposing any reset UI');

console.log('Home Meals product-safety V16 audit passed · no misleading user-accessible shared reset · reset helper remains internal pending deliberate shared-reset design');
