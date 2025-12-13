/**
 * Hook para controlar el estado de rotación de guardias
 * Permite resetear la rotación cuando sea necesario
 */

import { useCallback, useState, useEffect } from 'react';
import { 
  loadRotationState, 
  clearRotationState, 
  RotationState 
} from '@/lib/rotationState';

export function useRotationControl() {
  const [rotationState, setRotationState] = useState<RotationState | null>(null);
  
  // Cargar estado al montar el componente
  useEffect(() => {
    const state = loadRotationState();
    setRotationState(state);
  }, []);
  
  /**
   * Reinicia la rotación desde el principio
   * Útil cuando se quiere comenzar un nuevo ciclo
   */
  const resetRotation = useCallback(() => {
    clearRotationState();
    setRotationState(null);
    // Forzar re-render del calendario
    window.dispatchEvent(new Event('rotation-reset'));
  }, []);
  
  /**
   * Recarga el estado actual de rotación
   */
  const refreshState = useCallback(() => {
    const state = loadRotationState();
    setRotationState(state);
  }, []);
  
  return {
    rotationState,
    resetRotation,
    refreshState,
    hasState: rotationState !== null,
  };
}
