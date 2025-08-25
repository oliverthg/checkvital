create extension if not exists "uuid-ossp";

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('exame','receita','vacina','outro')),
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy if not exists "docs_select_own" on public.documents
for select using (auth.uid() = user_id);

create policy if not exists "docs_modify_own" on public.documents
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
