-- Nowy Styl / rezerwacje
-- Uruchom ten plik w Supabase SQL Editor.

create extension if not exists btree_gist;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_name text not null,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) between 5 and 30),
  customer_email text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  constraint appointments_valid_time check (end_at > start_at)
);

alter table public.appointments enable row level security;

-- Rezerwacje zapisujemy wyłącznie przez serwer z kluczem secret/service.
-- Publiczny klient nie dostaje bezpośredniego dostępu do tabeli.
revoke all on table public.appointments from anon, authenticated;

alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));

create index if not exists appointments_start_at_idx on public.appointments(start_at);
create index if not exists appointments_status_idx on public.appointments(status);
