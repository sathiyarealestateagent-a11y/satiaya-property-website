alter table public.properties
  add column if not exists image_urls text[] not null default array[]::text[],
  add column if not exists address text not null default '',
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists description text not null default '',
  add column if not exists package_details text not null default '',
  add column if not exists project_info text not null default '',
  add column if not exists amenities text not null default '';

alter table public.properties
  drop constraint if exists properties_latitude_check,
  drop constraint if exists properties_longitude_check;

alter table public.properties
  add constraint properties_latitude_check
    check (latitude is null or latitude between -90 and 90),
  add constraint properties_longitude_check
    check (longitude is null or longitude between -180 and 180);

update public.properties
set image_urls = array[image_url]
where cardinality(image_urls) = 0 and image_url <> '';

update storage.buckets
set
  file_size_limit = 20971520,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]
where id = 'property-images';
