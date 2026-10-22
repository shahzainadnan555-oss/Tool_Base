import type { BlogPost } from "@/lib/blog/types";

export const distanceMileageGuide: BlogPost = {
  id: "distance-and-mileage-calculator-guide",
  slug: "distance-and-mileage-calculator-guide",
  title: "Distance Calculator and Mileage Calculator: A Simple Guide to Travel Distance",
  excerpt:
    "Learn what Tool Base’s distance and mileage calculators actually measure, how trip totals differ from fuel economy, and how to avoid common unit mistakes.",
  description:
    "A beginner guide to the Tool Base Distance Calculator, Mileage Calculator, and Gas Mileage Calculator, with clear examples for trip planning and fuel economy.",
  category: "Calculators",
  tags: ["Distance", "Mileage", "Travel", "Calculators", "Beginner"],
  seoTitle: "Distance & Mileage Calculator Guide: Travel Distance Explained | Tool Base",
  seoDescription:
    "Learn how Tool Base distance and mileage calculators work. Compare point distance, trip totals, MPG, and common unit mistakes with simple examples.",
  relatedToolSlugs: [
    "distance-calculator",
    "mileage-calculator",
    "gas-mileage-calculator",
    "fuel-cost-calculator",
    "speed-calculator",
    "length-converter",
  ],
  relatedArticleIds: [
    "calculators-and-converters-guide",
    "financial-calculators-guide",
    "volume-calculator-guide",
  ],
  publishedAt: "2026-10-23",
  content: [
    {
      type: "p",
      text: "People search for a distance calculator when they want a clear number: how far is it from here to there, how many miles did I drive this week, or how many kilometres a tank of fuel covered. Those questions sound similar, but they are not the same job. Tool Base separates them into different tools so the inputs stay honest and the result matches what you typed.",
    },
    {
      type: "p",
      text: "This guide explains three related tools: the [[distance-calculator|Distance Calculator]], the [[mileage-calculator|Mileage Calculator]], and the [[gas-mileage-calculator|Gas Mileage Calculator]]. You will also see how they connect to the [[fuel-cost-calculator|Fuel Cost Calculator]], the [[speed-calculator|Speed Calculator]], and the [[length-converter|Length Converter]]. All of them live under [[category:calculators-converters|Calculators and Converters]] and in the [[page:calculators|calculator directory]].",
    },
    { type: "h2", text: "What Distance Means" },
    {
      type: "p",
      text: "Distance is how far apart two places or two points are. In everyday talk, that might mean the road you drive, the walking path across a park, or the straight line on a map. In school mathematics, distance often means the length of the straight segment between two points on a grid.",
    },
    {
      type: "p",
      text: "Those ideas use the same word, but they use different information. Road distance depends on the path you take. Walking distance can change if a bridge is closed. Straight-line distance on a coordinate plane depends only on the two points you choose. Before you open a calculator, decide which kind of distance you need.",
    },
    { type: "h2", text: "What the Tool Base Distance Calculator Does" },
    {
      type: "p",
      text: "The Tool Base [[distance-calculator|Distance Calculator]] finds the Euclidean distance between two points. You enter four numbers: x₁, y₁, x₂, and y₂. The tool uses the formula d = √((x₂ − x₁)² + (y₂ − y₁)²). That is the straight-line length between the points on a flat plane.",
    },
    {
      type: "p",
      text: "It does not look up streets, GPS routes, traffic, or turn-by-turn directions. If you need driving directions, a map app is the right product. If you need the length of the line between two coordinate points for homework or a design sketch, this calculator is the right Tool Base page.",
    },
    {
      type: "p",
      text: "The default sample uses (0, 0) and (3, 4). The difference in x is 3 and the difference in y is 4, so d = √(9 + 16) = √25 = 5. That classic 3-4-5 triangle is a quick way to check that the page is working.",
    },
    { type: "h2", text: "How to Use the Distance Calculator" },
    {
      type: "ol",
      items: [
        "Open the [[distance-calculator|Distance Calculator]].",
        "Enter the first point in x₁ and y₁.",
        "Enter the second point in x₂ and y₂.",
        "Read the Distance result. The formula line shows d = √((x₂−x₁)² + (y₂−y₁)²).",
        "Keep the same unit on every coordinate. If x and y are in metres, the distance is in metres.",
      ],
    },
    {
      type: "p",
      text: "There is no separate unit menu on this page. The calculator treats your numbers as plain values. If one coordinate is in kilometres and another is in metres, the answer will look neat and still be wrong. Convert first with the [[length-converter|Length Converter]] when the units do not match.",
    },
    { type: "h2", text: "Distance Is Not Travel Time" },
    {
      type: "p",
      text: "Distance answers “how far.” Travel time answers “how long.” A 100 kilometre route can take one hour on a clear motorway or much longer in dense traffic. The Distance Calculator does not estimate minutes or hours, and it does not include traffic data.",
    },
    {
      type: "p",
      text: "If you already know distance and average speed, the [[speed-calculator|Speed Calculator]] can help with the related speed or time arithmetic. Still treat that as a simple model. Real journeys also depend on stops, speed limits, weather, and the exact route.",
    },
    { type: "h2", text: "What Mileage Means on Tool Base" },
    {
      type: "p",
      text: "In casual English, mileage can mean total distance driven, or it can mean fuel economy such as miles per gallon. Tool Base keeps those ideas on separate pages so the labels stay clear.",
    },
    {
      type: "p",
      text: "The [[mileage-calculator|Mileage Calculator]] adds trip distances. You paste or type values separated by commas, spaces, or new lines. The result shows total distance, how many trips you entered, and the average trip length. It is useful for weekly driving logs, delivery routes, or a simple holiday itinerary.",
    },
    {
      type: "p",
      text: "The [[gas-mileage-calculator|Gas Mileage Calculator]] is the fuel-economy tool. Enter distance traveled and fuel used, then choose Miles & gallons → MPG or Kilometers & liters → L/100km. MPG is miles divided by gallons. L/100km is liters divided by kilometres, then multiplied by 100.",
    },
    { type: "h2", text: "Worked Examples" },
    { type: "h3", text: "Straight-line distance between two points" },
    {
      type: "code",
      text: "Point A: (2, 1)\nPoint B: (8, 9)\nΔx = 8 − 2 = 6\nΔy = 9 − 1 = 8\nd = √(36 + 64) = √100 = 10",
    },
    {
      type: "p",
      text: "If those coordinates are kilometres on a simple map sketch, the straight-line distance is 10 km. That is not a guarantee of road length. A road that bends around a lake can be longer.",
    },
    { type: "h3", text: "Trip mileage total" },
    {
      type: "code",
      text: "Trips: 12, 8.5, 30, 5\nTotal = 12 + 8.5 + 30 + 5 = 55.5\nTrips counted = 4\nAverage = 55.5 ÷ 4 = 13.875",
    },
    {
      type: "p",
      text: "The Mileage Calculator reports that total and average. Use one unit for every trip. Mixing miles and kilometres in the same list creates a total that no longer means either unit.",
    },
    { type: "h3", text: "Fuel economy" },
    {
      type: "code",
      text: "US example: 250 miles on 10 gallons\nMPG = 250 ÷ 10 = 25 MPG\n\nMetric example: 400 km on 32 liters\nL/100km = (32 ÷ 400) × 100 = 8 L/100km",
    },
    {
      type: "p",
      text: "A higher MPG number usually means better economy. A lower L/100km number usually means better economy. Do not compare the two scales as if they were the same kind of score.",
    },
    { type: "h2", text: "Kilometres, Miles, and Everyday Travel Planning" },
    {
      type: "p",
      text: "Many travellers switch between kilometres and miles. One mile is about 1.609 kilometres. One kilometre is about 0.621 miles. Convert the lengths first when your notes use mixed units, then add them or feed them into fuel math.",
    },
    {
      type: "p",
      text: "For trip planning, start with honest distances: odometer readings, ticketed route lengths, or map estimates you trust. Use the Mileage Calculator to total several legs. Use the Gas Mileage Calculator after a fill-up when you know both distance and fuel used. Use the Fuel Cost Calculator when you also want a rough money estimate from fuel price and consumption.",
    },
    {
      type: "p",
      text: "None of these Tool Base pages replaces live GPS routing. They help you check arithmetic and keep a clear record of the numbers you already have.",
    },
    { type: "h2", text: "Common Mistakes" },
    {
      type: "ul",
      items: [
        "Expecting the Distance Calculator to return a driving route. It returns straight-line coordinate distance only.",
        "Mixing kilometres and miles in one Mileage Calculator list.",
        "Entering litres with a miles-and-gallons setting, or gallons with a kilometres-and-liters setting.",
        "Treating distance as travel time without a speed assumption.",
        "Using fuel economy from one short trip as if it were a long-term average.",
      ],
    },
    { type: "h2", text: "Choosing the Right Tool" },
    {
      type: "table",
      headers: ["Question", "Tool Base page"],
      rows: [
        ["How far apart are two coordinate points?", "[[distance-calculator|Distance Calculator]]"],
        ["What is the total of several trip lengths?", "[[mileage-calculator|Mileage Calculator]]"],
        ["What is my MPG or L/100km?", "[[gas-mileage-calculator|Gas Mileage Calculator]]"],
        ["About how much will this fuel use cost?", "[[fuel-cost-calculator|Fuel Cost Calculator]]"],
        ["How do speed, distance, and time relate?", "[[speed-calculator|Speed Calculator]]"],
      ],
    },
    { type: "h2", text: "A Practical Way to Work" },
    {
      type: "p",
      text: "Write down what you already know: point coordinates, trip lengths, or distance plus fuel. Pick the matching calculator. Keep units consistent. Read the formula line so you can explain the result later. If you need a unit change, convert with the Length Converter before you calculate.",
    },
    {
      type: "p",
      text: "For a wider tour of everyday math helpers, continue with the [[blog:calculators-and-converters-guide|calculators and converters guide]]. For money estimates that use interest rather than fuel, see the [[blog:financial-calculators-guide|financial calculators guide]].",
    },
  ],
  faqs: [
    {
      question: "Does the Distance Calculator give driving directions?",
      answer:
        "No. It calculates straight-line Euclidean distance between two points from the coordinates you enter. It does not use GPS, maps, or traffic data.",
    },
    {
      question: "What is the difference between the Mileage Calculator and the Gas Mileage Calculator?",
      answer:
        "The Mileage Calculator totals trip distances and shows an average trip length. The Gas Mileage Calculator estimates fuel economy as MPG or L/100km from distance and fuel used.",
    },
    {
      question: "Can I mix miles and kilometres in one calculation?",
      answer:
        "You should not. Convert every value to one unit first. Mixed units produce a number that no longer means a real distance or fuel rate.",
    },
    {
      question: "Why is my road trip longer than the Distance Calculator result?",
      answer:
        "Because roads are rarely perfect straight lines. The Distance Calculator measures the straight segment between two points, not the path a car must follow.",
    },
    {
      question: "Which tool helps with fuel cost?",
      answer:
        "Use the Gas Mileage Calculator for economy, then the Fuel Cost Calculator when you also want a cost estimate from fuel price and usage assumptions.",
    },
  ],
};
