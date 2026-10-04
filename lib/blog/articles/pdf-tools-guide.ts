import type { BlogPost } from "@/lib/blog/types";

export const pdfToolsGuide: BlogPost = {
  id: "pdf-tools-guide",
  slug: "pdf-tools-guide",
  title: "How to Work With PDF Files Online: Convert, Compress, Merge, Split and Extract",
  excerpt:
    "A practical walkthrough of compressing, merging, splitting, converting, and inspecting PDFs without treating every file the same.",
  description:
    "Learn how PDF compression, merging, splitting, rotation, cropping, and image conversion actually work, plus how to choose the right Tool Base PDF utility.",
  category: "PDF Tools",
  tags: ["PDF Tools", "PDF Conversion", "PDF Compression", "PDF Editing", "Documents"],
  seoTitle: "PDF Tools Guide: Convert, Compress, Merge & Split PDF Files | Tool Base",
  seoDescription:
    "Learn practical ways to convert, compress, merge, split, rotate, extract and process PDF files using online PDF tools.",
  relatedToolSlugs: [
    "pdf-compressor",
    "pdf-merger",
    "pdf-splitter",
    "pdf-page-extractor",
    "jpg-to-pdf",
    "pdf-to-jpg",
    "pdf-rotator",
    "pdf-metadata-viewer",
    "pdf-page-reorderer",
    "pdf-text-extractor",
    "pdf-password-protector",
  ],
  relatedArticleIds: [
    "image-conversion-and-optimization-guide",
    "online-file-and-data-tools-guide",
    "developer-and-text-tools-guide",
  ],
  publishedAt: "2026-10-04",
  content: [
    {
      type: "p",
      text: "A PDF is a container for pages, fonts, images, and metadata — not a single “document type” that always behaves the same. A text-heavy contract, a scanned application packet, and a designer’s export can all share the .pdf extension and still need completely different tools.",
    },
    {
      type: "p",
      text: "This guide covers the PDF jobs people actually run: shrink a file for email, combine attachments, pull out pages, turn pages into images, or turn images into a printable packet. Tool Base utilities such as the [[pdf-compressor|PDF compressor]] and [[pdf-merger|PDF merger]] are built for those jobs. They are not a substitute for a full desktop publishing suite.",
    },
    { type: "h2", text: "PDF Basics Worth Knowing" },
    {
      type: "p",
      text: "Some PDFs contain selectable text. Others are photographs of paper. Compression, search, and text extraction behave differently on each. Password-protected or damaged files may fail in a browser tool even when a desktop reader still opens them. Always keep the original until you have opened the output.",
    },
    {
      type: "p",
      text: "Page size, rotation flags, and crop boxes can disagree. A page may look upright in one viewer and sideways in another because the file stores a rotation instruction instead of rewriting pixels. That is why a dedicated [[pdf-rotator|PDF rotator]] is more reliable than rotating a screenshot of the page.",
    },
    { type: "h2", text: "Choosing the Right PDF Task" },
    {
      type: "table",
      headers: ["Goal", "Typical tool", "Watch for"],
      rows: [
        ["Smaller email attachment", "Compress", "Scans shrink more than already-optimized text PDFs"],
        ["One file from many", "Merge", "Page order before you combine"],
        ["Only some pages", "Split or extract", "Range mistakes (1-based page numbers)"],
        ["Images from pages", "PDF to JPG/PNG", "Resolution and page count"],
        ["Packet from photos", "JPG/PNG to PDF", "Page size and orientation"],
      ],
    },
    { type: "h2", text: "PDF Compression" },
    {
      type: "p",
      text: "Compression tries to reduce bytes, often by re-encoding embedded images. A scan-heavy file can drop a lot of weight. A PDF that is already distilled, or that is mostly text and vector lines, may barely move. The [[pdf-compressor|PDF compressor]] reports measured sizes so you can see whether anything actually changed.",
    },
    {
      type: "p",
      text: "Stronger compression can soften scans. Check signature pages, small type, and barcodes after you download. If a form must remain legally crisp, prefer a milder setting or a different delivery method instead of forcing a tiny file.",
    },
    { type: "h2", text: "Merge, Split, and Extract" },
    {
      type: "p",
      text: "Merging concatenates pages in the order you provide. Use the [[pdf-merger|PDF merger]] when a school portal or hiring form wants one upload. Confirm each source opens first. A single broken file can stop the whole job.",
    },
    {
      type: "p",
      text: "Splitting is the reverse: one file becomes several. The [[pdf-splitter|PDF splitter]] is useful when a packet mixed unrelated documents. Extracting is more targeted — keep only the pages you name. The [[pdf-page-extractor|PDF page extractor]] is the right choice when you need pages 3 and 7, not every other chapter.",
    },
    { type: "h3", text: "Reordering and removing pages" },
    {
      type: "p",
      text: "If the pages are right but the sequence is wrong, use the [[pdf-page-reorderer|PDF page reorderer]] instead of splitting and merging by hand. Removing a page you accidentally included is cheaper than starting over. Do this before you compress if you can — there is no reason to encode pages you will delete.",
    },
    { type: "h2", text: "PDF and Image Conversion" },
    {
      type: "p",
      text: "Turning pages into images is useful for slides, thumbnails, or CMS uploads that reject PDFs. [[pdf-to-jpg|PDF to JPG]] suits photographs of pages. [[pdf-to-png|PDF to PNG]] is usually better when text and diagrams must stay sharp. Resolution matters: a low-DPI export looks fine on a phone and poor in print.",
    },
    {
      type: "p",
      text: "The other direction — [[jpg-to-pdf|JPG to PDF]] or [[png-to-pdf|PNG to PDF]] — builds a shareable packet from photos or scans. Check orientation. A mix of landscape screenshots and portrait photos can produce an awkward reading experience unless you rotate first.",
    },
    { type: "h2", text: "Rotation, Cropping, and Metadata" },
    {
      type: "p",
      text: "Rotation fixes pages that were scanned sideways. Use the [[pdf-rotator|PDF rotator]] when the file stores a rotate flag or when the scan itself is physically sideways. Cropping with the [[pdf-cropper|PDF cropper]] trims noisy margins. Neither should be used to hide content you are not allowed to share — crop is a visual trim, not a security redaction tool.",
    },
    {
      type: "p",
      text: "For titles, authors, and dates, the [[pdf-metadata-viewer|PDF metadata viewer]] shows fields the file actually contains. Missing fields are common; many exporters leave them blank. If a document will be published and you do not want producer software names or author strings attached, strip metadata as a last step after the pages themselves are correct.",
    },
    { type: "h2", text: "Text Extraction Versus Scanned Pages" },
    {
      type: "p",
      text: "The [[pdf-text-extractor|PDF text extractor]] copies text objects that already exist in the file. That is why a born-digital invoice often extracts cleanly and a phone photo of the same invoice does not. A scanned page is an image sitting on a canvas. Without OCR, there are no letters to copy — only pixels. If extraction returns empty, look at whether you can select text in a reader. If you cannot select it, conversion to images may be the honest next step, not another extract attempt.",
    },
    {
      type: "p",
      text: "Extracted text also drops layout: columns can interleave, headers can appear in the middle of a paragraph, and hyphenation can split words. Treat extraction as a starting draft for search or notes, not as a pixel-perfect reconstruction of the page.",
    },
    { type: "h2", text: "Passwords and Sharing Limits" },
    {
      type: "p",
      text: "The [[pdf-password-protector|PDF password protector]] can add an open password so casual forwarding is harder. It is not a substitute for access control on a real document system, and it will not help if you email the password in the same thread as the file. Unlocking requires the password the file was given. Browser tools cannot invent a forgotten password, and they should not be used to attack files you do not own.",
    },
    {
      type: "p",
      text: "Browser-based PDF tools also have practical limits: memory, page count, and unusual encodings. If a 400-page engineering drawing set fails, that is a capacity issue, not a reason to retry the same file ten times. Split first, then process the section you actually need.",
    },
    { type: "h2", text: "A Reliable PDF Workflow" },
    {
      type: "ol",
      items: [
        "Open the source and confirm page count and orientation.",
        "Extract or split first if you only need part of the file.",
        "Merge last if several cleaned files must become one packet.",
        "Compress a copy, then inspect important pages.",
        "Keep originals until the recipient confirms they can open the result.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why didn’t my PDF get smaller after compression?",
      answer:
        "The file may already be optimized, mostly text, or structured in a way that leaves little redundant image data. Compare the measured sizes. A smaller number is the only honest proof.",
    },
    {
      question: "Can I merge PDFs with different page sizes?",
      answer:
        "Often yes — pages keep their own sizes. The reading experience can feel uneven. Normalize scans beforehand if you need a consistent packet.",
    },
    {
      question: "Is cropping the same as redacting?",
      answer:
        "No. Cropping trims what you see. Hidden content can still exist in some PDF structures. Do not treat crop as a security wipe.",
    },
    {
      question: "When should I convert a PDF to images?",
      answer:
        "When the destination needs JPG or PNG, when you need a thumbnail, or when you want a visual snapshot of a page. Keep the PDF if you still need selectable text.",
    },
  ],
};
