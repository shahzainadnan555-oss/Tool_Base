function bionicWord(word: string): string {
  const match = word.match(/^(\W*)(\w+)(\W*)$/);
  if (!match) return word;
  const [, prefix, core, suffix] = match;
  const take = Math.max(1, Math.ceil(core.length * 0.45));
  return `${prefix}<strong>${core.slice(0, take)}</strong>${core.slice(take)}${suffix}`;
}

export function toBionicHtml(input: string): string {
  if (!input.trim()) throw new Error("Please enter text to convert.");
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split(/(\s+)/)
    .map((part) => (/\s/.test(part) ? part.replace(/\n/g, "<br />") : bionicWord(part)))
    .join("");
}
