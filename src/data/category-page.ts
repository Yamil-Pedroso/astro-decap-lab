import assets from "../assets";
import type { CategoryPageItem } from "../types/category";
import { categories } from "./categories";
import { products } from "./products";

const categoryImages = {
  laptops: assets.laptop1,
  desktops: assets.desktop1,
  monitors: assets.monitor1,
  components: assets.component1,
};

export const categoryItems: CategoryPageItem[] = categories.map((category) => ({
  ...category,
  image: categoryImages[category.slug as keyof typeof categoryImages],
  itemCount: products.filter((product) => product.category === category.slug)
    .length,
}));
