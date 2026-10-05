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
  descriptions: [string, string, string],
): ToolDefinition["howToSteps"] => [
  { title: a, description: descriptions[0] },
  { title: b, description: descriptions[1] },
  { title: c, description: descriptions[2] },
];

const apDisclaimer =
  "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.";

export const specializedCalculatorTools: ToolDefinition[] = [
  tool({
    id: "totaled-car-value-calculator",
    name: "Totaled Car Value Calculator",
    slug: "totaled-car-value-calculator",
    category: "specialized-calculators",
    subcategory: "Auto & Insurance",
    tags: ["Auto", "Insurance", "Vehicle Value", "Car Calculators"],
    exactPrimaryKeyword: "totaled car value calculator",
    aliases: ["totaled car calculator", "total loss car value"],
    description:
      "Estimate a potential insurance settlement for a totaled vehicle using your actual cash value estimate, deductible, and optional adjustments.",
    shortDescription: "Estimate totaled-car settlement value.",
    icon: "calculator",
    keywords: [
      "totaled car value calculator",
      "totaled car",
      "total loss settlement",
      "actual cash value",
      "car insurance estimate",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Currency amounts"],
    relatedToolIds: ["percentage-calculator", "average-calculator"],
    seoTitle: "Totaled Car Value Calculator — Estimate Your Settlement | Tool Base",
    seoDescription:
      "Estimate the potential value of a totaled vehicle using your vehicle value, deductible, and other relevant inputs with Tool Base.",
    h1: "Totaled Car Value Calculator",
    intro:
      "Use this totaled car value calculator to sketch an estimated settlement from the actual cash value you enter, minus the deductible, plus or minus any adjustments you add. Insurers set payouts from market comps, policy terms, and salvage rules — so the figure here is an estimate, not a guaranteed insurance payout.",
    convertHeading: "Estimate the Value of a Totaled Car",
    howToHeading: "How the Totaled Car Value Calculator Works",
    featuresHeading: "Factors That Can Affect a Total-Loss Settlement",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Live estimate from vehicle value minus deductible",
      "Optional taxes, fees, and other policy adjustments",
      "Optional salvage deduction if you keep the vehicle",
      "Currency selector so amounts are not locked to one country",
      "Transparent formula shown with your numbers",
    ],
    howToSteps: sharedHowTo(
      "Enter Your Vehicle Value",
      "Enter Your Deductible",
      "Review Your Estimated Settlement",
      [
        "Enter the pre-loss or actual cash value estimate you want to model.",
        "Enter the collision or comprehensive deductible from your policy.",
        "Review estimated value, then add salvage or other adjustments if they apply.",
      ],
    ),
    faq: [
      {
        question: "How is the value of a totaled car estimated?",
        answer:
          "This tool subtracts the deductible from the vehicle value you enter, then applies any additions, deductions, or salvage you provide. Insurers typically start from actual cash value (market value immediately before the loss), which can differ from what you paid for the car.",
      },
      {
        question: "Does the deductible reduce the settlement?",
        answer:
          "In a typical total-loss claim, the deductible is subtracted from the vehicle’s actual cash value. Your policy and jurisdiction can change that treatment.",
      },
      {
        question: "Is this an official insurance settlement?",
        answer:
          "No. Actual settlements depend on comparable vehicles, taxes and fees, salvage retention, coverage limits, and the insurer’s valuation method.",
      },
    ],
    inputFormats: ["Vehicle value", "Deductible", "Optional adjustments"],
    outputFormats: ["Estimated settlement"],
    examples: [
      {
        title: "Value minus deductible",
        description: "Static worked example — not your live result.",
        input: "Vehicle value 20,000; deductible 1,000; no extra adjustments",
        output: "Estimated settlement 19,000",
        formula: "20,000 − 1,000 = 19,000",
      },
    ],
  }),
  tool({
    id: "capital-gains-tax-calculator-on-sale-of-property",
    name: "Capital Gains Tax Calculator on Sale of Property",
    slug: "capital-gains-tax-calculator-on-sale-of-property",
    category: "specialized-calculators",
    subcategory: "Property & Tax",
    tags: ["Tax", "Real Estate", "Property", "Finance"],
    exactPrimaryKeyword: "capital gains tax calculator on sale of property",
    aliases: ["property capital gains calculator", "home sale capital gains"],
    description:
      "Estimate capital gains tax on a property sale from purchase basis, sale price, selling costs, exemptions you enter, and a tax rate you choose.",
    shortDescription: "Estimate property sale capital gains tax.",
    icon: "calculator",
    keywords: [
      "capital gains tax calculator on sale of property",
      "capital gains tax",
      "property sale tax",
      "adjusted basis",
      "real estate capital gain",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Currency amounts", "Tax rate %"],
    relatedToolIds: ["percentage-calculator", "vat-tax-calculator"],
    seoTitle: "Capital Gains Tax Calculator on Sale of Property | Tool Base",
    seoDescription:
      "Estimate capital gains tax on a property sale using your sale price, basis, selling costs, tax rate, and applicable assumptions.",
    h1: "Capital Gains Tax Calculator on Sale of Property",
    intro:
      "This capital gains tax calculator on sale of property is a capital gains tax estimate driven by the jurisdiction notes, tax year, and tax rate you enter. Tool Base does not apply a hidden national tax table. Adjusted basis, net proceeds, estimated capital gain, taxable gain, and estimated tax are listed separately so you can see which figure is which.",
    convertHeading: "Capital Gains Tax Estimate",
    howToHeading: "How the Capital Gains Tax Calculator on Sale of Property Works",
    featuresHeading: "What You Control in This Estimate",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Jurisdiction and tax year fields for your own records",
      "Adjusted basis from purchase price plus eligible costs you enter",
      "Net sale proceeds after selling costs",
      "Optional exemption so the full gain is not assumed taxable",
      "User-entered tax rate — no invented statutory table",
    ],
    howToSteps: sharedHowTo(
      "Enter Basis and Sale Price",
      "Enter Costs, Exemption, and Tax Rate",
      "Review Gain and Estimated Tax",
      [
        "Record purchase basis, sale price, and optional improvements or acquisition costs.",
        "Subtract selling costs and apply an exemption only if you qualify under your local rules.",
        "Enter the rate that applies in your jurisdiction and review estimated tax — not an official liability.",
      ],
    ),
    faq: [
      {
        question: "How is a capital gain calculated when selling property?",
        answer:
          "Net sale proceeds equal sale price minus eligible selling costs. Adjusted basis equals purchase basis plus eligible improvements and acquisition costs you enter. Capital gain equals net proceeds minus adjusted basis.",
      },
      {
        question: "Does the calculator know my local tax rules?",
        answer:
          "No. Tax rules vary by jurisdiction and tax year. You enter the rate and any exemption that applies to you. This is not professional tax advice.",
      },
      {
        question: "Is the estimated tax an official tax liability?",
        answer:
          "No. Estimated tax is taxable gain multiplied by the rate you selected. Filing software, a tax professional, or your tax authority determines the official amount.",
      },
    ],
    inputFormats: ["Purchase basis", "Sale price", "Costs", "Tax rate"],
    outputFormats: ["Estimated capital gain", "Estimated tax"],
    examples: [
      {
        title: "Gain before tax",
        description: "Static worked example — not your live result.",
        input: "Sale 500,000; selling costs 20,000; adjusted basis 300,000",
        output: "Capital gain 180,000 before exemptions and tax",
        formula: "(500,000 − 20,000) − 300,000 = 180,000",
      },
    ],
  }),
  tool({
    id: "middle-school-gpa-calculator",
    name: "Middle School GPA Calculator",
    slug: "middle-school-gpa-calculator",
    category: "specialized-calculators",
    subcategory: "Education",
    tags: ["Education", "GPA", "School", "Grades"],
    exactPrimaryKeyword: "middle school gpa calculator",
    aliases: ["ms gpa calculator", "junior high gpa"],
    description:
      "Calculate a middle school GPA from course grades and a grading scale you can edit, with optional credit weighting.",
    shortDescription: "Calculate middle school GPA with a custom scale.",
    icon: "calculator",
    keywords: [
      "middle school gpa calculator",
      "middle school gpa",
      "gpa calculator",
      "grading scale",
      "unweighted gpa",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Letter grades", "Grade points"],
    relatedToolIds: ["average-calculator", "percentage-calculator"],
    seoTitle: "Middle School GPA Calculator — Calculate GPA Online | Tool Base",
    seoDescription:
      "Calculate a middle school GPA using your grades and a customizable grading scale.",
    h1: "Middle School GPA Calculator",
    intro:
      "This middle school gpa calculator averages grade points from the courses you list. Schools do not share one scale, so the default A = 4, B = 3, C = 2, D = 1, F = 0 can be edited. Weighted mode is optional and stays off unless your school uses credits.",
    convertHeading: "Calculate a Middle School GPA",
    howToHeading: "How the Middle School GPA Calculator Works",
    featuresHeading: "Grading-Scale Flexibility",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Education Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Default 4.0 letter scale you can rewrite",
      "Add and remove courses",
      "Optional credits for weighted GPA",
      "Unweighted average when weights are off",
      "Result labeled as an estimate for the scale you selected",
    ],
    howToSteps: sharedHowTo(
      "Set the Grading Scale",
      "Enter Courses and Grades",
      "Review Estimated GPA",
      [
        "Confirm or edit points for each letter grade your school uses.",
        "List course names and grades. Turn on credits only if your school weights courses.",
        "Read estimated GPA based on your selected grading scale.",
      ],
    ),
    faq: [
      {
        question: "Can I use a custom grading scale?",
        answer:
          "Yes. Edit the scale lines (for example A = 4). Plus/minus letters work if you add them to the scale.",
      },
      {
        question: "Is middle-school GPA the same everywhere?",
        answer:
          "No. Districts differ on plus/minus grades, specials, and whether GPA is even reported. Match the scale to your report card.",
      },
      {
        question: "When should I use weights?",
        answer:
          "Only if your school assigns credits or extra weight. Otherwise leave weighting off so GPA is the simple average of course grade points.",
      },
    ],
    inputFormats: ["Course grades", "Optional credits"],
    outputFormats: ["Estimated GPA"],
    examples: [
      {
        title: "Unweighted 4.0 example",
        description: "Static worked example — not your live result.",
        input: "A, B, A, A on A=4, B=3, C=2, D=1, F=0",
        output: "3.75",
        formula: "(4 + 3 + 4 + 4) ÷ 4 = 3.75",
      },
    ],
  }),
  tool({
    id: "ap-chem-score-calculator",
    name: "AP Chem Score Calculator",
    slug: "ap-chem-score-calculator",
    category: "specialized-calculators",
    subcategory: "Education",
    tags: ["Education", "AP Exams", "Chemistry"],
    exactPrimaryKeyword: "ap chem score calculator",
    aliases: ["ap chemistry score calculator", "ap chem predictor"],
    description:
      "Estimate an AP Chemistry score from multiple-choice and free-response performance using the selected exam year’s published structure.",
    shortDescription: "Estimate an AP Chemistry score.",
    icon: "calculator",
    keywords: [
      "ap chem score calculator",
      "ap chemistry score",
      "ap chem mcq",
      "ap chemistry frq",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Section scores"],
    relatedToolIds: [
      "average-calculator",
      "percentage-calculator",
      "ap-bio-score-calculator",
      "ap-calc-bc-score-calculator",
    ],
    seoTitle: "AP Chem Score Calculator — Estimate Your AP Score | Tool Base",
    seoDescription:
      "Estimate an AP Chemistry score using your multiple-choice and free-response performance.",
    h1: "AP Chem Score Calculator",
    intro:
      "This ap chem score calculator weights multiple-choice and free-response work using College Board’s published AP Chemistry exam structure for the year you select. The 1–5 output is an estimated AP score range, not an official College Board result. Cut scores change with equating and are not treated as a public lookup table here.",
    convertHeading: "Estimate Your AP Chemistry Score",
    howToHeading: "How the AP Chem Score Calculator Works",
    featuresHeading: "About AP Chemistry Scoring",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Education Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Year-aware section counts and 50/50 weighting from AP Central",
      "Defaults for 60 multiple-choice questions and 46 free-response points (2026 structure)",
      "Composite from section percentages × published weights",
      "Illustrative 1–5 ranges, not claimed cut scores",
      apDisclaimer,
    ],
    howToSteps: sharedHowTo(
      "Enter Multiple-Choice Performance",
      "Enter Free-Response Points",
      "Review Your Estimated Score",
      [
        "Enter how many multiple-choice questions you believe you answered correctly.",
        "Enter free-response points earned against the published maximum for that year.",
        "Read the weighted composite and estimated AP score range. Official scores come only from College Board.",
      ],
    ),
    faq: [
      {
        question: "Are AP score estimates official?",
        answer:
          "No. Official AP results are determined by College Board. This tool estimates a composite from the published section structure and maps it to an illustrative range.",
      },
      {
        question: "What AP Chemistry structure is used?",
        answer:
          "For the 2026 configuration, College Board describes 60 multiple-choice questions (50%) and 7 free-response questions totaling 46 points (50%). Select another year only when a verified configuration exists.",
      },
      {
        question: "Will a high composite definitely be a 5?",
        answer:
          "No. Do not treat an estimate as a guaranteed 5. Annual equating can move the boundary between scores.",
      },
    ],
    inputFormats: ["MCQ correct", "FRQ points", "Exam year"],
    outputFormats: ["Weighted composite", "Estimated AP score range"],
    examples: [
      {
        title: "Perfect sections",
        description: "Static illustration of composite math — not an official 5.",
        input: "60/60 MCQ and 46/46 FRQ on the 2026 50/50 structure",
        output: "Composite 100; estimated range 4–5 (illustrative)",
        formula: "(60/60)×50 + (46/46)×50 = 100",
      },
    ],
  }),
  tool({
    id: "ap-bio-score-calculator",
    name: "AP Bio Score Calculator",
    slug: "ap-bio-score-calculator",
    category: "specialized-calculators",
    subcategory: "Education",
    tags: ["Education", "AP Exams", "Biology"],
    exactPrimaryKeyword: "ap bio score calculator",
    aliases: ["ap biology score calculator", "ap bio predictor"],
    description:
      "Estimate an AP Biology score from multiple-choice and free-response performance using the selected exam year’s published 50/50 structure.",
    shortDescription: "Estimate an AP Biology score.",
    icon: "calculator",
    keywords: [
      "ap bio score calculator",
      "ap biology score",
      "ap bio frq",
      "ap biology mcq",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Section scores"],
    relatedToolIds: [
      "average-calculator",
      "percentage-calculator",
      "ap-chem-score-calculator",
      "ap-lit-score-calculator",
    ],
    seoTitle: "AP Bio Score Calculator — Estimate Your AP Score | Tool Base",
    seoDescription:
      "Estimate an AP Biology score using your multiple-choice and free-response performance.",
    h1: "AP Bio Score Calculator",
    intro:
      "This ap bio score calculator uses College Board’s current AP Biology description of a 50/50 multiple-choice and free-response exam. Enter section performance, review the weighted composite, then read an estimated AP score range. It is not a promise of the score College Board will report.",
    convertHeading: "Estimate Your AP Biology Score",
    howToHeading: "How the AP Bio Score Calculator Works",
    featuresHeading: "About AP Biology Scoring",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Education Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "60 multiple-choice questions at 50% of the score (2026 structure)",
      "6 free-response questions totaling 34 points at 50%",
      "Shared APScoreCalculatorEngine with other AP tools",
      "Estimated range rather than a false exact 1–5",
      apDisclaimer,
    ],
    howToSteps: sharedHowTo(
      "Enter Multiple-Choice Performance",
      "Enter Free-Response Points",
      "Review Your Estimated Score",
      [
        "Enter correct multiple-choice answers out of the year’s published total.",
        "Enter free-response points out of the published maximum.",
        "Compare raw section percentages, the composite, and the estimated range.",
      ],
    ),
    faq: [
      {
        question: "Are AP score estimates official?",
        answer:
          "No. College Board determines official AP Biology scores. This calculator only estimates from the published structure.",
      },
      {
        question: "Is AP Biology still 50/50?",
        answer:
          "College Board currently describes AP Biology as 50% multiple-choice and 50% free-response. If that changes, the year configuration should be updated rather than guessed on the page.",
      },
      {
        question: "Can I enter more points than the maximum?",
        answer:
          "No. Values above the published maximum or below zero are rejected with a validation message.",
      },
    ],
    inputFormats: ["MCQ correct", "FRQ points", "Exam year"],
    outputFormats: ["Weighted composite", "Estimated AP score range"],
    examples: [
      {
        title: "Mid-range composite",
        description: "Static illustration — not a predicted official score.",
        input: "36/60 MCQ and 20/34 FRQ on 50/50 weights",
        output: "Composite 59.4; estimated range 3–4 (illustrative)",
        formula: "(36/60)×50 + (20/34)×50 ≈ 30 + 29.4 = 59.4",
      },
    ],
  }),
  tool({
    id: "ap-calc-bc-score-calculator",
    name: "AP Calc BC Score Calculator",
    slug: "ap-calc-bc-score-calculator",
    category: "specialized-calculators",
    subcategory: "Education",
    tags: ["Education", "AP Exams", "Calculus"],
    exactPrimaryKeyword: "ap calc bc score calculator",
    aliases: ["ap calculus bc score calculator", "ap bc predictor"],
    description:
      "Estimate an AP Calculus BC score from section performance using year-specific College Board exam structure, including the 2026 and 2027 multiple-choice counts.",
    shortDescription: "Estimate an AP Calculus BC score.",
    icon: "calculator",
    keywords: [
      "ap calc bc score calculator",
      "ap calculus bc score",
      "ap bc frq",
      "ap calc bc mcq",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Section scores"],
    relatedToolIds: [
      "average-calculator",
      "percentage-calculator",
      "ap-chem-score-calculator",
      "ap-lit-score-calculator",
    ],
    seoTitle: "AP Calc BC Score Calculator — Estimate Your AP Score | Tool Base",
    seoDescription:
      "Estimate an AP Calculus BC score using your multiple-choice and free-response performance.",
    h1: "AP Calc BC Score Calculator",
    intro:
      "This ap calc bc score calculator follows College Board’s published AP Calculus BC format for the exam year you pick. May 2026 uses 45 multiple-choice questions; College Board has announced 42 multiple-choice questions beginning May 2027. Free-response remains six questions. The 1–5 figure is estimated, not official.",
    convertHeading: "Estimate Your AP Calculus BC Score",
    howToHeading: "How the AP Calc BC Score Calculator Works",
    featuresHeading: "About AP Calculus BC Scoring",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Education Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "2026 configuration: 45 multiple-choice questions, 50% of the score",
      "2027 configuration: 42 multiple-choice questions, 50% of the score",
      "Six free-response questions, typically 9 points each (54 point maximum)",
      "Year selector so older unverified years are not invented",
      apDisclaimer,
    ],
    howToSteps: sharedHowTo(
      "Enter Multiple-Choice Performance",
      "Enter Free-Response Points",
      "Review Your Estimated Score",
      [
        "Choose 2026 or 2027 so the multiple-choice maximum matches that year’s format.",
        "Enter FRQ points up to the published maximum for six questions.",
        "Review composite performance and an estimated AP score range.",
      ],
    ),
    faq: [
      {
        question: "Are AP score estimates official?",
        answer:
          "No. College Board scores AP Calculus BC. This page estimates a composite from the selected year’s structure.",
      },
      {
        question: "Why does the multiple-choice total change by year?",
        answer:
          "College Board published a 45-question multiple-choice format for May 2026 exams and a 42-question format starting May 2027. Pick the year that matches the exam you sat.",
      },
      {
        question: "What if my year is not listed?",
        answer:
          "Choose “Older year (not listed).” The calculator will not invent a scoring model.",
      },
    ],
    inputFormats: ["MCQ correct", "FRQ points", "Exam year"],
    outputFormats: ["Weighted composite", "Estimated AP score range"],
    examples: [
      {
        title: "2026 all-correct composite",
        description: "Static illustration of weighting — not an official College Board 5.",
        input: "45/45 MCQ and 54/54 FRQ (2026)",
        output: "Composite 100; estimated range 4–5 (illustrative)",
        formula: "(45/45)×50 + (54/54)×50 = 100",
      },
    ],
  }),
  tool({
    id: "retirement-calculator-dave-ramsey",
    name: "Retirement Calculator — Dave Ramsey-Style",
    slug: "retirement-calculator-dave-ramsey",
    category: "specialized-calculators",
    subcategory: "Retirement & Finance",
    tags: ["Retirement", "Finance", "Investing", "Savings"],
    exactPrimaryKeyword: "retirement calculator dave ramsey",
    aliases: ["dave ramsey style retirement calculator", "compound growth retirement"],
    description:
      "Project retirement savings from current age, contributions, assumed return, and inflation using standard compound-growth math. Independent of Dave Ramsey.",
    shortDescription: "Project retirement savings with user assumptions.",
    icon: "calculator",
    keywords: [
      "retirement calculator dave ramsey",
      "retirement calculator",
      "compound growth",
      "future value annuity",
      "retirement savings estimate",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Ages", "Currency", "Percent rates"],
    relatedToolIds: ["percentage-calculator", "average-calculator"],
    seoTitle: "Retirement Calculator — Dave Ramsey-Style Estimate | Tool Base",
    seoDescription:
      "Estimate future retirement savings using age, contributions, return assumptions, and retirement goals.",
    h1: "Retirement Calculator — Dave Ramsey-Style",
    intro:
      "Searchers looking for a retirement calculator dave ramsey often want a simple savings projection. This page is a Retirement Calculator — Dave Ramsey-Style Estimate: an independent Tool Base calculator and is not affiliated with or endorsed by Dave Ramsey. You choose ages, contributions, return, and inflation. Results are projected, not guaranteed.",
    convertHeading: "Retirement Calculator — Dave Ramsey-Style Estimate",
    howToHeading: "How This Retirement Projection Works",
    featuresHeading: "Assumptions You Should Review",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Future value of current savings plus a contribution annuity",
      "Optional employer match applied to annual contributions",
      "Inflation-adjusted return shown as an assumption, not a promise",
      "Optional 4% withdrawal illustration after retirement",
      "No copied Dave Ramsey branding, products, or proprietary content",
    ],
    howToSteps: sharedHowTo(
      "Enter Ages and Savings",
      "Enter Contributions and Return",
      "Review the Projection",
      [
        "Set current age, retirement age, and current savings.",
        "Enter an annual contribution (or income plus contribution percent), assumed return, inflation, and optional match.",
        "Read projected savings, total contributions, and estimated investment growth. None of these are guaranteed.",
      ],
    ),
    faq: [
      {
        question: "Is this an official Dave Ramsey calculator?",
        answer:
          "No. This is an independent Tool Base calculator and is not affiliated with or endorsed by Dave Ramsey.",
      },
      {
        question: "Can investment returns be guaranteed?",
        answer:
          "No. The return and inflation figures are assumptions you type. Markets can differ, sometimes substantially.",
      },
      {
        question: "How are contributions compounded?",
        answer:
          "Current savings grow as PV × (1 + r)^n. Periodic contributions use the ordinary annuity future-value formula. A zero return is treated as simple addition.",
      },
    ],
    inputFormats: ["Age", "Savings", "Contribution", "Return %"],
    outputFormats: ["Projected savings"],
    examples: [
      {
        title: "Thirty-year contribution plan",
        description: "Static worked example — not a promised balance.",
        input: "Age 30 to 60; 10,000 saved; 6,000 per year; 7% return",
        output: "About 642,887 projected (before inflation adjustment of the balance)",
        formula:
          "10,000 × 1.07^30 + 6,000 × ((1.07^30 − 1) / 0.07)",
      },
    ],
  }),
  tool({
    id: "tree-removal-cost-calculator",
    name: "Tree Removal Cost Calculator",
    slug: "tree-removal-cost-calculator",
    category: "specialized-calculators",
    subcategory: "Home Services",
    tags: ["Home Services", "Property", "Cost Estimator", "Landscaping"],
    exactPrimaryKeyword: "tree removal cost calculator",
    aliases: ["tree cutting cost estimator", "stump removal cost"],
    description:
      "Estimate a tree removal cost range from height, accessibility, condition, count, and optional stump removal or cleanup.",
    shortDescription: "Estimate tree removal cost as a range.",
    icon: "calculator",
    keywords: [
      "tree removal cost calculator",
      "tree removal cost",
      "stump removal",
      "tree cutting estimate",
      "landscaping cost estimator",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Size categories", "Currency range"],
    relatedToolIds: ["percentage-calculator", "unit-converter"],
    seoTitle: "Tree Removal Cost Calculator — Estimate Tree Removal Cost | Tool Base",
    seoDescription:
      "Estimate tree removal costs using tree size, accessibility, condition, stump removal, and other factors.",
    h1: "Tree Removal Cost Calculator",
    intro:
      "This tree removal cost calculator is an estimator, not a contractor quote. Height, access, condition, equipment, nearby structures, and local labor all move the price. The model shows a low, typical, and high range from visible planning assumptions so you can budget — not lock in an exact cost.",
    convertHeading: "Estimate Tree Removal Cost",
    howToHeading: "How the Tree Removal Cost Calculator Works",
    featuresHeading: "Why Tree-Removal Prices Vary",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Height bands from small through very large",
      "Accessibility and condition multipliers",
      "Optional stump removal subtotal",
      "Optional debris cleanup add-on",
      "Low / typical / high range instead of fake cent-level quotes",
    ],
    howToSteps: sharedHowTo(
      "Describe the Tree",
      "Choose Site Factors and Add-ons",
      "Review the Estimated Range",
      [
        "Pick a height band and how many trees you want modeled.",
        "Set access and condition, then include stump removal or cleanup if needed.",
        "Read estimated low, typical, and high figures. Get local bids before you hire.",
      ],
    ),
    faq: [
      {
        question: "Why can tree-removal costs vary so much?",
        answer:
          "Crews price height, lean, power lines, crane or chipper access, species, dead wood, and disposal. Two trees of similar height can differ by thousands.",
      },
      {
        question: "Does stump removal add cost?",
        answer:
          "Yes. When you include stump removal, the configured stump estimate is added and shown as its own line.",
      },
      {
        question: "Is the typical figure my exact price?",
        answer:
          "No. It is a planning midpoint from the model’s assumptions. Actual contractor pricing varies by region and site.",
      },
    ],
    inputFormats: ["Height", "Access", "Condition", "Add-ons"],
    outputFormats: ["Estimated cost range"],
    examples: [
      {
        title: "Larger and harder access costs more",
        description: "The live tool uses the same directional model, with your inputs.",
        input: "Small + easy + healthy vs large + difficult + hazardous, one tree, no stump",
        output: "The second combination produces a higher typical estimate than the first",
        formula: "typical = height base × access factor × condition factor × tree count",
      },
    ],
  }),
  tool({
    id: "ap-lit-score-calculator",
    name: "AP Lit Score Calculator",
    slug: "ap-lit-score-calculator",
    category: "specialized-calculators",
    subcategory: "Education",
    tags: ["Education", "AP Exams", "English Literature"],
    exactPrimaryKeyword: "ap lit score calculator",
    aliases: ["ap literature score calculator", "ap english lit score"],
    description:
      "Estimate an AP English Literature score from multiple-choice and essay rubric points using the selected exam year’s published structure.",
    shortDescription: "Estimate an AP English Literature score.",
    icon: "calculator",
    keywords: [
      "ap lit score calculator",
      "ap literature score",
      "ap english literature",
      "ap lit essays",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Section scores"],
    relatedToolIds: [
      "average-calculator",
      "percentage-calculator",
      "ap-bio-score-calculator",
      "ap-chem-score-calculator",
    ],
    seoTitle: "AP Lit Score Calculator — Estimate Your AP Score | Tool Base",
    seoDescription:
      "Estimate an AP English Literature score using multiple-choice and free-response rubric points.",
    h1: "AP Lit Score Calculator",
    intro:
      "This ap lit score calculator follows College Board’s published AP English Literature and Composition structure: 55 multiple-choice questions (45%) and three essays (55%) scored with the analytic 0–6 rubric (18 points combined). Essay prompts are not reproduced. The 1–5 result is an estimate, not an official College Board score.",
    convertHeading: "Estimate Your AP English Literature Score",
    howToHeading: "How the AP Lit Score Calculator Works",
    featuresHeading: "About AP English Literature Scoring",
    supportedFormatsHeading: "Inputs This Calculator Uses",
    relatedToolsHeading: "Related Education Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "55 multiple-choice questions at 45% of the composite",
      "Three essays at 55%, 0–6 points each (18-point maximum)",
      "Same APScoreCalculatorEngine as Chemistry, Biology, and Calculus BC",
      "Estimated range rather than a claimed official conversion table",
      apDisclaimer,
    ],
    howToSteps: sharedHowTo(
      "Enter Multiple-Choice Performance",
      "Enter Free-Response Rubric Points",
      "Review Your Estimated Score",
      [
        "Enter correct multiple-choice answers out of 55 for the 2026 configuration.",
        "Sum essay rubric points (thesis, evidence/commentary, sophistication) up to 18.",
        "Review MCQ, FRQ, weighted composite, and estimated AP score range.",
      ],
    ),
    faq: [
      {
        question: "Are AP score estimates official?",
        answer:
          "No. College Board issues official AP English Literature scores. This calculator estimates from published weights only.",
      },
      {
        question: "Do you include released exam questions?",
        answer:
          "No. Only section counts, weights, and rubric maxima needed to score an estimate are stored.",
      },
      {
        question: "What if 75% always meant a 5?",
        answer:
          "It does not. Do not treat a percentage as a guaranteed 5. Cut scores are not published here as official thresholds.",
      },
    ],
    inputFormats: ["MCQ correct", "Essay rubric points", "Exam year"],
    outputFormats: ["Weighted composite", "Estimated AP score range"],
    examples: [
      {
        title: "Essay-weighted composite",
        description: "Static illustration using 45/55 weights — not an official conversion.",
        input: "44/55 MCQ and 12/18 FRQ",
        output: "Composite about 72.7; estimated range 4–5 (illustrative)",
        formula: "(44/55)×45 + (12/18)×55 ≈ 36 + 36.67 = 72.67",
      },
    ],
  }),
];
