# Reboot Lab

![Reboot Lab preview](./src/assets/images/readme/reboot-lab-preview.webp)

A fictional refurbished technology storefront and learning lab for Git-managed content, Decap CMS and static deployment. Astro components provide presentation, Markdown frontmatter provides editorial content, and browser scripts handle search, the cart and forms.

## Current stack and features

- Astro 7, TypeScript and static HTML output.
- Tailwind CSS 4 through `@tailwindcss/vite` and optimized local images with Astro Assets.
- Five Content Collections with schemas in `src/content.config.ts`.
- Decap CMS admin with a GitHub backend and an external OAuth endpoint.
- Product and category pages generated using `getStaticPaths()`.
- Editorial home sections, promotions, featured products and curated best sellers.
- Search modal for products and categories.
- Cart drawer persisted in browser `localStorage`, checkout form and toast notifications using `simple-notify`.
- About, Contact, Shipping, Warranty and Privacy pages.
- Environment-aware internal links using `import.meta.env.BASE_URL`.
- GitHub Pages deployment through GitHub Actions, plus Docker/Nginx packaging and a separate VPS deployment workflow.

Checkout and contact are UI demonstrations: payments, order processing and message delivery are not connected. Interactivity currently uses Astro client scripts; no React integration is installed.

## Local development

Use Node.js **22.12.0 or later** and npm. CI and Docker use Node.js 24.

```sh
npm ci
npm run dev -- --background
```

