import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        name: "Excelitas DND",
        short_name: "Excelitas DND",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    allowedHosts: [
      "902f-2001-448a-1021-1524-cde9-d4b3-7900-9358.ngrok-free.app",
    ],
  },
  resolve: {
    alias: {
      "@tailwindConfig": path.resolve(__dirname, "tailwind.config.js"),
    },
  },
  optimizeDeps: {
    include: ["@tailwindConfig"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
