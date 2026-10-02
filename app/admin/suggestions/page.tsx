import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Suggestions",
  description: "Tool suggestion inbox foundation for ToolMyra.",
  path: "/admin/suggestions",
  noIndex: true,
});

export default function AdminSuggestionsPage() {
  return (
    <div>
      <h1 className="tm-h1">Tool suggestions</h1>
      <p className="tm-lead mt-4">
        Frontend inbox scaffolding for future suggestion API storage. No live backend data
        is shown here.
      </p>
      <div className="mt-8">
        <EmptyState
          title="No stored suggestions yet"
          description="Public suggestion forms are ready. Connect an API later to collect and review submissions here."
        />
      </div>
    </div>
  );
}
