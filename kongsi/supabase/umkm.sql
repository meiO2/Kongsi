-- Create an UMKM profile automatically when an UMKM account signs up.
-- Run this in Supabase SQL Editor after the public.umkm table exists.

create or replace function public.create_umkm_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  metadata jsonb := new.raw_user_meta_data;
  account_role varchar := case
    when coalesce(metadata->>'accountType', metadata->>'account_type') = 'umkm'
      then 'UMKM'
    else 'CUSTOMER'
  end;
begin
  insert into public.users (
    user_id,
    name,
    email,
    role
  )
  values (
    new.id,
    coalesce(metadata->>'name', split_part(new.email, '@', 1)),
    new.email,
    account_role
  )
  on conflict (user_id) do update set
    name = excluded.name,
    email = excluded.email,
    role = excluded.role;

  if account_role = 'UMKM' then
    insert into public.umkm (
      owner_id,
      business_name,
      category,
      contact,
      description,
      location,
      verification_status
    )
    values (
      new.id,
      coalesce(metadata->>'businessName', metadata->>'business_name', ''),
      coalesce(metadata->>'businessCategory', metadata->>'business_category', ''),
      coalesce(metadata->>'phone', ''),
      coalesce(metadata->>'businessDescription', ''),
      coalesce(metadata->>'businessAddress', metadata->>'business_address', ''),
      'PENDING'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_umkm on auth.users;
create trigger on_auth_user_created_umkm
after insert on auth.users
for each row execute function public.create_umkm_profile();

alter table public.umkm enable row level security;

drop policy if exists "UMKM owners can view their profile" on public.umkm;
create policy "UMKM owners can view their profile"
  on public.umkm for select
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "UMKM owners can update their profile" on public.umkm;
create policy "UMKM owners can update their profile"
  on public.umkm for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
