'use client';

import { getMonthName } from '@/lib/dateUtils';

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export default function MonthSelector({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthSelectorProps) {
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPreviousMonth}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthName} {year}
        </h2>
        <button
          onClick={onToday}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Hoy
        </button>
      </div>

      <button
        onClick={onNextMonth}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Siguiente →
      </button>
    </div>
  );
}