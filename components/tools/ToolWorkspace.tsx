"use client";

import dynamic from "next/dynamic";
import { getImageConverterConfig } from "@/lib/image-converter/configs";
import { getImageEditorConfig } from "@/lib/image-editor/configs";
import { getDocumentDataConfig } from "@/lib/document-data/configs";
import { getPdfToolConfig } from "@/lib/pdf/configs";
import { getAudioToolConfig } from "@/lib/audio/configs";
import { getVideoToolConfig } from "@/lib/video/configs";
import { getTextToolConfig } from "@/lib/text/configs";
import { getDeveloperToolConfig } from "@/lib/developer/configs";
import { getSecurityToolConfig } from "@/lib/security/configs";
import { getCalculatorToolConfig } from "@/lib/calculator/configs";
import type { ToolDefinition } from "@/lib/tools/types";
import { LoadingState } from "@/components/ui/LoadingState";

const ImageConverterWorkspace = dynamic(
  () =>
    import("@/components/image-converter/ImageConverterWorkspace").then(
      (mod) => mod.ImageConverterWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading converter…" />,
  },
);

const ImageEditorWorkspace = dynamic(
  () =>
    import("@/components/image-editor/ImageEditorWorkspace").then(
      (mod) => mod.ImageEditorWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading image tool…" />,
  },
);

const PdfWorkspace = dynamic(
  () =>
    import("@/components/pdf/PdfWorkspace").then((mod) => mod.PdfWorkspace),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading PDF tool…" />,
  },
);

const DocumentDataWorkspace = dynamic(
  () =>
    import("@/components/document-data/DocumentDataWorkspace").then(
      (mod) => mod.DocumentDataWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading converter…" />,
  },
);

const AudioWorkspace = dynamic(
  () =>
    import("@/components/audio/AudioWorkspace").then((mod) => mod.AudioWorkspace),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading audio tool…" />,
  },
);

const VideoWorkspace = dynamic(
  () =>
    import("@/components/video/VideoWorkspace").then((mod) => mod.VideoWorkspace),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading video tool…" />,
  },
);

const TextWorkspace = dynamic(
  () =>
    import("@/components/text/TextWorkspace").then((mod) => mod.TextWorkspace),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading text tool…" />,
  },
);

const DeveloperToolWorkspace = dynamic(
  () =>
    import("@/components/developer/DeveloperToolWorkspace").then(
      (mod) => mod.DeveloperToolWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading developer tool…" />,
  },
);

const SecurityWorkspace = dynamic(
  () =>
    import("@/components/security/SecurityWorkspace").then(
      (mod) => mod.SecurityWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading security tool…" />,
  },
);

const CalculatorWorkspace = dynamic(
  () =>
    import("@/components/calculator/CalculatorWorkspace").then(
      (mod) => mod.CalculatorWorkspace,
    ),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading calculator…" />,
  },
);

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

export function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const converterConfig = getImageConverterConfig(tool.slug);
  if (converterConfig) {
    return (
      <ImageConverterWorkspace
        config={converterConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  const editorConfig = getImageEditorConfig(tool.slug);
  if (editorConfig) {
    return (
      <ImageEditorWorkspace
        config={editorConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  const pdfConfig = getPdfToolConfig(tool.slug);
  if (pdfConfig) {
    return (
      <PdfWorkspace config={pdfConfig} convertHeading={tool.convertHeading} />
    );
  }

  const documentConfig = getDocumentDataConfig(tool.slug);
  if (documentConfig) {
    return (
      <DocumentDataWorkspace
        config={documentConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  const audioConfig = getAudioToolConfig(tool.slug);
  if (audioConfig) {
    return (
      <AudioWorkspace config={audioConfig} convertHeading={tool.convertHeading} />
    );
  }

  const videoConfig = getVideoToolConfig(tool.slug);
  if (videoConfig) {
    return (
      <VideoWorkspace config={videoConfig} convertHeading={tool.convertHeading} />
    );
  }

  const textConfig = getTextToolConfig(tool.slug);
  if (textConfig) {
    return (
      <TextWorkspace config={textConfig} convertHeading={tool.convertHeading} />
    );
  }

  const developerConfig = getDeveloperToolConfig(tool.slug);
  if (developerConfig) {
    return (
      <DeveloperToolWorkspace
        config={developerConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  const securityConfig = getSecurityToolConfig(tool.slug);
  if (securityConfig) {
    return (
      <SecurityWorkspace
        config={securityConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  const calculatorConfig = getCalculatorToolConfig(tool.slug);
  if (calculatorConfig) {
    return (
      <CalculatorWorkspace
        config={calculatorConfig}
        convertHeading={tool.convertHeading}
      />
    );
  }

  return null;
}
