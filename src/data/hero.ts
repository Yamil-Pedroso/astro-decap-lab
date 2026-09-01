import assets from "../assets";
import type { HeroContent } from "../types/hero";

export const heroContent: HeroContent = {
  eyebrow: "Refurbished technology",
  title: "Technology deserves a second life.",
  description:
    "Discover reliable refurbished computers, components and accessories for a smarter and more sustainable way to use technology.",
  primaryAction: { label: "Shop products", href: "#products" },
  secondaryAction: { label: "Learn more", href: "/about" },
  image: assets.hero1,
  imageAlt: "Refurbished laptop illuminated with purple light",
};
