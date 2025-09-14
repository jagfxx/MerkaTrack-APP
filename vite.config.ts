import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "app",
  plugins: [tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "../build/client",
  },
});
