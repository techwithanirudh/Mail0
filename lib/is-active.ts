export function isActive(
  url: string,
  pathname: string,
  searchParams?: URLSearchParams,
  nested = true,
): boolean {
  // Remove query parameters and trailing slashes from URL & pathname
  const [baseUrl] = url.split("?");
  const [basePath] = pathname.split("?");

  const cleanUrl = baseUrl.replace(/\/$/, "");
  const cleanPathname = basePath.replace(/\/$/, "");

  // Check if paths match exactly or allow nested paths
  if (cleanPathname !== cleanUrl && !(nested && cleanPathname.startsWith(`${cleanUrl}/`))) {
    return false;
  }

  // If no searchParams provided, skip query checking
  if (!searchParams) return true;

  // Convert URL's query string into a `URLSearchParams` object
  const urlParams = new URLSearchParams(url.split("?")[1] || "");

  // Ensure all query parameters in `url` exist in `searchParams`
  for (const [key, value] of urlParams.entries()) {
    if (searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
}
