# ClearContract Setup Guide

## 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

### Supabase
1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Settings → API** for:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role key — keep this secret!)

### OpenAI
1. Get an API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Add `OPENAI_API_KEY` to `.env.local`
3. **Never** expose this key to the client — it's only used in server actions.

## 2. Supabase Database Setup

Run the migration in your Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- From supabase/migrations/20250323000000_create_contracts.sql
create extension if not exists "uuid-ossp";

create table if not exists public.contracts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  analysis jsonb not null default '{}',
  user_id uuid references auth.users(id) on delete set null
);

alter table public.contracts enable row level security;

create policy "Allow public insert" on public.contracts for insert with check (true);
create policy "Allow public select" on public.contracts for select using (true);

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', true)
on conflict (id) do nothing;

create policy "Allow public upload" on storage.objects for insert with check (bucket_id = 'contracts');
create policy "Allow public read" on storage.objects for select using (bucket_id = 'contracts');
```

## 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Security Notes (Demo)

- The OpenAI API key is only used in server actions and never sent to the client.
- For production, replace the permissive RLS policies with user-scoped policies (e.g. `auth.uid() = user_id`).
- Consider adding Supabase Auth and protecting the dashboard route.
