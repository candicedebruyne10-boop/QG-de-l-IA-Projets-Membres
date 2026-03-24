create extension if not exists pgcrypto;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  avatar_url text,
  bio text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  short_description text not null,
  long_description text not null,
  external_url text not null,
  category text not null,
  profession text not null,
  project_status text not null,
  stage text not null,
  pricing_model text not null,
  price_label text,
  qg_special_offer boolean not null default false,
  qg_special_offer_details text,
  beta_available boolean not null default false,
  methodology text not null,
  problem_solved text not null,
  target_audience text not null,
  creator_feedback text,
  thumbnail_url text,
  is_featured boolean not null default false,
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tool_name text not null
);

create table if not exists public.project_tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tag text not null
);

create table if not exists public.project_likes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(project_id, user_id)
);

create table if not exists public.beta_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  is_visible boolean not null default true
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_moderation_status on public.projects(moderation_status);
create index if not exists idx_projects_profession on public.projects(profession);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_project_tools_project_id on public.project_tools(project_id);
create index if not exists idx_project_tags_project_id on public.project_tags(project_id);
create index if not exists idx_project_likes_project_id on public.project_likes(project_id);
create index if not exists idx_beta_requests_project_id on public.beta_requests(project_id);
create index if not exists idx_comments_project_id on public.comments(project_id);

drop trigger if exists handle_projects_updated_at on public.projects;
create trigger handle_projects_updated_at
before update on public.projects
for each row
execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]+', '', 'g')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_tools enable row level security;
alter table public.project_tags enable row level security;
alter table public.project_likes enable row level security;
alter table public.beta_requests enable row level security;
alter table public.comments enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
on public.profiles
for select
using (true);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_manage" on public.profiles;
create policy "profiles_admin_manage"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "projects_public_read_approved" on public.projects;
create policy "projects_public_read_approved"
on public.projects
for select
using (
  moderation_status = 'approved'
  or auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own"
on public.projects
for insert
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own"
on public.projects
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own"
on public.projects
for delete
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "project_tools_read" on public.project_tools;
create policy "project_tools_read"
on public.project_tools
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tools.project_id
      and (projects.moderation_status = 'approved' or projects.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "project_tools_manage" on public.project_tools;
create policy "project_tools_manage"
on public.project_tools
for all
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tools.project_id
      and (projects.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_tools.project_id
      and (projects.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "project_tags_read" on public.project_tags;
create policy "project_tags_read"
on public.project_tags
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tags.project_id
      and (projects.moderation_status = 'approved' or projects.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "project_tags_manage" on public.project_tags;
create policy "project_tags_manage"
on public.project_tags
for all
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tags.project_id
      and (projects.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_tags.project_id
      and (projects.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "project_likes_read" on public.project_likes;
create policy "project_likes_read"
on public.project_likes
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_likes.project_id
      and projects.moderation_status = 'approved'
  )
  or public.is_admin()
);

drop policy if exists "project_likes_insert_self" on public.project_likes;
create policy "project_likes_insert_self"
on public.project_likes
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = project_likes.project_id
      and projects.moderation_status = 'approved'
  )
);

drop policy if exists "project_likes_delete_self" on public.project_likes;
create policy "project_likes_delete_self"
on public.project_likes
for delete
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "beta_requests_read_owner" on public.beta_requests;
create policy "beta_requests_read_owner"
on public.beta_requests
for select
using (
  requester_id = auth.uid()
  or exists (
    select 1
    from public.projects
    where projects.id = beta_requests.project_id
      and projects.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "beta_requests_insert_self" on public.beta_requests;
create policy "beta_requests_insert_self"
on public.beta_requests
for insert
with check (
  requester_id = auth.uid()
  and exists (
    select 1
    from public.projects
    where projects.id = beta_requests.project_id
      and projects.moderation_status = 'approved'
      and projects.beta_available = true
  )
);

drop policy if exists "comments_public_read_visible" on public.comments;
create policy "comments_public_read_visible"
on public.comments
for select
using (
  is_visible = true
  and exists (
    select 1
    from public.projects
    where projects.id = comments.project_id
      and projects.moderation_status = 'approved'
  )
  or public.is_admin()
);

drop policy if exists "comments_insert_self" on public.comments;
create policy "comments_insert_self"
on public.comments
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where projects.id = comments.project_id
      and projects.moderation_status = 'approved'
  )
);

drop policy if exists "comments_manage_admin" on public.comments;
create policy "comments_manage_admin"
on public.comments
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-thumbnails',
  'project-thumbnails',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "thumbnails_public_read" on storage.objects;
create policy "thumbnails_public_read"
on storage.objects
for select
using (bucket_id = 'project-thumbnails');

drop policy if exists "thumbnails_authenticated_upload" on storage.objects;
create policy "thumbnails_authenticated_upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-thumbnails'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "thumbnails_authenticated_update" on storage.objects;
create policy "thumbnails_authenticated_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-thumbnails'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'project-thumbnails'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "thumbnails_authenticated_delete" on storage.objects;
create policy "thumbnails_authenticated_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-thumbnails'
  and auth.uid()::text = split_part(name, '/', 1)
);
