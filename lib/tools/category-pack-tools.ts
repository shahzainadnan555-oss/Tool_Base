import type { CategoryId, ToolDefinition, ToolFaq } from "./types";

function makeTool(
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

function faqs(items: Array<[string, string]>): ToolFaq[] {
  return items.map(([question, answer]) => ({ question, answer }));
}

function steps(a: string, b: string, c: string) {
  return [
    { title: "Start", description: a },
    { title: "Adjust", description: b },
    { title: "Get the result", description: c },
  ];
}

function base(opts: {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  shortDescription: string;
  keywords: string[];
  relatedToolIds: string[];
  intro: string;
  features: string[];
  faq: ToolFaq[];
  icon?: string;
  popular?: boolean;
  aliases?: string[];
  convertHeading?: string;
  inputFormats?: string[];
  outputFormats?: string[];
}): ToolDefinition {
  return makeTool({
    id: opts.id,
    name: opts.name,
    slug: opts.id,
    category: opts.category,
    exactPrimaryKeyword: opts.name.toLowerCase(),
    aliases: opts.aliases,
    description: opts.description,
    shortDescription: opts.shortDescription,
    icon: opts.icon ?? "text",
    keywords: opts.keywords,
    popular: opts.popular ?? false,
    new: true,
    supportedFormats: opts.inputFormats ?? ["Text"],
    relatedToolIds: opts.relatedToolIds,
    seoTitle: `${opts.name} — Free Online | Tool Base`,
    seoDescription:
      opts.description.length > 80
        ? opts.description.slice(0, 155)
        : `${opts.description} Use this Tool Base utility without creating an account.`,
    h1: opts.name,
    intro: opts.intro,
    convertHeading: opts.convertHeading ?? opts.name,
    howToHeading: `How to use ${opts.name}`,
    featuresHeading: `${opts.name} features`,
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: opts.features,
    howToSteps: steps(
      "Open the tool and add your input.",
      "Review the options and run the action.",
      "Copy, download, or use the live result.",
    ),
    faq: opts.faq,
    inputFormats: opts.inputFormats ?? ["Text"],
    outputFormats: opts.outputFormats ?? ["Text"],
  });
}

export const categoryPackTools: ToolDefinition[] = [
  base({
    id: "pomodoro-timer",
    name: "Pomodoro Timer",
    category: "typing-productivity",
    icon: "text",
    popular: true,
    description:
      "Run a 25-minute focus interval with a 5-minute break using a clock based on real timestamps.",
    shortDescription: "Focus and break intervals with a live timer.",
    keywords: ["pomodoro timer", "pomodoro", "focus timer", "25 minute timer", "productivity timer"],
    relatedToolIds: ["focus-timer", "interval-timer", "stopwatch", "typing-speed-test"],
    intro:
      "Start a classic 25-minute focus block followed by a 5-minute break. Remaining time is computed from start timestamps, not from counting animation frames.",
    features: ["25/5 intervals", "Pause and reset", "Phase label", "Timestamp-based remaining time"],
    faq: faqs([
      ["Can I change the lengths?", "This timer uses the classic 25-minute focus and 5-minute break. Use Focus Timer or Interval Timer for custom lengths."],
      ["Does the clock drift if the tab sleeps?", "Remaining time is derived from the start timestamp when the tab is active again."],
    ]),
    inputFormats: ["Start / pause"],
    outputFormats: ["Remaining time"],
  }),
  base({
    id: "focus-timer",
    name: "Focus Timer",
    category: "typing-productivity",
    description:
      "Set a custom focus duration in minutes and watch remaining time counted from a real start timestamp.",
    shortDescription: "Custom-length focus countdown.",
    keywords: ["focus timer", "countdown focus", "study timer", "deep work timer"],
    relatedToolIds: ["pomodoro-timer", "countdown-timer", "breathing-timer", "stopwatch"],
    intro: "Choose how many minutes you want to focus, then start. The remaining display uses elapsed wall-clock time from the moment you press start.",
    features: ["Custom minutes", "Pause and reset", "Completion notice"],
    faq: faqs([
      ["Is this the same as Pomodoro?", "No. Focus Timer uses whatever duration you enter."],
      ["What happens at zero?", "The timer stops and shows a completed message."],
    ]),
    inputFormats: ["Minutes"],
    outputFormats: ["Remaining time"],
  }),
  base({
    id: "stopwatch",
    name: "Stopwatch",
    category: "typing-productivity",
    popular: true,
    description:
      "Measure elapsed time with start, pause, lap, and reset using timestamps rather than guessed ticks.",
    shortDescription: "Elapsed time with laps.",
    keywords: ["stopwatch", "online stopwatch", "lap timer", "elapsed time"],
    relatedToolIds: ["countdown-timer", "pomodoro-timer", "interval-timer", "typing-speed-test"],
    intro: "Start the stopwatch to measure elapsed time. Laps store the timestamp difference from the previous mark.",
    features: ["Start pause reset", "Lap list", "Millisecond display"],
    faq: faqs([
      ["How is time measured?", "From timestamps at start, pause, and each lap."],
      ["Can I copy laps?", "Yes. Copy writes the lap list as text."],
    ]),
    inputFormats: ["Start / lap"],
    outputFormats: ["Elapsed time", "Laps"],
  }),
  base({
    id: "countdown-timer",
    name: "Countdown Timer",
    category: "typing-productivity",
    description:
      "Count down from hours, minutes, and seconds you set, using a start timestamp for remaining time.",
    shortDescription: "Countdown from a duration you set.",
    keywords: ["countdown timer", "online countdown", "minutes seconds timer"],
    relatedToolIds: ["focus-timer", "stopwatch", "pomodoro-timer", "days-until"],
    intro: "Enter hours, minutes, and seconds, then start. Remaining time is the original duration minus elapsed timestamp time.",
    features: ["H:M:S inputs", "Pause and reset", "Completion notice"],
    faq: faqs([
      ["Does it keep running in the background perfectly?", "When you return, remaining time is recalculated from the start timestamp."],
      ["Can I enter only seconds?", "Yes. Leave hours and minutes at zero."],
    ]),
    inputFormats: ["Hours", "Minutes", "Seconds"],
    outputFormats: ["Remaining time"],
  }),
  base({
    id: "online-notepad",
    name: "Online Notepad",
    category: "typing-productivity",
    popular: true,
    description:
      "Draft notes in a large editor, then copy or download the text. The latest draft stays in this browser until you clear it.",
    shortDescription: "Write notes and download them as text.",
    keywords: ["online notepad", "notes", "scratch pad", "text editor"],
    relatedToolIds: ["markdown-preview", "todo-list", "word-counter", "typing-speed-test"],
    intro: "Type freely, then copy or download a .txt file. The notepad restores the last draft stored in this browser on the same device.",
    features: ["Large editor", "Copy and download", "Word and character counts", "Clear draft"],
    faq: faqs([
      ["Is this a cloud notebook?", "No. It is a local drafting pad for this browser."],
      ["Can I download my notes?", "Yes, as a .txt file."],
    ]),
    outputFormats: ["Text", "TXT"],
  }),
  base({
    id: "markdown-preview",
    name: "Markdown Preview",
    category: "typing-productivity",
    description:
      "Write Markdown on the left and see a live HTML preview on the right, then copy HTML or Markdown.",
    shortDescription: "Live Markdown to HTML preview.",
    keywords: ["markdown preview", "markdown editor", "md to html", "live markdown"],
    relatedToolIds: ["online-notepad", "html-formatter", "word-counter", "checklist-maker"],
    intro: "Type Markdown headings, lists, links, and code spans. The preview updates as you type. Copy Markdown or generated HTML.",
    features: ["Live preview", "Headings lists links code", "Copy Markdown or HTML"],
    faq: faqs([
      ["Is this a full CommonMark engine?", "It covers everyday headings, emphasis, lists, links, and code. Complex extensions are not claimed."],
      ["Does it run scripts in Markdown?", "No. HTML in the input is escaped."],
    ]),
    inputFormats: ["Markdown"],
    outputFormats: ["HTML", "Markdown"],
  }),
  base({
    id: "todo-list",
    name: "Todo List",
    category: "typing-productivity",
    description:
      "Add tasks, mark them complete, filter remaining items, and download the list as text.",
    shortDescription: "Add, complete, and export tasks.",
    keywords: ["todo list", "task list", "checklist", "to do"],
    relatedToolIds: ["checklist-maker", "online-notepad", "random-picker", "pomodoro-timer"],
    intro: "Add a task, check it off when done, and export remaining or all items. The list stays in this browser until you reset it.",
    features: ["Add and complete", "Filter remaining", "Download list", "Reset"],
    faq: faqs([
      ["Is this shared with a team?", "No. It is a personal list in this browser."],
      ["Can I export?", "Yes. Download writes one task per line."],
    ]),
    outputFormats: ["Text"],
  }),
  base({
    id: "checklist-maker",
    name: "Checklist Maker",
    category: "typing-productivity",
    description:
      "Turn a list of lines into a printable checklist with checkboxes you can tick and copy.",
    shortDescription: "Build a printable checklist from lines.",
    keywords: ["checklist maker", "printable checklist", "checkbox list"],
    relatedToolIds: ["todo-list", "markdown-preview", "randomize-list", "online-notepad"],
    intro: "Paste one item per line to generate a checklist. Tick boxes as you go, then copy or print the list.",
    features: ["One item per line", "Interactive checkboxes", "Copy and print"],
    faq: faqs([
      ["Can I print it?", "Yes. Use your browser print dialog."],
      ["Are empty lines kept?", "Blank lines are skipped."],
    ]),
    inputFormats: ["Text lines"],
    outputFormats: ["Checklist"],
  }),
  base({
    id: "dice-roller",
    name: "Dice Roller",
    category: "typing-productivity",
    description:
      "Roll one or more dice with a chosen number of sides using a cryptographic random source when available.",
    shortDescription: "Roll dice and see each face.",
    keywords: ["dice roller", "roll dice", "d6", "d20", "random dice"],
    relatedToolIds: ["coin-flip", "decision-wheel", "random-picker", "random-number-generator"],
    intro: "Choose how many dice and how many faces, then roll. Each face is an independent random integer from 1 through the number of sides.",
    features: ["Multiple dice", "Custom sides", "Sum and list", "Reroll"],
    faq: faqs([
      ["Is this a fair roll?", "Each face is chosen independently with a uniform integer in 1..sides."],
      ["Can I roll a d20?", "Yes. Set sides to 20."],
    ]),
    inputFormats: ["Count", "Sides"],
    outputFormats: ["Rolls", "Sum"],
  }),
  base({
    id: "coin-flip",
    name: "Coin Flip",
    category: "typing-productivity",
    description:
      "Flip a virtual coin one or many times and see heads, tails, and the running counts.",
    shortDescription: "Flip a coin and tally heads or tails.",
    keywords: ["coin flip", "flip a coin", "heads or tails"],
    relatedToolIds: ["dice-roller", "decision-wheel", "random-picker", "random-number-generator"],
    intro: "Flip once or many times. Each flip is an independent heads or tails choice.",
    features: ["Single or many flips", "Heads and tails counts", "Reset"],
    faq: faqs([
      ["Can it land on edge?", "No. Each flip is heads or tails."],
      ["How is randomness chosen?", "A uniform 0 or 1 is drawn for each flip."],
    ]),
    inputFormats: ["Flip count"],
    outputFormats: ["Heads", "Tails"],
  }),
  base({
    id: "decision-wheel",
    name: "Decision Wheel",
    category: "typing-productivity",
    description:
      "Spin a wheel built from your list of options and land on one result chosen at random.",
    shortDescription: "Spin a wheel of your options.",
    keywords: ["decision wheel", "spin the wheel", "random picker wheel", "wheel of names"],
    relatedToolIds: ["random-picker", "dice-roller", "coin-flip", "randomize-list"],
    intro: "Enter options, one per line, then spin. The winning index is a random integer across the non-empty lines.",
    features: ["Custom options", "Spin animation", "Winner label"],
    faq: faqs([
      ["Can I remove the winner and spin again?", "Edit the list and spin again."],
      ["Are blank lines used?", "No. Empty lines are ignored."],
    ]),
    inputFormats: ["Options"],
    outputFormats: ["Selected option"],
  }),
  base({
    id: "days-until",
    name: "Days Until",
    category: "typing-productivity",
    description:
      "Count whole days from today to a date you enter, including past dates as days ago.",
    shortDescription: "Days between today and a target date.",
    keywords: ["days until", "days until date", "countdown days", "date difference"],
    relatedToolIds: ["week-number", "countdown-timer", "work-hours-calculator", "date-difference-calculator"],
    intro: "Pick a target date to see how many whole days remain, or how many days have passed if the date is in the past.",
    features: ["Future and past dates", "Whole-day count", "ISO date input"],
    faq: faqs([
      ["Does it include today?", "The count uses calendar dates in your local timezone, rounded to whole days."],
      ["Are hours included?", "This tool reports whole days, not hours and minutes."],
    ]),
    inputFormats: ["Date"],
    outputFormats: ["Day count"],
  }),
  base({
    id: "week-number",
    name: "Week Number",
    category: "typing-productivity",
    description:
      "Show the ISO week number for a date, plus the weekday name in your local calendar.",
    shortDescription: "ISO week number for any date.",
    keywords: ["week number", "iso week", "what week is it"],
    relatedToolIds: ["days-until", "work-hours-calculator", "date-difference-calculator", "countdown-timer"],
    intro: "Choose a date to see its ISO-8601 week number (weeks start on Monday) and the local weekday name.",
    features: ["ISO week", "Weekday name", "Defaults to today"],
    faq: faqs([
      ["Is this US week numbering?", "It uses ISO weeks that start on Monday."],
      ["What about week 53?", "Some years have a 53rd ISO week; the calculator follows that rule."],
    ]),
    inputFormats: ["Date"],
    outputFormats: ["Week number"],
  }),
  base({
    id: "work-hours-calculator",
    name: "Work Hours Calculator",
    category: "typing-productivity",
    description:
      "Calculate elapsed work hours from start and end times with an unpaid break in minutes.",
    shortDescription: "Hours worked minus break time.",
    keywords: ["work hours calculator", "timesheet hours", "hours worked"],
    relatedToolIds: ["meeting-cost-calculator", "week-number", "countdown-timer", "percentage-calculator"],
    intro: "Enter a start time, end time, and unpaid break. The result is the elapsed duration minus the break, in hours and minutes.",
    features: ["Start and end times", "Unpaid break", "Overnight shift support"],
    faq: faqs([
      ["What if I work past midnight?", "If the end is earlier than the start, the calculator treats it as the next day."],
      ["Are overtime rules applied?", "No. It reports elapsed hours only."],
    ]),
    inputFormats: ["Start time", "End time", "Break minutes"],
    outputFormats: ["Hours", "Minutes"],
  }),
  base({
    id: "meeting-cost-calculator",
    name: "Meeting Cost Calculator",
    category: "typing-productivity",
    description:
      "Estimate a meeting’s labor cost from attendee count, hourly rate, and duration.",
    shortDescription: "Estimate the labor cost of a meeting.",
    keywords: ["meeting cost calculator", "meeting cost", "attendee cost"],
    relatedToolIds: ["work-hours-calculator", "sales-commission-calculator", "percentage-calculator", "countdown-timer"],
    intro: "Multiply attendees by an hourly rate and duration. The figure is a planning estimate, not a payroll result.",
    features: ["Attendees × rate × hours", "Optional extra cost", "Reset"],
    faq: faqs([
      ["Is this actual payroll?", "No. It uses the rate you enter for every attendee."],
      ["Can rates differ by person?", "Use an average rate, or run the math more than once."],
    ]),
    inputFormats: ["Count", "Rate", "Minutes"],
    outputFormats: ["Estimated cost"],
  }),
  base({
    id: "interval-timer",
    name: "Interval Timer",
    category: "typing-productivity",
    description:
      "Alternate work and rest intervals for a chosen number of rounds using timestamp-based remaining time.",
    shortDescription: "Work and rest rounds on a timer.",
    keywords: ["interval timer", "tabata timer", "work rest timer", "hiit timer"],
    relatedToolIds: ["pomodoro-timer", "focus-timer", "stopwatch", "breathing-timer"],
    intro: "Set work seconds, rest seconds, and rounds. The timer advances phases from start timestamps.",
    features: ["Work and rest phases", "Round counter", "Pause and reset"],
    faq: faqs([
      ["Is this only for workouts?", "Use it for any repeating work/rest pattern."],
      ["What happens after the last rest?", "The timer stops at complete."],
    ]),
    inputFormats: ["Work seconds", "Rest seconds", "Rounds"],
    outputFormats: ["Phase", "Remaining time"],
  }),
  base({
    id: "breathing-timer",
    name: "Breathing Timer",
    category: "typing-productivity",
    description:
      "Follow inhale, hold, and exhale phases with a paced timer you can start, pause, and reset.",
    shortDescription: "Paced inhale, hold, and exhale.",
    keywords: ["breathing timer", "box breathing", "4-7-8 breathing"],
    relatedToolIds: ["focus-timer", "interval-timer", "pomodoro-timer", "stopwatch"],
    intro: "Choose box breathing (4-4-4-4) or 4-7-8. The current phase is driven by elapsed time from the cycle start.",
    features: ["Box and 4-7-8 patterns", "Phase label", "Pause and reset"],
    faq: faqs([
      ["Is this medical advice?", "No. It is a pacing aid only."],
      ["Can I stop immediately?", "Yes. Pause or reset at any time."],
    ]),
    inputFormats: ["Pattern"],
    outputFormats: ["Phase"],
  }),
  base({
    id: "password-strength-checker",
    name: "Password Strength Checker",
    category: "typing-productivity",
    description:
      "Score a password from length and character variety, estimate bits of entropy, and list missing character classes.",
    shortDescription: "Score password length and variety.",
    keywords: ["password strength checker", "password strength", "password entropy"],
    relatedToolIds: ["password-generator", "random-string-generator", "uuid-generator", "online-notepad"],
    intro:
      "Type a password to see length, character-class coverage, and an entropy estimate. The score is a local heuristic, not a guarantee that an account is safe.",
    features: ["Length and classes", "Entropy estimate", "Improvement hints"],
    faq: faqs([
      ["Is a high score unbreakable?", "No. Reused or leaked passwords can still fail."],
      ["Do you store the password?", "The check runs in the page. Do not paste production secrets into public machines."],
    ]),
    inputFormats: ["Password"],
    outputFormats: ["Score", "Entropy"],
  }),
  base({
    id: "random-picker",
    name: "Random Picker",
    category: "typing-productivity",
    description:
      "Pick one or more unique items at random from a list you paste, without repeating a chosen line.",
    shortDescription: "Pick random items from a list.",
    keywords: ["random picker", "pick a name", "random choice", "random from list"],
    relatedToolIds: ["decision-wheel", "dice-roller", "randomize-list", "coin-flip"],
    intro: "Paste options, choose how many winners, and pick. Winners are sampled without replacement from non-empty lines.",
    features: ["Without replacement", "One or many winners", "Copy result"],
    faq: faqs([
      ["Can the same name win twice?", "Not in one pick. Sampling does not replace chosen lines."],
      ["What if I ask for too many winners?", "The tool reports that the list is too short."],
    ]),
    inputFormats: ["List"],
    outputFormats: ["Winners"],
  }),
  base({
    id: "css-text-shadow-generator",
    name: "CSS Text Shadow Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Control text-shadow offset, blur, and color, then copy the generated CSS with a live preview.",
    shortDescription: "Generate CSS text-shadow with a live preview.",
    keywords: ["css text shadow", "text-shadow generator", "css shadow"],
    relatedToolIds: ["css-box-shadow-generator", "css-button-generator", "css-gradient-generator", "css-transform-generator"],
    intro: "Adjust X offset, Y offset, blur, and color. The preview uses the same text-shadow string you can copy.",
    features: ["Offset and blur", "Color picker", "Live preview", "Copy CSS"],
    faq: faqs([
      ["Can I stack multiple shadows?", "This generator outputs one shadow. Add more by editing the copied CSS."],
      ["Does it include vendor prefixes?", "No. Modern browsers use text-shadow."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "css-clip-path-generator",
    name: "CSS Clip-Path Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Pick a clip-path shape preset, preview it on a sample, and copy the CSS clip-path value.",
    shortDescription: "Generate CSS clip-path shapes.",
    keywords: ["css clip-path", "clip path generator", "css shapes"],
    relatedToolIds: ["svg-shape-generator", "css-border-radius-generator", "css-transform-generator", "css-gradient-generator"],
    intro: "Choose circle, ellipse, inset, triangle, diamond, or hexagon presets. Copy the clip-path declaration for your layout.",
    features: ["Shape presets", "Live preview", "Copy CSS"],
    faq: faqs([
      ["Can I drag custom points?", "This version ships useful presets. Paste the CSS into your project and refine."],
      ["Does every browser support every shape?", "Support for clip-path is broad in current browsers; test your target list."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "favicon-generator",
    name: "Favicon Generator",
    category: "design-creative",
    icon: "image",
    popular: true,
    description:
      "Upload an image, preview 16, 32, and 48 pixel favicon sizes, and download a 32×32 PNG.",
    shortDescription: "Create a PNG favicon from an image.",
    keywords: ["favicon generator", "favicon", "site icon", "32x32 icon"],
    relatedToolIds: ["image-placeholder-generator", "social-media-image-size-generator", "png-to-ico", "image-compressor"],
    intro: "Choose an image. Square crops from the center are drawn at 16, 32, and 48 pixels. Download the 32×32 PNG for a basic favicon.",
    features: ["Multi-size preview", "Center crop", "32×32 PNG download"],
    faq: faqs([
      ["Do you build a .ico package?", "The download is a 32×32 PNG, which many sites use as a favicon."],
      ["What if the image is not square?", "The center square is used."],
    ]),
    inputFormats: ["Image"],
    outputFormats: ["PNG"],
  }),
  base({
    id: "social-media-image-size-generator",
    name: "Social Media Image Size Generator",
    category: "design-creative",
    icon: "image",
    description:
      "Pick a social platform size preset or custom dimensions, add a title, and download a PNG canvas.",
    shortDescription: "Export social-sized PNG canvases.",
    keywords: ["social media image size", "og image size", "instagram post size", "twitter header size"],
    relatedToolIds: ["image-placeholder-generator", "favicon-generator", "open-graph-generator", "text-to-image"],
    intro: "Choose a common platform size or enter custom width and height. Add a title, then download the PNG at those exact pixels.",
    features: ["Platform presets", "Custom size", "Title overlay", "PNG export"],
    faq: faqs([
      ["Are these official platform specs?", "They are commonly used pixel sizes. Platforms can change requirements."],
      ["Can I upload a photo?", "This generator builds a sized canvas with your title. Use image tools to resize photos."],
    ]),
    outputFormats: ["PNG"],
  }),
  base({
    id: "image-placeholder-generator",
    name: "Image Placeholder Generator",
    category: "design-creative",
    icon: "image",
    description:
      "Create a placeholder PNG with custom width, height, background, and label text.",
    shortDescription: "Download a sized placeholder image.",
    keywords: ["image placeholder", "dummy image", "placeholder png", "lorem image"],
    relatedToolIds: ["social-media-image-size-generator", "favicon-generator", "pixel-art-generator", "text-to-image"],
    intro: "Set dimensions, background color, and label. Download a PNG that reports its own size on the canvas.",
    features: ["Custom dimensions", "Background color", "Label text", "PNG download"],
    faq: faqs([
      ["Is there a maximum size?", "Very large canvases can fail in the browser. Stay within typical mock sizes."],
      ["Can I copy a data URL?", "Yes. Copy writes a PNG data URL."],
    ]),
    outputFormats: ["PNG"],
  }),
  base({
    id: "pixel-art-generator",
    name: "Pixel Art Generator",
    category: "design-creative",
    icon: "image",
    description:
      "Paint on a grid with a palette, erase pixels, and export the artwork as a PNG.",
    shortDescription: "Paint pixel art and export PNG.",
    keywords: ["pixel art generator", "pixel editor", "8 bit drawing"],
    relatedToolIds: ["ascii-art-generator", "image-placeholder-generator", "svg-shape-generator", "favicon-generator"],
    intro: "Choose a grid size and color, then click cells to paint or erase. Export scales the grid into a PNG.",
    features: ["Editable grid", "Palette", "Erase", "PNG export"],
    faq: faqs([
      ["Can I import an image?", "This editor starts from a blank grid."],
      ["How large is the export?", "Each cell becomes several pixels so the PNG stays readable."],
    ]),
    outputFormats: ["PNG"],
  }),
  base({
    id: "ascii-art-generator",
    name: "ASCII Art Generator",
    category: "design-creative",
    icon: "text",
    description:
      "Turn typed text into banner-style ASCII art, then copy or download the result.",
    shortDescription: "Convert text into ASCII art.",
    keywords: ["ascii art generator", "text to ascii art", "ascii banner"],
    relatedToolIds: ["pixel-art-generator", "text-to-image", "word-counter", "online-notepad"],
    intro: "Type a short word or phrase. Each letter is mapped to a block font and joined into copyable ASCII art.",
    features: ["Letter maps", "Copy output", "Download .txt"],
    faq: faqs([
      ["Does it convert photos?", "This version maps typed characters to a banner font."],
      ["Which characters work?", "Letters, digits, and spaces are supported. Other characters show as a placeholder block."],
    ]),
    inputFormats: ["Text"],
    outputFormats: ["ASCII"],
  }),
  base({
    id: "image-color-palette-extractor",
    name: "Image Color Palette Extractor",
    category: "design-creative",
    icon: "image",
    description:
      "Upload an image and extract a palette of the most common colors with HEX and RGB values.",
    shortDescription: "Extract common colors from an image.",
    keywords: ["image color palette", "extract colors from image", "color picker from photo"],
    relatedToolIds: ["color-palette-generator", "color-contrast-checker", "hex-to-rgb", "favicon-generator"],
    intro: "Choose an image. Pixels are sampled and grouped into the most frequent colors. Copy HEX or RGB for each swatch.",
    features: ["Image sampling", "HEX and RGB", "Copy swatches"],
    faq: faqs([
      ["Is every unique pixel listed?", "No. Nearby colors are grouped so the palette stays usable."],
      ["Do transparent pixels count?", "Nearly transparent pixels are skipped."],
    ]),
    inputFormats: ["Image"],
    outputFormats: ["HEX", "RGB"],
  }),
  base({
    id: "svg-shape-generator",
    name: "SVG Shape Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Generate SVG markup for rectangles, circles, ellipses, polygons, and stars, then copy or download the SVG.",
    shortDescription: "Create SVG shapes and copy markup.",
    keywords: ["svg shape generator", "svg circle", "svg polygon", "svg star"],
    relatedToolIds: ["css-clip-path-generator", "icons", "png-to-svg", "image-placeholder-generator"],
    intro: "Pick a shape, set fill and stroke, and copy real SVG markup. The preview renders the same SVG you download.",
    features: ["Multiple shapes", "Fill and stroke", "Copy SVG", "Download .svg"],
    faq: faqs([
      ["Is the preview a screenshot?", "No. It is the generated SVG."],
      ["Can I edit points by hand?", "Copy the markup and edit it in your editor."],
    ]),
    outputFormats: ["SVG"],
  }),
  base({
    id: "css-transform-generator",
    name: "CSS Transform Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Combine translate, rotate, scale, and skew into a CSS transform string with a live preview.",
    shortDescription: "Generate CSS transform values.",
    keywords: ["css transform", "rotate scale skew", "css transform generator"],
    relatedToolIds: ["css-button-generator", "css-text-shadow-generator", "css-clip-path-generator", "css-filter-generator"],
    intro: "Move sliders for translate, rotate, scale, and skew. Copy the transform declaration used by the preview.",
    features: ["Translate rotate scale skew", "Live preview", "Copy CSS"],
    faq: faqs([
      ["Does this include 3D perspective?", "This generator covers 2D transform functions."],
      ["Can I reset?", "Yes. Reset returns every control to identity."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "css-button-generator",
    name: "CSS Button Generator",
    category: "design-creative",
    icon: "code",
    popular: true,
    description:
      "Design a button’s padding, radius, border, type, shadow, and hover color, then copy HTML and CSS.",
    shortDescription: "Generate HTML and CSS for a button.",
    keywords: ["css button generator", "button css", "hover button css"],
    relatedToolIds: ["css-box-shadow-generator", "css-border-radius-generator", "css-text-shadow-generator", "css-transform-generator"],
    intro: "Tune padding, radius, colors, border, and hover background. Copy a snippet with HTML and CSS that match the preview, including a hover rule.",
    features: ["Padding and radius", "Hover style", "Shadow", "HTML and CSS output"],
    faq: faqs([
      ["Does the snippet include a framework?", "No. It is plain HTML and CSS."],
      ["Is hover included?", "Yes. A :hover background is generated."],
    ]),
    outputFormats: ["HTML", "CSS"],
  }),
  base({
    id: "css-filter-generator",
    name: "CSS Filter Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Combine blur, brightness, contrast, saturate, and grayscale filters into a CSS filter string.",
    shortDescription: "Generate CSS filter effects.",
    keywords: ["css filter generator", "css blur", "css brightness", "css grayscale"],
    relatedToolIds: ["css-transform-generator", "css-glassmorphism-generator", "image-compressor", "css-button-generator"],
    intro: "Adjust filter sliders and copy the filter declaration. The preview applies the same string to a sample panel.",
    features: ["Blur brightness contrast saturate grayscale", "Live preview", "Copy CSS"],
    faq: faqs([
      ["Does this edit my photo file?", "It generates CSS. Apply it in your stylesheet or inline style."],
      ["Can I stack more filters?", "Copy the value and append extra functions."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "css-flexbox-generator",
    name: "CSS Flexbox Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Set flex direction, wrap, justify-content, and align-items, then copy the CSS used by the live preview.",
    shortDescription: "Generate CSS flexbox layout values.",
    keywords: ["css flexbox generator", "flexbox css", "justify-content", "align-items"],
    relatedToolIds: ["css-button-generator", "web-templates", "css-formatter", "css-transform-generator"],
    intro: "Choose direction, wrap, and alignment. The preview shows sample items using the generated display:flex rules.",
    features: ["Direction and wrap", "Justify and align", "Gap", "Copy CSS"],
    faq: faqs([
      ["Does this generate a full page?", "It generates the flex container CSS."],
      ["Can I change item count?", "Yes. Add or remove demo items."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "css-glassmorphism-generator",
    name: "CSS Glassmorphism Generator",
    category: "design-creative",
    icon: "code",
    description:
      "Generate frosted-glass CSS with background, blur, saturation, border, and radius, then copy the snippet.",
    shortDescription: "Generate glassmorphism CSS.",
    keywords: ["css glassmorphism", "frosted glass css", "backdrop-filter"],
    relatedToolIds: ["css-filter-generator", "css-button-generator", "css-gradient-generator", "css-box-shadow-generator"],
    intro: "Tune translucent fill, backdrop blur, and border. Copy CSS that matches the frosted preview card.",
    features: ["Backdrop blur", "Translucent fill", "Border and radius", "Copy CSS"],
    faq: faqs([
      ["Will this work everywhere?", "backdrop-filter support is strong in current browsers; provide a solid fallback if you need older clients."],
      ["Can I change the background scene?", "The preview uses a sample gradient behind the glass card."],
    ]),
    outputFormats: ["CSS"],
  }),
  base({
    id: "color-contrast-checker",
    name: "Color Contrast Checker",
    category: "design-creative",
    icon: "image",
    popular: true,
    description:
      "Check WCAG contrast ratio between foreground and background colors, including AA and AAA text checks.",
    shortDescription: "Measure WCAG color contrast.",
    keywords: ["color contrast checker", "wcag contrast", "aa aaa contrast", "accessibility contrast"],
    relatedToolIds: ["image-color-palette-extractor", "color-palette-generator", "hex-to-rgb", "css-button-generator"],
    intro: "Enter two hex colors. The ratio uses relative luminance. Pass/fail uses WCAG 2 AA and AAA thresholds for normal and large text.",
    features: ["Contrast ratio", "AA and AAA", "Normal and large text", "Swap colors"],
    faq: faqs([
      ["Is this a full accessibility audit?", "It checks contrast ratio only."],
      ["What is large text?", "WCAG treats 18pt regular or 14pt bold as large text."],
    ]),
    inputFormats: ["HEX"],
    outputFormats: ["Ratio", "WCAG"],
  }),
  base({
    id: "barcode-generator",
    name: "Barcode Generator",
    category: "utilities",
    icon: "qr",
    description:
      "Encode text as a Code 39 barcode SVG you can preview, copy, or download.",
    shortDescription: "Generate a Code 39 barcode SVG.",
    keywords: ["barcode generator", "code 39", "barcode svg"],
    relatedToolIds: ["qr-code-generator", "random-string-generator", "data-uri-generator", "svg-shape-generator"],
    intro: "Type letters, digits, and Code 39 symbols. The SVG bars use the Code 39 pattern, including start and stop characters.",
    features: ["Code 39 encoding", "SVG preview", "Download SVG"],
    faq: faqs([
      ["Is this QR?", "No. It is linear Code 39. Use the QR Code Generator for QR."],
      ["Which characters are allowed?", "A–Z, 0–9, space, and - . $ / + %."],
    ]),
    inputFormats: ["Text"],
    outputFormats: ["SVG"],
  }),
  base({
    id: "screen-resolution-checker",
    name: "Screen Resolution Checker",
    category: "utilities",
    icon: "code",
    popular: true,
    description:
      "Read the actual screen width, height, and available screen size reported by this device.",
    shortDescription: "Show this device’s screen resolution.",
    keywords: ["screen resolution checker", "screen size", "display resolution", "screen width height"],
    relatedToolIds: ["viewport-size-checker", "device-pixel-ratio-checker", "browser-information-checker", "aspect-ratio-calculator"],
    intro: "This page reports screen.width, screen.height, and available screen size from the current device. Resize does not change physical screen values.",
    features: ["Screen width and height", "Available size", "Live refresh"],
    faq: faqs([
      ["Is this the browser window?", "No. Use Viewport Size Checker for the layout viewport."],
      ["Why might it differ from marketing specs?", "The browser reports CSS pixels, which can differ from physical marketing resolution."],
    ]),
    outputFormats: ["Pixels"],
  }),
  base({
    id: "viewport-size-checker",
    name: "Viewport Size Checker",
    category: "utilities",
    icon: "code",
    description:
      "Show the current layout viewport width and height and update them as you resize the window.",
    shortDescription: "Live viewport width and height.",
    keywords: ["viewport size checker", "viewport width", "window size", "innerWidth"],
    relatedToolIds: ["screen-resolution-checker", "device-pixel-ratio-checker", "browser-information-checker", "aspect-ratio-calculator"],
    intro: "Viewport size is window.innerWidth and window.innerHeight. Resize the window to watch the values change.",
    features: ["Live width and height", "Resize listener", "Copy values"],
    faq: faqs([
      ["Does this include browser chrome?", "innerWidth/innerHeight are the layout viewport, not the hardware display."],
      ["What about mobile URL bars?", "The numbers follow whatever the browser currently reports."],
    ]),
    outputFormats: ["Pixels"],
  }),
  base({
    id: "device-pixel-ratio-checker",
    name: "Device Pixel Ratio Checker",
    category: "utilities",
    icon: "code",
    description:
      "Show the current devicePixelRatio and the resulting physical pixel estimate for the viewport.",
    shortDescription: "Read devicePixelRatio from this device.",
    keywords: ["device pixel ratio", "dpr checker", "retina pixel ratio"],
    relatedToolIds: ["screen-resolution-checker", "viewport-size-checker", "browser-information-checker", "aspect-ratio-calculator"],
    intro: "devicePixelRatio is read from the current browsing context. Multiplying viewport CSS pixels by DPR estimates physical pixels.",
    features: ["devicePixelRatio", "Estimated physical pixels", "Copy"],
    faq: faqs([
      ["Can I change DPR here?", "No. It reflects the device and zoom the browser reports."],
      ["Does browser zoom affect it?", "Often yes. The reported ratio follows the browsing context."],
    ]),
    outputFormats: ["Ratio"],
  }),
  base({
    id: "browser-information-checker",
    name: "Browser Information Checker",
    category: "utilities",
    icon: "code",
    description:
      "List platform, language, cookies, online status, hardware concurrency, and other values this browser exposes.",
    shortDescription: "Show available browser and platform details.",
    keywords: ["browser information", "browser details", "navigator platform", "user agent"],
    relatedToolIds: ["user-agent-parser", "online-status-checker", "viewport-size-checker", "keyboard-tester"],
    intro: "Values come from navigator and screen APIs available in this session. Fields the browser does not expose are listed as unavailable.",
    features: ["Platform and language", "Online and cookies", "Concurrency and memory when available"],
    faq: faqs([
      ["Is this a fingerprinting service?", "It only shows values already available to this page."],
      ["Why is a field unavailable?", "Some browsers hide memory, battery, or vendor details."],
    ]),
    outputFormats: ["Text"],
  }),
  base({
    id: "user-agent-parser",
    name: "User Agent Parser",
    category: "utilities",
    icon: "code",
    description:
      "Parse the current user agent string into browser, engine, and OS guesses you can copy.",
    shortDescription: "Parse this browser’s user agent.",
    keywords: ["user agent parser", "ua parser", "detect browser", "navigator.userAgent"],
    relatedToolIds: ["browser-information-checker", "url-parser", "online-status-checker", "http-status-code-lookup"],
    intro: "The parser reads navigator.userAgent (and userAgentData when present) and extracts likely browser, version, engine, and OS tokens. It is a reading aid, not a guarantee.",
    features: ["Current UA", "Optional custom UA", "Browser OS engine tokens"],
    faq: faqs([
      ["Are UA strings always accurate?", "No. Browsers can freeze or reduce them."],
      ["Can I paste another UA?", "Yes. Parsing then uses the text you provide."],
    ]),
    inputFormats: ["User agent"],
    outputFormats: ["Parsed fields"],
  }),
  base({
    id: "keyboard-tester",
    name: "Keyboard Tester",
    category: "utilities",
    icon: "text",
    popular: true,
    description:
      "Press keys to see the event code, key value, location, and modifier flags from the real keyboard event.",
    shortDescription: "See keys as they are pressed.",
    keywords: ["keyboard tester", "key code tester", "keydown test"],
    relatedToolIds: ["mouse-tester", "typing-speed-test", "browser-information-checker", "viewport-size-checker"],
    intro: "Focus the tester and press keys. The log shows event.key, event.code, location, and modifier keys from the actual KeyboardEvent.",
    features: ["key and code", "Modifiers", "Event log", "Clear"],
    faq: faqs([
      ["Why is a key missing?", "The OS or browser may intercept some shortcuts."],
      ["Does this remap my keyboard?", "No. It only displays events."],
    ]),
    inputFormats: ["Keyboard"],
    outputFormats: ["Key events"],
  }),
  base({
    id: "mouse-tester",
    name: "Mouse Tester",
    category: "utilities",
    icon: "text",
    description:
      "Click, move, and scroll in the pad to see button, coordinates, and wheel delta from real pointer events.",
    shortDescription: "Inspect mouse buttons and movement.",
    keywords: ["mouse tester", "mouse button test", "scroll wheel test"],
    relatedToolIds: ["keyboard-tester", "viewport-size-checker", "screen-resolution-checker", "browser-information-checker"],
    intro: "Use the pad to click, move, and scroll. The readout shows button numbers, client coordinates, and wheel deltas from the events.",
    features: ["Buttons", "Coordinates", "Wheel delta", "Reset"],
    faq: faqs([
      ["Does it test extra buttons?", "Button numbers from the event are shown, including aux buttons when the browser reports them."],
      ["Is pressure supported?", "If the pointer event includes pressure, it is displayed."],
    ]),
    inputFormats: ["Pointer"],
    outputFormats: ["Pointer events"],
  }),
  base({
    id: "url-parser",
    name: "URL Parser",
    category: "utilities",
    icon: "code",
    description:
      "Parse a URL into protocol, host, path, query, hash, and search parameters using the browser URL parser.",
    shortDescription: "Split a URL into its parts.",
    keywords: ["url parser", "parse url", "query string parser", "url parts"],
    relatedToolIds: ["url-encoder", "utm-url-builder", "user-agent-parser", "data-uri-generator"],
    intro: "Paste a full URL. Parsing uses the URL constructor. Invalid values show an error instead of a fake host.",
    features: ["Protocol host path", "Query parameters", "Hash", "Copy JSON"],
    faq: faqs([
      ["Do you fetch the URL?", "No. Only the string is parsed."],
      ["Are relative URLs accepted?", "Provide an absolute URL including a scheme."],
    ]),
    inputFormats: ["URL"],
    outputFormats: ["JSON"],
  }),
  base({
    id: "data-uri-generator",
    name: "Data URI Generator",
    category: "utilities",
    icon: "code",
    description:
      "Turn typed text or an uploaded file into a data URI you can copy, including a Base64 option.",
    shortDescription: "Create a data URI from text or a file.",
    keywords: ["data uri generator", "data url", "base64 data uri"],
    relatedToolIds: ["base64", "mime-type-checker", "file-signature-checker", "url-parser"],
    intro: "Paste text or choose a file. The tool builds a data URI with the MIME type you select or detect.",
    features: ["Text or file", "MIME type", "Base64 option", "Copy URI"],
    faq: faqs([
      ["Are huge files a good idea?", "Very large data URIs can freeze the tab. Keep files small."],
      ["Is the MIME type guaranteed?", "File type uses the browser’s type plus extension mapping."],
    ]),
    inputFormats: ["Text", "File"],
    outputFormats: ["Data URI"],
  }),
  base({
    id: "mime-type-checker",
    name: "MIME Type Checker",
    category: "utilities",
    icon: "code",
    description:
      "Look up a MIME type from a filename extension or inspect a file’s reported type.",
    shortDescription: "Map extensions and files to MIME types.",
    keywords: ["mime type checker", "file mime type", "content-type lookup"],
    relatedToolIds: ["file-signature-checker", "data-uri-generator", "http-status-code-lookup", "url-parser"],
    intro: "Type an extension or choose a file. Extension mapping uses a built-in table. Chosen files also show the type the browser reports.",
    features: ["Extension lookup", "File input type", "Common mappings"],
    faq: faqs([
      ["Is this the server Content-Type?", "No. It is a local mapping plus the browser file type."],
      ["What if the extension is unknown?", "The tool says the mapping is unknown instead of inventing a type."],
    ]),
    inputFormats: ["Extension", "File"],
    outputFormats: ["MIME type"],
  }),
  base({
    id: "file-signature-checker",
    name: "File Signature Checker",
    category: "utilities",
    icon: "code",
    description:
      "Read the first bytes of a file and compare them with known signatures such as PNG, JPEG, GIF, PDF, ZIP, and WebP.",
    shortDescription: "Inspect a file’s magic-number bytes.",
    keywords: ["file signature checker", "magic numbers", "file header", "file type from bytes"],
    relatedToolIds: ["mime-type-checker", "data-uri-generator", "corrupt-file", "hex-to-rgb"],
    intro: "Choose a file. The first bytes are read and compared with known signatures. A mismatch with the filename extension is reported when both are known.",
    features: ["Hex header", "Known signatures", "Extension comparison"],
    faq: faqs([
      ["Do you scan the whole file?", "Only the leading bytes needed for common signatures."],
      ["Unknown header?", "The hex dump is still shown with an unknown-signature message."],
    ]),
    inputFormats: ["File"],
    outputFormats: ["Hex", "Signature"],
  }),
  base({
    id: "http-status-code-lookup",
    name: "HTTP Status Code Lookup",
    category: "utilities",
    icon: "code",
    description:
      "Search standard HTTP status codes by number or phrase and read a short explanation of the class.",
    shortDescription: "Look up HTTP status codes.",
    keywords: ["http status code lookup", "http codes", "404 meaning", "status code"],
    relatedToolIds: ["url-parser", "mime-type-checker", "user-agent-parser", "json-formatter"],
    intro: "Type 404, 200, or a phrase such as not found. Matching codes from the standard list appear with their reason phrase and class.",
    features: ["Search by code or name", "1xx–5xx classes", "Copy result"],
    faq: faqs([
      ["Are custom CDN codes included?", "The list covers registered HTTP status codes commonly used on the web."],
      ["Does this ping a server?", "No. It is a local lookup."],
    ]),
    inputFormats: ["Code", "Phrase"],
    outputFormats: ["Status list"],
  }),
  base({
    id: "battery-status-checker",
    name: "Battery Status Checker",
    category: "utilities",
    icon: "code",
    description:
      "Read charging state and battery level from the Battery Status API when this browser provides it.",
    shortDescription: "Show battery level when the browser allows.",
    keywords: ["battery status", "battery level", "charging status"],
    relatedToolIds: ["online-status-checker", "browser-information-checker", "viewport-size-checker", "device-pixel-ratio-checker"],
    intro: "If the browser exposes the Battery Status API, this page shows charging state and level. Otherwise it reports that the API is unavailable.",
    features: ["Charging state", "Level percent", "Unavailable message"],
    faq: faqs([
      ["Why is it unavailable?", "Many desktop browsers no longer expose battery data."],
      ["Do you invent a percentage?", "No. Unavailable is shown instead of a fake level."],
    ]),
    outputFormats: ["Percent", "Charging"],
  }),
  base({
    id: "online-status-checker",
    name: "Online Status Checker",
    category: "utilities",
    icon: "code",
    description:
      "Show whether this browser currently reports itself as online, and update when connectivity events fire.",
    shortDescription: "Show navigator.onLine and live changes.",
    keywords: ["online status checker", "am i online", "navigator.online"],
    relatedToolIds: ["browser-information-checker", "battery-status-checker", "viewport-size-checker", "user-agent-parser"],
    intro: "The badge follows navigator.onLine and the online/offline events. This is the browser’s connectivity flag, not a speed test.",
    features: ["Live online flag", "Event log", "Copy status"],
    faq: faqs([
      ["Does online mean the site is reachable?", "No. Browsers can report online while a specific host is down."],
      ["Is this a ping tool?", "No."],
    ]),
    outputFormats: ["Online", "Offline"],
  }),
  base({
    id: "text-to-speech",
    name: "Text to Speech",
    category: "utilities",
    icon: "audio",
    description:
      "Speak typed text with the voices available in this browser, including rate and pitch controls.",
    shortDescription: "Speak text with built-in browser voices.",
    keywords: ["text to speech", "tts", "speak text", "speech synthesis"],
    relatedToolIds: ["online-notepad", "word-counter", "typing-speed-test", "markdown-preview"],
    intro: "Enter text, pick a voice from those installed in this browser, and play. Stop cancels speech immediately.",
    features: ["Voice list", "Rate and pitch", "Play and stop"],
    faq: faqs([
      ["Why are there no voices?", "The browser must expose speechSynthesis.getVoices()."],
      ["Is this a downloadable audio file?", "It speaks live. It does not export a soundtrack file."],
    ]),
    inputFormats: ["Text"],
    outputFormats: ["Speech"],
  }),
  base({
    id: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    category: "utilities",
    icon: "calculator",
    description:
      "Compute simplified aspect ratio from width and height, and solve for a missing side when a ratio is known.",
    shortDescription: "Simplify ratios and solve missing sides.",
    keywords: ["aspect ratio calculator", "16:9", "aspect ratio", "width height ratio"],
    relatedToolIds: ["viewport-size-checker", "screen-resolution-checker", "image-placeholder-generator", "social-media-image-size-generator"],
    intro: "Enter width and height to see the simplified ratio. Or lock a ratio and enter one side to solve the other.",
    features: ["Simplify ratio", "Solve missing side", "Common presets"],
    faq: faqs([
      ["Does this crop an image?", "It only does the math. Use image tools to resize files."],
      ["How is the ratio simplified?", "Width and height are divided by their greatest common divisor."],
    ]),
    inputFormats: ["Width", "Height"],
    outputFormats: ["Ratio"],
  }),
];

export const CATEGORY_PACK_SLUGS = categoryPackTools.map((tool) => tool.slug);

export function isCategoryPackSlug(slug: string): boolean {
  return CATEGORY_PACK_SLUGS.includes(slug);
}
