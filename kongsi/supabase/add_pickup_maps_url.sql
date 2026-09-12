alter table public.group_deals
  add column if not exists pickup_maps_url text;

notify pgrst, 'reload schema';
