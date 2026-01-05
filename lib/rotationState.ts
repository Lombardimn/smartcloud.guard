/**
 * Gestión del estado de rotación de guardias
 * 
 * FILOSOFÍA DEL SISTEMA:
 * - Las asignaciones PASADAS (< hoy) son INMUTABLES y se guardan en localStorage
 * - Las asignaciones FUTURAS (>= hoy) se calculan dinámicamente desde startDate
 * - startDate es la fecha de referencia para calcular el orden de rotación
 * - Si startDate cambia, solo afecta el futuro, el pasado permanece inmutable
 */

import { getTeamConfig } from '@/lib/teamUtils';
import { isWeekday, isHoliday } from '@/lib/dateUtils';
import { Assignment } from '@/types/assignment.type';

const STORAGE_KEY = 'smartcloud-guard-rotation-state';
const CONFIG_KEY = 'smartcloud-guard-config-hash';

/**
 * Estado de rotación que se persiste en localStorage
 * Contiene asignaciones históricas INMUTABLES (antes de hoy)
 */
export interface RotationState {
  /** Hash de configuración (startDate + rotationOrder) para detectar cambios */
  configHash: string;
  /** Fecha de última sincronización */
  lastSync: string;
  /** Asignaciones históricas inmutables (YYYY-MM-DD -> Assignment) */
  historicalAssignments: Record<string, Assignment>;
  /** Total de días guardados en histórico */
  totalHistoricalDays: number;
}

/**
 * Genera un hash de la configuración actual
 * Usado para detectar cambios en cualquier JSON de configuración
 */
function generateConfigHash(): string {
  const teamData = require('@/data/team.json');
  const replacementsData = require('@/data/replacements.json');
  const holidaysData = require('@/data/holidays.json');
  
  const config = getTeamConfig();
  const rotationOrder = teamData.rotationOrder;
  const team = teamData.team;
  
  // Incluir todos los datos relevantes en el hash
  const parts = [
    config.startDate,
    config.daysPerGuard.toString(),
    config.workDaysOnly.toString(),
    rotationOrder.join(','),
    JSON.stringify(team),
    JSON.stringify(replacementsData),
    JSON.stringify(holidaysData)
  ];
  
  return parts.join('|');
}

/**
 * Verifica si la configuración ha cambiado
 */
export function hasConfigChanged(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    const current = generateConfigHash();
    return stored !== current;
  } catch (error) {
    return false;
  }
}

/**
 * Formatea fecha como YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Carga el estado de rotación desde localStorage
 */
export function loadRotationState(): RotationState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const state = JSON.parse(stored) as RotationState;
    
    // Verificar si la configuración cambió
    if (state.configHash !== generateConfigHash()) {
      console.warn('⚠️ Configuración cambió - los datos históricos se mantienen pero se recalculará el futuro');
      // No invalidamos el histórico, solo marcamos que hay cambio
    }
    
    return state;
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
    localStorage.setItem(CONFIG_KEY, state.configHash);
  } catch (error) {
    console.error('Error saving rotation state:', error);
  }
}

/**
 * Limpia el estado de rotación (útil para reiniciar)
 * ADVERTENCIA: Esto eliminará TODO el historial inmutable
 */
export function clearRotationState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONFIG_KEY);
    console.log('✅ Estado de rotación limpiado');
  } catch (error) {
    console.error('Error clearing rotation state:', error);
  }
}

/**
 * Obtiene una asignación histórica específica
 */
export function getHistoricalAssignment(date: string): Assignment | null {
  const state = loadRotationState();
  if (!state || !state.historicalAssignments) return null;
  
  return state.historicalAssignments[date] || null;
}

/**
 * Guarda una asignación en el histórico (solo si es pasada)
 */
