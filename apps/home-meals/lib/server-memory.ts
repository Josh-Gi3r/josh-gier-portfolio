import {randomUUID} from "node:crypto";
import postgres from "postgres";
import {HOUSEHOLD_ID} from "./server-household";
import type {HouseholdPerson,MemoryKind} from "./josh-conversation";

function env(name:string){const value=process.env[name]?.trim();return value||null}
let client:ReturnType<typeof postgres>|null=null;
let initialized=false;
function db(){const url=env("DATABASE_URL");if(!url)throw new Error("MEMORY_NOT_CONFIGURED");if(!client)client=postgres(url,{max:2,idle_timeout:20,connect_timeout:10,ssl:url.includes("railway.internal")?false:"require"});return client}

export function memoryConfigured(){return !!env("DATABASE_URL")}

async function ensureSchema(){
 if(initialized)return;
 const sql=db();
 await sql`create table if not exists home_meals_conversations (
   id text primary key,
   household_id text not null,
   person text not null,
   title text,
   summary text,
   created_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
 )`;
 await sql`create index if not exists home_meals_conversations_household_updated_idx on home_meals_conversations (household_id,updated_at desc)`;
 await sql`create table if not exists home_meals_conversation_messages (
   id bigserial primary key,
   conversation_id text not null references home_meals_conversations(id) on delete cascade,
   role text not null,
   content text not null,
   structured jsonb,
   created_at timestamptz not null default now()
 )`;
 await sql`create index if not exists home_meals_conversation_messages_conversation_idx on home_meals_conversation_messages (conversation_id,id desc)`;
 await sql`create table if not exists home_meals_memories (
   id text primary key,
   household_id text not null,
   subject text not null,
   kind text not null,
   text text not null,
   source_person text,
   status text not null default 'confirmed',
   provenance jsonb not null default '{}'::jsonb,
   created_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
 )`;
 await sql`create index if not exists home_meals_memories_household_updated_idx on home_meals_memories (household_id,status,updated_at desc)`;
 await sql`create table if not exists home_meals_recipe_drafts (
   id text primary key,
   household_id text not null,
   title text not null,
   status text not null default 'draft',
   payload jsonb not null default '{}'::jsonb,
   provenance jsonb not null default '{}'::jsonb,
   created_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
 )`;
 await sql`create index if not exists home_meals_recipe_drafts_household_updated_idx on home_meals_recipe_drafts (household_id,updated_at desc)`;
 await sql`create table if not exists home_meals_recipe_images (
   id text primary key,
   household_id text not null,
   draft_id text not null references home_meals_recipe_drafts(id) on delete cascade,
   mime_type text not null,
   image_bytes bytea not null,
   prompt text not null,
   model text not null,
   quality text not null,
   width integer not null,
   height integer not null,
   look text,
   selected boolean not null default false,
   created_at timestamptz not null default now()
 )`;
 await sql`create index if not exists home_meals_recipe_images_draft_created_idx on home_meals_recipe_images (household_id,draft_id,created_at desc)`;
 await sql`create unique index if not exists home_meals_recipe_images_one_selected_idx on home_meals_recipe_images (household_id,draft_id) where selected`;
 initialized=true;
}

export type StoredConversation={id:string;person:HouseholdPerson;title:string|null;summary:string|null;created_at:string;updated_at:string};
export type StoredMessage={id:number;role:"user"|"assistant";content:string;structured:Record<string,unknown>|null;created_at:string};
export type StoredMemory={id:string;subject:string;kind:MemoryKind;text:string;source_person:HouseholdPerson|null;status:"suggested"|"confirmed"|"rejected";provenance:Record<string,unknown>;created_at:string;updated_at:string};
export type StoredDraft={id:string;title:string;status:"idea"|"draft"|"cooked"|"revised"|"household_approved";payload:Record<string,unknown>;provenance:Record<string,unknown>;created_at:string;updated_at:string};
export type StoredRecipeImage={id:string;draft_id:string;mime_type:string;prompt:string;model:string;quality:string;width:number;height:number;look:string|null;selected:boolean;created_at:string};
export type StoredRecipeImageBytes=StoredRecipeImage&{image_bytes:Buffer};

export async function ensureConversation(person:HouseholdPerson,conversationId?:string|null){
 await ensureSchema();const sql=db();
 if(conversationId){const rows=await sql<StoredConversation[]>`select id,person,title,summary,created_at::text as created_at,updated_at::text as updated_at from home_meals_conversations where id=${conversationId} and household_id=${HOUSEHOLD_ID} and person=${person} limit 1`;if(rows[0])return rows[0]}
 const id=randomUUID();const rows=await sql<StoredConversation[]>`insert into home_meals_conversations (id,household_id,person,title,summary) values (${id},${HOUSEHOLD_ID},${person},null,null) returning id,person,title,summary,created_at::text as created_at,updated_at::text as updated_at`;return rows[0];
}

