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
      bg-[#100037] text-zinc-50 rounded-lg 
      hover:bg-[#1e40af] active:bg-[#1e3a8a]
      focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:ring-offset-2
      transition-all duration-200
      font-medium text-sm sm:text-base
    "
  >
    <Calendar1Icon className="w-5 h-5 sm:hidden inline" />
    <span className="hidden sm:inline">Hoy</span>
  </button>
));
TodayButton.displayName = 'TodayButton';