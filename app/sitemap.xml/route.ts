export async function GET() {
  const baseUrl = 'https://leveragejournal.com';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Product Pages -->
  <url>
    <loc>${baseUrl}/features</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Support Pages -->
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/support</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/shipping</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- User Pages -->
  <url>
    <loc>${baseUrl}/auth/signin</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/auth/signup</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/returns</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Site Information -->
  <url>
    <loc>${baseUrl}/sitemap</loc>
    <lastmod>2024-11-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
