# Backend MobiPark

.NET 8, solution `mobipark.sln`. Aucun package à installer à la main : `dotnet restore --locked-mode`.

## Commandes (depuis `backend/`)
```bash
dotnet build mobipark.sln
dotnet test mobipark.sln
dotnet run --project MobiPark.App          # écoute sur http://localhost:5000, Swagger en Development
```
Migration EF : depuis `MobiPark.Infra/`, `dotnet ef migrations add <Nom>`. Elles s'appliquent au démarrage (`Database.Migrate()`).
Pour tester sans toucher à `mobiPark.db` : `ConnectionStrings__DefaultConnection="Data Source=/chemin/t.db"`.

## Couches (dépendances vers le bas uniquement)
- `MobiPark.Domain` : modèles, use cases, factories, `PriceCalculator`, interfaces (`I*Repository`, `IClock`, `IHash`). Aucune dépendance à l'infra.
- `MobiPark.Infra` : `ApplicationDbContext`, entités EF (`*Entity`, avec `ToDomainModel()`), repositories, `ArgonHash`, migrations.
- `MobiPark.App` : contrôleurs fins, DTO d'entrée, presenters de sortie, middlewares, JWT.
- `MobiPark.Domain.Test` : xUnit, avec des repositories `Fake*` en mémoire. Toute règle métier se teste ici.

Une règle métier va dans le domaine, jamais dans un contrôleur. Les erreurs métier sont des exceptions typées
(`NotFoundException` → 404, `ConflictException` → 409, `InvalidCredentialsException` → 401, `AbstractBadDataException` → 400),
converties en JSON `{ "error": "..." }` par `ExceptionHandlerMiddleware`.

## Authentification et propriété des données
- `AuthorizationMiddleware` lit le JWT et pose l'utilisateur dans `HttpContext.Items["User"]`. `AuthenticationMiddleware` renvoie 403 sans utilisateur sur `/api/*`, sauf `POST /api/Auth` et `/api/Auth/register`.
- Chaque route lit l'utilisateur et **filtre par propriétaire** : un véhicule porte un `OwnerId`, une réservation appartient au propriétaire de son véhicule.
- Accéder à la ressource d'un autre renvoie **404**, pas 403, pour ne pas révéler son existence.

## Contrat d'API actuel (JSON en camelCase, enums en chaînes)
| Route | Réponse |
|---|---|
| `POST /api/Auth`, `POST /api/Auth/register` | `{ id, username }` + header `Authorization: Bearer <jwt>` |
| `GET /api/Auth` | utilisateur courant |
| `GET /api/Vehicle` | `[{ type: "Car"\|"Motorcycle", maker, licensePlateNumber, engine: "Thermal"\|"Electrical" }]` |
| `POST /api/Vehicle` | corps `CreateVehicleDTO`, renvoie le véhicule |
| `GET /api/Reservation` | `[{ reservationId, vehicle, place, beginDate, endDate, ... }]` |
| `GET /api/Parking/spaces` | `[{ number, type, status }]` |
| `PUT /api/Parking/spaces/park?licensePlate=` | place attribuée |

Pas encore de `POST /api/Reservation`, ni de rôle administrateur.

## Pièges
- `async` jusqu'au bout : ne jamais appeler `.Result` ni laisser un `AddAsync`/`SaveChangesAsync` sans `await`.
- `ReservationEntity(reservation)` crée un `VehicleEntity` et réutilise un `ParkingSpace` existant : à corriger avant d'appeler `Save`.
- `Reservation` fixe encore `ReservationId` au hasard et `TotalPrice = 20` : le prix doit venir de `PriceCalculator`.
- Le secret JWT est dans `appsettings.json` (à passer en variable d'environnement ou user-secrets).
