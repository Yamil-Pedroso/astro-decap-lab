import { products } from "./products";
import type { Product } from "../types/product";

export const bestSellers: Product[] = Array.from(
  { length: 5 },
  (_, index) => products[index % products.length],
);
