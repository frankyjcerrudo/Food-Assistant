-- 12. PANEL DE ADMINISTRACIÓN / BACKOFFICE (US-87a)

-- Ampliar ai_usage.status para soportar reseteo administrativo sin perder histórico de tokens
do $$
declare
  c_name text;
begin
  select con.conname into c_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'ai_usage'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%status%';

  if c_name is not null then
    execute format('alter table public.ai_usage drop constraint %I', c_name);
  end if;
  alter table public.ai_usage
    add constraint ai_usage_status_check check (status in ('pending','ok','error','reset'));
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  role text not null default 'admin' check (role in ('superadmin','admin','support')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
drop policy if exists "Admins read own row" on public.admin_users;
create policy "Admins read own row" on public.admin_users
  for select using (auth.uid() = user_id);
-- Sin políticas de insert/update/delete: solo modificable desde SQL Editor / service_role.

create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_user_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_target_idx on public.admin_audit_log (target_user_id, created_at desc);
alter table public.admin_audit_log enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins read audit log" on public.admin_audit_log;
create policy "Admins read audit log" on public.admin_audit_log
  for select using (public.is_admin());
-- Sin políticas de escritura cliente: solo insertan las RPCs security definer.

-- 1) Estadísticas ejecutivas para Dashboard y Monitor de IA
create or replace function public.admin_get_dashboard_stats(p_days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
declare
  v_days int := greatest(1, least(coalesce(p_days, 30), 365));
  v_local timestamp := (now() at time zone 'Europe/Madrid');
  v_today_start timestamptz := (date_trunc('day', v_local) at time zone 'Europe/Madrid');
  v_week_start timestamptz := (date_trunc('week', v_local) at time zone 'Europe/Madrid');
  v_month_start timestamptz := (date_trunc('month', v_local) at time zone 'Europe/Madrid');
  v_users jsonb;
  v_plans jsonb;
  v_catalog jsonb;
  v_top_domains jsonb;
  v_ai jsonb;
  v_heavy_users jsonb;
  v_free_capped jsonb;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'total', count(*)::int,
    'dau', count(*) filter (where last_sign_in_at >= now() - interval '1 day')::int,
    'wau', count(*) filter (where last_sign_in_at >= now() - interval '7 days')::int,
    'mau', count(*) filter (where last_sign_in_at >= now() - interval '30 days')::int,
    'new_7d', count(*) filter (where created_at >= now() - interval '7 days')::int,
    'new_30d', count(*) filter (where created_at >= now() - interval '30 days')::int
  ) into v_users
  from auth.users;

  with user_plans as (
    select
      u.id as user_id,
      e.source as raw_source,
      e.status as raw_status,
      coalesce(e.is_trial, false) as is_trial,
      e.play_product_id,
      (
        e.plan = 'pro'
        and e.status in ('active','grace','canceled')
        and (e.period_end is null or e.period_end > now())
      ) as own_pro,
      exists (
        select 1
        from public.household_members hm
        join public.households h on h.id = hm.household_id
        join public.entitlements oe on oe.user_id = h.owner_id
        where hm.user_id = u.id
          and oe.plan = 'pro'
          and oe.status in ('active','grace','canceled')
          and (oe.period_end is null or oe.period_end > now())
      ) as hh_pro
    from auth.users u
    left join public.entitlements e on e.user_id = u.id
  )
  select jsonb_build_object(
    'free', count(*) filter (where not own_pro and not hh_pro)::int,
    'play_monthly', count(*) filter (where own_pro and raw_source = 'play' and not is_trial and coalesce(play_product_id, '') <> 'sabory_pro_annual')::int,
    'play_annual', count(*) filter (where own_pro and raw_source = 'play' and not is_trial and play_product_id = 'sabory_pro_annual')::int,
    'trial', count(*) filter (where own_pro and raw_source = 'play' and is_trial)::int,
    'gift', count(*) filter (where own_pro and raw_source = 'gift')::int,
    'admin', count(*) filter (where own_pro and raw_source = 'admin')::int,
    'household_pro', count(*) filter (where not own_pro and hh_pro)::int,
    'on_hold', count(*) filter (where raw_status = 'on_hold')::int,
    'canceled_active', count(*) filter (where own_pro and raw_status = 'canceled')::int
  ) into v_plans
  from user_plans;

  select jsonb_build_object(
    'total_recipes', (select count(*)::int from public.recipes),
    'total_meal_plans', (select count(*)::int from public.meal_plans),
    'total_shopping_items', (select count(*)::int from public.shopping_items),
    'total_households', (select count(*)::int from public.households),
    'paused_households', (
      select count(*)::int from public.households h where not public.has_own_pro(h.owner_id)
    )
  ) into v_catalog;

  select coalesce(jsonb_agg(row_to_json(d)), '[]'::jsonb)
  into v_top_domains
  from (
    select lower(trim(source_domain)) as domain, count(*)::int as count
    from public.recipes
    where source_domain is not null and trim(source_domain) <> ''
    group by lower(trim(source_domain))
    order by count(*) desc, domain asc
    limit 15
  ) d;

  select jsonb_build_object(
    'today_calls', (select count(*)::int from public.ai_usage where created_at >= v_today_start),
    'today_ok', (select count(*)::int from public.ai_usage where created_at >= v_today_start and status = 'ok'),
    'today_error', (select count(*)::int from public.ai_usage where created_at >= v_today_start and status = 'error'),
    'period_days', v_days,
    'calls_total', count(*)::int,
    'calls_ok', count(*) filter (where status = 'ok')::int,
    'calls_error', count(*) filter (where status = 'error')::int,
    'calls_reset', count(*) filter (where status = 'reset')::int,
    'prompt_tokens', coalesce(sum(prompt_tokens), 0)::bigint,
    'output_tokens', coalesce(sum(output_tokens), 0)::bigint,
    'by_feature_model', coalesce((
      select jsonb_agg(row_to_json(m))
      from (
        select
          feature,
          coalesce(nullif(model, ''), 'unknown') as model,
          count(*)::int as calls,
          count(*) filter (where status = 'ok')::int as ok_calls,
          count(*) filter (where status = 'error')::int as error_calls,
          count(*) filter (where status = 'reset')::int as reset_calls,
          coalesce(sum(prompt_tokens), 0)::bigint as prompt_tokens,
          coalesce(sum(output_tokens), 0)::bigint as output_tokens
        from public.ai_usage
        where created_at >= now() - make_interval(days => v_days)
        group by feature, coalesce(nullif(model, ''), 'unknown')
        order by calls desc
      ) m
    ), '[]'::jsonb)
  ) into v_ai
  from public.ai_usage
  where created_at >= now() - make_interval(days => v_days);

  select coalesce(jsonb_agg(row_to_json(hu)), '[]'::jsonb)
  into v_heavy_users
  from (
    select
      a.user_id,
      coalesce(u.email, '') as email,
      coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '') as display_name,
      public.effective_plan(a.user_id) as plan,
      count(*) filter (where a.created_at >= v_today_start and a.status in ('pending','ok'))::int as calls_today,
      count(*) filter (where a.created_at >= now() - interval '7 days' and a.status in ('pending','ok'))::int as calls_7d,
      coalesce(sum(a.prompt_tokens + a.output_tokens) filter (where a.created_at >= now() - interval '7 days'), 0)::bigint as tokens_7d
    from public.ai_usage a
    join auth.users u on u.id = a.user_id
    where a.created_at >= now() - interval '7 days'
    group by a.user_id, u.email, u.raw_user_meta_data
    having count(*) filter (where a.created_at >= now() - interval '7 days' and a.status in ('pending','ok')) > 0
    order by calls_today desc, calls_7d desc
    limit 15
  ) hu;

  select coalesce(jsonb_agg(row_to_json(fc)), '[]'::jsonb)
  into v_free_capped
  from (
    select
      u.id as user_id,
      coalesce(u.email, '') as email,
      coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '') as display_name,
      count(*) filter (where a.feature = 'weekly_plan' and a.created_at >= v_week_start and a.status in ('pending','ok'))::int as weekly_plan_used,
      count(*) filter (where a.feature = 'guided_query' and a.created_at >= v_today_start and a.status in ('pending','ok'))::int as guided_query_used,
      count(*) filter (where a.feature = 'import_ai' and a.created_at >= v_month_start and a.status in ('pending','ok'))::int as import_ai_used
    from auth.users u
    join public.ai_usage a on a.user_id = u.id
    where public.effective_plan(u.id) = 'free'
      and a.status in ('pending','ok')
      and a.created_at >= least(v_week_start, v_month_start)
    group by u.id, u.email, u.raw_user_meta_data
    having
      count(*) filter (where a.feature = 'weekly_plan' and a.created_at >= v_week_start and a.status in ('pending','ok')) >= 1
      or count(*) filter (where a.feature = 'guided_query' and a.created_at >= v_today_start and a.status in ('pending','ok')) >= 3
      or count(*) filter (where a.feature = 'import_ai' and a.created_at >= v_month_start and a.status in ('pending','ok')) >= 3
    order by (
      count(*) filter (where a.feature = 'guided_query' and a.created_at >= v_today_start and a.status in ('pending','ok'))
      + count(*) filter (where a.feature = 'weekly_plan' and a.created_at >= v_week_start and a.status in ('pending','ok'))
      + count(*) filter (where a.feature = 'import_ai' and a.created_at >= v_month_start and a.status in ('pending','ok'))
    ) desc
    limit 20
  ) fc;

  return jsonb_build_object(
    'users', v_users,
    'plans', v_plans,
    'catalog', v_catalog,
    'top_domains', v_top_domains,
    'ai', v_ai,
    'ai_heavy_users', v_heavy_users,
    'ai_free_capped_users', v_free_capped
  );
