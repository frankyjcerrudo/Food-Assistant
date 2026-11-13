-- 10. LIMPIEZA BYOK / AGENTE EXTERNO (US-79b)
drop table if exists public.app_config;
drop table if exists public.external_agent_tokens;
drop index if exists public.user_settings_agent_token_hash_idx;
alter table public.user_settings drop column if exists agent_token_hash;
alter table public.user_settings drop column if exists agent_enabled;
alter table public.user_settings drop column if exists gemini_api_key;

notify pgrst, 'reload schema';
