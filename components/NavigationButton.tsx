import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { memo } from 'react';

interface NavigationButtonProps {
  onClick: () => void;
  direction: 'prev' | 'next';
  ariaLabel: string;
}

export const NavigationButton = memo(({ onClick, direction, ariaLabel }: NavigationButtonProps) => {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;
  
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        min-w-11 min-h-11 
        flex items-center justify-center
        px-3 sm:px-4 py-2 
        bg-[#100037] text-white text-md rounded-lg 
        hover:bg-[#1e40af] active:bg-[#1e3a8a]
        focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:ring-offset-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="hidden sm:inline ml-2">
        {direction === 'prev' ? 'Anterior' : 'Siguiente'}
      </span>
    </button>
  );
});
NavigationButton.displayName = 'NavigationButton';
