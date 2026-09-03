"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ResponseOptions } from "./ResponseOptions";
import { useConversationEngine } from "@/hooks/useConversationEngine";
import type { ConversationData } from "@/types/conversation";

interface ChatPageProps {
  slug: string;
}

export function ChatPage({ slug }: ChatPageProps) {
  const router = useRouter();
  const [data, setData] = useState<ConversationData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setNotFound(false);

    fetch(`/api/chats/${slug}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const json: ConversationData = await res.json();
        setData(json);
      })
      .catch(() => {
        // Sem dados: a tela permanece no estado de carregamento.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const { displayedMessages, currentOptions, activeIndicator, characterStatus, selectOption } =
    useConversationEngine(slug, data);

  if (notFound) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-2 bg-zinc-950 px-6 text-center">
        <p className="text-lg font-semibold text-zinc-100">Este link não existe</p>
        <p className="max-w-xs text-sm text-zinc-500">O chat que você tentou acessar não existe mais ou foi removido.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-dvh items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-1">
          <span className="typing-dot" style={{ animationDelay: "0ms" }} />
          <span className="typing-dot" style={{ animationDelay: "160ms" }} />
          <span className="typing-dot" style={{ animationDelay: "320ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-zinc-950">
      <ChatHeader character={data.character} status={characterStatus} onBack={() => router.back()} />
      <ChatMessages messages={displayedMessages} activeIndicator={activeIndicator} />
      <ResponseOptions options={currentOptions} onSelect={selectOption} />
    </div>
  );
}
