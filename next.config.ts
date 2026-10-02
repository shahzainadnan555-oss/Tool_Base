import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
            value: "camera=(), microphone=(), geolocation=(), payment=()",
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
