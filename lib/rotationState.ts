/**
 * Gestión del estado de rotación entre meses
 * Mantiene la continuidad de las guardias usando localStorage
 */

const STORAGE_KEY = 'smartcloud-guard-rotation-state';

export interface RotationState {
  /** Último mes procesado en formato YYYY-MM */
  lastMonth: string;
  /** Índice de la última persona asignada en rotationOrder */
  lastPersonIndex: number;
  /** Día del ciclo: 'day1' o 'day2' o 'complete' (ciclo completo) */
  lastDayType: 'day1' | 'day2' | 'complete';
  /** Total de días asignados en el último mes */
  totalDaysAssigned: number;
}

/**
 * Formatea año y mes como YYYY-MM
 */
function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/**
 * Carga el estado de rotación desde localStorage
 */
export function loadRotationState(): RotationState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading rotation state:', error);
    return null;
  }
}

/**
 * Guarda el estado de rotación en localStorage
 */
export function saveRotationState(state: RotationState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving rotation state:', error);
  }
}

/**
 * Limpia el estado de rotación (útil para reiniciar)
 */
export function clearRotationState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing rotation state:', error);
  }
}

/**
 * Calcula el índice de inicio para un mes basado en el estado anterior
 * 
 * @param year - Año del mes actual
 * @param month - Mes actual (0-11)
 * @param rotationOrderLength - Tamaño del array de rotación
 * @returns Objeto con índice de inicio y tipo de día
 */
export function calculateStartingPoint(
  year: number,
  month: number,
  rotationOrderLength: number
): { personIndex: number; dayType: 'day1' | 'day2' | 'complete' } {
  const currentMonth = formatYearMonth(year, month);
  const savedState = loadRotationState();
  
  // Si no hay estado guardado, iniciar desde el principio
  if (!savedState) {
    return { personIndex: 0, dayType: 'complete' };
  }
  
  // Si es el mismo mes, usar el estado guardado (re-render del mismo mes)
  if (savedState.lastMonth === currentMonth) {
    return {
      personIndex: savedState.lastPersonIndex,
      dayType: savedState.lastDayType
    };
  }
  
  // Verificar si el mes actual es consecutivo al último guardado
  const isConsecutive = isConsecutiveMonth(savedState.lastMonth, currentMonth);
  
  if (!isConsecutive) {
    // Si no es consecutivo, iniciar desde el principio
    console.log('Non-consecutive month detected, starting from beginning');
    return { personIndex: 0, dayType: 'complete' };
  }
  
  // Calcular dónde continuar basado en el estado anterior
  if (savedState.lastDayType === 'complete') {
    // Si el ciclo estaba completo, pasar a la siguiente persona
    const nextPersonIndex = (savedState.lastPersonIndex + 1) % rotationOrderLength;
    return { personIndex: nextPersonIndex, dayType: 'complete' };
  } else if (savedState.lastDayType === 'day1') {
    // Si quedó en day1, continuar con day2 de la misma persona
    return { personIndex: savedState.lastPersonIndex, dayType: 'day2' };
  } else {
    // lastDayType === 'day2', completar ciclo y pasar a la siguiente persona
    const nextPersonIndex = (savedState.lastPersonIndex + 1) % rotationOrderLength;
    return { personIndex: nextPersonIndex, dayType: 'complete' };
  }
}

/**
 * Verifica si dos meses en formato YYYY-MM son consecutivos
 */
function isConsecutiveMonth(prevMonth: string, currentMonth: string): boolean {
  const [prevYear, prevMonthNum] = prevMonth.split('-').map(Number);
  const [currYear, currMonthNum] = currentMonth.split('-').map(Number);
  
  // Mismo año, mes siguiente
  if (prevYear === currYear) {
    return currMonthNum === prevMonthNum + 1;
  }
  
  // Cambio de año: diciembre -> enero
  if (prevYear + 1 === currYear && prevMonthNum === 12 && currMonthNum === 1) {
    return true;
  }
  
  return false;
}

/**
 * Actualiza el estado de rotación después de generar un schedule
 * 
 * @param year - Año del mes procesado
 * @param month - Mes procesado (0-11)
 * @param lastPersonIndex - Índice de la última persona asignada
 * @param lastDayType - Tipo del último día asignado
 * @param totalDaysAssigned - Total de días asignados
 */
export function updateRotationState(
  year: number,
  month: number,
  lastPersonIndex: number,
  lastDayType: 'day1' | 'day2' | 'complete',
  totalDaysAssigned: number
): void {
  const state: RotationState = {
    lastMonth: formatYearMonth(year, month),
    lastPersonIndex,
    lastDayType,
    totalDaysAssigned,
  };
  
  saveRotationState(state);
}
