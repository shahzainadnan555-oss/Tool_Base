"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatDuration } from "@/lib/audio/utils";

interface AudioPlayerProps {
  src: string;
  label?: string;
  regionStart?: number;
  regionEnd?: number;
  showRegionPlay?: boolean;
}

export function AudioPlayer({
  src,
  label = "Audio preview",
  regionStart,
  regionEnd,
  showRegionPlay = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeId = useId();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const regionActive = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    setCurrent(0);
    regionActive.current = false;
    const onTime = () => {
      const time = audio.currentTime || 0;
      setCurrent(time);
      if (
        regionActive.current &&
        regionEnd != null &&
        Number.isFinite(regionEnd) &&
        time >= regionEnd
      ) {
        audio.pause();
        setPlaying(false);
        regionActive.current = false;
      }
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      regionActive.current = false;
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src, regionEnd]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      regionActive.current = false;
      return;
    }
    regionActive.current = false;
    await audio.play();
    setPlaying(true);
  }

  async function playSelectedRegion() {
    const audio = audioRef.current;
    if (!audio || regionStart == null || regionEnd == null) return;
    if (!(regionEnd > regionStart)) return;
    regionActive.current = true;
    audio.currentTime = Math.max(0, regionStart);
    await audio.play();
    setPlaying(true);
  }

  return (
    <div className="max-w-full overflow-hidden rounded-2xl border border-tm-border bg-tm-soft p-4">
      <p className="mb-3 text-sm font-bold text-tm-text">{label}</p>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="tm-btn tm-btn-secondary min-w-24"
          onClick={() => void togglePlay()}
        >
          {playing ? "Pause" : "Play"}
        </button>
        {showRegionPlay ? (
          <button
            type="button"
            className="tm-btn tm-btn-ghost"
            onClick={() => void playSelectedRegion()}
          >
            Play Selected Region
          </button>
        ) : null}
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
              if (audioRef.current) audioRef.current.currentTime = next;
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
              if (audioRef.current) audioRef.current.volume = next;
            }}
            className="w-20"
            aria-label="Volume"
          />
        </label>
      </div>
    </div>
  );
}
