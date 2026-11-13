-- 11. PLANES Y CUOTAS (US-79c)
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

  v_since := (date_trunc(v_period, v_local) at time zone 'Europe/Madrid');
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

notify pgrst, 'reload schema';
