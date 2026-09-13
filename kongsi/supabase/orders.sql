create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  group_deal_id uuid not null references public.group_deals(id) on delete restrict,
  customer_id uuid not null references public.users(user_id) on delete restrict,
  owner_id uuid not null references public.users(user_id) on delete restrict,
  customer_name text not null,
  product_name text not null,
  image_url text,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price > 0),
  target_participants integer not null check (target_participants > 0),
  participants_after integer not null check (participants_after > 0),
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  pickup_location text,
  pickup_hours text,
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total_amount integer not null check (total_amount > 0),
  payment_method text check (payment_method in ('qris', 'ewallet', 'va', 'kartu')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  status text not null default 'menunggu' check (status in ('menunggu', 'perlu-diproses', 'diproses', 'siap-diambil', 'sedang-dikirim', 'selesai', 'dibatalkan')),
  created_at timestamptz not null default now()
);

-- Upgrade an older orders table in place. CREATE TABLE IF NOT EXISTS does not
-- add columns when public.orders already exists.
alter table public.orders add column if not exists id uuid default gen_random_uuid();
alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists group_deal_id uuid;
alter table public.orders add column if not exists customer_id uuid;
alter table public.orders add column if not exists owner_id uuid;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists product_name text;
alter table public.orders add column if not exists image_url text;
alter table public.orders add column if not exists quantity integer;
alter table public.orders add column if not exists unit_price integer;
alter table public.orders add column if not exists target_participants integer;
alter table public.orders add column if not exists participants_after integer;
alter table public.orders add column if not exists fulfillment text;
alter table public.orders add column if not exists pickup_location text;
alter table public.orders add column if not exists pickup_hours text;
alter table public.orders add column if not exists delivery_fee integer default 0;
alter table public.orders add column if not exists total_amount integer;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists payment_status text default 'pending';
alter table public.orders add column if not exists status text default 'menunggu';
alter table public.orders add column if not exists created_at timestamptz default now();
alter table public.orders add column if not exists participation_id uuid;

-- The canonical participation table is public.participation (singular).
alter table public.orders drop constraint if exists orders_participation_id_fkey;
alter table public.payment drop constraint if exists payment_participation_id_fkey;

-- Align the legacy participation relation with the application's group_deals table.
alter table public.participation drop constraint if exists participation_group_deal_id_fkey;
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.participation'::regclass
      and conname = 'participation_group_deal_id_fkey'
  ) then
    alter table public.participation
      add constraint participation_group_deal_id_fkey
      foreign key (group_deal_id)
      references public.group_deals(id)
      on delete cascade;
  end if;
end
$$;

-- Preserve rows from the temporary plural table before removing it.
do $$
begin
  if to_regclass('public.participations') is not null then
    insert into public.participation (
      participation_id,
      user_id,
      group_deal_id,
      quantity,
      status,
      joined_at
    )
    select
      p.id,
      p.customer_id,
      p.group_deal_id,
      p.quantity,
      'CONFIRMED',
      p.created_at
    from public.participations p
    where not exists (
      select 1 from public.participation existing
      where existing.participation_id = p.id
    )
    on conflict (user_id, group_deal_id) do nothing;

    drop table public.participations;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.orders'::regclass
      and conname = 'orders_participation_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_participation_id_fkey
      foreign key (participation_id)
      references public.participation(participation_id);
  end if;
end
$$;

update public.orders
set id = gen_random_uuid()
where id is null;

alter table public.orders alter column id set default gen_random_uuid();
alter table public.orders alter column id set not null;

-- Legacy schema compatibility: participation_id is nullable until payment settles.
-- Keep the old column and its data, but allow new orders to leave it empty.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'participation_id'
  ) then
    alter table public.orders alter column participation_id drop not null;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'participation_id'
  ) then
    alter table public.orders alter column participation_id drop not null;
  end if;
end
$$;

-- Legacy schema compatibility: the current flow uses fulfillment instead.
-- Keep fulfillment_type and its old data, but allow new orders to leave it empty.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'fulfillment_type'
  ) then
    alter table public.orders alter column fulfillment_type drop not null;
  end if;
end
$$;

