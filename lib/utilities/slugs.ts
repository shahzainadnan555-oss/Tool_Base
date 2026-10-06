export const UTILITY_SLUGS = [
  "image-to-base64",
  "base64-to-image",
  "base64",
  "meme-generator",
  "bionic-reading-converter",
  "text-to-handwriting",
  "text-to-image",
  "random-object-generator",
  "mhtml-to-pdf",
  "aes-encrypt",
  "aes-decrypt",
  "ip-to-binary",
  "random-ip-generator",
  "json-viewer",
  "terms-generator",
  "privacy-policy-generator",
  "webcam-test",
  "corrupt-file",
  "e-signature",
  "icons",
  "web-templates",
  "invoice-generator",
] as const;

export type UtilitySlug = (typeof UTILITY_SLUGS)[number];

export function isUtilityToolSlug(slug: string): slug is UtilitySlug {
  return (UTILITY_SLUGS as readonly string[]).includes(slug);
}
