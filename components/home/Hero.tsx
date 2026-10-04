import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const previewTools = [
  { name: "JPG to PNG", category: "Image", icon: "image-convert" },
  { name: "PNG to SVG", category: "Image", icon: "image-convert" },
  { name: "Image Compressor", category: "Image", icon: "compress" },
  { name: "JPG to PDF", category: "PDF", icon: "pdf" },
  { name: "PDF Compressor", category: "PDF", icon: "compress" },
  { name: "MP4 to MP3", category: "Video", icon: "video" },
  { name: "Word Counter", category: "Text", icon: "text" },
  { name: "QR Code Generator", category: "Text", icon: "qr" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-tm-border bg-tm-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.05),transparent_35%)]"
      />
      <div className="tm-container relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="tm-animate-fade-up">
          <p className="text-sm font-extrabold tracking-[0.14em] text-tm-accent uppercase">
            Tool Base
          </p>
          <h1 className="tm-h1 mt-4 max-w-2xl">
            Every Tool You Need. One Simple Place.
          </h1>
          <p className="tm-lead mt-5 max-w-2xl">
            Convert, compress, generate, calculate, edit, and transform files and content
            instantly with Tool Base. Explore free online tools for images, PDFs, audio,
            video, text, developers, conversions, and everyday tasks — with no sign-up
            required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/tools">Explore All Tools</Button>
            <Button href="/categories" variant="secondary">
              Browse Categories
            </Button>
          </div>
          <p className="mt-6 text-sm font-semibold text-tm-muted">
            Free online tools · Online converters · No account required
          </p>
        </div>

        <div
          className="tm-animate-fade-up relative"
          style={{ animationDelay: "120ms" }}
          aria-hidden="true"
        >
          <div className="tm-animate-float absolute -top-4 -left-4 hidden h-24 w-24 rounded-full bg-tm-accent/10 blur-2xl md:block" />
          <div className="rounded-3xl border border-tm-border bg-tm-navy p-4 shadow-[var(--tm-shadow-lg)] md:p-5">
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="text-sm font-bold text-white">Tool Base preview</p>
              <p className="text-xs font-semibold text-slate-300">Instant utilities</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {previewTools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-2xl border border-white/10 bg-tm-white/5 p-3 backdrop-blur-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-tm-accent/20 text-tm-accent-bright">
                    <Icon name={tool.icon} className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-white">{tool.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{tool.category}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-tm-white px-4 py-3">
              <p className="text-sm font-bold text-tm-text">Visit → Find → Use → Download</p>
              <p className="mt-1 text-xs font-semibold text-tm-muted">
                No login. No payment. No premium gates.
              </p>
              <Link
                href="/tools/jpg-to-png"
                className="mt-3 inline-flex text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
              >
                Convert JPG to PNG →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
