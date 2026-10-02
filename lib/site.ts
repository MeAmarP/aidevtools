export function siteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) URL.");
  return url;
}
