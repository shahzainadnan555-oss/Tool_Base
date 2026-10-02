export type CalculatorToolKind =
  | "unit-converter"
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "data-storage"
  | "number-words"
  | "percentage"
  | "fraction"
  | "average"
  | "ratio"
  | "discount"
  | "tax"
  | "tip"
  | "date-difference"
  | "age"
  | "timezone";

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "data";

export interface UnitDef {
  id: string;
  label: string;
  /** Factor to base unit (except temperature which uses special formulas) */
  toBase?: number;
}

export interface CalculatorToolConfig {
  slug: string;
  kind: CalculatorToolKind;
  actionLabel?: string;
  live: boolean;
  notices: string[];
  unitCategory?: UnitCategory;
  allowCategorySelect?: boolean;
}

export interface CalculatorResult {
  primary: string;
  secondary?: string;
  formula?: string;
  breakdown?: string[];
  details?: Record<string, string>;
  copyText: string;
}

export interface CalculatorOptions {
  value?: string;
  fromUnit?: string;
  toUnit?: string;
  category?: UnitCategory;
  // percentage
  percentMode?: "of" | "is-what" | "change";
  percent?: string;
  number?: string;
  original?: string;
  next?: string;
  // fraction
  fracOp?: "add" | "sub" | "mul" | "div";
  num1?: string;
  den1?: string;
  num2?: string;
  den2?: string;
  // average / numbers list
  numbersText?: string;
  // ratio
  ratioMode?: "simplify" | "solve";
  ratioA?: string;
  ratioB?: string;
  ratioC?: string;
  // money
  price?: string;
  rate?: string;
  people?: string;
  taxMode?: "add" | "remove";
  // dates
  startDate?: string;
  endDate?: string;
  birthDate?: string;
  targetDate?: string;
  inclusive?: boolean;
  // timezone
  date?: string;
  time?: string;
  fromTz?: string;
  toTz?: string;
  // number words
  numberInput?: string;
}
