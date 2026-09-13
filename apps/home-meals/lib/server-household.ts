import {createHmac,timingSafeEqual} from "node:crypto";
import postgres from "postgres";

export const HOUSEHOLD_ID="josh-g";
export const SESSION_COOKIE="hm_household_session";
const SESSION_MAX_AGE_SECONDS=60*60*24*45;

function env(name:string){const value=process.env[name]?.trim();return value||null}
export function syncConfigured(){return !!(env("DATABASE_URL")&&env("HOME_MEALS_SYNC_SECRET"))}
function secret(){return env("HOME_MEALS_SYNC_SECRET")}
function householdCode(){return env("HOME_MEALS_HOUSEHOLD_CODE")||secret()}
function hmac(value:string){const key=secret();if(!key)return "";return createHmac("sha256",key).update(value).digest("base64url")}
function safeEqual(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb)}
export function createSessionToken(){const issued=Math.floor(Date.now()/1000).toString();return `${issued}.${hmac(`home-meals:${issued}`)}`}
export function verifySessionToken(token:string|undefined|null){if(!token||!secret())return false;const [issued,sig]=token.split(".");if(!issued||!sig)return false;const timestamp=Number(issued);if(!Number.isFinite(timestamp))return false;const age=Math.floor(Date.now()/1000)-timestamp;if(age<0||age>SESSION_MAX_AGE_SECONDS)return false;return safeEqual(sig,hmac(`home-meals:${issued}`))}
export function verifyHouseholdCode(code:string){const expected=householdCode();if(!expected||!secret())return false;return safeEqual(hmac(`code:${code}`),hmac(`code:${expected}`))}
export function sessionMaxAge(){return SESSION_MAX_AGE_SECONDS}

let client:ReturnType<typeof postgres>|null=null;
let initialized=false;
function sql(){const url=env("DATABASE_URL");if(!url)throw new Error("SYNC_NOT_CONFIGURED");if(!client)client=postgres(url,{max:3,idle_timeout:20,connect_timeout:10,ssl:url.includes("railway.internal")?false:"require"});return client}
async function ensureSchema(){if(initialized)return;const db=sql();await db`create table if not exists home_meals_household_state (id text primary key, version bigint not null default 1, payload jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now())`;await db`create index if not exists home_meals_household_state_updated_at_idx on home_meals_household_state (updated_at desc)`;initialized=true}
export type StoredHousehold={id:string;version:number;payload:Record<string,unknown>;updated_at:string};

export async function readHousehold():Promise<StoredHousehold|null>{await ensureSchema();const rows=await sql()<StoredHousehold[]>`select id,version::int as version,payload,updated_at::text as updated_at from home_meals_household_state where id=${HOUSEHOLD_ID} limit 1`;return rows[0]??null}
export async function writeHousehold(payload:Record<string,unknown>,baseVersion:number):Promise<StoredHousehold|"conflict">{await ensureSchema();const db=sql();const json=payload as any;if(baseVersion<=0){const rows=await db<StoredHousehold[]>`insert into home_meals_household_state (id,version,payload,updated_at) values (${HOUSEHOLD_ID},1,${db.json(json)},now()) on conflict (id) do nothing returning id,version::int as version,payload,updated_at::text as updated_at`;return rows[0]??"conflict"}const rows=await db<StoredHousehold[]>`update home_meals_household_state set version=${baseVersion+1},payload=${db.json(json)},updated_at=now() where id=${HOUSEHOLD_ID} and version=${baseVersion} returning id,version::int as version,payload,updated_at::text as updated_at`;return rows[0]??"conflict"}
