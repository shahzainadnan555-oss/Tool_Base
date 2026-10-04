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

/** Audio tools — Prompt 6 */
export const audioTools: ToolDefinition[] = [
  tool({
    id: "mp3-to-wav",
    name: "MP3 to WAV Converter",
    slug: "mp3-to-wav",
    category: "audio-tools",
    description:
      "Convert MP3 files to WAV with real decoding and uncompressed PCM output.",
    shortDescription: "Convert MP3 audio to WAV format.",
    icon: "audio",
    keywords: [
      "mp3 to wav",
      "convert mp3 to wav",
      "mp3 wav converter",
      "audio converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["MP3", "WAV"],
    relatedToolIds: [
      "wav-to-mp3",
      "mp3-to-aac",
      "mp3-to-ogg",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "MP3 to WAV Converter — Free Online | Tool Base",
    seoDescription:
      "Convert MP3 to WAV online with Tool Base. Decode MP3 and download a valid WAV file for free.",
    h1: "MP3 to WAV Converter",
    intro:
      "Convert MP3 to WAV when you need an uncompressed PCM file for editing or archiving. WAV stores the decoded signal without MP3 compression — it does not restore detail already lost in the MP3.",
    convertHeading: "Convert MP3 to WAV Online",
    howToHeading: "How to Convert MP3 to WAV",
    featuresHeading: "MP3 to WAV Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real MP3 decoding to WAV",
      "Valid uncompressed WAV output",
      "Upload, convert, and download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your MP3",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your WAV",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does converting MP3 to WAV improve audio quality?",
        answer:
          "No. WAV is uncompressed, but converting from MP3 cannot restore information already discarded by lossy compression.",
      },
      {
        question: "Is the output a real WAV file?",
        answer:
          "Yes. Tool Base decodes the MP3 and writes a valid WAV container you can download and play.",
      },
      {
        question: "Do my files leave this device?",
        answer: "Audio stays session for this conversion.",
      },
      {
        question: "What should I use WAV for?",
        answer:
          "WAV is useful for editing, archiving, or workflows that expect an uncompressed PCM file.",
      },
    ],
    inputFormats: ["MP3"],
    outputFormats: ["WAV"],
  }),
  tool({
    id: "wav-to-mp3",
    name: "WAV to MP3 Converter",
    slug: "wav-to-mp3",
    category: "audio-tools",
    description:
      "Convert WAV audio to MP3 with practical bitrate choices and real encoding.",
    shortDescription: "Convert WAV audio to MP3 format.",
    icon: "audio",
    keywords: ["wav to mp3", "convert wav to mp3", "wav mp3 converter"],
    popular: true,
    new: false,
    supportedFormats: ["MP3", "WAV"],
    relatedToolIds: [
      "mp3-to-wav",
      "audio-compressor",
      "m4a-to-mp3",
      "flac-to-mp3",
      "audio-metadata-viewer",
    ],
    seoTitle: "WAV to MP3 Converter — Free Online | Tool Base",
    seoDescription:
      "Convert WAV to MP3 online with Tool Base. Compress WAV into a real MP3 file for free.",
    h1: "WAV to MP3 Converter",
    intro:
      "Compress large WAV recordings into MP3 for sharing and storage. Bitrate choices trade file size against retained detail.",
    convertHeading: "Convert WAV to MP3 Online",
    howToHeading: "How to Convert WAV to MP3",
    featuresHeading: "WAV to MP3 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real WAV to MP3 encoding",
      "Practical quality settings",
      "Clear convert and download flow",
      "No account required",
      "Works on mobile and desktop",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your WAV",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Will MP3 sound identical to WAV?",
        answer:
          "MP3 is lossy. Higher bitrates keep more detail; lower bitrates create smaller files with more compression.",
      },
      {
        question: "Can I choose quality?",
        answer:
          "Yes. Pick a bitrate-oriented quality setting that balances size and clarity.",
      },
      {
        question: "Is encoding real?",
        answer:
          "Yes. Tool Base encodes a genuine MP3 bitstream rather than renaming the file.",
      },
      {
        question: "Are uploads stored?",
        answer: "No. Processing stays for this tool.",
      },
    ],
    inputFormats: ["WAV"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "mp3-to-aac",
    name: "MP3 to AAC Converter",
    slug: "mp3-to-aac",
    category: "audio-tools",
    description:
      "Convert MP3 to AAC with a genuine encode pipeline when supported.",
    shortDescription: "Convert MP3 audio to AAC format.",
    icon: "audio",
    keywords: ["mp3 to aac", "convert mp3 to aac", "mp3 aac converter"],
    popular: true,
    new: false,
    supportedFormats: ["AAC", "MP3"],
    relatedToolIds: [
      "aac-to-mp3",
      "mp3-to-m4a",
      "mp3-to-ogg",
      "wav-to-mp3",
      "audio-compressor",
    ],
    seoTitle: "MP3 to AAC Converter — Free Online | Tool Base",
    seoDescription:
      "Convert MP3 to AAC online with Tool Base. Create AAC audio from MP3 when encoding is supported.",
    h1: "MP3 to AAC Converter",
    intro:
      "Turn MP3 into AAC when you need an AAC bitstream. If decoding or encoding cannot complete, Tool Base shows a clear error instead of a fake success.",
    convertHeading: "Convert MP3 to AAC Online",
    howToHeading: "How to Convert MP3 to AAC",
    featuresHeading: "MP3 to AAC Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Genuine MP3 to AAC conversion",
      "Clear errors for unsupported cases",
      "Simple upload and download flow",
      "No account required",
      "Responsive workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your MP3",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your AAC",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "When would AAC fail?",
        answer:
          "If the encoder or input cannot be handled, Tool Base shows a clear error instead of pretending success.",
      },
      {
        question: "Is AAC smaller than MP3?",
        answer:
          "Often yes at similar perceived quality, but results depend on bitrate and content.",
      },
      {
        question: "Do you rename the extension only?",
        answer: "No. The audio is decoded and re-encoded.",
      },
      {
        question: "Is my audio uploaded?",
        answer: "No. Conversion runs session.",
      },
    ],
    inputFormats: ["MP3"],
    outputFormats: ["AAC"],
  }),
  tool({
    id: "aac-to-mp3",
    name: "AAC to MP3 Converter",
    slug: "aac-to-mp3",
    category: "audio-tools",
    description:
      "Convert AAC to MP3 for common AAC inputs the decoder can read.",
    shortDescription: "Convert AAC audio to MP3 format.",
    icon: "audio",
    keywords: ["aac to mp3", "convert aac to mp3", "aac mp3 converter"],
    popular: false,
    new: false,
    supportedFormats: ["AAC", "M4A", "MP3"],
    relatedToolIds: [
      "mp3-to-aac",
      "m4a-to-mp3",
      "wav-to-mp3",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "AAC to MP3 Converter — Free Online | Tool Base",
    seoDescription:
      "Convert AAC to MP3 online with Tool Base. Decode supported AAC audio and download a real MP3.",
    h1: "AAC to MP3 Converter",
    intro:
      "Convert AAC audio to MP3 when the decoder can read the file. Unsupported codecs produce a clear error rather than a broken download.",
    convertHeading: "Convert AAC to MP3 Online",
    howToHeading: "How to Convert AAC to MP3",
    featuresHeading: "AAC to MP3 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "AAC to MP3 for supported inputs",
      "Real MP3 encoding",
      "Helpful unsupported-codec errors",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your AAC",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Which AAC files work?",
        answer:
          "Common AAC streams that the decoder can read. Unsupported codecs show a clear error.",
      },
      {
        question: "Will quality stay the same?",
        answer: "Re-encoding from lossy AAC to MP3 cannot recover lost detail.",
      },
      {
        question: "Is output a real MP3?",
        answer: "Yes. Tool Base writes an encoded MP3 file.",
      },
      {
        question: "Private processing?",
        answer: "Yes. Files stay for this conversion.",
      },
    ],
    inputFormats: ["AAC", "M4A"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "mp3-to-ogg",
    name: "MP3 to OGG Converter",
    slug: "mp3-to-ogg",
    category: "audio-tools",
    description: "Convert MP3 to OGG and download a valid OGG audio file.",
    shortDescription: "Convert MP3 audio to OGG format.",
    icon: "audio",
    keywords: ["mp3 to ogg", "convert mp3 to ogg", "mp3 ogg converter"],
    popular: false,
    new: false,
    supportedFormats: ["MP3", "OGG"],
    relatedToolIds: [
      "ogg-to-mp3",
      "mp3-to-aac",
      "mp3-to-wav",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "MP3 to OGG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert MP3 to OGG online with Tool Base. Create a valid OGG audio file from MP3 for free.",
    h1: "MP3 to OGG Converter",
    intro:
      "Create OGG audio from MP3 with genuine encoding. Output uses a real OGG container and matching file type.",
    convertHeading: "Convert MP3 to OGG Online",
    howToHeading: "How to Convert MP3 to OGG",
    featuresHeading: "MP3 to OGG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real MP3 to OGG encoding",
      "Valid OGG output",
      "Simple convert workflow",
      "No account required",
      "Works across devices",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your MP3",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your OGG",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the OGG file valid?",
        answer: "Yes. Output uses a real OGG container and matching MIME type.",
      },
      {
        question: "Why choose OGG?",
        answer:
          "OGG is widely used for open web audio and can be efficient at moderate bitrates.",
      },
      {
        question: "Fake rename?",
        answer: "No. The MP3 is decoded and re-encoded.",
      },
      {
        question: "Uploads?",
        answer: "Audio stays on your device during conversion.",
      },
    ],
    inputFormats: ["MP3"],
    outputFormats: ["OGG"],
  }),
  tool({
    id: "ogg-to-mp3",
    name: "OGG to MP3 Converter",
    slug: "ogg-to-mp3",
    category: "audio-tools",
    description:
      "Convert OGG to MP3 when decoding is supported, with graceful unsupported-codec handling.",
    shortDescription: "Convert OGG audio to MP3 format.",
    icon: "audio",
    keywords: ["ogg to mp3", "convert ogg to mp3", "ogg mp3 converter"],
    popular: false,
    new: false,
    supportedFormats: ["MP3", "OGG"],
    relatedToolIds: [
      "mp3-to-ogg",
      "wav-to-mp3",
      "flac-to-mp3",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "OGG to MP3 Converter — Free Online | Tool Base",
    seoDescription:
      "Convert OGG to MP3 online with Tool Base. Decode supported OGG audio and download MP3.",
    h1: "OGG to MP3 Converter",
    intro:
      "Turn OGG audio into MP3 when decoding succeeds. Unusual codecs are reported clearly instead of producing a broken file.",
    convertHeading: "Convert OGG to MP3 Online",
    howToHeading: "How to Convert OGG to MP3",
    featuresHeading: "OGG to MP3 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "OGG to MP3 conversion",
      "Graceful unsupported codec handling",
      "Real MP3 output",
      "No account required",
      "Responsive tool page",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your OGG",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "What if my OGG uses an unusual codec?",
        answer:
          "Tool Base reports an unsupported codec instead of producing a broken file.",
      },
      {
        question: "Is re-encoding lossless?",
        answer: "No. MP3 is lossy; choose a bitrate that fits your needs.",
      },
      {
        question: "Real MP3 output?",
        answer: "Yes. Encoding produces a playable MP3.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["OGG"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "flac-to-mp3",
    name: "FLAC to MP3 Converter",
    slug: "flac-to-mp3",
    category: "audio-tools",
    description:
      "Convert FLAC to MP3 while preserving practical listening quality with bitrate control.",
    shortDescription: "Convert FLAC audio to MP3 format.",
    icon: "audio",
    keywords: ["flac to mp3", "convert flac to mp3", "flac mp3 converter"],
    popular: true,
    new: false,
    supportedFormats: ["FLAC", "MP3"],
    relatedToolIds: [
      "mp3-to-flac",
      "wav-to-mp3",
      "audio-compressor",
      "m4a-to-mp3",
      "audio-metadata-viewer",
    ],
    seoTitle: "FLAC to MP3 Converter — Free Online | Tool Base",
    seoDescription:
      "Convert FLAC to MP3 online with Tool Base. Compress FLAC into MP3 with clear quality settings.",
    h1: "FLAC to MP3 Converter",
    intro:
      "Compress FLAC into MP3 for everyday sharing. Higher bitrates retain more detail from the lossless source.",
    convertHeading: "Convert FLAC to MP3 Online",
    howToHeading: "How to Convert FLAC to MP3",
    featuresHeading: "FLAC to MP3 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "FLAC decoding to MP3",
      "Quality-oriented bitrate choices",
      "Clear convert and download steps",
      "No account required",
      "Mobile-friendly layout",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your FLAC",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Will MP3 keep FLAC quality?",
        answer:
          "MP3 is lossy. Higher bitrates retain more detail from the FLAC source.",
      },
      {
        question: "Can I pick bitrate?",
        answer: "Yes. Choose a setting that balances size and clarity.",
      },
      {
        question: "Is encoding real?",
        answer: "Yes. Tool Base decodes FLAC and encodes MP3.",
      },
      {
        question: "Stored online?",
        answer: "No. Conversion stays session.",
      },
    ],
    inputFormats: ["FLAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "mp3-to-flac",
    name: "MP3 to FLAC Converter",
    slug: "mp3-to-flac",
    category: "audio-tools",
    description:
      "Convert MP3 to FLAC. FLAC is lossless, but an MP3 source cannot regain lost detail.",
    shortDescription: "Convert MP3 audio to FLAC format.",
    icon: "audio",
    keywords: ["mp3 to flac", "convert mp3 to flac", "mp3 flac converter"],
    popular: false,
    new: false,
    supportedFormats: ["FLAC", "MP3"],
    relatedToolIds: [
      "flac-to-mp3",
      "mp3-to-wav",
      "audio-compressor",
      "audio-metadata-viewer",
      "wav-to-mp3",
    ],
    seoTitle: "MP3 to FLAC Converter — Free Online | Tool Base",
    seoDescription:
      "Convert MP3 to FLAC online with Tool Base. Save MP3 as FLAC without claiming restored quality.",
    h1: "MP3 to FLAC Converter",
    intro:
      "Save an MP3 as FLAC when a workflow expects a lossless container. FLAC stores the decoded MP3 signal losslessly, but it cannot recover information MP3 already discarded.",
    convertHeading: "Convert MP3 to FLAC Online",
    howToHeading: "How to Convert MP3 to FLAC",
    featuresHeading: "MP3 to FLAC Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real MP3 to FLAC encoding",
      "Accurate quality expectations",
      "Valid FLAC download",
      "No account required",
      "Clear notices before convert",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your MP3",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your FLAC",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does MP3 to FLAC restore quality?",
        answer:
          "No. FLAC stores the decoded MP3 signal losslessly, but it cannot recover information MP3 already discarded.",
      },
      {
        question: "Why convert anyway?",
        answer:
          "Some workflows prefer FLAC containers even when the source was lossy.",
      },
      {
        question: "Is output real FLAC?",
        answer: "Yes. Tool Base encodes a valid FLAC file.",
      },
      {
        question: "Private conversion?",
        answer: "Yes. Files remain.",
      },
    ],
    inputFormats: ["MP3"],
    outputFormats: ["FLAC"],
  }),
  tool({
    id: "m4a-to-mp3",
    name: "M4A to MP3 Converter",
    slug: "m4a-to-mp3",
    category: "audio-tools",
    description: "Convert M4A to MP3 for common AAC-in-M4A inputs.",
    shortDescription: "Convert M4A audio to MP3 format.",
    icon: "audio",
    keywords: ["m4a to mp3", "convert m4a to mp3", "m4a mp3 converter"],
    popular: true,
    new: false,
    supportedFormats: ["M4A", "MP3"],
    relatedToolIds: [
      "mp3-to-m4a",
      "aac-to-mp3",
      "wav-to-mp3",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "M4A to MP3 Converter — Free Online | Tool Base",
    seoDescription:
      "Convert M4A to MP3 online with Tool Base. Turn common M4A/AAC audio into MP3 for free.",
    h1: "M4A to MP3 Converter",
    intro:
      "Convert M4A/AAC audio to MP3 when the decoder can read the file. Unsupported codecs show a clear error.",
    convertHeading: "Convert M4A to MP3 Online",
    howToHeading: "How to Convert M4A to MP3",
    featuresHeading: "M4A to MP3 Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "M4A to MP3 for supported inputs",
      "Real encode pipeline",
      "Codec validation feedback",
      "No account required",
      "Responsive controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your M4A",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Which M4A files work?",
        answer:
          "Common AAC-in-M4A files the decoder can read. Unsupported codecs show a clear error.",
      },
      {
        question: "Quality after conversion?",
        answer: "Re-encoding is lossy-to-lossy; pick a sensible bitrate.",
      },
      {
        question: "Real MP3?",
        answer: "Yes. Output is encoded, not renamed.",
      },
      {
        question: "Uploads stored?",
        answer: "No. Processing stays local to your browser.",
      },
    ],
    inputFormats: ["M4A"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "mp3-to-m4a",
    name: "MP3 to M4A Converter",
    slug: "mp3-to-m4a",
    category: "audio-tools",
    description:
      "Convert MP3 to M4A with a genuine AAC-in-M4A encode pipeline.",
    shortDescription: "Convert MP3 audio to M4A format.",
    icon: "audio",
    keywords: ["mp3 to m4a", "convert mp3 to m4a", "mp3 m4a converter"],
    popular: false,
    new: false,
    supportedFormats: ["M4A", "MP3"],
    relatedToolIds: [
      "m4a-to-mp3",
      "mp3-to-aac",
      "wav-to-mp3",
      "audio-compressor",
      "audio-metadata-viewer",
    ],
    seoTitle: "MP3 to M4A Converter — Free Online | Tool Base",
    seoDescription:
      "Convert MP3 to M4A online with Tool Base. Create M4A audio from MP3 with real encoding.",
    h1: "MP3 to M4A Converter",
    intro:
      "Create M4A audio from MP3 using a real encode pipeline. M4A is a common container for AAC audio.",
    convertHeading: "Convert MP3 to M4A Online",
    howToHeading: "How to Convert MP3 to M4A",
    featuresHeading: "MP3 to M4A Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Genuine MP3 to M4A conversion",
      "Practical quality settings",
      "Valid M4A download",
      "No account required",
      "Works on phone and desktop",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Convert Your MP3",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your M4A",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is M4A the same as AAC?",
        answer:
          "M4A is a common container for AAC audio. Tool Base writes a real M4A file when encoding succeeds.",
      },
      {
        question: "Fake extension change?",
        answer: "No. Audio is decoded and re-encoded.",
      },
      {
        question: "Bitrate options?",
        answer: "Yes. Choose a practical quality setting.",
      },
      {
        question: "Private?",
        answer: "Yes. Conversion stays.",
      },
    ],
    inputFormats: ["MP3"],
    outputFormats: ["M4A"],
  }),
  tool({
    id: "audio-compressor",
    name: "Audio Compressor",
    slug: "audio-compressor",
    category: "audio-tools",
    description:
      "Compress audio online to reduce file size with measured before and after sizes.",
    shortDescription: "Compress audio files to reduce size.",
    icon: "audio",
    keywords: [
      "audio compressor",
      "compress audio",
      "reduce audio file size",
      "compress mp3",
    ],
    popular: true,
    new: false,
    supportedFormats: ["FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "wav-to-mp3",
      "flac-to-mp3",
      "audio-trimmer",
      "audio-metadata-viewer",
      "mp3-to-m4a",
    ],
    seoTitle: "Audio Compressor — Free Online | Tool Base",
    seoDescription:
      "Compress audio online with Tool Base. Reduce file size with real bitrate control and measured savings.",
    h1: "Audio Compressor",
    intro:
      "Reduce audio file size with bitrate-oriented compression. Original and output sizes are measured from the actual files — savings are never invented.",
    convertHeading: "Compress Audio Online",
    howToHeading: "How to Compress Audio",
    featuresHeading: "Audio Compressor Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Measured original and output sizes",
      "Bitrate-oriented compression",
      "Clear compress and download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Compress Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Compressed Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Are size savings real?",
        answer:
          "Yes. Original and output sizes are measured from the actual files.",
      },
      {
        question: "Will quality drop?",
        answer:
          "Lower bitrates reduce size and can reduce clarity. Start with a moderate setting.",
      },
      {
        question: "Supported inputs?",
        answer:
          "Common formats such as MP3, WAV, M4A, OGG, and FLAC when decoding succeeds.",
      },
      {
        question: "Private?",
        answer: "Yes. Compression runs session.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-trimmer",
    name: "Audio Trimmer",
    slug: "audio-trimmer",
    category: "audio-tools",
    description:
      "Trim audio by selecting exact start and end points, then download the clip.",
    shortDescription: "Trim audio to an exact start and end segment.",
    icon: "audio",
    keywords: ["audio trimmer", "trim audio", "cut audio online"],
    popular: true,
    new: false,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-cutter",
      "audio-joiner",
      "audio-speed-changer",
      "audio-volume-booster",
      "silence-remover",
    ],
    seoTitle: "Audio Trimmer — Free Online | Tool Base",
    seoDescription:
      "Trim audio online with Tool Base. Select start and end times and download an exact audio segment.",
    h1: "Audio Trimmer",
    intro:
      "Select exact start and end times to export only the segment you need. Selected duration updates as you adjust the range, and Trim Audio writes that segment into a real download.",
    convertHeading: "Trim Audio Online",
    howToHeading: "How to Trim Audio",
    featuresHeading: "Audio Trimmer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Exact start and end controls",
      "Selected duration display",
      "Real segment export",
      "No account required",
      "Responsive player and controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Trim Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Trimmed Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is trimming real?",
        answer: "Yes. Tool Base exports only the selected time range.",
      },
      {
        question: "Can I hear the selection?",
        answer:
          "Use the preview player and the shown selected duration before trimming.",
      },
      {
        question: "What formats work?",
        answer: "Common audio uploads that decode successfully.",
      },
      {
        question: "Private edits?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-cutter",
    name: "Audio Cutter",
    slug: "audio-cutter",
    category: "audio-tools",
    description:
      "Cut audio with a timeline selection, play the region, then export the cut.",
    shortDescription: "Cut audio with timeline start and end selection.",
    icon: "audio",
    keywords: ["audio cutter", "cut audio", "audio cut tool"],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-trimmer",
      "audio-joiner",
      "audio-speed-changer",
      "silence-remover",
      "audio-volume-booster",
    ],
    seoTitle: "Audio Cutter — Free Online | Tool Base",
    seoDescription:
      "Cut audio online with Tool Base. Select start and end points, preview the region, and download the cut.",
    h1: "Audio Cutter",
    intro:
      "Cut audio with a timeline selection and optional playback of the chosen region before export. Start and end points drive a real cut.",
    convertHeading: "Cut Audio Online",
    howToHeading: "How to Cut Audio",
    featuresHeading: "Audio Cutter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Timeline start and end selection",
      "Play selected region",
      "Real audio cut export",
      "No account required",
      "Touch-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Cut Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Cut Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Difference from trimmer?",
        answer:
          "Both export a segment. The cutter emphasizes timeline selection and playing the chosen region.",
      },
      {
        question: "Is the cut exact?",
        answer: "Yes. Processing uses the selected start and end times.",
      },
      {
        question: "Can I play the region?",
        answer: "Yes. Use Play Selected Region before cutting.",
      },
      {
        question: "Private?",
        answer: "Yes. Edits stay.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-joiner",
    name: "Audio Joiner",
    slug: "audio-joiner",
    category: "audio-tools",
    description:
      "Join multiple audio files in exact order and download one continuous track.",
    shortDescription: "Join multiple audio files into one track.",
    icon: "audio",
    keywords: ["audio joiner", "join audio", "merge audio", "combine audio"],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-trimmer",
      "audio-cutter",
      "audio-speed-changer",
      "audio-volume-booster",
      "audio-compressor",
    ],
    seoTitle: "Audio Joiner — Free Online | Tool Base",
    seoDescription:
      "Join audio online with Tool Base. Add, reorder, and combine clips into one downloadable track.",
    h1: "Audio Joiner",
    intro:
      "Combine multiple audio files into one continuous track in the exact order you arrange. Add, remove, and reorder clips, then join into a single downloadable file.",
    convertHeading: "Join Audio Online",
    howToHeading: "How to Join Audio",
    featuresHeading: "Audio Joiner Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Add, remove, and reorder files",
      "Exact join order",
      "Preview before joining",
      "No account required",
      "Handles common format mixes",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Join Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Joined Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is order preserved?",
        answer: "Yes. Files are joined in the list order you set.",
      },
      {
        question: "Different formats?",
        answer:
          "Compatible differences are handled by decoding and concatenating into one output.",
      },
      {
        question: "Can I preview clips?",
        answer: "Yes. Each item can be previewed before joining.",
      },
      {
        question: "Private merge?",
        answer: "Yes. Joining stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-volume-booster",
    name: "Audio Volume Booster",
    slug: "audio-volume-booster",
    category: "audio-tools",
    description:
      "Adjust audio volume with sensible gain control and clipping guidance.",
    shortDescription: "Boost or reduce audio volume with gain control.",
    icon: "audio",
    keywords: [
      "audio volume booster",
      "boost audio volume",
      "increase audio volume",
    ],
    popular: false,
    new: false,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-speed-changer",
      "audio-pitch-changer",
      "audio-trimmer",
      "audio-compressor",
      "silence-remover",
    ],
    seoTitle: "Audio Volume Booster — Free Online | Tool Base",
    seoDescription:
      "Boost audio volume online with Tool Base. Adjust gain carefully and download a real processed file.",
    h1: "Audio Volume Booster",
    intro:
      "Raise or lower loudness with a gain control designed for practical adjustments. Excessive boost can clip and distort — start with a modest value.",
    convertHeading: "Boost Audio Volume Online",
    howToHeading: "How to Boost Audio Volume",
    featuresHeading: "Audio Volume Booster Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real gain processing",
      "Clipping guidance",
      "Preview before download",
      "No account required",
      "Accessible slider controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Boost Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Boosted Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Can gain cause distortion?",
        answer:
          "Yes. Excessive boost can clip and sound harsh. Use moderate values and preview when possible.",
      },
      {
        question: "Is processing real?",
        answer: "Yes. Output is re-encoded with the applied gain.",
      },
      {
        question: "Can I lower volume too?",
        answer: "Yes. Gain can reduce as well as increase level.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-speed-changer",
    name: "Audio Speed Changer",
    slug: "audio-speed-changer",
    category: "audio-tools",
    description:
      "Change audio playback speed so the output duration actually shortens or lengthens.",
    shortDescription: "Change audio speed so duration updates.",
    icon: "audio",
    keywords: [
      "audio speed changer",
      "change audio speed",
      "speed up audio",
      "slow down audio",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-pitch-changer",
      "audio-trimmer",
      "audio-volume-booster",
      "audio-cutter",
      "silence-remover",
    ],
    seoTitle: "Audio Speed Changer — Free Online | Tool Base",
    seoDescription:
      "Change audio speed online with Tool Base. Speed up or slow down from 0.5x to 2x and download the result.",
    h1: "Audio Speed Changer",
    intro:
      "Change playback speed so the output duration actually shortens or lengthens. Choose from 0.5x, 0.75x, 1.25x, 1.5x, and 2x.",
    convertHeading: "Change Audio Speed Online",
    howToHeading: "How to Change Audio Speed",
    featuresHeading: "Audio Speed Changer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real duration-changing speed edits",
      "Preset speeds from 0.5x to 2x",
      "Clear process and download flow",
      "No account required",
      "Works on mobile",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Change Your Audio Speed",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Speed-Adjusted Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does duration change?",
        answer:
          "Yes. Faster speeds shorten the file; slower speeds lengthen it.",
      },
      {
        question: "Available speeds?",
        answer: "0.5x, 0.75x, 1x, 1.25x, 1.5x, and 2x.",
      },
      {
        question: "Pitch side effects?",
        answer:
          "Simple tempo changes can affect perceived pitch. Use the pitch tool for pitch-focused edits.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-pitch-changer",
    name: "Audio Pitch Changer",
    slug: "audio-pitch-changer",
    category: "audio-tools",
    description:
      "Shift audio pitch with DSP-oriented processing that aims to keep duration stable.",
    shortDescription: "Shift audio pitch without speed-only tricks.",
    icon: "audio",
    keywords: [
      "audio pitch changer",
      "change audio pitch",
      "pitch shift audio",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-speed-changer",
      "audio-volume-booster",
      "audio-trimmer",
      "audio-waveform-generator",
      "silence-remover",
    ],
    seoTitle: "Audio Pitch Changer — Free Online | Tool Base",
    seoDescription:
      "Change audio pitch online with Tool Base. Raise or lower pitch without presenting speed-only playback as pitch shifting.",
    h1: "Audio Pitch Changer",
    intro:
      "Shift pitch with a DSP-oriented approach rather than presenting speed-only playback as pitch shifting. Small semitone moves are usually cleaner than extreme shifts.",
    convertHeading: "Change Audio Pitch Online",
    howToHeading: "How to Change Audio Pitch",
    featuresHeading: "Audio Pitch Changer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Pitch shifting with duration control",
      "Semitone adjustment",
      "Real processed download",
      "No account required",
      "Clear guidance on artifacts",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Change Your Audio Pitch",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Pitch-Adjusted Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is this just speed change?",
        answer:
          "No. Pitch shifting aims to change pitch while keeping tempo closer to the original where the pipeline allows.",
      },
      {
        question: "How much can I shift?",
        answer: "Use the semitone control for small, controlled adjustments.",
      },
      {
        question: "Will quality stay perfect?",
        answer:
          "Pitch shifting is an approximation and can introduce artifacts at extreme settings.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "audio-waveform-generator",
    name: "Audio Waveform Generator",
    slug: "audio-waveform-generator",
    category: "audio-tools",
    description:
      "Create a waveform visualization from uploaded audio and download the image.",
    shortDescription: "Generate a waveform image from real audio.",
    icon: "audio",
    keywords: [
      "audio waveform generator",
      "audio waveform",
      "generate waveform",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "PNG", "WAV"],
    relatedToolIds: [
      "audio-metadata-viewer",
      "audio-trimmer",
      "audio-cutter",
      "silence-remover",
      "audio-volume-booster",
    ],
    seoTitle: "Audio Waveform Generator — Free Online | Tool Base",
    seoDescription:
      "Generate an audio waveform online with Tool Base. Create a PNG from your real uploaded audio.",
    h1: "Audio Waveform Generator",
    intro:
      "Build a waveform image from the samples in your uploaded audio — not a generic decoration. Preview the source, generate the visualization, and download a PNG.",
    convertHeading: "Generate Audio Waveform Online",
    howToHeading: "How to Generate an Audio Waveform",
    featuresHeading: "Audio Waveform Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Waveform from real audio samples",
      "PNG download",
      "Responsive preview",
      "No account required",
      "Clear generate flow",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Generate Your Waveform",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Waveform Image",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the waveform real?",
        answer:
          "Yes. Peaks are computed from the uploaded audio, not a decorative placeholder.",
      },
      {
        question: "Can I download an image?",
        answer: "Yes. Export a PNG of the generated waveform.",
      },
      {
        question: "Does it play audio?",
        answer: "You can preview the source audio before generating the image.",
      },
      {
        question: "Private?",
        answer: "Yes. Generation stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "audio-metadata-viewer",
    name: "Audio Metadata Viewer",
    slug: "audio-metadata-viewer",
    category: "audio-tools",
    description:
      "Inspect audio metadata such as duration, bitrate, sample rate, channels, and tags when present.",
    shortDescription: "View available audio metadata fields.",
    icon: "audio",
    keywords: ["audio metadata viewer", "audio metadata", "view audio tags"],
    popular: false,
    new: false,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-waveform-generator",
      "audio-compressor",
      "mp3-to-wav",
      "wav-to-mp3",
      "audio-trimmer",
    ],
    seoTitle: "Audio Metadata Viewer — Free Online | Tool Base",
    seoDescription:
      "View audio metadata online with Tool Base. Inspect duration, bitrate, sample rate, channels, and tags when available.",
    h1: "Audio Metadata Viewer",
    intro:
      "Inspect duration, size, format, bitrate, sample rate, channels, codec, and tags when those fields exist. Unavailable values stay blank rather than being invented.",
    convertHeading: "View Audio Metadata Online",
    howToHeading: "How to View Audio Metadata",
    featuresHeading: "Audio Metadata Viewer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Shows only detected fields",
      "Duration, bitrate, and tag support when present",
      "No invented values",
      "No account required",
      "Fast file inspection",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Inspect Your Audio",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Review Detected Fields",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Do you invent missing tags?",
        answer: "No. Only fields that can be read from the file are shown.",
      },
      {
        question: "What details appear?",
        answer:
          "Typical fields include name, format, size, duration, bitrate, sample rate, channels, codec, and tags when available.",
      },
      {
        question: "Can I edit tags here?",
        answer: "This tool focuses on viewing metadata.",
      },
      {
        question: "Private inspection?",
        answer: "Yes. Files stay.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["Metadata"],
  }),
  tool({
    id: "silence-remover",
    name: "Silence Remover",
    slug: "silence-remover",
    category: "audio-tools",
    description:
      "Remove silent segments with conservative threshold and duration controls.",
    shortDescription: "Remove silent segments from audio.",
    icon: "audio",
    keywords: [
      "silence remover",
      "remove silence from audio",
      "audio silence removal",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AAC", "FLAC", "M4A", "MP3", "OGG", "WAV"],
    relatedToolIds: [
      "audio-trimmer",
      "audio-cutter",
      "audio-volume-booster",
      "audio-speed-changer",
      "audio-joiner",
    ],
    seoTitle: "Silence Remover — Free Online | Tool Base",
    seoDescription:
      "Remove silence from audio online with Tool Base. Use conservative defaults and download cleaned audio.",
    h1: "Silence Remover",
    intro:
      "Remove quiet gaps using conservative threshold and minimum-duration defaults. Aggressive settings can clip soft speech or quiet musical passages — start gentle and tighten only if needed.",
    convertHeading: "Remove Silence Online",
    howToHeading: "How to Remove Silence",
    featuresHeading: "Silence Remover Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Audio Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Conservative default thresholds",
      "Adjustable silence detection",
      "Real silence removal",
      "No account required",
      "Clear process feedback",
    ],
    howToSteps: [
      {
        title: "Upload Your Audio",
        description: "Choose the audio file to process.",
      },
      {
        title: "Remove Silence",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Cleaned Audio",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Are defaults aggressive?",
        answer:
          "No. Defaults are conservative to avoid deleting quiet speech or soft music.",
      },
      {
        question: "Can I tune detection?",
        answer: "Yes. Adjust threshold and minimum silence duration.",
      },
      {
        question: "Is removal real?",
        answer:
          "Yes. Detected silent ranges are processed out of the timeline.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC"],
    outputFormats: ["MP3"],
  }),
];
