import type { SpecializedCalcResult } from "./types";

function parseMoney(raw: string, label: string): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) throw new Error(`Please enter ${label}.`);
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid ${label}.`);
  if (n < 0) throw new Error(`${label} cannot be negative.`);
  return n;
}

function parseOptionalMoney(raw: string, label: string): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) return 0;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid ${label}.`);
  if (n < 0) throw new Error(`${label} cannot be negative.`);
  return n;
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
}

export function calculateTotaledCar(input: {
  vehicleValue: string;
  deductible: string;
  additions?: string;
  deductions?: string;
  salvageValue?: string;
  keepSalvage?: boolean;
  currency: string;
}): SpecializedCalcResult {
  const value = parseMoney(input.vehicleValue, "estimated vehicle value");
  const deductible = parseMoney(input.deductible, "deductible");
  const additions = parseOptionalMoney(input.additions ?? "", "additions");
  const deductions = parseOptionalMoney(input.deductions ?? "", "other deductions");
  const salvage = input.keepSalvage
    ? parseOptionalMoney(input.salvageValue ?? "", "salvage value")
    : 0;

  const settlement = value - deductible + additions - deductions - salvage;
  const money = (n: number) => formatMoney(n, input.currency);

  return {
    headline: money(settlement),
    subhead: "Estimated value — not a guaranteed insurance payout",
    primaryLabel: "Estimated value",
    primary: money(settlement),
    breakdown: [
      { label: "Estimated vehicle value", value: money(value) },
      { label: "Deductible", value: `− ${money(deductible)}` },
      ...(additions ? [{ label: "User-entered additions", value: `+ ${money(additions)}` }] : []),
      ...(deductions ? [{ label: "User-entered deductions", value: `− ${money(deductions)}` }] : []),
      ...(input.keepSalvage
        ? [{ label: "Salvage / retention deduction", value: `− ${money(salvage)}` }]
        : []),
      { label: "Estimated settlement", value: money(settlement) },
    ],
    formula:
      "Estimated settlement = estimated vehicle value − deductible + additions − other deductions − salvage (if kept)",
    notes: [
      "This calculator provides a general estimate. Actual insurance settlements depend on the policy, insurer valuation, vehicle market data, deductible, jurisdiction, and other applicable factors.",
    ],
    copyText: `Estimated totaled-car settlement: ${money(settlement)}`,
  };
}

export function calculateCapitalGains(input: {
  purchaseBasis: string;
  improvements: string;
  acquisitionCosts: string;
  salePrice: string;
  sellingCosts: string;
  exemption: string;
  taxRate: string;
  currency: string;
}): SpecializedCalcResult {
  const purchase = parseMoney(input.purchaseBasis, "purchase price / basis");
  const improvements = parseOptionalMoney(input.improvements, "basis adjustments");
  const acquisition = parseOptionalMoney(input.acquisitionCosts, "acquisition costs");
  const sale = parseMoney(input.salePrice, "sale price");
  const selling = parseOptionalMoney(input.sellingCosts, "selling costs");
  const exemption = parseOptionalMoney(input.exemption, "exemption");
  const rate = parseOptionalMoney(input.taxRate, "tax rate");
  if (rate > 100) throw new Error("Tax rate cannot exceed 100%.");

  const adjustedBasis = purchase + improvements + acquisition;
  const netProceeds = sale - selling;
  const capitalGain = netProceeds - adjustedBasis;
  const taxableGain = Math.max(0, capitalGain - exemption);
  const tax = taxableGain * (rate / 100);
  const money = (n: number) => formatMoney(n, input.currency);

  return {
    headline: money(tax),
    subhead: "Estimated tax from your inputs — not an official tax liability",
    primaryLabel: "Estimated tax",
    primary: money(tax),
    breakdown: [
      { label: "Adjusted basis", value: money(adjustedBasis) },
      { label: "Net sale proceeds", value: money(netProceeds) },
      { label: "Estimated capital gain", value: money(capitalGain) },
      { label: "Exemption / exclusion entered", value: money(exemption) },
      { label: "Taxable gain", value: money(taxableGain) },
      { label: "User-entered tax rate", value: `${rate}%` },
      { label: "Estimated tax", value: money(tax) },
    ],
    formula:
      "Adjusted basis = purchase basis + adjustments + acquisition costs. Net proceeds = sale price − selling costs. Capital gain = net proceeds − adjusted basis. Taxable gain = max(0, capital gain − exemption). Estimated tax = taxable gain × rate.",
    notes: [
      "This is a general estimation tool, not professional tax advice. Tax rules vary by jurisdiction and tax year.",
      "The rate is the rate you enter. Tool Base does not apply a hidden national tax table.",
    ],
    copyText: `Estimated capital gain ${money(capitalGain)}; taxable gain ${money(taxableGain)}; estimated tax ${money(tax)} at ${rate}%`,
  };
}

