function linesOf(input: string): string[] {
  return input.replace(/\r\n/g, "\n").split("\n");
}

export function randomizeList(input: string): string {
  const items = linesOf(input);
  if (!items.some((line) => line.trim())) throw new Error("Enter one list item per line.");
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.join("\n");
}

export function reverseList(input: string): string {
  const items = linesOf(input);
  if (!items.some((line) => line.trim())) throw new Error("Enter one list item per line.");
  return items.reverse().join("\n");
}

const OBJECTS = [
  "notebook", "compass", "lantern", "ceramic mug", "oak key", "linen pouch",
  "brass clip", "cotton scarf", "glass bottle", "cedar box", "steel ruler",
  "wool blanket", "paper clip", "canvas tote", "copper coin", "field journal",
];

export function randomObjects(count = 8): string {
  const n = Math.min(40, Math.max(1, count));
  const bytes = new Uint32Array(n);
  crypto.getRandomValues(bytes);
  return Array.from({ length: n }, (_, i) => OBJECTS[bytes[i] % OBJECTS.length]).join("\n");
}
