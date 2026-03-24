-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create contracts table
create table if not exists public.contracts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  analysis jsonb not null default '{}',
  user_id uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.contracts enable row level security;

-- Allow anonymous/public insert and select for demo (replace with auth policies for production)
create policy "Allow public insert" on public.contracts
  for insert with check (true);

create policy "Allow public select" on public.contracts
  for select using (true);

-- Create storage bucket for contract files
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Allow public upload" on storage.objects
  for insert with check (bucket_id = 'contracts');

create policy "Allow public read" on storage.objects
  for select using (bucket_id = 'contracts');
