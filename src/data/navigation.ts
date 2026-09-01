import type {
  FooterNavigationGroup,
  HeaderNavigationLink,
} from "../types/navigation";

export const headerNavigation: HeaderNavigationLink[] = [
  { label: "Shop", href: "/", activePaths: ["/products"], exactPaths: ["/"] },
  { label: "Categories", href: "/categories", activePaths: ["/categories"] },
  { label: "About", href: "/about", activePaths: ["/about"] },
  { label: "Contact", href: "/contact", activePaths: ["/contact"] },
];

export const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "Laptops", href: "/categories/laptops" },
      { label: "Desktops", href: "/categories/desktops" },
      { label: "Monitors", href: "/categories/monitors" },
      { label: "Components", href: "/categories/components" },
    ],
  },
  {
    title: "Reboot Lab",
    links: [
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Warranty", href: "/warranty" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];
