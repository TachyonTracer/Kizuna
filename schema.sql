-- Create the table
create table public.bookmarks (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  url text not null,
  title text,
  icon_url text,
  category text,
  sort_order integer,
  created_at timestamp with time zone not null default now(),
  constraint bookmarks_pkey primary key (id)
);

-- Migration for existing projects (safe if column already exists)
alter table public.bookmarks
add column if not exists category text;

alter table public.bookmarks
add column if not exists sort_order integer;

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
on public.bookmarks for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can insert their own bookmarks"
on public.bookmarks for insert
to authenticated
with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own bookmarks"
on public.bookmarks for delete
to authenticated
using ( (select auth.uid()) = user_id );

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bookmarks'
      and policyname = 'Users can update their own bookmarks'
  ) then
    create policy "Users can update their own bookmarks"
    on public.bookmarks for update
    to authenticated
    using ( (select auth.uid()) = user_id )
    with check ( (select auth.uid()) = user_id );
  end if;
end
$$;