end; $$;
revoke execute on function public.admin_get_dashboard_stats(int) from public, anon;
grant execute on function public.admin_get_dashboard_stats(int) to authenticated;

-- 2) Listado paginado y filtrable de usuarios
create or replace function public.admin_list_users(
  p_search text default '',
  p_plan text default 'all',
  p_source text default 'all',
  p_status text default 'all',
  p_limit int default 25,
  p_offset int default 0
) returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
declare
  v_search text := trim(coalesce(p_search, ''));
  v_plan text := coalesce(nullif(trim(p_plan), ''), 'all');
  v_source text := coalesce(nullif(trim(p_source), ''), 'all');
  v_status text := coalesce(nullif(trim(p_status), ''), 'all');
  v_limit int := greatest(1, least(coalesce(p_limit, 25), 100));
  v_offset int := greatest(0, coalesce(p_offset, 0));
  v_total int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  with user_base as (
    select
      u.id,
      coalesce(u.email, '') as email,
      coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '') as display_name,
      u.created_at,
      u.last_sign_in_at,
      public.effective_plan(u.id) as effective_plan,
      public.has_own_pro(u.id) as own_pro,
      coalesce(e.plan, 'free') as raw_plan,
      coalesce(e.source, 'none') as raw_source,
      coalesce(e.status, 'active') as raw_status,
      e.period_end,
      coalesce(e.is_trial, false) as is_trial,
      e.play_product_id,
      us.active_household_id
    from auth.users u
    left join public.entitlements e on e.user_id = u.id
    left join public.user_settings us on us.user_id = u.id
  ),
  normalized as (
    select
      *,
      (effective_plan = 'pro' and not own_pro) as via_household,
      case
        when effective_plan = 'pro' and not own_pro then 'household'
        else raw_source
      end as display_source
    from user_base
  ),
  filtered as (
    select *
    from normalized
    where (
      v_search = ''
      or email ilike '%' || v_search || '%'
      or display_name ilike '%' || v_search || '%'
      or id::text ilike '%' || v_search || '%'
    )
      and (v_plan = 'all' or effective_plan = v_plan)
      and (v_source = 'all' or display_source = v_source)
      and (v_status = 'all' or raw_status = v_status)
  ),
  paged as (
    select *
    from filtered
    order by created_at desc
    limit v_limit offset v_offset
  )
  select
    (select count(*)::int from filtered),
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'email', p.email,
        'display_name', p.display_name,
        'created_at', p.created_at,
        'last_sign_in_at', p.last_sign_in_at,
        'effective_plan', p.effective_plan,
        'own_pro', p.own_pro,
        'via_household', p.via_household,
        'raw_plan', p.raw_plan,
        'source', p.display_source,
        'raw_source', p.raw_source,
        'status', p.raw_status,
        'period_end', p.period_end,
        'is_trial', p.is_trial,
        'play_product_id', p.play_product_id,
        'active_household_id', p.active_household_id,
        'recipes_count', (select count(*)::int from public.recipes r where r.user_id = p.id),
        'ai_calls_30d', (select count(*)::int from public.ai_usage a where a.user_id = p.id and a.created_at >= now() - interval '30 days')
      ) order by p.created_at desc)
      from paged p
    ), '[]'::jsonb)
  into v_total, v_items;

  return jsonb_build_object(
    'total', v_total,
    'limit', v_limit,
    'offset', v_offset,
    'items', v_items
  );
