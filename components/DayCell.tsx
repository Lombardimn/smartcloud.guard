'use client';

import { Assignment } from '@/types';
import { getTeamMember } from '@/lib/scheduleGenerator';
import { isWeekday } from '@/lib/dateUtils';

interface DayCellProps {
  date: Date;
  assignment?: Assignment;
}

export default function DayCell({ date, assignment }: DayCellProps) {
  const isWorkDay = isWeekday(date);
  const isToday = new Date().toDateString() === date.toDateString();
  
  const teamMember = assignment ? getTeamMember(assignment.personId) : null;
  const originalMember = assignment?.originalPersonId 
    ? getTeamMember(assignment.originalPersonId) 
    : null;

  const getBackgroundColor = () => {
    if (!isWorkDay) return 'bg-gray-100';
    if (!assignment) return 'bg-white';
    
    if (assignment.type === 'day1') {
      return 'bg-guard-day1';
    } else {
      return 'bg-guard-day2';
    }
  };

  const getBorderColor = () => {
    if (isToday) return 'border-4 border-blue-500';
    return 'border border-gray-200';
  };

  return (
    <div
      className={`
        aspect-square p-2 rounded-lg transition-all hover:shadow-lg
        ${getBackgroundColor()}
        ${getBorderColor()}
        ${!isWorkDay ? 'opacity-50' : ''}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="text-sm font-semibold text-gray-700 mb-1">
          {date.getDate()}
        </div>
        
        {assignment && teamMember && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1"
              style={{ backgroundColor: teamMember.color }}
            >
              {teamMember.initials}
            </div>
            
            <div className="text-xs font-medium text-gray-800 truncate w-full">
              {teamMember.name.split(' ')[0]}
            </div>
            
            {assignment.isReplacement && originalMember && (
              <div className="text-xs text-orange-600 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                <span>Reemplazo</span>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-1">
              {assignment.type === 'day1' ? 'Día 1' : 'Día 2'}
            </div>
          </div>
        )}
        
        {!assignment && isWorkDay && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
            Sin asignar
          </div>
        )}
      </div>
    </div>
  );
}