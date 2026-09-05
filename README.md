# Restaurant

## Deploiement avec Docker Compose

1. Copiez `.env.example` vers `.env` et renseignez toutes les valeurs, en particulier `JWT_KEY` et les secrets des services externes.
2. Verifiez la configuration avec `docker compose config`.
3. Construisez et demarrez les services avec `docker compose up -d --build`.
4. Verifiez l'API sur `http://127.0.0.1:8080/healthz`, le site public sur `http://127.0.0.1:8081` et l'administration sur `http://127.0.0.1:8082`.

Les ports sont modifiables avec `API_PORT`, `PUBLIC_PORT` et `ADMIN_PORT`. En production, placez un reverse proxy TLS devant ces ports et faites pointer `PUBLIC_ORIGIN`, `ADMIN_ORIGIN` et `API_HOST` vers les domaines reels.

Les migrations Entity Framework sont appliquees au demarrage de l'API lorsque `Database__ApplyMigrations=true` dans `docker-compose.yml`. Sauvegardez la base avant chaque mise a jour.

## Deploiement Railway

Railway doit contenir trois services applicatifs distincts : `Backend`, `PublicSite` et `Administration`. Le service MySQL Railway doit etre lie au service `Backend`.

Dans le service `Backend`, ajoutez ces variables Railway :

- `ConnectionStrings__DefaultConnection` : utilisez la reference MySQL Railway, par exemple `Server=${{MySQL.MYSQLHOST}};Port=${{MySQL.MYSQLPORT}};Database=${{MySQL.MYSQLDATABASE}};User=${{MySQL.MYSQLUSER}};Password=${{MySQL.MYSQLPASSWORD}};`
- `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`
- `Cloudinary__CloudName`, `Cloudinary__ApiKey`, `Cloudinary__ApiSecret`
- `DeepL__ApiKey`
- `FrontendUrl` avec l'URL publique du site
- `Cors__AllowedOrigins__0` avec l'URL publique du site
- `Cors__AllowedOrigins__1` avec l'URL publique de l'administration
- `Database__ApplyMigrations=true`
- `ASPNETCORE_URLS=http://+:8080`

Dans le service `PublicSite`, ajoutez `VITE_API_URL=https://url-publique-du-backend.up.railway.app` et `VITE_ADMIN_URL=https://url-publique-de-l-administration.up.railway.app` comme variables de build. Dans `Administration`, ajoutez `VITE_API_URL=https://url-publique-du-backend.up.railway.app` comme variable de build.

Chaque service frontend doit utiliser son dossier comme racine (`PublicSite` ou `Administration`) et son Dockerfile respectif. Apres chaque modification d'une variable `VITE_*`, redeployez le service frontend car ces valeurs sont injectees au build.

Le mot de passe Railway qui etait present dans `Backend/appsettings.json` a ete retire du code. Comme il a ete expose dans le depot, regenerez-le dans Railway avant le deploiement.

## Deploiement separe Railway + Vercel/Netlify

Le backend peut etre deploye seul sur Railway, puis chaque frontend sur Vercel ou Netlify. Pour `PublicSite` et `Administration`, utilisez le dossier du projet comme racine, la commande `npm run build` et le dossier de sortie `dist`.

Variables de build du site public : `VITE_API_URL=https://url-publique-du-backend` et `VITE_ADMIN_URL=https://url-publique-de-l-administration`.

Variable de build de l'administration : `VITE_API_URL=https://url-publique-du-backend`.

Apres avoir obtenu les URLs Vercel ou Netlify, reportez-les dans Railway avec `FrontendUrl`, `Cors__AllowedOrigins__0` et `Cors__AllowedOrigins__1`, puis redeployez le backend. Les fichiers `vercel.json` et `netlify.toml` de chaque frontend assurent le fallback des routes React.