export function saveHistoricalAssignment(assignment: Assignment): void {
  const assignmentDate = new Date(assignment.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Solo guardar si la fecha es anterior a hoy
  if (assignmentDate >= today) {
    return;
  }
  
  let state = loadRotationState();
  
  if (!state) {
    state = {
      configHash: generateConfigHash(),
      lastSync: new Date().toISOString(),
      historicalAssignments: {},
      totalHistoricalDays: 0
    };
  }
  
  // Agregar o actualizar asignación
  const dateKey = assignment.date;
  const isNew = !state.historicalAssignments[dateKey];
  
  state.historicalAssignments[dateKey] = assignment;
  
  if (isNew) {
    state.totalHistoricalDays++;
  }
  
  state.lastSync = new Date().toISOString();
  state.configHash = generateConfigHash();
  
  saveRotationState(state);
}

/**
 * Guarda múltiples asignaciones históricas en batch
 */
export function saveHistoricalAssignments(assignments: Assignment[]): void {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingState = loadRotationState();
  
  // Crear estado nuevo o usar el existente
  const state: RotationState = existingState || {
    configHash: generateConfigHash(),
    lastSync: new Date().toISOString(),
    historicalAssignments: {},
    totalHistoricalDays: 0
  };
  
  // Asegurar que historicalAssignments existe
  if (!state.historicalAssignments || typeof state.historicalAssignments !== 'object') {
    state.historicalAssignments = {};
  }
  
  let newCount = 0;
  
  assignments.forEach(assignment => {
    try {
      const assignmentDate = new Date(assignment.date);
      
      // Solo guardar si es anterior a hoy
      if (assignmentDate < today) {
        const dateKey = assignment.date;
        const isNew = !state.historicalAssignments[dateKey];
        
        state.historicalAssignments[dateKey] = assignment;
        
        if (isNew) {
          newCount++;
        }
      }
    } catch (error) {
      console.error('Error procesando asignación:', assignment, error);
    }
  });
  
  // Recalcular total y actualizar metadata
  state.totalHistoricalDays = Object.keys(state.historicalAssignments || {}).length;
  state.lastSync = new Date().toISOString();
  state.configHash = generateConfigHash();
  
  if (newCount > 0) {
    saveRotationState(state);
    console.log(`✅ Guardadas ${newCount} nuevas asignaciones históricas`);
  }
}

/**
 * Calcula cuántos días laborables han pasado desde startDate hasta una fecha específica
 * NO incluye el startDate mismo - la rotación empieza DESDE startDate
 */
function calculateWorkdaysSinceStart(startDate: string, targetDate: Date): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  // Si target es el mismo día o antes que startDate, retornar 0
  if (target <= start) {
    return 0;
  }
  
  let workDays = 0;
  const current = new Date(start);
  
  // Empezar a contar desde el DÍA SIGUIENTE al startDate
  current.setDate(current.getDate() + 1);
  
  // Contar días laborables hasta la fecha target (exclusive)
  while (current < target) {
    if (isWeekday(current) && !isHoliday(current)) {
      workDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
}

/**
 * Calcula el punto de inicio para un día específico basado en startDate
 * 
 * @param targetDate - Fecha para la cual calcular el punto de inicio
 * @param rotationOrderLength - Tamaño del array de rotación
 * @returns Objeto con índice de persona y tipo de día
 */
export function calculateStartingPoint(
  targetDate: Date,
  rotationOrderLength: number
): { personIndex: number; dayType: 'day1' | 'day2' | 'complete' } {
  const config = getTeamConfig();
  const startDate = config.startDate;
  const daysPerPerson = config.daysPerGuard;
  
  // Calcular días laborables desde startDate hasta targetDate
  const workdaysSinceStart = calculateWorkdaysSinceStart(startDate, targetDate);
  
  // Calcular ciclos según días configurados por persona
  const totalCycles = Math.floor(workdaysSinceStart / daysPerPerson);
  const remainderDays = workdaysSinceStart % daysPerPerson;
  
  // Calcular qué persona corresponde
  const personIndex = totalCycles % rotationOrderLength;
  
  // Determinar el tipo de día
  let dayType: 'day1' | 'day2' | 'complete';
  if (remainderDays === 0) {
    dayType = 'complete'; // Comienza un nuevo ciclo completo
  } else if (remainderDays === 1) {
    dayType = 'day2'; // Segundo día (o último en ciclos de 2)
  } else {
    dayType = 'complete'; // Para ciclos > 2, considerar completo
  }
  
  return { personIndex, dayType };
}

/**
 * Obtiene estadísticas del estado actual
 */
export function getRotationStats(): {
  hasHistorical: boolean;
  totalDays: number;
  lastSync: string | null;
  configChanged: boolean;
} {
  const state = loadRotationState();
  
  if (!state || !state.historicalAssignments) {
    return {
      hasHistorical: false,
      totalDays: 0,
      lastSync: null,
      configChanged: false
    };
  }
  
  // Calcular total real de días guardados de forma segura
  let totalDays = 0;
  try {
    totalDays = Object.keys(state.historicalAssignments || {}).length;
  } catch {
    totalDays = state.totalHistoricalDays || 0;
  }
  
  return {
    hasHistorical: totalDays > 0,
    totalDays,
    lastSync: state.lastSync || null,
    configChanged: hasConfigChanged()
  };
}
