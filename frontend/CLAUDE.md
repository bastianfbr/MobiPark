# Frontend MobiPark

Nuxt 4 + TypeScript (strict) + Nuxt UI 4 (Tailwind CSS 4). **SPA** (`ssr: false`) : l'application est derrière un login et le
backend renvoie le JWT dans un header de réponse, pas dans un cookie. Gestionnaire de paquets : **pnpm 9.1.4** (épinglé dans `packageManager`).

## Commandes (depuis `frontend/`)
```bash
pnpm install
pnpm dev            # http://localhost:3000, /api relayé vers http://localhost:5000/api (backend à lancer en parallèle)
pnpm lint
pnpm typecheck
pnpm build
```
Avant de terminer une tâche : `pnpm lint && pnpm typecheck`. La CI (`.github/workflows/frontend.yml`) exécute lint, typecheck et build.

## Structure (`app/`, convention Nuxt 4)
- `pages/` : routes (fichiers = URL). `layouts/` : coquilles de page (sidebar utilisateur, sidebar admin). `middleware/` : gardes de route.
- `components/` : composants réutilisables (auto-importés). `composables/` : `useXxx` (auto-importés).
- `assets/css/main.css` : thème Tailwind. La couleur de marque est `brand` (500 = `#4B5FD0`, indigo de la maquette), déclarée comme `primary` dans `app/app.config.ts`.
- Composants UI : ceux de Nuxt UI (`UButton`, `UInput`, `UTable`, `UForm`…), pas de CSS maison quand un composant existe. Icônes : `i-lucide-*`.
- Typer toutes les réponses d'API dans `app/types/` ; aucun `any`.

## Parler au backend
- Toujours des chemins relatifs `/api/...` (jamais d'URL absolue) : le proxy de dev les relaie. En production, un reverse proxy doit faire de même.
- Le backend est la source de vérité du contrat : voir le tableau d'API dans `backend/CLAUDE.md`. JSON en camelCase, enums en chaînes (`Car`, `Motorcycle`, `Thermal`, `Electrical`).
- Auth : après `POST /api/Auth` ou `/api/Auth/register`, lire le header de réponse `Authorization` (`Bearer <jwt>`), le garder (cookie via `useCookie` pour survivre au rechargement), puis l'envoyer sur chaque requête.
- Erreurs : le backend renvoie `{ "error": "..." }`. 403 sans body = non connecté, 404 = ressource inexistante **ou appartenant à un autre utilisateur**.

## Maquette à reproduire
7 écrans (maquette publiée dans Claude : https://claude.ai/artifact/GWHjU8KVQWk2xGZNbznyco) :
connexion ; utilisateur : Réserver, Place réservée (plan en lecture seule), Mes réservations, Mes véhicules ;
admin : Tableau de bord, Plan interactif (clic sur une place → détail à droite).
Navigation utilisateur : Réserver / Mes réservations / Mes véhicules. Le plan compte 26 places (1–6, 7–12, 13–18, 19–26), dont 4 électriques (5, 6, 25, 26).
Interface en français.

## Pas encore côté backend (ne pas inventer côté front)
Rôle administrateur, statistiques du tableau de bord, `POST /api/Reservation`, capacité de batterie à la création d'un véhicule électrique.
Tant que ces routes n'existent pas, ces écrans restent sur des données de démonstration clairement isolées dans un composable.
