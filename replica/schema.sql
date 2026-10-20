-- Schema for Samsung Food Clean-Room Replica (Food Assistant + Gemini AI)
-- Compatible with PostgreSQL 15+ / Supabase

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USERS & PREFERENCES
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text,
  preferences jsonb not null default '{
    "dietaryRestrictions": [],
    "dislikedIngredients": [],
    "defaultServings": 2,
    "geminiModel": "gemini-2.5-flash"
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. RECIPES
create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text default '',
  source_url text,
  source_platform text not null default 'manual'
    check (source_platform in ('manual', 'web', 'instagram', 'tiktok', 'youtube', 'gemini_ai')),
  image_url text,
  prep_time_minutes integer default 0 check (prep_time_minutes >= 0),
  cook_time_minutes integer default 0 check (cook_time_minutes >= 0),
  servings integer not null default 2 check (servings > 0),
  tags text[] default array[]::text[],
  -- Structured ingredients array: [{ name, amount, unit, rawText, aisle }]
  ingredients jsonb not null default '[]'::jsonb,
  -- Structured instructions array: [{ step: 1, text: "...", timerMinutes: 10 }]
  instructions jsonb not null default '[]'::jsonb,
  -- Optional nutrition: { calories, protein, carbs, fat }
  nutrition jsonb default null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for Recipes
create index if not exists idx_recipes_user_id on recipes(user_id);
create index if not exists idx_recipes_user_fav on recipes(user_id, is_favorite);
create index if not exists idx_recipes_tags on recipes using gin(tags);

-- 4. MEAL PLAN SLOTS (Weekly Calendar)
create table if not exists meal_plan_slots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  plan_date date not null,
  meal_type text not null
    check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id uuid references recipes(id) on delete set null,
  custom_title text, -- If the user eats out or has a meal without a saved recipe
  servings_override integer check (servings_override is null or servings_override > 0),
  notes text,
  created_at timestamptz not null default now(),
  -- Ensure no duplicate slots for the same meal type on the same date for the same recipe
  constraint uq_user_slot unique (user_id, plan_date, meal_type, recipe_id)
);

-- Indexes for Meal Planner
create index if not exists idx_meal_slots_user_date on meal_plan_slots(user_id, plan_date);

-- 5. SHOPPING LIST ITEMS
create table if not exists shopping_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  amount numeric(8,2),
  unit text,
  aisle text not null default 'other'
    check (aisle in ('produce', 'meat', 'dairy', 'bakery', 'pantry', 'spices', 'frozen', 'beverages', 'other')),
  is_checked boolean not null default false,
  recipe_origin_id uuid references recipes(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Indexes for Shopping List
create index if not exists idx_shopping_user_checked on shopping_items(user_id, is_checked, aisle);

-- 6. ROW LEVEL SECURITY (RLS) FOR SUPABASE / MULTI-TENANT
alter table users enable row level security;
alter table recipes enable row level security;
alter table meal_plan_slots enable row level security;
alter table shopping_items enable row level security;

-- Policies: Users can only see and mutate their own data
create policy "Users own profile" on users for all using (auth.uid() = id);
create policy "Users own recipes" on recipes for all using (auth.uid() = user_id);
create policy "Users own meal slots" on meal_plan_slots for all using (auth.uid() = user_id);
create policy "Users own shopping items" on shopping_items for all using (auth.uid() = user_id);
