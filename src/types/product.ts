import type { ImageMetadata } from "astro";

export interface Product {
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: ImageMetadata;
}
