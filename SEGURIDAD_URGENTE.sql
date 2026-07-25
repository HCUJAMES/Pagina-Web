-- ============================================================
--  SHOWCLINIC - BLINDAJE DE LA BASE DE DATOS
-- ============================================================
--  PROBLEMA: hoy cualquier persona en internet puede LEER,
--  MODIFICAR y BORRAR los datos de tus pacientes.
--
--  ANTES DE EJECUTAR:
--  1) Confirma que ENTRAS AL PANEL con tu correo (Supabase Auth).
--     Si no entras, avisa antes de correr esto.
--  2) Copia TODO este archivo en Supabase > SQL Editor > Run.
-- ============================================================


-- ------------------------------------------------------------
-- PASO 1 - Activar la proteccion (RLS)
-- ------------------------------------------------------------
alter table public.clients    enable row level security;
alter table public.treatments enable row level security;
alter table public.contacts   enable row level security;


-- ------------------------------------------------------------
-- PASO 2 - Cerrar el acceso publico directo a las tablas
-- ------------------------------------------------------------
revoke all on public.clients    from anon;
revoke all on public.treatments from anon;
revoke all on public.contacts   from anon;


-- ------------------------------------------------------------
-- PASO 3 - Los administradores (Supabase Auth) mantienen acceso
-- ------------------------------------------------------------
grant select, insert, update, delete on public.clients    to authenticated;
grant select, insert, update, delete on public.treatments to authenticated;
grant select, insert, update, delete on public.contacts   to authenticated;

drop policy if exists "admins_all_clients"    on public.clients;
drop policy if exists "admins_all_treatments" on public.treatments;
drop policy if exists "admins_all_contacts"   on public.contacts;

create policy "admins_all_clients" on public.clients
  for all to authenticated using (true) with check (true);

create policy "admins_all_treatments" on public.treatments
  for all to authenticated using (true) with check (true);

create policy "admins_all_contacts" on public.contacts
  for all to authenticated using (true) with check (true);


-- ------------------------------------------------------------
-- PASO 4 - El formulario de contacto sigue funcionando
--          (puede ESCRIBIR mensajes, pero NO leerlos)
-- ------------------------------------------------------------
grant insert on public.contacts to anon;

drop policy if exists "public_insert_contacts" on public.contacts;
create policy "public_insert_contacts" on public.contacts
  for insert to anon with check (true);


-- ------------------------------------------------------------
-- PASO 5 - Los logins de pacientes siguen funcionando
--          (las funciones corren con permisos propios y
--           no se ven afectadas por el bloqueo anterior)
-- ------------------------------------------------------------
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('client_login', 'register_client', 'claim_welcome_bonus')
  loop
    execute format('alter function %s security definer', f.sig);
    execute format('alter function %s set search_path = public, extensions', f.sig);
    execute format('grant execute on function %s to anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;


-- ------------------------------------------------------------
-- PASO 6 - Eliminar la tabla de contrasenas en texto plano
-- ------------------------------------------------------------
-- Los 2 usuarios viejos (master, Erick Espetia) ya fueron borrados
-- y la tabla quedo vacia. El login de admin es 100% Supabase Auth.
drop table if exists public.admins;


-- ============================================================
--  VERIFICACION - revisa los resultados de abajo
-- ============================================================

-- 1) Debe decir rowsecurity = true en las 3 tablas
select tablename, rowsecurity as protegida
from pg_tables
where schemaname = 'public'
  and tablename in ('clients', 'treatments', 'contacts')
order by tablename;

-- 2) Debe listar las 4 politicas creadas
select tablename, policyname, roles::text
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3) Las funciones de login deben decir seguridad = 'definer'
select proname as funcion,
       case when prosecdef then 'definer' else 'REVISAR' end as seguridad
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname in ('client_login', 'register_client', 'claim_welcome_bonus')
order by proname;
