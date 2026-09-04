create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.properties (
  id bigint primary key check (id > 0),
  title text not null,
  location text not null,
  property_type text not null,
  listing_type text not null check (listing_type in ('sale', 'rent')),
  price numeric not null check (price >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  size_sqft integer not null default 0 check (size_sqft >= 0),
  image_url text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_content_updated_by_idx
on public.site_content (updated_by);

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.properties enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.site_content from anon, authenticated;
revoke all on table public.properties from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.admin_users to authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;
grant select on table public.properties to anon, authenticated;
grant insert, update, delete on table public.properties to authenticated;

create schema if not exists private;

create or replace function private.is_site_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_site_admin() from public, anon, service_role;
grant usage on schema private to authenticated;
grant execute on function private.is_site_admin() to authenticated;

create policy "Administrators can view their own access"
on public.admin_users for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "Administrators can create site content"
on public.site_content for insert
to authenticated
with check ((select private.is_site_admin()));

create policy "Administrators can update site content"
on public.site_content for update
to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

create policy "Administrators can delete site content"
on public.site_content for delete
to authenticated
using ((select private.is_site_admin()));

create policy "Public can read properties"
on public.properties for select
to anon, authenticated
using (true);

create policy "Administrators can create properties"
on public.properties for insert
to authenticated
with check ((select private.is_site_admin()));

create policy "Administrators can update properties"
on public.properties for update
to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

create policy "Administrators can delete properties"
on public.properties for delete
to authenticated
using ((select private.is_site_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Administrators can upload property images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and (select private.is_site_admin())
);

create policy "Administrators can update property images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'property-images'
  and (select private.is_site_admin())
)
with check (
  bucket_id = 'property-images'
  and (select private.is_site_admin())
);

create policy "Administrators can delete property images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'property-images'
  and (select private.is_site_admin())
);
