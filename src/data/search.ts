import type { Category } from "../types/category";
import type { Product } from "../types/product";

export const getCategoryProductCounts = (
  categories: Category[],
  products: Product[],
): Record<string, number> =>
  Object.fromEntries(
    categories.map((category) => [
      category.slug,
      products.filter((product) => product.category === category.slug).length,
    ]),
  );
