import { categories } from "./categories";
import { products } from "./products";

export const categoryProductCounts: Record<string, number> = Object.fromEntries(
  categories.map((category) => [
    category.slug,
    products.filter((product) => product.category === category.slug).length,
  ]),
);
