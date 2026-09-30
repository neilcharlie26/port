-- Run once in your Supabase project's SQL Editor. Safe to run again.
create table if not exists public.portfolio_chats (
  id text primary key,
  secret text not null unique,
  version integer not null default 0,
  payload jsonb not null,
  updated_at bigint not null
);
create table if not exists public.portfolio_sessions (
  id text primary key,
  expires_at bigint not null
);
create table if not exists public.portfolio_uploads (
  id text primary key,
  chat_id text not null references public.portfolio_chats(id),
  owner text not null,
  name text not null,
  mime text not null,
  size integer not null check (size > 0 and size < 5000000),
  created_at bigint not null
);
create table if not exists public.portfolio_limits (
  id text primary key,
  count integer not null,
  expires_at timestamptz not null
);
alter table public.portfolio_chats enable row level security;
alter table public.portfolio_sessions enable row level security;
alter table public.portfolio_uploads enable row level security;
alter table public.portfolio_limits enable row level security;
-- Only the server's service-role key can access these tables.
revoke all on public.portfolio_chats, public.portfolio_sessions, public.portfolio_uploads, public.portfolio_limits from anon, authenticated;
grant all on public.portfolio_chats, public.portfolio_sessions, public.portfolio_uploads, public.portfolio_limits to service_role;

create or replace function public.portfolio_rate_limit(limit_key text, maximum integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_count integer;
begin
  delete from public.portfolio_limits where expires_at < now();
  delete from public.portfolio_sessions where expires_at < extract(epoch from now()) * 1000;
  insert into public.portfolio_limits(id, count, expires_at)
  values (limit_key, 1, now() + interval '1 minute')
  on conflict(id) do update set count = public.portfolio_limits.count + 1
  returning count into current_count;
  return current_count <= maximum;
end;
$$;
revoke all on function public.portfolio_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.portfolio_rate_limit(text, integer) to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-chat', 'portfolio-chat', false, 4999999,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
on conflict(id) do update set public = false, file_size_limit = 4999999,
  allowed_mime_types = excluded.allowed_mime_types;
-- No public Storage policies: uploads/downloads use short-lived signed URLs.
