'use client';

import { useMemo } from 'react';
import { getAllTeamMembers } from '@/lib/teamUtils';
import { getHolidaysInMonth } from '@/lib/holidayUtils';
import { Calendar, User2, PartyPopper } from 'lucide-react';
import replacementsData from '@/data/replacements.json';

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
    <div className="p-0.5 mb-4 bg-linear-to-r from-border to-primary/10 rounded-lg">
      <div className="sm:hidden flex flex-col gap-4 p-4 bg-card rounded-lg border border-border shadow">
        {/* Encabezado */}
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calendar className="w-4 h-4" />
          <span>Leyenda del Calendario</span>
        </div>

        {/* Sección: Miembros del Equipo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
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
                <span className="text-foreground truncate">
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Tipos de Guardia */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Tipos de Guardia
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded text-[10px] font-medium">
                Día 1
              </div>
              <span>Primer día de guardia</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="px-2 py-0.5 bg-navy-100 dark:bg-navy-900/30 text-navy-800 dark:text-navy-100 rounded text-[10px] font-medium">
                Día 2
              </div>
              <span>Segundo día de guardia</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-[10px] font-medium">
                🎉
              </div>
              <span>Feriado (sin asignación)</span>
            </div>
          </div>
        </div>

        {/* Sección: Reemplazos */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            🔄 Reemplazos
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary font-semibold shrink-0">🔄</span>
              <div className="flex-1">
                <p className="leading-relaxed">
                  Cuando se muestra <span className="text-primary font-medium">&quot;🔄 Reemplazo&quot;</span>,
                  verás dos avatares: el de quien <strong className="text-foreground">está haciendo</strong> la guardia (izquierda)
                  y el de la persona reemplazada (derecha).
                </p>
              </div>
            </div>
            
            {/* Lista de reemplazos activos */}
            {replacementsData.replacements.filter(r => r.status === 'active').map(replacement => {
              const originalMember = getAllTeamMembers().find(m => m.id === replacement.originalPersonId);
              const replacementMember = getAllTeamMembers().find(m => m.id === replacement.replacementPersonId);
              
              return (
                <div key={replacement.id} className="flex items-start gap-2 text-xs bg-primary/5 p-2 rounded">
                  <span className="text-[10px] mt-0.5">📝</span>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {replacementMember?.name} → {originalMember?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(replacement.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(replacement.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      {' • '}{replacement.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección: Feriados del Mes */}
        {holidays.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
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
                    <div className="font-medium text-foreground">
                      {holiday.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
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
    </div>
  );
}
