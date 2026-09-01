import type { FlashDeal, Product, ProductCollection } from "../types/product";
import { categories } from "./categories";
import { products } from "./products";

const collectionTones = [
  "bg-violet-50",
  "bg-slate-100",
  "bg-blue-50",
  "bg-lime-50",
];

export const productCollections: ProductCollection[] = categories.map(
  (category, index) => ({
    ...category,
    image: products.find((product) => product.category === category.slug)?.image,
    tone: collectionTones[index],
  }),
);

const discounts = [20, 15, 30, 20, 10, 15];

export const flashDeals: FlashDeal[] = Array.from(
  { length: 6 },
  (_, index) => ({
    product: products[index % products.length],
    discount: discounts[index],
  }),
);

export const newArrivals: Product[] = Array.from(
  { length: 4 },
  (_, index) => products[(index + 1) % products.length],
);

export const featuredProduct = products[0];
