-- US-88: Añadir métricas de almacenamiento BD e imágenes base64 a admin_get_dashboard_stats
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
  v_storage jsonb;
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
      coalesce(e.source, 'none') as raw_source,
      coalesce(e.status, 'active') as raw_status,
      coalesce(e.is_trial, false) as is_trial,
      e.play_product_id,
      coalesce(public.has_own_pro(u.id), false) as own_pro,
      (public.effective_plan(u.id) = 'pro' and not coalesce(public.has_own_pro(u.id), false)) as hh_pro
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

  select jsonb_build_object(
    'db_bytes', pg_database_size(current_database())::bigint,
    'recipes_table_bytes', pg_total_relation_size('public.recipes')::bigint,
    'meal_plans_table_bytes', pg_total_relation_size('public.meal_plans')::bigint,
    'shopping_items_table_bytes', pg_total_relation_size('public.shopping_items')::bigint,
    'ai_usage_table_bytes', pg_total_relation_size('public.ai_usage')::bigint,
    'recipes_with_base64_images', (select count(*)::int from public.recipes where image_url like 'data:image%'),
    'base64_images_bytes', (select coalesce(sum(octet_length(image_url)), 0)::bigint from public.recipes where image_url like 'data:image%')
  ) into v_storage;

  return jsonb_build_object(
    'users', v_users,
    'plans', v_plans,
    'catalog', v_catalog,
    'top_domains', v_top_domains,
    'ai', v_ai,
    'ai_heavy_users', v_heavy_users,
    'ai_free_capped_users', v_free_capped,
    'storage', v_storage
  );
end; $$;
revoke execute on function public.admin_get_dashboard_stats(int) from public, anon;
grant execute on function public.admin_get_dashboard_stats(int) to authenticated;
