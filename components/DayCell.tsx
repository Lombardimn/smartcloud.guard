import { getTeamMember, type TeamMember } from '@/lib/teamUtils';
import { isWeekday, isToday as checkIsToday, toISODate, isHoliday } from '@/lib/dateUtils';
import { Assignment } from '@/types/assignment.type';
import { memo, useMemo } from 'react';
import { MemberAvatar } from './MemberAvatar';
import { AssignmentBadge } from './AssignmentBadge';
import { getBackgroundClass, getTextColorClass } from '@/lib/assignmentUtils';
import { getHolidayInfo } from '@/lib/holidayUtils';

interface DayCellProps {
  date: Date;
  assignment?: Assignment;
}

/** Función de estilos para el borde */
const getBorderClass = (isToday: boolean): string => {
  return isToday ? 'border-4 border-secondary' : 'border border-border';
};

/** Mapeo de tipos de feriados a etiquetas */
const HOLIDAY_TYPE_LABELS: Record<string, string> = {
  immovable: 'Inamovible',
  transferable: 'Trasladable',
  bridge: 'Puente'
} as const;

/** Obtiene la etiqueta del tipo de feriado */
const getHolidayTypeLabel = (type?: string): string => {
  return type ? HOLIDAY_TYPE_LABELS[type] || '' : '';
};

function DayCell({ date, assignment }: DayCellProps) {
  // Calcular propiedades de la fecha (memoizadas para performance)
  const isWorkDay = useMemo(() => isWeekday(date), [date]);
  const isToday = useMemo(() => checkIsToday(date), [date]);
  const isoDate = useMemo(() => toISODate(date), [date]);
  const dayNumber = date.getDate();
  const isHolidayDay = useMemo(() => isHoliday(date), [date]);
  const holidayInfo = useMemo(() => isHolidayDay ? getHolidayInfo(date) : null, [date, isHolidayDay]);

  // Datos del miembro asignado (getTeamMember ya maneja undefined)
  const teamMember = useMemo<TeamMember | undefined>(
    () => getTeamMember(assignment?.personId),
    [assignment?.personId]
  );

  // Datos del miembro original (para mostrar en reemplazos)
  const originalMember = useMemo<TeamMember | undefined>(
    () => assignment?.isReplacement && assignment?.originalPersonId 
      ? getTeamMember(assignment.originalPersonId) 
      : undefined,
    [assignment]
  );

  // Clases de estilo
  const bgClass = useMemo(() => getBackgroundClass(isWorkDay, assignment, date), [isWorkDay, assignment, date]);
  const borderClass = getBorderClass(isToday);
  const textColorClass = useMemo(() => getTextColorClass(assignment?.type), [assignment?.type]);

  // Etiqueta accesible
  const ariaLabel = useMemo(() => {
    const dateStr = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    return `${dateStr}${isToday ? ', hoy' : ''}`;
  }, [date, isToday]);

  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      className={`
          aspect-square p-2 sm:p-3 rounded-lg transition-all hover:shadow-lg hover-shadow-background hover:scale-[1.02]
          ${borderClass}
          ${bgClass}
          ${!isWorkDay ? 'opacity-40' : ''} 
          ${isHolidayDay ? 'bg-accent-foreground' : ''}
        `}
    >
      {/* Contenedor con altura fija para evitar CLS */}
      <div className="flex flex-col h-full min-h-32 sm:min-h-36">
        {/* Fecha */}
        <time
          className={`text-sm sm:text-base font-semibold mb-1 sm:mb-2 ${textColorClass}`}
          dateTime={isoDate}
        >
          {dayNumber}
        </time>

        {/* Contenido de asignación */}
        {isHolidayDay ? (
          // Mostrar feriado
          <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
            <span className="text-2xl mb-1">
              {holidayInfo?.icon || '🎉'}
            </span>
            <span className="hidden sm:block text-xs text-accent font-medium leading-tight">
              {holidayInfo?.name || 'Feriado'}
            </span>
            <span className="hidden sm:block text-xs text-accent font-light leading-tight mt-2">
              {getHolidayTypeLabel(holidayInfo?.type)}
            </span>
          </div>
        ) : assignment && teamMember ? (
          // Mostrar asignación normal o reemplazo
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {/* Avatares apilados en caso de reemplazo */}
            {assignment.isReplacement && originalMember ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center">
                  {/* Avatar del reemplazante (izquierda) */}
                  <div className="relative z-10">
                    <MemberAvatar
                      initials={teamMember.initials}
                      color={teamMember.color}
                      name={teamMember.name}
                      showName={false}
                      size="small"
                    />
                  </div>
                  {/* Avatar del reemplazado (derecha, parcialmente cubierto) */}
                  <div className="relative z-0 -ml-2 sm:-ml-3 opacity-80">
                    <MemberAvatar
                      initials={originalMember.initials}
                      color={originalMember.color}
                      name={originalMember.name}
                      showName={false}
                      size="small"
                    />
                  </div>
                </div>
                {/* Nombre del reemplazante centrado debajo */}
                <span className="hidden sm:block text-sm font-medium text-foreground truncate w-full px-1 text-center">
                  {teamMember.name.split(' ')[0]}
                </span>
              </div>
            ) : (
              // Avatar normal sin reemplazo
              <MemberAvatar
                initials={teamMember.initials}
                color={teamMember.color}
                name={teamMember.name}
              />
            )}
            
            <AssignmentBadge
              type={assignment.type}
              dayType={assignment.dayType}
              isReplacement={assignment.isReplacement}
              replacementReason={assignment.replacementReason}
            />
          </div>
        ) : isWorkDay ? (
          // Día laboral sin asignar
          <div className="flex-1 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs sm:text-sm">
            Sin asignar
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Memo para evitar re-renders innecesarios */
export default memo(DayCell, (prevProps, nextProps) => {
  // Comparar fechas de forma eficiente
  if (prevProps.date.getTime() !== nextProps.date.getTime()) {
    return false;
  }

  // Comparar asignaciones
  const prevAssignment = prevProps.assignment;
  const nextAssignment = nextProps.assignment;

  // Si ambas son undefined/null, son iguales
  if (!prevAssignment && !nextAssignment) {
    return true;
  }

  // Si solo una es undefined/null, son diferentes
  if (!prevAssignment || !nextAssignment) {
    return false;
  }

  // Comparar propiedades relevantes de la asignación
  return (
    prevAssignment.personId === nextAssignment.personId &&
    prevAssignment.type === nextAssignment.type &&
    prevAssignment.dayType === nextAssignment.dayType &&
    prevAssignment.isReplacement === nextAssignment.isReplacement
  );
});
