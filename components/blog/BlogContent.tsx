import { BlogRichText } from "@/components/blog/BlogRichText";
import type { BlogBlock } from "@/lib/blog/types";

export function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="mt-10 max-w-3xl space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={`h2-${index}`} className="tm-h2 pt-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={`h3-${index}`} className="tm-h3 pt-2">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={`ul-${index}`} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item} className="text-base font-medium leading-relaxed text-tm-text-secondary">
                  <BlogRichText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={`ol-${index}`} className="list-decimal space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item} className="text-base font-medium leading-relaxed text-tm-text-secondary">
                  <BlogRichText text={item} />
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "table") {
          return (
            <div key={`table-${index}`} className="tm-table-wrap">
              <table className="tm-table">
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join("-")}>
                      {row.map((cell) => (
                        <td key={cell}>
                          <BlogRichText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "code") {
          return (
            <pre key={`code-${index}`} className="tm-code">
              <code>{block.text}</code>
            </pre>
          );
        }
        return (
          <p key={`p-${index}`} className="text-base font-medium leading-relaxed text-tm-text-secondary">
            <BlogRichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
