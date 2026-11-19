-- US-90: Habilitar feature técnica 'utility_decision' para decisiones de utilidad
-- excluidas de las cuotas visibles del usuario (ej. resolveAisleOnline), con techo anti-abuso de 30/día en Free.
do $$
declare
  c_name text;
begin
  for c_name in
    select conname
    from pg_constraint
    where conrelid = 'public.ai_usage'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%feature%'
  loop
    execute format('alter table public.ai_usage drop constraint %I', c_name);
  end loop;
end $$;

alter table public.ai_usage
  add constraint ai_usage_feature_check
  check (feature in ('chat','voice','guided_query','weekly_plan','import_ai','utility_decision'));

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

  if p_feature not in ('chat','voice','guided_query','weekly_plan','import_ai','utility_decision') then
    return jsonb_build_object('allowed', false, 'code', 'INVALID_FEATURE');
  end if;

  if v_plan = 'pro' then
    v_limit := null; v_period := 'day';
  else
    if p_feature in ('chat','voice') then
      return jsonb_build_object('allowed', false, 'code', 'PRO_REQUIRED', 'plan', v_plan, 'feature', p_feature);
    elsif p_feature = 'weekly_plan' then v_limit := 1; v_period := 'week';
    elsif p_feature = 'guided_query' then v_limit := 3; v_period := 'day';
    elsif p_feature = 'import_ai' then v_limit := 3; v_period := 'month';
    elsif p_feature = 'utility_decision' then v_limit := 30; v_period := 'day';
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

notify pgrst, 'reload schema';
