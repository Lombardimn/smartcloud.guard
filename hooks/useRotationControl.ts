/**
 * Hook para controlar el estado de rotación de guardias
 * Proporciona información objetiva y control para recalcular cuando sea necesario
 */

import { useCallback, useSyncExternalStore } from 'react';
import { 
  clearRotationState, 
  getRotationStats
} from '@/lib/rotationState';

// Store externo para estadísticas de rotación
let statsCache: ReturnType<typeof getRotationStats> | null = null;
let listeners: Array<() => void> = [];

// Valor constante para SSR (evita crear nuevo objeto en cada llamada)
const SSR_STATS = {
  hasHistorical: false,
  totalDays: 0,
  lastSync: null,
  configChanged: false
};

function getSnapshot() {
  if (typeof window === 'undefined') {
    return SSR_STATS;
  }
  
  if (statsCache === null) {
    statsCache = getRotationStats();
  }
  
  return statsCache;
}

function getServerSnapshot() {
  return SSR_STATS;
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export function useRotationControl() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    () => () => {}, // subscribe (no-op since this never changes)
    () => true,      // client snapshot
    () => false      // server snapshot
  );
  
  /**
   * Reinicia la rotación eliminando TODO el historial
   * ADVERTENCIA: Esto borrará las asignaciones guardadas
   */
  const resetRotation = useCallback(() => {
    const confirmMessage = stats.hasHistorical
      ? `⚠️ Esto eliminará ${stats.totalDays} días de historial guardado.\n\n¿Deseas continuar?`
      : '¿Deseas reiniciar el sistema de rotación?';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    clearRotationState();
    statsCache = null;
    notifyListeners();
    
    // Forzar re-render del calendario
    window.dispatchEvent(new Event('rotation-reset'));
    
    console.log('✅ Rotación reiniciada');
  }, [stats]);
  
  /**
   * Recarga las estadísticas actuales
   */
  const refreshStats = useCallback(() => {
    statsCache = getRotationStats();
    notifyListeners();
  }, []);
  
  return {
    stats,
    resetRotation,
    refreshStats,
    isHydrated,
  };
}
