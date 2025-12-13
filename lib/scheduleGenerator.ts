/**
 * Generador principal de schedules/calendarios de guardias
 */

import { Assignment, AssignmentType } from '@/types/assignment.type';
import { Replacement } from '@/types/replacement.type';
import { getWorkDaysInMonth, formatDate } from '@/lib/dateUtils';
import { validateMonthYear, validateRotationOrder } from '@/lib/scheduleValidators';
import { buildReplacementLookupMap, applyReplacements } from '@/lib/replacementUtils';
import { getRotationOrder } from '@/lib/teamUtils';

/**
 * Configuración para la generación de schedule
 */
export interface ScheduleGeneratorConfig {
  rotationOrder: string[];
  replacements?: Replacement[];
}

const ASSIGNMENT_TYPES: Record<'day1' | 'day2', AssignmentType> = {
  day1: AssignmentType.REGULAR,
  day2: AssignmentType.REGULAR,
};

/**
 * Crea una asignación para un día específico
 * @param date - Fecha de la asignación
 * @param personId - ID de la persona asignada
 * @param dayType - Tipo de día (day1 o day2)
 * @returns Asignación creada
 */
function createAssignment(
  date: Date,
  personId: string,
  dayType: 'day1' | 'day2'
): Assignment {
  return {
    date: formatDate(date),
    personId,
    dayType,
    type: ASSIGNMENT_TYPES[dayType],
    isReplacement: false,
  };
}

/**
 * Genera las asignaciones base sin reemplazos
 * Implementa rotación circular de 2 días por persona
 * 
 * @param workDays - Array de días laborables
 * @param rotationOrder - Orden de rotación de personas
 * @returns Array de asignaciones base
 * 
 * Complejidad: O(n) donde n = número de días laborables
 */
function generateBaseAssignments(
  workDays: Date[],
  rotationOrder: string[]
): Assignment[] {
  const assignments: Assignment[] = [];
  let currentPersonIndex = 0;
  let dayIndex = 0;
  
  while (dayIndex < workDays.length) {
    const personId = rotationOrder[currentPersonIndex];
    const remainingDays = workDays.length - dayIndex;
    
    // Día 1 de guardia (si hay días disponibles)
    if (remainingDays >= 1) {
      assignments.push(
        createAssignment(workDays[dayIndex], personId, 'day1')
      );
      dayIndex++;
    }
    
    // Día 2 de guardia (si hay días disponibles)
    if (remainingDays >= 2) {
      assignments.push(
        createAssignment(workDays[dayIndex], personId, 'day2')
      );
      dayIndex++;
    }
    
    // Siguiente persona en la rotación circular
    currentPersonIndex = (currentPersonIndex + 1) % rotationOrder.length;
  }
  
  return assignments;
}

/**
 * Genera el schedule completo para un mes con reemplazos aplicados
 * 
 * @param year - Año (1900-2100)
 * @param month - Mes (0-11)
 * @param config - Configuración con orden de rotación y reemplazos opcionales
 * @returns Array de asignaciones con reemplazos aplicados
 * 
 * Complejidad total: O(n + r×d) donde:
 * - n = días laborables en el mes
 * - r = reemplazos activos
 * - d = días promedio por reemplazo
 * 
 * @example
 * ```typescript
 * const schedule = generateScheduleForMonth(2024, 11, {
 *   rotationOrder: ['gc', 'rv', 'mb'],
 *   replacements: [...]
 * });
 * ```
 */
export function generateScheduleForMonth(
  year: number,
  month: number,
  config: ScheduleGeneratorConfig
): Assignment[] {
  // 1. Validaciones
  validateMonthYear(year, month);
  validateRotationOrder(config.rotationOrder);
  
  // 2. Obtener días laborables del mes
  const workDays = getWorkDaysInMonth(year, month);
  
  // Edge case: no hay días laborables
  if (workDays.length === 0) {
    return [];
  }
  
  // 3. Generar asignaciones base (sin reemplazos)
  const baseAssignments = generateBaseAssignments(
    workDays,
    config.rotationOrder
  );
  
  // 4. Si no hay reemplazos, retornar directamente
  if (!config.replacements || config.replacements.length === 0) {
    return baseAssignments;
  }
  
  // 5. Construir lookup map de reemplazos O(r×d)
  const replacementMap = buildReplacementLookupMap(
    config.replacements,
    workDays
  );
  
  // 6. Aplicar reemplazos con lookup O(1) = total O(n)
  const finalAssignments = applyReplacements(
    baseAssignments,
    replacementMap
  );
  
  return finalAssignments;
}

/**
 * Genera schedule para un mes usando datos cargados desde JSON
 * Versión simplificada para cuando ya tienes teamData y replacements
 * 
 * @param year - Año
 * @param month - Mes (0-11)
 * @returns Array de asignaciones
 */
export function generateScheduleForMonthFromData(
  year: number,
  month: number
): Assignment[] {
  return generateScheduleForMonth(year, month, {
    rotationOrder: getRotationOrder(),
    replacements: []
  });
}
