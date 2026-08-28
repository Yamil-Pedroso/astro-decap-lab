import type { Product } from "../types/product";
import assets from "../assets";

export const products: Product[] = [
  {
    name: "ThinkPad T480",
    slug: "thinkpad-t480",
    category: "laptops",
    price: 349,
    description: "Reliable refurbished business laptop.",
    image: assets.laptop1,
  },
  {
    name: "ThinkCentre M720q",
    slug: "thinkcentre-m720q",
    category: "desktops",
    price: 299,
    description: "Compact refurbished desktop for everyday work.",
    image: assets.desktop1,
  },
  {
    name: "Dell UltraSharp U2419H",
    slug: "dell-ultrasharp-u2419h",
    category: "monitors",
    price: 129,
    description:
      "24-inch Full HD refurbished monitor with an IPS panel and versatile connectivity.",
    image: assets.monitor1,
  },
  {
    name: "Kingston DDR4 16GB",
    slug: "kingston-ddr4-16gb",
    category: "components",
    price: 39,
    description:
      "Tested 16GB DDR4 memory module ready to extend the life of your computer.",
    image: assets.component1,
  },
];
