'use client';

import { useMemo } from 'react';
import { generateScheduleForMonth } from '@/lib/scheduleGenerator';
import { getDaysInMonth, getDayName } from '@/lib/dateUtils';
import DayCell from './DayCell';

interface CalendarProps {
  year: number;
  month: number;
}

export default function Calendar({ year, month }: CalendarProps) {
  const assignments = useMemo(() => {
    return generateScheduleForMonth(year, month);
  }, [year, month]);

  const days = useMemo(() => {
    return getDaysInMonth(year, month);
  }, [year, month]);

  const firstDayOfWeek = days[0].getDay();
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyCells.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {days.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const assignment = assignments.find((a) => a.date === dateStr);
          
          return (
            <DayCell
              key={dateStr}
              date={date}
              assignment={assignment}
            />
          );
        })}
      </div>
    </div>
  );
}
