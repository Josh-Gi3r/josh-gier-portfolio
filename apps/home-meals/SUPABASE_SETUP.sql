-- Home Meals private Josh + G household state.
-- Run once in the Supabase SQL editor (or via the Supabase ChatGPT plugin).

create table if not exists public.home_meals_household_state (
  id text primary key,
  version bigint not null default 1,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.home_meals_household_state enable row level security;

-- The app accesses this table only from its server using the Supabase service-role key.
-- No public/anon policies are intentionally created.

create index if not exists home_meals_household_state_updated_at_idx
  on public.home_meals_household_state (updated_at desc);

-- Optional private media bucket for household meal/cooking images.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('home-meals-private','home-meals-private',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public=false,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;
