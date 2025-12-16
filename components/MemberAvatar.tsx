interface AvatarProps {
  initials: string;
  color: string;
  name: string;
  showName?: boolean;
  size?: 'small' | 'normal';
}

export function MemberAvatar({ initials, color, name, showName = true, size = 'normal' }: AvatarProps) {
  const sizeClasses = size === 'small' 
    ? 'w-6 h-6 sm:w-9 sm:h-9 text-xs sm:text-sm'
    : 'w-8 h-8 sm:w-12 sm:h-12 text-sm sm:text-base';
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center text-foreground font-bold shadow-sm`}
        style={{ backgroundColor: color }}
        role="img"
        aria-label={`Avatar de ${name}`}
      >
        {initials}
      </div>
      {showName && (
        <span className="hidden sm:block text-sm font-medium text-foreground truncate w-full px-1">
          {name.split(' ')[0]}
        </span>
      )}
    </div>
  )
}
