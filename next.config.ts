import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
      { source: "/tools/images", destination: "/categories/image-tools", permanent: false },
      { source: "/tools/pdf", destination: "/categories/pdf-tools", permanent: false },
      { source: "/tools/documents", destination: "/categories/document-data-tools", permanent: false },
      { source: "/tools/text", destination: "/categories/text-tools", permanent: false },
      { source: "/tools/encryption", destination: "/categories/security-encoding", permanent: false },
      { source: "/tools/web-developer", destination: "/categories/developer-tools", permanent: false },
      { source: "/tools/calculators", destination: "/categories/calculators-converters", permanent: false },
      { source: "/tools/generators", destination: "/categories/generators", permanent: false },
      { source: "/tools/social-media", destination: "/categories/generators", permanent: false },
      { source: "/tools/design", destination: "/categories/design-creative", permanent: false },
      { source: "/tools/productivity", destination: "/categories/typing-productivity", permanent: false },
      { source: "/tools/utilities", destination: "/categories/utilities", permanent: false },
      { source: "/tools/specialized-calculators", destination: "/categories/specialized-calculators", permanent: false },
      { source: "/tools/typing-productivity", destination: "/categories/typing-productivity", permanent: false },
      { source: "/tools/design-creative", destination: "/categories/design-creative", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  transpilePackages: [
    "heic2any",
    "utif",
    "imagetracerjs",
    "@imgly/background-removal",
    "onnxruntime-web",
    "browser-image-compression",
    "exifr",
    "react-easy-crop",
    "piexifjs",
    "pdfjs-dist",
    "@cantoo/pdf-lib",
    "jszip",
    "mammoth",
    "docx",
    "marked",
    "turndown",
    "papaparse",
    "js-yaml",
    "fast-xml-parser",
    "jspdf",
    "html2canvas",
    "@ffmpeg/ffmpeg",
    "@ffmpeg/util",
    "music-metadata",
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
