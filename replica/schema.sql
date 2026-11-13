-- Schema for Food Assistant (Supabase PostgreSQL)
-- Ejecuta este script en Supabase: SQL Editor -> New Query -> Run

-- 1. TABLA DE RECETAS (Recipes)
-- Clave primaria compuesta (user_id, id) para evitar colisiones entre usuarios (BUG-22)
create table if not exists public.recipes (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  image_url text,
  source_url text default '',
  source_domain text default '',
  prep_time_minutes integer default 0,
  cook_time_minutes integer default 0,
  servings integer not null default 2,
  tags text[] default array[]::text[],
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  nutrition jsonb default null,
  is_favorite boolean not null default false,
  cookbooks jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Si la tabla ya existía con clave primaria simple (id), migrar idempotentemente a clave compuesta (user_id, id) (BUG-22):
do $$
declare
  pk_name text;
begin
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'recipes'
    and con.contype = 'p'
    and array_length(con.conkey, 1) = 1;

  if pk_name is not null then
    execute format('alter table public.recipes drop constraint %I', pk_name);
    alter table public.recipes add primary key (user_id, id);
  end if;
end $$;

alter table public.recipes add column if not exists source_url text default '';
alter table public.recipes add column if not exists source_domain text default '';
alter table public.recipes add column if not exists nutrition jsonb default null;
alter table public.recipes add column if not exists cookbooks jsonb default '[]'::jsonb;

-- 2. TABLA DE PLAN SEMANAL (Meal Plans)
-- Soporta los 4 momentos estándar + momentos dinámicos / flexibles (BUG-23)
create table if not exists public.meal_plans (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date text not null,
  day_name text not null,
  breakfast_recipe_id text,
  lunch_recipe_id text,
  snack_recipe_id text,
  dinner_recipe_id text,
  custom_slots jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Migraciones idempotentes para meal_plans:
do $$
declare
  pk_name text;
begin
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'meal_plans'
    and con.contype = 'p'
    and array_length(con.conkey, 1) = 1;

  if pk_name is not null then
    execute format('alter table public.meal_plans drop constraint %I', pk_name);
    alter table public.meal_plans add primary key (user_id, id);
  end if;
end $$;

alter table public.meal_plans add column if not exists breakfast_recipe_id text;
alter table public.meal_plans add column if not exists snack_recipe_id text;
alter table public.meal_plans add column if not exists custom_slots jsonb not null default '[]'::jsonb;

-- 3. TABLA DE LISTA DE LA COMPRA (Shopping Items)
-- Cada item dispone de id único (US-45) y clave compuesta (user_id, id)
create table if not exists public.shopping_items (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(8,2),
  unit text default '',
  aisle text not null default 'other',
  is_checked boolean not null default false,
  recipe_origin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Migraciones idempotentes para shopping_items:
do $$
declare
  pk_name text;
begin
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'shopping_items'
    and con.contype = 'p'
    and array_length(con.conkey, 1) = 1;

  if pk_name is not null then
    execute format('alter table public.shopping_items drop constraint %I', pk_name);
    alter table public.shopping_items add primary key (user_id, id);
  end if;
end $$;

alter table public.shopping_items add column if not exists updated_at timestamptz not null default now();

-- 4. SEGURIDAD RLS (Row Level Security)
alter table public.recipes enable row level security;
alter table public.meal_plans enable row level security;
alter table public.shopping_items enable row level security;

-- Políticas de acceso para Recipes
drop policy if exists "Users own recipes select" on public.recipes;
create policy "Users own recipes select" on public.recipes for select using (auth.uid() = user_id);

drop policy if exists "Users own recipes insert" on public.recipes;
create policy "Users own recipes insert" on public.recipes for insert with check (auth.uid() = user_id);

drop policy if exists "Users own recipes update" on public.recipes;
create policy "Users own recipes update" on public.recipes for update using (auth.uid() = user_id);

drop policy if exists "Users own recipes delete" on public.recipes;
create policy "Users own recipes delete" on public.recipes for delete using (auth.uid() = user_id);

-- Políticas de acceso para Meal Plans
drop policy if exists "Users own meal_plans select" on public.meal_plans;
create policy "Users own meal_plans select" on public.meal_plans for select using (auth.uid() = user_id);

drop policy if exists "Users own meal_plans insert" on public.meal_plans;
create policy "Users own meal_plans insert" on public.meal_plans for insert with check (auth.uid() = user_id);

drop policy if exists "Users own meal_plans update" on public.meal_plans;
create policy "Users own meal_plans update" on public.meal_plans for update using (auth.uid() = user_id);

drop policy if exists "Users own meal_plans delete" on public.meal_plans;
create policy "Users own meal_plans delete" on public.meal_plans for delete using (auth.uid() = user_id);

-- Políticas de acceso para Shopping Items
drop policy if exists "Users own shopping select" on public.shopping_items;
create policy "Users own shopping select" on public.shopping_items for select using (auth.uid() = user_id);

drop policy if exists "Users own shopping insert" on public.shopping_items;
create policy "Users own shopping insert" on public.shopping_items for insert with check (auth.uid() = user_id);

drop policy if exists "Users own shopping update" on public.shopping_items;
create policy "Users own shopping update" on public.shopping_items for update using (auth.uid() = user_id);

drop policy if exists "Users own shopping delete" on public.shopping_items;
create policy "Users own shopping delete" on public.shopping_items for delete using (auth.uid() = user_id);

-- 4. TABLA DE CONFIGURACIONES Y PREFERENCIAS (User Settings)
create table if not exists public.user_settings (
  user_id uuid not null references auth.users(id) on delete cascade,
  dietary_preferences text[] default array[]::text[],
  custom_tags text[] default array[]::text[],
  nutrition_goals jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id)
);

alter table public.user_settings add column if not exists nutrition_goals jsonb default '{}'::jsonb;
alter table public.user_settings add column if not exists cookbooks jsonb default '[]'::jsonb;

alter table public.user_settings enable row level security;

drop policy if exists "Users own settings select" on public.user_settings;
create policy "Users own settings select" on public.user_settings for select using (auth.uid() = user_id);

drop policy if exists "Users own settings insert" on public.user_settings;
create policy "Users own settings insert" on public.user_settings for insert with check (auth.uid() = user_id);

drop policy if exists "Users own settings update" on public.user_settings;
create policy "Users own settings update" on public.user_settings for update using (auth.uid() = user_id);

drop policy if exists "Users own settings delete" on public.user_settings;
create policy "Users own settings delete" on public.user_settings for delete using (auth.uid() = user_id);


-- 5. PREFERENCIAS ADICIONALES DE USUARIO (US-69 retirado en US-79b; se conserva default_servings)
alter table public.user_settings add column if not exists default_servings integer not null default 2;

-- 6. MODO FAMILIA / ESPACIO COLABORATIVO DEL HOGAR (US-77)
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists households_invite_code_idx on public.households (invite_code);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  display_name text default '',
  email text default '',
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index if not exists household_members_user_id_idx on public.household_members (user_id);

-- Columnas de vinculación de hogar en tablas de dominio
alter table public.recipes add column if not exists household_id uuid references public.households(id) on delete set null;
alter table public.recipes add column if not exists is_private boolean not null default false;
alter table public.meal_plans add column if not exists household_id uuid references public.households(id) on delete set null;
alter table public.shopping_items add column if not exists household_id uuid references public.households(id) on delete set null;
alter table public.user_settings add column if not exists active_household_id uuid references public.households(id) on delete set null;
alter table public.households add column if not exists cookbooks jsonb default '[]'::jsonb;

-- Asegurar clave primaria compuesta (user_id, id) en recipes, meal_plans y shopping_items para multi-usuario
do $$
declare
  pk_name text;
begin
  -- 1. recipes
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public' and rel.relname = 'recipes' and con.contype = 'p' and array_length(con.conkey, 1) = 1;
  if pk_name is not null then
    execute format('alter table public.recipes drop constraint %I', pk_name);
    alter table public.recipes add primary key (user_id, id);
  end if;

  -- 2. meal_plans
  pk_name := null;
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public' and rel.relname = 'meal_plans' and con.contype = 'p' and array_length(con.conkey, 1) = 1;
  if pk_name is not null then
    execute format('alter table public.meal_plans drop constraint %I', pk_name);
    alter table public.meal_plans add primary key (user_id, id);
  end if;

  -- 3. shopping_items
  pk_name := null;
  select con.conname into pk_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public' and rel.relname = 'shopping_items' and con.contype = 'p' and array_length(con.conkey, 1) = 1;
  if pk_name is not null then
    execute format('alter table public.shopping_items drop constraint %I', pk_name);
    alter table public.shopping_items add primary key (user_id, id);
  end if;
end $$;

create index if not exists recipes_household_id_idx on public.recipes (household_id) where household_id is not null;
create index if not exists meal_plans_household_id_idx on public.meal_plans (household_id) where household_id is not null;
create index if not exists shopping_items_household_id_idx on public.shopping_items (household_id) where household_id is not null;

-- Función auxiliar Security Definer para verificar pertenencia al hogar sin recursión RLS
create or replace function public.is_household_member(hid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = hid
      and hm.user_id = auth.uid()
  );
$$;

alter table public.households enable row level security;
alter table public.household_members enable row level security;

-- Políticas para households (lectura para miembros o por código al unirse, creación por usuario autenticado, edición/borrado por owner)
drop policy if exists "Households select policy" on public.households;
create policy "Households select policy" on public.households
  for select using (auth.uid() is not null);

drop policy if exists "Households update policy" on public.households;
create policy "Households update policy" on public.households
  for update using (auth.uid() = owner_id or public.is_household_member(id))
  with check (auth.uid() = owner_id or public.is_household_member(id));

drop policy if exists "Households delete policy" on public.households;
create policy "Households delete policy" on public.households
  for delete using (auth.uid() = owner_id);

-- Políticas para household_members
drop policy if exists "Household members select policy" on public.household_members;
create policy "Household members select policy" on public.household_members
  for select using (auth.uid() = user_id or public.is_household_member(household_id));

drop policy if exists "Household members update policy" on public.household_members;
create policy "Household members update policy" on public.household_members
  for update using (auth.uid() = user_id or public.is_household_member(household_id))
  with check (auth.uid() = user_id or public.is_household_member(household_id));

drop policy if exists "Household members delete policy" on public.household_members;
create policy "Household members delete policy" on public.household_members
  for delete using (auth.uid() = user_id or public.is_household_member(household_id));

-- Actualización de políticas RLS colaborativas en recipes, meal_plans y shopping_items
drop policy if exists "Users own recipes select" on public.recipes;
create policy "Users own recipes select" on public.recipes
  for select using (auth.uid() = user_id or (household_id is not null and not is_private and public.is_household_member(household_id)));

drop policy if exists "Users own recipes insert" on public.recipes;
create policy "Users own recipes insert" on public.recipes
  for insert with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own recipes update" on public.recipes;
create policy "Users own recipes update" on public.recipes
  for update using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)))
  with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own recipes delete" on public.recipes;
