'use client';

import { useMemo } from 'react';
import { getAllTeamMembers } from '@/lib/teamUtils';
import { getHolidaysInMonth } from '@/lib/holidayUtils';
import { Calendar, User2, PartyPopper } from 'lucide-react';

interface CalendarLegendProps {
  year: number;
  month: number;
}

/**
 * Componente de leyenda del calendario (solo visible en móvil)
 * Muestra explicación de siglas, iconos y feriados del mes
 */
export function CalendarLegend({ year, month }: CalendarLegendProps) {
  const teamMembers = useMemo(() => getAllTeamMembers(), []);
  const holidays = useMemo(() => getHolidaysInMonth(year, month), [year, month]);

  return (
    <div className="sm:hidden flex flex-col gap-4 p-4 bg-white dark:bg-[#100037] rounded-lg border border-zinc-200 dark:border-zinc-700">
      {/* Encabezado */}
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <Calendar className="w-4 h-4" />
        <span>Leyenda del Calendario</span>
      </div>

      {/* Sección: Miembros del Equipo */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <User2 className="w-3.5 h-3.5" />
          <span>Miembros del Equipo</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <span className="text-zinc-700 dark:text-zinc-300 truncate">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección: Tipos de Guardia */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Tipos de Guardia
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium">
              Día 1
            </div>
            <span>Primer día de guardia</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-medium">
              Día 2
            </div>
            <span>Segundo día de guardia</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-[10px] font-medium">
              🎉
            </div>
            <span>Feriado (sin asignación)</span>
          </div>
        </div>
      </div>

      {/* Sección: Feriados del Mes */}
      {holidays.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Feriados de este mes</span>
          </div>
          <div className="space-y-1.5">
            {holidays.map(holiday => (
              <div
                key={holiday.date}
                className="flex items-start gap-2 text-xs"
              >
                <span className="text-[10px] mt-0.5">🎉</span>
                <div className="flex-1">
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">
                    {holiday.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {new Date(holiday.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          💡 Cada persona tiene 2 días consecutivos de guardia. La rotación continúa automáticamente entre meses.
        </p>
      </div>
    </div>
  );
}
