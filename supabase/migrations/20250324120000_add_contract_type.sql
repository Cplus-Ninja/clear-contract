-- Business category for filtering and reporting (separate from MIME file_type)
alter table public.contracts
  add column if not exists contract_type text not null default 'general';

comment on column public.contracts.contract_type is 'User-selected or inferred contract category (e.g. commercial_lease, nda).';
