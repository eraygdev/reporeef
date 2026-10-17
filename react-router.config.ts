import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  async prerender() {
    // 1. Her zaman var olan statik sayfalar
    const staticRoutes = ["/", "/about", "/privacy", "/terms", "/cookies"];

    try {
      // 2. Backend API'den tüm projeleri çek
      // (Vercel build sırasında API'ye erişebilmelidir)
      const apiUrl = "https://api.reporeef.com";
      const projectsRes = await fetch(`${apiUrl}/api/v1/projects?limit=2000`);
      if (!projectsRes.ok) throw new Error("Projeler çekilemedi");

      const projectsData = await projectsRes.json();
      const projectRoutes = (projectsData.projects || []).map(
        (p: any) => `/project/${p.id}`,
      );

      // 3. Sitemap üzerinden tüm kullanıcı profillerini çek
      const sitemapRes = await fetch(`${apiUrl}/sitemap.xml`);
      const sitemapText = await sitemapRes.text();

      // Sitemap içinden /profile/ ile başlayan yolları regex ile ayıkla
      const profileMatches =
        sitemapText.match(/\/profile\/[a-zA-Z0-9_.-]+/g) || [];
      const uniqueProfileRoutes = [...new Set(profileMatches)];

      // Hepsini birleştir
      return [...staticRoutes, ...projectRoutes, ...uniqueProfileRoutes];
    } catch (error) {
      console.error("Prerender sırasında hata oluştu:", error);
      // Hata olsa bile statik sayfaların build edilmesini sağla
      return staticRoutes;
    }
  },
} satisfies Config;
