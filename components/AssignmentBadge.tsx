import { memo } from "react";
import { AssignmentType } from "@/types/assignment.type";

interface AssignmentBadgeProps {
  type?: AssignmentType;
  dayType: 'day1' | 'day2';
  isReplacement?: boolean;
  replacementReason?: string;
}

const TYPE_LABELS = {
  [AssignmentType.REGULAR]: '📅 Regular',
  [AssignmentType.SPECIAL]: '⭐ Especial',
  [AssignmentType.HOLIDAY]: '🎉 Feriado'
} as const;

export const AssignmentBadge = memo(({ type, dayType, isReplacement, replacementReason }: AssignmentBadgeProps) => {
  const assignmentLabel = isReplacement 
    ? '🔄 Reemplazo' 
    : type 
      ? TYPE_LABELS[type]
      : null;

  return (
    <div className="flex flex-col items-center gap-1 mt-1">
      {/* Tipo de asignación (Regular, Especial, Feriado, Reemplazo) */}
      {assignmentLabel && (
        <div className={`text-xs flex items-center gap-1 font-medium ${
          isReplacement ? 'text-primary' : 'text-muted-foreground'
        }`}>
          <span className="hidden sm:inline">{assignmentLabel}</span>
          <span className="sm:hidden">{assignmentLabel.split(' ')[0]}</span>
        </div>
      )}
      
      {/* Motivo del reemplazo (solo desktop) */}
      {isReplacement && replacementReason && (
        <div className="hidden sm:block text-[8px] text-muted-foreground italic leading-tight">
          ({replacementReason})
        </div>
      )}
      
      {/* Tipo de día (Día 1 o Día 2) */}
      <span className="text-xs text-muted-foreground font-normal">
        {dayType === 'day1' ? 'Día 1' : 'Día 2'}
      </span>
    </div>
  );
});
AssignmentBadge.displayName = 'AssignmentBadge';
