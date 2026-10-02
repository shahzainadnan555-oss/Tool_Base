"use client";

import Cropper, { type Area } from "react-easy-crop";
import { useCallback, useState } from "react";

interface ImageCropperControlProps {
  imageUrl: string;
  aspect?: number | undefined;
  onCropComplete: (croppedAreaPixels: Area) => void;
  circular?: boolean;
}

export function ImageCropperControl({
  imageUrl,
  aspect,
  onCropComplete,
  circular = false,
}: ImageCropperControlProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete],
  );

  return (
    <div className="space-y-3">
      <div className="relative h-72 overflow-hidden rounded-2xl bg-tm-navy md:h-96">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={circular ? "round" : "rect"}
          showGrid={!circular}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleComplete}
        />
      </div>
      <label className="block text-sm font-bold text-tm-text">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="mt-2 w-full"
        />
      </label>
    </div>
  );
}
