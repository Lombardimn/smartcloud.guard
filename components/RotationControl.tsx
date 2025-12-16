'use client';

import { useRotationControl } from '@/hooks/useRotationControl';
import { RefreshCw, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getTeamConfig } from '@/lib/teamUtils';

/**
 * Panel de control para gestionar la rotación de guardias
 * Muestra información objetiva sobre el estado del sistema y permite recalcular
 */
export function RotationControl() {
  const { stats, resetRotation, isHydrated } = useRotationControl();
  const config = getTeamConfig();

  // Durante SSR y primera hidratación, mostrar placeholder
  if (!isHydrated) {
    return (
      <div className="flex flex-col gap-4" suppressHydrationWarning>
        <nav 
          className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-card border border-border rounded-lg p-4"
          aria-label="Navegación del calendario"
        >
          {/* Placeholder durante hidratación */}
        </nav>
      </div>
    );
  }

  // Sin datos históricos
  if (!stats.hasHistorical) {
    return (
      <div className="p-0.5 bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-card rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Database className="w-4 h-4" />
              <span>Sistema inicializado</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Calculando guardias desde: <span className="font-mono font-semibold">{config.startDate}</span>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚡ Las asignaciones pasadas se guardarán automáticamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Con datos históricos
  const lastSyncDate = stats.lastSync ? new Date(stats.lastSync).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  return (
    <div className="p-0.5 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-card rounded-lg">
        <div className="flex flex-col gap-2 flex-1">
          {/* Estado principal */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Historial guardado: {stats.totalDays} días</span>
          </div>

          {/* Información adicional */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <p>
              📅 Última sincronización: <span className="font-mono">{lastSyncDate}</span>
            </p>
            <p>
              🎯 Fecha de referencia: <span className="font-mono font-semibold">{config.startDate}</span>
            </p>
          </div>

          {/* Advertencia si cambió la configuración */}
          {stats.configChanged && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1.5 rounded">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                La configuración cambió. <strong>Se recomienda recalcular</strong> para actualizar asignaciones futuras.
              </span>
            </div>
          )}
        </div>

        {/* Botón de recalcular */}
        <button
          onClick={resetRotation}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer group whitespace-nowrap"
          title="Elimina el historial y recalcula todas las asignaciones desde la fecha de inicio"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">
            {stats.configChanged ? 'Recalcular ahora' : 'Reiniciar historial'}
          </span>
          <span className="sm:hidden">Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
