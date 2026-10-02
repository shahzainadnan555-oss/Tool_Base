export function generateUnixTimestamp(options: {
  useNow?: boolean;
  dateValue?: string;
}): { seconds: string; milliseconds: string; iso: string } {
  let date: Date;
  if (options.useNow !== false && !options.dateValue) {
    date = new Date();
  } else {
    if (!options.dateValue) throw new Error("Please choose a date and time.");
    date = new Date(options.dateValue);
    if (Number.isNaN(date.getTime())) throw new Error("Invalid date/time.");
  }
  const ms = date.getTime();
  return {
    seconds: Math.floor(ms / 1000).toString(),
    milliseconds: ms.toString(),
    iso: date.toISOString(),
  };
}

export function convertUnixTimestamp(
  input: string,
  unit: "seconds" | "milliseconds",
): {
  local: string;
  utc: string;
  iso: string;
  seconds: string;
  milliseconds: string;
} {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a Unix timestamp.");
  if (!/^-?\d+$/.test(trimmed)) throw new Error("Timestamp must be an integer.");

  let ms = BigInt(trimmed);
  if (unit === "seconds") ms *= BigInt(1000);

  // Guard against absurd ranges for Date
  if (ms > BigInt(Number.MAX_SAFE_INTEGER) || ms < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error("Timestamp is outside the supported JavaScript Date range.");
  }
  const date = new Date(Number(ms));
  if (Number.isNaN(date.getTime())) throw new Error("Invalid timestamp.");

  return {
    local: date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" }),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    seconds: Math.floor(date.getTime() / 1000).toString(),
    milliseconds: date.getTime().toString(),
  };
}