end; $$;
revoke execute on function public.admin_list_users(text, text, text, text, int, int) from public, anon;
grant execute on function public.admin_list_users(text, text, text, text, int, int) to authenticated;

-- 3) Ficha 360º de usuario
create or replace function public.admin_get_user_detail(p_user_id uuid) returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
declare
  v_user record;
  v_ent public.entitlements%rowtype;
  v_settings public.user_settings%rowtype;
  v_local timestamp := (now() at time zone 'Europe/Madrid');
  v_day_start timestamptz := (date_trunc('day', v_local) at time zone 'Europe/Madrid');
  v_week_start timestamptz := (date_trunc('week', v_local) at time zone 'Europe/Madrid');
  v_month_start timestamptz := (date_trunc('month', v_local) at time zone 'Europe/Madrid');
  v_eff_plan text;
  v_own_pro boolean;
  v_household jsonb := null;
  v_audit jsonb := '[]'::jsonb;
  v_is_user_admin boolean := false;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select
    u.id,
    coalesce(u.email, '') as email,
    coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '') as display_name,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at,
    coalesce(u.raw_app_meta_data->>'provider', 'email') as provider
  into v_user
  from auth.users u
  where u.id = p_user_id;

  if not found then
    raise exception 'USER_NOT_FOUND' using errcode = 'P0002';
  end if;

  select * into v_ent from public.entitlements where user_id = p_user_id;
  select * into v_settings from public.user_settings where user_id = p_user_id;
  select exists (select 1 from public.admin_users where user_id = p_user_id) into v_is_user_admin;

  v_eff_plan := public.effective_plan(p_user_id);
  v_own_pro := public.has_own_pro(p_user_id);

  select jsonb_build_object(
    'id', h.id,
    'name', h.name,
    'invite_code', h.invite_code,
    'owner_id', h.owner_id,
    'owner_email', coalesce(ou.email, ''),
    'owner_has_pro', public.has_own_pro(h.owner_id),
    'role', hm.role
  ) into v_household
  from public.household_members hm
  join public.households h on h.id = hm.household_id
  left join auth.users ou on ou.id = h.owner_id
  where hm.user_id = p_user_id
  order by (h.id = v_settings.active_household_id) desc, hm.joined_at desc
  limit 1;

  select coalesce(jsonb_agg(row_to_json(al)), '[]'::jsonb)
  into v_audit
  from (
    select
      l.id,
      l.admin_id,
      coalesce(au.email, '') as admin_email,
      l.action,
      l.target_user_id,
      l.payload,
      l.created_at
    from public.admin_audit_log l
    left join auth.users au on au.id = l.admin_id
    where l.target_user_id = p_user_id
    order by l.created_at desc, l.id desc
    limit 20
  ) al;

  return jsonb_build_object(
    'user', jsonb_build_object(
      'id', v_user.id,
      'email', v_user.email,
      'display_name', v_user.display_name,
      'created_at', v_user.created_at,
      'last_sign_in_at', v_user.last_sign_in_at,
      'email_confirmed_at', v_user.email_confirmed_at,
      'provider', v_user.provider,
      'is_admin', v_is_user_admin
    ),
    'entitlement', jsonb_build_object(
      'plan', coalesce(v_ent.plan, 'free'),
      'effective_plan', v_eff_plan,
      'own_pro', v_own_pro,
      'via_household', (v_eff_plan = 'pro' and not v_own_pro),
      'source', coalesce(v_ent.source, 'none'),
      'status', coalesce(v_ent.status, 'active'),
      'period_end', v_ent.period_end,
      'is_trial', coalesce(v_ent.is_trial, false),
      'play_product_id', v_ent.play_product_id,
      'updated_at', v_ent.updated_at
    ),
    'settings', jsonb_build_object(
      'dietary_preferences', coalesce(to_jsonb(v_settings.dietary_preferences), '[]'::jsonb),
      'custom_tags', coalesce(to_jsonb(v_settings.custom_tags), '[]'::jsonb),
      'nutrition_goals', coalesce(v_settings.nutrition_goals, '{}'::jsonb),
      'default_servings', coalesce(v_settings.default_servings, 2),
      'active_household_id', v_settings.active_household_id
    ),
    'activity', jsonb_build_object(
      'recipes_count', (select count(*)::int from public.recipes where user_id = p_user_id),
      'meal_plans_count', (select count(*)::int from public.meal_plans where user_id = p_user_id),
      'shopping_items_count', (select count(*)::int from public.shopping_items where user_id = p_user_id),
      'ai_calls_30d', (select count(*)::int from public.ai_usage where user_id = p_user_id and created_at >= now() - interval '30 days'),
      'prompt_tokens_30d', (select coalesce(sum(prompt_tokens), 0)::bigint from public.ai_usage where user_id = p_user_id and created_at >= now() - interval '30 days'),
      'output_tokens_30d', (select coalesce(sum(output_tokens), 0)::bigint from public.ai_usage where user_id = p_user_id and created_at >= now() - interval '30 days')
    ),
    'quotas', jsonb_build_object(
      'weekly_plan', (select count(*)::int from public.ai_usage where user_id = p_user_id and feature = 'weekly_plan' and status in ('pending','ok') and created_at >= v_week_start),
      'guided_query', (select count(*)::int from public.ai_usage where user_id = p_user_id and feature = 'guided_query' and status in ('pending','ok') and created_at >= v_day_start),
      'import_ai', (select count(*)::int from public.ai_usage where user_id = p_user_id and feature = 'import_ai' and status in ('pending','ok') and created_at >= v_month_start),
      'chat', (select count(*)::int from public.ai_usage where user_id = p_user_id and feature = 'chat' and status in ('pending','ok') and created_at >= v_day_start),
      'voice', (select count(*)::int from public.ai_usage where user_id = p_user_id and feature = 'voice' and status in ('pending','ok') and created_at >= v_day_start)
    ),
    'household', v_household,
    'audit_log', v_audit
  );
