const WEEKDAY_LABELS = [
  { short: 'Dom', long: 'Domingo', ariaLabel: 'Domingo' },
  { short: 'Lun', long: 'Lunes', ariaLabel: 'Lunes' },
  { short: 'Mar', long: 'Martes', ariaLabel: 'Martes' },
  { short: 'Mié', long: 'Miércoles', ariaLabel: 'Miércoles' },
  { short: 'Jue', long: 'Jueves', ariaLabel: 'Jueves' },
  { short: 'Vie', long: 'Viernes', ariaLabel: 'Viernes' },
  { short: 'Sáb', long: 'Sábado', ariaLabel: 'Sábado' },
] as const;

export const WeekdayHeader = () => (
  <div 
    className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4"
    role="row"
  >
    {WEEKDAY_LABELS.map((day) => (
      <div
        key={day.short}
        className="text-center font-semibold text-[#100037] dark:text-zinc-50 py-2 text-xs sm:text-sm"
        role="columnheader"
        aria-label={day.ariaLabel}
      >
        <span className="hidden sm:inline">{day.short}</span>
        <span className="sm:hidden">{day.short.charAt(0)}</span>
      </div>
    ))}
  </div>
);
