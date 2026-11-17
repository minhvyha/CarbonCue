create table public.gpus (
  name text primary key, watt double precision not null check (watt > 0)
);
create table public.providers (name text primary key, provider_name text not null);
create table public.provider_regions (
  provider_name text not null references public.providers(name) on delete cascade,
  region_name text not null, country text not null default '', impact double precision not null check (impact >= 0),
  offset_ratio double precision not null default 0 check (offset_ratio between 0 and 100),
  source text not null default '', primary key (provider_name, region_name)
);
create table public.resources (
  id uuid primary key default gen_random_uuid(), type text not null check (type in ('guide','course','video','research','art')),
  slug text not null, title text not null, content jsonb not null default '{}',
  created_at timestamptz not null default now(), unique (type, slug)
);
create table public.recommendations (
  id uuid primary key default gen_random_uuid(), title text not null unique, description text not null,
  category text not null check (category in ('transportation','homeenergy','fooddiet','shopping','digitalusage')),
  impact text not null, impact_value double precision not null check (impact_value >= 0),
  difficulty text not null check (difficulty in ('Easy','Medium','Hard')),
  trees_earned integer not null check (trees_earned >= 0)
);
create table public.recommendation_completions (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  recommendation_id uuid not null references public.recommendations(id) on delete cascade,
  completed_at timestamptz not null default now(), primary key (user_id, recommendation_id)
);
create index completions_recommendation_idx on public.recommendation_completions(recommendation_id);
create table public.model_versions (
  version text primary key, method text not null, metadata jsonb not null, created_at timestamptz not null default now()
);
create table public.emission_factor_versions (
  version text primary key, metadata jsonb not null, created_at timestamptz not null default now()
);
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('transportation','home_energy','food_diet','shopping','digital_usage')),
  activity_details jsonb not null, prediction double precision not null check (prediction >= 0 and prediction < 1000000),
  method text not null check (method in ('factor','ml')), model_version text references public.model_versions(version),
  factor_version text not null references public.emission_factor_versions(version),
  activity_date date not null, timezone text not null default 'Australia/Sydney',
  notes text not null default '' check (length(notes) <= 2000), created_at timestamptz not null default now()
);
create index activity_logs_user_date_idx on public.activity_logs(user_id, activity_date desc);
create index activity_logs_model_idx on public.activity_logs(model_version);
create index activity_logs_factor_idx on public.activity_logs(factor_version);
create table public.artwork_likes (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  primary key (user_id, resource_id)
);
create index artwork_likes_resource_idx on public.artwork_likes(resource_id);
create table public.artwork_stats (
  resource_id uuid primary key references public.resources(id) on delete cascade,
  likes_count integer not null default 0 check (likes_count >= 0)
);
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
-- Only the trigger can update public aggregate counts. User IDs stay private.
create function private.update_artwork_like_count() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.artwork_stats(resource_id, likes_count) values (new.resource_id, 1)
    on conflict (resource_id) do update set likes_count = public.artwork_stats.likes_count + 1;
    return new;
  end if;
  update public.artwork_stats set likes_count = greatest(0, likes_count - 1) where resource_id = old.resource_id;
  return old;
end;
$$;
revoke all on function private.update_artwork_like_count() from public, anon, authenticated;
create trigger artwork_like_count after insert or delete on public.artwork_likes
for each row execute function private.update_artwork_like_count();

alter table public.gpus enable row level security;
alter table public.providers enable row level security;
alter table public.provider_regions enable row level security;
alter table public.resources enable row level security;
alter table public.recommendations enable row level security;
alter table public.model_versions enable row level security;
alter table public.emission_factor_versions enable row level security;
alter table public.artwork_stats enable row level security;
alter table public.activity_logs enable row level security;
alter table public.recommendation_completions enable row level security;
alter table public.artwork_likes enable row level security;

revoke all on public.gpus, public.providers, public.provider_regions, public.resources, public.recommendations,
 public.model_versions, public.emission_factor_versions, public.artwork_stats, public.activity_logs,
 public.recommendation_completions, public.artwork_likes from anon, authenticated;
grant select on public.gpus, public.providers, public.provider_regions, public.resources, public.recommendations,
 public.model_versions, public.emission_factor_versions, public.artwork_stats to anon, authenticated;
create policy public_read on public.gpus for select to anon, authenticated using (true);
create policy public_read on public.providers for select to anon, authenticated using (true);
create policy public_read on public.provider_regions for select to anon, authenticated using (true);
create policy public_read on public.resources for select to anon, authenticated using (true);
create policy public_read on public.recommendations for select to anon, authenticated using (true);
create policy public_read on public.model_versions for select to anon, authenticated using (true);
create policy public_read on public.emission_factor_versions for select to anon, authenticated using (true);
create policy public_read on public.artwork_stats for select to anon, authenticated using (true);

grant select, delete on public.activity_logs to authenticated;
grant insert (activity_type, activity_details, prediction, method, model_version, factor_version, activity_date, timezone, notes) on public.activity_logs to authenticated;
create policy own_read on public.activity_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.activity_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_delete on public.activity_logs for delete to authenticated using ((select auth.uid()) = user_id);

grant select on public.recommendation_completions to authenticated;
grant insert (recommendation_id) on public.recommendation_completions to authenticated;
create policy own_read on public.recommendation_completions for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.recommendation_completions for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, delete on public.artwork_likes to authenticated;
grant insert (resource_id) on public.artwork_likes to authenticated;
create policy own_read on public.artwork_likes for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.artwork_likes for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.resources where id = resource_id and type = 'art'));
create policy own_delete on public.artwork_likes for delete to authenticated using ((select auth.uid()) = user_id);