end; $$;
revoke execute on function public.admin_get_user_detail(uuid) from public, anon;
grant execute on function public.admin_get_user_detail(uuid) to authenticated;

-- 4) Conceder / extender / revocar plan o regalo Pro
create or replace function public.admin_set_user_entitlement(
  p_user_id uuid,
  p_plan text,
  p_source text,
  p_status text default 'active',
  p_days int default null,
  p_notes text default ''
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_prev_end timestamptz;
  v_period_end timestamptz;
  v_base timestamptz;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'USER_NOT_FOUND' using errcode = 'P0002';
  end if;

  if p_plan not in ('free','pro') then
    raise exception 'INVALID_PLAN' using errcode = '22023';
  end if;
  if p_source not in ('none','play','gift','admin') then
    raise exception 'INVALID_SOURCE' using errcode = '22023';
  end if;
  if p_status not in ('active','grace','on_hold','canceled','expired') then
    raise exception 'INVALID_STATUS' using errcode = '22023';
  end if;
  if p_plan = 'pro' and p_source = 'none' then
    raise exception 'INVALID_PRO_SOURCE' using errcode = '22023';
  end if;

  if p_plan = 'free' then
    v_period_end := null;
  elsif p_source = 'admin' and p_days is null then
    v_period_end := null;
  else
    if p_days is null or p_days <= 0 then
      raise exception 'INVALID_DAYS' using errcode = '22023';
    end if;
    select period_end into v_prev_end
    from public.entitlements
    where user_id = p_user_id and plan = 'pro' and status in ('active','grace','canceled');
    v_base := greatest(coalesce(v_prev_end, now()), now());
    v_period_end := v_base + make_interval(days => p_days);
  end if;

  insert into public.entitlements (user_id, plan, source, status, period_end, is_trial, updated_at)
  values (p_user_id, p_plan, p_source, p_status, v_period_end, false, now())
  on conflict (user_id) do update set
    plan = excluded.plan,
    source = excluded.source,
    status = excluded.status,
    period_end = excluded.period_end,
    is_trial = case when excluded.plan = 'free' then false else public.entitlements.is_trial end,
    updated_at = now();

  insert into public.admin_audit_log (admin_id, action, target_user_id, payload)
  values (
    auth.uid(),
    'set_entitlement',
    p_user_id,
    jsonb_build_object(
      'plan', p_plan,
      'source', p_source,
      'status', p_status,
      'days', p_days,
      'period_end', v_period_end,
      'notes', coalesce(p_notes, '')
    )
  );

  return jsonb_build_object(
    'ok', true,
    'user_id', p_user_id,
    'plan', p_plan,
    'source', p_source,
    'status', p_status,
    'period_end', v_period_end,
    'effective_plan', public.effective_plan(p_user_id)
  );
end; $$;
revoke execute on function public.admin_set_user_entitlement(uuid, text, text, text, int, text) from public, anon;
grant execute on function public.admin_set_user_entitlement(uuid, text, text, text, int, text) to authenticated;

-- 5) Reseteo administrativo de cuotas de IA sin borrar histórico de tokens
create or replace function public.admin_reset_user_ai_quota(
  p_user_id uuid,
  p_feature text default 'all',
  p_notes text default ''
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_feature text := coalesce(nullif(trim(p_feature), ''), 'all');
  v_local timestamp := (now() at time zone 'Europe/Madrid');
  v_day_start timestamptz := (date_trunc('day', v_local) at time zone 'Europe/Madrid');
  v_week_start timestamptz := (date_trunc('week', v_local) at time zone 'Europe/Madrid');
  v_month_start timestamptz := (date_trunc('month', v_local) at time zone 'Europe/Madrid');
  v_count int := 0;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  if v_feature not in ('all','weekly_plan','guided_query','import_ai','chat','voice') then
    raise exception 'INVALID_FEATURE' using errcode = '22023';
  end if;

  update public.ai_usage
  set status = 'reset'
  where user_id = p_user_id
    and status in ('pending','ok')
    and (
      (v_feature = 'all' and (
        (feature in ('guided_query','chat','voice') and created_at >= v_day_start)
        or (feature = 'weekly_plan' and created_at >= v_week_start)
        or (feature = 'import_ai' and created_at >= v_month_start)
      ))
      or (feature = v_feature and created_at >= case
        when v_feature = 'weekly_plan' then v_week_start
        when v_feature = 'import_ai' then v_month_start
        else v_day_start
      end)
    );
  get diagnostics v_count = row_count;

  insert into public.admin_audit_log (admin_id, action, target_user_id, payload)
  values (
    auth.uid(),
    'reset_ai_quota',
    p_user_id,
    jsonb_build_object(
      'feature', v_feature,
      'rows_reset', v_count,
      'notes', coalesce(p_notes, '')
    )
  );

  return jsonb_build_object(
    'ok', true,
    'user_id', p_user_id,
    'feature', v_feature,
    'rows_reset', v_count
  );
end; $$;
revoke execute on function public.admin_reset_user_ai_quota(uuid, text, text) from public, anon;
grant execute on function public.admin_reset_user_ai_quota(uuid, text, text) to authenticated;

-- 6) Listado paginado de hogares (Modo Familia)
create or replace function public.admin_list_households(
  p_search text default '',
  p_limit int default 25,
  p_offset int default 0
) returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
declare
  v_search text := trim(coalesce(p_search, ''));
  v_limit int := greatest(1, least(coalesce(p_limit, 25), 100));
  v_offset int := greatest(0, coalesce(p_offset, 0));
  v_total int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  with hh_base as (
    select
      h.id,
      h.name,
      h.invite_code,
      h.owner_id,
      coalesce(ou.email, '') as owner_email,
      public.has_own_pro(h.owner_id) as owner_has_pro,
      h.created_at
    from public.households h
    left join auth.users ou on ou.id = h.owner_id
    where (
      v_search = ''
      or h.name ilike '%' || v_search || '%'
      or h.invite_code ilike '%' || v_search || '%'
      or ou.email ilike '%' || v_search || '%'
    )
  ),
  paged as (
    select *
    from hh_base
    order by created_at desc
    limit v_limit offset v_offset
  )
  select
    (select count(*)::int from hh_base),
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'invite_code', p.invite_code,
        'owner_id', p.owner_id,
        'owner_email', p.owner_email,
        'owner_has_pro', p.owner_has_pro,
        'is_paused', (not p.owner_has_pro),
        'created_at', p.created_at,
        'members_count', (select count(*)::int from public.household_members hm where hm.household_id = p.id),
        'recipes_count', (select count(*)::int from public.recipes r where r.household_id = p.id),
        'members', coalesce((
          select jsonb_agg(jsonb_build_object(
            'user_id', hm.user_id,
            'role', hm.role,
            'display_name', hm.display_name,
            'email', coalesce(nullif(hm.email, ''), mu.email, ''),
            'joined_at', hm.joined_at
          ) order by (hm.user_id = p.owner_id) desc, hm.joined_at asc)
          from public.household_members hm
          left join auth.users mu on mu.id = hm.user_id
          where hm.household_id = p.id
        ), '[]'::jsonb)
      ) order by p.created_at desc)
      from paged p
    ), '[]'::jsonb)
  into v_total, v_items;

  return jsonb_build_object(
    'total', v_total,
    'limit', v_limit,
    'offset', v_offset,
    'items', v_items
  );
