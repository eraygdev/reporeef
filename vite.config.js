import react from "@vitejs/plugin-react";
import geo from "vite-plugin-geo";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    geo({
      domain: "https://reporeef.com",
    }),
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem ayrı chunk — cache'lenebilir
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
