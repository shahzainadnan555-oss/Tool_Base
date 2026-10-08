import { buildAmortizationSchedule, futureValue, pmt } from "./finance-math";
import { formatFixed, formatMoney, formatNumber, formatPercent } from "./format";
import {
  currencySelect,
  def,
  eduDisclaimer,
  moneyField,
  numberField,
  percentField,
  selectField,
} from "./catalog-helpers";
import { parseNumber, parseOptionalNumber, parsePositiveInt } from "./parse";
import type { FormulaCalculatorSpec } from "./types";

function money(v: Record<string, string>) {
  return (n: number) => formatMoney(n, v.currency || "USD");
}

export const financialMoreCatalog: FormulaCalculatorSpec[] = [
  def({
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    subcategory: "financial",
    shortDescription: "Project retirement savings with contributions and growth.",
    keywords: ["retirement calculator", "retirement savings", "nest egg"],
    relatedToolIds: [
      "retirement-calculator-dave-ramsey",
      "401k-calculator",
      "compound-interest-calculator",
      "investment-calculator",
    ],
    featured: true,
    notices: [eduDisclaimer],
    fields: [
      moneyField("current", "Current savings", "50000"),
      moneyField("monthly", "Monthly contribution", "600"),
      percentField("return", "Expected annual return (%)", "7"),
      numberField("years", "Years until retirement", "25", { step: "1", inputMode: "numeric" }),
      moneyField("spend", "Desired monthly retirement income", "4000"),
      percentField("withdraw", "Safe withdrawal rate (%)", "4"),
      currencySelect,
    ],
    compute: (v) => {
      const current = parseNumber(v.current, "current savings", { allowNegative: false });
      const monthly = parseOptionalNumber(v.monthly, "monthly", 0);
      const rate = parseNumber(v.return, "return", { allowNegative: false }) / 100 / 12;
      const years = parseNumber(v.years, "years", { min: 0 });
      const spend = parseOptionalNumber(v.spend, "desired income", 0);
      const withdraw = parseNumber(v.withdraw, "withdrawal rate", { allowZero: false }) / 100;
      const n = Math.round(years * 12);
      const nest = futureValue(current, rate, n, monthly);
      const needed = withdraw > 0 ? (spend * 12) / withdraw : 0;
      const $ = money(v);
      return {
        primaryLabel: "Projected nest egg",
        primary: $(nest),
        breakdown: [
          { label: "Estimated nest egg needed", value: $(needed) },
          { label: "Surplus / shortfall", value: $(nest - needed) },
        ],
        formula: "Future value of savings; need ≈ annual spending / withdrawal rate",
        copyText: `Projected nest egg: ${$(nest)}`,
      };
    },
  }),

  def({
    slug: "401k-calculator",
    name: "401K Calculator",
    subcategory: "financial",
    shortDescription: "US-oriented 401(k) growth estimate with employee and employer contributions.",
    keywords: ["401k calculator", "401(k)", "employer match"],
    relatedToolIds: ["retirement-calculator", "roth-ira-calculator", "ira-calculator"],
    notices: [eduDisclaimer, "US-only estimate. Contribution limits and match rules vary by plan and year."],
    fields: [
      moneyField("balance", "Current 401(k) balance", "25000"),
      moneyField("salary", "Annual salary", "80000"),
      percentField("defer", "Employee deferral (%)", "8"),
      percentField("match", "Employer match (% of salary)", "3"),
      percentField("return", "Expected annual return (%)", "7"),
      numberField("years", "Years", "20", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false });
      const salary = parseNumber(v.salary, "salary", { allowNegative: false, allowZero: false });
      const defer = parseNumber(v.defer, "deferral", { allowNegative: false }) / 100;
      const match = parseNumber(v.match, "match", { allowNegative: false }) / 100;
      const rate = parseNumber(v.return, "return", { allowNegative: false }) / 100 / 12;
      const years = parseNumber(v.years, "years", { min: 0 });
      const monthly = (salary * (defer + match)) / 12;
      const future = futureValue(bal, rate, Math.round(years * 12), monthly);
      const $ = money(v);
      return {
        primaryLabel: "Projected 401(k) balance",
        primary: $(future),
        breakdown: [{ label: "Monthly contributions (employee + match)", value: $(monthly) }],
        formula: "Future value with monthly employee deferral and employer match",
        copyText: `401(k) projection: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "pension-calculator",
    name: "Pension Calculator",
    subcategory: "financial",
    shortDescription: "Estimate a simple defined-benefit pension from salary and years of service.",
    keywords: ["pension calculator", "defined benefit pension"],
    relatedToolIds: ["retirement-calculator", "annuity-calculator", "social-security-calculator"],
    notices: [eduDisclaimer, "Plan formulas differ; enter your plan’s accrual rate."],
    fields: [
      moneyField("salary", "Final average salary", "90000"),
      numberField("years", "Years of service", "25", { step: "1", inputMode: "numeric" }),
      percentField("accrual", "Accrual rate per year (%)", "1.5"),
      currencySelect,
    ],
    compute: (v) => {
      const salary = parseNumber(v.salary, "salary", { allowNegative: false, allowZero: false });
      const years = parseNumber(v.years, "years", { allowNegative: false });
      const accrual = parseNumber(v.accrual, "accrual", { allowNegative: false }) / 100;
      const annual = salary * years * accrual;
      const $ = money(v);
      return {
        primaryLabel: "Estimated annual pension",
        primary: $(annual),
        breakdown: [{ label: "Estimated monthly", value: $(annual / 12) }],
        formula: "Pension ≈ final average salary × years × accrual rate",
        copyText: `Pension estimate: ${$(annual)}/year`,
      };
    },
  }),

  def({
    slug: "social-security-calculator",
    name: "Social Security Calculator",
    subcategory: "financial",
    shortDescription: "Rough US Social Security benefit estimate from AIME and claiming age factor.",
    keywords: ["social security calculator", "ssa estimate", "retirement benefit"],
    relatedToolIds: ["retirement-calculator", "pension-calculator", "annuity-calculator"],
    notices: [
      eduDisclaimer,
      "US-only rough estimate using bend-point style inputs you provide — not an SSA quote.",
    ],
    fields: [
      moneyField("aime", "Estimated AIME (monthly)", "6000"),
      numberField("claimAge", "Claiming age", "67", { min: "62", max: "70", step: "1", inputMode: "numeric" }),
      numberField("fra", "Full retirement age", "67", { min: "66", max: "67", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const aime = parseNumber(v.aime, "AIME", { allowNegative: false, allowZero: false });
      // Simplified 2024-like bend points as editable constants via formula on AIME thirds
      const pia =
        Math.min(aime, 1174) * 0.9 +
        Math.min(Math.max(aime - 1174, 0), 7078 - 1174) * 0.32 +
        Math.max(aime - 7078, 0) * 0.15;
      const claim = parseNumber(v.claimAge, "claiming age", { min: 62, max: 70 });
      const fra = parseNumber(v.fra, "FRA", { min: 66, max: 67 });
      let factor = 1;
      if (claim < fra) factor = 1 - 0.005555 * 12 * (fra - claim); // ~6.67%/yr early approx
      if (claim > fra) factor = 1 + 0.08 * (claim - fra);
      const benefit = pia * Math.max(0.7, factor);
      const $ = money(v);
      return {
        primaryLabel: "Estimated monthly benefit",
        primary: $(benefit),
        breakdown: [
          { label: "Approx. PIA at FRA", value: $(pia) },
          { label: "Age adjustment factor", value: formatFixed(factor, 3) },
        ],
        formula: "Simplified PIA bend points × claiming-age adjustment",
        notes: ["Bend points are illustrative; use SSA tools for official estimates."],
        copyText: `SS estimate: ${$(benefit)}/month`,
      };
    },
  }),

  def({
    slug: "annuity-calculator",
    name: "Annuity Calculator",
    subcategory: "financial",
    shortDescription: "Calculate the future value of an ordinary annuity.",
    keywords: ["annuity calculator", "ordinary annuity", "annuity future value"],
    relatedToolIds: ["annuity-payout-calculator", "future-value-calculator", "retirement-calculator"],
    fields: [
      moneyField("pmt", "Payment per period", "500"),
      percentField("rate", "Rate per period (%)", "0.5"),
      numberField("n", "Number of periods", "240", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const pmtAmt = parseNumber(v.pmt, "payment", { allowNegative: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const n = parsePositiveInt(v.n, "periods");
      const fv = futureValue(0, rate, n, pmtAmt);
      const $ = money(v);
      return {
        primaryLabel: "Future value of annuity",
        primary: $(fv),
        formula: "FV = PMT · ((1+r)^n − 1) / r",
        copyText: `Annuity FV: ${$(fv)}`,
      };
    },
  }),

  def({
    slug: "annuity-payout-calculator",
    name: "Annuity Payout Calculator",
    subcategory: "financial",
    shortDescription: "Estimate fixed payouts from a lump sum over a chosen term.",
    keywords: ["annuity payout", "annuity payment", "withdrawal annuity"],
    relatedToolIds: ["annuity-calculator", "retirement-calculator", "payment-calculator"],
    fields: [
      moneyField("principal", "Annuity balance", "250000"),
      percentField("rate", "Annual rate (%)", "5"),
      numberField("years", "Payout years", "20", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "balance", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const pay = pmt(P, r, n);
      const $ = money(v);
      return {
        primaryLabel: "Estimated monthly payout",
        primary: $(pay),
        breakdown: [{ label: "Total payouts", value: $(pay * n) }],
        formula: "Payout uses the amortizing payment formula on the lump sum",
        copyText: `Annuity payout: ${$(pay)}/month`,
      };
    },
  }),

  def({
    slug: "roth-ira-calculator",
    name: "Roth IRA Calculator",
    subcategory: "financial",
    shortDescription: "US Roth IRA growth estimate with annual contributions.",
    keywords: ["roth ira calculator", "roth ira"],
    relatedToolIds: ["ira-calculator", "401k-calculator", "retirement-calculator"],
    notices: [eduDisclaimer, "US-only estimate. Contribution eligibility depends on income and tax rules."],
    fields: [
      moneyField("balance", "Current balance", "15000"),
      moneyField("annual", "Annual contribution", "7000"),
      percentField("return", "Expected annual return (%)", "7"),
      numberField("years", "Years", "25", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false });
      const annual = parseOptionalNumber(v.annual, "contribution", 0);
      const rate = parseNumber(v.return, "return", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { min: 0 });
      // annual compounding with end-of-year contribution
      let value = bal;
      for (let i = 0; i < years; i++) value = value * (1 + rate) + annual;
      const $ = money(v);
      return {
        primaryLabel: "Projected Roth IRA balance",
        primary: $(value),
        breakdown: [{ label: "Total contributions", value: $(bal + annual * years) }],
        formula: "Yearly compound growth plus annual contribution",
        copyText: `Roth IRA projection: ${$(value)}`,
      };
    },
  }),

  def({
    slug: "ira-calculator",
    name: "IRA Calculator",
    subcategory: "financial",
    shortDescription: "US traditional IRA growth estimate before tax considerations.",
    keywords: ["ira calculator", "traditional ira"],
    relatedToolIds: ["roth-ira-calculator", "401k-calculator", "retirement-calculator"],
    notices: [eduDisclaimer, "US-only estimate. Taxes on withdrawal are not modeled here."],
    fields: [
      moneyField("balance", "Current balance", "20000"),
      moneyField("annual", "Annual contribution", "7000"),
      percentField("return", "Expected annual return (%)", "7"),
      numberField("years", "Years", "20", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false });
      const annual = parseOptionalNumber(v.annual, "contribution", 0);
      const rate = parseNumber(v.return, "return", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { min: 0 });
      let value = bal;
      for (let i = 0; i < years; i++) value = value * (1 + rate) + annual;
      const $ = money(v);
      return {
        primaryLabel: "Projected IRA balance",
        primary: $(value),
        formula: "Annual compounding with contributions",
        copyText: `IRA projection: ${$(value)}`,
      };
    },
  }),

  def({
    slug: "rmd-calculator",
    name: "RMD Calculator",
    subcategory: "financial",
    shortDescription: "Estimate a required minimum distribution using a life-expectancy divisor.",
    keywords: ["rmd calculator", "required minimum distribution"],
    relatedToolIds: ["ira-calculator", "roth-ira-calculator", "retirement-calculator"],
    notices: [eduDisclaimer, "US-oriented. Enter the IRS life-expectancy factor that applies to you."],
    fields: [
      moneyField("balance", "Account balance (Dec 31 prior year)", "400000"),
      numberField("factor", "Life expectancy factor", "27.4", { min: "0.1", step: "0.1" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const factor = parseNumber(v.factor, "factor", { min: 0.1 });
      const rmd = bal / factor;
      const $ = money(v);
      return {
        primaryLabel: "Estimated RMD",
        primary: $(rmd),
        formula: "RMD = prior-year-end balance ÷ life-expectancy factor",
        copyText: `RMD estimate: ${$(rmd)}`,
      };
    },
  }),

  def({
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    subcategory: "financial",
    shortDescription: "Estimate income tax from taxable income and a user-entered effective or marginal rate.",
    keywords: ["income tax calculator", "tax estimate"],
    relatedToolIds: ["salary-calculator", "take-home-paycheck-calculator", "sales-tax-calculator"],
    notices: [eduDisclaimer, "Not jurisdiction-specific. Enter the rate that applies to your situation."],
    fields: [
      moneyField("income", "Taxable income", "75000"),
      percentField("rate", "Tax rate (%)", "22"),
      moneyField("credits", "Tax credits", "0"),
      currencySelect,
    ],
    compute: (v) => {
      const income = parseNumber(v.income, "taxable income", { allowNegative: false });
      const rate = parseNumber(v.rate, "tax rate", { allowNegative: false }) / 100;
      const credits = parseOptionalNumber(v.credits, "credits", 0);
      const tax = Math.max(0, income * rate - credits);
      const $ = money(v);
      return {
        primaryLabel: "Estimated tax",
        primary: $(tax),
        breakdown: [
          { label: "Effective rate on taxable income", value: formatPercent(income ? (tax / income) * 100 : 0) },
          { label: "After-tax income", value: $(income - tax) },
        ],
        formula: "Tax ≈ taxable income × rate − credits",
        copyText: `Estimated tax: ${$(tax)}`,
      };
    },
  }),

  def({
    slug: "salary-calculator",
    name: "Salary Calculator",
    subcategory: "financial",
    shortDescription: "Convert between hourly, monthly, and annual salary figures.",
    keywords: ["salary calculator", "hourly to salary", "annual salary"],
    relatedToolIds: ["take-home-paycheck-calculator", "income-tax-calculator", "hourly-to-salary-calculator"],
    fields: [
      selectField("mode", "Starting from", "annual", [
        { value: "annual", label: "Annual" },
        { value: "monthly", label: "Monthly" },
        { value: "hourly", label: "Hourly" },
      ]),
      moneyField("amount", "Amount", "72000"),
      numberField("hours", "Hours per week", "40", { min: "1", step: "0.5" }),
      numberField("weeks", "Paid weeks per year", "52", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const amount = parseNumber(v.amount, "amount", { allowNegative: false });
      const hours = parseNumber(v.hours, "hours", { min: 1 });
      const weeks = parseNumber(v.weeks, "weeks", { min: 1 });
      let annual = amount;
      if (v.mode === "monthly") annual = amount * 12;
      if (v.mode === "hourly") annual = amount * hours * weeks;
      const $ = money(v);
      return {
        primaryLabel: "Annual salary",
        primary: $(annual),
        breakdown: [
          { label: "Monthly", value: $(annual / 12) },
          { label: "Biweekly", value: $(annual / 26) },
          { label: "Hourly", value: $(annual / (hours * weeks)) },
        ],
        formula: "Annual = hourly × hours/week × weeks/year",
        copyText: `Annual: ${$(annual)}`,
      };
    },
  }),

  def({
    slug: "take-home-paycheck-calculator",
    name: "Take-Home Paycheck Calculator",
    subcategory: "financial",
    shortDescription: "Estimate take-home pay after tax and deduction percentages you enter.",
    keywords: ["take home pay", "paycheck calculator", "net pay"],
    relatedToolIds: ["salary-calculator", "income-tax-calculator", "hourly-to-salary-calculator"],
    notices: [eduDisclaimer, "Enter combined withholding percentages for your jurisdiction."],
    fields: [
      moneyField("gross", "Gross pay per period", "3000"),
      percentField("tax", "Tax withholding (%)", "22"),
      percentField("other", "Other deductions (%)", "8"),
      moneyField("fixed", "Fixed deductions", "50"),
      currencySelect,
    ],
    compute: (v) => {
      const gross = parseNumber(v.gross, "gross pay", { allowNegative: false });
      const tax = parseNumber(v.tax, "tax", { allowNegative: false }) / 100;
      const other = parseNumber(v.other, "other", { allowNegative: false }) / 100;
      const fixed = parseOptionalNumber(v.fixed, "fixed", 0);
      const net = gross * (1 - tax - other) - fixed;
      const $ = money(v);
      return {
        primaryLabel: "Estimated take-home",
        primary: $(net),
        breakdown: [
          { label: "Taxes", value: $(gross * tax) },
          { label: "Other % deductions", value: $(gross * other) },
          { label: "Fixed deductions", value: $(fixed) },
        ],
        formula: "Net = gross × (1 − tax% − other%) − fixed",
        copyText: `Take-home: ${$(net)}`,
      };
    },
  }),

  def({
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    subcategory: "financial",
    shortDescription: "Add or remove sales tax from a price using a rate you provide.",
    keywords: ["sales tax calculator", "add sales tax", "pre-tax price"],
    relatedToolIds: ["vat-tax-calculator", "discount-calculator", "percent-off-calculator"],
    fields: [
      moneyField("amount", "Amount", "100"),
      percentField("rate", "Sales tax rate (%)", "8.25"),
      selectField("mode", "Mode", "add", [
        { value: "add", label: "Add tax to pre-tax price" },
        { value: "remove", label: "Extract tax from total" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const amount = parseNumber(v.amount, "amount", { allowNegative: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const $ = money(v);
      if (v.mode === "add") {
        const tax = amount * rate;
        return {
          primaryLabel: "Total with tax",
          primary: $(amount + tax),
          breakdown: [{ label: "Tax", value: $(tax) }],
          formula: "Total = price × (1 + rate)",
          copyText: `Total with tax: ${$(amount + tax)}`,
        };
      }
      const pretax = amount / (1 + rate);
      const tax = amount - pretax;
      return {
        primaryLabel: "Pre-tax amount",
        primary: $(pretax),
        breakdown: [{ label: "Tax portion", value: $(tax) }],
        formula: "Pre-tax = total / (1 + rate)",
        copyText: `Pre-tax: ${$(pretax)}`,
      };
    },
  }),

  def({
    slug: "marriage-tax-calculator",
    name: "Marriage Tax Calculator",
    subcategory: "financial",
    shortDescription: "Illustrate marriage bonus/penalty using simple tax brackets you enter.",
    keywords: ["marriage tax calculator", "marriage penalty", "filing jointly"],
    relatedToolIds: ["income-tax-calculator", "salary-calculator"],
    notices: [eduDisclaimer, "Simplified two-rate model for illustration — not a full tax engine."],
    fields: [
      moneyField("incomeA", "Income person A", "60000"),
      moneyField("incomeB", "Income person B", "45000"),
      percentField("singleRate", "Approx single effective rate (%)", "18"),
      percentField("jointRate", "Approx joint effective rate (%)", "16"),
      currencySelect,
    ],
    compute: (v) => {
      const a = parseNumber(v.incomeA, "income A", { allowNegative: false });
      const b = parseNumber(v.incomeB, "income B", { allowNegative: false });
      const s = parseNumber(v.singleRate, "single rate", { allowNegative: false }) / 100;
      const j = parseNumber(v.jointRate, "joint rate", { allowNegative: false }) / 100;
      const singleTax = a * s + b * s;
      const jointTax = (a + b) * j;
      const diff = jointTax - singleTax;
      const $ = money(v);
      return {
        primaryLabel: diff > 0 ? "Marriage penalty (illustrative)" : "Marriage bonus (illustrative)",
        primary: $(Math.abs(diff)),
        breakdown: [
          { label: "Tax if filing separately (approx.)", value: $(singleTax) },
          { label: "Tax if filing jointly (approx.)", value: $(jointTax) },
        ],
        formula: "Compare effective-rate estimates for separate vs joint filing",
        copyText: `Marriage tax difference: ${$(diff)}`,
      };
    },
  }),

  def({
    slug: "estate-tax-calculator",
    name: "Estate Tax Calculator",
    subcategory: "financial",
    shortDescription: "Rough estate tax estimate using a taxable estate and rate/exemption you enter.",
    keywords: ["estate tax calculator", "inheritance tax estimate"],
    relatedToolIds: ["income-tax-calculator", "capital-gains-tax-calculator-on-sale-of-property"],
    notices: [eduDisclaimer, "Jurisdiction-specific. Enter exemption and rate for your locality."],
    fields: [
      moneyField("estate", "Gross estate value", "5000000"),
      moneyField("exemption", "Exemption amount", "1000000"),
      percentField("rate", "Estate tax rate (%)", "40"),
      currencySelect,
    ],
    compute: (v) => {
      const estate = parseNumber(v.estate, "estate", { allowNegative: false });
      const exemption = parseOptionalNumber(v.exemption, "exemption", 0);
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const taxable = Math.max(0, estate - exemption);
      const tax = taxable * rate;
      const $ = money(v);
      return {
        primaryLabel: "Estimated estate tax",
        primary: $(tax),
        breakdown: [{ label: "Taxable estate", value: $(taxable) }],
        formula: "Tax ≈ max(0, estate − exemption) × rate",
        copyText: `Estate tax estimate: ${$(tax)}`,
      };
    },
  }),

  def({
    slug: "credit-card-calculator",
    name: "Credit Card Calculator",
    subcategory: "financial",
    shortDescription: "Estimate interest cost and payoff time for a credit card balance.",
    keywords: ["credit card calculator", "credit card interest"],
    relatedToolIds: ["credit-card-payoff-calculator", "debt-payoff-calculator", "interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("balance", "Balance", "4500"),
      percentField("apr", "APR (%)", "21.9"),
      moneyField("payment", "Monthly payment", "200"),
      currencySelect,
    ],
    compute: (v) => {
      const bal0 = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const apr = parseNumber(v.apr, "APR", { allowNegative: false }) / 100 / 12;
      const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
      let bal = bal0;
      let months = 0;
      let interest = 0;
      while (bal > 0.01 && months < 1200) {
        const i = bal * apr;
        if (pay <= i && months > 0) throw new Error("Payment is too low to cover interest.");
        interest += i;
        bal = bal + i - pay;
        months++;
      }
      const $ = money(v);
      return {
        primaryLabel: "Months to pay off",
        primary: String(months),
        breakdown: [
          { label: "Total interest", value: $(interest) },
          { label: "Total paid", value: $(bal0 + interest) },
        ],
        formula: "Month-by-month balance with monthly APR/12 interest",
        copyText: `Payoff in ${months} months; interest ${$(interest)}`,
      };
    },
  }),

  def({
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    subcategory: "financial",
    shortDescription: "Find the payment needed to clear a card balance by a target date.",
    keywords: ["credit card payoff", "pay off credit card"],
    relatedToolIds: ["credit-card-calculator", "debt-payoff-calculator", "payment-calculator"],
    fields: [
      moneyField("balance", "Balance", "6000"),
      percentField("apr", "APR (%)", "19.9"),
      numberField("months", "Target months", "24", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.apr, "APR", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "months");
      const pay = pmt(bal, r, n);
      const $ = money(v);
      return {
        primaryLabel: "Required monthly payment",
        primary: $(pay),
        breakdown: [{ label: "Total paid", value: $(pay * n) }],
        formula: "Amortizing payment to reach zero in n months",
        copyText: `Required payment: ${$(pay)}`,
      };
    },
  }),

  def({
    slug: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    subcategory: "financial",
    shortDescription: "Estimate payoff time and interest for a single debt with fixed payments.",
    keywords: ["debt payoff calculator", "pay off debt"],
    relatedToolIds: ["debt-consolidation-calculator", "credit-card-payoff-calculator", "loan-calculator"],
    fields: [
      moneyField("balance", "Debt balance", "12000"),
      percentField("rate", "Annual rate (%)", "12"),
      moneyField("payment", "Monthly payment", "350"),
      currencySelect,
    ],
    compute: (v) => {
      const bal0 = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
      let bal = bal0;
      let months = 0;
      let interest = 0;
      while (bal > 0.01 && months < 1200) {
        const i = bal * r;
        if (pay <= i) throw new Error("Payment is too low to reduce this debt.");
        interest += i;
        bal = bal + i - pay;
        months++;
      }
      const $ = money(v);
      return {
        primaryLabel: "Payoff time",
        primary: `${Math.floor(months / 12)} yrs ${months % 12} mo`,
        breakdown: [{ label: "Total interest", value: $(interest) }],
        formula: "Iterative amortization until balance reaches zero",
        copyText: `Debt payoff: ${months} months; interest ${$(interest)}`,
      };
    },
  }),

  def({
    slug: "debt-consolidation-calculator",
    name: "Debt Consolidation Calculator",
    subcategory: "financial",
    shortDescription: "Compare separate debt payments to one consolidation loan.",
    keywords: ["debt consolidation", "consolidate loans"],
    relatedToolIds: ["debt-payoff-calculator", "personal-loan-calculator", "loan-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("balances", "Total current balances", "18000"),
      moneyField("currentPay", "Total current monthly payments", "550"),
      percentField("currentRate", "Weighted current APR (%)", "16"),
      percentField("newRate", "Consolidation APR (%)", "10"),
      numberField("newMonths", "New term (months)", "48", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balances, "balances", { allowNegative: false, allowZero: false });
      const currentPay = parseNumber(v.currentPay, "current payments", { allowNegative: false, allowZero: false });
      const newRate = parseNumber(v.newRate, "new rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.newMonths, "term");
      const newPay = pmt(bal, newRate, n);
      const $ = money(v);
      return {
        primaryLabel: "New monthly payment",
        primary: $(newPay),
        breakdown: [
          { label: "Current monthly payments", value: $(currentPay) },
          { label: "Monthly difference", value: $(currentPay - newPay) },
          { label: "New total paid", value: $(newPay * n) },
        ],
        formula: "Compare current payment sum to a new amortizing consolidation loan",
        copyText: `Consolidation payment: ${$(newPay)}`,
      };
    },
  }),

  def({
    slug: "repayment-calculator",
    name: "Repayment Calculator",
    subcategory: "financial",
    shortDescription: "See total repayment cost for a loan at a chosen payment amount.",
    keywords: ["repayment calculator", "loan repayment"],
    relatedToolIds: ["loan-calculator", "debt-payoff-calculator", "amortization-calculator"],
    fields: [
      moneyField("principal", "Principal", "10000"),
      percentField("rate", "Annual rate (%)", "8"),
      moneyField("payment", "Monthly payment", "250"),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
      let bal = P;
      let months = 0;
      let interest = 0;
      while (bal > 0.01 && months < 1200) {
        const i = bal * r;
        if (pay <= i) throw new Error("Payment is too low.");
        interest += i;
        bal = bal + i - Math.min(pay, bal + i);
        months++;
      }
      const $ = money(v);
      return {
        primaryLabel: "Total repayment",
        primary: $(P + interest),
        breakdown: [
          { label: "Interest", value: $(interest) },
          { label: "Months", value: String(months) },
        ],
        formula: "Sum of payments until principal is cleared",
        copyText: `Total repayment: ${$(P + interest)}`,
      };
    },
  }),

  def({
    slug: "student-loan-calculator",
    name: "Student Loan Calculator",
    subcategory: "financial",
    shortDescription: "Estimate student loan payments and total interest.",
    keywords: ["student loan calculator", "student loan payment"],
    relatedToolIds: ["loan-calculator", "college-cost-calculator", "amortization-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Loan balance", "35000"),
      percentField("rate", "Annual rate (%)", "5.5"),
      numberField("years", "Repayment years", "10", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "balance", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const sched = buildAmortizationSchedule(P, r, n, 12);
      const $ = money(v);
      return {
        primaryLabel: "Monthly payment",
        primary: $(sched.payment),
        breakdown: [
          { label: "Total interest", value: $(sched.totalInterest) },
          { label: "Total paid", value: $(sched.totalPaid) },
        ],
        formula: "Standard amortizing student loan payment",
        copyText: `Student loan payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "college-cost-calculator",
    name: "College Cost Calculator",
    subcategory: "financial",
    shortDescription: "Project multi-year college costs with tuition inflation.",
    keywords: ["college cost calculator", "tuition calculator", "college savings need"],
    relatedToolIds: ["student-loan-calculator", "savings-calculator", "529-plan-related"],
    fields: [
      moneyField("tuition", "Current annual cost", "25000"),
      percentField("inflation", "Annual cost inflation (%)", "4"),
      numberField("yearsUntil", "Years until college", "5", { step: "1", inputMode: "numeric" }),
      numberField("yearsAttend", "Years attending", "4", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const tuition = parseNumber(v.tuition, "annual cost", { allowNegative: false, allowZero: false });
      const infl = parseNumber(v.inflation, "inflation", { allowNegative: false }) / 100;
      const until = parsePositiveInt(v.yearsUntil, "years until");
      const attend = parsePositiveInt(v.yearsAttend, "years attending");
      let yearCost = tuition * Math.pow(1 + infl, until);
      let total = 0;
      for (let i = 0; i < attend; i++) {
        total += yearCost;
        yearCost *= 1 + infl;
      }
      const $ = money(v);
      return {
        primaryLabel: "Projected total college cost",
        primary: $(total),
        breakdown: [{ label: "First-year inflated cost", value: $(tuition * Math.pow(1 + infl, until)) }],
        formula: "Inflate current cost to start year, then sum attending years",
        copyText: `College cost projection: ${$(total)}`,
      };
    },
  }),

  def({
    slug: "depreciation-calculator",
    name: "Depreciation Calculator",
    subcategory: "financial",
    shortDescription: "Straight-line and declining-balance depreciation estimates.",
    keywords: ["depreciation calculator", "straight line depreciation"],
    relatedToolIds: ["roi-calculator", "business-loan-calculator"],
    notices: [eduDisclaimer, "Accounting rules vary; this is a simplified educational model."],
    fields: [
      moneyField("cost", "Asset cost", "20000"),
      moneyField("salvage", "Salvage value", "2000"),
      numberField("years", "Useful life (years)", "5", { step: "1", inputMode: "numeric" }),
      selectField("method", "Method", "straight", [
        { value: "straight", label: "Straight-line" },
        { value: "declining", label: "Double declining balance" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const cost = parseNumber(v.cost, "cost", { allowNegative: false, allowZero: false });
      const salvage = parseOptionalNumber(v.salvage, "salvage", 0);
      const years = parsePositiveInt(v.years, "useful life");
      const $ = money(v);
      if (v.method === "straight") {
        const annual = (cost - salvage) / years;
        return {
          primaryLabel: "Annual depreciation",
          primary: $(annual),
          formula: "(Cost − salvage) / useful life",
          copyText: `Straight-line depreciation: ${$(annual)}/year`,
        };
      }
      const rate = 2 / years;
      let book = cost;
      const rows: string[][] = [];
      for (let y = 1; y <= years; y++) {
        let dep = book * rate;
        if (book - dep < salvage) dep = Math.max(0, book - salvage);
        book -= dep;
        rows.push([String(y), $(dep), $(book)]);
      }
      return {
        primaryLabel: "Year 1 depreciation",
        primary: rows[0]?.[1] ?? $(0),
        table: { caption: "Declining-balance schedule", headers: ["Year", "Depreciation", "Book value"], rows },
        formula: "Depreciation = book value × (2 / useful life)",
        copyText: `Year 1 DDB depreciation: ${rows[0]?.[1]}`,
      };
    },
  }),

  def({
    slug: "margin-calculator",
    name: "Margin Calculator",
    subcategory: "financial",
    shortDescription: "Calculate profit margin, markup, and selling price.",
    keywords: ["margin calculator", "profit margin", "markup calculator"],
    relatedToolIds: ["discount-calculator", "sales-commission-calculator", "percent-off-calculator"],
    fields: [
      moneyField("cost", "Cost", "40"),
      selectField("mode", "Known value", "margin", [
        { value: "margin", label: "Margin %" },
        { value: "markup", label: "Markup %" },
        { value: "price", label: "Selling price" },
      ]),
      numberField("value", "Margin %, markup %, or price", "25"),
      currencySelect,
    ],
    compute: (v) => {
      const cost = parseNumber(v.cost, "cost", { allowNegative: false });
      const value = parseNumber(v.value, "value");
      const $ = money(v);
      if (v.mode === "price") {
        const price = value;
        const profit = price - cost;
        const margin = price ? (profit / price) * 100 : 0;
        const markup = cost ? (profit / cost) * 100 : 0;
        return {
          primaryLabel: "Profit margin",
          primary: formatPercent(margin),
          breakdown: [
            { label: "Profit", value: $(profit) },
            { label: "Markup", value: formatPercent(markup) },
          ],
          formula: "Margin = (price − cost) / price",
          copyText: `Margin: ${formatPercent(margin)}`,
        };
      }
      if (v.mode === "markup") {
        const price = cost * (1 + value / 100);
        const margin = ((price - cost) / price) * 100;
        return {
          primaryLabel: "Selling price",
          primary: $(price),
          breakdown: [{ label: "Margin", value: formatPercent(margin) }],
          formula: "Price = cost × (1 + markup)",
          copyText: `Price: ${$(price)}`,
        };
      }
      if (value >= 100) throw new Error("Margin percent must be below 100%.");
      const price = cost / (1 - value / 100);
      return {
        primaryLabel: "Selling price",
        primary: $(price),
        breakdown: [{ label: "Markup", value: formatPercent(((price - cost) / cost) * 100) }],
        formula: "Price = cost / (1 − margin)",
        copyText: `Price: ${$(price)}`,
      };
    },
  }),

  def({
    slug: "business-loan-calculator",
    name: "Business Loan Calculator",
    subcategory: "financial",
    shortDescription: "Estimate payments for a fixed-rate business loan.",
    keywords: ["business loan calculator", "commercial loan payment"],
    relatedToolIds: ["loan-calculator", "personal-loan-calculator", "amortization-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Loan amount", "100000"),
      percentField("rate", "Annual rate (%)", "9"),
      numberField("months", "Term (months)", "60", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "loan amount", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "term");
      const sched = buildAmortizationSchedule(P, r, n, 12);
      const $ = money(v);
      return {
        primaryLabel: "Monthly payment",
        primary: $(sched.payment),
        breakdown: [
          { label: "Total interest", value: $(sched.totalInterest) },
          { label: "Total paid", value: $(sched.totalPaid) },
        ],
        formula: "Amortizing business loan payment",
        copyText: `Business loan payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "personal-loan-calculator",
    name: "Personal Loan Calculator",
    subcategory: "financial",
    shortDescription: "Calculate personal loan payments and total interest.",
    keywords: ["personal loan calculator", "personal loan payment"],
    relatedToolIds: ["loan-calculator", "debt-consolidation-calculator", "apr-calculator"],
    fields: [
      moneyField("principal", "Loan amount", "12000"),
      percentField("rate", "Annual rate (%)", "11"),
      numberField("months", "Term (months)", "36", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "loan amount", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "term");
      const sched = buildAmortizationSchedule(P, r, n, 12);
      const $ = money(v);
      return {
        primaryLabel: "Monthly payment",
        primary: $(sched.payment),
        breakdown: [{ label: "Total interest", value: $(sched.totalInterest) }],
        formula: "Amortizing personal loan payment",
        copyText: `Personal loan payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "boat-loan-calculator",
    name: "Boat Loan Calculator",
    subcategory: "financial",
    shortDescription: "Estimate boat loan payments from price, down payment, rate, and term.",
    keywords: ["boat loan calculator", "boat financing"],
    relatedToolIds: ["loan-calculator", "car-loan-payment-calculator", "personal-loan-calculator"],
    fields: [
      moneyField("price", "Boat price", "45000"),
      moneyField("down", "Down payment", "5000"),
      percentField("rate", "Annual rate (%)", "7.5"),
      numberField("months", "Term (months)", "120", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "price", { allowNegative: false, allowZero: false });
      const down = parseOptionalNumber(v.down, "down payment", 0);
      const P = Math.max(0.01, price - down);
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "term");
      const sched = buildAmortizationSchedule(P, r, n, 12);
      const $ = money(v);
      return {
        primaryLabel: "Monthly payment",
        primary: $(sched.payment),
        breakdown: [
          { label: "Financed amount", value: $(P) },
          { label: "Total interest", value: $(sched.totalInterest) },
        ],
        formula: "Amortizing loan on price minus down payment",
        copyText: `Boat loan payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "lease-calculator",
    name: "Lease Calculator",
    subcategory: "financial",
    shortDescription: "General equipment/property lease payment estimate from cost and residual.",
    keywords: ["lease calculator", "equipment lease"],
    relatedToolIds: ["auto-lease-calculator", "loan-calculator", "payment-calculator"],
    fields: [
      moneyField("cost", "Asset cost", "25000"),
      moneyField("residual", "Residual / buyout", "5000"),
      percentField("rate", "Money factor as APR (%)", "6"),
      numberField("months", "Lease months", "36", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const cost = parseNumber(v.cost, "cost", { allowNegative: false, allowZero: false });
      const residual = parseNumber(v.residual, "residual", { allowNegative: false });
      const apr = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const months = parsePositiveInt(v.months, "months");
      const mf = apr / 2400;
      const payment = (cost - residual) / months + (cost + residual) * mf;
      const $ = money(v);
      return {
        primaryLabel: "Estimated lease payment",
        primary: $(payment),
        formula: "Depreciation/months + (cost+residual)×(APR/2400)",
        copyText: `Lease payment: ${$(payment)}`,
      };
    },
  }),

  def({
    slug: "budget-calculator",
    name: "Budget Calculator",
    subcategory: "financial",
    shortDescription: "Build a simple monthly budget and see surplus or shortfall.",
    keywords: ["budget calculator", "monthly budget"],
    relatedToolIds: ["rent-calculator", "take-home-paycheck-calculator", "debt-payoff-calculator"],
    fields: [
      moneyField("income", "Monthly income", "5500"),
      moneyField("housing", "Housing", "1800"),
      moneyField("food", "Food", "600"),
      moneyField("transport", "Transport", "350"),
      moneyField("utilities", "Utilities", "250"),
      moneyField("other", "Other expenses", "700"),
      currencySelect,
    ],
    compute: (v) => {
      const income = parseNumber(v.income, "income", { allowNegative: false });
      const expenses = ["housing", "food", "transport", "utilities", "other"].map((k) =>
        parseOptionalNumber(v[k], k, 0),
      );
      const totalExp = expenses.reduce((a, b) => a + b, 0);
      const $ = money(v);
      return {
        primaryLabel: totalExp <= income ? "Monthly surplus" : "Monthly shortfall",
        primary: $(Math.abs(income - totalExp)),
        breakdown: [
          { label: "Total expenses", value: $(totalExp) },
          { label: "Expense ratio", value: formatPercent(income ? (totalExp / income) * 100 : 0) },
        ],
        formula: "Surplus = income − Σ expenses",
        copyText: `Budget difference: ${$(income - totalExp)}`,
      };
    },
  }),

  def({
    slug: "mortgage-calculator-uk",
    name: "Mortgage Calculator UK",
    subcategory: "financial",
    shortDescription: "UK-oriented mortgage payment estimate using sterling defaults.",
    keywords: ["uk mortgage calculator", "mortgage calculator uk", "british mortgage"],
    relatedToolIds: ["mortgage-calculator", "canadian-mortgage-calculator", "amortization-calculator"],
    notices: [eduDisclaimer, "UK-specific labels/defaults. Stamp duty and product fees are not included."],
    fields: [
      moneyField("principal", "Mortgage amount (£)", "300000"),
      percentField("rate", "Interest rate (%)", "4.5"),
      numberField("years", "Term (years)", "25", { step: "1", inputMode: "numeric" }),
      selectField("currency", "Currency", "GBP", [{ value: "GBP", label: "GBP" }]),
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "mortgage amount", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const sched = buildAmortizationSchedule(P, r, n, 12);
      const $ = money({ ...v, currency: "GBP" });
      return {
        primaryLabel: "Estimated monthly repayment",
        primary: $(sched.payment),
        breakdown: [{ label: "Total interest", value: $(sched.totalInterest) }],
        formula: "Standard capital-and-interest repayment mortgage",
        copyText: `UK mortgage payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "canadian-mortgage-calculator",
    name: "Canadian Mortgage Calculator",
    subcategory: "financial",
    shortDescription: "Canadian mortgage estimate with semi-annual compounding convention.",
    keywords: ["canadian mortgage calculator", "canada mortgage", "semi-annual compounding"],
    relatedToolIds: ["mortgage-calculator", "mortgage-calculator-uk", "amortization-calculator"],
    notices: [eduDisclaimer, "Canada-specific: converts quoted nominal rate with semi-annual compounding to a monthly rate."],
    fields: [
      moneyField("principal", "Mortgage amount", "450000"),
      percentField("rate", "Posted / nominal rate (%)", "5"),
      numberField("years", "Amortization (years)", "25", { step: "1", inputMode: "numeric" }),
      selectField("currency", "Currency", "CAD", [{ value: "CAD", label: "CAD" }]),
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "mortgage amount", { allowNegative: false, allowZero: false });
      const nominal = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      // Canadian: monthly rate i where (1+i)^12 = (1 + nominal/2)^2
      const monthly = Math.pow(1 + nominal / 2, 2 / 12) - 1;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const sched = buildAmortizationSchedule(P, monthly, n, 12);
      const $ = money({ ...v, currency: "CAD" });
      return {
        primaryLabel: "Estimated monthly payment",
        primary: $(sched.payment),
        breakdown: [
          { label: "Equivalent monthly rate", value: formatPercent(monthly * 100, 4) },
          { label: "Total interest", value: $(sched.totalInterest) },
        ],
        formula: "(1+i_m)^12 = (1 + r/2)^2",
        copyText: `Canadian mortgage payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "percent-off-calculator",
    name: "Percent Off Calculator",
    subcategory: "financial",
    shortDescription: "Calculate sale prices after one or more percent-off discounts.",
    keywords: ["percent off calculator", "sale price", "discount percent"],
    relatedToolIds: ["discount-calculator", "margin-calculator", "sales-tax-calculator"],
    fields: [
      moneyField("price", "Original price", "80"),
      percentField("off", "Percent off (%)", "25"),
      percentField("extra", "Extra percent off (optional)", "0"),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "price", { allowNegative: false });
      const off = parseNumber(v.off, "percent off", { allowNegative: false }) / 100;
      const extra = parseOptionalNumber(v.extra, "extra", 0) / 100;
      const after = price * (1 - off) * (1 - extra);
      const $ = money(v);
      return {
        primaryLabel: "Sale price",
        primary: $(after),
        breakdown: [
          { label: "Total saved", value: $(price - after) },
          { label: "Effective discount", value: formatPercent(((price - after) / price) * 100) },
        ],
        formula: "Sale = price × (1 − d1) × (1 − d2)",
        copyText: `Sale price: ${$(after)}`,
      };
    },
  }),

  def({
    slug: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    subcategory: "financial",
    shortDescription: "Convert an hourly wage into monthly and annual salary figures.",
    keywords: ["hourly to salary", "wage to salary"],
    relatedToolIds: ["salary-calculator", "take-home-paycheck-calculator"],
    fields: [
      moneyField("hourly", "Hourly wage", "28"),
      numberField("hours", "Hours per week", "40", { min: "1", step: "0.5" }),
      numberField("weeks", "Weeks per year", "52", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const hourly = parseNumber(v.hourly, "hourly wage", { allowNegative: false });
      const hours = parseNumber(v.hours, "hours", { min: 1 });
      const weeks = parseNumber(v.weeks, "weeks", { min: 1 });
      const annual = hourly * hours * weeks;
      const $ = money(v);
      return {
        primaryLabel: "Annual salary",
        primary: $(annual),
        breakdown: [
          { label: "Monthly", value: $(annual / 12) },
          { label: "Weekly", value: $(hourly * hours) },
        ],
        formula: "Annual = hourly × hours/week × weeks/year",
        copyText: `Annual salary: ${$(annual)}`,
      };
    },
  }),
];

// Fix college-cost relatedToolIds - remove invalid 529 reference
financialMoreCatalog.forEach((spec) => {
  if (spec.slug === "college-cost-calculator") {
    spec.relatedToolIds = ["student-loan-calculator", "savings-calculator", "investment-calculator"];
  }
});

// silence unused import warning if any
void formatNumber;