end; $$;
revoke execute on function public.admin_list_households(text, int, int) from public, anon;
grant execute on function public.admin_list_households(text, int, int) to authenticated;

-- 7) Gestión administrativa de hogares (transferir titularidad, expulsar miembro, regenerar código)
create or replace function public.admin_manage_household(
  p_household_id uuid,
  p_action text,
  p_target_user_id uuid default null
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_hh public.households%rowtype;
  v_new_code text := null;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  if p_action not in ('transfer_owner','remove_member','regenerate_code') then
    raise exception 'INVALID_ACTION' using errcode = '22023';
  end if;

  select * into v_hh from public.households where id = p_household_id;
  if not found then
    raise exception 'HOUSEHOLD_NOT_FOUND' using errcode = 'P0002';
  end if;

  if p_action = 'transfer_owner' then
    if p_target_user_id is null or not exists (
      select 1 from public.household_members hm
      where hm.household_id = p_household_id and hm.user_id = p_target_user_id
    ) then
      raise exception 'TARGET_NOT_MEMBER' using errcode = '22023';
    end if;
    update public.households set owner_id = p_target_user_id, updated_at = now()
      where id = p_household_id;
    update public.household_members
      set role = case when user_id = p_target_user_id then 'owner' else 'member' end
      where household_id = p_household_id;
  elsif p_action = 'remove_member' then
    if p_target_user_id is null then
      raise exception 'MISSING_TARGET_USER' using errcode = '22023';
    end if;
    if p_target_user_id = v_hh.owner_id then
      raise exception 'CANNOT_REMOVE_OWNER' using errcode = '22023';
    end if;
    delete from public.household_members
      where household_id = p_household_id and user_id = p_target_user_id;
    update public.user_settings set active_household_id = null, updated_at = now()
      where user_id = p_target_user_id and active_household_id = p_household_id;
  elsif p_action = 'regenerate_code' then
    v_new_code := upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 8));
    update public.households set invite_code = v_new_code, updated_at = now()
      where id = p_household_id;
  end if;

  insert into public.admin_audit_log (admin_id, action, target_user_id, payload)
  values (
    auth.uid(),
    'manage_household',
    p_target_user_id,
    jsonb_build_object(
      'household_id', p_household_id,
      'action', p_action,
      'invite_code', v_new_code
    )
  );

  return jsonb_build_object(
    'ok', true,
    'household_id', p_household_id,
    'action', p_action,
    'invite_code', v_new_code
  );
