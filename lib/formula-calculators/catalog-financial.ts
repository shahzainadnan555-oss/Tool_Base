import {
  buildAmortizationSchedule,
  compoundInterestAmount,
  futureValue,
  irr,
  npv,
  pmt,
  presentValue,
  remainingBalance,
} from "./finance-math";
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

export const financialCatalog: FormulaCalculatorSpec[] = [
  def({
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    subcategory: "financial",
    shortDescription: "Estimate monthly mortgage payments, interest, and amortization.",
    keywords: ["mortgage calculator", "home loan payment", "mortgage payment"],
    relatedToolIds: [
      "amortization-calculator",
      "mortgage-payoff-calculator",
      "refinance-calculator",
      "down-payment-calculator",
      "house-affordability-calculator",
    ],
    featured: true,
    notices: [eduDisclaimer, "Does not include taxes, insurance, or HOA unless you add them."],
    formulaHint: "M = P · r(1+r)^n / ((1+r)^n − 1)",
    fields: [
      moneyField("principal", "Loan amount", "350000"),
      percentField("rate", "Annual interest rate (%)", "6.5"),
      numberField("years", "Loan term (years)", "30", { min: "1", step: "1", inputMode: "numeric" }),
      moneyField("extra", "Extra monthly payment (optional)", "0"),
      currencySelect,
    ],
    examples: [
      {
        title: "30-year fixed",
        input: "$350,000 at 6.5% for 30 years",
        output: "About $2,212/month (principal & interest)",
        formula: "Standard amortizing payment formula",
      },
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "loan amount", { allowNegative: false, allowZero: false });
      const annual = parseNumber(v.rate, "interest rate", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "loan term", { min: 1, allowNegative: false });
      const extra = parseOptionalNumber(v.extra, "extra payment", 0);
      const n = Math.round(years * 12);
      const r = annual / 12;
      const base = pmt(P, r, n);
      const payment = base + Math.max(0, extra);
      const sched = buildAmortizationSchedule(P, r, n, 12);
      // Approximate payoff with extra
      let bal = P;
      let months = 0;
      let interest = 0;
      while (bal > 0.01 && months < n + 600) {
        const i = r === 0 ? 0 : bal * r;
        const principalPart = Math.min(bal, payment - i);
        if (principalPart <= 0) break;
        bal -= principalPart;
        interest += i;
        months++;
      }
      const $ = money(v);
      return {
        primaryLabel: "Estimated monthly payment",
        primary: $(payment),
        subhead: extra > 0 ? `Includes $${formatFixed(extra, 2)} extra` : "Principal & interest only",
        breakdown: [
          { label: "Base P&I payment", value: $(base) },
          { label: "Total interest (with extras)", value: $(interest) },
          { label: "Payoff time", value: `${Math.floor(months / 12)} yrs ${months % 12} mo` },
          { label: "Total paid", value: $(P + interest) },
        ],
        table: {
          caption: "First 12 months (base schedule without extras)",
          headers: ["Month", "Payment", "Principal", "Interest", "Balance"],
          rows: sched.rows.map((row) => [
            String(row.period),
            $(row.payment),
            $(row.principal),
            $(row.interest),
            $(row.balance),
          ]),
        },
        formula: "Monthly rate r = annual/12; payment = P·r(1+r)^n/((1+r)^n−1)",
        notes: ["Taxes, insurance, and fees are not included unless added as extra payment."],
        copyText: `Monthly mortgage payment: ${$(payment)}`,
      };
    },
  }),

  def({
    slug: "loan-calculator",
    name: "Loan Calculator",
    subcategory: "financial",
    shortDescription: "Calculate payment, total interest, and payoff for a fixed-rate loan.",
    keywords: ["loan calculator", "personal loan payment", "loan interest"],
    relatedToolIds: ["amortization-calculator", "interest-calculator", "personal-loan-calculator", "apr-calculator"],
    featured: true,
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Loan amount", "15000"),
      percentField("rate", "Annual interest rate (%)", "9"),
      numberField("months", "Term (months)", "48", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "loan amount", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "interest rate", { allowNegative: false }) / 100 / 12;
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
        formula: "Amortizing loan payment with monthly compounding",
        copyText: `Loan payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "interest-calculator",
    name: "Interest Calculator",
    subcategory: "financial",
    shortDescription: "Compare simple and compound interest growth on a principal.",
    keywords: ["interest calculator", "simple interest", "compound interest"],
    relatedToolIds: [
      "compound-interest-calculator",
      "simple-interest-calculator",
      "interest-rate-calculator",
      "savings-calculator",
    ],
    fields: [
      moneyField("principal", "Principal", "10000"),
      percentField("rate", "Annual rate (%)", "5"),
      numberField("years", "Years", "5", { min: "0", step: "0.1" }),
      selectField("mode", "Interest type", "compound", [
        { value: "simple", label: "Simple" },
        { value: "compound", label: "Compound (annual)" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { allowNegative: false });
      const $ = money(v);
      if (v.mode === "simple") {
        const interest = P * rate * years;
        return {
          primaryLabel: "Interest earned",
          primary: $(interest),
          breakdown: [
            { label: "Final amount", value: $(P + interest) },
            { label: "Principal", value: $(P) },
          ],
          formula: "I = P · r · t",
          copyText: `Simple interest: ${$(interest)}`,
        };
      }
      const future = P * Math.pow(1 + rate, years);
      return {
        primaryLabel: "Interest earned",
        primary: $(future - P),
        breakdown: [{ label: "Final amount", value: $(future) }],
        formula: "A = P(1+r)^t",
        copyText: `Compound interest: ${$(future - P)}`,
      };
    },
  }),

  def({
    slug: "payment-calculator",
    name: "Payment Calculator",
    subcategory: "financial",
    shortDescription: "Solve for loan payment, principal, rate, or term from the other values.",
    keywords: ["payment calculator", "loan payment solver"],
    relatedToolIds: ["loan-calculator", "amortization-calculator", "apr-calculator"],
    fields: [
      selectField("solve", "Solve for", "payment", [
        { value: "payment", label: "Payment" },
        { value: "principal", label: "Principal" },
        { value: "rate", label: "Annual rate" },
        { value: "months", label: "Term (months)" },
      ]),
      moneyField("principal", "Principal", "20000"),
      moneyField("payment", "Monthly payment", "400"),
      percentField("rate", "Annual rate (%)", "7"),
      numberField("months", "Term (months)", "60", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const $ = money(v);
      const solve = v.solve;
      if (solve === "payment") {
        const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
        const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
        const n = parsePositiveInt(v.months, "term");
        const pay = pmt(P, r, n);
        return {
          primaryLabel: "Monthly payment",
          primary: $(pay),
          formula: "Standard amortizing payment",
          copyText: `Payment: ${$(pay)}`,
        };
      }
      if (solve === "principal") {
        const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
        const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
        const n = parsePositiveInt(v.months, "term");
        const P = r === 0 ? pay * n : (pay * (1 - Math.pow(1 + r, -n))) / r;
        return {
          primaryLabel: "Affordable principal",
          primary: $(P),
          formula: "P = PMT · (1 − (1+r)^−n) / r",
          copyText: `Principal: ${$(P)}`,
        };
      }
      if (solve === "months") {
        const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
        const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
        const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
        if (r === 0) {
          const n = Math.ceil(P / pay);
          return {
            primaryLabel: "Months to pay off",
            primary: String(n),
            copyText: `Term: ${n} months`,
          };
        }
        if (pay <= P * r) throw new Error("Payment is too low to cover interest.");
        const n = Math.ceil(Math.log(pay / (pay - P * r)) / Math.log(1 + r));
        return {
          primaryLabel: "Months to pay off",
          primary: String(n),
          breakdown: [{ label: "Years", value: formatFixed(n / 12, 2) }],
          formula: "n = log(PMT / (PMT − P·r)) / log(1+r)",
          copyText: `Term: ${n} months`,
        };
      }
      // rate via binary search
      const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
      const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
      const n = parsePositiveInt(v.months, "term");
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 80; i++) {
        const mid = (lo + hi) / 2;
        const trial = pmt(P, mid, n);
        if (trial > pay) hi = mid;
        else lo = mid;
      }
      const annual = lo * 12 * 100;
      return {
        primaryLabel: "Estimated annual rate",
        primary: formatPercent(annual),
        formula: "Solved numerically from the payment equation",
        copyText: `Rate: ${formatPercent(annual)}`,
      };
    },
  }),

  def({
    slug: "amortization-calculator",
    name: "Amortization Calculator",
    subcategory: "financial",
    shortDescription: "Build a full amortization schedule for a fixed-rate loan.",
    keywords: ["amortization calculator", "amortization schedule", "loan schedule"],
    aliases: ["mortgage-amortization-calculator"],
    relatedToolIds: ["mortgage-calculator", "loan-calculator", "mortgage-payoff-calculator"],
    featured: true,
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Principal", "250000"),
      percentField("rate", "Annual rate (%)", "6"),
      numberField("years", "Years", "30", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const sched = buildAmortizationSchedule(P, r, n, 60);
      const $ = money(v);
      return {
        primaryLabel: "Monthly payment",
        primary: $(sched.payment),
        breakdown: [
          { label: "Total interest", value: $(sched.totalInterest) },
          { label: "Total paid", value: $(sched.totalPaid) },
          { label: "Number of payments", value: String(n) },
        ],
        table: {
          caption: "First 60 payments",
          headers: ["#", "Payment", "Principal", "Interest", "Balance"],
          rows: sched.rows.map((row) => [
            String(row.period),
            $(row.payment),
            $(row.principal),
            $(row.interest),
            $(row.balance),
          ]),
        },
        formula: "Each period: interest = balance × r; principal = payment − interest",
        copyText: `Amortization payment: ${$(sched.payment)}; total interest ${$(sched.totalInterest)}`,
      };
    },
  }),

  def({
    slug: "mortgage-payoff-calculator",
    name: "Mortgage Payoff Calculator",
    subcategory: "financial",
    shortDescription: "See how extra payments shorten a mortgage and cut interest.",
    keywords: ["mortgage payoff", "pay off mortgage early", "extra payment"],
    relatedToolIds: ["mortgage-calculator", "amortization-calculator", "refinance-calculator"],
    fields: [
      moneyField("principal", "Current balance", "280000"),
      percentField("rate", "Annual rate (%)", "6.25"),
      numberField("yearsLeft", "Years remaining", "25", { min: "0.1", step: "0.1" }),
      moneyField("extra", "Extra monthly payment", "200"),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "balance", { allowNegative: false, allowZero: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.yearsLeft, "years remaining", { min: 0.1 }) * 12);
      const extra = parseOptionalNumber(v.extra, "extra", 0);
      const basePay = pmt(P, r, n);
      const run = (pay: number) => {
        let bal = P;
        let interest = 0;
        let months = 0;
        while (bal > 0.01 && months < n + 1200) {
          const i = r === 0 ? 0 : bal * r;
          const prin = Math.min(bal, pay - i);
          if (prin <= 0) throw new Error("Payment is too low to pay down the loan.");
          bal -= prin;
          interest += i;
          months++;
        }
        return { months, interest };
      };
      const base = run(basePay);
      const withExtra = run(basePay + Math.max(0, extra));
      const $ = money(v);
      return {
        primaryLabel: "Interest saved",
        primary: $(base.interest - withExtra.interest),
        breakdown: [
          { label: "Base monthly P&I", value: $(basePay) },
          { label: "New monthly P&I", value: $(basePay + Math.max(0, extra)) },
          { label: "Months saved", value: String(base.months - withExtra.months) },
          { label: "New payoff time", value: `${Math.floor(withExtra.months / 12)} yrs ${withExtra.months % 12} mo` },
        ],
        formula: "Simulate month-by-month amortization with an added principal payment",
        copyText: `Interest saved: ${$(base.interest - withExtra.interest)}`,
      };
    },
  }),

  def({
    slug: "house-affordability-calculator",
    name: "House Affordability Calculator",
    subcategory: "financial",
    shortDescription: "Estimate a home price range from income, debts, and down payment.",
    keywords: ["house affordability", "how much house can I afford", "home budget"],
    relatedToolIds: ["mortgage-calculator", "debt-to-income-ratio-calculator", "down-payment-calculator", "rent-vs-buy-calculator"],
    notices: [eduDisclaimer, "Uses common DTI guidelines as planning estimates, not lender approval."],
    fields: [
      moneyField("income", "Gross monthly income", "7500"),
      moneyField("debts", "Monthly debt payments", "500"),
      percentField("rate", "Expected mortgage rate (%)", "6.5"),
      numberField("years", "Loan term (years)", "30", { step: "1", inputMode: "numeric" }),
      percentField("dti", "Max housing DTI (%)", "28", { max: "50" }),
      moneyField("down", "Down payment", "60000"),
      moneyField("taxesIns", "Monthly taxes & insurance", "450"),
      currencySelect,
    ],
    compute: (v) => {
      const income = parseNumber(v.income, "income", { allowNegative: false, allowZero: false });
      const debts = parseOptionalNumber(v.debts, "debts", 0);
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const dti = parseNumber(v.dti, "DTI", { min: 1, max: 60 }) / 100;
      const down = parseOptionalNumber(v.down, "down payment", 0);
      const taxesIns = parseOptionalNumber(v.taxesIns, "taxes & insurance", 0);
      const maxHousing = income * dti;
      const maxPi = Math.max(0, maxHousing - taxesIns);
      const loan =
        rate === 0 ? maxPi * n : (maxPi * (1 - Math.pow(1 + rate, -n))) / rate;
      const price = loan + down;
      const $ = money(v);
      return {
        primaryLabel: "Estimated affordable home price",
        primary: $(price),
        breakdown: [
          { label: "Max housing payment", value: $(maxHousing) },
          { label: "Max P&I", value: $(maxPi) },
          { label: "Supported loan amount", value: $(loan) },
          { label: "Down payment", value: $(down) },
          { label: "Remaining debt capacity", value: $(Math.max(0, income * 0.36 - debts - maxHousing)) },
        ],
        formula: "Max P&I from DTI, then invert the payment formula for loan size",
        notes: ["Lenders may use different DTI caps and include other costs."],
        copyText: `Affordable price estimate: ${$(price)}`,
      };
    },
  }),

  def({
    slug: "rent-calculator",
    name: "Rent Calculator",
    subcategory: "financial",
    shortDescription: "Budget rent from income and estimate total move-in costs.",
    keywords: ["rent calculator", "rent budget", "how much rent"],
    relatedToolIds: ["rent-vs-buy-calculator", "budget-calculator", "house-affordability-calculator"],
    fields: [
      moneyField("income", "Monthly take-home income", "5000"),
      percentField("rule", "Rent-to-income guideline (%)", "30"),
      moneyField("deposit", "Security deposit (months of rent)", "1"),
      moneyField("fees", "Other move-in fees", "200"),
      currencySelect,
    ],
    compute: (v) => {
      const income = parseNumber(v.income, "income", { allowNegative: false, allowZero: false });
      const rule = parseNumber(v.rule, "guideline", { min: 1, max: 80 }) / 100;
      const depositMonths = parseOptionalNumber(v.deposit, "deposit months", 0);
      const fees = parseOptionalNumber(v.fees, "fees", 0);
      const rent = income * rule;
      const moveIn = rent + rent * depositMonths + fees;
      const $ = money(v);
      return {
        primaryLabel: "Suggested max rent",
        primary: $(rent),
        breakdown: [
          { label: "Estimated move-in total", value: $(moveIn) },
          { label: "First month + deposit + fees", value: $(moveIn) },
        ],
        formula: "Max rent ≈ take-home × guideline%",
        notes: ["Guidelines vary by market and household budget."],
        copyText: `Suggested rent: ${$(rent)}`,
      };
    },
  }),

  def({
    slug: "debt-to-income-ratio-calculator",
    name: "Debt-to-Income Ratio Calculator",
    subcategory: "financial",
    shortDescription: "Calculate front-end and back-end debt-to-income ratios.",
    keywords: ["debt to income", "DTI calculator", "dti ratio"],
    relatedToolIds: ["house-affordability-calculator", "mortgage-calculator", "debt-payoff-calculator"],
    fields: [
      moneyField("income", "Gross monthly income", "7000"),
      moneyField("housing", "Housing payment", "1800"),
      moneyField("otherDebts", "Other monthly debts", "450"),
      currencySelect,
    ],
    compute: (v) => {
      const income = parseNumber(v.income, "income", { allowNegative: false, allowZero: false });
      const housing = parseOptionalNumber(v.housing, "housing", 0);
      const other = parseOptionalNumber(v.otherDebts, "other debts", 0);
      const front = (housing / income) * 100;
      const back = ((housing + other) / income) * 100;
      return {
        primaryLabel: "Back-end DTI",
        primary: formatPercent(back),
        breakdown: [
          { label: "Front-end (housing) DTI", value: formatPercent(front) },
          { label: "Total monthly debt", value: formatMoney(housing + other, v.currency || "USD") },
        ],
        formula: "DTI = monthly debts ÷ gross monthly income",
        copyText: `Back-end DTI: ${formatPercent(back)}; front-end: ${formatPercent(front)}`,
      };
    },
  }),

  def({
    slug: "real-estate-calculator",
    name: "Real Estate Calculator",
    subcategory: "financial",
    shortDescription: "Estimate purchase costs, equity, and simple property ROI.",
    keywords: ["real estate calculator", "property investment", "home equity estimate"],
    relatedToolIds: ["rental-property-calculator", "refinance-calculator", "mortgage-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("price", "Purchase price", "400000"),
      moneyField("down", "Down payment", "80000"),
      moneyField("closing", "Closing costs", "8000"),
      moneyField("value", "Current estimated value", "450000"),
      moneyField("balance", "Mortgage balance", "300000"),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "purchase price", { allowNegative: false, allowZero: false });
      const down = parseOptionalNumber(v.down, "down payment", 0);
      const closing = parseOptionalNumber(v.closing, "closing costs", 0);
      const value = parseNumber(v.value, "value", { allowNegative: false, allowZero: false });
      const balance = parseOptionalNumber(v.balance, "balance", 0);
      const cashIn = down + closing;
      const equity = value - balance;
      const gain = value - price;
      const roi = cashIn > 0 ? (gain / cashIn) * 100 : 0;
      const $ = money(v);
      return {
        primaryLabel: "Estimated equity",
        primary: $(equity),
        breakdown: [
          { label: "Cash invested at purchase", value: $(cashIn) },
          { label: "Price change", value: $(gain) },
          { label: "Simple ROI on cash in", value: formatPercent(roi) },
        ],
        formula: "Equity = value − loan balance; ROI ≈ (value − price) / cash invested",
        copyText: `Equity: ${$(equity)}; ROI ${formatPercent(roi)}`,
      };
    },
  }),

  def({
    slug: "refinance-calculator",
    name: "Refinance Calculator",
    subcategory: "financial",
    shortDescription: "Compare current and refinance loan payments and break-even time.",
    keywords: ["refinance calculator", "mortgage refinance", "refi break even"],
    relatedToolIds: ["mortgage-calculator", "mortgage-payoff-calculator", "interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("balance", "Current balance", "300000"),
      percentField("oldRate", "Current rate (%)", "7"),
      numberField("oldYears", "Years remaining", "25", { step: "0.1" }),
      percentField("newRate", "New rate (%)", "5.75"),
      numberField("newYears", "New term (years)", "30", { step: "1", inputMode: "numeric" }),
      moneyField("costs", "Refinance closing costs", "4500"),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const oldR = parseNumber(v.oldRate, "current rate", { allowNegative: false }) / 100 / 12;
      const oldN = Math.round(parseNumber(v.oldYears, "years remaining", { min: 0.1 }) * 12);
      const newR = parseNumber(v.newRate, "new rate", { allowNegative: false }) / 100 / 12;
      const newN = Math.round(parseNumber(v.newYears, "new term", { min: 1 }) * 12);
      const costs = parseOptionalNumber(v.costs, "costs", 0);
      const oldPay = pmt(bal, oldR, oldN);
      const newPay = pmt(bal, newR, newN);
      const monthlySave = oldPay - newPay;
      const breakEven = monthlySave > 0 ? costs / monthlySave : Infinity;
      const $ = money(v);
      return {
        primaryLabel: "Monthly savings",
        primary: $(monthlySave),
        breakdown: [
          { label: "Current payment", value: $(oldPay) },
          { label: "New payment", value: $(newPay) },
          {
            label: "Break-even",
            value: Number.isFinite(breakEven) ? `${formatFixed(breakEven, 1)} months` : "No monthly savings",
          },
        ],
        formula: "Break-even ≈ closing costs ÷ monthly payment reduction",
        copyText: `Monthly savings: ${$(monthlySave)}`,
      };
    },
  }),

  def({
    slug: "rental-property-calculator",
    name: "Rental Property Calculator",
    subcategory: "financial",
    shortDescription: "Estimate cash flow, cap rate, and cash-on-cash return for a rental.",
    keywords: ["rental property calculator", "cap rate", "cash on cash return"],
    relatedToolIds: ["real-estate-calculator", "mortgage-calculator", "roi-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("price", "Property price", "320000"),
      moneyField("down", "Down payment", "64000"),
      moneyField("rent", "Monthly rent", "2400"),
      moneyField("expenses", "Monthly operating expenses", "600"),
      moneyField("mortgage", "Monthly mortgage", "1500"),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "price", { allowNegative: false, allowZero: false });
      const down = parseOptionalNumber(v.down, "down payment", 0);
      const rent = parseNumber(v.rent, "rent", { allowNegative: false });
      const expenses = parseOptionalNumber(v.expenses, "expenses", 0);
      const mortgage = parseOptionalNumber(v.mortgage, "mortgage", 0);
      const noi = (rent - expenses) * 12;
      const cashFlow = (rent - expenses - mortgage) * 12;
      const cap = (noi / price) * 100;
      const coc = down > 0 ? (cashFlow / down) * 100 : 0;
      const $ = money(v);
      return {
        primaryLabel: "Annual cash flow",
        primary: $(cashFlow),
        breakdown: [
          { label: "NOI (approx.)", value: $(noi) },
          { label: "Cap rate", value: formatPercent(cap) },
          { label: "Cash-on-cash return", value: formatPercent(coc) },
        ],
        formula: "Cap rate ≈ NOI / price; cash-on-cash ≈ annual cash flow / cash invested",
        copyText: `Cash flow: ${$(cashFlow)}; cap rate ${formatPercent(cap)}`,
      };
    },
  }),

  def({
    slug: "apr-calculator",
    name: "APR Calculator",
    subcategory: "financial",
    shortDescription: "Estimate APR when upfront fees are added to a loan.",
    keywords: ["apr calculator", "annual percentage rate", "loan apr"],
    relatedToolIds: ["loan-calculator", "interest-rate-calculator", "payment-calculator"],
    notices: [eduDisclaimer, "Simplified APR estimate for educational comparison."],
    fields: [
      moneyField("principal", "Amount received", "20000"),
      moneyField("fees", "Upfront fees", "800"),
      percentField("rate", "Nominal annual rate (%)", "8"),
      numberField("months", "Term (months)", "60", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const received = parseNumber(v.principal, "amount received", { allowNegative: false, allowZero: false });
      const fees = parseOptionalNumber(v.fees, "fees", 0);
      const financed = received + fees;
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "term");
      const payment = pmt(financed, r, n);
      // Solve monthly rate for payment on amount received
      let lo = 0;
      let hi = 2;
      for (let i = 0; i < 80; i++) {
        const mid = (lo + hi) / 2;
        const trial = pmt(received, mid, n);
        if (trial > payment) hi = mid;
        else lo = mid;
      }
      const apr = lo * 12 * 100;
      const $ = money(v);
      return {
        primaryLabel: "Estimated APR",
        primary: formatPercent(apr),
        breakdown: [
          { label: "Monthly payment", value: $(payment) },
          { label: "Amount financed (incl. fees)", value: $(financed) },
        ],
        formula: "Solve for rate where PMT(received, APR/12, n) equals the contractual payment",
        copyText: `Estimated APR: ${formatPercent(apr)}`,
      };
    },
  }),

  def({
    slug: "fha-loan-calculator",
    name: "FHA Loan Calculator",
    subcategory: "financial",
    shortDescription: "US-oriented FHA payment estimate with upfront and annual MIP inputs.",
    keywords: ["fha loan calculator", "fha mortgage", "fha mip"],
    relatedToolIds: ["mortgage-calculator", "va-mortgage-calculator", "down-payment-calculator"],
    notices: [
      eduDisclaimer,
      "US-only estimate. MIP rates and rules change; verify with an FHA lender.",
    ],
    fields: [
      moneyField("price", "Home price", "350000"),
      percentField("downPct", "Down payment (%)", "3.5"),
      percentField("rate", "Interest rate (%)", "6.25"),
      numberField("years", "Term (years)", "30", { step: "1", inputMode: "numeric" }),
      percentField("ufMip", "Upfront MIP (%)", "1.75"),
      percentField("annualMip", "Annual MIP (%)", "0.55"),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "home price", { allowNegative: false, allowZero: false });
      const downPct = parseNumber(v.downPct, "down payment %", { allowNegative: false }) / 100;
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const uf = parseNumber(v.ufMip, "upfront MIP", { allowNegative: false }) / 100;
      const annMip = parseNumber(v.annualMip, "annual MIP", { allowNegative: false }) / 100;
      const down = price * downPct;
      const baseLoan = price - down;
      const loan = baseLoan * (1 + uf);
      const pi = pmt(loan, rate, n);
      const mipMonthly = (baseLoan * annMip) / 12;
      const $ = money(v);
      return {
        primaryLabel: "Estimated monthly P&I + MIP",
        primary: $(pi + mipMonthly),
        breakdown: [
          { label: "Base loan", value: $(baseLoan) },
          { label: "Loan with upfront MIP", value: $(loan) },
          { label: "P&I", value: $(pi) },
          { label: "Monthly MIP", value: $(mipMonthly) },
          { label: "Down payment", value: $(down) },
        ],
        formula: "FHA estimate: finance upfront MIP; add annual MIP/12 to payment",
        copyText: `FHA monthly estimate: ${$(pi + mipMonthly)}`,
      };
    },
  }),

  def({
    slug: "va-mortgage-calculator",
    name: "VA Mortgage Calculator",
    subcategory: "financial",
    shortDescription: "US VA loan payment estimate with optional funding fee.",
    keywords: ["va mortgage calculator", "va loan", "va funding fee"],
    relatedToolIds: ["mortgage-calculator", "fha-loan-calculator", "down-payment-calculator"],
    notices: [eduDisclaimer, "US-only estimate. Funding fee tiers vary by service history and down payment."],
    fields: [
      moneyField("price", "Home price", "400000"),
      moneyField("down", "Down payment", "0"),
      percentField("rate", "Interest rate (%)", "6"),
      numberField("years", "Term (years)", "30", { step: "1", inputMode: "numeric" }),
      percentField("fundingFee", "Funding fee (%)", "2.15"),
      selectField("financeFee", "Finance funding fee?", "yes", [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No (pay cash)" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "home price", { allowNegative: false, allowZero: false });
      const down = parseOptionalNumber(v.down, "down payment", 0);
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { min: 1 }) * 12);
      const feePct = parseNumber(v.fundingFee, "funding fee", { allowNegative: false }) / 100;
      const base = Math.max(0, price - down);
      const fee = base * feePct;
      const loan = v.financeFee === "yes" ? base + fee : base;
      const pay = pmt(loan, rate, n);
      const $ = money(v);
      return {
        primaryLabel: "Estimated monthly P&I",
        primary: $(pay),
        breakdown: [
          { label: "Base loan", value: $(base) },
          { label: "Funding fee", value: $(fee) },
          { label: "Amount financed", value: $(loan) },
        ],
        formula: "Optional financing of VA funding fee into the loan principal",
        copyText: `VA payment estimate: ${$(pay)}`,
      };
    },
  }),

  def({
    slug: "home-equity-loan-calculator",
    name: "Home Equity Loan Calculator",
    subcategory: "financial",
    shortDescription: "Estimate payments for a fixed home-equity loan.",
    keywords: ["home equity loan", "heloc vs home equity loan", "second mortgage"],
    relatedToolIds: ["heloc-calculator", "mortgage-calculator", "loan-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("amount", "Loan amount", "50000"),
      percentField("rate", "Annual rate (%)", "8.5"),
      numberField("years", "Term (years)", "15", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.amount, "loan amount", { allowNegative: false, allowZero: false });
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
        formula: "Fixed-rate amortizing home equity loan",
        copyText: `Home equity payment: ${$(sched.payment)}`,
      };
    },
  }),

  def({
    slug: "heloc-calculator",
    name: "HELOC Calculator",
    subcategory: "financial",
    shortDescription: "Estimate interest-only and amortizing HELOC payments.",
    keywords: ["heloc calculator", "home equity line of credit", "heloc payment"],
    relatedToolIds: ["home-equity-loan-calculator", "interest-calculator", "loan-calculator"],
    notices: [eduDisclaimer, "HELOC terms vary widely; this is a simplified planning model."],
    fields: [
      moneyField("balance", "Drawn balance", "40000"),
      percentField("rate", "Annual rate (%)", "9"),
      numberField("interestOnlyMonths", "Interest-only months", "120", { step: "1", inputMode: "numeric" }),
      numberField("repayMonths", "Repayment months", "240", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const bal = parseNumber(v.balance, "balance", { allowNegative: false, allowZero: false });
      const annual = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const ioMonths = parsePositiveInt(v.interestOnlyMonths, "interest-only months");
      const repay = parsePositiveInt(v.repayMonths, "repayment months");
      const ioPay = (bal * annual) / 12;
      const amortPay = pmt(bal, annual / 12, repay);
      const $ = money(v);
      return {
        primaryLabel: "Interest-only payment",
        primary: $(ioPay),
        breakdown: [
          { label: "Repayment-phase payment", value: $(amortPay) },
          { label: "Interest-only period", value: `${ioMonths} months` },
          { label: "Repayment period", value: `${repay} months` },
        ],
        formula: "IO = balance × annual rate / 12; then amortize remaining balance",
        copyText: `HELOC IO payment: ${$(ioPay)}; repayment ${$(amortPay)}`,
      };
    },
  }),

  def({
    slug: "down-payment-calculator",
    name: "Down Payment Calculator",
    subcategory: "financial",
    shortDescription: "Calculate down payment amount, percent, or required savings goal.",
    keywords: ["down payment calculator", "home down payment", "deposit calculator"],
    relatedToolIds: ["mortgage-calculator", "house-affordability-calculator", "savings-calculator"],
    fields: [
      selectField("mode", "Calculate", "amount", [
        { value: "amount", label: "Down payment amount" },
        { value: "percent", label: "Down payment percent" },
        { value: "price", label: "Home price from savings" },
      ]),
      moneyField("price", "Home price", "400000"),
      percentField("percent", "Down payment (%)", "20"),
      moneyField("savings", "Available savings", "80000"),
      currencySelect,
    ],
    compute: (v) => {
      const $ = money(v);
      if (v.mode === "amount") {
        const price = parseNumber(v.price, "home price", { allowNegative: false, allowZero: false });
        const pct = parseNumber(v.percent, "percent", { allowNegative: false }) / 100;
        const amount = price * pct;
        return {
          primaryLabel: "Down payment",
          primary: $(amount),
          breakdown: [{ label: "Loan amount", value: $(price - amount) }],
          formula: "Down payment = price × percent",
          copyText: `Down payment: ${$(amount)}`,
        };
      }
      if (v.mode === "percent") {
        const price = parseNumber(v.price, "home price", { allowNegative: false, allowZero: false });
        const savings = parseNumber(v.savings, "savings", { allowNegative: false });
        const pct = (savings / price) * 100;
        return {
          primaryLabel: "Down payment percent",
          primary: formatPercent(pct),
          breakdown: [{ label: "Loan amount", value: $(price - savings) }],
          formula: "Percent = savings / price",
          copyText: `Down payment percent: ${formatPercent(pct)}`,
        };
      }
      const savings = parseNumber(v.savings, "savings", { allowNegative: false, allowZero: false });
      const pct = parseNumber(v.percent, "percent", { allowNegative: false, allowZero: false }) / 100;
      const price = savings / pct;
      return {
        primaryLabel: "Affordable home price",
        primary: $(price),
        breakdown: [{ label: "Loan amount", value: $(price - savings) }],
        formula: "Price = savings / down-payment percent",
        copyText: `Home price from savings: ${$(price)}`,
      };
    },
  }),

  def({
    slug: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    subcategory: "financial",
    shortDescription: "Compare multi-year costs of renting versus buying a home.",
    keywords: ["rent vs buy", "rent or buy calculator", "buy vs rent"],
    relatedToolIds: ["mortgage-calculator", "rent-calculator", "house-affordability-calculator"],
    notices: [eduDisclaimer, "Ignores many local tax nuances; use as a planning comparison."],
    fields: [
      moneyField("rent", "Monthly rent", "2200"),
      moneyField("price", "Home price", "450000"),
      percentField("downPct", "Down payment (%)", "20"),
      percentField("rate", "Mortgage rate (%)", "6.5"),
      numberField("years", "Comparison years", "7", { min: "1", step: "1", inputMode: "numeric" }),
      percentField("appreciation", "Home appreciation (%/yr)", "3"),
      percentField("rentGrowth", "Rent growth (%/yr)", "3"),
      moneyField("maint", "Annual ownership costs", "6000"),
      currencySelect,
    ],
    compute: (v) => {
      const rent0 = parseNumber(v.rent, "rent", { allowNegative: false });
      const price = parseNumber(v.price, "price", { allowNegative: false, allowZero: false });
      const downPct = parseNumber(v.downPct, "down %", { allowNegative: false }) / 100;
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100 / 12;
      const years = parsePositiveInt(v.years, "years");
      const appr = parseNumber(v.appreciation, "appreciation", { allowNegative: false }) / 100;
      const rentG = parseNumber(v.rentGrowth, "rent growth", { allowNegative: false }) / 100;
      const maint = parseOptionalNumber(v.maint, "ownership costs", 0);
      const down = price * downPct;
      const loan = price - down;
      const n = 30 * 12;
      const pay = pmt(loan, r, n);
      let rentCost = 0;
      let rent = rent0;
      for (let y = 0; y < years; y++) {
        rentCost += rent * 12;
        rent *= 1 + rentG;
      }
      const buyHousing = pay * 12 * years + maint * years + down;
      const bal = remainingBalance(loan, r, n, years * 12);
      const homeValue = price * Math.pow(1 + appr, years);
      const equity = homeValue - bal;
      const buyNetCost = buyHousing - equity;
      const $ = money(v);
      const better = buyNetCost < rentCost ? "Buying looks lower-cost in this model" : "Renting looks lower-cost in this model";
      return {
        primaryLabel: better,
        primary: $(Math.abs(rentCost - buyNetCost)),
        subhead: "Absolute difference in estimated net cost",
        breakdown: [
          { label: "Total rent paid", value: $(rentCost) },
          { label: "Buy cash outlay (approx.)", value: $(buyHousing) },
          { label: "Ending equity", value: $(equity) },
          { label: "Buy net cost", value: $(buyNetCost) },
        ],
        formula: "Compare cumulative rent vs buy outlays minus ending equity",
        copyText: `${better}: difference ${$(Math.abs(rentCost - buyNetCost))}`,
      };
    },
  }),

  def({
    slug: "cash-back-or-low-interest-calculator",
    name: "Cash Back or Low Interest Calculator",
    subcategory: "financial",
    shortDescription: "Compare a cash-back deal versus a low-interest financing offer.",
    keywords: ["cash back vs low interest", "dealer financing compare", "rebate vs rate"],
    relatedToolIds: ["auto-lease-calculator", "loan-calculator", "interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("price", "Purchase price", "35000"),
      moneyField("cashBack", "Cash-back amount", "2000"),
      percentField("highRate", "Rate with cash back (%)", "6.9"),
      percentField("lowRate", "Low-interest rate (%)", "1.9"),
      numberField("months", "Term (months)", "60", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const price = parseNumber(v.price, "price", { allowNegative: false, allowZero: false });
      const cashBack = parseOptionalNumber(v.cashBack, "cash back", 0);
      const high = parseNumber(v.highRate, "high rate", { allowNegative: false }) / 100 / 12;
      const low = parseNumber(v.lowRate, "low rate", { allowNegative: false }) / 100 / 12;
      const n = parsePositiveInt(v.months, "term");
      const cashLoan = Math.max(0, price - cashBack);
      const cashPay = pmt(cashLoan, high, n);
      const lowPay = pmt(price, low, n);
      const cashTotal = cashPay * n;
      const lowTotal = lowPay * n;
      const $ = money(v);
      const winner = cashTotal < lowTotal ? "Cash-back offer" : "Low-interest offer";
      return {
        primaryLabel: "Lower total cost",
        primary: winner,
        breakdown: [
          { label: "Cash-back monthly", value: $(cashPay) },
          { label: "Cash-back total paid", value: $(cashTotal) },
          { label: "Low-rate monthly", value: $(lowPay) },
          { label: "Low-rate total paid", value: $(lowTotal) },
          { label: "Difference", value: $(Math.abs(cashTotal - lowTotal)) },
        ],
        formula: "Compare total payments under each financing scenario",
        copyText: `${winner} saves ${$(Math.abs(cashTotal - lowTotal))}`,
      };
    },
  }),

  def({
    slug: "auto-lease-calculator",
    name: "Auto Lease Calculator",
    subcategory: "financial",
    shortDescription: "Estimate a car lease payment from cap cost, residual, and money factor.",
    keywords: ["auto lease calculator", "car lease payment", "lease estimator"],
    relatedToolIds: ["car-loan-payment-calculator", "loan-calculator", "cash-back-or-low-interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("cap", "Capitalized cost", "32000"),
      moneyField("residual", "Residual value", "18000"),
      numberField("months", "Lease months", "36", { step: "1", inputMode: "numeric" }),
      numberField("moneyFactor", "Money factor", "0.0025", { step: "0.0001" }),
      moneyField("fees", "Monthly fees", "0"),
      currencySelect,
    ],
    compute: (v) => {
      const cap = parseNumber(v.cap, "cap cost", { allowNegative: false, allowZero: false });
      const residual = parseNumber(v.residual, "residual", { allowNegative: false });
      const months = parsePositiveInt(v.months, "months");
      const mf = parseNumber(v.moneyFactor, "money factor", { allowNegative: false });
      const fees = parseOptionalNumber(v.fees, "fees", 0);
      const depreciation = (cap - residual) / months;
      const finance = (cap + residual) * mf;
      const payment = depreciation + finance + fees;
      const $ = money(v);
      return {
        primaryLabel: "Estimated lease payment",
        primary: $(payment),
        breakdown: [
          { label: "Depreciation portion", value: $(depreciation) },
          { label: "Rent charge", value: $(finance) },
          { label: "Approx APR", value: formatPercent(mf * 2400) },
        ],
        formula: "Payment ≈ (cap − residual)/months + (cap + residual)×money factor",
        copyText: `Lease payment: ${$(payment)}`,
      };
    },
  }),

  def({
    slug: "investment-calculator",
    name: "Investment Calculator",
    subcategory: "financial",
    shortDescription: "Project investment growth with recurring contributions.",
    keywords: ["investment calculator", "investment growth", "portfolio projection"],
    relatedToolIds: ["compound-interest-calculator", "roi-calculator", "future-value-calculator"],
    featured: true,
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Starting amount", "10000"),
      moneyField("contribution", "Monthly contribution", "500"),
      percentField("rate", "Expected annual return (%)", "7"),
      numberField("years", "Years", "20", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "starting amount", { allowNegative: false });
      const c = parseOptionalNumber(v.contribution, "contribution", 0);
      const rate = parseNumber(v.rate, "return", { allowNegative: false }) / 100 / 12;
      const years = parseNumber(v.years, "years", { min: 0 });
      const n = Math.round(years * 12);
      const future = futureValue(P, rate, n, c);
      const contrib = c * n;
      const $ = money(v);
      return {
        primaryLabel: "Projected balance",
        primary: $(future),
        breakdown: [
          { label: "Total contributions", value: $(P + contrib) },
          { label: "Projected growth", value: $(future - P - contrib) },
        ],
        formula: "Future value of principal plus ordinary annuity contributions",
        copyText: `Projected investment value: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "finance-calculator",
    name: "Finance Calculator",
    subcategory: "financial",
    shortDescription: "Solve common TVM problems: PV, FV, payment, rate, or periods.",
    keywords: ["finance calculator", "tvm calculator", "time value of money"],
    relatedToolIds: ["present-value-calculator", "future-value-calculator", "payment-calculator"],
    notices: [eduDisclaimer],
    fields: [
      selectField("solve", "Solve for", "fv", [
        { value: "fv", label: "Future value" },
        { value: "pv", label: "Present value" },
        { value: "pmt", label: "Payment" },
        { value: "n", label: "Periods" },
      ]),
      moneyField("pv", "Present value", "10000"),
      moneyField("fv", "Future value", "0"),
      moneyField("pmt", "Payment per period", "200"),
      percentField("rate", "Rate per period (%)", "0.5"),
      numberField("n", "Number of periods", "120", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const $ = money(v);
      if (v.solve === "fv") {
        const pv = parseNumber(v.pv, "present value");
        const pmtAmt = parseOptionalNumber(v.pmt, "payment", 0);
        const n = parsePositiveInt(v.n, "periods");
        const fv = futureValue(pv, rate, n, pmtAmt);
        return { primaryLabel: "Future value", primary: $(fv), formula: "FV of PV and PMT", copyText: `FV: ${$(fv)}` };
      }
      if (v.solve === "pv") {
        const fv = parseNumber(v.fv, "future value");
        const n = parsePositiveInt(v.n, "periods");
        const pv = presentValue(fv, rate, n);
        return { primaryLabel: "Present value", primary: $(pv), formula: "PV = FV / (1+r)^n", copyText: `PV: ${$(pv)}` };
      }
      if (v.solve === "pmt") {
        const pv = parseNumber(v.pv, "present value");
        const n = parsePositiveInt(v.n, "periods");
        const pay = pmt(Math.abs(pv), rate, n);
        return { primaryLabel: "Payment", primary: $(pay), formula: "Amortizing PMT", copyText: `PMT: ${$(pay)}` };
      }
      const pv = parseNumber(v.pv, "present value", { allowZero: false });
      const pmtAmt = parseNumber(v.pmt, "payment", { allowZero: false });
      if (rate === 0) {
        const n = Math.ceil(Math.abs(pv) / pmtAmt);
        return { primaryLabel: "Periods", primary: String(n), copyText: `n: ${n}` };
      }
      if (pmtAmt <= Math.abs(pv) * rate) throw new Error("Payment is too low.");
      const n = Math.ceil(Math.log(pmtAmt / (pmtAmt - Math.abs(pv) * rate)) / Math.log(1 + rate));
      return { primaryLabel: "Periods", primary: String(n), formula: "n from payment equation", copyText: `n: ${n}` };
    },
  }),

  def({
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    subcategory: "financial",
    shortDescription: "Calculate compound interest with flexible compounding frequency.",
    keywords: ["compound interest calculator", "compound growth", "compounding calculator"],
    relatedToolIds: ["interest-calculator", "investment-calculator", "future-value-calculator", "savings-calculator"],
    featured: true,
    fields: [
      moneyField("principal", "Principal", "5000"),
      percentField("rate", "Annual rate (%)", "5"),
      numberField("years", "Years", "10", { min: "0", step: "0.1" }),
      selectField("freq", "Compounds per year", "12", [
        { value: "1", label: "Annually" },
        { value: "2", label: "Semiannually" },
        { value: "4", label: "Quarterly" },
        { value: "12", label: "Monthly" },
        { value: "365", label: "Daily" },
      ]),
      moneyField("contribution", "Contribution each period", "0"),
      currencySelect,
    ],
    examples: [
      {
        title: "Monthly compounding",
        input: "$5,000 at 5% for 10 years, monthly",
        output: "About $8,235 (no contributions)",
      },
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { allowNegative: false });
      const freq = parsePositiveInt(v.freq, "frequency");
      const contrib = parseOptionalNumber(v.contribution, "contribution", 0);
      const { future, interest, contributions } = compoundInterestAmount(P, rate, years, freq, contrib);
      const $ = money(v);
      return {
        primaryLabel: "Future value",
        primary: $(future),
        breakdown: [
          { label: "Interest", value: $(interest) },
          { label: "Contributions", value: $(contributions) },
          { label: "Principal", value: $(P) },
        ],
        formula: "A = P(1+r/n)^(nt) + contributions future value",
        copyText: `Compound interest future value: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "interest-rate-calculator",
    name: "Interest Rate Calculator",
    subcategory: "financial",
    shortDescription: "Solve for the interest rate given principal, payment, and term.",
    keywords: ["interest rate calculator", "solve for rate", "loan rate"],
    relatedToolIds: ["apr-calculator", "payment-calculator", "loan-calculator"],
    fields: [
      moneyField("principal", "Principal", "12000"),
      moneyField("payment", "Monthly payment", "280"),
      numberField("months", "Term (months)", "48", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false, allowZero: false });
      const pay = parseNumber(v.payment, "payment", { allowNegative: false, allowZero: false });
      const n = parsePositiveInt(v.months, "term");
      let lo = 0;
      let hi = 2;
      for (let i = 0; i < 80; i++) {
        const mid = (lo + hi) / 2;
        if (pmt(P, mid, n) > pay) hi = mid;
        else lo = mid;
      }
      return {
        primaryLabel: "Estimated annual rate",
        primary: formatPercent(lo * 12 * 100),
        formula: "Numeric solution of the amortizing payment equation",
        copyText: `Rate: ${formatPercent(lo * 12 * 100)}`,
      };
    },
  }),

  def({
    slug: "savings-calculator",
    name: "Savings Calculator",
    subcategory: "financial",
    shortDescription: "Plan a savings goal with deposits and compound growth.",
    keywords: ["savings calculator", "savings goal", "deposit calculator"],
    relatedToolIds: ["compound-interest-calculator", "future-value-calculator", "investment-calculator"],
    fields: [
      moneyField("principal", "Starting balance", "1000"),
      moneyField("monthly", "Monthly deposit", "300"),
      percentField("rate", "Annual return (%)", "4"),
      numberField("years", "Years", "8", { min: "0", step: "0.1" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "starting balance", { allowNegative: false });
      const m = parseOptionalNumber(v.monthly, "monthly deposit", 0);
      const rate = parseNumber(v.rate, "return", { allowNegative: false }) / 100 / 12;
      const n = Math.round(parseNumber(v.years, "years", { allowNegative: false }) * 12);
      const future = futureValue(P, rate, n, m);
      const $ = money(v);
      return {
        primaryLabel: "Projected savings",
        primary: $(future),
        breakdown: [
          { label: "Deposits", value: $(P + m * n) },
          { label: "Growth", value: $(future - P - m * n) },
        ],
        formula: "Future value of savings deposits",
        copyText: `Projected savings: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    subcategory: "financial",
    shortDescription: "Compute simple interest and maturity amount.",
    keywords: ["simple interest calculator", "simple interest"],
    relatedToolIds: ["interest-calculator", "compound-interest-calculator"],
    fields: [
      moneyField("principal", "Principal", "2500"),
      percentField("rate", "Annual rate (%)", "6"),
      numberField("years", "Time (years)", "3", { min: "0", step: "0.01" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "principal", { allowNegative: false });
      const r = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const t = parseNumber(v.years, "time", { allowNegative: false });
      const interest = P * r * t;
      const $ = money(v);
      return {
        primaryLabel: "Interest",
        primary: $(interest),
        breakdown: [{ label: "Maturity amount", value: $(P + interest) }],
        formula: "I = P · r · t",
        copyText: `Simple interest: ${$(interest)}`,
      };
    },
  }),

  def({
    slug: "cd-calculator",
    name: "CD Calculator",
    subcategory: "financial",
    shortDescription: "Estimate certificate of deposit maturity value.",
    keywords: ["cd calculator", "certificate of deposit", "cd interest"],
    relatedToolIds: ["compound-interest-calculator", "savings-calculator", "interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Deposit", "10000"),
      percentField("rate", "APY / annual rate (%)", "4.5"),
      numberField("months", "Term (months)", "12", { step: "1", inputMode: "numeric" }),
      selectField("freq", "Compounding", "12", [
        { value: "1", label: "Annually" },
        { value: "4", label: "Quarterly" },
        { value: "12", label: "Monthly" },
        { value: "365", label: "Daily" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "deposit", { allowNegative: false, allowZero: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const months = parsePositiveInt(v.months, "term");
      const freq = parsePositiveInt(v.freq, "compounding");
      const years = months / 12;
      const { future, interest } = compoundInterestAmount(P, rate, years, freq, 0);
      const $ = money(v);
      return {
        primaryLabel: "Maturity value",
        primary: $(future),
        breakdown: [{ label: "Interest earned", value: $(interest) }],
        formula: "Compound interest over the CD term",
        copyText: `CD maturity: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "bond-calculator",
    name: "Bond Calculator",
    subcategory: "financial",
    shortDescription: "Estimate bond price from face value, coupon, yield, and years.",
    keywords: ["bond calculator", "bond price", "coupon bond"],
    relatedToolIds: ["present-value-calculator", "investment-calculator", "interest-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("face", "Face value", "1000"),
      percentField("coupon", "Annual coupon rate (%)", "5"),
      percentField("yield", "Yield to maturity (%)", "4"),
      numberField("years", "Years to maturity", "10", { min: "0.1", step: "0.1" }),
      selectField("freq", "Coupon frequency", "2", [
        { value: "1", label: "Annual" },
        { value: "2", label: "Semiannual" },
        { value: "4", label: "Quarterly" },
      ]),
      currencySelect,
    ],
    compute: (v) => {
      const face = parseNumber(v.face, "face value", { allowNegative: false, allowZero: false });
      const coupon = parseNumber(v.coupon, "coupon", { allowNegative: false }) / 100;
      const ytm = parseNumber(v.yield, "yield", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { min: 0.1 });
      const freq = parsePositiveInt(v.freq, "frequency");
      const n = Math.round(years * freq);
      const c = (face * coupon) / freq;
      const r = ytm / freq;
      let price = 0;
      for (let t = 1; t <= n; t++) price += c / Math.pow(1 + r, t);
      price += face / Math.pow(1 + r, n);
      const $ = money(v);
      return {
        primaryLabel: "Estimated bond price",
        primary: $(price),
        breakdown: [
          { label: "Periodic coupon", value: $(c) },
          { label: "Premium / discount", value: $(price - face) },
        ],
        formula: "Price = Σ coupon/(1+y)^t + face/(1+y)^n",
        copyText: `Bond price: ${$(price)}`,
      };
    },
  }),

  def({
    slug: "mutual-fund-calculator",
    name: "Mutual Fund Calculator",
    subcategory: "financial",
    shortDescription: "Project mutual fund growth after expense ratio drag.",
    keywords: ["mutual fund calculator", "expense ratio", "fund growth"],
    relatedToolIds: ["investment-calculator", "average-return-calculator", "roi-calculator"],
    notices: [eduDisclaimer],
    fields: [
      moneyField("principal", "Initial investment", "10000"),
      moneyField("monthly", "Monthly contribution", "250"),
      percentField("return", "Gross annual return (%)", "8"),
      percentField("expense", "Expense ratio (%)", "0.75"),
      numberField("years", "Years", "15", { min: "1", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const P = parseNumber(v.principal, "initial investment", { allowNegative: false });
      const m = parseOptionalNumber(v.monthly, "monthly", 0);
      const gross = parseNumber(v.return, "return", { allowNegative: false }) / 100;
      const exp = parseNumber(v.expense, "expense ratio", { allowNegative: false }) / 100;
      const years = parseNumber(v.years, "years", { min: 0 });
      const net = Math.max(-0.99, gross - exp);
      const future = futureValue(P, net / 12, Math.round(years * 12), m);
      const $ = money(v);
      return {
        primaryLabel: "Projected value",
        primary: $(future),
        breakdown: [{ label: "Assumed net annual return", value: formatPercent(net * 100) }],
        formula: "Net return ≈ gross return − expense ratio",
        copyText: `Mutual fund projection: ${$(future)}`,
      };
    },
  }),

  def({
    slug: "average-return-calculator",
    name: "Average Return Calculator",
    subcategory: "financial",
    shortDescription: "Compute arithmetic and geometric average returns from a list.",
    keywords: ["average return", "geometric mean return", "cagr list"],
    relatedToolIds: ["roi-calculator", "investment-calculator", "statistics-calculator"],
    fields: [
      {
        id: "returns",
        label: "Periodic returns (%) — one per line or comma-separated",
        type: "textarea",
        defaultValue: "8\n-3\n12\n5",
        span: 2,
      },
    ],
    compute: (v) => {
      const parts = v.returns
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s));
      if (!parts.length) throw new Error("Enter at least one return.");
      if (parts.some((n) => !Number.isFinite(n))) throw new Error("All returns must be valid numbers.");
      const arith = parts.reduce((a, b) => a + b, 0) / parts.length;
      const product = parts.reduce((a, b) => a * (1 + b / 100), 1);
      if (product <= 0) throw new Error("Geometric mean is undefined for these returns.");
      const geom = (Math.pow(product, 1 / parts.length) - 1) * 100;
      return {
        primaryLabel: "Geometric average return",
        primary: formatPercent(geom),
        breakdown: [
          { label: "Arithmetic average", value: formatPercent(arith) },
          { label: "Periods", value: String(parts.length) },
        ],
        formula: "Geometric mean = (Π(1+r_i))^(1/n) − 1",
        copyText: `Geometric avg: ${formatPercent(geom)}; arithmetic: ${formatPercent(arith)}`,
      };
    },
  }),

  def({
    slug: "irr-calculator",
    name: "IRR Calculator",
    subcategory: "financial",
    shortDescription: "Estimate internal rate of return from a series of cash flows.",
    keywords: ["irr calculator", "internal rate of return", "npv irr"],
    relatedToolIds: ["roi-calculator", "npv-calculator", "payback-period-calculator"],
    notices: [eduDisclaimer],
    fields: [
      {
        id: "flows",
        label: "Cash flows (first usually negative) — comma or line separated",
        type: "textarea",
        defaultValue: "-10000\n3000\n3500\n4000\n4500",
        span: 2,
      },
    ],
    compute: (v) => {
      const flows = v.flows
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s.replace(/,/g, "")));
      if (flows.length < 2) throw new Error("Enter at least two cash flows.");
      if (flows.some((n) => !Number.isFinite(n))) throw new Error("Cash flows must be valid numbers.");
      const rate = irr(flows);
      return {
        primaryLabel: "IRR (per period)",
        primary: formatPercent(rate * 100),
        breakdown: [{ label: "NPV at IRR", value: formatNumber(npv(rate, flows), 4) }],
        formula: "Solve rate r where NPV(r) = 0",
        copyText: `IRR: ${formatPercent(rate * 100)}`,
      };
    },
  }),

  def({
    slug: "npv-calculator",
    name: "NPV Calculator",
    subcategory: "financial",
    shortDescription: "Calculate net present value for a discount rate and cash flows.",
    keywords: ["npv calculator", "net present value"],
    relatedToolIds: ["irr-calculator", "present-value-calculator", "roi-calculator"],
    fields: [
      percentField("rate", "Discount rate per period (%)", "8"),
      {
        id: "flows",
        label: "Cash flows — comma or line separated",
        type: "textarea",
        defaultValue: "-50000\n15000\n18000\n20000\n22000",
        span: 2,
      },
      currencySelect,
    ],
    compute: (v) => {
      const rate = parseNumber(v.rate, "discount rate") / 100;
      const flows = v.flows
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s.replace(/,/g, "")));
      if (flows.length < 1) throw new Error("Enter cash flows.");
      const value = npv(rate, flows);
      const $ = money(v);
      return {
        primaryLabel: "Net present value",
        primary: $(value),
        formula: "NPV = Σ CF_t / (1+r)^t",
        copyText: `NPV: ${$(value)}`,
      };
    },
  }),

  def({
    slug: "roi-calculator",
    name: "ROI Calculator",
    subcategory: "financial",
    shortDescription: "Measure return on investment as gain and percentage.",
    keywords: ["roi calculator", "return on investment"],
    relatedToolIds: ["investment-calculator", "irr-calculator", "payback-period-calculator"],
    featured: true,
    fields: [
      moneyField("invested", "Amount invested", "10000"),
      moneyField("returned", "Amount returned", "13500"),
      currencySelect,
    ],
    compute: (v) => {
      const invested = parseNumber(v.invested, "amount invested", { allowNegative: false, allowZero: false });
      const returned = parseNumber(v.returned, "amount returned");
      const gain = returned - invested;
      const roi = (gain / invested) * 100;
      const $ = money(v);
      return {
        primaryLabel: "ROI",
        primary: formatPercent(roi),
        breakdown: [{ label: "Net gain / loss", value: $(gain) }],
        formula: "ROI = (returned − invested) / invested",
        copyText: `ROI: ${formatPercent(roi)}`,
      };
    },
  }),

  def({
    slug: "payback-period-calculator",
    name: "Payback Period Calculator",
    subcategory: "financial",
    shortDescription: "Estimate how long it takes to recover an initial investment.",
    keywords: ["payback period", "payback calculator"],
    relatedToolIds: ["roi-calculator", "irr-calculator", "investment-calculator"],
    fields: [
      moneyField("investment", "Initial investment", "50000"),
      moneyField("annual", "Average annual cash inflow", "12000"),
      currencySelect,
    ],
    compute: (v) => {
      const inv = parseNumber(v.investment, "investment", { allowNegative: false, allowZero: false });
      const annual = parseNumber(v.annual, "annual cash inflow", { allowNegative: false, allowZero: false });
      const years = inv / annual;
      return {
        primaryLabel: "Payback period",
        primary: `${formatFixed(years, 2)} years`,
        breakdown: [{ label: "Months (approx.)", value: formatFixed(years * 12, 1) }],
        formula: "Payback = investment / annual cash inflow",
        notes: ["Does not discount cash flows."],
        copyText: `Payback: ${formatFixed(years, 2)} years`,
      };
    },
  }),

  def({
    slug: "present-value-calculator",
    name: "Present Value Calculator",
    subcategory: "financial",
    shortDescription: "Discount a future amount to today's value.",
    keywords: ["present value calculator", "pv calculator", "discounting"],
    relatedToolIds: ["future-value-calculator", "finance-calculator", "npv-calculator"],
    fields: [
      moneyField("future", "Future value", "25000"),
      percentField("rate", "Discount rate (%/period)", "5"),
      numberField("periods", "Periods", "8", { min: "0", step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const fv = parseNumber(v.future, "future value");
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const n = parseNumber(v.periods, "periods", { allowNegative: false });
      const pv = presentValue(fv, rate, n);
      const $ = money(v);
      return {
        primaryLabel: "Present value",
        primary: $(pv),
        formula: "PV = FV / (1+r)^n",
        copyText: `Present value: ${$(pv)}`,
      };
    },
  }),

  def({
    slug: "future-value-calculator",
    name: "Future Value Calculator",
    subcategory: "financial",
    shortDescription: "Grow a present amount (and optional deposits) into a future value.",
    keywords: ["future value calculator", "fv calculator"],
    relatedToolIds: ["present-value-calculator", "compound-interest-calculator", "investment-calculator"],
    fields: [
      moneyField("present", "Present value", "8000"),
      moneyField("pmt", "Deposit each period", "100"),
      percentField("rate", "Rate per period (%)", "0.5"),
      numberField("periods", "Periods", "60", { step: "1", inputMode: "numeric" }),
      currencySelect,
    ],
    compute: (v) => {
      const pv = parseNumber(v.present, "present value", { allowNegative: false });
      const pmtAmt = parseOptionalNumber(v.pmt, "deposit", 0);
      const rate = parseNumber(v.rate, "rate", { allowNegative: false }) / 100;
      const n = parsePositiveInt(v.periods, "periods");
      const fv = futureValue(pv, rate, n, pmtAmt);
      const $ = money(v);
      return {
        primaryLabel: "Future value",
        primary: $(fv),
        formula: "FV = PV(1+r)^n + PMT·((1+r)^n − 1)/r",
        copyText: `Future value: ${$(fv)}`,
      };
    },
  }),
];
