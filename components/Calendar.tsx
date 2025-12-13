'use client';

import { useMemo, memo, useEffect, useState } from 'react';
import { generateScheduleForMonthFromData } from '@/lib/scheduleGenerator';
import { getDaysInMonth, getEmptyCellsCount, toISODate, getMonthName } from '@/lib/dateUtils';
import { createAssignmentMap } from '@/lib/assignmentUtils';
import DayCell from './DayCell';
import { WeekdayHeader } from './WeekdayHeader';

interface CalendarProps {
  year: number;
  month: number;
}

/**
 * Componente de celda vacía para días antes del inicio del mes
 * Memoizado para evitar re-renders innecesarios
 */
const EmptyCell = memo(() => (
  <div 
    className="aspect-square"
    role="gridcell"
    aria-hidden="true"
  />
));
EmptyCell.displayName = 'EmptyCell';

/**
 * Componente principal del calendario de guardias
 * Muestra un mes completo con asignaciones y manejo de reemplazos
 * Mantiene continuidad de rotación entre meses
 */
function Calendar({ year, month }: CalendarProps) {
  const [resetKey, setResetKey] = useState(0);
  
  // Escuchar eventos de reset de rotación
  useEffect(() => {
    const handleRotationReset = () => {
      setResetKey(prev => prev + 1);
    };
    
    window.addEventListener('rotation-reset', handleRotationReset);
    return () => window.removeEventListener('rotation-reset', handleRotationReset);
  }, []);
  
  // Generar asignaciones del mes con manejo de errores
  // Se regenera cuando cambia year, month o se resetea la rotación
  const assignments = useMemo(() => {
    try {
      return generateScheduleForMonthFromData(year, month);
    } catch (error) {
      console.error('Error generando schedule:', error);
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, resetKey]);

  // Crear Map de asignaciones para búsquedas O(1)
  const assignmentMap = useMemo(() => 
    createAssignmentMap(assignments),
    [assignments]
  );

  // Obtener todos los días del mes
  const days = useMemo(() => 
    getDaysInMonth(year, month),
    [year, month]
  );

  // Calcular celdas vacías al inicio del calendario
  const emptyCellsCount = useMemo(() => 
    getEmptyCellsCount(year, month),
    [year, month]
  );

  // Etiqueta descriptiva para accesibilidad
  const calendarLabel = useMemo(() => 
    `Calendario de guardias - ${getMonthName(month)} ${year}`,
    [month, year]
  );

  // Estado vacío - mes sin días
  if (days.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto text-center py-8">
        <p className="text-gray-500">No hay días disponibles para este mes.</p>
      </div>
    );
  }

  return (
    <div
      role="grid"
      aria-label={calendarLabel}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Headers de días de la semana */}
      <WeekdayHeader />

      {/* Grilla de días del calendario */}
      <div 
        className="grid grid-cols-7 gap-1 sm:gap-2"
        role="rowgroup"
      >
        {/* Celdas vacías antes del primer día del mes */}
        {Array.from({ length: emptyCellsCount }, (_, i) => (
          <EmptyCell key={`empty-${i}`} />
        ))}
        
        {/* Días del mes con sus asignaciones */}
        {days.map(date => {
          const dateStr = toISODate(date);
          const assignment = assignmentMap.get(dateStr);
          
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

/**
 * Memo del calendario completo
 * Solo re-renderiza cuando cambia el mes o año
 */
export default memo(Calendar, (prevProps, nextProps) => {
  return prevProps.year === nextProps.year && prevProps.month === nextProps.month;
});