'use client';

import { useRotationControl } from '@/hooks/useRotationControl';
import { RotateCw, RefreshCw } from 'lucide-react';
import { getTeamConfig } from '@/lib/teamUtils';

/**
 * Panel de control para gestionar la rotación de guardias
 * Muestra el estado actual y permite resetear la rotación
 */
export function RotationControl() {
  const { rotationState, resetRotation, hasState, isHydrated } = useRotationControl();
  const config = getTeamConfig();

  // Durante SSR y antes de hidratar, mostrar el estado sin rotación guardada
  // para evitar errores de hidratación
  if (!isHydrated || !hasState) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground" suppressHydrationWarning>
        <RotateCw className="w-4 h-4" />
        <span>Rotación calculada desde: {config.startDate}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-medium text-violet-900 dark:text-violet-100">
          <RotateCw className="w-4 h-4" />
          <span>Rotación Continua (desde {config.startDate})</span>
        </div>
        {rotationState && (
          <p className="text-xs text-violet-700 dark:text-violet-300">
            Último mes: {rotationState.lastMonth} •
            Días asignados: {rotationState.totalDaysAssigned} •
            Ciclo: {rotationState.lastDayType === 'complete' ? 'Completo' :
              rotationState.lastDayType === 'day1' ? 'Día 1' : 'Día 2'}
          </p>
        )}
      </div>

      <button
        onClick={resetRotation}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-md transition-colors"
        title="Recalcular desde fecha de inicio configurada"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden sm:inline">Recalcular</span>
        <span className="sm:hidden">Resetear</span>
      </button>
    </div>
  );
}
