const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function withBasePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;

  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}
