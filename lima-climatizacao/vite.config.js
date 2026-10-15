import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base:
    process.env.WEBFORGE_BASE ||
    (process.env.GITHUB_PAGES === "true"
      ? "/projetos/lima-climatizacao/"
      : "/"),
});
