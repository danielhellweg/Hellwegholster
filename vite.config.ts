import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(projectRoot, "client"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(projectRoot, "client", "src"),
      "@shared": path.join(projectRoot, "shared"),
    },
  },
  build: {
    outDir: path.join(projectRoot, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    fs: { allow: [projectRoot] },
  },
});
