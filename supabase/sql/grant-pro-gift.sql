-- Plantilla para regalar Sabory Pro a testers o asignar Pro permanente (admin)
-- Sustituye AMIGO@EMAIL.COM por el email real de la cuenta en Supabase Auth.

insert into public.entitlements (user_id, plan, source, status, period_end)
values ((select id from auth.users where email = 'AMIGO@EMAIL.COM'), 'pro', 'gift', 'active', now() + interval '90 days')
on conflict (user_id) do update set
  plan = 'pro',
  source = 'gift',
  status = 'active',
  period_end = excluded.period_end,
  updated_at = now();

-- Para Pro permanente (Franky y su mujer): usar period_end = null y source = 'admin':
-- insert into public.entitlements (user_id, plan, source, status, period_end)
-- values ((select id from auth.users where email = 'FRANKY@EMAIL.COM'), 'pro', 'admin', 'active', null)
-- on conflict (user_id) do update set
--   plan = 'pro',
--   source = 'admin',
--   status = 'active',
--   period_end = null,
--   updated_at = now();
