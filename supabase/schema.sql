-- Enable extensions
create extension if not exists "pgcrypto";

-- Settings table
create table if not exists public.site_settings (
  id integer primary key default 1,
  seo_title text,
  seo_description text,
  ga4_id text,
  meta_pixel_id text,
  gtm_id text,
  updated_at timestamp with time zone default now()
);

-- Content table
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Leads table
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now(),
  company_name text,
  vat text,
  sector text,
  address text,
  city text,
  province text,
  postal_code text,
  locations text,
  people_printing text,
  monthly_volume text,
  color_mix text,
  formats text[],
  printers_needed text,
  distribution text,
  functions text[],
  priorities text[],
  document_types text[],
  model_preference text,
  model_note text,
  contact_name text,
  role text,
  email text,
  phone text,
  contact_preference text,
  note text,
  consent_privacy boolean,
  consent_marketing boolean,
  utm jsonb,
  payload jsonb
);

-- Analytics events
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now(),
  event text,
  path text,
  referrer text,
  utm jsonb,
  country text,
  user_agent text
);

-- Enable RLS
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;

-- Policies for authenticated admin
create policy "site_settings_read" on public.site_settings
  for select to authenticated using (true);

create policy "site_settings_write" on public.site_settings
  for insert to authenticated with check (true);

create policy "site_settings_update" on public.site_settings
  for update to authenticated using (true);

create policy "site_content_read" on public.site_content
  for select to authenticated using (true);

create policy "site_content_write" on public.site_content
  for insert to authenticated with check (true);

create policy "site_content_update" on public.site_content
  for update to authenticated using (true);

create policy "leads_read" on public.leads
  for select to authenticated using (true);

-- Public insert policies
create policy "leads_insert" on public.leads
  for insert to anon with check (true);

create policy "analytics_insert" on public.analytics_events
  for insert to anon with check (true);

-- Optional: allow authenticated read on analytics
create policy "analytics_read" on public.analytics_events
  for select to authenticated using (true);
