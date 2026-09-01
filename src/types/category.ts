import type { ImageMetadata } from "astro";

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface CategoryContent extends Category {
  image: ImageMetadata;
  order: number;
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
