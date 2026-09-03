"use client";

import { useRef, useState, type MouseEvent, type SyntheticEvent } from "react";

interface AudioMessageProps {
  src: string;
  isUser: boolean;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioMessage({ src, isUser }: AudioMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  function handleSeek(event: MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrent(audio.currentTime);
  }

  function handleLoadedMetadata(event: SyntheticEvent<HTMLAudioElement>) {
    const value = event.currentTarget.duration;
    setDuration(Number.isFinite(value) ? value : 0);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        className="hidden"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar áudio" : "Reproduzir áudio"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
          isUser ? "bg-white/20 hover:bg-white/25" : "bg-white/10 hover:bg-white/15"
        }`}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="min-w-0 flex-1">
        <div
          onClick={handleSeek}
          className="h-1.5 w-full cursor-pointer rounded-full bg-white/15"
          role="slider"
          aria-label="Progresso do áudio"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={current}
        >
          <div className="h-full rounded-full bg-current opacity-90" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-[11px] tabular-nums opacity-70">
          {formatTime(current)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
