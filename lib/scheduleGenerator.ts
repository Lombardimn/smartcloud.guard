/**
 * Generador principal de schedules/calendarios de guardias
 * 
 * ESTRATEGIA:
 * 1. Para fechas PASADAS: usar datos guardados en localStorage (inmutables)
 * 2. Para fechas FUTURAS: calcular dinámicamente desde startDate
 * 3. Guardar automáticamente el histórico de asignaciones pasadas
 */

import { Assignment, AssignmentType } from '@/types/assignment.type';
import { Replacement } from '@/types/replacement.type';
import { getWorkDaysInMonth, formatDate } from '@/lib/dateUtils';
import { validateMonthYear, validateRotationOrder } from '@/lib/scheduleValidators';
import { buildReplacementLookupMap, applyReplacements } from '@/lib/replacementUtils';
import { getRotationOrder } from '@/lib/teamUtils';
import { 
  calculateStartingPoint, 
  getHistoricalAssignment,
  saveHistoricalAssignments
} from '@/lib/rotationState';

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
 * Genera las asignaciones para un mes
 * 
 * LÓGICA:
 * 1. Intenta usar datos históricos guardados (para días pasados)
 * 2. Calcula dinámicamente desde startDate (para días futuros o sin datos)
 * 3. Guarda automáticamente las asignaciones pasadas en localStorage
 * 
 * @param workDays - Array de días laborables
 * @param rotationOrder - Orden de rotación de personas
 * @param year - Año del mes
 * @param month - Mes (0-11)
 * @returns Array de asignaciones
 */
function generateBaseAssignments(
  workDays: Date[],
  rotationOrder: string[],
  year: number,
  month: number
): Assignment[] {
  const assignments: Assignment[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Procesar cada día laborable
  for (let i = 0; i < workDays.length; i++) {
    const currentDay = workDays[i];
    const dateStr = formatDate(currentDay);
    
    // Para días pasados, intentar usar datos guardados
    if (currentDay < today) {
      const historical = getHistoricalAssignment(dateStr);
      
      if (historical) {
        // Usar dato histórico guardado (inmutable)
        assignments.push(historical);
        continue;
      }
    }
    
    // Para días futuros o sin datos históricos, calcular desde startDate
    const startingPoint = calculateStartingPoint(currentDay, rotationOrder.length);
    
    let currentPersonIndex = startingPoint.personIndex;
    let currentDayType = startingPoint.dayType;
    
    // Determinar qué asignar en este día
    let assignmentDayType: 'day1' | 'day2';
    
    if (currentDayType === 'day2') {
      // Completar el day2 pendiente
      assignmentDayType = 'day2';
    } else {
      // Iniciar nuevo ciclo con day1
      assignmentDayType = 'day1';
    }
    
    const personId = rotationOrder[currentPersonIndex];
    
    assignments.push(
      createAssignment(currentDay, personId, assignmentDayType)
    );
  }
  
  // Guardar automáticamente las asignaciones pasadas en el histórico
  saveHistoricalAssignments(assignments);
  
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
    config.rotationOrder,
    year,
    month
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
