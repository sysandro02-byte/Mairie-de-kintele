-- Ajout de la connexion backoffice par ID administrateur.
alter table public.admin_users
  add column if not exists login_id text;

update public.admin_users
set login_id = lower(coalesce(nullif(login_id, ''), split_part(email, '@', 1)))
where login_id is null or login_id = '';

alter table public.admin_users
  alter column login_id set not null;

create unique index if not exists admin_users_login_id_key
  on public.admin_users(login_id);

create or replace function private.handle_admin_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_login_id text;
  is_allowed boolean;
begin
  requested_login_id := lower(trim(coalesce(new.raw_user_meta_data->>'login_id', '')));

  if requested_login_id !~ '^[a-z0-9._-]{3,40}$' then
    raise exception 'invalid_admin_login_id';
  end if;

  select exists (
    select 1
    from public.admin_allowlist a
    where lower(a.email) = lower(new.email)
  )
  into is_allowed;

  insert into public.admin_users(user_id, email, login_id, full_name, active)
  values (
    new.id,
    new.email,
    requested_login_id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    is_allowed
  )
  on conflict (user_id) do update
  set email = excluded.email,
      login_id = excluded.login_id,
      full_name = excluded.full_name,
      active = excluded.active;

  return new;
end;
$$;

revoke all on function private.handle_admin_signup() from public, anon, authenticated;
