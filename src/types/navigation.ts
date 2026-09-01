export interface NavigationLink {
  label: string;
  href: string;
}

export interface HeaderNavigationLink extends NavigationLink {
  activePaths: string[];
  exactPaths?: string[];
}

export interface FooterNavigationGroup {
  title: string;
  links: NavigationLink[];
}
