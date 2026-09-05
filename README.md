# Restaurant

## Deploiement avec Docker Compose

1. Copiez `.env.example` vers `.env` et renseignez toutes les valeurs, en particulier `JWT_KEY` et les secrets des services externes.
2. Verifiez la configuration avec `docker compose config`.
3. Construisez et demarrez les services avec `docker compose up -d --build`.
4. Verifiez l'API sur `http://127.0.0.1:8080/healthz`, le site public sur `http://127.0.0.1:8081` et l'administration sur `http://127.0.0.1:8082`.

Les ports sont modifiables avec `API_PORT`, `PUBLIC_PORT` et `ADMIN_PORT`. En production, placez un reverse proxy TLS devant ces ports et faites pointer `PUBLIC_ORIGIN`, `ADMIN_ORIGIN` et `API_HOST` vers les domaines reels.

Les migrations Entity Framework sont appliquees au demarrage de l'API lorsque `Database__ApplyMigrations=true` dans `docker-compose.yml`. Sauvegardez la base avant chaque mise a jour.
