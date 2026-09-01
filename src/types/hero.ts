import type { ImageMetadata } from "astro";

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  image: ImageMetadata;
  imageAlt: string;
}
