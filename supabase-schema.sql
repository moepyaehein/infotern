create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  company_id text not null,
  reviewer_name text not null,
  major text not null,
  graduation_year integer,
  role text not null,
  overall_rating integer not null check (overall_rating between 1 and 5),
  work_life_balance integer not null check (work_life_balance between 1 and 5),
  learning_opportunity integer not null check (learning_opportunity between 1 and 5),
  mentorship integer not null check (mentorship between 1 and 5),
  pros text not null,
  cons text not null,
  interview_tips text,
  helpful integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
on public.reviews for select
to anon
using (true);

drop policy if exists "Public can create reviews" on public.reviews;
create policy "Public can create reviews"
on public.reviews for insert
to anon
with check (true);

create table if not exists public.companies (
  id text primary key,
  name text not null,
  description text not null,
  industry text not null,
  location text not null,
  map_url text,
  size text not null,
  founded integer,
  website text,
  working_hours text not null,
  majors jsonb not null default '[]'::jsonb,
  roles jsonb not null default '[]'::jsonb,
  facilities jsonb not null default '[]'::jsonb,
  intern_duration text not null,
  stipend text not null,
  rating numeric not null default 0,
  total_reviews integer not null default 0,
  logo text not null default 'building',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;

drop policy if exists "Public can read active companies" on public.companies;
create policy "Public can read active companies"
on public.companies for select
to anon, authenticated
using (active = true);

create table if not exists public.seniors (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  major text not null,
  graduation_year integer not null,
  company_id text not null,
  role text not null,
  bio text not null,
  telegram text,
  facebook text,
  email text not null,
  available boolean not null default true,
  approved boolean not null default false,
  help_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.seniors enable row level security;

drop policy if exists "Public can read approved seniors" on public.seniors;
create policy "Public can read approved seniors"
on public.seniors for select
to anon, authenticated
using (approved = true or user_id = auth.uid());

drop policy if exists "Authenticated UIT users can create senior profile" on public.seniors;
create policy "Authenticated UIT users can create senior profile"
on public.seniors for insert
to authenticated
with check (user_id = auth.uid() and email like '%@uit.edu.mm');

drop policy if exists "Users can update own pending senior profile" on public.seniors;
create policy "Users can update own pending senior profile"
on public.seniors for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and email like '%@uit.edu.mm' and approved = false);

create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Admins can read own admin access" on public.admins;
create policy "Admins can read own admin access"
on public.admins for select
to authenticated
using (email = auth.jwt() ->> 'email');

drop policy if exists "Admins can read all senior profiles" on public.seniors;
create policy "Admins can read all senior profiles"
on public.seniors for select
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Admins can update senior profiles" on public.seniors;
create policy "Admins can update senior profiles"
on public.seniors for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Admins can delete senior profiles" on public.seniors;
create policy "Admins can delete senior profiles"
on public.seniors for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

insert into public.admins (email)
values ('moepyaehein@uit.edu.mm')
on conflict (email) do nothing;

drop policy if exists "Admins can read all companies" on public.companies;
create policy "Admins can read all companies"
on public.companies for select
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Admins can create companies" on public.companies;
create policy "Admins can create companies"
on public.companies for insert
to authenticated
with check (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Admins can update companies" on public.companies;
create policy "Admins can update companies"
on public.companies for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Admins can delete companies" on public.companies;
create policy "Admins can delete companies"
on public.companies for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);
