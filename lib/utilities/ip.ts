function parseIpv4(value: string): number[] {
  const parts = value.trim().split(".");
  if (parts.length !== 4) throw new Error("Enter an IPv4 address such as 192.0.2.10.");
  return parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) throw new Error("Invalid IPv4 address.");
    const n = Number(part);
    if (n > 255) throw new Error("Invalid IPv4 address.");
    return n;
  });
}

export function ipv4ToBinary(value: string): string {
  return parseIpv4(value)
    .map((octet) => octet.toString(2).padStart(8, "0"))
    .join(" ");
}

export function generateRandomIpv4(count = 5): string[] {
  const n = Math.min(50, Math.max(1, count));
  const out: string[] = [];
  const bytes = new Uint8Array(n * 2);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < n; i += 1) {
    const third = bytes[i * 2] % 256;
    const fourth = bytes[i * 2 + 1] % 256;
    out.push(`203.0.${third}.${fourth}`);
  }
  return out;
}
