# QG de l’IA – Projets Membres

MVP Next.js + Supabase pour publier, modérer et découvrir les projets IA des membres du QG.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Supabase: Postgres, Auth, Storage, RLS

## Démarrage

1. Copiez `.env.example` vers `.env.local`.
2. Créez un projet Supabase.
3. Exécutez la migration dans [`supabase/migrations/20260324143000_init_qg_ia.sql`](/Users/candicevideo/Documents/New project 2/supabase/migrations/20260324143000_init_qg_ia.sql).
4. Exécutez le seed dans [`supabase/seed.sql`](/Users/candicevideo/Documents/New project 2/supabase/seed.sql) si vous voulez des données de démonstration.
5. Installez les dépendances puis lancez le projet:

```bash
npm install
npm run dev
```

## Storage

Le bucket `project-thumbnails` est créé dans la migration avec ces règles:

- lecture publique des images
- upload réservé aux utilisateurs authentifiés
- chaque utilisateur ne peut écrire que dans son propre préfixe `user-id/...`
- taille maximale: 5 Mo
- formats: `png`, `jpeg`, `webp`

## Zones à personnaliser

- Couleurs et ambiance visuelle: [`app/globals.css`](/Users/candicevideo/Documents/New project 2/app/globals.css)
- Copy statique et navigation: [`lib/constants.ts`](/Users/candicevideo/Documents/New project 2/lib/constants.ts)
- Valeurs catégories, métiers, statuts, outils IA: [`lib/constants.ts`](/Users/candicevideo/Documents/New project 2/lib/constants.ts)
- Auth Supabase: [`actions/auth.ts`](/Users/candicevideo/Documents/New project 2/actions/auth.ts), [`proxy.ts`](/Users/candicevideo/Documents/New project 2/proxy.ts), [`lib/supabase/`](/Users/candicevideo/Documents/New project 2/lib/supabase)
- RLS et bucket Storage: [`supabase/migrations/20260324143000_init_qg_ia.sql`](/Users/candicevideo/Documents/New project 2/supabase/migrations/20260324143000_init_qg_ia.sql)

## Architecture

- `app/`: routes App Router
- `components/`: composants UI et blocs métier
- `actions/`: server actions pour auth, soumission, likes, commentaires, bêta, modération
- `lib/`: constantes, queries, auth helpers, configuration Supabase
- `types/`: types TypeScript métier
- `supabase/`: migrations et seed

## Déploiement

La connexion à un futur déploiement Vercel est simple:

1. pousser le projet dans un dépôt Git
2. connecter le dépôt à Vercel
3. ajouter les variables d’environnement Supabase
4. exécuter les migrations sur la base de production
5. vérifier l’URL de redirect auth si vous activez magic link plus tard

## Audit rapide du MVP

Points forts actuels:

- soumission réelle avec statut `pending`
- catalogue filtrable
- fiche projet détaillée
- dashboard membre
- modération admin
- likes, commentaires, demandes bêta
- upload d’image via Storage

Améliorations recommandées ensuite:

- notifications email pour validation, likes et demandes bêta
- analytics d’usage et classement plus fin
- modération des commentaires côté admin
- vue publique créateur et pages profil
- SEO enrichi et Open Graph par projet