export async function latestConversation(person:HouseholdPerson){await ensureSchema();const sql=db();const rows=await sql<StoredConversation[]>`select id,person,title,summary,created_at::text as created_at,updated_at::text as updated_at from home_meals_conversations where household_id=${HOUSEHOLD_ID} and person=${person} order by updated_at desc limit 1`;return rows[0]??null}
export async function conversationMessages(conversationId:string,limit=40){await ensureSchema();const sql=db();const rows=await sql<StoredMessage[]>`select id::int as id,role,content,structured,created_at::text as created_at from home_meals_conversation_messages where conversation_id=${conversationId} order by id desc limit ${Math.max(1,Math.min(100,limit))}`;return rows.reverse()}
export async function appendConversationMessage(conversationId:string,role:"user"|"assistant",content:string,structured?:Record<string,unknown>|null){await ensureSchema();const sql=db();await sql`insert into home_meals_conversation_messages (conversation_id,role,content,structured) values (${conversationId},${role},${content.slice(0,12000)},${structured?sql.json(structured as any):null})`;await sql`update home_meals_conversations set updated_at=now() where id=${conversationId} and household_id=${HOUSEHOLD_ID}`}
export async function updateConversationSummary(conversationId:string,summary:string){await ensureSchema();const sql=db();await sql`update home_meals_conversations set summary=${summary.slice(0,4000)},updated_at=now() where id=${conversationId} and household_id=${HOUSEHOLD_ID}`}

function words(value:string){return new Set(value.toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/).filter(x=>x.length>2))}
export async function relevantMemories(query:string,limit=12){await ensureSchema();const sql=db();const rows=await sql<StoredMemory[]>`select id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_memories where household_id=${HOUSEHOLD_ID} and status='confirmed' order by updated_at desc limit 80`;const q=words(query);return rows.map((m,i)=>{const hay=words(`${m.subject} ${m.text}`);let score=0;for(const w of q)if(hay.has(w))score+=3;score+=Math.max(0,1-i/100);return{m,score}}).sort((a,b)=>b.score-a.score).slice(0,Math.max(1,Math.min(30,limit))).map(x=>x.m)}
export async function listMemories(){await ensureSchema();const sql=db();return sql<StoredMemory[]>`select id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_memories where household_id=${HOUSEHOLD_ID} and status='confirmed' order by updated_at desc limit 100`}
export async function saveMemory(input:{subject:string;kind:MemoryKind;text:string;sourcePerson:HouseholdPerson|null;status?:"suggested"|"confirmed";provenance?:Record<string,unknown>}){await ensureSchema();const sql=db(),subject=input.subject.slice(0,140),text=input.text.slice(0,800),status=input.status??"confirmed",personScoped=input.kind==="preference";const existing=personScoped?await sql<StoredMemory[]>`select id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_memories where household_id=${HOUSEHOLD_ID} and kind=${input.kind} and lower(subject)=lower(${subject}) and source_person is not distinct from ${input.sourcePerson} and status<>'rejected' order by updated_at desc limit 1`:await sql<StoredMemory[]>`select id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_memories where household_id=${HOUSEHOLD_ID} and kind=${input.kind} and lower(subject)=lower(${subject}) and status<>'rejected' order by updated_at desc limit 1`;if(existing[0]){const rows=await sql<StoredMemory[]>`update home_meals_memories set text=${text},source_person=${input.sourcePerson},status=${status},provenance=${sql.json((input.provenance??{}) as any)},updated_at=now() where id=${existing[0].id} and household_id=${HOUSEHOLD_ID} returning id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at`;return rows[0]}const id=randomUUID();const rows=await sql<StoredMemory[]>`insert into home_meals_memories (id,household_id,subject,kind,text,source_person,status,provenance) values (${id},${HOUSEHOLD_ID},${subject},${input.kind},${text},${input.sourcePerson},${status},${sql.json((input.provenance??{}) as any)}) returning id,subject,kind,text,source_person,status,provenance,created_at::text as created_at,updated_at::text as updated_at`;return rows[0]}
export async function deleteMemory(id:string){await ensureSchema();const sql=db();const rows=await sql`delete from home_meals_memories where id=${id} and household_id=${HOUSEHOLD_ID} returning id`;return rows.length>0}

