import { Calendar1Icon } from "lucide-react";

import { memo } from "react";

interface TodayButtonProps {
  onClick: () => void;
}

export const TodayButton = memo(({ onClick }: TodayButtonProps) => (
  <button
    onClick={onClick}
    aria-label="Ir al mes actual"
    className="
      min-w-11 min-h-11
      px-3 sm:px-4 py-2 
      bg-navy-800 dark:bg-neutral-800 text-neutral-50 rounded-lg 
      hover:bg-violet-500 dark:hover:bg-neutral-700 active:bg-violet-600 dark:active:bg-neutral-600
      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      transition-all duration-200
      font-medium text-sm sm:text-base
    "
  >
    <Calendar1Icon className="w-5 h-5 sm:hidden inline" />
    <span className="hidden sm:inline">Hoy</span>
  </button>
));
TodayButton.displayName = 'TodayButton';