const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(text,re,msg)=>{if(!re.test(text))failures.push(msg)};
const sync=read('components/HouseholdSyncV12.tsx');

must(sync,/remote\.version===0\|\|!remote\.payload[\s\S]*?pushLocal\(0,current\)[\s\S]*?saved==="conflict"[\s\S]*?fetchRemote\(\)[\s\S]*?setConflict\(fresh\)/,'first-write race must fetch the winning remote before entering conflict UI');
must(sync,/localChanged&&remoteChanged[\s\S]*?setConflict\(remote\)[\s\S]*?setState\("conflict"\)/,'concurrent local/remote change must surface an explicit conflict');
must(sync,/PENDING_KEY[\s\S]*?if\(cooking\)[\s\S]*?localStorage\.setItem\(PENDING_KEY/,'remote update must be deferred during active cooking');
must(sync,/if\(!res\.ok\)throw new Error\("sync_write"\)/,'failed writes must not be treated as successful');
must(sync,/Your local Home Meals still works and will retry automatically\./,'sync failure must preserve local usability and explain retry');

if(failures.length){console.error(`\nHome Meals sync-recovery audit FAILED (${failures.length})`);for(const failure of failures)console.error(` - ${failure}`);process.exitCode=1}else console.log('\nHome Meals sync-recovery audit passed · initial-write race · concurrent conflict · active-cooking deferral · failed-write recovery guarded');
