import type { Route } from "./+types/$";
import NotFound from "./NotFound";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle Chrome DevTools and other well-known paths
  if (pathname.startsWith("/.well-known/")) {
    // Return empty JSON for DevTools requests to prevent errors
    if (pathname.includes("com.chrome.devtools")) {
      return Response.json({}, { status: 404 });
    }
    
    // Handle other well-known paths
    if (pathname === "/.well-known/security.txt") {
      return new Response("Contact: support@animadom.com", {
        headers: { "Content-Type": "text/plain" },
      });
    }
    
    // Default well-known response
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Handle favicon requests
  if (pathname === "/favicon.ico") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/favicon.png" },
    });
  }

  // Handle robots.txt
  if (pathname === "/robots.txt") {
    return new Response(
      `User-agent: *
Allow: /
Disallow: /api/
Disallow: /user/
Disallow: /search/
Crawl-delay: 1

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /user/
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /user/
Crawl-delay: 2

Sitemap: ${url.origin}/sitemap.xml
Sitemap: ${url.origin}/sitemap-images.xml`,
      {
        headers: { "Content-Type": "text/plain" },
      }
    );
  }

  // Handle image sitemap
  if (pathname === "/sitemap-images.xml") {
    const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url.origin}</loc>
    <image:image>
      <image:loc>${url.origin}/logo.png</image:loc>
      <image:title>Animadom Logo</image:title>
      <image:caption>Animadom - The ultimate destination for anime enthusiasts</image:caption>
    </image:image>
  </url>
</urlset>`;

    return new Response(imageSitemap, {
      headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Handle sitemap.xml
  if (pathname === "/sitemap.xml") {
    // Generate dynamic sitemap with all routes
    const staticRoutes = [
      { url: "", changefreq: "daily", priority: "1.0" },
      { url: "/collections", changefreq: "weekly", priority: "0.8" },
      { url: "/upcoming", changefreq: "daily", priority: "0.7" },
      { url: "/top-rated", changefreq: "weekly", priority: "0.8" },
      { url: "/trending", changefreq: "daily", priority: "0.7" },
      { url: "/top_characters", changefreq: "weekly", priority: "0.6" },
      { url: "/about", changefreq: "monthly", priority: "0.5" },
      { url: "/topbyyear", changefreq: "weekly", priority: "0.6" },
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${url.origin}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemapXml, {
      headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  }

  // For all other unmatched routes, throw a 404 error
  // This will be caught by the ErrorBoundary
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAllRoute() {
  // This component should never render because the loader
  // either returns a response or throws an error
  return <NotFound />;
}