// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  site: "https://yamil-pedroso.github.io",
  base: isGitHubPages ? "/astro-decap-lab/" : "/",

  vite: {
    plugins: [tailwindcss()],
  },
});
