export function isActive(url: string, pathname: string, nested = true): boolean {
  url = url.split("?")[0].replace(/\/$/, "");
  pathname = pathname.split("?")[0].replace(/\/$/, "");

  // Check if exact match or nested path match
  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}
