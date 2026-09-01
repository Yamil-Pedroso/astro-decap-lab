import assets from "../assets";
import type { CategoryPromo } from "../types/category";

export const categoryPromos: CategoryPromo[] = [
  {
    slug: "laptops",
    eyebrow: "Limited time offer",
    title: "ThinkPad T480",
    description: "Business-ready performance, built for another cycle.",
    price: "From CHF 349",
    cta: "Shop laptops →",
    image: assets.laptop1,
  },
  {
    slug: "desktops",
    eyebrow: "Compact power",
    title: "Desktop performance.",
    description: "Reliable systems for work and everyday use.",
    cta: "Shop desktops →",
    image: assets.desktop1,
  },
  {
    slug: "monitors",
    title: "See every detail.",
    description: "Quality displays for focused setups.",
    cta: "Shop monitors →",
    image: assets.monitor1,
  },
  {
    slug: "components",
    title: "Upgrade. Don’t replace.",
    description: "Tested parts ready for a second life.",
    cta: "Shop components →",
    image: assets.component1,
  },
];
