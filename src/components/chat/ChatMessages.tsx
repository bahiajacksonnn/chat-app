"use client";

import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { RecordingIndicator } from "./RecordingIndicator";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import type { DisplayedMessage } from "@/types/conversation";

interface ChatMessagesProps {
  messages: DisplayedMessage[];
  activeIndicator: "typing" | "recording" | null;
}

export function ChatMessages({ messages, activeIndicator }: ChatMessagesProps) {
  const endRef = useAutoScroll<HTMLDivElement>([messages.length, activeIndicator]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      <div className="flex flex-col gap-2.5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {activeIndicator === "typing" && <TypingIndicator />}
        {activeIndicator === "recording" && <RecordingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  );
}
