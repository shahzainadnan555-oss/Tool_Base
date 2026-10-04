import type { ReactNode } from "react";
import Link from "next/link";

/** [[jpg-to-png|JPG to PNG]] → /tools/jpg-to-png ; [[blog:pdf-tools-guide|PDF guide]] → /blogs/... */
const LINK = /\[\[(?:(blog|tool):)?([a-z0-9-]+)\|([^\]]+)\]\]/g;

export function BlogRichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const kind = match[1] || "tool";
    const slug = match[2];
    const label = match[3];
    const href = kind === "blog" ? `/blogs/${slug}` : `/tools/${slug}`;
    nodes.push(
      <Link
        key={`${kind}-${slug}-${match.index}`}
        href={href}
        className="font-bold text-tm-accent hover:text-tm-accent-hover"
      >
        {label}
      </Link>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
