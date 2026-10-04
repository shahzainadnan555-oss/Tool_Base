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

/** Security, encoding & technical utilities — Prompt 10 */
export const securityTools: ToolDefinition[] = [
  tool({
    id: "sha256-hash-generator",
    name: "SHA-256 Hash Generator",
    slug: "sha256-hash-generator",
    category: "security-encoding",
    description:
      "Generate SHA-256 hashes from text or files for integrity checks and checksums.",
    shortDescription: "Generate SHA-256 digests.",
    icon: "shield",
    keywords: [
      "sha256 generator",
      "sha256 hash generator",
      "generate sha256",
      "sha-256",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Hash"],
    relatedToolIds: [
      "sha512-hash-generator",
      "md5-hash-generator",
      "sha1-hash-generator",
      "base64-file-converter",
    ],
    seoTitle: "SHA-256 Hash Generator — Generate Hash Online | Tool Base",
    seoDescription:
      "Generate SHA-256 hashes from text or files with Tool Base. Create a SHA-256 digest quickly and copy the resulting hash.",
    h1: "SHA-256 Hash Generator",
    intro:
      "Create a SHA-256 digest from text or a file. Hashing uses the actual file or UTF-8 text bytes — nothing is altered before hashing.",
    convertHeading: "Generate a SHA-256 Hash Online",
    howToHeading: "How to Generate a SHA-256 Hash",
    featuresHeading: "SHA-256 Hash Details",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Hash Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Text and file hashing",
      "Incremental large-file support",
      "Copy and download",
      "UTF-8 text hashing",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Text or Upload a File",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate the Hash",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is SHA-256 encryption?",
        answer: "No. Hashing is one-way and is not encryption.",
      },
      {
        question: "Are large files supported?",
        answer: "Yes. Files are hashed in chunks to keep the page responsive.",
      },
      {
        question: "Does empty input hash?",
        answer: "You must provide text or a file first.",
      },
      {
        question: "Private?",
        answer: "Yes. Hashing stays.",
      },
    ],
    inputFormats: ["Hash"],
    outputFormats: ["Hash"],
  }),
  tool({
    id: "sha512-hash-generator",
    name: "SHA-512 Hash Generator",
    slug: "sha512-hash-generator",
    category: "security-encoding",
    description:
      "Generate SHA-512 hashes from text or files for checksums and integrity checks.",
    shortDescription: "Generate SHA-512 digests.",
    icon: "shield",
    keywords: [
      "sha512 generator",
      "sha512 hash generator",
      "generate sha512",
      "sha-512",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Hash"],
    relatedToolIds: [
      "sha256-hash-generator",
      "md5-hash-generator",
      "sha1-hash-generator",
      "uuid-generator",
    ],
    seoTitle: "SHA-512 Hash Generator — Generate Hash Online | Tool Base",
    seoDescription:
      "Generate SHA-512 hashes from text or files with Tool Base. Create a SHA-512 digest and copy the result.",
    h1: "SHA-512 Hash Generator",
    intro:
      "Create a SHA-512 digest from text or a file. Results are clearly labeled as SHA-512 and are not confused with SHA-256.",
    convertHeading: "Generate a SHA-512 Hash Online",
    howToHeading: "How to Generate a SHA-512 Hash",
    featuresHeading: "SHA-512 Hash Details",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Hash Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Text and file hashing",
      "Clear SHA-512 labeling",
      "Copy and download",
      "Chunked file hashing",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Text or Upload a File",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate the Hash",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "How is this different from SHA-256?",
        answer:
          "SHA-512 produces a longer digest and uses a different algorithm.",
      },
      {
        question: "Is hashing reversible?",
        answer: "No.",
      },
      {
        question: "Can I hash files?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Hash"],
    outputFormats: ["Hash"],
  }),
  tool({
    id: "md5-hash-generator",
    name: "MD5 Hash Generator",
    slug: "md5-hash-generator",
    category: "security-encoding",
    description:
      "Generate MD5 hashes for legacy checksum and fingerprint use cases.",
    shortDescription: "Generate MD5 checksums.",
    icon: "shield",
    keywords: [
      "md5 generator",
      "md5 hash generator",
      "generate md5",
      "md5 checksum",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Hash"],
    relatedToolIds: [
      "sha256-hash-generator",
      "sha1-hash-generator",
      "sha512-hash-generator",
      "base64-file-converter",
    ],
    seoTitle: "MD5 Hash Generator — Generate MD5 Online | Tool Base",
    seoDescription:
      "Generate MD5 hashes online with Tool Base. Create legacy MD5 checksums from text or files for fingerprints and non-security uses.",
    h1: "MD5 Hash Generator",
    intro:
      "Create an MD5 digest for legacy checksum or fingerprint workflows. MD5 is not suitable for modern password security or collision-resistant security applications.",
    convertHeading: "Generate an MD5 Hash Online",
    howToHeading: "How to Generate an MD5 Hash",
    featuresHeading: "MD5 Hash Details",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Hash Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Legacy MD5 checksums",
      "Text and file support",
      "Clear security notice",
      "Copy and download",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Text or Upload a File",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate the Hash",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is MD5 secure?",
        answer:
          "No. MD5 is a legacy algorithm and should not be used for modern security-sensitive applications.",
      },
      {
        question: "What is it useful for?",
        answer: "Non-security checksums and fingerprints in legacy workflows.",
      },
      {
        question: "Can I hash files?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Hash"],
    outputFormats: ["Hash"],
  }),
  tool({
    id: "sha1-hash-generator",
    name: "SHA-1 Hash Generator",
    slug: "sha1-hash-generator",
    category: "security-encoding",
    description:
      "Generate SHA-1 hashes for legacy checksum uses with clear obsolescence notices.",
    shortDescription: "Generate SHA-1 digests.",
    icon: "shield",
    keywords: [
      "sha1 generator",
      "sha1 hash generator",
      "generate sha1",
      "sha-1",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Hash"],
    relatedToolIds: [
      "sha256-hash-generator",
      "md5-hash-generator",
      "sha512-hash-generator",
      "hex-to-text",
    ],
    seoTitle: "SHA-1 Hash Generator — Generate SHA-1 Online | Tool Base",
    seoDescription:
      "Generate SHA-1 hashes online with Tool Base. Create SHA-1 digests for legacy checksum use — not recommended for modern security.",
    h1: "SHA-1 Hash Generator",
    intro:
      "Create a SHA-1 digest when you need a legacy checksum. SHA-1 is considered obsolete for modern cryptographic security applications.",
    convertHeading: "Generate a SHA-1 Hash Online",
    howToHeading: "How to Generate a SHA-1 Hash",
    featuresHeading: "SHA-1 Hash Details",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Hash Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Legacy SHA-1 digests",
      "Text and file support",
      "Clear obsolescence notice",
      "Copy and download",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Text or Upload a File",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate the Hash",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Should I use SHA-1 for passwords?",
        answer:
          "No. Prefer modern algorithms such as SHA-256 for integrity checks and dedicated password hashing elsewhere.",
      },
      {
        question: "Is SHA-1 obsolete?",
        answer: "Yes for modern cryptographic security applications.",
      },
      {
        question: "Can I hash files?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Hash"],
    outputFormats: ["Hash"],
  }),
  tool({
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    category: "security-encoding",
    description:
      "Generate standards-compliant UUID v4 values with secure browser randomness.",
    shortDescription: "Generate UUID v4 identifiers.",
    icon: "shield",
    keywords: ["uuid generator", "generate uuid", "guid generator", "uuid v4"],
    popular: true,
    new: false,
    supportedFormats: ["UUID"],
    relatedToolIds: [
      "password-generator",
      "random-string-generator",
      "random-number-generator",
      "sha256-hash-generator",
    ],
    seoTitle: "UUID Generator — Create UUIDs Online | Tool Base",
    seoDescription:
      "Generate UUID v4 identifiers online with Tool Base. Create one or many UUIDs and copy or download the results.",
    h1: "UUID Generator",
    intro:
      "Generate UUID v4 identifiers for development, testing, and unique IDs. Quantity is capped so large requests stay responsive.",
    convertHeading: "Generate UUIDs Online",
    howToHeading: "How to Generate UUIDs",
    featuresHeading: "UUID Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Security Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "UUID v4 with secure randomness",
      "Quantity controls",
      "Copy and download",
      "Sensible maximums",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Choose a Quantity",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate UUIDs",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy or Download",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Which UUID version is generated?",
        answer:
          "UUID version 4 using secure browser randomness where available.",
      },
      {
        question: "Can I generate many at once?",
        answer: "Yes, up to a safe maximum.",
      },
      {
        question: "Are they unique?",
        answer:
          "UUIDv4 values are designed to be unique with extremely low collision probability.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["UUID"],
    outputFormats: ["UUID"],
  }),
  tool({
    id: "password-generator",
    name: "Secure Password Generator",
    slug: "password-generator",
    category: "security-encoding",
    description:
      "Generate strong random passwords with customizable length and character types using secure browser randomness.",
    shortDescription: "Generate strong random passwords.",
    icon: "shield",
    keywords: [
      "password generator",
      "secure password generator",
      "random password generator",
    ],
    popular: true,
    new: true,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "random-string-generator",
      "random-number-generator",
      "uuid-generator",
      "sha256-hash-generator",
    ],
    seoTitle:
      "Secure Password Generator — Generate Random Passwords | Tool Base",
    seoDescription:
      "Generate strong random passwords with customizable length and character types using Tool Base’s password generator.",
    h1: "Secure Password Generator",
    intro:
      "Create a random password with the length and character types you choose. Generation uses cryptographically secure browser randomness where available.",
    convertHeading: "Generate a Random Password",
    howToHeading: "Customize Your Password",
    featuresHeading: "Password Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Security Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Secure random generation",
      "Length and character controls",
      "Ambiguous-character exclusion",
      "Copy without server storage",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Choose Password Length",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Select Character Types",
        description: "Run the action or review the live result.",
      },
      {
        title: "Generate and Copy",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Are passwords stored?",
        answer: "No. They stay in temporary UI state only.",
      },
      {
        question: "What if secure random is unavailable?",
        answer:
          "The tool shows an error instead of silently using weak randomness.",
      },
      {
        question: "Can I exclude ambiguous characters?",
        answer: "Yes.",
      },
      {
        question: "Is a password unbreakable?",
        answer:
          "No tool should claim that. Longer, varied passwords are stronger, not unbreakable.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "random-string-generator",
    name: "Random String Generator",
    slug: "random-string-generator",
    category: "security-encoding",
    description:
      "Generate random strings with customizable length, quantity, and character sets.",
    shortDescription: "Generate random strings.",
    icon: "shield",
    keywords: [
      "random string generator",
      "generate random string",
      "random text generator",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "password-generator",
      "random-number-generator",
      "uuid-generator",
      "text-to-hex",
    ],
    seoTitle: "Random String Generator — Create Random Text | Tool Base",
    seoDescription:
      "Generate random strings online with Tool Base. Customize length, quantity, and character types, then copy or download.",
    h1: "Random String Generator",
    intro:
      "Create random strings for tokens, placeholders, and testing. Output size is limited so the page stays usable.",
    convertHeading: "Generate Random Strings Online",
    howToHeading: "How to Generate Random Strings",
    featuresHeading: "Random String Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Security Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Custom length and quantity",
      "Character-set options",
      "Secure randomness",
      "Copy and download",
      "Safe output limits",
    ],
    howToSteps: [
      {
        title: "Set Length and Quantity",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Choose Character Types",
        description: "Run the action or review the live result.",
      },
      {
        title: "Generate and Copy",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is output secure?",
        answer: "Generation uses secure browser randomness where available.",
      },
      {
        question: "Can I create huge outputs?",
        answer: "Quantity and length are capped for responsiveness.",
      },
      {
        question: "Can I include symbols?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "random-number-generator",
    name: "Random Number Generator",
    slug: "random-number-generator",
    category: "security-encoding",
    description:
      "Generate random integers or decimals within a chosen minimum and maximum range.",
    shortDescription: "Generate random numbers in a range.",
    icon: "shield",
    keywords: [
      "random number generator",
      "generate random number",
      "rng online",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "random-string-generator",
      "password-generator",
      "uuid-generator",
      "decimal-to-binary",
    ],
    seoTitle: "Random Number Generator — Random Integers & Decimals | Tool Base",
    seoDescription:
      "Generate random numbers online with Tool Base. Choose min/max, quantity, and integer or decimal mode.",
    h1: "Random Number Generator",
    intro:
      "Generate random numbers inside a validated min/max range. Integer mode supports large ranges with BigInt-safe sampling.",
    convertHeading: "Generate Random Numbers Online",
    howToHeading: "How to Generate Random Numbers",
    featuresHeading: "Random Number Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Security Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Integer and decimal modes",
      "Validated min/max",
      "Secure randomness",
      "Quantity controls",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Set Minimum and Maximum",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Choose Quantity and Mode",
        description: "Run the action or review the live result.",
      },
      {
        title: "Generate and Copy",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "What if min is greater than max?",
        answer: "You will see a clear validation error.",
      },
      {
        question: "Are decimals supported?",
        answer: "Yes in decimal mode.",
      },
      {
        question: "Are results truly random?",
        answer: "They use secure browser randomness where available.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "hex-to-text",
    name: "Hex to Text Converter",
    slug: "hex-to-text",
    category: "security-encoding",
    description:
      "Convert hexadecimal byte data into UTF-8 text with validation for invalid hex.",
    shortDescription: "Convert hexadecimal to text.",
    icon: "shield",
    keywords: ["hex to text", "hexadecimal to text", "hex decoder"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "text-to-hex",
      "binary-to-text",
      "text-to-binary",
      "base32-encoder-decoder",
    ],
    seoTitle: "Hex to Text Converter — Decode Hex Online | Tool Base",
    seoDescription:
      "Convert hexadecimal bytes to UTF-8 text online with Tool Base. Validate hex input and decode readable text.",
    h1: "Hex to Text Converter",
    intro:
      "Decode hexadecimal byte sequences into UTF-8 text. Invalid hex or odd-length input produces a clear error.",
    convertHeading: "Convert Hex to Text Online",
    howToHeading: "How to Convert Hex to Text",
    featuresHeading: "Hex to Text Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "UTF-8 decoding",
      "Space-tolerant hex input",
      "Even-byte validation",
      "Live conversion",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste Hex Data",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Text",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Do spaces matter?",
        answer: "Spaces and line breaks are ignored.",
      },
      {
        question: "What about Unicode?",
        answer: "Valid UTF-8 hex sequences decode to Unicode text.",
      },
      {
        question: "What if hex is invalid?",
        answer: "A clear error is shown.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-to-hex",
    name: "Text to Hex Converter",
    slug: "text-to-hex",
    category: "security-encoding",
    description: "Convert UTF-8 text into hexadecimal byte representation.",
    shortDescription: "Convert text to hexadecimal.",
    icon: "shield",
    keywords: ["text to hex", "string to hex", "utf8 to hex"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "hex-to-text",
      "text-to-binary",
      "binary-to-text",
      "base32-encoder-decoder",
    ],
    seoTitle: "Text to Hex Converter — Encode Text as Hex | Tool Base",
    seoDescription:
      "Convert text to hexadecimal online with Tool Base. Encode Unicode text as UTF-8 hex bytes and copy the result.",
    h1: "Text to Hex Converter",
    intro:
      "Encode text as UTF-8 hexadecimal bytes. Unicode and emoji are handled correctly — this is not ASCII-only encoding.",
    convertHeading: "Convert Text to Hex Online",
    howToHeading: "How to Convert Text to Hex",
    featuresHeading: "Text to Hex Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "UTF-8 encoding",
      "Unicode support",
      "Live conversion",
      "Copy and download",
      "Clear empty-input errors",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Hex",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does اردو encode correctly?",
        answer: "Yes. Text is encoded as UTF-8 bytes.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Can I round-trip?",
        answer: "Yes with Hex to Text.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "binary-to-text",
    name: "Binary to Text Converter",
    slug: "binary-to-text",
    category: "security-encoding",
    description:
      "Convert binary byte sequences into UTF-8 text with complete-byte validation.",
    shortDescription: "Convert binary bytes to text.",
    icon: "shield",
    keywords: ["binary to text", "binary decoder", "bits to text"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "text-to-binary",
      "hex-to-text",
      "text-to-hex",
      "binary-to-decimal",
    ],
    seoTitle: "Binary to Text Converter — Decode Binary Online | Tool Base",
    seoDescription:
      "Convert binary bytes to UTF-8 text online with Tool Base. Validate complete bytes and decode readable text.",
    h1: "Binary to Text Converter",
    intro:
      "Decode binary byte sequences into UTF-8 text. Incomplete bytes or invalid characters produce a clear error.",
    convertHeading: "Convert Binary to Text Online",
    howToHeading: "How to Convert Binary to Text",
    featuresHeading: "Binary to Text Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "UTF-8 decoding",
      "Space-tolerant binary",
      "Complete-byte validation",
      "Live conversion",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste Binary Data",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Text",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Must bytes be complete?",
        answer: "Yes. Input must form complete 8-bit bytes.",
      },
      {
        question: "Are spaces allowed?",
        answer: "Yes.",
      },
      {
        question: "Unicode support?",
        answer: "Yes for valid UTF-8 sequences.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-to-binary",
    name: "Text to Binary Converter",
    slug: "text-to-binary",
    category: "security-encoding",
    description: "Convert UTF-8 text into binary byte representation.",
    shortDescription: "Convert text to binary.",
    icon: "shield",
    keywords: ["text to binary", "string to binary", "utf8 to binary"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "binary-to-text",
      "text-to-hex",
      "hex-to-text",
      "decimal-to-binary",
    ],
    seoTitle: "Text to Binary Converter — Encode Text as Binary | Tool Base",
    seoDescription:
      "Convert text to binary online with Tool Base. Encode Unicode text as UTF-8 binary bytes and copy the result.",
    h1: "Text to Binary Converter",
    intro:
      "Encode text as UTF-8 binary bytes. Each byte is shown as an 8-bit sequence for easy inspection.",
    convertHeading: "Convert Text to Binary Online",
    howToHeading: "How to Convert Text to Binary",
    featuresHeading: "Text to Binary Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "UTF-8 encoding",
      "Byte-separated binary",
      "Live conversion",
      "Copy and download",
      "Unicode support",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Binary",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "How is A encoded?",
        answer: "As 01000001.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Can outputs get long?",
        answer: "Yes. Large outputs use a scrollable editor.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "decimal-to-binary",
    name: "Decimal to Binary Converter",
    slug: "decimal-to-binary",
    category: "security-encoding",
    description:
      "Convert non-negative decimal integers to binary using BigInt for large values.",
    shortDescription: "Convert integers to binary.",
    icon: "shield",
    keywords: ["decimal to binary", "integer to binary", "number to binary"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "binary-to-decimal",
      "text-to-binary",
      "binary-to-text",
      "random-number-generator",
    ],
    seoTitle: "Decimal to Binary Converter — Convert Numbers Online | Tool Base",
    seoDescription:
      "Convert decimal integers to binary online with Tool Base. Large integers are handled without silent rounding.",
    h1: "Decimal to Binary Converter",
    intro:
      "Convert whole decimal numbers into binary. Large integers use BigInt so values are not silently rounded.",
    convertHeading: "Convert Decimal to Binary Online",
    howToHeading: "How to Convert Decimal to Binary",
    featuresHeading: "Decimal to Binary Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "BigInt-safe large integers",
      "Non-negative integer focus",
      "Live conversion",
      "Copy and download",
      "Clear validation",
    ],
    howToSteps: [
      {
        title: "Enter a Decimal Integer",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Binary",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Are negatives supported?",
        answer: "This simple mode focuses on non-negative integers.",
      },
      {
        question: "Will huge numbers round?",
        answer: "No. BigInt preserves exact integers.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "binary-to-decimal",
    name: "Binary to Decimal Converter",
    slug: "binary-to-decimal",
    category: "security-encoding",
    description:
      "Convert binary integers to exact decimal values using BigInt.",
    shortDescription: "Convert binary to decimal.",
    icon: "shield",
    keywords: [
      "binary to decimal",
      "bits to decimal",
      "binary number converter",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "decimal-to-binary",
      "binary-to-text",
      "text-to-binary",
      "hex-to-text",
    ],
    seoTitle: "Binary to Decimal Converter — Convert Binary Online | Tool Base",
    seoDescription:
      "Convert binary integers to decimal online with Tool Base. Large binary values convert exactly with BigInt.",
    h1: "Binary to Decimal Converter",
    intro:
      "Convert binary integers into exact decimal values. Large inputs use BigInt to avoid JavaScript Number overflow.",
    convertHeading: "Convert Binary to Decimal Online",
    howToHeading: "How to Convert Binary to Decimal",
    featuresHeading: "Binary to Decimal Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "BigInt-safe conversion",
      "Binary validation",
      "Live conversion",
      "Copy and download",
      "Clear errors",
    ],
    howToSteps: [
      {
        title: "Enter Binary Digits",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Convert to Decimal",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Can large binary overflow?",
        answer: "No. BigInt keeps exact decimal results.",
      },
      {
        question: "Are spaces allowed?",
        answer: "Yes.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "base32-encoder-decoder",
    name: "Base32 Encoder/Decoder",
    slug: "base32-encoder-decoder",
    category: "security-encoding",
    description:
      "Encode text to Base32 or decode Base32 back to UTF-8 text with padding support.",
    shortDescription: "Encode and decode Base32.",
    icon: "shield",
    keywords: [
      "base32 encoder",
      "base32 decoder",
      "encode base32",
      "decode base32",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "base64-encoder",
      "base64-decoder",
      "base64-file-converter",
      "text-to-hex",
    ],
    seoTitle: "Base32 Encoder/Decoder — Encode & Decode Online | Tool Base",
    seoDescription:
      "Encode and decode Base32 online with Tool Base. Convert text to Base32 or recover UTF-8 text from Base32 input.",
    h1: "Base32 Encoder/Decoder",
    intro:
      "Switch between encode and decode modes to work with Base32 text. Padding is handled and invalid input is rejected clearly.",
    convertHeading: "Encode or Decode Base32 Online",
    howToHeading: "How to Use Base32 Encoder/Decoder",
    featuresHeading: "Base32 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Encode and decode modes",
      "Padding support",
      "UTF-8 text handling",
      "Copy and download",
      "Clear validation",
    ],
    howToSteps: [
      {
        title: "Choose Encode or Decode",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Enter Your Input",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is this Base64?",
        answer: "No. This tool uses Base32.",
      },
      {
        question: "Does padding matter?",
        answer: "Padding is accepted and normalized where appropriate.",
      },
      {
        question: "Unicode support?",
        answer: "Yes for UTF-8 text.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "base64-file-converter",
    name: "Base64 File Converter",
    slug: "base64-file-converter",
    category: "security-encoding",
    description:
      "Convert uploaded files to Base64 or decode Base64 back into a downloadable file.",
    shortDescription: "Convert files to and from Base64.",
    icon: "shield",
    keywords: ["base64 file converter", "file to base64", "base64 to file"],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "base64-encoder",
      "base64-decoder",
      "qr-code-generator",
      "sha256-hash-generator",
    ],
    seoTitle: "Base64 File Converter — File ↔ Base64 Online | Tool Base",
    seoDescription:
      "Convert files to Base64 or decode Base64 into a downloadable file with Tool Base. Review file name, type, and size.",
    h1: "Base64 File Converter",
    intro:
      "Upload a file to encode as Base64, or paste Base64 to download a reconstructed file. Decoded contents are treated as data and never executed.",
    convertHeading: "Convert Files and Base64 Online",
    howToHeading: "How to Convert Base64 Files",
    featuresHeading: "Base64 File Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Encoding Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "File to Base64",
      "Base64 to file download",
      "MIME and size details",
      "Progress for large reads",
      "No content execution",
    ],
    howToSteps: [
      {
        title: "Choose Encode or Decode",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Provide a File or Base64",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy or Download",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Are decoded files executed?",
        answer: "No. They are downloadable data only.",
      },
      {
        question: "Can I convert images and PDFs?",
        answer: "Yes where the browser can read the file.",
      },
      {
        question: "Is there a size limit?",
        answer: "Yes, to keep the page responsive.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "jwt-decoder",
    name: "JWT Decoder",
    slug: "jwt-decoder",
    category: "security-encoding",
    description:
      "Decode a JSON Web Token into header, payload, and signature sections without verifying authenticity.",
    shortDescription: "Decode JWT header and payload.",
    icon: "shield",
    keywords: [
      "jwt decoder",
      "decode jwt",
      "jwt parser",
      "json web token decoder",
    ],
    popular: true,
    new: true,
    supportedFormats: ["JWT"],
    relatedToolIds: [
      "base64-encoder",
      "base64-decoder",
      "json-formatter",
      "json-validator",
    ],
    seoTitle: "JWT Decoder — Decode JSON Web Tokens Online | Tool Base",
    seoDescription:
      "Decode a JWT into its header, payload, and signature sections with Tool Base. Decoding does not verify the token’s authenticity.",
    h1: "JWT Decoder",
    intro:
      "Paste a JWT to inspect its header and payload as readable JSON. Successful decoding does not mean the token is authentic or verified.",
    convertHeading: "Decode a JSON Web Token",
    howToHeading: "How to Decode a JWT",
    featuresHeading: "Important JWT Security Information",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Developer Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Header and payload JSON view",
      "Signature section display",
      "Decoded — Not Verified labeling",
      "Local-only decoding",
      "Clear malformed-token errors",
    ],
    howToSteps: [
      {
        title: "Paste Your Token",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Decode the Token",
        description: "Run the action or review the live result.",
      },
      {
        title: "Review Header and Payload",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does decoding verify a JWT?",
        answer:
          "No. This tool only decodes. It does not verify signatures or authenticity.",
      },
      {
        question: "Are tokens stored?",
        answer: "No. Tokens stay in temporary UI state.",
      },
      {
        question: "What if the JWT is invalid?",
        answer: "You will see a clear format error.",
      },
      {
        question: "Is payload content executed?",
        answer: "Never. Contents are treated as data.",
      },
    ],
    inputFormats: ["JWT"],
    outputFormats: ["JWT"],
  }),
  tool({
    id: "unix-timestamp-generator",
    name: "Unix Timestamp Generator",
    slug: "unix-timestamp-generator",
    category: "security-encoding",
    description:
      "Generate Unix timestamps in seconds and milliseconds from the current time or a chosen date.",
    shortDescription: "Generate Unix timestamps.",
    icon: "shield",
    keywords: [
      "unix timestamp generator",
      "epoch generator",
      "generate unix timestamp",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "unix-timestamp-converter",
      "uuid-generator",
      "random-number-generator",
      "json-formatter",
    ],
    seoTitle: "Unix Timestamp Generator — Create Epoch Time | Tool Base",
    seoDescription:
      "Generate Unix timestamps online with Tool Base. Get seconds and milliseconds from now or a selected date/time.",
    h1: "Unix Timestamp Generator",
    intro:
      "Generate Unix seconds and milliseconds from the current time or a date/time you choose. Values are computed from real calendar time.",
    convertHeading: "Generate a Unix Timestamp Online",
    howToHeading: "How to Generate a Unix Timestamp",
    featuresHeading: "Unix Timestamp Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Time Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Current time or custom date",
      "Seconds and milliseconds",
      "ISO display",
      "Copy and download",
      "Clear date validation",
    ],
    howToSteps: [
      {
        title: "Choose Now or a Date",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Generate the Timestamp",
        description: "Run the action or review the live result.",
      },
      {
        title: "Copy the Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "What timezone is used?",
        answer:
          "Custom date inputs use your local timezone; ISO output is UTC.",
      },
      {
        question: "Are values fabricated?",
        answer: "No. They come from the selected date/time.",
      },
      {
        question: "Can I convert back?",
        answer: "Yes with the Unix Timestamp Converter.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    slug: "unix-timestamp-converter",
    category: "security-encoding",
    description:
      "Convert Unix timestamps in seconds or milliseconds into local and UTC date/time displays.",
    shortDescription: "Convert Unix time to dates.",
    icon: "shield",
    keywords: [
      "unix timestamp converter",
      "unix timestamp to date",
      "epoch converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "unix-timestamp-generator",
      "uuid-generator",
      "json-formatter",
      "text-cleaner",
    ],
    seoTitle: "Unix Timestamp Converter — Epoch to Date | Tool Base",
    seoDescription:
      "Convert Unix timestamps to human-readable dates online with Tool Base. Choose seconds or milliseconds and review local and UTC time.",
    h1: "Unix Timestamp Converter",
    intro:
      "Convert a Unix timestamp into local and UTC date/time. Choose seconds or milliseconds so large millisecond values are not misread as seconds.",
    convertHeading: "Convert a Unix Timestamp Online",
    howToHeading: "How to Convert a Unix Timestamp",
    featuresHeading: "Unix Timestamp Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Time Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Seconds/milliseconds modes",
      "Local and UTC output",
      "ISO display",
      "Live conversion",
      "Clear invalid-input errors",
    ],
    howToSteps: [
      {
        title: "Enter a Timestamp",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Choose Seconds or Milliseconds",
        description: "Run the action or review the live result.",
      },
      {
        title: "Review Local and UTC",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "How do I know seconds vs milliseconds?",
        answer:
          "Use the mode control. Millisecond timestamps are typically 13 digits for modern dates.",
      },
      {
        question: "Are negatives supported?",
        answer: "Yes within the JavaScript Date range.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    category: "security-encoding",
    description:
      "Generate QR codes from text, URLs, and other payloads with size, color, and error-correction options.",
    shortDescription: "Create downloadable QR codes.",
    icon: "shield",
    keywords: [
      "qr code generator",
      "create qr code",
      "qr generator",
      "generate qr",
    ],
    popular: true,
    new: false,
    supportedFormats: ["QR"],
    relatedToolIds: [
      "base64-file-converter",
      "url-encoder",
      "base64-encoder",
      "text-to-hex",
    ],
    seoTitle: "QR Code Generator — Create QR Codes Online | Tool Base",
    seoDescription:
      "Create customizable QR codes from text, URLs, and other supported content, then download the generated QR image.",
    h1: "QR Code Generator",
    intro:
      "Enter text or a URL to generate a real QR code. Customize size, colors, margin, and error correction, then download PNG or SVG.",
    convertHeading: "Create a QR Code Online",
    howToHeading: "How to Generate a QR Code",
    featuresHeading: "QR Code Options",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real QR generation",
      "PNG and SVG download",
      "Error-correction levels",
      "Color and size controls",
      "Contrast warning when needed",
    ],
    howToSteps: [
      {
        title: "Enter Your Content",
        description: "Provide the input or options for this tool.",
      },
      {
        title: "Customize Your QR Code",
        description: "Run the action or review the live result.",
      },
      {
        title: "Download Your QR Code",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is the QR decorative only?",
        answer: "No. The preview and downloads contain the actual payload.",
      },
      {
        question: "Can low-contrast colors fail?",
        answer: "Yes. A warning appears when contrast is poor.",
      },
      {
        question: "What payloads work?",
        answer: "Plain text, URLs, and other text-based payloads.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["QR"],
    outputFormats: ["QR"],
  }),
];
