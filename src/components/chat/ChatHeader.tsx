"use client";

import { useState } from "react";
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
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
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

        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-label="Sobre esta experiência"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 active:bg-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </button>
      </header>

      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 cursor-default"
            onClick={() => setAboutOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-5 text-zinc-200 shadow-2xl">
            <h2 className="mb-2 text-base font-semibold text-zinc-50">Sobre esta experiência</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Esta conversa é uma experiência interativa e automatizada. As mensagens, os tempos de
              resposta e o indicador de &quot;digitando...&quot; são pré-programados para simular um
              atendimento em tempo real — você não está conversando com uma pessoa neste momento.
            </p>
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              className="mt-4 w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-white/15"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
