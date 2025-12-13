import { memo } from "react";

interface AssignmentBadgeProps {
  type: 'day1' | 'day2';
  isReplacement?: boolean;
}

export const AssignmentBadge = memo(({ type, isReplacement }: AssignmentBadgeProps) => (
  <div className="flex flex-col items-center gap-1 mt-1">
    {isReplacement && (
      <div className="text-xs text-orange-600 flex items-center gap-1 font-medium">
        <span role="img" aria-label="Advertencia">⚠️</span>
        <span>Reemplazo</span>
      </div>
    )}
    <span className="text-xs text-gray-600 font-medium">
      {type === 'day1' ? 'Día 1' : 'Día 2'}
    </span>
  </div>
));
AssignmentBadge.displayName = 'AssignmentBadge';
