import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllTools } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · FAQ",
  description: "FAQ management foundation for ToolMyra.",
  path: "/admin/faq",
  noIndex: true,
});

export default function AdminFaqPage() {
  const faqCount = getAllTools().reduce((total, tool) => total + tool.faq.length, 0);

  return (
    <div>
      <h1 className="tm-h1">FAQ management</h1>
      <p className="tm-lead mt-4">
        FAQ content currently lives in the tool registry and homepage sections. This page
        is the admin foundation for a future editorial workflow.
      </p>
      <div className="mt-8 rounded-2xl border border-tm-border bg-white p-5">
        <p className="text-sm font-bold text-tm-muted">FAQ entries in tool registry</p>
        <p className="mt-2 text-3xl font-extrabold text-tm-text">{faqCount}</p>
      </div>
    </div>
  );
}
