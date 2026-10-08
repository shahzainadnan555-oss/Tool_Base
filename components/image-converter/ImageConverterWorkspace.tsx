"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ConversionResultView } from "@/components/image-converter/ConversionResult";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { ImagePreview } from "@/components/image-converter/FileInfo";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { ImageUpload } from "@/components/image-converter/ImageUpload";
import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import {
  convertImageFile,
  downloadBlob,
  type ConversionResult,
  type ImageConverterConfig,
  type SelectedImageFile,
} from "@/lib/image-converter";
import { validateImageFile } from "@/lib/image-converter/validate";
import { loadHtmlImage, revokeObjectUrl } from "@/lib/image-converter/utils";
import { useOperationController } from "@/lib/processing";
import { filterUserFacingNotices } from "@/lib/ui/notices";
import { ImagePrivacyNotice } from "@/components/ui/ImagePrivacyNotice";

interface ImageConverterWorkspaceProps {
  config: ImageConverterConfig;
  convertHeading?: string;
}

type Stage = "upload" | "ready" | "converting" | "done";

export function ImageConverterWorkspace({
  config,
  convertHeading,
}: ImageConverterWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controller = useOperationController("Converting…");
  const widthId = useId();
  const heightId = useId();
  const [stage, setStage] = useState<Stage>("upload");
  const [selected, setSelected] = useState<SelectedImageFile | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);

  useEffect(() => {
    return () => {
      revokeObjectUrl(selected?.previewUrl);
      revokeObjectUrl(result?.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetAll() {
    controller.reset();
    revokeObjectUrl(selected?.previewUrl);
    revokeObjectUrl(result?.previewUrl);
    setSelected(null);
    setResult(null);
    setError(null);
    setWidth("");
    setHeight("");
    setMaintainAspect(true);
    setStage("upload");
  }

  async function handleFileSelected(file: File) {
    setError(null);
    const validationError = validateImageFile(file, config);
    if (validationError) {
      setError(validationError);
      return;
    }

    revokeObjectUrl(selected?.previewUrl);
    revokeObjectUrl(result?.previewUrl);
    setResult(null);

    const previewUrl = URL.createObjectURL(file);
    let dimensions: { width?: number; height?: number } = {};

    try {
      if (!file.name.toLowerCase().match(/\.(heic|heif|tif|tiff|ico)$/)) {
        const image = await loadHtmlImage(previewUrl);
        dimensions = { width: image.naturalWidth, height: image.naturalHeight };
        if (config.supportsSvgDimensions) {
          setWidth(String(image.naturalWidth || 1024));
          setHeight(String(image.naturalHeight || 1024));
        }
      }
    } catch {
      // Preview dimensions are optional for some formats.
    }

    setSelected({
      file,
      previewUrl,
      name: file.name,
      type: file.type,
      sizeBytes: file.size,
      ...dimensions,
    });
    setStage("ready");
  }

  async function handleConvert() {
    if (!selected) {
      setError("Please choose an image file to convert.");
      return;
    }

    setError(null);
    setStage("converting");
    const opId = controller.start("Converting…");

    try {
      const converted = await convertImageFile(selected, config, {
        targetWidth: width ? Number(width) : undefined,
        targetHeight: height ? Number(height) : undefined,
        maintainAspectRatio: maintainAspect,
      });
      if (!controller.succeed(opId)) {
        revokeObjectUrl(converted.previewUrl);
        return;
      }
      revokeObjectUrl(result?.previewUrl);
      setResult(converted);
      setStage("done");
    } catch (conversionError) {
      const message =
        conversionError instanceof Error
          ? conversionError.message
          : "We couldn't convert this image. Please try another file or a supported format.";
      controller.fail(opId, message);
      setStage("ready");
      setError(message);
    }
  }

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {filterUserFacingNotices(config.notices).length > 0 &&
      stage !== "done" ? (
        <div className="tm-notice tm-notice-info">
          {filterUserFacingNotices(config.notices).map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {stage === "upload" ? (
        <ImageUpload
          accept={config.accept}
          inputLabel={config.inputLabel}
          onFileSelected={handleFileSelected}
        />
      ) : null}

      {(stage === "ready" || stage === "converting") && selected ? (
        <>
          <ImagePreview
            file={selected}
            onRemove={resetAll}
            onChange={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFileSelected(file);
              event.target.value = "";
            }}
          />

          {config.supportsSvgDimensions ? (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor={widthId}
                  className="mb-2 block text-sm font-bold text-tm-text"
                >
                  Width (px)
                </label>
                <input
                  id={widthId}
                  className="tm-input"
                  inputMode="numeric"
                  value={width}
                  onChange={(event) => {
                    const next = event.target.value.replace(/[^\d]/g, "");
                    setWidth(next);
                    if (
                      maintainAspect &&
                      selected.width &&
                      selected.height &&
                      next
                    ) {
                      const ratio = selected.height / selected.width;
                      setHeight(
                        String(Math.max(1, Math.round(Number(next) * ratio))),
                      );
                    }
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor={heightId}
                  className="mb-2 block text-sm font-bold text-tm-text"
                >
                  Height (px)
                </label>
                <input
                  id={heightId}
                  className="tm-input"
                  inputMode="numeric"
                  value={height}
                  onChange={(event) => {
                    const next = event.target.value.replace(/[^\d]/g, "");
                    setHeight(next);
                    if (
                      maintainAspect &&
                      selected.width &&
                      selected.height &&
                      next
                    ) {
                      const ratio = selected.width / selected.height;
                      setWidth(
                        String(Math.max(1, Math.round(Number(next) * ratio))),
                      );
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(event) =>
                      setMaintainAspect(event.target.checked)
                    }
                  />
                  Maintain aspect ratio
                </label>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <ConvertButton
              onClick={() => void handleConvert()}
              disabled={!selected || stage === "converting"}
              loading={false}
            />
            {stage === "converting" &&
            controller.showProgress &&
            controller.progress ? (
              <ProcessingProgress progress={controller.progress} />
            ) : null}
          </div>
        </>
      ) : null}

      {stage === "done" && selected && result ? (
        <ConversionResultView
          original={selected}
          result={result}
          onDownload={() => downloadBlob(result.blob, result.fileName)}
          onReset={resetAll}
        />
      ) : null}

      {error ? <FileValidationMessage message={error} /> : null}

      <ImagePrivacyNotice timing="instant" />
    </div>
  );
}
