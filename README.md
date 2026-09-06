# Restaurant

## Publication GitHub Pages

Le workflow `Deploy frontends to GitHub Pages` publie le site public a la racine et l'administration sous `/admin/` a chaque push sur `main`. Dans les reglages du depot GitHub, selectionnez `Settings > Pages > Source: GitHub Actions`.

GitHub Pages heberge uniquement les frontends statiques. L'API ASP.NET Core et MySQL doivent etre deployes sur Render, Docker Compose ou un autre hebergeur serveur. L'API utilisee par les builds GitHub est `https://restaurant-sxxt.onrender.com`.

## Deploiement avec Docker Compose

1. Copiez `.env.example` vers `.env` et renseignez toutes les valeurs, en particulier `JWT_KEY` et les secrets des services externes.
2. Verifiez la configuration avec `docker compose config`.
3. Construisez et demarrez les services avec `docker compose up -d --build`.
4. Verifiez l'API sur `http://127.0.0.1:8080/healthz`, le site public sur `http://127.0.0.1:8081` et l'administration sur `http://127.0.0.1:8082`.

Les ports sont modifiables avec `API_PORT`, `PUBLIC_PORT` et `ADMIN_PORT`. En production, placez un reverse proxy TLS devant ces ports et faites pointer `PUBLIC_ORIGIN`, `ADMIN_ORIGIN` et `API_HOST` vers les domaines reels.

Les migrations Entity Framework sont appliquees au demarrage de l'API lorsque `Database__ApplyMigrations=true` dans `docker-compose.yml`. Sauvegardez la base avant chaque mise a jour.

## Deploiement de l'API sur Render

Le service web Render de l'API utilise le dossier `Backend` et son `Dockerfile`. Configurez le health check sur `/healthz` et utilisez le port `8080` expose par le conteneur.

Dans le service `Backend`, ajoutez ces variables Render :

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`
- `Cloudinary__CloudName`, `Cloudinary__ApiKey`, `Cloudinary__ApiSecret`
- `DeepL__ApiKey`
- `FrontendUrl` avec l'URL publique du site
- `Cors__AllowedOrigins__0` avec l'URL publique du site
- `Cors__AllowedOrigins__1` avec l'URL publique de l'administration
- `Database__ApplyMigrations=true`
- `ASPNETCORE_URLS=http://+:8080`

L'API actuellement deployee est disponible sur `https://restaurant-sxxt.onrender.com`. Les builds de `PublicSite` et `Administration` utilisent cette URL via leurs fichiers `.env.production`. Si vous configurez les variables directement dans Render, utilisez `VITE_API_URL=https://restaurant-sxxt.onrender.com` comme variable de build pour les deux frontends.

Chaque service frontend doit utiliser son dossier comme racine (`PublicSite` ou `Administration`) et son Dockerfile respectif. Apres chaque modification d'une variable `VITE_*`, redeployez le service frontend car ces valeurs sont injectees au build.

Les secrets doivent rester dans les variables d'environnement Render et ne doivent pas etre ajoutes a `Backend/appsettings.json`.

## Deploiement separe Render + Vercel/Netlify

Le backend peut etre deploye seul sur Render, puis chaque frontend sur Vercel ou Netlify. Pour `PublicSite` et `Administration`, utilisez le dossier du projet comme racine, la commande `npm run build` et le dossier de sortie `dist`.

Variable de build du site public : `VITE_API_URL=https://restaurant-sxxt.onrender.com` et `VITE_ADMIN_URL=https://url-publique-de-l-administration`.

Variable de build de l'administration : `VITE_API_URL=https://restaurant-sxxt.onrender.com`.

Apres avoir obtenu les URLs Vercel ou Netlify, reportez-les dans Render avec `FrontendUrl`, `Cors__AllowedOrigins__0` et `Cors__AllowedOrigins__1`, puis redeployez le backend. Les fichiers `vercel.json` et `netlify.toml` de chaque frontend assurent le fallback des routes React.
