create table if not exists public.group_deals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(user_id) on delete cascade,
  product_name text not null,
  description text not null,
  image_file_name text,
  image_url text,
  normal_price integer not null check (normal_price > 0),
  kongsi_price integer not null check (kongsi_price > 0 and kongsi_price < normal_price),
  target_participants integer not null check (target_participants > 0),
  current_participants integer not null default 0 check (current_participants >= 0),
  deadline text not null,
  category text not null check (category in ('Kuliner', 'Kerajinan', 'Fashion', 'Lainnya')),
  fulfillment text not null check (fulfillment in ('pickup', 'delivery', 'pickup-delivery')),
  pickup_location text,
  pickup_maps_url text,
  pickup_hours text,
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  status text not null default 'berlangsung' check (status in ('berlangsung', 'sukses', 'selesai', 'tidak-berhasil')),
  created_at timestamptz not null default now()
);

-- If group_deals was created with the old auth.users foreign key, move it
-- to the application's public.users owner table.
alter table public.group_deals
  drop constraint if exists group_deals_owner_id_fkey;

alter table public.group_deals
  add constraint group_deals_owner_id_fkey
  foreign key (owner_id) references public.users(user_id) on delete cascade;

alter table public.group_deals
  add column if not exists image_url text;

alter table public.group_deals
  add column if not exists pickup_maps_url text;

alter table public.group_deals enable row level security;

create index if not exists group_deals_owner_status_idx
  on public.group_deals (owner_id, status, created_at desc);

drop policy if exists "UMKM can view own group deals" on public.group_deals;
create policy "UMKM can view own group deals"
  on public.group_deals for select
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Customers can view active group deals" on public.group_deals;
create policy "Customers can view active group deals"
  on public.group_deals for select
  to anon, authenticated
  using (status = 'berlangsung');

drop policy if exists "UMKM can create own group deals" on public.group_deals;
create policy "UMKM can create own group deals"
  on public.group_deals for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "UMKM can update own group deals" on public.group_deals;
create policy "UMKM can update own group deals"
  on public.group_deals for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
