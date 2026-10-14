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
        manualChunks(id) {
          // React ecosystem ayrı chunk — sen kod değiştirdiğinde
          // kullanıcı bunları tekrar indirmez, tarayıcı cache'inden okur.
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
});
