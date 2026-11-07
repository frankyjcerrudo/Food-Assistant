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

alter table public.user_settings enable row level security;

drop policy if exists "Users own settings select" on public.user_settings;
create policy "Users own settings select" on public.user_settings for select using (auth.uid() = user_id);

drop policy if exists "Users own settings insert" on public.user_settings;
create policy "Users own settings insert" on public.user_settings for insert with check (auth.uid() = user_id);

drop policy if exists "Users own settings update" on public.user_settings;
create policy "Users own settings update" on public.user_settings for update using (auth.uid() = user_id);

drop policy if exists "Users own settings delete" on public.user_settings;
create policy "Users own settings delete" on public.user_settings for delete using (auth.uid() = user_id);


-- 5. CONTROL EXTERNO POR IA / VOZ / MCP (US-69, Fase 3)
alter table public.user_settings add column if not exists agent_token_hash text default null;
alter table public.user_settings add column if not exists agent_enabled boolean not null default false;
alter table public.user_settings add column if not exists default_servings integer not null default 2;
create index if not exists user_settings_agent_token_hash_idx on public.user_settings (agent_token_hash) where agent_token_hash is not null;

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

drop policy if exists "Households insert policy" on public.households;
create policy "Households insert policy" on public.households
  for insert with check (auth.uid() = owner_id);

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

drop policy if exists "Household members insert policy" on public.household_members;
create policy "Household members insert policy" on public.household_members
  for insert with check (auth.uid() = user_id);

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
-- 7. CONFIGURACIÓN GLOBAL DE APLICACIÓN (CLAVE IA POR DEFECTO PARA CUENTAS)
-- -----------------------------------------------------------------------------
create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

drop policy if exists "Authenticated users can read app_config" on public.app_config;
create policy "Authenticated users can read app_config" on public.app_config
  for select using (auth.uid() is not null);

drop policy if exists "Authenticated users can insert app_config" on public.app_config;
create policy "Authenticated users can insert app_config" on public.app_config
  for insert with check (auth.uid() is not null);

drop policy if exists "Authenticated users can update app_config" on public.app_config;
create policy "Authenticated users can update app_config" on public.app_config
  for update using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Recargar caché de esquema de PostgREST / Supabase API
notify pgrst, 'reload schema';

