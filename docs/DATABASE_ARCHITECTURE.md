# Architecture de la base Supabase partagée LoukaTech

Cette base PostgreSQL/Supabase est conçue pour héberger plusieurs applications LoukaTech sans mélanger leurs données.

## Convention obligatoire

Chaque application utilise un préfixe de table unique :

- `mairie_` — Portail Mairie de Kintélé
- `educo_` — réservé à EDUCO
- `mbote_` — réservé à MBoté
- `inspire_` — réservé à Inspire
- autres applications : choisir un préfixe unique avant de créer les tables

Le registre commun `loukatech_apps` conserve la liste des applications utilisant la base et leur préfixe.

## Module Mairie de Kintélé

Tables prévues :

- `mairie_admin_allowlist`
- `mairie_admin_users`
- `mairie_site_content`
- `mairie_hero_slides`
- `mairie_services`
- `mairie_news`
- `mairie_document_types`
- `mairie_document_requests`
- `mairie_media_library`

Stockage :

- bucket `mairie-media`

Authentification :

- Supabase Auth reste commun au projet.
- Un utilisateur n'obtient pas automatiquement l'accès administrateur.
- L'accès au backoffice dépend de `mairie_admin_users.active`.
- La connexion du backoffice utilise un `login_id` unique + mot de passe.

## Sécurité

- RLS activé sur les tables métier.
- Les internautes peuvent uniquement lire le contenu public et créer une demande de document.
- Ils ne peuvent pas lire les demandes déposées par d'autres personnes.
- Les opérations d'administration exigent un compte authentifié et actif.
- Les clés serveur et la chaîne PostgreSQL ne doivent jamais être committées dans GitHub.
- Chaque application doit utiliser ses propres politiques, tables et bucket de stockage.

## Variables du portail Mairie

Le site attend :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (serveur uniquement)
- `DATABASE_URL` uniquement si une connexion PostgreSQL serveur directe est ajoutée

La référence du projet partagé est documentée dans `.env.example`, mais aucun mot de passe n'est stocké dans le dépôt.