create policy "Users own recipes delete" on public.recipes
  for delete using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own meal_plans select" on public.meal_plans;
create policy "Users own meal_plans select" on public.meal_plans
  for select using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own meal_plans insert" on public.meal_plans;
create policy "Users own meal_plans insert" on public.meal_plans
  for insert with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own meal_plans update" on public.meal_plans;
create policy "Users own meal_plans update" on public.meal_plans
  for update using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)))
  with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own meal_plans delete" on public.meal_plans;
create policy "Users own meal_plans delete" on public.meal_plans
  for delete using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own shopping select" on public.shopping_items;
create policy "Users own shopping select" on public.shopping_items
  for select using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own shopping insert" on public.shopping_items;
create policy "Users own shopping insert" on public.shopping_items
  for insert with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own shopping update" on public.shopping_items;
create policy "Users own shopping update" on public.shopping_items
  for update using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)))
  with check (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

drop policy if exists "Users own shopping delete" on public.shopping_items;
create policy "Users own shopping delete" on public.shopping_items
  for delete using (auth.uid() = user_id or (household_id is not null and public.is_household_member(household_id)));

-- -----------------------------------------------------------------------------
-- 7. (Retirado en US-79b: app_config eliminada)
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 8. SUPABASE REALTIME (PUBLICACIÓN Y REPLICA IDENTITY PARA CDC)
-- -----------------------------------------------------------------------------
alter table public.shopping_items replica identity full;
alter table public.meal_plans replica identity full;
alter table public.recipes replica identity full;
alter table public.household_members replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.shopping_items;
    alter publication supabase_realtime add table public.meal_plans;
    alter publication supabase_realtime add table public.recipes;
    alter publication supabase_realtime add table public.household_members;
  end if;
exception when others then
  null;
end;
$$;

-- -----------------------------------------------------------------------------
-- 9. REGISTRO DE USO DE IA (US-79a)
-- -----------------------------------------------------------------------------
create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('chat','voice','guided_query','weekly_plan','import_ai')),
  model text not null default '',
  prompt_tokens integer not null default 0,
  output_tokens integer not null default 0,
  status text not null default 'pending' check (status in ('pending','ok','error')),
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_user_feature_created_idx on public.ai_usage (user_id, feature, created_at desc);
alter table public.ai_usage enable row level security;
drop policy if exists "Users read own ai_usage" on public.ai_usage;
create policy "Users read own ai_usage" on public.ai_usage for select using (auth.uid() = user_id);
-- Sin políticas de insert/update/delete: solo escribe la Edge Function con service_role.

