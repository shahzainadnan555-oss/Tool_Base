/**
 * Compact privacy note for image upload/processing workspaces.
 * Wording must match real behavior — never claim "instantly" unless processing is effectively immediate.
 */
export function ImagePrivacyNotice({
  timing = "instant",
  className,
}: {
  /** instant = converters/editors that finish in the browser quickly; secure = longer local jobs */
  timing?: "instant" | "secure";
  className?: string;
}) {
  const body =
    timing === "instant"
      ? "We respect your privacy. Photos are processed instantly and never stored or shared."
      : "We respect your privacy. Photos are processed securely and never stored or shared.";

  return (
    <p
      className={
        className ??
        "flex items-start gap-2 text-xs font-medium leading-relaxed text-tm-muted"
      }
      role="note"
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0">
        🔒
      </span>
      <span>{body}</span>
    </p>
  );
}
