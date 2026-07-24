-- ============================================================
--  SHOWCLINIC — BLINDAJE URGENTE DE LA BASE DE DATOS
-- ============================================================
--  PROBLEMA: hoy cualquier persona en internet puede LEER,
--  MODIFICAR y BORRAR los datos de tus pacientes.
--
--  ANTES DE EJECUTAR ESTO:
--  1) Crea tu usuario admin en Supabase > Authentication > Users
--     (boton "Add user" > correo + contrasena NUEVA y segura).
--     Sin ese usuario te quedas fuera de tu propio panel.
--  2) Ejecuta este archivo en Supabase > SQL Editor > Run.
--
--  Los administradores entraran con su CORREO y contrasena.
-- ============================================================


-- ------------------------------------------------------------
-- PASO 1 — Activar la proteccion (RLS) en todas las tablas
-- ------------------------------------------------------------
alter table public.clients    enable row level security;
alter table public.treatments enable row level security;
alter table public.contacts   enable row level security;
alter table public.admins     enable row level security;

-- Por si quedaron permisos abiertos de antes
revoke all on public.clients    from anon;
revoke all on public.treatments from anon;
revoke all on public.contacts   from anon;
revoke all on public.admins     from anon;


-- ------------------------------------------------------------
-- PASO 2 — Limpiar politicas viejas (si existieran)
-- ------------------------------------------------------------
drop policy if exists "admins_all_clients"    on public.clients;
drop policy if exists "admins_all_treatments" on public.treatments;
drop policy if exists "admins_all_contacts"   on public.contacts;
drop policy if exists "public_insert_contacts" on public.contacts;
drop policy if exists "admins_all_admins"     on public.admins;


-- ------------------------------------------------------------
-- PASO 3 — Solo administradores autenticados acceden a los datos
-- ------------------------------------------------------------
create policy "admins_all_clients" on public.clients
  for all to authenticated using (true) with check (true);

create policy "admins_all_treatments" on public.treatments
  for all to authenticated using (true) with check (true);

create policy "admins_all_contacts" on public.contacts
  for all to authenticated using (true) with check (true);


-- ------------------------------------------------------------
-- PASO 4 — El formulario de contacto de la web sigue funcionando
--          (puede ESCRIBIR mensajes, pero NO leerlos)
-- ------------------------------------------------------------
grant insert on public.contacts to anon;

create policy "public_insert_contacts" on public.contacts
  for insert to anon with check (true);


-- ------------------------------------------------------------
-- PASO 5 — Eliminar la tabla de contrasenas en texto plano
-- ------------------------------------------------------------
-- Los 2 usuarios viejos (master, Erick Espetia) YA FUERON BORRADOS.
-- La tabla quedo vacia y el login de admin es 100% por Supabase Auth.
--
-- IMPORTANTE: ejecuta esta linea SOLO despues de confirmar que
-- entras al panel con tu correo. Es el ultimo paso.
drop table if exists public.admins;


-- ------------------------------------------------------------
-- PASO 6 — Verificacion
-- ------------------------------------------------------------
-- Debe mostrar rowsecurity = true en las 4 tablas
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('clients','treatments','contacts','admins');
