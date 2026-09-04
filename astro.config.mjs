// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://yamil-pedroso.github.io",
  base: "/astro-decap-lab",

  vite: {
    plugins: [tailwindcss()],
  },
});