Open [localhost:4321](http://localhost:4321/). Leave `DEPLOY_TARGET` unset for local development so the site runs at `/`.

Manage the background server with:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

| Command | Purpose |
| --- | --- |
| `npx astro sync` | Synchronize content and generate Astro types |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the generated build locally |

There is no dedicated test, lint or typecheck script in `package.json`. A successful build validates content and compilation, but is not a full typecheck or browser test.

## Project structure

```text
.
├── .github/workflows/
│   ├── ci.yml                  # Build and deploy GitHub Pages
│   └── production.yml          # SSH deployment to the VPS
├── public/
│   ├── admin/config.yml        # Decap fields and backend configuration
│   └── favicon.svg
├── src/
│   ├── assets/images/          # Branding, editorial images and CMS uploads
│   ├── components/             # Presentation and browser interactions
│   ├── content/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── promotions/
│   │   ├── benefits/
│   │   └── pages/
│   ├── content.config.ts      # Collection loaders and schemas
│   ├── data/                  # UI configuration and derived-data helpers
│   ├── layouts/Layout.astro
│   ├── pages/                 # Routes, including products/[slug] and categories/[slug]
│   ├── styles/global.css
│   ├── types/                 # Component, cart and UI types
│   └── utils/paths.ts         # Shared base-path helper
├── astro.config.mjs
├── Dockerfile
└── nginx.conf
```

## Content architecture

Collections use `glob()` from `astro/loaders`, `z` from `astro/zod`, and `image()` for local images. Components read entries with `getCollection()` or `getEntry()`. See the [Astro Content Collections guide](https://docs.astro.build/en/guides/content-collections/).

| Collection | Editable content |
| --- | --- |
| `products` | Product name, category ID, price, description and image |
| `categories` | Category name, description, image and display order |
| `promotions` | Promotion slot, category/product IDs, copy, image and price-display option |
| `benefits` | Service benefit title, description, destination and order |
| `pages` | Home, About, Contact, Products, Categories, Shipping, Warranty and Privacy copy |

`products` is the source of truth for product data. Featured products, flash deals, new arrivals and best sellers refer to product IDs instead of duplicating full records. IDs come from entry filenames; for example, `thinkpad-t480.md` is referenced as `thinkpad-t480`.

To add a product, create a file such as `src/content/products/example-laptop.md`:

```yaml
---
name: Example Laptop
category: laptops
price: 299
description: A refurbished laptop ready for another cycle.
image: ../../assets/images/categories/laptops/laptop1.webp
---
```

Its product page and category listing are generated on the next build. Home selections are curated separately in `src/content/pages/home.md`.

Image paths are relative to the Markdown file. Keep IDs stable or update every reference when renaming entries. Relations are currently stored as strings, not validated collection references, so verify related entries after edits.

The promotion layout expects one entry for each slot: `laptop`, `desktop`, `monitor` and `component`. The component requires all four. Positions are selected by slot, rather than by the editable `order` field.

### What stays in code

`src/data/products.ts` and `src/data/categories.ts` have been replaced by collections. The remaining data files have separate responsibilities:

| File in `src/data/` | Responsibility |
| --- | --- |
| `navigation.ts` | Header/footer links and active-route metadata |
| `category-icons.ts` | SVG icon paths and category item counts |
| `category-page.ts` | Category listing data with computed product counts |
| `product-showcase.ts` | Category color classes |
| `search.ts` | Computed category product counts for search |
| `service-benefits.ts` | SVG icon paths keyed by benefit ID |
| `contact.ts` | Contact form topic options |

Component structure, Tailwind classes, navigation labels, form controls, cart behavior and some interface labels remain in code. Adding a category or benefit may also require a corresponding icon mapping.

## Decap CMS

The admin entry is `src/pages/admin.html`, available at `/admin/` relative to the deployment base. It loads Decap 3 from a CDN and reads `public/admin/config.yml` through `./config.yml`.

- Local admin: [localhost:4321/admin/](http://localhost:4321/admin/).
- GitHub Pages admin: [Reboot Lab CMS](https://yamil-pedroso.github.io/astro-decap-lab/admin/).
- The configured GitHub repository is `Yamil-Pedroso/astro-decap-lab`, branch `main`.
- Hosted authentication uses the external Cloudflare Worker endpoint configured in `backend.base_url`; its implementation is not included here.
- `local_backend: true` enables local editing when a Decap local proxy is running. Follow the [Decap local backend guide](https://decapcms.org/docs/working-with-a-local-git-repository/) to start it from the repository root alongside Astro. Review and commit local content edits with Git.

Product image uploads target `src/assets/images/uploads`, with Markdown paths using `../../assets/images/uploads`. Other image fields currently use text widgets and require manually entered relative paths.

The CMS configuration covers all five collections, but the **Pages → Categories** editor currently contains copied About fields and the wrong template default. Correct that mapping before editing this page through Decap; its existing Markdown and Astro schema are correct.

## Deployment

`astro.config.mjs` sets the base path only when `DEPLOY_TARGET` explicitly equals `github-pages`:

```js
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
// Inside defineConfig:
base: isGitHubPages ? "/astro-decap-lab/" : "/",
```

| Target | Build environment | Base path |
| --- | --- | --- |
| Local / Vercel / VPS | `DEPLOY_TARGET` unset | `/` |
| GitHub Pages | `DEPLOY_TARGET=github-pages` | `/astro-decap-lab/` |

Internal links use `withBasePath()` from `src/utils/paths.ts`:

```astro
<a href={withBasePath(`/products/${product.slug}`)}>View product</a>
```

Store internal destinations as `/products/...` without a deployment prefix. The helper adds the base at the call site; external URLs, `mailto:`, `tel:`, anchors and relative URLs pass through unchanged. Do not pass already-prefixed paths to it.

### GitHub Pages

On pushes to `main`, `.github/workflows/ci.yml` installs dependencies, builds with `DEPLOY_TARGET=github-pages`, uploads `dist/` and deploys it to Pages. Configure the repository's Pages source as **GitHub Actions**.

The configured site URL is [Reboot Lab on GitHub Pages](https://yamil-pedroso.github.io/astro-decap-lab/). To reproduce its build and preview locally in a POSIX shell:

```sh
DEPLOY_TARGET=github-pages npm run build
DEPLOY_TARGET=github-pages npm run preview
```

Use the prefixed URL reported by the preview server.

### Vercel and other root-domain hosting

Use `npm run build`, publish `dist/`, and leave `DEPLOY_TARGET` unset. The current output is static. The Vercel project URL is [astro-decap-lab.vercel.app](https://astro-decap-lab.vercel.app/); there is no Vercel-specific workflow in this repository.

The `site` value currently remains `https://yamil-pedroso.github.io` in every environment. Review it when introducing canonical URLs, a sitemap or a primary custom domain; changing `base` alone does not change `site`.

### Docker and VPS

The multi-stage `Dockerfile` builds with Node.js 24 and serves `dist/` with Nginx. `nginx.conf` resolves generated static routes and returns 404 for missing pages.

```sh
docker build -t reboot-lab .
docker run -d --name reboot-lab-web --restart unless-stopped \
  -p 127.0.0.1:8082:80 reboot-lab
```

The container is exposed on the host's loopback interface. Public access and HTTPS require a separately configured reverse proxy; that host configuration is not included here.

`.github/workflows/production.yml` also runs on pushes to `main`. It requires the repository secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY`. The server must already have Docker, Git access to the repository and a checkout at `/var/www/astro-decap-lab`.

The workflow pulls `main`, builds the image, replaces `reboot-lab-web`, and checks `http://127.0.0.1:8082`. Its stop/remove steps target an existing container; it interrupts service during replacement and has no rollback step. The command above describes first-time container startup. Docker Compose is not configured.

## Known limitations and next steps

- Align the Decap Categories page fields with the `categories` template schema.
- Replace the Best Sellers `+` link to `/cart` with the intended cart interaction; no `/cart` page exists.
- Normalize the header's active-route comparison for prefixed deployments. Links include the base correctly, but active-state matching still uses the raw pathname.
- Connect checkout to payment/order services and the contact form to message delivery.
- Validate relation targets when content IDs change, and improve CMS image editing beyond product uploads.
- Add automated typechecking and browser tests, including mobile navigation and CMS publishing.
- Improve VPS first-deployment handling and rollback; consider Docker Compose and documented HTTPS proxy setup.

`/content-test` remains a development page included in the static build. The saved preview image above is a repository asset, not an automatically refreshed screenshot.

## Verification

Repository review on **2026-09-05**: `npx astro sync`, `npm run build`, and `DEPLOY_TARGET=github-pages npm run build` completed successfully, generating 18 pages with the current content.

This review checked source code and local builds. It did not validate live deployments, build a Docker image, authenticate through Decap or submit CMS changes.
