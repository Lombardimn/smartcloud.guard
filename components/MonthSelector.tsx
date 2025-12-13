'use client';

import { 
  getMonthName, 
  isCurrentMonth, 
  getPreviousMonthInfo, 
  getNextMonthInfo 
} from '@/lib/dateUtils';
import { memo, useMemo } from 'react';
import { NavigationButton } from './NavigationButton';
import { TodayButton } from './TodayButton';

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

function MonthSelector({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthSelectorProps) {
  // Datos del mes actual (memoizados)
  const monthName = useMemo(() => getMonthName(currentDate.getMonth()), [currentDate]);
  const year = currentDate.getFullYear();
  const isCurrent = useMemo(() => isCurrentMonth(currentDate), [currentDate]);
  
  // Información para navegación (memoizada)
  const prevMonthInfo = useMemo(() => getPreviousMonthInfo(currentDate), [currentDate]);
  const nextMonthInfo = useMemo(() => getNextMonthInfo(currentDate), [currentDate]);
  
  // Formato para el atributo datetime
  const dateTimeValue = useMemo(
    () => `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    [year, currentDate]
  );

  return (
    <nav 
      className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-zinc-100 dark:bg-purple-950/20 p-2 rounded-lg shadow"
      aria-label="Navegación del calendario"
    >
      {/* Título - Arriba en mobile, centro en desktop */}
      <div className="w-full sm:w-auto text-center sm:order-0">
        <h2 
          className="text-lg sm:text-xl font-bold mx-4 text-gray-900 dark:text-zinc-50"
          aria-live="polite"
          aria-atomic="true"
        >
          <time dateTime={dateTimeValue}>
            {monthName} {year}
          </time>
          {isCurrent && (
            <span className="ml-2 text-xs font-normal uppercase text-zinc-50 dark:text-zinc-50 px-1.5 py-0.5 rounded-md bg-[#100037] dark:bg-[#1e40af]" aria-label="(mes actual)">
              Actual
            </span>
          )}
        </h2>
      </div>

      {/* Botones de navegación - En línea en mobile, distribuidos en desktop */}
      <div className="flex items-center gap-2 sm:hidden">
        <NavigationButton
          onClick={onPreviousMonth}
          direction="prev"
          ariaLabel={`Ir a ${prevMonthInfo.month} ${prevMonthInfo.year}`}
        />
        
        <TodayButton onClick={onToday} />
        
        <NavigationButton 
          onClick={onNextMonth}
          direction="next"
          ariaLabel={`Ir a ${nextMonthInfo.month} ${nextMonthInfo.year}`}
        />
      </div>

      {/* Botón Anterior - Solo desktop */}
      <div className="hidden sm:block">
        <NavigationButton
          onClick={onPreviousMonth}
          direction="prev"
          ariaLabel={`Ir a ${prevMonthInfo.month} ${prevMonthInfo.year}`}
        />
      </div>

      {/* Botón Hoy - Solo desktop */}
      <div className="hidden sm:block">
        <TodayButton onClick={onToday} />
      </div>

      {/* Botón Siguiente - Solo desktop */}
      <div className="hidden sm:block">
        <NavigationButton 
          onClick={onNextMonth}
          direction="next"
          ariaLabel={`Ir a ${nextMonthInfo.month} ${nextMonthInfo.year}`}
        />
      </div>
    </nav>
  );
}

/**
 * Memo optimizado comparando solo el timestamp de la fecha
 */
export default memo(MonthSelector, (prevProps, nextProps) => {
  return prevProps.currentDate.getTime() === nextProps.currentDate.getTime();
});
