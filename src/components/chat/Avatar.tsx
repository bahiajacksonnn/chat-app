import Image from "next/image";

interface AvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string;
  accentFrom: string;
  accentTo: string;
  size?: number;
  showOnlineDot?: boolean;
}

export function Avatar({
  name,
  initials,
  avatarUrl,
  accentFrom,
  accentTo,
  size = 40,
  showOnlineDot = false,
}: AvatarProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full text-sm font-semibold text-white ring-1 ring-white/10"
          style={{
            background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
          }}
        >
          {initials}
        </div>
      )}
      {showOnlineDot && (
        <span className="absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
      )}
    </div>
  );
}
