-- Verificación manual de US-79c en el SQL Editor de Supabase
-- Ejecuta cada bloque por separado sustituyendo <UUID_PRUEBA> por el user_id de tu usuario de prueba.

-- 1. Dar Pro temporal a un usuario de prueba (o comprobar que no tiene entitlements para probar Free):
-- insert into public.entitlements (user_id, plan, source, status, period_end)
-- values ('<UUID_PRUEBA>', 'pro', 'gift', 'active', now() + interval '7 days')
-- on conflict (user_id) do update set plan = 'pro', source = 'gift', status = 'active', period_end = excluded.period_end;

-- 2. Comprobar el plan efectivo:
-- select public.effective_plan('<UUID_PRUEBA>');

-- 3. Simular 4 llamadas seguidas a consume_ai_quota con guided_query en un usuario Free
--    (la 4.ª debe devolver {"allowed": false, "code": "QUOTA_EXCEEDED", ...}):
-- select public.consume_ai_quota('<UUID_PRUEBA>', 'guided_query');
-- select public.consume_ai_quota('<UUID_PRUEBA>', 'guided_query');
-- select public.consume_ai_quota('<UUID_PRUEBA>', 'guided_query');
-- select public.consume_ai_quota('<UUID_PRUEBA>', 'guided_query');

-- 4. Limpiar las filas de prueba en ai_usage:
-- delete from public.ai_usage where user_id = '<UUID_PRUEBA>';
