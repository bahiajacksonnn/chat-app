export function RecordingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-3.5 animate-message-in">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-red-400">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path
            d="M5 11a7 7 0 0 0 14 0M12 18v4"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex h-3.5 items-end gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="waveform-bar" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
