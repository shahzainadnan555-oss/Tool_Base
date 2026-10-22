/**
 * Maps public tool slugs to explanatory blog guides.
 * Used for tool-page guide links and category hub related-guide sections.
 */
export interface ToolGuideLink {
  href: string;
  label: string;
  text: string;
}

const GUIDE_BY_TOOL: Record<string, ToolGuideLink> = {
  "volume-calculator": {
    href: "/blogs/volume-calculator-guide",
    label: "Learn how volume works and how to calculate it.",
    text: "New to volume?",
  },
  "area-calculator": {
    href: "/blogs/volume-calculator-guide",
    label: "See how volume differs from area.",
    text: "Comparing area and volume?",
  },
  "surface-area-calculator": {
    href: "/blogs/volume-calculator-guide",
    label: "Read the volume guide for related 3D formulas.",
    text: "Working with 3D shapes?",
  },
  "circle-calculator": {
    href: "/blogs/volume-calculator-guide",
    label: "See how circle measurements feed cylinder and cone volume.",
    text: "Need circle basics first?",
  },
  "distance-calculator": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "Learn what this distance calculator measures.",
    text: "New to distance math?",
  },
  "mileage-calculator": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "Learn how trip mileage and fuel economy differ.",
    text: "Planning trip totals?",
  },
  "gas-mileage-calculator": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "Learn MPG and L/100km with clear examples.",
    text: "Checking fuel economy?",
  },
  "fuel-cost-calculator": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "Connect trip distance with fuel cost estimates.",
    text: "Estimating travel fuel cost?",
  },
  "speed-calculator": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "See how distance and time relate to speed.",
    text: "Working with speed?",
  },
  "length-converter": {
    href: "/blogs/distance-and-mileage-calculator-guide",
    label: "Convert kilometres and miles before trip math.",
    text: "Need matching distance units?",
  },
  "mortgage-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Learn how mortgage payment estimates work.",
    text: "New to mortgage math?",
  },
  "personal-loan-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "See how personal loan payments are estimated.",
    text: "Comparing personal loan terms?",
  },
  "interest-rate-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Learn how to solve for an interest rate.",
    text: "Working backwards from a payment?",
  },
  "401k-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Understand 401(k) growth assumptions.",
    text: "Exploring retirement savings?",
  },
  "roth-ira-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Learn what a Roth IRA projection can show.",
    text: "Comparing retirement accounts?",
  },
  "loan-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Read the financial calculators guide.",
    text: "Want a broader loan overview?",
  },
  "amortization-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "See how amortization relates to mortgages and loans.",
    text: "Reading a payment schedule?",
  },
  "retirement-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Compare retirement savings calculators.",
    text: "Planning retirement savings?",
  },
  "ira-calculator": {
    href: "/blogs/financial-calculators-guide",
    label: "Compare IRA and Roth IRA projections.",
    text: "Looking at IRA growth?",
  },
  "factor-calculator": {
    href: "/blogs/factor-and-molecular-weight-calculator-guide",
    label: "Learn how factors work with school examples.",
    text: "New to factors?",
  },
  "molecular-weight-calculator": {
    href: "/blogs/factor-and-molecular-weight-calculator-guide",
    label: "Learn how molecular weight is estimated here.",
    text: "Studying chemistry formulas?",
  },
  "prime-factorization-calculator": {
    href: "/blogs/factor-and-molecular-weight-calculator-guide",
    label: "See how factors relate to prime factorization.",
    text: "Breaking numbers into primes?",
  },
  "greatest-common-factor-calculator": {
    href: "/blogs/factor-and-molecular-weight-calculator-guide",
    label: "Review factor basics before GCF problems.",
    text: "Finding a greatest common factor?",
  },
  "molarity-calculator": {
    href: "/blogs/factor-and-molecular-weight-calculator-guide",
    label: "Connect molar mass with solution concentration.",
    text: "Working on chemistry solutions?",
  },
  "jpg-to-png": {
    href: "/blogs/image-conversion-and-optimization-guide",
    label: "Read the image conversion guide.",
    text: "Choosing an image format?",
  },
  "image-compressor": {
    href: "/blogs/image-conversion-and-optimization-guide",
    label: "Learn when to compress images.",
    text: "Need smaller image files?",
  },
  "pdf-compressor": {
    href: "/blogs/pdf-tools-guide",
    label: "Read the PDF tools guide.",
    text: "Working with PDF files?",
  },
  "pdf-merger": {
    href: "/blogs/pdf-tools-guide",
    label: "See common PDF workflows.",
    text: "Combining PDF pages?",
  },
};

