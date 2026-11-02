create extension if not exists pgcrypto;

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  code text not null unique,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.round_groups (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_number integer not null check (group_number between 1 and 5),
  expected_students integer not null default 0 check (expected_students >= 0),
  created_at timestamptz not null default now(),
  unique (round_id, group_number)
);

create table if not exists public.student_memberships (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_number integer not null check (group_number between 1 and 5),
  user_id uuid not null,
  initials text not null,
  created_at timestamptz not null default now(),
  unique (round_id, group_number, user_id)
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_number integer not null check (group_number between 1 and 5),
  user_id uuid not null,
  initials text not null,
  aspect_id integer not null check (aspect_id between 1 and 9),
  current_choice text not null check (current_choice in ('A','B','C')),
  desired_choice text not null check (desired_choice in ('A','B','C')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, group_number, user_id, aspect_id)
);

create table if not exists public.group_decisions (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_number integer not null check (group_number between 1 and 5),
  aspect_id integer not null check (aspect_id between 1 and 9),
  selected_choice text not null check (selected_choice in ('A','B','C')),
  what_text text not null,
  how_text text not null,
  where_text text not null,
  when_text text not null,
  scrum_owner text not null,
  who_text text not null,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  unique (round_id, group_number, aspect_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_responses_updated_at on public.responses;
create trigger trg_responses_updated_at
before update on public.responses
for each row execute function public.set_updated_at();

drop trigger if exists trg_group_decisions_updated_at on public.group_decisions;
create trigger trg_group_decisions_updated_at
before update on public.group_decisions
for each row execute function public.set_updated_at();

alter table public.rounds enable row level security;
alter table public.round_groups enable row level security;
alter table public.student_memberships enable row level security;
alter table public.responses enable row level security;
alter table public.group_decisions enable row level security;

drop policy if exists "auth users can read rounds" on public.rounds;
create policy "auth users can read rounds" on public.rounds
for select to authenticated using (true);

drop policy if exists "auth users can insert rounds" on public.rounds;
create policy "auth users can insert rounds" on public.rounds
for insert to authenticated with check (true);

drop policy if exists "auth users can read round groups" on public.round_groups;
create policy "auth users can read round groups" on public.round_groups
for select to authenticated using (true);

drop policy if exists "auth users can insert round groups" on public.round_groups;
create policy "auth users can insert round groups" on public.round_groups
for insert to authenticated with check (true);

drop policy if exists "auth users can read memberships" on public.student_memberships;
create policy "auth users can read memberships" on public.student_memberships
for select to authenticated using (true);

drop policy if exists "auth users can insert memberships" on public.student_memberships;
create policy "auth users can insert memberships" on public.student_memberships
for insert to authenticated with check (true);

drop policy if exists "auth users can update memberships" on public.student_memberships;
create policy "auth users can update memberships" on public.student_memberships
for update to authenticated using (true) with check (true);

drop policy if exists "auth users can read responses" on public.responses;
create policy "auth users can read responses" on public.responses
for select to authenticated using (true);

drop policy if exists "auth users can insert responses" on public.responses;
create policy "auth users can insert responses" on public.responses
for insert to authenticated with check (true);

drop policy if exists "auth users can update responses" on public.responses;
create policy "auth users can update responses" on public.responses
for update to authenticated using (true) with check (true);

drop policy if exists "auth users can read decisions" on public.group_decisions;
create policy "auth users can read decisions" on public.group_decisions
for select to authenticated using (true);

drop policy if exists "auth users can insert decisions" on public.group_decisions;
create policy "auth users can insert decisions" on public.group_decisions
for insert to authenticated with check (true);

drop policy if exists "auth users can update decisions" on public.group_decisions;
create policy "auth users can update decisions" on public.group_decisions
for update to authenticated using (true) with check (true);