export async function saveDraft(input:{title:string;status?:StoredDraft["status"];payload:Record<string,unknown>;provenance?:Record<string,unknown>}){await ensureSchema();const sql=db(),id=randomUUID();const rows=await sql<StoredDraft[]>`insert into home_meals_recipe_drafts (id,household_id,title,status,payload,provenance) values (${id},${HOUSEHOLD_ID},${input.title.slice(0,180)},${input.status??"draft"},${sql.json(input.payload as any)},${sql.json((input.provenance??{}) as any)}) returning id,title,status,payload,provenance,created_at::text as created_at,updated_at::text as updated_at`;return rows[0]}
export async function listDrafts(){await ensureSchema();const sql=db();return sql<StoredDraft[]>`select id,title,status,payload,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_recipe_drafts where household_id=${HOUSEHOLD_ID} order by updated_at desc limit 50`}
export async function getDraft(id:string){await ensureSchema();const sql=db();const rows=await sql<StoredDraft[]>`select id,title,status,payload,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_recipe_drafts where id=${id} and household_id=${HOUSEHOLD_ID} limit 1`;return rows[0]??null}
export async function updateDraft(id:string,input:{status?:StoredDraft["status"];payload?:Record<string,unknown>}){await ensureSchema();const sql=db();const existing=(await sql<StoredDraft[]>`select id,title,status,payload,provenance,created_at::text as created_at,updated_at::text as updated_at from home_meals_recipe_drafts where id=${id} and household_id=${HOUSEHOLD_ID} limit 1`)[0];if(!existing)return null;const status=input.status??existing.status,payload=input.payload??existing.payload;const rows=await sql<StoredDraft[]>`update home_meals_recipe_drafts set status=${status},payload=${sql.json(payload as any)},updated_at=now() where id=${id} and household_id=${HOUSEHOLD_ID} returning id,title,status,payload,provenance,created_at::text as created_at,updated_at::text as updated_at`;return rows[0]??null}

export async function listRecipeImages(draftId:string){await ensureSchema();const sql=db();return sql<StoredRecipeImage[]>`select id,draft_id,mime_type,prompt,model,quality,width,height,look,selected,created_at::text as created_at from home_meals_recipe_images where household_id=${HOUSEHOLD_ID} and draft_id=${draftId} order by created_at desc limit 20`}
export async function selectedRecipeImage(draftId:string){await ensureSchema();const sql=db();const rows=await sql<StoredRecipeImage[]>`select id,draft_id,mime_type,prompt,model,quality,width,height,look,selected,created_at::text as created_at from home_meals_recipe_images where household_id=${HOUSEHOLD_ID} and draft_id=${draftId} and selected=true order by created_at desc limit 1`;return rows[0]??null}
export async function getRecipeImage(id:string){await ensureSchema();const sql=db();const rows=await sql<StoredRecipeImageBytes[]>`select id,draft_id,mime_type,image_bytes,prompt,model,quality,width,height,look,selected,created_at::text as created_at from home_meals_recipe_images where household_id=${HOUSEHOLD_ID} and id=${id} limit 1`;return rows[0]??null}
export async function saveRecipeImage(input:{draftId:string;mimeType:string;bytes:Buffer;prompt:string;model:string;quality:string;width:number;height:number;look?:string|null;selected:boolean}){await ensureSchema();const sql=db(),id=randomUUID();return sql.begin(async tx=>{if(input.selected)await tx`update home_meals_recipe_images set selected=false where household_id=${HOUSEHOLD_ID} and draft_id=${input.draftId} and selected=true`;const rows=await tx`insert into home_meals_recipe_images (id,household_id,draft_id,mime_type,image_bytes,prompt,model,quality,width,height,look,selected) values (${id},${HOUSEHOLD_ID},${input.draftId},${input.mimeType},${input.bytes},${input.prompt.slice(0,12000)},${input.model},${input.quality},${input.width},${input.height},${input.look??null},${input.selected}) returning id,draft_id,mime_type,prompt,model,quality,width,height,look,selected,created_at::text as created_at`;return rows[0] as unknown as StoredRecipeImage})}
export async function selectRecipeImage(draftId:string,id:string){await ensureSchema();const sql=db();return sql.begin(async tx=>{const found=await tx`select id from home_meals_recipe_images where household_id=${HOUSEHOLD_ID} and draft_id=${draftId} and id=${id} limit 1`;if(!found[0])return null;await tx`update home_meals_recipe_images set selected=false where household_id=${HOUSEHOLD_ID} and draft_id=${draftId} and selected=true`;const rows=await tx`update home_meals_recipe_images set selected=true where household_id=${HOUSEHOLD_ID} and draft_id=${draftId} and id=${id} returning id,draft_id,mime_type,prompt,model,quality,width,height,look,selected,created_at::text as created_at`;return rows[0] as unknown as StoredRecipeImage})}

