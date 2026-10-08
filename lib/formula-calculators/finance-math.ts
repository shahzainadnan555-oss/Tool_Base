import { assertFinite } from "./parse";

/** Standard amortizing loan payment (periodic). */
export function pmt(principal: number, periodicRate: number, periods: number): number {
  if (periods <= 0) throw new Error("Term must be greater than zero.");
  if (principal <= 0) throw new Error("Principal must be greater than zero.");
  if (periodicRate === 0) return principal / periods;
  const r = periodicRate;
  const factor = Math.pow(1 + r, periods);
  return assertFinite((principal * r * factor) / (factor - 1), "Payment");
}

export function remainingBalance(
  principal: number,
  periodicRate: number,
  periods: number,
  paymentsMade: number,
): number {
  if (paymentsMade <= 0) return principal;
  if (paymentsMade >= periods) return 0;
  if (periodicRate === 0) {
    return Math.max(0, principal - (principal / periods) * paymentsMade);
  }
  const payment = pmt(principal, periodicRate, periods);
  const r = periodicRate;
  const bal =
    principal * Math.pow(1 + r, paymentsMade) -
    payment * ((Math.pow(1 + r, paymentsMade) - 1) / r);
  return Math.max(0, assertFinite(bal, "Balance"));
}

export interface AmortRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function buildAmortizationSchedule(
  principal: number,
  periodicRate: number,
  periods: number,
  maxRows = 360,
): { payment: number; totalInterest: number; totalPaid: number; rows: AmortRow[] } {
  const payment = pmt(principal, periodicRate, periods);
  let balance = principal;
  let totalInterest = 0;
  const rows: AmortRow[] = [];
  const limit = Math.min(periods, maxRows);

  for (let i = 1; i <= periods; i++) {
    const interest = periodicRate === 0 ? 0 : balance * periodicRate;
    let principalPart = payment - interest;
    if (i === periods) {
      principalPart = balance;
    }
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    if (i <= limit) {
      rows.push({
        period: i,
        payment: i === periods ? principalPart + interest : payment,
        principal: principalPart,
        interest,
        balance,
      });
    }
  }

  const totalPaid = principal + totalInterest;
  return { payment, totalInterest, totalPaid, rows };
}

export function futureValue(present: number, rate: number, periods: number, pmtAmt = 0, due = false): number {
  if (periods < 0) throw new Error("Periods cannot be negative.");
  if (rate === 0) return present + pmtAmt * periods;
  const factor = Math.pow(1 + rate, periods);
  const annuity = pmtAmt * ((factor - 1) / rate) * (due ? 1 + rate : 1);
  return assertFinite(present * factor + annuity, "Future value");
}

export function presentValue(future: number, rate: number, periods: number): number {
  if (periods < 0) throw new Error("Periods cannot be negative.");
  if (rate === 0) return future;
  return assertFinite(future / Math.pow(1 + rate, periods), "Present value");
}

export function compoundInterestAmount(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number,
  contribution = 0,
): { future: number; interest: number; contributions: number } {
  if (compoundsPerYear <= 0) throw new Error("Compounding frequency must be greater than zero.");
  const n = compoundsPerYear;
  const r = annualRate / n;
  const periods = years * n;
  const future = futureValue(principal, r, periods, contribution, false);
  const contributions = contribution * periods;
  const interest = future - principal - contributions;
  return { future, interest, contributions };
}

/** Newton-Raphson IRR for cash flows (first is typically negative investment). */
export function irr(cashFlows: number[], guess = 0.1): number {
  if (cashFlows.length < 2) throw new Error("Need at least two cash flows.");
  let rate = guess;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dNpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashFlows[t] / denom;
      if (t > 0) dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(dNpv) < 1e-12) break;
    const next = rate - npv / dNpv;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-10) return next;
    rate = next;
  }
  if (!Number.isFinite(rate)) throw new Error("Could not solve IRR for these cash flows.");
  return rate;
}

export function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}
