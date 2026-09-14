const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(text,re,msg)=>{if(!re.test(text))failures.push(msg)};
const assert=(ok,msg)=>{if(!ok)failures.push(msg)};
const between=(text,start,end)=>{const a=text.indexOf(start),b=text.indexOf(end,a+start.length);return a>=0&&b>a?text.slice(a,b):""};
const sync=read('components/HouseholdSyncV12.tsx');
const applyRemote=between(sync,'const applyRemote=','const fetchRemote=');
const syncNow=between(sync,'const syncNow=','useEffect(()=>');
const useThisDevice=between(sync,'const useThisDevice=',';const useHousehold=');
const effect=between(sync,'useEffect(()=>','const connect=');

must(sync,/remote\.version===0\|\|!remote\.payload[\s\S]*?pushLocal\(0,current\)[\s\S]*?saved==="conflict"[\s\S]*?fetchRemote\(\)[\s\S]*?setConflict\(fresh\)/,'first-write race must fetch the winning remote before entering conflict UI');
must(sync,/localChanged&&remoteChanged[\s\S]*?setConflict\(remote\)[\s\S]*?setState\("conflict"\)/,'concurrent local/remote change must surface an explicit conflict');
must(sync,/if\(!res\.ok\)throw new Error\("sync_write"\)/,'failed writes must not be treated as successful');
must(sync,/Your local Home Meals still works and will retry automatically\./,'sync failure must preserve local usability and explain retry');

assert(!!applyRemote,'applyRemote block could not be inspected');
if(applyRemote){
 const deferAt=applyRemote.indexOf('if(cooking)'),metaAt=applyRemote.indexOf('writeMeta('),pendingAt=applyRemote.indexOf('localStorage.setItem(PENDING_KEY');
 assert(deferAt>=0&&pendingAt>deferAt,'applyRemote must store the remote as pending while cooking');
 assert(metaAt>deferAt,'applyRemote must not advance sync metadata before a cooking-session deferral is resolved');
}
assert(!!syncNow,'syncNow block could not be inspected');
if(syncNow){
 const deferAt=syncNow.indexOf('if(cooking&&remoteChanged)'),conflictAt=syncNow.indexOf('if(localChanged&&remoteChanged)');
 assert(deferAt>=0&&conflictAt>deferAt,'remote changes during active cooking must defer before normal conflict/push resolution');
 assert(/localStorage\.setItem\(PENDING_KEY,JSON\.stringify\(remote\)\)[\s\S]*?setState\("deferred"\)/.test(syncNow),'active cooking must retain the remote version for post-cook reconciliation');
}
assert(!!useThisDevice,'conflict-resolution block could not be inspected');
if(useThisDevice)assert(/saved==="conflict"[\s\S]*?fetchRemote\(\)[\s\S]*?setConflict\(fresh\)/.test(useThisDevice),'a repeated keep-this-device conflict must refresh the winning remote/version before another choice');
assert(!/applyRemote\(JSON\.parse\(pending\)/.test(effect),'leaving cooking must not blindly overwrite local cook changes with a stale pending payload');
assert(/!cooking&&localStorage\.getItem\(PENDING_KEY\)[\s\S]*?localStorage\.removeItem\(PENDING_KEY\)[\s\S]*?await syncNow\(\)/.test(effect),'leaving cooking must discard the marker then re-fetch/reconcile against canonical server state');

if(failures.length){console.error(`\nHome Meals sync-recovery audit FAILED (${failures.length})`);for(const failure of failures)console.error(` - ${failure}`);process.exitCode=1}else console.log('\nHome Meals sync-recovery audit passed · initial-write race · concurrent conflict · conflict-safe cooking deferral · repeated-conflict refresh · failed-write recovery guarded');
