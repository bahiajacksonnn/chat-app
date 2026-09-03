interface CtaButtonProps {
  url: string;
  label: string;
}

export function CtaButton({ url, label }: CtaButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H8M17 7V16"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
