/**
 * Hook para controlar el estado de rotación de guardias
 * Permite resetear la rotación cuando sea necesario
 */

import { useCallback, useSyncExternalStore } from 'react';
import { 
  loadRotationState, 
  clearRotationState, 
  RotationState 
} from '@/lib/rotationState';

// Store externo para el estado de rotación
let rotationStateCache: RotationState | null = null;
let listeners: Array<() => void> = [];

function getSnapshot(): RotationState | null {
  if (typeof window === 'undefined') return null;
  if (rotationStateCache === null) {
    rotationStateCache = loadRotationState();
  }
  return rotationStateCache;
}

function getServerSnapshot(): RotationState | null {
  return null;
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
  const rotationState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  /**
   * Reinicia la rotación desde el principio
   * Útil cuando se quiere comenzar un nuevo ciclo
   */
  const resetRotation = useCallback(() => {
    clearRotationState();
    rotationStateCache = null;
    notifyListeners();
    // Forzar re-render del calendario
    window.dispatchEvent(new Event('rotation-reset'));
  }, []);
  
  /**
   * Recarga el estado actual de rotación
   */
  const refreshState = useCallback(() => {
    rotationStateCache = loadRotationState();
    notifyListeners();
  }, []);
  
  return {
    rotationState,
    resetRotation,
    refreshState,
    hasState: rotationState !== null,
    isHydrated: typeof window !== 'undefined',
  };
}
