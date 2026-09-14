const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(text,re,msg)=>{if(!re.test(text))failures.push(msg)};
const mustNot=(text,re,msg)=>{if(re.test(text))failures.push(msg)};
const household=read('app/api/household/route.ts'),session=read('app/api/household/session/route.ts'),server=read('lib/server-household.ts'),rate=read('lib/server-rate-limit.ts'),config=read('next.config.ts');

must(household,/validV12Payload/,'household writes are not runtime-validated as v12 state');
must(household,/encoded\.length>1_500_000/,'household payload size cap is missing');
must(household,/result==="conflict"[\s\S]*?409/,'optimistic-version conflict is not surfaced as HTTP 409');
must(household,/error:"unauthorized"[\s\S]*?401/,'unauthenticated household access is not explicitly rejected');
must(household,/sync_state_invalid/,'corrupt stored household state is not rejected explicitly');
mustNot(household,/error:"sync_(?:read|write)_failed",detail:/,'database failure details must not be returned to the browser');
must(session,/consumeRateLimit\(limiterKey,10,15\*60\*1000\)/,'household-code brute-force limiter is missing');
must(session,/error:"too_many_attempts"[\s\S]*?429/,'rate-limited household-code attempts are not rejected as HTTP 429');
must(session,/Retry-After/,'rate-limit response does not tell the client when retry is safe');
must(session,/clearRateLimit\(limiterKey\)/,'successful household connection does not clear its failed-attempt bucket');
must(rate,/x-forwarded-for/,'rate limiter does not derive a client key from proxy-forwarded address data');
must(session,/httpOnly:true/,'session cookie is not httpOnly');
must(session,/secure:true/,'session cookie is not Secure');
must(session,/sameSite:"lax"/,'session cookie is not SameSite=Lax');
must(server,/timingSafeEqual/,'household secret comparison is not timing-safe');
must(server,/where id=\$\{HOUSEHOLD_ID\} and version=\$\{baseVersion\}/,'database write is not optimistic-version guarded');
must(config,/poweredByHeader:\s*false/,'framework identification header is not disabled');
for(const header of ['X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Permissions-Policy','Cross-Origin-Opener-Policy','Strict-Transport-Security'])if(!config.includes(header))failures.push(`security header missing: ${header}`);

if(failures.length){console.error(`\nHome Meals household-API audit FAILED (${failures.length})`);for(const failure of failures)console.error(` - ${failure}`);process.exitCode=1}else console.log('\nHome Meals household-API audit passed · private session · rate-limited household code · v12 envelope validation · payload cap · optimistic conflict · generic failure responses · timing-safe secret handling · browser security headers');
