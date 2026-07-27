-- ============================================================
--  SHOWCLINIC - PUNTOS DEL PACIENTE SIEMPRE ACTUALIZADOS
-- ============================================================
--  Hoy el paciente ve los puntos congelados desde que inicio
--  sesion. Si la clinica le carga puntos, no los ve hasta
--  cerrar sesion y volver a entrar.
--
--  Esto crea una forma SEGURA de refrescarlos: cada paciente
--  recibe una llave privada al entrar, y solo con esa llave
--  puede consultar SUS PROPIOS datos. Nadie puede ver los de otro.
--
--  Copia TODO y pegalo en Supabase > SQL Editor > Run.
-- ============================================================


-- ------------------------------------------------------------
-- PASO 1 - Guardar la llave de sesion de cada paciente
-- ------------------------------------------------------------
alter table public.clients
  add column if not exists session_token uuid;


-- ------------------------------------------------------------
-- PASO 2 - Entregar una llave nueva al iniciar sesion
--          (solo si el usuario y la contrasena son correctos)
-- ------------------------------------------------------------
create or replace function public.issue_client_token(
  p_username text,
  p_password text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id    integer;
  v_token uuid;
begin
  select id into v_id
  from public.clients
  where lower(username) = lower(trim(p_username))
    and password_hash is not null
    and password_hash = crypt(p_password, password_hash)
  limit 1;

  if v_id is null then
    return null;   -- credenciales incorrectas
  end if;

  v_token := gen_random_uuid();
  update public.clients set session_token = v_token where id = v_id;
  return v_token;
end;
$$;


-- ------------------------------------------------------------
-- PASO 3 - Consultar los datos propios usando la llave
-- ------------------------------------------------------------
create or replace function public.refresh_client(
  p_id    integer,
  p_token uuid
)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row record;
begin
  select id, name, last_name, username, phone, points, points_history, created_at
  into v_row
  from public.clients
  where id = p_id
    and session_token is not null
    and session_token = p_token
  limit 1;

  if not found then
    return null;   -- llave invalida o de otro paciente
  end if;

  return row_to_json(v_row);
end;
$$;


-- ------------------------------------------------------------
-- PASO 4 - Permitir que la pagina llame a estas funciones
-- ------------------------------------------------------------
grant execute on function public.issue_client_token(text, text) to anon, authenticated;
grant execute on function public.refresh_client(integer, uuid)  to anon, authenticated;


-- ============================================================
--  VERIFICACION
-- ============================================================
-- Deben aparecer las 2 funciones con seguridad = 'definer'
select proname as funcion,
       case when prosecdef then 'definer' else 'REVISAR' end as seguridad
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname in ('issue_client_token', 'refresh_client')
order by proname;
