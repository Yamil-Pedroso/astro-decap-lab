// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  site: "https://yamil-pedroso.github.io",
  base: isGitHubPages ? "/astro-decap-lab/" : "/",

  output: isGitHubPages ? "static" : "server",

  adapter: isGitHubPages
    ? undefined
    : node({
        mode: "standalone",
      }),

  vite: {
    plugins: [tailwindcss()],
  },
});
