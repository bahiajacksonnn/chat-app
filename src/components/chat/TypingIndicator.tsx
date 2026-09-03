export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-3.5 animate-message-in">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "160ms" }} />
        <span className="typing-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}
