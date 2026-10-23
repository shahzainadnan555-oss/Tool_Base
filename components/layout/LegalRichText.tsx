import type { ReactNode } from "react";
import Link from "next/link";

/** Supports [label](/path), [label](https://…), and [label](mailto:…) inside legal copy. */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+|\/[^)\s]*)\)/g;

export function LegalRichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const label = match[1];
    const href = match[2];
    const isInternalPath = href.startsWith("/");
    if (isInternalPath) {
      nodes.push(
        <Link
          key={`${href}-${match.index}`}
          href={href}
          className="font-bold text-tm-accent hover:text-tm-accent-hover"
        >
          {label}
        </Link>,
      );
    } else {
      const isMailto = href.startsWith("mailto:");
      nodes.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          {...(isMailto
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
          className="font-bold text-tm-accent hover:text-tm-accent-hover"
        >
          {label}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
