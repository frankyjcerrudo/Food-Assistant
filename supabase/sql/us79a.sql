-- 9. REGISTRO DE USO DE IA (US-79a)
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

notify pgrst, 'reload schema';
