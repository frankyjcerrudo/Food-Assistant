-- Plantilla para conceder acceso de administrador a Sabory Admin (US-87a)
-- Sustituye FRANKY@EMAIL.COM por el email real de tu cuenta en Supabase Auth.

insert into public.admin_users (user_id, email, role)
select id, email, 'superadmin'
from auth.users
where email = 'FRANKY@EMAIL.COM'
on conflict (user_id) do update set
  email = excluded.email,
  role = 'superadmin';
