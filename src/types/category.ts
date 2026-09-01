import type { ImageMetadata } from "astro";

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export type CategoryCardProps = Category;

export interface CategoryPageItem extends Category {
  image: ImageMetadata;
  itemCount: number;
}

export interface CategoryIcon {
  slug: Category["slug"];
  paths: string[];
}

export interface CategoryIconItem extends Category {
  itemCount: number;
  paths: string[];
}

export interface CategoryPromo {
  slug: Category["slug"];
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
  price?: string;
  image: ImageMetadata;
}
