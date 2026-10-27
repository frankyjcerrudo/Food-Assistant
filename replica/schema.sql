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
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Si la tabla ya existía con clave primaria simple, aplicar migraciones idempotentes:
alter table public.recipes add column if not exists source_url text default '';
alter table public.recipes add column if not exists source_domain text default '';

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
  updated_at timestamptz not null default now(),
  primary key (user_id)
);

alter table public.user_settings enable row level security;

drop policy if exists "Users own settings select" on public.user_settings;
create policy "Users own settings select" on public.user_settings for select using (auth.uid() = user_id);

drop policy if exists "Users own settings insert" on public.user_settings;
create policy "Users own settings insert" on public.user_settings for insert with check (auth.uid() = user_id);

drop policy if exists "Users own settings update" on public.user_settings;
create policy "Users own settings update" on public.user_settings for update using (auth.uid() = user_id);

drop policy if exists "Users own settings delete" on public.user_settings;
create policy "Users own settings delete" on public.user_settings for delete using (auth.uid() = user_id);

