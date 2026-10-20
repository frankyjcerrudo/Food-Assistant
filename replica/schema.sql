-- Schema for Food Assistant (Supabase PostgreSQL)
-- Ejecuta este script en Supabase: SQL Editor -> New Query -> Run

-- 1. TABLA DE RECETAS (Recipes)
create table if not exists public.recipes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  image_url text,
  prep_time_minutes integer default 0,
  cook_time_minutes integer default 0,
  servings integer not null default 2,
  tags text[] default array[]::text[],
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. TABLA DE PLAN SEMANAL (Meal Plans)
create table if not exists public.meal_plans (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date text not null,
  day_name text not null,
  lunch_recipe_id text,
  dinner_recipe_id text,
  updated_at timestamptz not null default now()
);

-- 3. TABLA DE LISTA DE LA COMPRA (Shopping Items)
create table if not exists public.shopping_items (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(8,2),
  unit text default '',
  aisle text not null default 'other',
  is_checked boolean not null default false,
  recipe_origin text,
  created_at timestamptz not null default now()
);

-- 4. SEGURIDAD RLS (Row Level Security)
-- Cada usuario solo puede ver, crear, modificar y eliminar sus propios datos
alter table public.recipes enable row level security;
alter table public.meal_plans enable row level security;
alter table public.shopping_items enable row level security;

-- Políticas de acceso para Recipes
create policy "Users own recipes select" on public.recipes for select using (auth.uid() = user_id);
create policy "Users own recipes insert" on public.recipes for insert with check (auth.uid() = user_id);
create policy "Users own recipes update" on public.recipes for update using (auth.uid() = user_id);
create policy "Users own recipes delete" on public.recipes for delete using (auth.uid() = user_id);

-- Políticas de acceso para Meal Plans
create policy "Users own meal_plans select" on public.meal_plans for select using (auth.uid() = user_id);
create policy "Users own meal_plans insert" on public.meal_plans for insert with check (auth.uid() = user_id);
create policy "Users own meal_plans update" on public.meal_plans for update using (auth.uid() = user_id);
create policy "Users own meal_plans delete" on public.meal_plans for delete using (auth.uid() = user_id);

-- Políticas de acceso para Shopping Items
create policy "Users own shopping select" on public.shopping_items for select using (auth.uid() = user_id);
create policy "Users own shopping insert" on public.shopping_items for insert with check (auth.uid() = user_id);
create policy "Users own shopping update" on public.shopping_items for update using (auth.uid() = user_id);
create policy "Users own shopping delete" on public.shopping_items for delete using (auth.uid() = user_id);
