const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
for(const rel of ['app/api/ask-home/route.ts','app/api/vision/route.ts','app/api/live/route.ts']){
 const text=fs.readFileSync(path.join(root,rel),'utf8');
 if(!/SESSION_COOKIE/.test(text)||!/verifySessionToken/.test(text)||!/syncConfigured/.test(text))failures.push(`${rel}: private AI POST is not tied to the household session`);
 if(!/error:\s*["']unauthorized["']/.test(text)||!/status|401/.test(text))failures.push(`${rel}: unauthorized private AI request is not explicitly rejected`);
}
if(failures.length){console.error(`\nHome Meals private-AI audit FAILED (${failures.length})`);for(const x of failures)console.error(` - ${x}`);process.exitCode=1}else console.log('\nHome Meals private-AI audit passed · Ask Home, Vision and Live POSTs require the private household session in production');