export function getGuideForToolSlug(slug: string): ToolGuideLink | undefined {
  return GUIDE_BY_TOOL[slug];
}

export interface CategoryGuideLink {
  href: string;
  title: string;
  description: string;
}

const GUIDES_BY_CATEGORY: Record<string, CategoryGuideLink[]> = {
  "calculators-converters": [
    {
      href: "/blogs/distance-and-mileage-calculator-guide",
      title: "Distance and mileage calculator guide",
      description: "Point distance, trip totals, and fuel economy explained.",
    },
    {
      href: "/blogs/financial-calculators-guide",
      title: "Financial calculators guide",
      description: "Mortgage, loans, interest rate, 401(k), and Roth IRA.",
    },
    {
      href: "/blogs/factor-and-molecular-weight-calculator-guide",
      title: "Factor and molecular weight guide",
      description: "School math factors and simple chemistry molar mass.",
    },
    {
      href: "/blogs/volume-calculator-guide",
      title: "Volume calculator guide",
      description: "Box, sphere, cylinder, and cone volume in plain language.",
    },
    {
      href: "/blogs/calculators-and-converters-guide",
      title: "Everyday calculators and converters",
      description: "Units, percentages, dates, and common conversion tips.",
    },
  ],
  "specialized-calculators": [
    {
      href: "/blogs/financial-calculators-guide",
      title: "Financial calculators guide",
      description: "Borrowing and retirement estimates in clear sections.",
    },
    {
      href: "/blogs/calculators-and-converters-guide",
      title: "Everyday calculators guide",
      description: "How Tool Base calculator pages are meant to be used.",
    },
  ],
  "image-tools": [
    {
      href: "/blogs/image-conversion-and-optimization-guide",
      title: "Image conversion and optimization",
      description: "Formats, compression, and common image workflows.",
    },
  ],
  "pdf-tools": [
    {
      href: "/blogs/pdf-tools-guide",
      title: "PDF tools guide",
      description: "Compress, merge, split, and convert PDF files.",
    },
  ],
  "video-tools": [
    {
      href: "/blogs/video-audio-conversion-guide",
      title: "Video and audio conversion guide",
      description: "Common media conversion jobs explained.",
    },
  ],
  "audio-tools": [
    {
      href: "/blogs/video-audio-conversion-guide",
      title: "Video and audio conversion guide",
      description: "Audio formats and conversion tips.",
    },
  ],
  "developer-tools": [
    {
      href: "/blogs/developer-and-text-tools-guide",
      title: "Developer and text tools guide",
      description: "JSON, encoding, formatting, and text helpers.",
    },
  ],
  "text-tools": [
    {
      href: "/blogs/developer-and-text-tools-guide",
      title: "Developer and text tools guide",
      description: "Counting, cleaning, and transforming text.",
    },
  ],
  "document-data-tools": [
    {
      href: "/blogs/online-file-and-data-tools-guide",
      title: "File and data tools guide",
      description: "Documents, structured data, and related converters.",
    },
  ],
};

export function getGuidesForCategory(categoryId: string): CategoryGuideLink[] {
  return GUIDES_BY_CATEGORY[categoryId] ?? [];
}
