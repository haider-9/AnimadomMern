export function loader() {
  const baseUrl = "https://animadom.vercel.app";
  
  // Define your routes with their priorities and change frequencies
  const routes = [
    { path: "", priority: 1.0, changefreq: "daily" },
    { path: "/anime", priority: 0.9, changefreq: "daily" },
    { path: "/search", priority: 0.8, changefreq: "weekly" },
    { path: "/about", priority: 0.5, changefreq: "monthly" },
    { path: "/contact", priority: 0.5, changefreq: "monthly" },
    { path: "/login", priority: 0.3, changefreq: "monthly" },
    { path: "/register", priority: 0.3, changefreq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
