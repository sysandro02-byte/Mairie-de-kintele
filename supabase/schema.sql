-- Schéma du portail municipal de Kintélé
-- À appliquer dans un projet Supabase dédié.

create extension if not exists pgcrypto;
create schema if not exists private;

-- Registre commun LoukaTech pour les applications partageant cette base.
create table if not exists public.loukatech_apps (
  app_key text primary key,
  app_name text not null,
  description text not null default '',
  data_prefix text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.loukatech_apps(app_key, app_name, description, data_prefix)
values (
  'mairie_kintele',
  'Portail Mairie de Kintélé',
  'Portail municipal, backoffice, actualités et demandes de documents.',
  'mairie_'
)
on conflict (app_key) do update
set app_name = excluded.app_name,
    description = excluded.description,
    data_prefix = excluded.data_prefix,
    active = true;


create table if not exists public.mairie_admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.mairie_admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  login_id text not null unique,
  full_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mairie_site_content (
  key text primary key,
  label text not null,
  value text not null default '',
  group_name text not null default 'Général',
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_url text not null default '',
  button_label text not null default 'En savoir plus',
  button_href text not null default '/',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_services (
  id uuid primary key default gen_random_uuid(),
  icon text not null default '•',
  title text not null,
  description text not null default '',
  href text not null default '/demarches',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_news (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'Municipalité',
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  image_url text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_document_types (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  requirements text[] not null default '{}',
  fee_text text not null default '',
  processing_time text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_document_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  document_type_id uuid not null references public.mairie_document_types(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null default '',
  birth_date date,
  message text not null default '',
  status text not null default 'nouvelle'
    check (status in ('nouvelle','en_cours','a_completer','prete','terminee','rejetee')),
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mairie_media_library (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  alt_text text not null default '',
  category text not null default 'site',
  created_at timestamptz not null default now()
);

-- Administrateur initial du module mairie : remplaçable ensuite.
insert into public.mairie_admin_allowlist(email)
values ('contacts@loukatech.com')
on conflict (email) do nothing;

-- Création de compte administrateur.
-- Tous les comptes sont enregistrés, mais seuls les e-mails autorisés sont actifs.
create or replace function private.mairie_handle_admin_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $
declare
  requested_login_id text;
  is_allowed boolean;
begin
  requested_login_id := lower(trim(coalesce(new.raw_user_meta_data->>'login_id', '')));

  if requested_login_id !~ '^[a-z0-9._-]{3,40}

revoke all on function private.mairie_handle_admin_signup() from public, anon, authenticated;

drop trigger if exists on_mairie_admin_signup on auth.users;
create trigger on_mairie_admin_signup
after insert on auth.users
for each row execute function private.mairie_handle_admin_signup();

-- Si le compte existe déjà au moment de l'installation.
insert into public.mairie_admin_users(user_id, email, login_id, full_name, active)
select
  u.id,
  u.email,
  lower(coalesce(nullif(u.raw_user_meta_data->>'login_id', ''), split_part(u.email, '@', 1))),
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  true
from auth.users u
join public.mairie_admin_allowlist a on lower(a.email) = lower(u.email)
on conflict (user_id) do update
set active = true,
    email = excluded.email,
    login_id = excluded.login_id;

-- Seed contenu
insert into public.mairie_site_content(key, label, value, group_name) values
('home.city_intro','Présentation de Kintélé','Commune de la périphérie nord-est de Brazzaville, Kintélé rassemble environ 71 629 habitants et poursuit son développement autour de l’éducation, du sport, des mobilités et du cadre de vie.','Accueil'),
('home.population','Population','71 629','Chiffres clés'),
('home.seats','Sièges municipaux','25','Chiffres clés'),
('home.commune_since','Année de création de la commune','2017','Chiffres clés'),
('home.mayor_name','Nom du maire','Stella Mensah Sassou N’Guesso','Municipalité'),
('home.mayor_role','Fonction du maire','Députée-maire de la commune de Kintélé','Municipalité'),
('home.territory_title','Titre territoire','Étudier, entreprendre, vivre à Kintélé','Accueil'),
('home.territory_text','Texte territoire','Université Denis Sassou N’Guesso, complexe sportif de la Concorde, viaduc Talangaï–Kintélé et nouveaux quartiers : la commune bénéficie d’équipements structurants à l’échelle métropolitaine.','Accueil'),
('commune.intro','Introduction commune','Une commune de la métropole brazzavilloise, tournée vers l’éducation, le sport, les mobilités et le développement urbain.','Commune'),
('commune.history','Histoire et situation','Kintélé se situe au nord-est de Brazzaville et est reliée à la capitale notamment par le viaduc Talangaï–Kintélé. La commune a été érigée en commune à part entière en 2017 et relève du département de Brazzaville.','Commune'),
('commune.equipment','Équipements majeurs','Le complexe sportif de la Concorde, l’Université Denis Sassou N’Guesso, le Grand Hôtel de Kintélé et les axes routiers structurants contribuent au rayonnement de la commune.','Commune'),
('contact.address','Adresse de la mairie','Avenue de l’Université, Kintélé, République du Congo','Contact'),
('contact.hours','Horaires','Du lundi au vendredi · 8h00–15h30','Contact'),
('contact.email','E-mail','mairie@kintele.cg','Contact')
on conflict (key) do nothing;

insert into public.mairie_hero_slides(title, subtitle, image_url, button_label, button_href, sort_order, active) values
('Votre mairie, plus proche de vous.','Démarches, informations pratiques, actualités et services municipaux : l’essentiel de Kintélé en quelques clics.','https://upload.wikimedia.org/wikipedia/commons/6/65/Viaduc_de_Talanga%C3%AF_%C3%A0_Brazzaville_donnant_acc%C3%A8s_%C3%A0_l%27entr%C3%A9_de_la_ville_et_%C3%A0_la_sortie_de_la_commune_de_kint%C3%A9l%C3%A9_pool_Nord.jpg','Faire une démarche','/demarches',1,true),
('Une commune qui investit dans l’avenir.','Kintélé se développe autour de l’éducation, du sport, de la mobilité et de nouveaux services de proximité.','https://upload.wikimedia.org/wikipedia/commons/c/ca/Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg','Découvrir Kintélé','/commune',2,true),
('Kintélé, territoire de grands équipements.','Le complexe sportif de la Concorde et les infrastructures métropolitaines participent au rayonnement de la commune.','https://commons.wikimedia.org/wiki/Special:Redirect/file/Stade%20de%20la%20concorde%20de%20Kintele.jpg','Voir les actualités','/actualites',3,true);

insert into public.mairie_services(icon,title,description,href,sort_order,active) values
('◉','État civil','Naissance, mariage, décès, légalisation et certification.','/demarches#documents',1,true),
('⌂','Urbanisme','Renseignements, projets, autorisations et accompagnement.','/demarches#urbanisme',2,true),
('✦','Famille & jeunesse','Orientation vers les services municipaux et de proximité.','/demarches#famille',3,true),
('⚑','Vie citoyenne','Informations municipales, participation et rendez-vous.','/demarches#citoyennete',4,true),
('♟','Économie locale','Commerces, marchés, entrepreneuriat et initiatives locales.','/commune#economie',5,true),
('◎','Sport & culture','Équipements, événements et vie associative.','/actualites',6,true);

insert into public.mairie_document_types(title,description,requirements,fee_text,processing_time,sort_order,active) values
('Copie / extrait d’acte de naissance','Demandez une copie ou un extrait d’un acte de naissance enregistré à Kintélé.',array['Pièce d’identité du demandeur','Informations d’état civil de la personne concernée'],'Tarif à confirmer par le service d’état civil','Délai communiqué après vérification du dossier',1,true),
('Copie / extrait d’acte de mariage','Demandez un document relatif à un mariage enregistré auprès de la mairie.',array['Pièce d’identité','Noms des époux','Date ou année du mariage'],'Tarif à confirmer par le service d’état civil','Selon disponibilité du registre',2,true),
('Copie / extrait d’acte de décès','Demandez une copie ou un extrait d’un acte de décès enregistré à Kintélé.',array['Pièce d’identité du demandeur','Nom de la personne décédée','Date approximative du décès'],'Tarif à confirmer par le service d’état civil','Selon disponibilité du registre',3,true),
('Légalisation / certification','Préparez une demande de légalisation ou de certification de document.',array['Document original','Pièce d’identité valide'],'Tarif communiqué par la mairie','Selon le type de document',4,true);

insert into public.mairie_news(category,title,excerpt,body,image_url,published,published_at) values
('Municipalité','Kintélé renforce son ambition de ville moderne et connectée','Le portail municipal s’inscrit dans une démarche de proximité et de modernisation des services rendus aux habitants.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2001.png',true,now()),
('Territoire','Kintélé au sein du département de Brazzaville','La commune est rattachée au département de Brazzaville dans le cadre de la nouvelle organisation territoriale.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2002.png',true,now() - interval '10 days'),
('Cadre de vie','Un territoire entre université, sport et grands équipements','Kintélé s’appuie sur des infrastructures universitaires, sportives et routières qui structurent son développement.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Stade%20de%20la%20concorde%20de%20Kintele.jpg',true,now() - interval '20 days');

-- RLS
alter table public.mairie_admin_allowlist enable row level security;
alter table public.mairie_admin_users enable row level security;
alter table public.mairie_site_content enable row level security;
alter table public.mairie_hero_slides enable row level security;
alter table public.mairie_services enable row level security;
alter table public.mairie_news enable row level security;
alter table public.mairie_document_types enable row level security;
alter table public.mairie_document_requests enable row level security;
alter table public.mairie_media_library enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.mairie_site_content, public.mairie_hero_slides, public.mairie_services, public.mairie_news, public.mairie_document_types, public.mairie_media_library to anon, authenticated;
grant insert on public.mairie_document_requests to anon, authenticated;
grant select on public.mairie_admin_users to authenticated;
grant select, insert, update, delete on public.mairie_site_content, public.mairie_hero_slides, public.mairie_services, public.mairie_news, public.mairie_document_types, public.mairie_media_library, public.mairie_document_requests to authenticated;

create policy "public read site content" on public.mairie_site_content for select to anon, authenticated using (true);
create policy "public read active slides" on public.mairie_hero_slides for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read active services" on public.mairie_services for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read published news" on public.mairie_news for select to anon, authenticated using (published = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read active documents" on public.mairie_document_types for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read media" on public.mairie_media_library for select to anon, authenticated using (true);

create policy "user can see own admin row" on public.mairie_admin_users for select to authenticated using ((select auth.uid()) = user_id);

create policy "public can create request" on public.mairie_document_requests
for insert to anon, authenticated
with check (length(trim(full_name)) >= 2 and length(trim(email)) >= 5 and length(trim(phone)) >= 5);

-- Admin CRUD policies
create policy "admin manage site content" on public.mairie_site_content for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage slides" on public.mairie_hero_slides for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage services" on public.mairie_services for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage news" on public.mairie_news for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage documents" on public.mairie_document_types for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin read requests" on public.mairie_document_requests for select to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin update requests" on public.mairie_document_requests for update to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin delete requests" on public.mairie_document_requests for delete to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage media metadata" on public.mairie_media_library for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

-- Storage public, écriture réservée aux admins
insert into storage.buckets(id, name, public)
values ('mairie-media','mairie-media',true)
on conflict (id) do update set public = true;

create policy "public read site media" on storage.objects
for select to public
using (bucket_id = 'mairie-media');

create policy "admins upload site media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);

create policy "admins update site media" on storage.objects
for update to authenticated
using (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
)
with check (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);

create policy "admins delete site media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);
 then
    raise exception 'invalid_admin_login_id';
  end if;

  select exists (
    select 1
    from public.mairie_admin_allowlist a
    where lower(a.email) = lower(new.email)
  )
  into is_allowed;

  insert into public.mairie_admin_users(user_id, email, login_id, full_name, active)
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
$;

revoke all on function private.mairie_handle_admin_signup() from public, anon, authenticated;

drop trigger if exists on_mairie_admin_signup on auth.users;
create trigger on_mairie_admin_signup
after insert on auth.users
for each row execute function private.mairie_handle_admin_signup();

-- Si le compte existe déjà au moment de l'installation.
insert into public.mairie_admin_users(user_id, email, full_name, active)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', ''), true
from auth.users u
join public.mairie_admin_allowlist a on lower(a.email) = lower(u.email)
on conflict (user_id) do update set active = true, email = excluded.email;

-- Seed contenu
insert into public.mairie_site_content(key, label, value, group_name) values
('home.city_intro','Présentation de Kintélé','Commune de la périphérie nord-est de Brazzaville, Kintélé rassemble environ 71 629 habitants et poursuit son développement autour de l’éducation, du sport, des mobilités et du cadre de vie.','Accueil'),
('home.population','Population','71 629','Chiffres clés'),
('home.seats','Sièges municipaux','25','Chiffres clés'),
('home.commune_since','Année de création de la commune','2017','Chiffres clés'),
('home.mayor_name','Nom du maire','Stella Mensah Sassou N’Guesso','Municipalité'),
('home.mayor_role','Fonction du maire','Députée-maire de la commune de Kintélé','Municipalité'),
('home.territory_title','Titre territoire','Étudier, entreprendre, vivre à Kintélé','Accueil'),
('home.territory_text','Texte territoire','Université Denis Sassou N’Guesso, complexe sportif de la Concorde, viaduc Talangaï–Kintélé et nouveaux quartiers : la commune bénéficie d’équipements structurants à l’échelle métropolitaine.','Accueil'),
('commune.intro','Introduction commune','Une commune de la métropole brazzavilloise, tournée vers l’éducation, le sport, les mobilités et le développement urbain.','Commune'),
('commune.history','Histoire et situation','Kintélé se situe au nord-est de Brazzaville et est reliée à la capitale notamment par le viaduc Talangaï–Kintélé. La commune a été érigée en commune à part entière en 2017 et relève du département de Brazzaville.','Commune'),
('commune.equipment','Équipements majeurs','Le complexe sportif de la Concorde, l’Université Denis Sassou N’Guesso, le Grand Hôtel de Kintélé et les axes routiers structurants contribuent au rayonnement de la commune.','Commune'),
('contact.address','Adresse de la mairie','Avenue de l’Université, Kintélé, République du Congo','Contact'),
('contact.hours','Horaires','Du lundi au vendredi · 8h00–15h30','Contact'),
('contact.email','E-mail','mairie@kintele.cg','Contact')
on conflict (key) do nothing;

insert into public.mairie_hero_slides(title, subtitle, image_url, button_label, button_href, sort_order, active) values
('Votre mairie, plus proche de vous.','Démarches, informations pratiques, actualités et services municipaux : l’essentiel de Kintélé en quelques clics.','https://upload.wikimedia.org/wikipedia/commons/6/65/Viaduc_de_Talanga%C3%AF_%C3%A0_Brazzaville_donnant_acc%C3%A8s_%C3%A0_l%27entr%C3%A9_de_la_ville_et_%C3%A0_la_sortie_de_la_commune_de_kint%C3%A9l%C3%A9_pool_Nord.jpg','Faire une démarche','/demarches',1,true),
('Une commune qui investit dans l’avenir.','Kintélé se développe autour de l’éducation, du sport, de la mobilité et de nouveaux services de proximité.','https://upload.wikimedia.org/wikipedia/commons/c/ca/Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg','Découvrir Kintélé','/commune',2,true),
('Kintélé, territoire de grands équipements.','Le complexe sportif de la Concorde et les infrastructures métropolitaines participent au rayonnement de la commune.','https://commons.wikimedia.org/wiki/Special:Redirect/file/Stade%20de%20la%20concorde%20de%20Kintele.jpg','Voir les actualités','/actualites',3,true);

insert into public.mairie_services(icon,title,description,href,sort_order,active) values
('◉','État civil','Naissance, mariage, décès, légalisation et certification.','/demarches#documents',1,true),
('⌂','Urbanisme','Renseignements, projets, autorisations et accompagnement.','/demarches#urbanisme',2,true),
('✦','Famille & jeunesse','Orientation vers les services municipaux et de proximité.','/demarches#famille',3,true),
('⚑','Vie citoyenne','Informations municipales, participation et rendez-vous.','/demarches#citoyennete',4,true),
('♟','Économie locale','Commerces, marchés, entrepreneuriat et initiatives locales.','/commune#economie',5,true),
('◎','Sport & culture','Équipements, événements et vie associative.','/actualites',6,true);

insert into public.mairie_document_types(title,description,requirements,fee_text,processing_time,sort_order,active) values
('Copie / extrait d’acte de naissance','Demandez une copie ou un extrait d’un acte de naissance enregistré à Kintélé.',array['Pièce d’identité du demandeur','Informations d’état civil de la personne concernée'],'Tarif à confirmer par le service d’état civil','Délai communiqué après vérification du dossier',1,true),
('Copie / extrait d’acte de mariage','Demandez un document relatif à un mariage enregistré auprès de la mairie.',array['Pièce d’identité','Noms des époux','Date ou année du mariage'],'Tarif à confirmer par le service d’état civil','Selon disponibilité du registre',2,true),
('Copie / extrait d’acte de décès','Demandez une copie ou un extrait d’un acte de décès enregistré à Kintélé.',array['Pièce d’identité du demandeur','Nom de la personne décédée','Date approximative du décès'],'Tarif à confirmer par le service d’état civil','Selon disponibilité du registre',3,true),
('Légalisation / certification','Préparez une demande de légalisation ou de certification de document.',array['Document original','Pièce d’identité valide'],'Tarif communiqué par la mairie','Selon le type de document',4,true);

insert into public.mairie_news(category,title,excerpt,body,image_url,published,published_at) values
('Municipalité','Kintélé renforce son ambition de ville moderne et connectée','Le portail municipal s’inscrit dans une démarche de proximité et de modernisation des services rendus aux habitants.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2001.png',true,now()),
('Territoire','Kintélé au sein du département de Brazzaville','La commune est rattachée au département de Brazzaville dans le cadre de la nouvelle organisation territoriale.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2002.png',true,now() - interval '10 days'),
('Cadre de vie','Un territoire entre université, sport et grands équipements','Kintélé s’appuie sur des infrastructures universitaires, sportives et routières qui structurent son développement.','','https://commons.wikimedia.org/wiki/Special:Redirect/file/Stade%20de%20la%20concorde%20de%20Kintele.jpg',true,now() - interval '20 days');

-- RLS
alter table public.mairie_admin_allowlist enable row level security;
alter table public.mairie_admin_users enable row level security;
alter table public.mairie_site_content enable row level security;
alter table public.mairie_hero_slides enable row level security;
alter table public.mairie_services enable row level security;
alter table public.mairie_news enable row level security;
alter table public.mairie_document_types enable row level security;
alter table public.mairie_document_requests enable row level security;
alter table public.mairie_media_library enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.mairie_site_content, public.mairie_hero_slides, public.mairie_services, public.mairie_news, public.mairie_document_types, public.mairie_media_library to anon, authenticated;
grant insert on public.mairie_document_requests to anon, authenticated;
grant select on public.mairie_admin_users to authenticated;
grant select, insert, update, delete on public.mairie_site_content, public.mairie_hero_slides, public.mairie_services, public.mairie_news, public.mairie_document_types, public.mairie_media_library, public.mairie_document_requests to authenticated;

create policy "public read site content" on public.mairie_site_content for select to anon, authenticated using (true);
create policy "public read active slides" on public.mairie_hero_slides for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read active services" on public.mairie_services for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read published news" on public.mairie_news for select to anon, authenticated using (published = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read active documents" on public.mairie_document_types for select to anon, authenticated using (active = true or exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));
create policy "public read media" on public.mairie_media_library for select to anon, authenticated using (true);

create policy "user can see own admin row" on public.mairie_admin_users for select to authenticated using ((select auth.uid()) = user_id);

create policy "public can create request" on public.mairie_document_requests
for insert to anon, authenticated
with check (length(trim(full_name)) >= 2 and length(trim(email)) >= 5 and length(trim(phone)) >= 5);

-- Admin CRUD policies
create policy "admin manage site content" on public.mairie_site_content for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage slides" on public.mairie_hero_slides for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage services" on public.mairie_services for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage news" on public.mairie_news for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage documents" on public.mairie_document_types for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin read requests" on public.mairie_document_requests for select to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin update requests" on public.mairie_document_requests for update to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin delete requests" on public.mairie_document_requests for delete to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

create policy "admin manage media metadata" on public.mairie_media_library for all to authenticated
using (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active))
with check (exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active));

-- Storage public, écriture réservée aux admins
insert into storage.buckets(id, name, public)
values ('mairie-media','mairie-media',true)
on conflict (id) do update set public = true;

create policy "public read site media" on storage.objects
for select to public
using (bucket_id = 'mairie-media');

create policy "admins upload site media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);

create policy "admins update site media" on storage.objects
for update to authenticated
using (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
)
with check (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);

create policy "admins delete site media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'mairie-media'
  and exists (select 1 from public.mairie_admin_users a where a.user_id = (select auth.uid()) and a.active)
);