-- -----------------------------------------------------------------------------
-- 10. LIMPIEZA BYOK / AGENTE EXTERNO (US-79b)
-- -----------------------------------------------------------------------------
drop table if exists public.app_config;
drop table if exists public.external_agent_tokens;
drop index if exists public.user_settings_agent_token_hash_idx;
alter table public.user_settings drop column if exists agent_token_hash;
alter table public.user_settings drop column if exists agent_enabled;
alter table public.user_settings drop column if exists gemini_api_key;

-- -----------------------------------------------------------------------------
-- 11. PLANES Y CUOTAS (US-79c)
-- -----------------------------------------------------------------------------
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  source text not null default 'none' check (source in ('none','play','gift','admin')),
  status text not null default 'active' check (status in ('active','grace','on_hold','canceled','expired')),
  period_end timestamptz,
  is_trial boolean not null default false,
  play_product_id text,
  play_purchase_token text unique,
  updated_at timestamptz not null default now()
);
alter table public.entitlements enable row level security;
drop policy if exists "Users read own entitlement" on public.entitlements;
create policy "Users read own entitlement" on public.entitlements for select using (auth.uid() = user_id);
-- Sin políticas de escritura: solo service_role (Edge Functions) y el SQL Editor.

-- ¿Tiene este usuario un Pro propio vigente?
create or replace function public.has_own_pro(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.entitlements e
    where e.user_id = p_user and e.plan = 'pro'
      and e.status in ('active','grace','canceled')
      and (e.period_end is null or e.period_end > now())
  );