-- Replace the legacy fulfillment check with the values used by this flow.
alter table public.orders drop constraint if exists valid_fulfillment;
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.orders'::regclass
      and conname = 'orders_fulfillment_check'
  ) then
    alter table public.orders
      add constraint orders_fulfillment_check
      check (fulfillment is null or fulfillment in ('pickup', 'delivery'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.payment'::regclass
      and conname = 'payment_participation_id_fkey'
  ) then
    alter table public.payment
      add constraint payment_participation_id_fkey
      foreign key (participation_id)
      references public.participation(participation_id);
  end if;
end
$$;

-- Backfill payment records for orders settled before public.payment was wired.
insert into public.payment (
  payment_id,
  participation_id,
  payment_method,
  amount,
  payment_status,
  transaction_reference,
  payment_date
)
select
  gen_random_uuid(),
  o.participation_id,
  o.payment_method,
  o.total_amount,
  'PAID',
  o.order_number,
  o.created_at
from public.orders o
where o.payment_status = 'paid'
  and o.participation_id is not null
  and not exists (
    select 1
    from public.payment p
    where p.participation_id = o.participation_id
  );

-- Reconcile cached participant totals after legacy/failed orders are removed.
update public.group_deals gd
set current_participants = coalesce(confirmed.total_quantity, 0),
    status = case
      when coalesce(confirmed.total_quantity, 0) >= gd.target_participants then 'sukses'
      when gd.status = 'sukses' then 'berlangsung'
      else gd.status
    end
from (
  select
    group_deal_id,
    sum(quantity)::integer as total_quantity
  from public.participation
  where status in ('SECURED', 'CONFIRMED')
  group by group_deal_id
) confirmed
where gd.id = confirmed.group_deal_id;

update public.group_deals gd
set current_participants = 0,
    status = case when gd.status = 'sukses' then 'berlangsung' else gd.status end
where not exists (
  select 1
  from public.participation p
  where p.group_deal_id = gd.id
    and p.status in ('SECURED', 'CONFIRMED')
);

create index if not exists orders_customer_idx on public.orders (customer_id, created_at desc);
create index if not exists orders_owner_idx on public.orders (owner_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Customers can view own orders" on public.orders;
create policy "Customers can view own orders"
  on public.orders for select
  to authenticated
  using (customer_id = (select auth.uid()));

drop policy if exists "UMKM can view orders for own deals" on public.orders;
create policy "UMKM can view orders for own deals"
  on public.orders for select
  to authenticated
  using (owner_id = (select auth.uid()));

create or replace function public.join_group_deal(
  p_group_deal_id uuid,
  p_quantity integer,
  p_fulfillment text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_deal public.group_deals%rowtype;
  v_order public.orders%rowtype;
begin
  if v_customer_id is null then
    raise exception 'Kamu harus login terlebih dahulu.';
  end if;

  if p_quantity is null or p_quantity < 1 then
    raise exception 'Jumlah peserta tidak valid.';
  end if;

  if p_fulfillment not in ('pickup', 'delivery') then
    raise exception 'Metode pemenuhan tidak valid.';
  end if;

  select * into v_deal
  from public.group_deals
  where id = p_group_deal_id and status = 'berlangsung'
  for update;

  if not found then
    raise exception 'Kongsi tidak tersedia.';
  end if;

  if v_deal.fulfillment <> p_fulfillment and v_deal.fulfillment <> 'pickup-delivery' then
    raise exception 'Metode pemenuhan tidak tersedia untuk Kongsi ini.';
  end if;

  if v_deal.current_participants + p_quantity > v_deal.target_participants then
    raise exception 'Sisa kuota Kongsi tidak mencukupi.';
  end if;

  insert into public.orders (
    order_number,
    group_deal_id,
    customer_id,
    owner_id,
    customer_name,
    product_name,
    image_url,
    quantity,
    unit_price,
    target_participants,
    participants_after,
    fulfillment,
    pickup_location,
    pickup_hours,
    delivery_fee,
    total_amount
  )
  values (
    'KS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
    v_deal.id,
    v_customer_id,
    v_deal.owner_id,
    coalesce((select name from public.users where user_id = v_customer_id), 'Customer'),
    v_deal.product_name,
    v_deal.image_url,
    p_quantity,
    v_deal.kongsi_price,
    v_deal.target_participants,
    v_deal.current_participants + p_quantity,
    p_fulfillment,
    v_deal.pickup_location,
    v_deal.pickup_hours,
    case when p_fulfillment = 'delivery' then v_deal.delivery_fee else 0 end,
    (v_deal.kongsi_price * p_quantity) + case when p_fulfillment = 'delivery' then v_deal.delivery_fee else 0 end
  )
  returning * into v_order;

  -- Reserve the slot while payment is pending. The participation record is
  -- created only after Midtrans confirms settlement.
  update public.group_deals
  set current_participants = current_participants + p_quantity,
      status = case
        when current_participants + p_quantity >= target_participants then 'sukses'
        else status
      end
  where id = v_deal.id;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'total_amount', v_order.total_amount
  );
end;
$$;

grant execute on function public.join_group_deal(uuid, integer, text) to authenticated;

create or replace function public.settle_group_deal_order(
  p_order_number text,
  p_payment_method text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_deal public.group_deals%rowtype;
  v_participation_id uuid;
  v_payment_id uuid;
begin
  select * into v_order
  from public.orders
  where order_number = p_order_number
  for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if v_order.payment_status = 'paid' and v_order.participation_id is not null then
    select payment_id into v_payment_id
    from public.payment
    where participation_id = v_order.participation_id
    limit 1;

    if v_payment_id is null then
      insert into public.payment (
        payment_id,
        participation_id,
        payment_method,
        amount,
        payment_status,
        transaction_reference,
        payment_date
      )
      values (
        gen_random_uuid(),
        v_order.participation_id,
        p_payment_method,
        v_order.total_amount,
        'PAID',
        v_order.order_number,
        now()
      );
    end if;

    return jsonb_build_object('id', v_order.id, 'payment_status', 'paid', 'participation_id', v_order.participation_id);
  end if;

  if v_order.payment_status = 'failed' then
    raise exception 'Pesanan sudah dibatalkan.';
  end if;

  select * into v_deal
  from public.group_deals
  where id = v_order.group_deal_id
  for update;

  if not found then
    raise exception 'Kongsi tidak ditemukan.';
  end if;

  insert into public.participation (
    user_id,
    group_deal_id,
    quantity,
    status,
    joined_at
  )
  values (
    v_order.customer_id,
    v_order.group_deal_id,
    v_order.quantity,
    'CONFIRMED',
    now()
  )
  on conflict (user_id, group_deal_id)
  do update set
    quantity = public.participation.quantity + excluded.quantity,
    status = 'CONFIRMED'
  returning participation_id into v_participation_id;

  update public.orders
  set payment_status = 'paid',
      payment_method = p_payment_method,
      participation_id = v_participation_id,
      status = 'perlu-diproses'
  where id = v_order.id;

  insert into public.payment (
    payment_id,
    participation_id,
    payment_method,
    amount,
    payment_status,
    transaction_reference,
    payment_date
  )
  values (
    gen_random_uuid(),
    v_participation_id,
    p_payment_method,
    v_order.total_amount,
    'PAID',
    v_order.order_number,
    now()
  );

  return jsonb_build_object('id', v_order.id, 'payment_status', 'paid', 'participation_id', v_participation_id);
end;
$$;

grant execute on function public.settle_group_deal_order(text, text) to service_role;

create or replace function public.release_group_deal_order(
  p_order_number text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order
  from public.orders
  where order_number = p_order_number
  for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if v_order.payment_status in ('paid', 'failed') then
    return jsonb_build_object('id', v_order.id, 'payment_status', v_order.payment_status);
  end if;

  update public.orders
  set payment_status = 'failed', status = 'dibatalkan'
  where id = v_order.id;

  update public.group_deals
  set current_participants = greatest(0, current_participants - v_order.quantity),
      status = case
        when status = 'sukses' and current_participants - v_order.quantity < target_participants then 'berlangsung'
        else status
      end
  where id = v_order.group_deal_id;

  return jsonb_build_object('id', v_order.id, 'payment_status', 'failed');
end;
$$;

grant execute on function public.release_group_deal_order(text) to service_role;

create or replace function public.confirm_order_payment(
  p_order_id uuid,
  p_payment_method text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Kamu harus login terlebih dahulu.';
  end if;

  if p_payment_method not in ('qris', 'ewallet', 'va', 'kartu') then
    raise exception 'Metode pembayaran tidak valid.';
  end if;

  update public.orders
  set payment_method = p_payment_method,
      payment_status = 'paid'
  where id = p_order_id
    and customer_id = auth.uid()
    and payment_status = 'pending'
  returning * into v_order;

  if not found then
    raise exception 'Pesanan tidak ditemukan atau sudah dibayar.';
  end if;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status
  );
end;
$$;

grant execute on function public.confirm_order_payment(uuid, text) to authenticated;
