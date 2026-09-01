import type {
  CategoryContent,
  CategoryIcon,
  CategoryIconItem,
} from "../types/category";
import type { Product } from "../types/product";

export const categoryIcons: CategoryIcon[] = [
  {
    slug: "laptops",
    paths: [
      "M5 5h14a1 1 0 0 1 1 1v9H4V6a1 1 0 0 1 1-1Z",
      "M2.5 18h19",
      "M9 18h6",
    ],
  },
  {
    slug: "desktops",
    paths: [
      "M4 4h10v11H4z",
      "M7 19h4",
      "M9 15v4",
      "M17 4h3v15h-3z",
      "M18.5 16h.01",
    ],
  },
  {
    slug: "monitors",
    paths: ["M3 4h18v12H3z", "M8 20h8", "M12 16v4"],
  },
  {
    slug: "components",
    paths: [
      "M8 8h8v8H8z",
      "M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3",
      "M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3",
    ],
  },
];

export const createCategoryIconItems = (
  categories: CategoryContent[],
  products: Product[],
): CategoryIconItem[] =>
  categories.map((category) => ({
    ...category,
    itemCount: products.filter((product) => product.category === category.slug)
      .length,
    paths:
      categoryIcons.find((icon) => icon.slug === category.slug)?.paths ?? [],
  }));
