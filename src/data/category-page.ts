import type { CategoryContent, CategoryPageItem } from "../types/category";
import type { Product } from "../types/product";

export const createCategoryItems = (
  categories: CategoryContent[],
  products: Product[],
): CategoryPageItem[] =>
  categories.map((category) => ({
    ...category,
    itemCount: products.filter((product) => product.category === category.slug)
      .length,
  }));
