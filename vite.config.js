import { defineConfig } from "vite";

export default defineConfig({
  base: "/you-will-crash-anyway/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