$$;

-- Plan efectivo: Pro propio, o miembro de un hogar cuyo titular tiene Pro (D8).
create or replace function public.effective_plan(p_user uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when public.has_own_pro(p_user) then 'pro'
    when exists (
      select 1 from public.household_members hm
      join public.households h on h.id = hm.household_id
      where hm.user_id = p_user and public.has_own_pro(h.owner_id)
    ) then 'pro'
    else 'free'
  end;
$$;

-- Modo Familia solo Pro (RLS)
drop policy if exists "Households insert policy" on public.households;
create policy "Households insert policy" on public.households
  for insert with check (auth.uid() = owner_id and public.effective_plan(auth.uid()) = 'pro');

drop policy if exists "Household members insert policy" on public.household_members;
create policy "Household members insert policy" on public.household_members
  for insert with check (
    auth.uid() = user_id
    and public.has_own_pro((select h.owner_id from public.households h where h.id = household_id))
  );

-- Reserva atómica de cuota. La llama SOLO la Edge Function (service_role).
create or replace function public.consume_ai_quota(p_user uuid, p_feature text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_plan text := public.effective_plan(p_user);
  v_now timestamptz := now();
  v_local timestamp := (v_now at time zone 'Europe/Madrid');
  v_limit int; v_period text; v_since timestamptz; v_used int; v_day_total int; v_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext(p_user::text));
  -- Tope técnico diario (todas las features, ambos planes)
  select count(*) into v_day_total from public.ai_usage
   where user_id = p_user and status in ('pending','ok')
     and created_at >= (date_trunc('day', v_local) at time zone 'Europe/Madrid');
  if v_day_total >= 200 then
    return jsonb_build_object('allowed', false, 'code', 'RATE_LIMITED', 'plan', v_plan);
  end if;

  if v_plan = 'pro' then
    v_limit := null; v_period := 'day';
  else
    if p_feature in ('chat','voice') then
      return jsonb_build_object('allowed', false, 'code', 'PRO_REQUIRED', 'plan', v_plan, 'feature', p_feature);
    elsif p_feature = 'weekly_plan' then v_limit := 1; v_period := 'week';
    elsif p_feature = 'guided_query' then v_limit := 3; v_period := 'day';
    elsif p_feature = 'import_ai' then v_limit := 3; v_period := 'month';
    else
      return jsonb_build_object('allowed', false, 'code', 'INVALID_FEATURE');
    end if;
  end if;

  v_since := (date_trunc(v_period, v_local) at time zone 'Europe/Madrid'); -- 'week' = lunes ISO
  select count(*) into v_used from public.ai_usage
   where user_id = p_user and feature = p_feature and status in ('pending','ok') and created_at >= v_since;

  if v_limit is not null and v_used >= v_limit then
    return jsonb_build_object('allowed', false, 'code', 'QUOTA_EXCEEDED', 'plan', v_plan,
      'feature', p_feature, 'used', v_used, 'limit', v_limit, 'remaining', 0, 'period', v_period);
  end if;

  insert into public.ai_usage (user_id, feature, status) values (p_user, p_feature, 'pending') returning id into v_id;
  return jsonb_build_object('allowed', true, 'plan', v_plan, 'usage_id', v_id, 'feature', p_feature,
    'used', v_used + 1, 'limit', v_limit,
    'remaining', case when v_limit is null then null else v_limit - v_used - 1 end, 'period', v_period);
end; $$;

revoke execute on function public.consume_ai_quota(uuid, text) from public, anon, authenticated;
grant execute on function public.consume_ai_quota(uuid, text) to service_role;

-- Estado para pintar contadores en el cliente (solo lectura, usuario actual).
create or replace function public.get_ai_quota_status() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_plan text; v_local timestamp := (now() at time zone 'Europe/Madrid');
  v_ent public.entitlements%rowtype;
  v_household_pro boolean := false;
  -- uso actual por feature en su periodo
  v_wp int; v_gq int; v_ia int;
begin
  if v_user is null then return jsonb_build_object('plan', 'anonymous'); end if;
  v_plan := public.effective_plan(v_user);
  select * into v_ent from public.entitlements where user_id = v_user;
  v_household_pro := (v_plan = 'pro' and not public.has_own_pro(v_user));
  select count(*) into v_wp from public.ai_usage where user_id = v_user and feature = 'weekly_plan' and status in ('pending','ok')
    and created_at >= (date_trunc('week', v_local) at time zone 'Europe/Madrid');
  select count(*) into v_gq from public.ai_usage where user_id = v_user and feature = 'guided_query' and status in ('pending','ok')
    and created_at >= (date_trunc('day', v_local) at time zone 'Europe/Madrid');
  select count(*) into v_ia from public.ai_usage where user_id = v_user and feature = 'import_ai' and status in ('pending','ok')
    and created_at >= (date_trunc('month', v_local) at time zone 'Europe/Madrid');
  return jsonb_build_object(
    'plan', v_plan,
    'source', coalesce(v_ent.source, 'none'),
    'status', v_ent.status,
    'period_end', v_ent.period_end,
    'is_trial', coalesce(v_ent.is_trial, false),
    'via_household', v_household_pro,
    'quotas', jsonb_build_object(
      'weekly_plan', jsonb_build_object('used', v_wp, 'limit', case when v_plan = 'pro' then null else 1 end, 'period', 'week'),
      'guided_query', jsonb_build_object('used', v_gq, 'limit', case when v_plan = 'pro' then null else 3 end, 'period', 'day'),
      'import_ai', jsonb_build_object('used', v_ia, 'limit', case when v_plan = 'pro' then null else 3 end, 'period', 'month'),
      'chat', jsonb_build_object('used', 0, 'limit', case when v_plan = 'pro' then null else 0 end, 'period', 'day'),
      'voice', jsonb_build_object('used', 0, 'limit', case when v_plan = 'pro' then null else 0 end, 'period', 'day')
    )
  );
end; $$;
grant execute on function public.get_ai_quota_status() to authenticated;

-- Recargar caché de esquema de PostgREST / Supabase API
notify pgrst, 'reload schema';

