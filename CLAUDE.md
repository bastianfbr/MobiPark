# MobiPark

Application de réservation de places de parking (projet CNAM). Un utilisateur enregistre ses véhicules
(voiture ou moto, thermique ou électrique) et réserve une place. Un administrateur suit l'occupation du parking.

- `backend/` : API .NET 8 (ASP.NET Core, EF Core, SQLite). Voir `backend/CLAUDE.md`.
- `frontend/` : Nuxt + TypeScript. Voir `frontend/CLAUDE.md`.
- `misc/` : diagrammes (`puml`, `class.png`, `usecase.png`) et `rules.md`.

## Règles métier (`misc/rules.md`)
- Choix automatique de la place à la réservation.
- Une place voiture accueille 2 motos.
- Prix selon : jour (8h–20h, 2 €/h) ou nuit (3 €/h), type de véhicule (moto = moitié prix),
  recharge électrique (0,16 € par unité de batterie à recharger), retard après la réservation.
- Pas encore implémentés : tarif selon l'occupation et la semaine/week-end, surtaxe, majoration de retard.

## Conventions
- Le backend est la source de vérité du contrat d'API. Le frontend s'aligne sur lui, jamais l'inverse.
- Langue de l'interface : français. Code, identifiants et commits : conventionnels (`feat:`, `fix:`, `chore:`, `rework:`).
- Une branche par fonctionnalité (`feature/<n>-<nom>`), PR vers `main`. La CI (`.github/workflows/dotnet.yml`) build et teste le backend.
- Ne jamais committer de secret ni de base de données.

## Pièges connus
- `backend/MobiPark.App/appsettings.json` contient le secret JWT et `mobiPark.db` est suivie par git : à sortir du dépôt.
- Le JWT est renvoyé dans le header de réponse `Authorization` (pas dans le corps ni en cookie).
- Un test du domaine échoue déjà : `Vehicle_ShouldNotParkIfParkingSpaceIsOccupied` (message d'erreur différent).
