import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Reports",
  description: "Tool report inbox foundation for ToolMyra.",
  path: "/admin/reports",
  noIndex: true,
});

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="tm-h1">Tool reports</h1>
      <p className="tm-lead mt-4">
        Frontend scaffolding for future problem-report storage and triage. No fabricated
        live report data is displayed.
      </p>
      <div className="mt-8">
        <EmptyState
          title="No stored reports yet"
          description="The public Report a Problem UI is ready to connect to an API in a later prompt."
        />
      </div>
    </div>
  );
}
