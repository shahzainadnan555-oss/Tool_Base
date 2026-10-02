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

/** Video tools — Prompt 7 */
export const videoTools: ToolDefinition[] = [
  tool({
    id: "mp4-to-mp3",
    name: "MP4 to MP3 Converter",
    slug: "mp4-to-mp3",
    category: "video-tools",
    description:
      "Convert MP4 videos to MP3 by extracting and encoding the real audio track.",
    shortDescription: "Extract MP4 audio to MP3.",
    icon: "video",
    keywords: [
      "mp4 to mp3",
      "convert mp4 to mp3",
      "mp4 mp3 converter",
      "extract audio from video",
    ],
    popular: true,
    new: false,
    supportedFormats: ["MP3", "MP4"],
    relatedToolIds: [
      "mp4-to-wav",
      "mp4-to-gif",
      "video-compressor",
      "video-thumbnail-extractor",
      "video-metadata-viewer",
    ],
    seoTitle: "MP4 to MP3 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MP4 videos to MP3 audio with ToolMyra. Upload your video, extract the audio, and download the resulting MP3 file online.",
    h1: "MP4 to MP3 Converter",
    intro:
      "Extract the audio from an MP4 video and download a real MP3 file for listening, editing, or sharing.",
    convertHeading: "Convert MP4 to MP3 Online",
    howToHeading: "How to Convert MP4 to MP3",
    featuresHeading: "MP4 to MP3 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real audio extraction from MP4",
      "Genuine MP3 encoding",
      "Simple convert and download flow",
      "No account required",
      "Works on desktop and mobile",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MP4",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP3",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does this keep the video?",
        answer: "No. The result is an MP3 audio file, not a video file.",
      },
      {
        question: "Is the MP3 real?",
        answer:
          "Yes. ToolMyra extracts the audio stream and encodes a playable MP3.",
      },
      {
        question: "Will quality match the source?",
        answer: "Quality depends on the source audio and encoding bitrate.",
      },
      {
        question: "Private conversion?",
        answer: "Processing stays session for this tool.",
      },
    ],
    inputFormats: ["MP4"],
    outputFormats: ["MP3"],
  }),
  tool({
    id: "mp4-to-wav",
    name: "MP4 to WAV Converter",
    slug: "mp4-to-wav",
    category: "video-tools",
    description:
      "Convert MP4 video audio into a valid WAV file with real decoding.",
    shortDescription: "Extract MP4 audio to WAV.",
    icon: "video",
    keywords: ["mp4 to wav", "convert mp4 to wav", "mp4 wav converter"],
    popular: true,
    new: false,
    supportedFormats: ["MP4", "WAV"],
    relatedToolIds: [
      "mp4-to-mp3",
      "video-compressor",
      "video-metadata-viewer",
      "mp4-to-gif",
      "video-trimmer",
    ],
    seoTitle: "MP4 to WAV Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MP4 to WAV online with ToolMyra. Extract audio from MP4 and download a valid WAV file.",
    h1: "MP4 to WAV Converter",
    intro:
      "Extract audio from MP4 into WAV when you need an uncompressed PCM file. WAV does not restore detail already lost in a compressed source.",
    convertHeading: "Convert MP4 to WAV Online",
    howToHeading: "How to Convert MP4 to WAV",
    featuresHeading: "MP4 to WAV Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real MP4 audio extraction",
      "Valid WAV output",
      "Clear convert workflow",
      "No account required",
      "Mobile-friendly player",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MP4",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your WAV",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does WAV restore quality?",
        answer:
          "No. WAV stores the decoded signal but cannot recover information already discarded.",
      },
      {
        question: "Is output a real WAV?",
        answer: "Yes. ToolMyra writes a valid WAV container.",
      },
      {
        question: "Audio only?",
        answer: "Yes. This tool extracts audio, not the video frames.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4"],
    outputFormats: ["WAV"],
  }),
  tool({
    id: "mp4-to-gif",
    name: "MP4 to GIF Converter",
    slug: "mp4-to-gif",
    category: "video-tools",
    description:
      "Convert an MP4 segment into a real animated GIF with optional range and size controls.",
    shortDescription: "Convert MP4 clips to animated GIF.",
    icon: "video",
    keywords: [
      "mp4 to gif",
      "video to gif",
      "convert mp4 to gif",
      "mp4 gif converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["GIF", "MP4"],
    relatedToolIds: [
      "gif-to-mp4",
      "video-trimmer",
      "video-thumbnail-extractor",
      "video-compressor",
      "mp4-to-mp3",
    ],
    seoTitle: "MP4 to GIF Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MP4 to GIF online with ToolMyra. Create an animated GIF from a video clip and download the result.",
    h1: "MP4 to GIF Converter",
    intro:
      "Turn a short MP4 segment into an animated GIF. GIF output has no audio track and works best with brief clips.",
    convertHeading: "Convert MP4 to GIF Online",
    howToHeading: "How to Convert MP4 to GIF",
    featuresHeading: "MP4 to GIF Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real animated GIF output",
      "Optional start and end range",
      "Simple width and frame-rate controls",
      "No account required",
      "Animated result preview",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MP4",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your GIF",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the GIF animated?",
        answer:
          "Yes. The output is a real animated GIF generated from the video frames.",
      },
      {
        question: "Does GIF include audio?",
        answer: "No. GIF does not carry an audio track.",
      },
      {
        question: "Can I choose a segment?",
        answer: "Yes. Set start and end times when you need a shorter clip.",
      },
      {
        question: "Private?",
        answer: "Yes. Conversion stays.",
      },
    ],
    inputFormats: ["MP4"],
    outputFormats: ["GIF"],
  }),
  tool({
    id: "gif-to-mp4",
    name: "GIF to MP4 Converter",
    slug: "gif-to-mp4",
    category: "video-tools",
    description:
      "Convert an animated GIF into a playable MP4 video with real encoding.",
    shortDescription: "Convert animated GIF to MP4.",
    icon: "video",
    keywords: ["gif to mp4", "convert gif to mp4", "gif mp4 converter"],
    popular: false,
    new: false,
    supportedFormats: ["GIF", "MP4"],
    relatedToolIds: [
      "mp4-to-gif",
      "video-compressor",
      "video-resizer",
      "video-trimmer",
      "video-metadata-viewer",
    ],
    seoTitle: "GIF to MP4 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert GIF to MP4 online with ToolMyra. Turn an animated GIF into a readable MP4 video file.",
    h1: "GIF to MP4 Converter",
    intro:
      "Preserve an animated GIF as MP4 video for easier sharing and playback. The animation sequence is encoded into a real video file.",
    convertHeading: "Convert GIF to MP4 Online",
    howToHeading: "How to Convert GIF to MP4",
    featuresHeading: "GIF to MP4 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real GIF animation encoding",
      "Playable MP4 output",
      "Simple upload and convert flow",
      "No account required",
      "Responsive preview",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your GIF",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP4",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Do you rename the extension?",
        answer: "No. The GIF frames are encoded into a real MP4.",
      },
      {
        question: "Will the animation stay?",
        answer: "Yes. The animated sequence becomes video frames.",
      },
      {
        question: "Audio?",
        answer: "Most GIFs have no audio; the MP4 focuses on the animation.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["GIF"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "mov-to-mp4",
    name: "MOV to MP4 Converter",
    slug: "mov-to-mp4",
    category: "video-tools",
    description:
      "Convert MOV files to MP4 with genuine transcoding when codecs are supported.",
    shortDescription: "Convert MOV videos to MP4.",
    icon: "video",
    keywords: ["mov to mp4", "convert mov to mp4", "mov mp4 converter"],
    popular: true,
    new: false,
    supportedFormats: ["MOV", "MP4"],
    relatedToolIds: [
      "avi-to-mp4",
      "mkv-to-mp4",
      "webm-to-mp4",
      "video-compressor",
      "mp4-to-webm",
    ],
    seoTitle: "MOV to MP4 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MOV to MP4 online with ToolMyra. Transcode MOV video into a playable MP4 when the codec is supported.",
    h1: "MOV to MP4 Converter",
    intro:
      "Convert MOV recordings to MP4 for broader playback support. Unsupported codecs show a clear error instead of a broken file.",
    convertHeading: "Convert MOV to MP4 Online",
    howToHeading: "How to Convert MOV to MP4",
    featuresHeading: "MOV to MP4 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Genuine MOV to MP4 conversion",
      "Clear unsupported-codec errors",
      "Preserves video when decoding succeeds",
      "No account required",
      "Works on mobile and desktop",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MOV",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP4",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "What if my MOV codec fails?",
        answer:
          "ToolMyra shows a clear error rather than producing a broken file.",
      },
      {
        question: "Is audio kept?",
        answer:
          "Audio is preserved when the source can be decoded and re-encoded.",
      },
      {
        question: "Real conversion?",
        answer: "Yes. The video is transcoded, not renamed.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MOV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "avi-to-mp4",
    name: "AVI to MP4 Converter",
    slug: "avi-to-mp4",
    category: "video-tools",
    description: "Convert AVI files to MP4 with real video transcoding.",
    shortDescription: "Convert AVI videos to MP4.",
    icon: "video",
    keywords: ["avi to mp4", "convert avi to mp4", "avi mp4 converter"],
    popular: false,
    new: false,
    supportedFormats: ["AVI", "MP4"],
    relatedToolIds: [
      "mov-to-mp4",
      "mkv-to-mp4",
      "webm-to-mp4",
      "video-compressor",
      "video-resizer",
    ],
    seoTitle: "AVI to MP4 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert AVI to MP4 online with ToolMyra. Transcode AVI video into a valid MP4 file.",
    h1: "AVI to MP4 Converter",
    intro:
      "Convert older AVI files into MP4 for modern players and sharing. Output is validated before download is enabled.",
    convertHeading: "Convert AVI to MP4 Online",
    howToHeading: "How to Convert AVI to MP4",
    featuresHeading: "AVI to MP4 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real AVI transcoding",
      "Valid MP4 output",
      "Clear error recovery",
      "No account required",
      "Responsive workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your AVI",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP4",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is conversion real?",
        answer: "Yes. ToolMyra transcodes the video stream.",
      },
      {
        question: "Unsupported codecs?",
        answer: "You get a clear error instead of a fake success.",
      },
      {
        question: "Audio included?",
        answer: "Audio is included when decoding succeeds.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["AVI"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "mkv-to-mp4",
    name: "MKV to MP4 Converter",
    slug: "mkv-to-mp4",
    category: "video-tools",
    description:
      "Convert MKV files to MP4 for common supported video and audio streams.",
    shortDescription: "Convert MKV videos to MP4.",
    icon: "video",
    keywords: ["mkv to mp4", "convert mkv to mp4", "mkv mp4 converter"],
    popular: false,
    new: false,
    supportedFormats: ["MKV", "MP4"],
    relatedToolIds: [
      "mov-to-mp4",
      "avi-to-mp4",
      "webm-to-mp4",
      "video-compressor",
      "video-metadata-viewer",
    ],
    seoTitle: "MKV to MP4 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MKV to MP4 online with ToolMyra. Transcode supported MKV streams into MP4.",
    h1: "MKV to MP4 Converter",
    intro:
      "Convert MKV containers to MP4 when streams can be decoded. Unsupported codecs are reported clearly.",
    convertHeading: "Convert MKV to MP4 Online",
    howToHeading: "How to Convert MKV to MP4",
    featuresHeading: "MKV to MP4 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "MKV to MP4 for supported streams",
      "Clear unsupported codec handling",
      "Playable MP4 download",
      "No account required",
      "Clean convert workflow",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MKV",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP4",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "What if a stream is unsupported?",
        answer: "ToolMyra shows a clear error rather than a broken file.",
      },
      {
        question: "Is remux always enough?",
        answer: "This tool transcodes to maximize compatibility.",
      },
      {
        question: "Real output?",
        answer: "Yes. You download a real MP4.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "webm-to-mp4",
    name: "WebM to MP4 Converter",
    slug: "webm-to-mp4",
    category: "video-tools",
    description: "Convert WebM files to MP4 with genuine video conversion.",
    shortDescription: "Convert WebM videos to MP4.",
    icon: "video",
    keywords: ["webm to mp4", "convert webm to mp4", "webm mp4 converter"],
    popular: false,
    new: false,
    supportedFormats: ["MP4", "WebM"],
    relatedToolIds: [
      "mp4-to-webm",
      "mov-to-mp4",
      "video-compressor",
      "video-resizer",
      "video-trimmer",
    ],
    seoTitle: "WebM to MP4 Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert WebM to MP4 online with ToolMyra. Create a playable MP4 from WebM video.",
    h1: "WebM to MP4 Converter",
    intro:
      "Convert WebM clips to MP4 for players and workflows that prefer MP4 containers.",
    convertHeading: "Convert WebM to MP4 Online",
    howToHeading: "How to Convert WebM to MP4",
    featuresHeading: "WebM to MP4 Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Genuine WebM to MP4 conversion",
      "Validated video output",
      "Simple upload and download",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your WebM",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your MP4",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the MP4 playable?",
        answer: "Yes. Output is validated as a non-empty MP4.",
      },
      {
        question: "Audio preserved?",
        answer: "Audio is preserved when decoding succeeds.",
      },
      {
        question: "Fake rename?",
        answer: "No. The video is re-encoded.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["WebM"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "mp4-to-webm",
    name: "MP4 to WebM Converter",
    slug: "mp4-to-webm",
    category: "video-tools",
    description:
      "Convert MP4 files to WebM using supported video and audio codecs.",
    shortDescription: "Convert MP4 videos to WebM.",
    icon: "video",
    keywords: ["mp4 to webm", "convert mp4 to webm", "mp4 webm converter"],
    popular: false,
    new: false,
    supportedFormats: ["MP4", "WebM"],
    relatedToolIds: [
      "webm-to-mp4",
      "video-compressor",
      "mov-to-mp4",
      "video-resizer",
      "video-trimmer",
    ],
    seoTitle: "MP4 to WebM Converter — Free Online | ToolMyra",
    seoDescription:
      "Convert MP4 to WebM online with ToolMyra. Create a valid WebM file from MP4 video.",
    h1: "MP4 to WebM Converter",
    intro:
      "Convert MP4 to WebM when you need an open web-friendly container. Output uses codecs supported by the conversion engine.",
    convertHeading: "Convert MP4 to WebM Online",
    howToHeading: "How to Convert MP4 to WebM",
    featuresHeading: "MP4 to WebM Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Genuine MP4 to WebM encoding",
      "Valid WebM output",
      "Clear convert workflow",
      "No account required",
      "Responsive preview",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Convert Your MP4",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Your WebM",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is WebM valid?",
        answer: "Yes. ToolMyra writes a real WebM file when encoding succeeds.",
      },
      {
        question: "Which codecs?",
        answer:
          "The tool uses codecs supported by the selected processing engine.",
      },
      {
        question: "Audio included?",
        answer: "Audio is included when encoding succeeds.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4"],
    outputFormats: ["WebM"],
  }),
  tool({
    id: "video-compressor",
    name: "Video Compressor",
    slug: "video-compressor",
    category: "video-tools",
    description:
      "Compress video online with sensible quality controls and measured size reduction.",
    shortDescription: "Compress video to reduce file size.",
    icon: "video",
    keywords: [
      "video compressor",
      "compress video",
      "reduce video size",
      "compress mp4",
    ],
    popular: true,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-resizer",
      "video-trimmer",
      "video-cropper",
      "mp4-to-webm",
      "video-metadata-viewer",
    ],
    seoTitle: "Video Compressor — Free Online | ToolMyra",
    seoDescription:
      "Compress video online with ToolMyra. Reduce video file size with clear quality settings and measured results.",
    h1: "Video Compressor",
    intro:
      "Reduce video file size for uploads and sharing. Original and compressed sizes are measured from the actual files — savings are never invented.",
    convertHeading: "Compress Video Online",
    howToHeading: "How to Compress Video",
    featuresHeading: "Video Compressor Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Measured original and compressed sizes",
      "Sensible quality controls",
      "Real compression encoding",
      "No account required",
      "Works across devices",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Compress Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Compressed Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Are size savings real?",
        answer:
          "Yes. Sizes are measured from the actual input and output files.",
      },
      {
        question: "Will quality drop?",
        answer: "Lower quality settings reduce size and can reduce clarity.",
      },
      {
        question: "Can you promise a size?",
        answer: "No. Results depend on the source and selected quality.",
      },
      {
        question: "Private?",
        answer: "Yes. Compression stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-resizer",
    name: "Video Resizer",
    slug: "video-resizer",
    category: "video-tools",
    description:
      "Resize video width and height with aspect-ratio lock and common presets.",
    shortDescription: "Resize video dimensions.",
    icon: "video",
    keywords: ["video resizer", "resize video", "change video resolution"],
    popular: true,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-cropper",
      "video-compressor",
      "video-trimmer",
      "video-rotator",
      "mp4-to-webm",
    ],
    seoTitle: "Video Resizer — Free Online | ToolMyra",
    seoDescription:
      "Resize video online with ToolMyra. Change dimensions with presets or custom width and height.",
    h1: "Video Resizer",
    intro:
      "Change video dimensions for social uploads, embeds, or smaller files. Lock aspect ratio or choose common presets like 1280×720.",
    convertHeading: "Resize Video Online",
    howToHeading: "How to Resize Video",
    featuresHeading: "Video Resizer Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Width and height controls",
      "Aspect-ratio lock",
      "Common resolution presets",
      "Real resized output",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Resize Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Resized Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Does output resolution change?",
        answer: "Yes. The downloaded video uses the selected dimensions.",
      },
      {
        question: "Can I keep aspect ratio?",
        answer:
          "Yes. Enable maintain aspect ratio while editing width or height.",
      },
      {
        question: "Presets available?",
        answer: "Yes. Use presets such as 1920×1080 and 1280×720.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-cropper",
    name: "Video Cropper",
    slug: "video-cropper",
    category: "video-tools",
    description:
      "Crop video to a selected region with free or common aspect ratios.",
    shortDescription: "Crop a region from video.",
    icon: "video",
    keywords: ["video cropper", "crop video", "video crop tool"],
    popular: false,
    new: true,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-resizer",
      "video-trimmer",
      "video-compressor",
      "video-rotator",
      "video-cutter",
    ],
    seoTitle: "Video Cropper — Free Online | ToolMyra",
    seoDescription:
      "Crop video online with ToolMyra. Select a region and download a truly cropped video file.",
    h1: "Video Cropper",
    intro:
      "Select a crop region and export a video that is actually cropped — not a CSS-only preview of the original file.",
    convertHeading: "Crop Video Online",
    howToHeading: "How to Crop Video",
    featuresHeading: "Video Cropper Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Free and fixed aspect ratios",
      "Visual region controls",
      "Real cropped output",
      "No account required",
      "Responsive controls",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Crop Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Cropped Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the download cropped?",
        answer: "Yes. The output video is cropped to the selected region.",
      },
      {
        question: "Aspect ratios?",
        answer: "Choose free, 1:1, 4:3, 16:9, or 9:16.",
      },
      {
        question: "Audio kept?",
        answer: "Audio is preserved when the encoder can copy or re-encode it.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-trimmer",
    name: "Video Trimmer",
    slug: "video-trimmer",
    category: "video-tools",
    description:
      "Trim video to an exact start and end segment with timeline controls.",
    shortDescription: "Trim video to a time range.",
    icon: "video",
    keywords: ["video trimmer", "trim video", "cut video online"],
    popular: true,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-cutter",
      "video-compressor",
      "video-cropper",
      "video-speed-changer",
      "video-merger",
    ],
    seoTitle: "Video Trimmer — Free Online | ToolMyra",
    seoDescription:
      "Trim video online with ToolMyra. Select start and end times and download only the chosen segment.",
    h1: "Video Trimmer",
    intro:
      "Select exact start and end times to export only the segment you need. The downloaded file contains that range.",
    convertHeading: "Trim Video Online",
    howToHeading: "How to Trim Video",
    featuresHeading: "Video Trimmer Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Start and end controls",
      "Selected duration display",
      "Real segment export",
      "No account required",
      "Responsive timeline inputs",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Trim Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Trimmed Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is trimming real?",
        answer: "Yes. Output contains only the selected time range.",
      },
      {
        question: "Can start be after end?",
        answer: "No. Invalid ranges are blocked with a clear message.",
      },
      {
        question: "Audio included?",
        answer: "Audio is included for the selected range when available.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-cutter",
    name: "Video Cutter",
    slug: "video-cutter",
    category: "video-tools",
    description:
      "Cut a specific portion of a video with start, end, and duration controls.",
    shortDescription: "Cut a portion from video.",
    icon: "video",
    keywords: ["video cutter", "cut video", "video cut tool"],
    popular: false,
    new: true,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-trimmer",
      "video-compressor",
      "video-cropper",
      "video-speed-changer",
      "video-merger",
    ],
    seoTitle: "Video Cutter — Free Online | ToolMyra",
    seoDescription:
      "Cut video online with ToolMyra. Select a portion and download the extracted clip.",
    h1: "Video Cutter",
    intro:
      "Cut out a specific portion of a video with clear start, end, and duration feedback.",
    convertHeading: "Cut Video Online",
    howToHeading: "How to Cut Video",
    featuresHeading: "Video Cutter Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Start, end, and duration controls",
      "Real cut export",
      "Clear validation",
      "No account required",
      "Works on mobile",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Cut Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Cut Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Difference from trimmer?",
        answer:
          "Both export a segment. The cutter emphasizes selecting a portion with duration feedback.",
      },
      {
        question: "Is the cut exact?",
        answer: "Processing uses the selected start and end times.",
      },
      {
        question: "Invalid ranges?",
        answer: "Start must be before end, within the video duration.",
      },
      {
        question: "Private?",
        answer: "Yes. Edits stay.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-merger",
    name: "Video Merger",
    slug: "video-merger",
    category: "video-tools",
    description:
      "Merge multiple videos into one file in the exact order you arrange.",
    shortDescription: "Merge multiple videos in order.",
    icon: "video",
    keywords: ["video merger", "merge videos", "combine videos", "join videos"],
    popular: false,
    new: true,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-trimmer",
      "video-cutter",
      "video-compressor",
      "video-resizer",
      "video-speed-changer",
    ],
    seoTitle: "Video Merger — Free Online | ToolMyra",
    seoDescription:
      "Merge videos online with ToolMyra. Add, reorder, and combine clips into one downloadable video.",
    h1: "Video Merger",
    intro:
      "Combine multiple clips into one continuous video in the exact order you set. Differing formats are normalized during merge.",
    convertHeading: "Merge Videos Online",
    howToHeading: "How to Merge Videos",
    featuresHeading: "Video Merger Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Add, remove, and reorder clips",
      "Exact merge order",
      "Format normalization policy",
      "No account required",
      "Preview before merge",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Merge Your Videos",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Merged Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is order preserved?",
        answer: "Yes. Clips are merged in the list order you set.",
      },
      {
        question: "Different sizes?",
        answer: "Clips are normalized to a common size during merge.",
      },
      {
        question: "Minimum files?",
        answer: "Upload at least two videos.",
      },
      {
        question: "Private?",
        answer: "Yes. Merging stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-rotator",
    name: "Video Rotator",
    slug: "video-rotator",
    category: "video-tools",
    description:
      "Rotate video with real encoding so the downloaded file is actually rotated.",
    shortDescription: "Rotate video 90°, 180°, or 270°.",
    icon: "video",
    keywords: ["video rotator", "rotate video", "rotate mp4"],
    popular: false,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-cropper",
      "video-resizer",
      "video-trimmer",
      "video-compressor",
      "video-speed-changer",
    ],
    seoTitle: "Video Rotator — Free Online | ToolMyra",
    seoDescription:
      "Rotate video online with ToolMyra. Turn clips 90°, 180°, or 270° and download a really rotated file.",
    h1: "Video Rotator",
    intro:
      "Rotate a video clockwise, counterclockwise, or 180°. The download is encoded with the rotation applied — not just a flipped preview.",
    convertHeading: "Rotate Video Online",
    howToHeading: "How to Rotate Video",
    featuresHeading: "Video Rotator Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "90°, 180°, and 270° options",
      "Real rotated output",
      "Simple controls",
      "No account required",
      "Responsive preview",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Rotate Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Rotated Video",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the download rotated?",
        answer: "Yes. The output file is encoded with the selected rotation.",
      },
      {
        question: "Audio kept?",
        answer: "Audio is preserved when possible.",
      },
      {
        question: "Can I preview first?",
        answer: "Yes. Preview the source, then rotate and download.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-speed-changer",
    name: "Video Speed Changer",
    slug: "video-speed-changer",
    category: "video-tools",
    description:
      "Change video speed so duration and audio timing update together.",
    shortDescription: "Change video playback speed.",
    icon: "video",
    keywords: [
      "video speed changer",
      "change video speed",
      "speed up video",
      "slow down video",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-trimmer",
      "video-cutter",
      "video-compressor",
      "video-rotator",
      "video-merger",
    ],
    seoTitle: "Video Speed Changer — Free Online | ToolMyra",
    seoDescription:
      "Change video speed online with ToolMyra. Speed up or slow down from 0.5x to 2x with matched audio timing.",
    h1: "Video Speed Changer",
    intro:
      "Adjust playback speed from 0.5x to 2x so the output duration actually changes. Audio tempo is adjusted with the video.",
    convertHeading: "Change Video Speed Online",
    howToHeading: "How to Change Video Speed",
    featuresHeading: "Video Speed Changer Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Presets from 0.5x to 2x",
      "Video and audio timing updated",
      "Real duration change",
      "No account required",
      "Clear process flow",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Change Your Video Speed",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Speed-Adjusted Video",
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
        question: "Is audio adjusted?",
        answer: "Yes. Audio tempo is processed with the video.",
      },
      {
        question: "Available speeds?",
        answer: "0.5x, 0.75x, 1x, 1.25x, 1.5x, and 2x.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["MP4"],
  }),
  tool({
    id: "video-thumbnail-extractor",
    name: "Video Thumbnail Extractor",
    slug: "video-thumbnail-extractor",
    category: "video-tools",
    description: "Extract a thumbnail image from a selected video timestamp.",
    shortDescription: "Extract a thumbnail image from video.",
    icon: "video",
    keywords: [
      "video thumbnail extractor",
      "extract video thumbnail",
      "video thumbnail",
    ],
    popular: true,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "PNG", "WebM"],
    relatedToolIds: [
      "video-frame-extractor",
      "mp4-to-gif",
      "video-trimmer",
      "video-metadata-viewer",
      "video-compressor",
    ],
    seoTitle: "Video Thumbnail Extractor — Free Online | ToolMyra",
    seoDescription:
      "Extract a video thumbnail online with ToolMyra. Pick a timestamp and download a PNG from the actual frame.",
    h1: "Video Thumbnail Extractor",
    intro:
      "Choose a timestamp, preview the frame, and download a real PNG thumbnail from that exact position in the video.",
    convertHeading: "Extract Video Thumbnail Online",
    howToHeading: "How to Extract a Video Thumbnail",
    featuresHeading: "Video Thumbnail Extractor Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Timestamp selection",
      "Frame preview",
      "PNG download",
      "No account required",
      "Light extraction path",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Choose Timestamp",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Thumbnail",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the image from the real frame?",
        answer: "Yes. The thumbnail comes from the selected video timestamp.",
      },
      {
        question: "Output format?",
        answer: "PNG by default.",
      },
      {
        question: "Need full conversion?",
        answer: "No. Thumbnail extraction uses a lightweight capture path.",
      },
      {
        question: "Private?",
        answer: "Yes. Extraction stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "video-frame-extractor",
    name: "Video Frame Extractor",
    slug: "video-frame-extractor",
    category: "video-tools",
    description:
      "Extract a still frame from a selected timestamp in your video.",
    shortDescription: "Extract a frame image from video.",
    icon: "video",
    keywords: [
      "video frame extractor",
      "extract video frame",
      "video screenshot",
    ],
    popular: false,
    new: false,
    supportedFormats: ["AVI", "MKV", "MOV", "MP4", "PNG", "WebM"],
    relatedToolIds: [
      "video-thumbnail-extractor",
      "mp4-to-gif",
      "video-trimmer",
      "video-metadata-viewer",
      "video-cutter",
    ],
    seoTitle: "Video Frame Extractor — Free Online | ToolMyra",
    seoDescription:
      "Extract a video frame online with ToolMyra. Select a timestamp and download the matching still image.",
    h1: "Video Frame Extractor",
    intro:
      "Capture a still frame from any point in the video. The downloaded image matches the selected timestamp.",
    convertHeading: "Extract Video Frame Online",
    howToHeading: "How to Extract a Video Frame",
    featuresHeading: "Video Frame Extractor Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Exact timestamp capture",
      "Frame preview",
      "PNG download",
      "No account required",
      "Fast lightweight extraction",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Choose Timestamp",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Download Frame",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Is the frame exact?",
        answer:
          "The captured frame matches the selected timestamp as closely as the player allows.",
      },
      {
        question: "Output format?",
        answer: "PNG.",
      },
      {
        question: "Decorative frames?",
        answer: "No. Frames come from your uploaded video.",
      },
      {
        question: "Private?",
        answer: "Yes. Extraction stays.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "video-metadata-viewer",
    name: "Video Metadata Viewer",
    slug: "video-metadata-viewer",
    category: "video-tools",
    description:
      "Inspect available video metadata such as duration, size, and dimensions without inventing missing fields.",
    shortDescription: "View available video metadata.",
    icon: "video",
    keywords: ["video metadata viewer", "video metadata", "video file info"],
    popular: false,
    new: false,
    supportedFormats: ["AVI", "GIF", "MKV", "MOV", "MP4", "WebM"],
    relatedToolIds: [
      "video-thumbnail-extractor",
      "video-compressor",
      "mp4-to-mp3",
      "video-trimmer",
      "video-frame-extractor",
    ],
    seoTitle: "Video Metadata Viewer — Free Online | ToolMyra",
    seoDescription:
      "View video metadata online with ToolMyra. Inspect duration, size, dimensions, and other detected fields.",
    h1: "Video Metadata Viewer",
    intro:
      "Inspect file name, size, duration, dimensions, and other fields when they can be detected. Unavailable values are marked as not detected.",
    convertHeading: "View Video Metadata Online",
    howToHeading: "How to View Video Metadata",
    featuresHeading: "Video Metadata Viewer Features",
    supportedFormatsHeading: "Supported Video Formats",
    relatedToolsHeading: "Related Video Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Shows detected fields only",
      "Marks unavailable values clearly",
      "No invented data",
      "No account required",
      "Lightweight inspection",
    ],
    howToSteps: [
      {
        title: "Upload Your Video",
        description: "Choose the video file to process.",
      },
      {
        title: "Inspect Your Video",
        description: "Adjust settings if needed, then run the tool.",
      },
      {
        title: "Review Detected Fields",
        description: "Save the result to your device.",
      },
    ],
    faq: [
      {
        question: "Do you invent missing values?",
        answer: "No. Unavailable fields are labeled as not detected.",
      },
      {
        question: "What fields appear?",
        answer:
          "Typical fields include name, size, duration, width, height, and codec details when available.",
      },
      {
        question: "Need ffmpeg for this?",
        answer: "Metadata viewing uses a lightweight path when possible.",
      },
      {
        question: "Private?",
        answer: "Yes. Files stay.",
      },
    ],
    inputFormats: ["MP4", "MOV", "WebM", "AVI", "MKV", "GIF"],
    outputFormats: ["Metadata"],
  }),
];
