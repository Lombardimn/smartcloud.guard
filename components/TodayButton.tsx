import { Calendar1Icon } from "lucide-react";

import { memo } from "react";

interface TodayButtonProps {
  onClick: () => void;
}

export const TodayButton = memo(({ onClick }: TodayButtonProps) => (
  <button
    onClick={onClick}
    aria-label="Ir al mes actual"
    className="min-w-11 min-h-11 px-3 sm:px-4 py-2 bg-ring/30 text-muted-foreground rounded-lg hover:bg-primary active:bg-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium text-sm sm:text-base"
  >
    <Calendar1Icon className="w-5 h-5 sm:hidden inline" />
    <span className="hidden sm:inline">Hoy</span>
  </button>
));
TodayButton.displayName = 'TodayButton';