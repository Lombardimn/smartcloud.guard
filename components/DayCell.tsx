import { getTeamMember } from '@/lib/scheduleGenerator';
import { isWeekday } from '@/lib/dateUtils';
import { Assignment } from '@/types/assignment.type';
import { memo } from 'react';
import { MemberAvatar } from './MemberAvatar';
import { AssignmentBadge } from './AssignmentBadge';

interface DayCellProps {
  date: Date;
  assignment?: Assignment;
  isToday?: boolean;
}

/** Funciones de estilos para las celdas */
const getBackgroundClass = (isWorkDay: boolean, assignmentType?: 'regular' | 'special' | 'holiday'): string => {
  if (!isWorkDay) return 'bg-gray-100';
  if (!assignmentType) return 'bg-white';
  return assignmentType === 'regular' ? 'bg-guard-day1' : 'bg-guard-day2';
};

const getBorderClass = (isToday: boolean): string => {
  return isToday ? 'border-4 border-blue-500' : 'border border-gray-200';
};

function DayCell({ date, assignment, isToday = false }: DayCellProps) {
  const isWorkDay = isWeekday(date);
  const teamMember = assignment ? getTeamMember(assignment.personId) : null;
  const bgClass = getBackgroundClass(isWorkDay, assignment?.type);
  const borderClass = getBorderClass(isToday);
  
  return (
    <div
      className={`
        aspect-square p-2 sm:p-3 rounded-lg transition-all hover:shadow-lg
        ${bgClass}
        ${borderClass}
        ${!isWorkDay ? 'opacity-50' : ''}
      `}
      role="gridcell"
      aria-label={`${date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}${isToday ? ', hoy' : ''}`}
    >
      {/* Contenedor con altura fija para evitar CLS */}
      <div className="flex flex-col h-full min-h-[80px] sm:min-h-[100px]">
        {/* Fecha */}
        <time 
          className="text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2"
          dateTime={date.toISOString().split('T')[0]}
        >
          {date.getDate()}
        </time>
        
        {/* Contenido de asignación */}
        {assignment && teamMember ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <MemberAvatar 
              initials={teamMember.initials}
              color={teamMember.color}
              name={teamMember.name}
            />
            <AssignmentBadge
              type={assignment.type}
              isReplacement={assignment.isReplacement}
            />
          </div>
        ) : isWorkDay ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
            Sin asignar
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Memo para evitar re-renders innecesarios */
export default memo(DayCell, (prevProps, nextProps) => {
  return (
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.assignment?.personId === nextProps.assignment?.personId &&
    prevProps.assignment?.type === nextProps.assignment?.type &&
    prevProps.assignment?.isReplacement === nextProps.assignment?.isReplacement &&
    prevProps.isToday === nextProps.isToday
  );
});
