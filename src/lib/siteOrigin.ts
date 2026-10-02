/** Public metadata configuration is an origin, never a credential-bearing URL. */
export function siteOrigin(value: string | undefined) {
  if (!value?.trim()) return "http://localhost:3000";
  const url = new URL(value.trim());
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    !(url.protocol === "https:" || (local && url.protocol === "http:"))
  )
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must use HTTPS (HTTP only on localhost), without credentials.",
    );
  return url.origin;
}
