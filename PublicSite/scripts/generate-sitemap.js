/* eslint-env node */
import fs from "fs";

const SITE_URL = process.env.VITE_SITE_URL || "http://localhost:5174";

// Liste des pages publiques du site
// Les pages "connexion" et "inscription" ne sont PAS listées ici (aucun intérêt SEO)
const pages = [
  {
    loc: "/",
    priority: "1.0",
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/About",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/Carte",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/Galerie",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/Reserver",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/FAQ",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    loc: "/Contact",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
];

// ---------------------------------------------------------------------------
// Génération du sitemap.xml
// ---------------------------------------------------------------------------
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync("public/sitemap.xml", xml);

// ---------------------------------------------------------------------------
// Génération du robots.txt
// ---------------------------------------------------------------------------
const robots = `# Robots.txt pour Les Deux Colombes - Restaurant

# Allow all crawlers by default
User-agent: *
Allow: /

# Disallow sensitive pages
Disallow: /Connexion
Disallow: /Inscription

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay (optional - adjust as needed)
Crawl-delay: 1
`;

fs.writeFileSync("public/robots.txt", robots);

console.log(`✅ sitemap.xml et robots.txt générés pour ${SITE_URL}`);