export function calculateRetirement(input: {
  currentAge: string;
  retirementAge: string;
  currentSavings: string;
  annualContribution: string;
  annualIncome?: string;
  contributionPercent?: string;
  annualReturnPercent: string;
  inflationPercent: string;
  employerMatchPercent: string;
  targetRetirementIncome?: string;
  currency: string;
}): SpecializedCalcResult {
  const currentAge = Number(input.currentAge);
  const retirementAge = Number(input.retirementAge);
  if (!Number.isFinite(currentAge) || currentAge < 0 || currentAge > 120) {
    throw new Error("Please enter a valid current age.");
  }
  if (!Number.isFinite(retirementAge) || retirementAge < 0 || retirementAge > 120) {
    throw new Error("Please enter a valid retirement age.");
  }
  if (retirementAge <= currentAge) {
    throw new Error("Retirement age must be greater than current age.");
  }
  const years = retirementAge - currentAge;
  const pv = parseOptionalMoney(input.currentSavings, "current savings");
  const income = parseOptionalMoney(input.annualIncome ?? "", "annual income");
  const contribPct = parseOptionalMoney(
    input.contributionPercent ?? "",
    "contribution percentage",
  );
  let pmt = parseOptionalMoney(input.annualContribution, "annual contribution");
  if (!input.annualContribution.trim() && contribPct > 0) {
    if (income <= 0) {
      throw new Error("Enter annual income to use a contribution percentage.");
    }
    pmt = income * (contribPct / 100);
  }
  if (contribPct > 100) throw new Error("Contribution percentage cannot exceed 100%.");
  const rPct = parseOptionalMoney(input.annualReturnPercent, "expected annual return");
  const inflPct = parseOptionalMoney(input.inflationPercent, "inflation");
  const matchPct = parseOptionalMoney(input.employerMatchPercent, "employer match");
  if (rPct > 50) throw new Error("Expected return looks unrealistic. Enter a percentage such as 7.");
  if (inflPct > 50) throw new Error("Inflation assumption looks unrealistic.");
  if (matchPct > 100) throw new Error("Employer match cannot exceed 100% of your contribution.");

  const r = rPct / 100;
  const annual = pmt * (1 + matchPct / 100);
  const growthFactor = (1 + r) ** years;
  const savingsGrowth = pv * growthFactor;
  const contributionGrowth =
    r === 0 ? annual * years : annual * ((growthFactor - 1) / r);
  const projected = savingsGrowth + contributionGrowth;
  const totalContributions = pv + annual * years;
  const investmentGrowth = projected - totalContributions;
  const realRate = (1 + r) / (1 + inflPct / 100) - 1;
  const withdrawal = projected * 0.04;
  const target = parseOptionalMoney(
    input.targetRetirementIncome ?? "",
    "target retirement income",
  );
  const money = (n: number) => formatMoney(n, input.currency);

  return {
    headline: money(projected),
    subhead: "Projected savings at retirement — not a guaranteed outcome",
    primaryLabel: "Projected retirement savings",
    primary: money(projected),
    breakdown: [
      { label: "Years until retirement", value: String(years) },
      { label: "Current savings grown", value: money(savingsGrowth) },
      { label: "Contribution growth (including match)", value: money(contributionGrowth) },
      { label: "Total contributions (savings + annual amounts)", value: money(totalContributions) },
      { label: "Estimated investment growth", value: money(investmentGrowth) },
      {
        label: "Optional 4% withdrawal illustration",
        value: `${money(withdrawal)} / year`,
      },
      {
        label: "Inflation-adjusted return assumption",
        value: `${(realRate * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`,
      },
      ...(target
        ? [
            {
              label: "Target retirement income (user-entered)",
              value: `${money(target)} / year`,
            },
          ]
        : []),
    ],
    formula:
      "Projected value = current savings × (1 + r)^n + annual contribution × [((1 + r)^n − 1) / r], with r = 0 handled as simple addition. Employer match is applied to the annual contribution before compounding.",
    notes: [
      "This is an independent Tool Base calculator and is not affiliated with or endorsed by Dave Ramsey.",
      "Returns, inflation, and contributions are user-entered assumptions. Investment results are not guaranteed.",
    ],
    copyText: `Projected retirement savings: ${money(projected)} in ${years} years`,
  };
}
