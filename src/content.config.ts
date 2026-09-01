import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const products = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/products",
  }),

  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: z.string(),
      price: z.number(),
      description: z.string(),
      image: image(),
    }),
});

const categories = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/categories" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      image: image(),
      order: z.number(),
    }),
});

const promotions = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/promotions" }),
  schema: ({ image }) =>
    z.object({
      slot: z.enum(["laptop", "desktop", "monitor", "component"]),
      category: z.string(),
      product: z.string().optional(),
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string(),
      cta: z.string(),
      showProductPrice: z.boolean().default(false),
      image: image(),
      order: z.number(),
    }),
});

const benefits = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/benefits" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    href: z.string(),
    order: z.number(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.discriminatedUnion("template", [
      z.object({
        template: z.literal("home"),
        hero: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          image: image(),
          imageAlt: z.string(),
          primaryAction: actionSchema,
          secondaryAction: actionSchema,
        }),
        categoryStripTitle: z.string(),
        promotionsTitle: z.string(),
        showcase: z.object({
          ariaLabel: z.string(),
          collectionsEyebrow: z.string(),
          collectionsTitle: z.string(),
          collectionsViewAll: z.string(),
          collectionCta: z.string(),
          dealsEyebrow: z.string(),
          dealsTitle: z.string(),
          dealsViewAll: z.string(),
          countdown: z.object({ days: z.string(), hours: z.string(), minutes: z.string() }),
          arrivalsEyebrow: z.string(),
          arrivalsTitle: z.string(),
          arrivalsViewAll: z.string(),
          featuredBadge: z.string(),
          featuredDescription: z.string(),
          featuredCta: z.string(),
          newBadge: z.string(),
          featuredProduct: z.string(),
          flashDeals: z.array(z.object({ product: z.string(), discount: z.number() })),
          newArrivals: z.array(z.string()),
        }),
        bestSellers: z.object({
          eyebrow: z.string(),
          title: z.string(),
          viewAll: z.string(),
          badge: z.string(),
          products: z.array(z.string()),
        }),
        benefitsTitle: z.string(),
        categoriesSection: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      }),
      z.object({
        template: z.literal("about"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        image: image(),
        imageAlt: z.string(),
        ideaEyebrow: z.string(),
        ideaTitle: z.string(),
        ideaParagraphs: z.array(z.string()),
        stats: z.array(z.object({ value: z.string(), label: z.string() })),
        principlesEyebrow: z.string(),
        principlesTitle: z.string(),
        principles: z.array(z.object({ number: z.string(), title: z.string(), description: z.string() })),
      }),
      z.object({
        template: z.literal("contact"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        email: z.string(),
        responseTime: z.string(),
        formEyebrow: z.string(),
        formTitle: z.string(),
      }),
      z.object({
        template: z.literal("shipping"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        options: z.array(z.object({ number: z.string(), title: z.string(), time: z.string(), description: z.string() })),
        journeyEyebrow: z.string(),
        journeyTitle: z.string(),
        journeyDescription: z.string(),
        action: actionSchema,
      }),
      z.object({
        template: z.literal("warranty"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        coverageMonths: z.string(),
        coverageLabel: z.string(),
        processEyebrow: z.string(),
        processTitle: z.string(),
        processAction: actionSchema,
        steps: z.array(z.object({ title: z.string(), description: z.string() })),
        notesTitle: z.string(),
        notes: z.string(),
      }),
      z.object({
        template: z.literal("privacy"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        updated: z.string(),
        sections: z.array(z.object({ number: z.string(), title: z.string(), text: z.string() })),
        ctaEyebrow: z.string(),
        ctaTitle: z.string(),
        action: actionSchema,
      }),
      z.object({
        template: z.literal("categories"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        summary: z.string(),
      }),
      z.object({
        template: z.literal("products"),
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        summary: z.string(),
        inventoryEyebrow: z.string(),
        inventoryTitle: z.string(),
        categoriesCta: z.string(),
      }),
    ]),
});

export const collections = {
  products,
  categories,
  promotions,
  benefits,
  pages,
};