end; $$;
revoke execute on function public.admin_manage_household(uuid, text, uuid) from public, anon;
grant execute on function public.admin_manage_household(uuid, text, uuid) to authenticated;

-- 8) Soporte y GDPR: borrado seguro de datos o cuenta de usuario
create or replace function public.admin_delete_user_data(
  p_user_id uuid,
  p_mode text default 'wipe_data',
  p_notes text default ''
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_mode text := coalesce(nullif(trim(p_mode), ''), 'wipe_data');
  v_email text := '';
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  if v_mode not in ('wipe_data','delete_account') then
    raise exception 'INVALID_MODE' using errcode = '22023';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'CANNOT_DELETE_SELF' using errcode = '42501';
  end if;

  if exists (select 1 from public.admin_users a where a.user_id = p_user_id) then
    raise exception 'CANNOT_DELETE_ADMIN' using errcode = '42501';
  end if;

  select coalesce(email, '') into v_email from auth.users where id = p_user_id;
  if not found then
    raise exception 'USER_NOT_FOUND' using errcode = 'P0002';
  end if;

  delete from public.recipes where user_id = p_user_id;
  delete from public.meal_plans where user_id = p_user_id;
  delete from public.shopping_items where user_id = p_user_id;
  delete from public.household_members where user_id = p_user_id;
  delete from public.households where owner_id = p_user_id;
  delete from public.user_settings where user_id = p_user_id;
  delete from public.ai_usage where user_id = p_user_id;
  delete from public.entitlements where user_id = p_user_id;

  if v_mode = 'delete_account' then
    delete from auth.users where id = p_user_id;
  end if;

  insert into public.admin_audit_log (admin_id, action, target_user_id, payload)
  values (
    auth.uid(),
    'delete_user_data',
    p_user_id,
    jsonb_build_object(
      'mode', v_mode,
      'email', v_email,
      'notes', coalesce(p_notes, '')
    )
  );

  return jsonb_build_object(
    'ok', true,
    'user_id', p_user_id,
    'mode', v_mode
  );
end; $$;
revoke execute on function public.admin_delete_user_data(uuid, text, text) from public, anon;
grant execute on function public.admin_delete_user_data(uuid, text, text) to authenticated;

-- 9) Timeline global de auditoría administrativa
create or replace function public.admin_list_audit_log(
  p_limit int default 50,
  p_offset int default 0
) returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
declare
  v_limit int := greatest(1, least(coalesce(p_limit, 50), 200));
  v_offset int := greatest(0, coalesce(p_offset, 0));
  v_total int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select count(*)::int into v_total from public.admin_audit_log;

  select coalesce(jsonb_agg(row_to_json(al)), '[]'::jsonb)
  into v_items
  from (
    select
      l.id,
      l.admin_id,
      coalesce(au.email, '') as admin_email,
      l.action,
      l.target_user_id,
      coalesce(tu.email, l.payload->>'email', '') as target_email,
      l.payload,
      l.created_at
    from public.admin_audit_log l
    left join auth.users au on au.id = l.admin_id
    left join auth.users tu on tu.id = l.target_user_id
    order by l.created_at desc, l.id desc
    limit v_limit offset v_offset
  ) al;

  return jsonb_build_object(
    'total', v_total,
    'limit', v_limit,
    'offset', v_offset,
    'items', v_items
  );
end; $$;
revoke execute on function public.admin_list_audit_log(int, int) from public, anon;
grant execute on function public.admin_list_audit_log(int, int) to authenticated;

notify pgrst, 'reload schema';
