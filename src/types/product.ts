import type { ImageMetadata } from "astro";
import type { Category } from "./category";

export interface Product {
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: ImageMetadata;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductCollection extends Category {
  image?: ImageMetadata;
  tone: string;
}

export interface FlashDeal {
  product: Product;
  discount: number;
}
