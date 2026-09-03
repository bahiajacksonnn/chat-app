import type { ResponseOption } from "@/types/conversation";

interface ResponseOptionsProps {
  options: ResponseOption[];
  onSelect: (option: ResponseOption) => void;
}

export function ResponseOptions({ options, onSelect }: ResponseOptionsProps) {
  if (options.length === 0) return null;

  return (
    <div className="border-t border-white/5 bg-zinc-950/95 px-3 py-3 backdrop-blur-md">
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            style={{ animationDelay: `${index * 60}ms` }}
            className="animate-option-in rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-[15px] font-medium text-zinc-100 transition-colors hover:border-violet-400/40 hover:bg-violet-500/10 active:bg-violet-500/20"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
