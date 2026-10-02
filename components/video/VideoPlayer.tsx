"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatDuration } from "@/lib/video/utils";

interface VideoPlayerProps {
  src: string;
  label?: string;
  poster?: string;
}

export function VideoPlayer({ src, label = "Video preview" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeId = useId();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(false);
    setCurrent(0);
    const onTime = () => setCurrent(video.currentTime || 0);
    const onMeta = () => setDuration(video.duration || 0);
    const onEnded = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
      return;
    }
    await video.play();
    setPlaying(true);
  }

  return (
    <div className="max-w-full overflow-hidden rounded-2xl border border-tm-border bg-tm-soft p-4">
      <p className="mb-3 text-sm font-bold text-tm-text">{label}</p>
      <div className="overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          src={src}
          className="mx-auto max-h-[420px] w-full object-contain"
          playsInline
          preload="metadata"
          controls={false}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="tm-btn tm-btn-secondary min-w-24"
          onClick={() => void togglePlay()}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="min-w-0 flex-1 basis-40">
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.01)}
            step={0.01}
            value={Math.min(current, duration || 0)}
            onChange={(event) => {
              const next = Number(event.target.value);
              setCurrent(next);
              if (videoRef.current) videoRef.current.currentTime = next;
            }}
            className="w-full"
            aria-label="Timeline"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-tm-muted">
            <span>{formatDuration(current)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        <label htmlFor={volumeId} className="flex items-center gap-2 text-xs font-bold text-tm-text">
          Vol
          <input
            id={volumeId}
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => {
              const next = Number(event.target.value);
              setVolume(next);
              if (videoRef.current) videoRef.current.volume = next;
            }}
            className="w-20"
            aria-label="Volume"
          />
        </label>
        <button
          type="button"
          className="tm-btn tm-btn-ghost"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.requestFullscreen) void video.requestFullscreen();
          }}
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}
