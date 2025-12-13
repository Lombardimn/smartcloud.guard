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
      bg-gray-200 text-gray-700 rounded-lg 
      hover:bg-gray-300 active:bg-gray-400
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
      transition-all duration-200
      font-medium text-sm sm:text-base
    "
  >
    <Calendar1Icon className="w-5 h-5 sm:hidden inline" />
    <span className="hidden sm:inline">Hoy</span>
  </button>
));
TodayButton.displayName = 'TodayButton';