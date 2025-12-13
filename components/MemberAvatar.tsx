interface AvatarProps {
  initials: string;
  color: string;
  name: string;
}

export function MemberAvatar({ initials, color, name }: AvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white dark:text-[#100037] font-bold text-sm sm:text-base shadow-sm"
        style={{ backgroundColor: color }}
        role="img"
        aria-label={`Avatar de ${name}`}
      >
        {initials}
      </div>
      <span className="hidden sm:block text-sm font-medium text-[#100037] dark:text-zinc-50 truncate w-full px-1">
        {name.split(' ')[0]}
      </span>
    </div>
  )
}
