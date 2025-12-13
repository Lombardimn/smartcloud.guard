/**
 * Validadores para generación de schedules
 */

import { Assignment } from '@/types/assignment.type';

/**
 * Valida que el año esté en un rango válido
 * @param year - Año a validar
 * @throws Error si el año es inválido
 */
export function validateYear(year: number): void {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error(`Año inválido: ${year}. Debe estar entre 1900 y 2100.`);
  }
}

/**
 * Valida que el mes esté en un rango válido (0-11)
 * @param month - Mes a validar
 * @throws Error si el mes es inválido
 */
export function validateMonth(month: number): void {
  if (!Number.isInteger(month) || month < 0 || month > 11) {
    throw new Error(`Mes inválido: ${month}. Debe estar entre 0 y 11.`);
  }
}

/**
 * Valida año y mes juntos
 * @param year - Año
 * @param month - Mes (0-11)
 * @throws Error si alguno es inválido
 */
export function validateMonthYear(year: number, month: number): void {
  validateYear(year);
  validateMonth(month);
}

/**
 * Valida que los datos del equipo sean correctos
 * @param rotationOrder - Orden de rotación del equipo
 * @throws Error si no hay miembros en la rotación
 */
export function validateRotationOrder(rotationOrder: string[]): void {
  if (!rotationOrder?.length) {
    throw new Error('El equipo debe tener al menos un miembro en rotationOrder.');
  }
}

/**
 * Cuenta cuántos días de cada tipo tiene una persona en el mes
 * @param assignments - Asignaciones del mes
 * @returns Record con conteos por persona
 */
export function countAssignmentsByPerson(
  assignments: Assignment[]
): Record<string, { day1: number; day2: number; total: number }> {
  const counts: Record<string, { day1: number; day2: number; total: number }> = {};
  
  assignments.forEach(assignment => {
    if (!assignment.personId) return;
    
    const personId = assignment.personId;
    
    if (!counts[personId]) {
      counts[personId] = { day1: 0, day2: 0, total: 0 };
    }
    
    if (assignment.dayType === 'day1') {
      counts[personId].day1++;
    } else {
      counts[personId].day2++;
    }
    
    counts[personId].total++;
  });
  
  return counts;
}

/**
 * Valida que la distribución de guardias sea equitativa
 * @param assignments - Asignaciones a validar
 * @returns true si la diferencia máxima entre personas es <= 2 días
 */
export function validateFairDistribution(assignments: Assignment[]): boolean {
  const counts = countAssignmentsByPerson(assignments);
  const totals = Object.values(counts).map(c => c.total);
  
  if (totals.length === 0) return true;
  
  const max = Math.max(...totals);
  const min = Math.min(...totals);
  
  return (max - min) <= 2;
}
