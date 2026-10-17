import type { Config } from "@react-router/dev/config";

export default {
  // Bu satır SSG (Statik Site Üretimi) aktif eder.
  ssr: false,

  // Build sırasında hangi sayfaların önceden HTML'e çevrileceğini (prerender) belirtiriz.
  // Şimdilik sadece ana statik sayfaları ekliyoruz. Proje ve profil sayfaları için
  // dinamik bir listeleme yapacağız.
  async prerender() {
    return ["/", "/about", "/privacy", "/terms", "/cookies"];
  },
} satisfies Config;
