export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  relatedSlugs: string[];
  relatedToolSlugs: string[];
  content: Array<{
    type: "paragraph" | "heading" | "list";
    text?: string;
    items?: string[];
  }>;
}

/**
 * Blog/guides foundation. Keep posts original and genuinely useful.
 * Do not mass-generate empty SEO articles.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-image-format",
    title: "How to Choose the Right Image Format",
    description:
      "A practical guide to JPG, PNG, WebP, and SVG so you can pick the right format for quality, size, and compatibility.",
    excerpt:
      "Learn when to use JPG, PNG, WebP, or SVG based on quality needs, transparency, and file size.",
    category: "Guides",
    publishedAt: "2026-03-01",
    readingTime: "6 min read",
    seoTitle: "How to Choose the Right Image Format | ToolMyra Guides",
    seoDescription:
      "Compare JPG, PNG, WebP, and SVG with practical guidance from ToolMyra. Learn which image format fits quality, transparency, and file-size needs.",
    relatedSlugs: ["how-to-convert-jpg-to-png", "how-to-compress-an-image"],
    relatedToolSlugs: ["jpg-to-png", "png-to-jpg", "jpg-to-webp", "image-compressor"],
    content: [
      {
        type: "paragraph",
        text: "Choosing an image format is less about brand preference and more about what the file needs to do. Transparency, photographic detail, sharp graphics, and file size all point toward different formats.",
      },
      {
        type: "heading",
        text: "JPG for photographs",
      },
      {
        type: "paragraph",
        text: "JPG (JPEG) is a strong default for photographs and complex images with many colors. It usually produces smaller files than PNG for photos, but it does not support transparency.",
      },
      {
        type: "heading",
        text: "PNG for sharp graphics and transparency",
      },
      {
        type: "paragraph",
        text: "PNG is useful when you need clean edges, text-like graphics, or transparent backgrounds. Files can be larger than JPG for photos, so it is not always the best choice for large camera images.",
      },
      {
        type: "heading",
        text: "WebP for modern web delivery",
      },
      {
        type: "paragraph",
        text: "WebP is widely used on the web because it often balances quality and size well. If your audience uses modern browsers and your publishing stack supports WebP, it can be an efficient option.",
      },
      {
        type: "heading",
        text: "SVG for scalable icons and simple illustrations",
      },
      {
        type: "paragraph",
        text: "SVG works best for logos, icons, and simple illustrations that need to scale cleanly. It is not a replacement for photographs.",
      },
      {
        type: "heading",
        text: "A simple decision checklist",
      },
      {
        type: "list",
        items: [
          "Need transparency? Start with PNG or WebP.",
          "Sharing a photo? JPG or WebP are usually better.",
          "Building a logo or icon? Prefer SVG when possible.",
          "Optimizing for the web? Compress after choosing the right format.",
        ],
      },
      {
        type: "paragraph",
        text: "ToolMyra includes converters and compressors so you can move between formats and reduce file size when your workflow needs it.",
      },
    ],
  },
  {
    slug: "how-to-convert-jpg-to-png",
    title: "How to Convert JPG to PNG",
    description:
      "Learn when JPG to PNG conversion helps, what changes in the file, and how to convert a JPG image online with ToolMyra.",
    excerpt:
      "A practical walkthrough of converting JPG images to PNG, including transparency limits and quality expectations.",
    category: "Guides",
    publishedAt: "2026-03-08",
    readingTime: "5 min read",
    seoTitle: "How to Convert JPG to PNG Online | ToolMyra Guides",
    seoDescription:
      "Convert JPG to PNG with clear guidance on quality, transparency, and when PNG is the better format for your image.",
    relatedSlugs: ["how-to-choose-the-right-image-format", "how-to-compress-an-image"],
    relatedToolSlugs: ["jpg-to-png", "png-to-jpg", "image-compressor"],
    content: [
      {
        type: "paragraph",
        text: "Converting JPG to PNG is common when you need a lossless-style raster format, cleaner edges for graphics, or a file that can later support transparency after editing. JPG photos do not suddenly become transparent just because you change the extension — transparency has to be created in an editor if you need it.",
      },
      {
        type: "heading",
        text: "When JPG to PNG is useful",
      },
      {
        type: "list",
        items: [
          "You need a PNG for a workflow that prefers that format.",
          "You plan to edit the image and want a format that handles sharp details well.",
          "You are preparing assets for a design tool that expects PNG.",
        ],
      },
      {
        type: "heading",
        text: "What to expect from the conversion",
      },
      {
        type: "paragraph",
        text: "A JPG already uses lossy compression. Converting it to PNG does not restore detail that was discarded earlier. The PNG may be larger than the original JPG because PNG stores the current pixels without JPG’s photo-oriented compression.",
      },
      {
        type: "heading",
        text: "How to convert with ToolMyra",
      },
      {
        type: "list",
        items: [
          "Open the JPG to PNG Converter.",
          "Upload your JPG image.",
          "Run the conversion and wait for the result.",
          "Download the PNG when processing finishes.",
        ],
      },
      {
        type: "paragraph",
        text: "If the downloaded PNG is larger than you need for the web, follow up with an image compressor after conversion.",
      },
    ],
  },
  {
    slug: "how-to-compress-an-image",
    title: "How to Compress an Image",
    description:
      "Understand image compression tradeoffs and how to reduce file size online without guessing what quality settings mean.",
    excerpt:
      "Learn how image compression works, what quality settings change, and how to shrink images for sharing or the web.",
    category: "Guides",
    publishedAt: "2026-03-12",
    readingTime: "5 min read",
    seoTitle: "How to Compress an Image Online | ToolMyra Guides",
    seoDescription:
      "Reduce image file size with practical guidance on quality tradeoffs, formats, and ToolMyra’s image compressor.",
    relatedSlugs: ["how-to-choose-the-right-image-format", "understanding-pdf-compression"],
    relatedToolSlugs: ["image-compressor", "jpg-to-webp", "png-to-jpg"],
    content: [
      {
        type: "paragraph",
        text: "Image compression reduces file size so photos and graphics are easier to upload, email, or publish. The right approach depends on whether you need a smaller photo for the web or a cleaner graphic that still looks sharp.",
      },
      {
        type: "heading",
        text: "Quality versus file size",
      },
      {
        type: "paragraph",
        text: "Stronger compression usually means a smaller file and more visible quality loss. Mild compression keeps more detail but saves less space. There is no single perfect setting for every image — portraits, screenshots, and diagrams respond differently.",
      },
      {
        type: "heading",
        text: "Format matters",
      },
      {
        type: "paragraph",
        text: "Compressing a photo as JPG or WebP often works better than forcing a large PNG to become tiny. If the image needs transparency, stay with PNG or WebP and compress carefully instead of converting to JPG.",
      },
      {
        type: "heading",
        text: "A practical compression workflow",
      },
      {
        type: "list",
        items: [
          "Choose the right format first.",
          "Compress with a moderate quality setting.",
          "Check the preview or downloaded result at the size you will actually display.",
          "Recompress only if the file is still larger than needed.",
        ],
      },
    ],
  },
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files",
    description:
      "A clear guide to combining multiple PDF documents into one file and what to check before you merge.",
    excerpt:
      "Learn how PDF merging works, what to verify in page order, and how to combine PDFs online with ToolMyra.",
    category: "Guides",
    publishedAt: "2026-03-15",
    readingTime: "5 min read",
    seoTitle: "How to Merge PDF Files Online | ToolMyra Guides",
    seoDescription:
      "Combine PDF files into one document with practical tips on page order, file readiness, and ToolMyra’s PDF merger.",
    relatedSlugs: ["understanding-pdf-compression"],
    relatedToolSlugs: ["pdf-merger", "pdf-compressor", "pdf-splitter"],
    content: [
      {
        type: "paragraph",
        text: "Merging PDFs creates a single document from multiple source files. It is useful for applications, reports, scanned packets, and any workflow where one download is easier to share than many separate attachments.",
      },
      {
        type: "heading",
        text: "Prepare before you merge",
      },
      {
        type: "list",
        items: [
          "Confirm each source PDF opens correctly on its own.",
          "Decide the final page order before uploading.",
          "Remove pages you do not want included, or split first if needed.",
          "Note that password-protected or damaged PDFs may fail.",
        ],
      },
      {
        type: "heading",
        text: "How merging works in practice",
      },
      {
        type: "paragraph",
        text: "A merger concatenates pages from each selected file according to the order you provide. It does not rewrite your content into a new editable document format. Fonts, images, and layout from the source pages are preserved as much as the PDF structure allows.",
      },
      {
        type: "heading",
        text: "After you download the merged PDF",
      },
      {
        type: "paragraph",
        text: "Open the result and skim the page sequence. If the file is still large, compress it as a separate step rather than assuming merging will shrink anything.",
      },
    ],
  },
  {
    slug: "how-to-convert-mp4-to-mp3",
    title: "How to Convert MP4 to MP3",
    description:
      "Extract audio from an MP4 video into an MP3 file and understand what happens to video frames and quality.",
    excerpt:
      "Learn how MP4 to MP3 conversion extracts audio, what quality depends on, and how to run the conversion online.",
    category: "Guides",
    publishedAt: "2026-03-18",
    readingTime: "4 min read",
    seoTitle: "How to Convert MP4 to MP3 Online | ToolMyra Guides",
    seoDescription:
      "Convert MP4 video to MP3 audio with clear guidance on extraction, quality expectations, and ToolMyra’s converter.",
    relatedSlugs: ["understanding-video-file-formats"],
    relatedToolSlugs: ["mp4-to-mp3", "mp4-to-wav", "video-compressor"],
    content: [
      {
        type: "paragraph",
        text: "MP4 to MP3 conversion extracts the audio track from a video file and saves it as an MP3. The video frames are not kept in the MP3 result. This is useful when you only need the sound — for example a lecture, interview, or music clip stored inside a video container.",
      },
      {
        type: "heading",
        text: "What quality depends on",
      },
      {
        type: "paragraph",
        text: "The MP3 cannot sound better than the original audio track. If the source audio is quiet, noisy, or heavily compressed, those characteristics remain. Encoding settings influence file size and additional generation loss, but they cannot invent missing detail.",
      },
      {
        type: "heading",
        text: "How to convert with ToolMyra",
      },
      {
        type: "list",
        items: [
          "Open the MP4 to MP3 tool.",
          "Upload your MP4 file.",
          "Start the conversion and wait for processing to finish.",
          "Download the MP3 only after the result is ready.",
        ],
      },
      {
        type: "paragraph",
        text: "Large videos can take longer because the tool still needs to read the media and encode the audio output. Keep the tab open until the download becomes available.",
      },
    ],
  },
  {
    slug: "how-to-format-json",
    title: "How to Format JSON",
    description:
      "Make JSON readable with indentation and structure checks so nested data is easier to inspect and share.",
    excerpt:
      "Learn why JSON formatting helps, what pretty-printing changes, and how to format JSON online with ToolMyra.",
    category: "Guides",
    publishedAt: "2026-03-20",
    readingTime: "4 min read",
    seoTitle: "How to Format JSON Online | ToolMyra Guides",
    seoDescription:
      "Pretty-print JSON for readability with practical tips on structure, validation, and ToolMyra’s JSON formatter.",
    relatedSlugs: [],
    relatedToolSlugs: ["json-formatter", "json-to-csv", "csv-to-json"],
    content: [
      {
        type: "paragraph",
        text: "Formatting JSON adds indentation and line breaks so nested objects and arrays are easier to read. It does not change the meaning of valid JSON — it changes presentation so people can inspect the structure more quickly.",
      },
      {
        type: "heading",
        text: "Why formatting helps",
      },
      {
        type: "list",
        items: [
          "Nested keys become easier to scan.",
          "Missing commas or brackets are easier to spot after the structure is readable.",
          "Sharing API responses or config snippets becomes clearer.",
        ],
      },
      {
        type: "heading",
        text: "Formatting versus validating",
      },
      {
        type: "paragraph",
        text: "A formatter usually needs syntactically valid JSON before it can pretty-print the data. If formatting fails, check quotes, trailing commas, and matching braces first. Formatting is not the same as checking whether the data matches a specific schema.",
      },
      {
        type: "heading",
        text: "A quick ToolMyra workflow",
      },
      {
        type: "paragraph",
        text: "Paste or provide your JSON in the JSON Formatter, run the tool, and copy the readable output. If you need a tabular view later, convert valid JSON to CSV with a separate utility.",
      },
    ],
  },
  {
    slug: "how-to-use-a-percentage-calculator",
    title: "How to Use a Percentage Calculator",
    description:
      "Understand common percentage calculations, the formulas behind them, and how to avoid mixing up percentage-of and percentage-change problems.",
    excerpt:
      "Learn the difference between percentage-of, percentage change, and related everyday percentage calculations.",
    category: "Guides",
    publishedAt: "2026-03-22",
    readingTime: "5 min read",
    seoTitle: "How to Use a Percentage Calculator | ToolMyra Guides",
    seoDescription:
      "Use percentage formulas correctly with clear examples for percentage-of and percentage-change calculations.",
    relatedSlugs: [],
    relatedToolSlugs: ["percentage-calculator", "average-calculator", "ratio-calculator"],
    content: [
      {
        type: "paragraph",
        text: "Percentage calculators are helpful when you need a quick answer, but the formula must match the question. “What is 15% of 80?” is different from “What is the percentage change from 80 to 92?”",
      },
      {
        type: "heading",
        text: "Percentage of a number",
      },
      {
        type: "paragraph",
        text: "To find a percentage of a number, use (percentage ÷ 100) × number. Example: 15% of 80 = (15 ÷ 100) × 80 = 12.",
      },
      {
        type: "heading",
        text: "Percentage change",
      },
      {
        type: "paragraph",
        text: "To measure change from an original value to a new value, use ((new − original) ÷ original) × 100. Example: from 80 to 92 = ((92 − 80) ÷ 80) × 100 = 15%.",
      },
      {
        type: "heading",
        text: "Common mistakes to avoid",
      },
      {
        type: "list",
        items: [
          "Using the new value as the denominator when you meant the original value.",
          "Mixing percentage points with percent change.",
          "Rounding too early when you need a precise intermediate result.",
        ],
      },
      {
        type: "paragraph",
        text: "ToolMyra’s percentage tools apply the formulas shown on each page. Enter the values carefully and confirm the tool matches the question you are asking.",
      },
    ],
  },
  {
    slug: "understanding-pdf-compression",
    title: "Understanding PDF Compression",
    description:
      "Learn what PDF compression can and cannot do, why some files shrink more than others, and how to evaluate the result.",
    excerpt:
      "A practical explanation of PDF compression tradeoffs, embedded images, and when smaller files are realistic.",
    category: "Guides",
    publishedAt: "2026-03-25",
    readingTime: "5 min read",
    seoTitle: "Understanding PDF Compression | ToolMyra Guides",
    seoDescription:
      "Understand PDF compression limits, image-heavy documents, and how to shrink PDFs without expecting magic results.",
    relatedSlugs: ["how-to-merge-pdf-files"],
    relatedToolSlugs: ["pdf-compressor", "pdf-merger", "jpg-to-pdf"],
    content: [
      {
        type: "paragraph",
        text: "PDF compression reduces file size by re-encoding or simplifying parts of the document, often images and embedded resources. It is useful for email attachments and uploads, but not every PDF can become dramatically smaller.",
      },
      {
        type: "heading",
        text: "Why some PDFs barely shrink",
      },
      {
        type: "paragraph",
        text: "A PDF that is already optimized, mostly text, or previously compressed may have little room left. Password-protected, scanned, or unusually structured files can also limit what a compressor can do.",
      },
      {
        type: "heading",
        text: "Image-heavy documents",
      },
      {
        type: "paragraph",
        text: "Scans and photo-rich PDFs usually offer the biggest savings because image data dominates file size. Stronger compression can make those images look softer, so review the downloaded file at a realistic zoom level.",
      },
      {
        type: "heading",
        text: "A sensible approach",
      },
      {
        type: "list",
        items: [
          "Compress a copy, not your only original.",
          "Start with a moderate setting.",
          "Open the result and check important pages.",
          "Use a stronger setting only if the file is still too large.",
        ],
      },
    ],
  },
  {
    slug: "understanding-video-file-formats",
    title: "Understanding Video File Formats",
    description:
      "Learn the difference between containers and codecs so MP4, WebM, MOV, and related formats make more sense.",
    excerpt:
      "A practical overview of video containers versus codecs, and what that means for conversion and compatibility.",
    category: "Guides",
    publishedAt: "2026-03-28",
    readingTime: "6 min read",
    seoTitle: "Understanding Video File Formats | ToolMyra Guides",
    seoDescription:
      "Learn how MP4, WebM, MOV, and codecs relate, plus what to expect when converting video formats online.",
    relatedSlugs: ["how-to-convert-mp4-to-mp3"],
    relatedToolSlugs: ["mov-to-mp4", "mp4-to-webm", "webm-to-mp4", "video-compressor"],
    content: [
      {
        type: "paragraph",
        text: "Video filenames such as .mp4 or .webm describe a container. Inside that container are one or more streams — usually video and audio — encoded with codecs such as H.264, VP9, AAC, or Opus. Compatibility depends on both the container and the codecs.",
      },
      {
        type: "heading",
        text: "Containers versus codecs",
      },
      {
        type: "paragraph",
        text: "Changing a file extension alone does not convert a video. A real conversion either remuxes compatible streams into a new container or re-encodes streams when the codecs are not suitable for the target format.",
      },
      {
        type: "heading",
        text: "Common everyday formats",
      },
      {
        type: "list",
        items: [
          "MP4 is widely supported for sharing and publishing.",
          "WebM is common on the web and often uses VP8/VP9 with Opus or Vorbis audio.",
          "MOV is frequently produced by cameras and editing apps and may be remuxed to MP4 when codecs already match.",
        ],
      },
      {
        type: "heading",
        text: "What conversion can change",
      },
      {
        type: "paragraph",
        text: "Re-encoding can reduce quality or alter bitrate, while remuxing can be much faster and preserve stream quality when compatible. Large files may take longer and use more memory in the browser. Always play the downloaded result before deleting the original.",
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
