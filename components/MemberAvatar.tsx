interface AvatarProps {
  initials: string;
  color: string;
  name: string;
}

export function MemberAvatar({ initials, color, name }: AvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white dark:text-navy-900 font-bold text-sm sm:text-base shadow-sm border border-neutral-200 dark:border-neutral-700"
        style={{ backgroundColor: color }}
        role="img"
        aria-label={`Avatar de ${name}`}
      >
        {initials}
      </div>
      <span className="hidden sm:block text-sm font-medium text-foreground truncate w-full px-1">
        {name.split(' ')[0]}
      </span>
    </div>
  )
}
