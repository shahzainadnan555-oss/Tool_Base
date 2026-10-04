import type { ToolDefinition } from "./types";

function tool(
  partial: Omit<ToolDefinition, "route" | "status"> & {
    status?: ToolDefinition["status"];
  },
): ToolDefinition {
  return {
    ...partial,
    route: `/tools/${partial.slug}`,
    status: partial.status ?? "available",
  };
}

const sharedHowTo = (
  a: string,
  b: string,
  c: string,
): ToolDefinition["howToSteps"] => [
  {
    title: a,
    description: "Provide the values or units for this calculation.",
  },
  { title: b, description: "The result updates as you change inputs." },
  { title: c, description: "Copy the result or reset to start again." },
];

/** Everyday calculators & converters — Prompt 11 (tools 181–200) */
export const calculatorTools: ToolDefinition[] = [
  tool({
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    category: "calculators-converters",
    description:
      "Convert length, weight, area, volume, temperature, speed, time, and digital storage units with accurate factors.",
    shortDescription: "Convert everyday measurement units.",
    icon: "calculator",
    keywords: [
      "unit converter",
      "convert units",
      "measurement converter",
      "metric to imperial",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Numbers", "Units"],
    relatedToolIds: [
      "length-converter",
      "weight-converter",
      "temperature-converter",
      "data-storage-converter",
    ],
    seoTitle: "Unit Converter — Length, Weight, Temperature & More | Tool Base",
    seoDescription:
      "Convert units online with Tool Base. Switch between length, weight, temperature, area, volume, speed, time, and storage units for free.",
    h1: "Unit Converter",
    intro:
      "Convert everyday measurement units quickly. Choose a category, enter a value, pick units, and review the result instantly.",
    convertHeading: "Convert Units Online",
    howToHeading: "How to Convert Units",
    featuresHeading: "Unit Converter Features",
    supportedFormatsHeading: "Supported Unit Categories",
    relatedToolsHeading: "Related Conversion Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Length, weight, area, volume, temperature, speed, time, and storage",
      "Accurate conversion factors",
      "Instant live results",
      "Swap units without losing your value",
      "Copy the exact formatted result",
    ],
    howToSteps: sharedHowTo(
      "Choose a category",
      "Enter a value and units",
      "Review and copy",
    ),
    faq: [
      {
        question: "Which categories are supported?",
        answer:
          "Length, weight/mass, area, volume, temperature, speed, time (fixed-duration units), and digital storage (decimal and binary).",
      },
      {
        question: "Are temperature conversions special?",
        answer:
          "Yes. Celsius, Fahrenheit, and Kelvin use the correct offset formulas rather than a simple multiply-only scale.",
      },
      {
        question: "Is this free?",
        answer:
          "Yes. The unit converter is free to use with no account required.",
      },
    ],
    inputFormats: ["Numbers", "Units"],
    outputFormats: ["Converted values"],
    examples: [
      {
        title: "Meters to feet",
        input: "1 m",
        output: "3.2808399 ft",
        formula: "1 m × (1 / 0.3048) ≈ 3.28084 ft",
      },
      {
        title: "Celsius to Fahrenheit",
        input: "0 °C",
        output: "32 °F",
        formula: "°F = (°C × 9/5) + 32",
      },
    ],
  }),
  tool({
    id: "length-converter",
    name: "Length Converter",
    slug: "length-converter",
    category: "calculators-converters",
    description:
      "Convert length between millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, and more.",
    shortDescription: "Convert metric and imperial lengths.",
    icon: "calculator",
    keywords: [
      "length converter",
      "convert length",
      "meters to feet",
      "feet to meters",
      "cm to inches",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Length units"],
    relatedToolIds: [
      "unit-converter",
      "area-converter",
      "volume-converter",
      "speed-converter",
    ],
    seoTitle: "Length Converter — Meters, Feet, Inches & More | Tool Base",
    seoDescription:
      "Convert length units online with Tool Base. Convert meters to feet, inches to centimeters, and other common length measurements for free.",
    h1: "Length Converter",
    intro:
      "Convert metric and imperial length units with accurate factors. Enter a value, choose units, and see the result immediately.",
    convertHeading: "Convert Length Units Online",
    howToHeading: "How to Convert Length Units",
    featuresHeading: "Length Conversion Details",
    supportedFormatsHeading: "Supported Length Units",
    relatedToolsHeading: "Related Conversion Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Millimeter through kilometer",
      "Inch, foot, yard, mile, nautical mile",
      "Micrometer support",
      "Swap units instantly",
      "Copy formatted results",
    ],
    howToSteps: sharedHowTo(
      "Choose your units",
      "Enter a value",
      "Review the result",
    ),
    faq: [
      {
        question: "How many centimeters are in a meter?",
        answer: "Exactly 100 centimeters equal 1 meter.",
      },
      {
        question: "How many inches are in a foot?",
        answer: "Exactly 12 inches equal 1 foot.",
      },
      {
        question: "Is the international inch used?",
        answer: "Yes. 1 inch = 0.0254 meters exactly.",
      },
    ],
    inputFormats: ["Length values"],
    outputFormats: ["Converted length"],
    examples: [
      {
        title: "1 meter to centimeters",
        input: "1 m",
        output: "100 cm",
        formula: "1 m = 100 cm",
      },
      {
        title: "1 foot to inches",
        input: "1 ft",
        output: "12 in",
        formula: "1 ft = 12 in",
      },
      {
        title: "Meters to feet",
        input: "10 m",
        output: "32.808399 ft",
        formula: "10 ÷ 0.3048 ≈ 32.8084 ft",
      },
    ],
  }),
  tool({
    id: "weight-converter",
    name: "Weight Converter",
    slug: "weight-converter",
    category: "calculators-converters",
    description:
      "Convert weight and mass between milligrams, grams, kilograms, metric tons, ounces, pounds, and stone.",
    shortDescription: "Convert weight and mass units.",
    icon: "calculator",
    keywords: [
      "weight converter",
      "mass converter",
      "kg to lbs",
      "pounds to kilograms",
      "grams to ounces",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Mass units"],
    relatedToolIds: [
      "unit-converter",
      "volume-converter",
      "length-converter",
      "percentage-calculator",
    ],
    seoTitle: "Weight Converter — kg, lb, oz & More | Tool Base",
    seoDescription:
      "Convert weight and mass units online with Tool Base. Convert kilograms to pounds, grams to ounces, and other common mass units for free.",
    h1: "Weight Converter",
    intro:
      "Convert weight and mass units using accurate SI and avoirdupois factors. This tool converts mass values — not force.",
    convertHeading: "Convert Weight & Mass Online",
    howToHeading: "How to Convert Weight Units",
    featuresHeading: "Weight / Mass Details",
    supportedFormatsHeading: "Supported Mass Units",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Milligram to metric ton",
      "Ounce, pound, and stone",
      "Accurate avoirdupois factors",
      "Live conversion",
      "Swap and copy",
    ],
    howToSteps: sharedHowTo(
      "Select mass units",
      "Enter a value",
      "Review the conversion",
    ),
    faq: [
      {
        question: "Is this weight or mass?",
        answer:
          "The converter uses mass units (kg, g, lb). Everyday language often says “weight,” but the factors are mass-based.",
      },
      {
        question: "How many grams are in a kilogram?",
        answer: "Exactly 1000 grams equal 1 kilogram.",
      },
    ],
    inputFormats: ["Mass values"],
    outputFormats: ["Converted mass"],
    examples: [
      {
        title: "1 kilogram to grams",
        input: "1 kg",
        output: "1000 g",
        formula: "1 kg = 1000 g",
      },
      {
        title: "Kilograms to pounds",
        input: "1 kg",
        output: "2.2046226 lb",
        formula: "1 ÷ 0.45359237 ≈ 2.20462 lb",
      },
    ],
  }),
  tool({
    id: "temperature-converter",
    name: "Temperature Converter",
    slug: "temperature-converter",
    category: "calculators-converters",
    description:
      "Convert temperatures between Celsius, Fahrenheit, and Kelvin with the correct formulas.",
    shortDescription: "Convert °C, °F, and Kelvin.",
    icon: "calculator",
    keywords: [
      "temperature converter",
      "celsius to fahrenheit",
      "fahrenheit to celsius",
      "celsius to kelvin",
    ],
    popular: true,
    new: false,
    supportedFormats: ["°C", "°F", "K"],
    relatedToolIds: [
      "unit-converter",
      "time-converter",
      "speed-converter",
      "length-converter",
    ],
    seoTitle: "Temperature Converter — Celsius, Fahrenheit & Kelvin | Tool Base",
    seoDescription:
      "Convert temperatures between Celsius, Fahrenheit, and Kelvin with Tool Base’s free online temperature converter.",
    h1: "Temperature Converter",
    intro:
      "Convert between Celsius, Fahrenheit, and Kelvin using the correct offset formulas — not a simple multiply-only scale.",
    convertHeading: "Convert Temperatures Online",
    howToHeading: "How to Convert Temperature",
    featuresHeading: "Temperature Formulas",
    supportedFormatsHeading: "Supported Scales",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Celsius, Fahrenheit, and Kelvin",
      "Correct offset formulas",
      "Decimal temperature support",
      "Negative values supported",
      "Instant results",
    ],
    howToSteps: sharedHowTo(
      "Choose scales",
      "Enter a temperature",
      "Review the converted value",
    ),
    faq: [
      {
        question: "What is 0°C in Fahrenheit?",
        answer: "0°C equals 32°F.",
      },
      {
        question: "What is 100°C in Fahrenheit?",
        answer: "100°C equals 212°F.",
      },
      {
        question: "How do I convert Celsius to Kelvin?",
        answer: "Add 273.15. For example, 0°C = 273.15 K.",
      },
    ],
    inputFormats: ["Temperature values"],
    outputFormats: ["Converted temperature"],
    examples: [
      {
        title: "Celsius to Fahrenheit",
        input: "0 °C",
        output: "32 °F",
        formula: "°F = (°C × 9/5) + 32",
      },
      {
        title: "Fahrenheit to Celsius",
        input: "212 °F",
        output: "100 °C",
        formula: "°C = (°F − 32) × 5/9",
      },
      {
        title: "Celsius to Kelvin",
        input: "25 °C",
        output: "298.15 K",
        formula: "K = °C + 273.15",
      },
    ],
  }),
  tool({
    id: "area-converter",
    name: "Area Converter",
    slug: "area-converter",
    category: "calculators-converters",
    description:
      "Convert area between square millimeters, centimeters, meters, kilometers, inches, feet, yards, acres, and hectares.",
    shortDescription: "Convert area units.",
    icon: "calculator",
    keywords: [
      "area converter",
      "square meters to square feet",
      "acres to hectares",
      "convert area",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Area units"],
    relatedToolIds: [
      "length-converter",
      "volume-converter",
      "unit-converter",
      "speed-converter",
    ],
    seoTitle: "Area Converter — m², ft², Acres & Hectares | Tool Base",
    seoDescription:
      "Convert area units online with Tool Base. Convert square meters, square feet, acres, hectares, and more for free.",
    h1: "Area Converter",
    intro:
      "Convert land and surface area units with accurate factors for metric and imperial square measures.",
    convertHeading: "Convert Area Units Online",
    howToHeading: "How to Convert Area",
    featuresHeading: "Area Conversion Details",
    supportedFormatsHeading: "Supported Area Units",
    relatedToolsHeading: "Related Conversion Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Square millimeter through square kilometer",
      "Square inch, foot, and yard",
      "Acre and hectare",
      "Live conversion",
      "Swap and copy",
    ],
    howToSteps: sharedHowTo(
      "Choose area units",
      "Enter a value",
      "Review the result",
    ),
    faq: [
      {
        question: "How many square centimeters are in a square meter?",
        answer: "Exactly 10,000 cm² equal 1 m².",
      },
      {
        question: "How many square meters are in a hectare?",
        answer: "Exactly 10,000 m² equal 1 hectare.",
      },
    ],
    inputFormats: ["Area values"],
    outputFormats: ["Converted area"],
    examples: [
      {
        title: "1 m² to cm²",
        input: "1 m²",
        output: "10000 cm²",
        formula: "1 m² = 10,000 cm²",
      },
      {
        title: "1 hectare to m²",
        input: "1 ha",
        output: "10000 m²",
        formula: "1 ha = 10,000 m²",
      },
    ],
  }),
  tool({
    id: "volume-converter",
    name: "Volume Converter",
    slug: "volume-converter",
    category: "calculators-converters",
    description:
      "Convert volume between milliliters, liters, cubic meters, and US customary fluid units such as cups and gallons.",
    shortDescription: "Convert liquid and volume units.",
    icon: "calculator",
    keywords: [
      "volume converter",
      "liters to gallons",
      "ml to cups",
      "convert volume",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Volume units"],
    relatedToolIds: [
      "length-converter",
      "area-converter",
      "unit-converter",
      "weight-converter",
    ],
    seoTitle: "Volume Converter — Liters, Gallons & More | Tool Base",
    seoDescription:
      "Convert volume units online with Tool Base. Convert liters, milliliters, US gallons, cups, and cubic meters for free.",
    h1: "Volume Converter",
    intro:
      "Convert liquid and cubic volume units. US customary fluid units are clearly labeled so they are not mixed with other regional definitions.",
    convertHeading: "Convert Volume Units Online",
    howToHeading: "How to Convert Volume",
    featuresHeading: "Volume Conversion Details",
    supportedFormatsHeading: "Supported Volume Units",
    relatedToolsHeading: "Related Conversion Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Milliliter, liter, cubic centimeter, cubic meter",
      "US fl oz, cup, pint, quart, gallon",
      "Clear US customary labeling",
      "Live conversion",
      "Swap and copy",
    ],
    howToSteps: sharedHowTo(
      "Choose volume units",
      "Enter a value",
      "Review the result",
    ),
    faq: [
      {
        question: "How many milliliters are in a liter?",
        answer: "Exactly 1000 milliliters equal 1 liter.",
      },
      {
        question: "Are gallons US gallons?",
        answer:
          "Yes. This converter uses the US liquid gallon (exactly 3.785411784 liters).",
      },
    ],
    inputFormats: ["Volume values"],
    outputFormats: ["Converted volume"],
    examples: [
      {
        title: "1 liter to milliliters",
        input: "1 L",
        output: "1000 mL",
        formula: "1 L = 1000 mL",
      },
      {
        title: "US gallon to liters",
        input: "1 US gal",
        output: "3.785411784 L",
        formula: "1 US gal = 3.785411784 L",
      },
    ],
  }),
  tool({
    id: "speed-converter",
    name: "Speed Converter",
    slug: "speed-converter",
    category: "calculators-converters",
    description:
      "Convert speed between meters per second, kilometers per hour, miles per hour, feet per second, and knots.",
    shortDescription: "Convert speed units.",
    icon: "calculator",
    keywords: [
      "speed converter",
      "kmh to mph",
      "mph to kmh",
      "convert speed",
      "knots converter",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Speed units"],
    relatedToolIds: [
      "length-converter",
      "time-converter",
      "unit-converter",
      "temperature-converter",
    ],
    seoTitle: "Speed Converter — km/h, mph, m/s & Knots | Tool Base",
    seoDescription:
      "Convert speed units online with Tool Base. Convert km/h to mph, m/s, ft/s, and knots with accurate factors.",
    h1: "Speed Converter",
    intro:
      "Convert between common speed units using accurate length-and-time derived factors.",
    convertHeading: "Convert Speed Units Online",
    howToHeading: "How to Convert Speed",
    featuresHeading: "Speed Conversion Details",
    supportedFormatsHeading: "Supported Speed Units",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "m/s, km/h, mph, ft/s, knot",
      "Accurate factors",
      "Live conversion",
      "Swap units",
      "Copy results",
    ],
    howToSteps: sharedHowTo(
      "Choose speed units",
      "Enter a value",
      "Review the result",
    ),
    faq: [
      {
        question: "How many mph is 1 km/h?",
        answer: "1 km/h is approximately 0.621371 mph.",
      },
      {
        question: "What is a knot?",
        answer:
          "One knot equals one nautical mile per hour (1852 meters per hour).",
      },
    ],
    inputFormats: ["Speed values"],
    outputFormats: ["Converted speed"],
    examples: [
      {
        title: "km/h to mph",
        input: "1 km/h",
        output: "≈ 0.621371 mph",
        formula: "1 km/h ÷ (1.609344 km/mi) ≈ 0.621371 mph",
      },
      {
        title: "m/s to km/h",
        input: "1 m/s",
        output: "3.6 km/h",
        formula: "1 m/s × 3.6 = 3.6 km/h",
      },
    ],
  }),
  tool({
    id: "time-converter",
    name: "Time Converter",
    slug: "time-converter",
    category: "calculators-converters",
    description:
      "Convert time between milliseconds, seconds, minutes, hours, days, and weeks using fixed-duration units.",
    shortDescription: "Convert fixed-duration time units.",
    icon: "calculator",
    keywords: [
      "time converter",
      "hours to minutes",
      "days to hours",
      "convert time units",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Time units"],
    relatedToolIds: [
      "time-zone-converter",
      "date-difference-calculator",
      "age-calculator",
      "unit-converter",
    ],
    seoTitle: "Time Converter — Seconds, Hours, Days & Weeks | Tool Base",
    seoDescription:
      "Convert time units online with Tool Base. Convert milliseconds, seconds, minutes, hours, days, and weeks using fixed-duration units.",
    h1: "Time Converter",
    intro:
      "Convert fixed-duration time units. Months and years are intentionally omitted because their lengths vary.",
    convertHeading: "Convert Time Units Online",
    howToHeading: "How to Convert Time Units",
    featuresHeading: "Time Conversion Details",
    supportedFormatsHeading: "Supported Time Units",
    relatedToolsHeading: "Related Time Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Milliseconds through weeks",
      "Fixed-duration only",
      "No ambiguous month/year factors",
      "Live conversion",
      "Swap and copy",
    ],
    howToSteps: sharedHowTo(
      "Choose time units",
      "Enter a duration",
      "Review the result",
    ),
    faq: [
      {
        question: "Why are months not included?",
        answer:
          "Months and years do not have a single fixed length in seconds. For precise conversion, use days, weeks, hours, and smaller units.",
      },
      {
        question: "How many seconds are in a day?",
        answer: "Exactly 86,400 seconds equal 1 day in this converter.",
      },
    ],
    inputFormats: ["Duration values"],
    outputFormats: ["Converted duration"],
    examples: [
      {
        title: "1 hour to minutes",
        input: "1 h",
        output: "60 min",
        formula: "1 h = 60 min",
      },
      {
        title: "1 day to hours",
        input: "1 d",
        output: "24 h",
        formula: "1 d = 24 h",
      },
    ],
  }),
  tool({
    id: "data-storage-converter",
    name: "Data Storage Converter",
    slug: "data-storage-converter",
    category: "calculators-converters",
    description:
      "Convert digital storage between bits, bytes, KB/MB/GB/TB (decimal) and KiB/MiB/GiB/TiB (binary).",
    shortDescription: "Convert decimal and binary storage units.",
    icon: "calculator",
    keywords: [
      "data storage converter",
      "mb to gb",
      "kib to kb",
      "bytes converter",
      "gib to gb",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Storage units"],
    relatedToolIds: [
      "unit-converter",
      "number-to-words",
      "percentage-calculator",
      "average-calculator",
    ],
    seoTitle: "Data Storage Converter — KB, MB, GB, KiB & GiB | Tool Base",
    seoDescription:
      "Convert data storage units online with Tool Base. Distinguish decimal KB/MB/GB from binary KiB/MiB/GiB clearly.",
    h1: "Data Storage Converter",
    intro:
      "Convert digital storage sizes with clear decimal (KB, MB, GB) and binary (KiB, MiB, GiB) units — they are not the same.",
    convertHeading: "Convert Data Storage Online",
    howToHeading: "How to Convert Storage Units",
    featuresHeading: "Decimal vs Binary Storage",
    supportedFormatsHeading: "Supported Storage Units",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Bit and byte",
      "Decimal KB–PB",
      "Binary KiB–TiB",
      "Clear labeling of both systems",
      "Live conversion",
    ],
    howToSteps: sharedHowTo(
      "Choose storage units",
      "Enter a size",
      "Review the result",
    ),
    faq: [
      {
        question: "Is 1 KB the same as 1 KiB?",
        answer:
          "No. 1 KB (decimal) is 1,000 bytes. 1 KiB (binary) is 1,024 bytes.",
      },
      {
        question: "Why do OS file sizes differ?",
        answer:
          "Some systems report sizes using binary multiples while labeling them with SI-style names. This converter keeps the names distinct.",
      },
    ],
    inputFormats: ["Storage sizes"],
    outputFormats: ["Converted sizes"],
    examples: [
      {
        title: "1 KiB to bytes",
        input: "1 KiB",
        output: "1024 B",
        formula: "1 KiB = 1,024 bytes",
      },
      {
        title: "1 KB to bytes",
        input: "1 KB",
        output: "1000 B",
        formula: "1 KB = 1,000 bytes",
      },
    ],
  }),
  tool({
    id: "number-to-words",
    name: "Number to Words Converter",
    slug: "number-to-words",
    category: "calculators-converters",
    description:
      "Convert numbers into English words, including decimals as digit-by-digit “point” wording.",
    shortDescription: "Spell out numbers in English words.",
    icon: "calculator",
    keywords: [
      "number to words",
      "numbers to words converter",
      "spell out numbers",
      "amount in words",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Numbers", "Words"],
    relatedToolIds: [
      "percentage-calculator",
      "fraction-calculator",
      "average-calculator",
      "ratio-calculator",
    ],
    seoTitle: "Number to Words Converter — Spell Out Numbers | Tool Base",
    seoDescription:
      "Convert numbers to English words with Tool Base. Spell out whole numbers and decimals with a clear, predictable convention.",
    h1: "Number to Words Converter",
    intro:
      "Convert a number into English words. Decimals use a “Point” convention with each digit spoken separately.",
    convertHeading: "Convert Numbers to Words Online",
    howToHeading: "How to Convert a Number to Words",
    featuresHeading: "Number Wording Details",
    supportedFormatsHeading: "Supported Inputs",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Whole numbers up to 18 integer digits",
      "BigInt-based integer wording",
      "Decimal “Point” digit wording",
      "Negative numbers supported",
      "Copy the spelled result",
    ],
    howToSteps: sharedHowTo(
      "Enter a number",
      "Review the words",
      "Copy the result",
    ),
    faq: [
      {
        question: "How are decimals written?",
        answer:
          "After the integer words, the converter adds “Point” and then each decimal digit in words. Example: 125.50 → One Hundred Twenty-Five Point Five Zero.",
      },
      {
        question: "What is the size limit?",
        answer:
          "Integer parts are limited to 18 digits to keep wording practical and exact.",
      },
    ],
    inputFormats: ["Numbers"],
    outputFormats: ["English words"],
    examples: [
      {
        title: "Whole number",
        input: "125",
        output: "One Hundred Twenty-Five",
      },
      {
        title: "Decimal convention",
        input: "125.50",
        output: "One Hundred Twenty-Five Point Five Zero",
      },
    ],
  }),
  tool({
    id: "percentage-calculator",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "calculators-converters",
    description:
      "Calculate percent of a number, reverse percentages, and percentage increase or decrease.",
    shortDescription: "Calculate percentages and percent change.",
    icon: "calculator",
    keywords: [
      "percentage calculator",
      "calculate percentage",
      "percentage increase",
      "what percent is",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Numbers", "Percentages"],
    relatedToolIds: [
      "discount-calculator",
      "vat-tax-calculator",
      "tip-calculator",
      "ratio-calculator",
      "average-calculator",
    ],
    seoTitle: "Percentage Calculator — Calculate Percentages Online | Tool Base",
    seoDescription:
      "Calculate percentages, percentage changes, and common percentage problems quickly with Tool Base’s free online calculator.",
    h1: "Percentage Calculator",
    intro:
      "Solve common percentage problems: find X% of Y, reverse percentages, or measure percentage increase and decrease.",
    convertHeading: "Calculate Percentages Online",
    howToHeading: "How to Calculate a Percentage",
    featuresHeading: "Percentage Formula",
    supportedFormatsHeading: "Calculation Modes",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "What is X% of Y?",
      "X is what percent of Y?",
      "Percentage increase / decrease",
      "Live formula breakdown",
      "Copy results",
    ],
    howToSteps: [
      {
        title: "Enter your values",
        description: "Choose a mode and provide the numbers for that formula.",
      },
      {
        title: "Calculate the result",
        description: "The answer updates as you type.",
      },
      {
        title: "Review the formula",
        description: "See the exact steps using your values.",
      },
    ],
    faq: [
      {
        question: "How do I calculate X% of Y?",
        answer:
          "Result = (Percentage ÷ 100) × Number. Example: 20% of 150 = 30.",
      },
      {
        question: "How do I calculate percentage change?",
        answer:
          "((New Value − Original Value) ÷ Original Value) × 100. From 100 to 120 is a 20% increase.",
      },
    ],
    inputFormats: ["Numbers", "Percentages"],
    outputFormats: ["Percentage results"],
    examples: [
      {
        title: "What is 20% of 150?",
        input: "20% of 150",
        output: "30",
        formula: "(20 ÷ 100) × 150 = 30",
      },
      {
        title: "What percentage is 30 of 150?",
        input: "30 of 150",
        output: "20%",
        formula: "(30 ÷ 150) × 100 = 20%",
      },
      {
        title: "Percentage increase",
        input: "From 100 to 120",
        output: "20% increase",
        formula: "((120 − 100) ÷ 100) × 100 = 20%",
      },
    ],
  }),
  tool({
    id: "fraction-calculator",
    name: "Fraction Calculator",
    slug: "fraction-calculator",
    category: "calculators-converters",
    description:
      "Add, subtract, multiply, and divide fractions with exact integer arithmetic and automatic simplification.",
    shortDescription: "Add and simplify fractions.",
    icon: "calculator",
    keywords: [
      "fraction calculator",
      "add fractions",
      "fraction simplifier",
      "multiply fractions",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Fractions"],
    relatedToolIds: [
      "ratio-calculator",
      "percentage-calculator",
      "average-calculator",
      "number-to-words",
    ],
    seoTitle: "Fraction Calculator — Add, Multiply & Simplify | Tool Base",
    seoDescription:
      "Add, subtract, multiply, and divide fractions online with Tool Base. Results are simplified with exact integer arithmetic.",
    h1: "Fraction Calculator",
    intro:
      "Perform fraction arithmetic and get a reduced result plus an optional decimal. Denominators cannot be zero.",
    convertHeading: "Calculate Fractions Online",
    howToHeading: "How to Use the Fraction Calculator",
    featuresHeading: "Fraction Arithmetic",
    supportedFormatsHeading: "Supported Operations",
    relatedToolsHeading: "Related Math Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Addition, subtraction, multiplication, division",
      "Exact integer arithmetic",
      "Automatic GCD simplification",
      "Decimal companion result",
      "Division-by-zero protection",
    ],
    howToSteps: sharedHowTo(
      "Enter two fractions",
      "Choose an operation",
      "Review the simplified result",
    ),
    faq: [
      {
        question: "How is 1/2 + 1/4 simplified?",
        answer:
          "1/2 + 1/4 = 3/4 after finding a common denominator and reducing.",
      },
      {
        question: "Can denominators be zero?",
        answer: "No. The calculator rejects a zero denominator.",
      },
    ],
    inputFormats: ["Fractions"],
    outputFormats: ["Simplified fractions", "Decimals"],
    examples: [
      {
        title: "Addition",
        input: "1/2 + 1/4",
        output: "3/4",
        formula: "Common denominator 4 → 2/4 + 1/4 = 3/4",
      },
      {
        title: "Multiplication",
        input: "2/3 × 3/4",
        output: "1/2",
        formula: "(2×3)/(3×4) = 6/12 = 1/2",
      },
    ],
  }),
  tool({
    id: "average-calculator",
    name: "Average Calculator",
    slug: "average-calculator",
    category: "calculators-converters",
    description:
      "Calculate the mean of a list of numbers entered as comma-separated values or one number per line.",
    shortDescription: "Calculate the mean of a list.",
    icon: "calculator",
    keywords: [
      "average calculator",
      "mean calculator",
      "calculate average",
      "average of numbers",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Number lists"],
    relatedToolIds: [
      "percentage-calculator",
      "ratio-calculator",
      "fraction-calculator",
      "discount-calculator",
    ],
    seoTitle: "Average Calculator — Mean of a Number List | Tool Base",
    seoDescription:
      "Calculate the average (mean) of a list of numbers with Tool Base. Paste comma-separated values or one number per line.",
    h1: "Average Calculator",
    intro:
      "Find the arithmetic mean of your numbers. Empty entries are ignored — they are not treated as zeros.",
    convertHeading: "Calculate an Average Online",
    howToHeading: "How to Calculate an Average",
    featuresHeading: "Average Formula",
    supportedFormatsHeading: "Supported Input Formats",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Comma-separated or line-separated lists",
      "Shows count, sum, and average",
      "Empty entries ignored",
      "Live calculation",
      "Copy the mean",
    ],
    howToSteps: sharedHowTo(
      "Enter your numbers",
      "Review count and sum",
      "Copy the average",
    ),
    faq: [
      {
        question: "What formula is used?",
        answer: "Mean = Sum of values ÷ Number of values.",
      },
      {
        question: "Are blank lines counted?",
        answer: "No. Empty entries are skipped and are not treated as zero.",
      },
    ],
    inputFormats: ["Comma-separated numbers", "One number per line"],
    outputFormats: ["Average", "Sum", "Count"],
    examples: [
      {
        title: "Simple average",
        input: "10, 20, 30, 40",
        output: "25",
        formula: "(10 + 20 + 30 + 40) ÷ 4 = 25",
      },
      {
        title: "Three values",
        input: "10, 20, 30",
        output: "20",
        formula: "(10 + 20 + 30) ÷ 3 = 20",
      },
    ],
  }),
  tool({
    id: "ratio-calculator",
    name: "Ratio Calculator",
    slug: "ratio-calculator",
    category: "calculators-converters",
    description:
      "Simplify ratios and solve missing values in equivalent ratios using exact arithmetic.",
    shortDescription: "Simplify and solve ratios.",
    icon: "calculator",
    keywords: [
      "ratio calculator",
      "simplify ratio",
      "equivalent ratio",
      "solve ratio",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Ratios"],
    relatedToolIds: [
      "fraction-calculator",
      "percentage-calculator",
      "average-calculator",
      "discount-calculator",
    ],
    seoTitle: "Ratio Calculator — Simplify & Solve Ratios | Tool Base",
    seoDescription:
      "Simplify ratios and solve for missing values with Tool Base’s free online ratio calculator.",
    h1: "Ratio Calculator",
    intro:
      "Simplify a ratio to lowest terms or solve A:B = C:X for the missing value using exact arithmetic where practical.",
    convertHeading: "Calculate Ratios Online",
    howToHeading: "How to Use the Ratio Calculator",
    featuresHeading: "Ratio Modes",
    supportedFormatsHeading: "Supported Calculations",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Simplify ratios with GCD",
      "Solve missing-value ratios",
      "Exact integer simplification",
      "Clear mode separation",
      "Copy results",
    ],
    howToSteps: sharedHowTo(
      "Choose a mode",
      "Enter ratio terms",
      "Review the answer",
    ),
    faq: [
      {
        question: "How is 10:20 simplified?",
        answer: "Divide both terms by 10 to get 1:2.",
      },
      {
        question: "How do I solve 2:3 = 10:x?",
        answer: "X = (3 × 10) ÷ 2 = 15.",
      },
    ],
    inputFormats: ["Ratio terms"],
    outputFormats: ["Simplified ratios", "Missing values"],
    examples: [
      {
        title: "Simplify",
        input: "10:20",
        output: "1:2",
        formula: "Divide by GCD 10",
      },
      {
        title: "Solve missing value",
        input: "2:3 = 10:x",
        output: "x = 15",
        formula: "x = (3 × 10) ÷ 2",
      },
    ],
  }),
  tool({
    id: "discount-calculator",
    name: "Discount Calculator",
    slug: "discount-calculator",
    category: "calculators-converters",
    description:
      "Calculate discount amount and final price from an original price and discount percentage.",
    shortDescription: "Calculate sale price after discount.",
    icon: "calculator",
    keywords: [
      "discount calculator",
      "sale price calculator",
      "percent off calculator",
      "calculate discount",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Prices", "Percentages"],
    relatedToolIds: [
      "percentage-calculator",
      "vat-tax-calculator",
      "tip-calculator",
      "ratio-calculator",
    ],
    seoTitle: "Discount Calculator — Sale Price & Percent Off | Tool Base",
    seoDescription:
      "Calculate discount amount and final price online with Tool Base. Enter an original price and discount percentage.",
    h1: "Discount Calculator",
    intro:
      "Enter an original price and discount percentage to see the discount amount and final price. Tax is not mixed into the basic discount result.",
    convertHeading: "Calculate Discounts Online",
    howToHeading: "How to Calculate a Discount",
    featuresHeading: "Discount Formula",
    supportedFormatsHeading: "Inputs and Outputs",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Discount amount and final price",
      "Live breakdown with your values",
      "No tax mixed into basic mode",
      "Copy final price",
      "Reset inputs",
    ],
    howToSteps: sharedHowTo(
      "Enter original price",
      "Enter discount percent",
      "Review final price",
    ),
    faq: [
      {
        question: "How is the final price calculated?",
        answer:
          "Discount = Original × (Rate ÷ 100). Final = Original − Discount. Example: $100 at 20% off → $80.",
      },
      {
        question: "Does this include tax?",
        answer:
          "No. Use the VAT / Tax Calculator separately if you need tax math.",
      },
    ],
    inputFormats: ["Price", "Discount percentage"],
    outputFormats: ["Discount amount", "Final price"],
    examples: [
      {
        title: "20% off $100",
        input: "Price 100, Discount 20%",
        output: "Final 80 (discount 20)",
        formula: "100 × 0.20 = 20; 100 − 20 = 80",
      },
    ],
  }),
  tool({
    id: "vat-tax-calculator",
    name: "VAT & Tax Calculator",
    slug: "vat-tax-calculator",
    category: "calculators-converters",
    description:
      "Add tax to a price or extract tax from a tax-inclusive amount using a rate you provide.",
    shortDescription: "Add or remove VAT / tax mathematically.",
    icon: "calculator",
    keywords: [
      "vat calculator",
      "tax calculator",
      "add tax",
      "remove vat",
      "tax inclusive",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Prices", "Tax rates"],
    relatedToolIds: [
      "discount-calculator",
      "percentage-calculator",
      "tip-calculator",
      "average-calculator",
    ],
    seoTitle: "VAT & Tax Calculator — Add or Remove Tax | Tool Base",
    seoDescription:
      "Calculate tax-inclusive and tax-exclusive amounts with Tool Base’s general VAT / tax calculator. Enter any rate you need.",
    h1: "VAT & Tax Calculator",
    intro:
      "Perform general tax math: add tax to a net price, or extract the tax component from a tax-inclusive total. Enter the rate yourself — this is not country-specific tax advice.",
    convertHeading: "Calculate VAT / Tax Online",
    howToHeading: "How to Use the Tax Calculator",
    featuresHeading: "Tax Formulas",
    supportedFormatsHeading: "Calculation Modes",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Add tax mode",
      "Remove tax (inclusive) mode",
      "User-entered rate",
      "Clear formula breakdown",
      "General calculator disclaimer",
    ],
    howToSteps: sharedHowTo(
      "Choose add or remove",
      "Enter price and rate",
      "Review tax and total",
    ),
    faq: [
      {
        question: "Is this legal tax advice?",
        answer:
          "No. This calculator provides a general mathematical calculation. Tax rates and tax rules vary by location and situation.",
      },
      {
        question: "How do I remove tax from an inclusive price?",
        answer:
          "Tax component = Total × Rate ÷ (100 + Rate). Net = Total − Tax component.",
      },
    ],
    inputFormats: ["Price", "Tax rate"],
    outputFormats: ["Tax amount", "Net or total"],
    examples: [
      {
        title: "Add 15% tax to 100",
        input: "Price 100, Rate 15%",
        output: "Tax 15, Total 115",
        formula: "100 × 0.15 = 15; 100 + 15 = 115",
      },
      {
        title: "Remove 15% from inclusive 115",
        input: "Inclusive 115, Rate 15%",
        output: "Tax 15, Net 100",
        formula: "115 × 15 ÷ 115 = 15",
      },
    ],
  }),
  tool({
    id: "tip-calculator",
    name: "Tip Calculator",
    slug: "tip-calculator",
    category: "calculators-converters",
    description:
      "Calculate tip amount, total bill, and per-person shares from a bill, tip percentage, and party size.",
    shortDescription: "Split tips and bill totals.",
    icon: "calculator",
    keywords: [
      "tip calculator",
      "gratuity calculator",
      "split bill",
      "tip percentage",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Money", "Percentages"],
    relatedToolIds: [
      "percentage-calculator",
      "discount-calculator",
      "vat-tax-calculator",
      "average-calculator",
    ],
    seoTitle: "Tip Calculator — Tip Amount & Split Bill | Tool Base",
    seoDescription:
      "Calculate tip amount, total bill, and per-person shares with Tool Base’s free tip calculator. Choose any tip percentage.",
    h1: "Tip Calculator",
    intro:
      "Enter a bill amount, tip percentage, and number of people to see tip, total, and per-person amounts. Choose any tip rate — the tool does not prescribe a tipping norm.",
    convertHeading: "Calculate Tips Online",
    howToHeading: "How to Calculate a Tip",
    featuresHeading: "Tip Formula",
    supportedFormatsHeading: "Inputs and Outputs",
    relatedToolsHeading: "Related Calculator Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Tip amount and total bill",
      "Per-person tip and total",
      "Any tip percentage",
      "Party size greater than zero",
      "Live breakdown",
    ],
    howToSteps: sharedHowTo(
      "Enter bill and tip %",
      "Enter number of people",
      "Review shares",
    ),
    faq: [
      {
        question: "How is the tip calculated?",
        answer: "Tip = Bill × (Rate ÷ 100). Total = Bill + Tip.",
      },
      {
        question: "What tip percentage should I use?",
        answer:
          "That depends on your situation. Enter any percentage — this calculator only performs the math.",
      },
    ],
    inputFormats: ["Bill amount", "Tip percentage", "People"],
    outputFormats: ["Tip", "Total", "Per-person amounts"],
    examples: [
      {
        title: "15% tip split by 2",
        input: "Bill 100, Tip 15%, People 2",
        output: "Tip 15, Total 115, Per person 57.5",
        formula: "100 × 0.15 = 15; 115 ÷ 2 = 57.5",
      },
    ],
  }),
  tool({
    id: "date-difference-calculator",
    name: "Date Difference Calculator",
    slug: "date-difference-calculator",
    category: "calculators-converters",
    description:
      "Calculate the calendar difference between two dates in years, months, days, weeks, and total days.",
    shortDescription: "Find the difference between two dates.",
    icon: "calculator",
    keywords: [
      "date difference calculator",
      "days between dates",
      "date duration",
      "how many days between",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Dates"],
    relatedToolIds: [
      "age-calculator",
      "time-zone-converter",
      "time-converter",
      "unit-converter",
    ],
    seoTitle: "Date Difference Calculator — Days Between Dates | Tool Base",
    seoDescription:
      "Calculate the difference between two dates with Tool Base. See years, months, days, weeks, and total days with calendar-aware math.",
    h1: "Date Difference Calculator",
    intro:
      "Compare a start date and end date with calendar-aware years, months, and days. Optional inclusive mode adds one day to the total day count.",
    convertHeading: "Calculate Date Differences Online",
    howToHeading: "How Date Difference Works",
    featuresHeading: "Date Calculation Details",
    supportedFormatsHeading: "Supported Modes",
    relatedToolsHeading: "Related Date Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Years, months, and days",
      "Total days and weeks",
      "Inclusive day-count option",
      "Leap-year aware",
      "Explicit date controls",
    ],
    howToSteps: sharedHowTo(
      "Enter start date",
      "Enter end date",
      "Review the difference",
    ),
    faq: [
      {
        question: "Does every month count as 30 days?",
        answer:
          "No. Years/months/days use calendar-aware subtraction that respects different month lengths and leap years.",
      },
      {
        question: "What does inclusive mode do?",
        answer:
          "Inclusive mode adds one day to the total days count so both endpoints are counted in the span.",
      },
    ],
    inputFormats: ["Start date", "End date"],
    outputFormats: ["Years/months/days", "Total days"],
    examples: [
      {
        title: "Same calendar month",
        input: "2024-01-01 to 2024-01-31",
        output: "0 years, 0 months, 30 days (30 total days exclusive)",
        formula: "Calendar subtraction between the two dates",
      },
      {
        title: "Leap day span",
        input: "2024-02-28 to 2024-03-01",
        output: "0 years, 0 months, 2 days (2 total days)",
        description:
          "2024 is a leap year, so Feb 29 is included in the day count.",
      },
    ],
  }),
  tool({
    id: "age-calculator",
    name: "Age Calculator",
    slug: "age-calculator",
    category: "calculators-converters",
    description:
      "Calculate exact age in years, months, and days from a date of birth to a target date.",
    shortDescription: "Calculate exact calendar age.",
    icon: "calculator",
    keywords: [
      "age calculator",
      "calculate age",
      "exact age calculator",
      "date of birth age",
    ],
    popular: true,
    new: true,
    supportedFormats: ["Dates"],
    relatedToolIds: [
      "date-difference-calculator",
      "time-zone-converter",
      "unit-converter",
      "time-converter",
    ],
    seoTitle: "Age Calculator — Calculate Your Exact Age | Tool Base",
    seoDescription:
      "Calculate your age in years, months, and days using Tool Base’s calendar-aware age calculator.",
    h1: "Age Calculator",
    intro:
      "Enter a date of birth and an optional target date (defaults to today) to see age in years, months, and days — not a rough days÷365.25 estimate.",
    convertHeading: "Calculate Your Exact Age",
    howToHeading: "How the Age Calculator Works",
    featuresHeading: "Age Calculation",
    supportedFormatsHeading: "Inputs and Outputs",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Years, months, and days",
      "Total months, weeks, and days",
      "Calendar-aware leap years",
      "Feb 29 handled as March 1 in non-leap years",
      "Copy the age result",
    ],
    howToSteps: [
      {
        title: "Enter your date of birth",
        description: "Use the date control for an unambiguous calendar date.",
      },
      {
        title: "Choose a target date",
        description:
          "Defaults to today; change it for a historical or future age check.",
      },
      {
        title: "Review your age",
        description: "See years, months, days, and totals.",
      },
    ],
    faq: [
      {
        question: "How are leap-day birthdays handled?",
        answer:
          "If someone was born on February 29, anniversaries in non-leap years are treated as March 1 — a common civil convention.",
      },
      {
        question: "Is age just total days ÷ 365.25?",
        answer: "No. Age uses calendar-aware years, months, and days.",
      },
    ],
    inputFormats: ["Date of birth", "Target date"],
    outputFormats: ["Years/months/days", "Totals"],
    examples: [
      {
        title: "Simple age",
        input: "Birth 2000-01-15, Target 2018-05-27",
        output: "18 years, 4 months, 12 days",
        formula: "Calendar-aware subtraction",
      },
    ],
  }),
  tool({
    id: "time-zone-converter",
    name: "Time Zone Converter",
    slug: "time-zone-converter",
    category: "calculators-converters",
    description:
      "Convert a date and time between IANA time zones, accounting for platform timezone and daylight-saving rules.",
    shortDescription: "Convert date/time between time zones.",
    icon: "calculator",
    keywords: [
      "time zone converter",
      "timezone converter",
      "convert time zones",
      "iana timezone",
    ],
    popular: true,
    new: true,
    supportedFormats: ["Date", "Time", "IANA time zones"],
    relatedToolIds: [
      "time-converter",
      "date-difference-calculator",
      "age-calculator",
      "unit-converter",
    ],
    seoTitle: "Time Zone Converter — Convert Time Between Zones | Tool Base",
    seoDescription:
      "Convert a date and time between time zones with Tool Base. Compare local times while accounting for timezone rules where supported.",
    h1: "Time Zone Converter",
    intro:
      "Pick a date, time, and IANA time zones such as Asia/Karachi or America/New_York. Conversion uses platform timezone data — not hardcoded fixed offsets — so daylight saving is handled where supported.",
    convertHeading: "Convert Time Between Zones",
    howToHeading: "How Time Zone Conversion Works",
    featuresHeading: "Timezone Conversion Details",
    supportedFormatsHeading: "Supported Time Zones",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "IANA time zone identifiers",
      "Searchable timezone selector",
      "DST-aware where the platform supports it",
      "Date rollover shown clearly",
      "UTC reference in details",
    ],
    howToSteps: sharedHowTo(
      "Enter date and time",
      "Search and select zones",
      "Review converted local time",
    ),
    faq: [
      {
        question: "Why not use fixed offsets like UTC−5?",
        answer:
          "Fixed offsets fail when daylight saving changes. IANA zones such as America/New_York carry the rules your platform supports.",
      },
      {
        question: "Can the date change after conversion?",
        answer:
          "Yes. A late evening time in one zone can become the next calendar day in another.",
      },
      {
        question: "What if a local time falls in a DST gap?",
        answer:
          "Some wall-clock times do not exist during spring-forward transitions. The tool reports that clearly instead of guessing.",
      },
    ],
    inputFormats: ["Date", "Time", "From/to time zones"],
    outputFormats: ["Converted local date/time"],
    examples: [
      {
        title: "Searchable zones",
        description:
          "Search Karachi, London, New York, Tokyo, or Dubai to find matching IANA identifiers.",
      },
      {
        title: "DST-aware conversion",
        description:
          "Conversions use platform timezone rules rather than a manually hardcoded offset list.",
      },
    ],
  }),
];
