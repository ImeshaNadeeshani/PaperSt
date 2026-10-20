-- Run once in your project's SQL Editor. This is the foundation, not live checkout.
begin;
create table public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'Draft' check (status in ('Active','Draft','Archived')),
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text not null default ''
);
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  is_default boolean not null default false
);
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'Pending',
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  variants jsonb not null default '{}'
);
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  courier text,
  tracking_number text,
  tracking_url text,
  status text not null default 'Preparing'
);
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments enable row level security;
revoke all on public.products, public.profiles, public.addresses, public.orders, public.order_items, public.shipments from anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select on public.orders, public.order_items, public.shipments to authenticated;
create policy published_products on public.products for select to anon, authenticated using (status = 'Active');
create policy own_profile_read on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy own_profile_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy own_profile_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy own_addresses on public.addresses for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own_orders on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy own_order_items on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy own_shipments on public.shipments for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create index orders_user_id on public.orders(user_id);
create index addresses_user_id on public.addresses(user_id);
create index order_items_order_id on public.order_items(order_id);
create index shipments_order_id on public.shipments(order_id);
-- Admin writes and checkout need authenticated server functions with role checks.
-- No browser write access to prices, stock, orders or shipments is granted here.
commit;
