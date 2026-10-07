import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllTools } from "@/lib/tools/registry";
import { getCategoryById } from "@/lib/tools/categories";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Tools",
  description: "Tool management foundation for Tool Base.",
  path: "/admin/tools",
  noIndex: true,
});

export default function AdminToolsPage() {
  const tools = getAllTools();

  return (
    <div>
      <h1 className="tm-h1">Tool management</h1>
      <p className="tm-lead mt-4">
        Registry-backed tool listing for internal review. Status values come from the
        frontend registry only.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-tm-border bg-tm-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-tm-border bg-tm-soft">
            <tr>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Flags</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b border-tm-border last:border-0">
                <td className="px-4 py-3 font-semibold text-tm-text">{tool.name}</td>
                <td className="px-4 py-3 text-tm-muted">
                  {getCategoryById(tool.category)?.name}
                </td>
                <td className="px-4 py-3 text-tm-muted">{tool.status}</td>
                <td className="px-4 py-3 text-tm-muted">
                  {[tool.popular ? "popular" : null, tool.new ? "new" : null]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
