export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e9 || abs < 1e-6)) {
    return value.toExponential(6);
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatFixed(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatMoney(value: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${formatFixed(value, 2)}`;
  }
}

export function formatPercent(value: number, digits = 2): string {
  return `${formatFixed(value, digits)}%`;
}

export function formatInteger(value: number): string {
  return Math.round(value).toLocaleString();
}
