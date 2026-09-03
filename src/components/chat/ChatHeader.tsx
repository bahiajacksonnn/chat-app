import { Avatar } from "./Avatar";
import type { CharacterProfile, CharacterStatus } from "@/types/conversation";

interface ChatHeaderProps {
  character: CharacterProfile;
  status: CharacterStatus;
  onBack?: () => void;
}

const STATUS_LABEL: Record<CharacterStatus, string> = {
  online: "Online agora",
  typing: "digitando...",
  recording: "gravando áudio...",
  offline: "offline",
};

export function ChatHeader({ character, status, onBack }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-zinc-950/80 px-3 py-2.5 backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 active:bg-white/10"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Avatar
        name={character.name}
        initials={character.initials}
        avatarUrl={character.avatarUrl}
        accentFrom={character.accentFrom}
        accentTo={character.accentTo}
        showOnlineDot={status !== "offline"}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-zinc-50">{character.name}</p>
        <p
          className={`truncate text-xs ${
            status === "typing" ? "text-violet-300" : "text-emerald-400"
          }`}
        >
          {STATUS_LABEL[status]}
        </p>
      </div>
    </header>
  );
}
