import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
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
