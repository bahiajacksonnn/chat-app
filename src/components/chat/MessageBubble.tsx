import Image from "next/image";
import { AudioMessage } from "./AudioMessage";
import type { DisplayedMessage } from "@/types/conversation";

interface MessageBubbleProps {
  message: DisplayedMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center px-6 animate-message-in">
        <p className="max-w-[90%] rounded-full bg-white/5 px-3.5 py-1.5 text-center text-[11px] leading-relaxed text-zinc-400">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-message-in`}>
      <div
        className={[
          "max-w-[78%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
          isUser
            ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
            : "rounded-2xl rounded-bl-sm bg-zinc-800 text-zinc-100",
          message.type === "image" ? "overflow-hidden p-1.5" : "",
          message.type === "audio" ? "p-2.5" : "",
        ].join(" ")}
      >
        {message.type === "image" ? (
          <Image
            src={message.content}
            alt={message.meta?.imageAlt ?? "imagem"}
            width={message.meta?.width ?? 320}
            height={message.meta?.height ?? 180}
            className="rounded-xl"
          />
        ) : message.type === "audio" ? (
          <AudioMessage src={message.content} isUser={isUser} />
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
