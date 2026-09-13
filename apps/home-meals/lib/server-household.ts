import {createHmac,timingSafeEqual} from "node:crypto";

export const HOUSEHOLD_ID="josh-g";
export const SESSION_COOKIE="hm_household_session";
const SESSION_MAX_AGE_SECONDS=60*60*24*45;

function env(name:string){const value=process.env[name]?.trim();return value||null}
export function syncConfigured(){return !!(env("SUPABASE_URL")&&env("SUPABASE_SERVICE_ROLE_KEY")&&env("HOME_MEALS_SYNC_SECRET"))}

function secret(){return env("HOME_MEALS_SYNC_SECRET")}
function hmac(value:string){const key=secret();if(!key)return "";return createHmac("sha256",key).update(value).digest("base64url")}
function safeEqual(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb)}

export function createSessionToken(){const issued=Math.floor(Date.now()/1000).toString();return `${issued}.${hmac(`home-meals:${issued}`)}`}
export function verifySessionToken(token:string|undefined|null){
 if(!token||!secret())return false;
 const [issued,sig]=token.split(".");if(!issued||!sig)return false;
 const timestamp=Number(issued);if(!Number.isFinite(timestamp))return false;
 const age=Math.floor(Date.now()/1000)-timestamp;if(age<0||age>SESSION_MAX_AGE_SECONDS)return false;
 return safeEqual(sig,hmac(`home-meals:${issued}`));
}
export function verifyHouseholdCode(code:string){
 const expected=secret();if(!expected)return false;
 return safeEqual(hmac(`code:${code}`),hmac(`code:${expected}`));
}
export function sessionMaxAge(){return SESSION_MAX_AGE_SECONDS}

function supabase(){const url=env("SUPABASE_URL"),key=env("SUPABASE_SERVICE_ROLE_KEY");if(!url||!key)return null;return {url:url.replace(/\/$/,""),key}}
function headers(extra:Record<string,string>={}){const cfg=supabase();if(!cfg)throw new Error("SYNC_NOT_CONFIGURED");return {apikey:cfg.key,Authorization:`Bearer ${cfg.key}`,"Content-Type":"application/json",...extra}}
export type StoredHousehold={id:string;version:number;payload:Record<string,unknown>;updated_at:string};

export async function readHousehold():Promise<StoredHousehold|null>{
 const cfg=supabase();if(!cfg)throw new Error("SYNC_NOT_CONFIGURED");
 const res=await fetch(`${cfg.url}/rest/v1/home_meals_household_state?id=eq.${encodeURIComponent(HOUSEHOLD_ID)}&select=id,version,payload,updated_at&limit=1`,{headers:headers(),cache:"no-store"});
 if(!res.ok)throw new Error(`SYNC_READ_${res.status}`);
 const rows=await res.json() as StoredHousehold[];return rows[0]??null;
}

export async function writeHousehold(payload:Record<string,unknown>,baseVersion:number):Promise<StoredHousehold|"conflict">{
 const cfg=supabase();if(!cfg)throw new Error("SYNC_NOT_CONFIGURED");
 const now=new Date().toISOString();
 if(baseVersion<=0){
  const res=await fetch(`${cfg.url}/rest/v1/home_meals_household_state`,{method:"POST",headers:headers({Prefer:"return=representation,resolution=ignore-duplicates"}),body:JSON.stringify({id:HOUSEHOLD_ID,version:1,payload,updated_at:now}),cache:"no-store"});
  if(!res.ok)throw new Error(`SYNC_CREATE_${res.status}`);
  const rows=await res.json() as StoredHousehold[];
  if(rows[0])return rows[0];
  return "conflict";
 }
 const nextVersion=baseVersion+1;
 const res=await fetch(`${cfg.url}/rest/v1/home_meals_household_state?id=eq.${encodeURIComponent(HOUSEHOLD_ID)}&version=eq.${baseVersion}`,{method:"PATCH",headers:headers({Prefer:"return=representation"}),body:JSON.stringify({version:nextVersion,payload,updated_at:now}),cache:"no-store"});
 if(!res.ok)throw new Error(`SYNC_WRITE_${res.status}`);
 const rows=await res.json() as StoredHousehold[];return rows[0]??"conflict";
}
