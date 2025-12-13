/**
 * Utilidades para manejo de reemplazos en el schedule
 */

import { Assignment } from '@/types/assignment.type';
import { Replacement, ReplacementStatus } from '@/types/replacement.type';
import { formatDate } from '@/lib/dateUtils';

/**
 * Estructura optimizada para búsqueda de reemplazos
 * Key: "personId:date" -> Value: Replacement
 */
export type ReplacementLookupMap = Map<string, Replacement>;

/**
 * Verifica si una fecha está dentro de un rango (inclusive)
 * @param date - Fecha a verificar en formato YYYY-MM-DD
 * @param startDate - Fecha inicio del rango
 * @param endDate - Fecha fin del rango
 * @returns true si la fecha está en el rango
 */
export function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Crea una clave única para el lookup de reemplazos
 * @param personId - ID de la persona
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns Clave única "personId:date"
 */
export function createReplacementKey(personId: string, date: string): string {
  return `${personId}:${date}`;
}

/**
 * Construye un Map optimizado para búsqueda O(1) de reemplazos
 * 
 * @param replacements - Reemplazos activos
 * @param workDays - Días laborables en el mes
 * @returns Map optimizado para búsqueda
 * 
 * Complejidad: O(r × d) donde:
 * - r = número de reemplazos activos
 * - d = días en el rango de cada reemplazo
 */
export function buildReplacementLookupMap(
  replacements: Replacement[],
  workDays: Date[]
): ReplacementLookupMap {
  const map: ReplacementLookupMap = new Map();
  
  // Solo procesar reemplazos activos
  const activeReplacements = replacements.filter(
    r => r.status === ReplacementStatus.ACTIVE
  );
  
  // Pre-calcular todas las fechas de trabajo como strings
  const workDayStrings = new Set(workDays.map(formatDate));
  
  // Para cada reemplazo activo
  activeReplacements.forEach(replacement => {
    const { originalPersonId, startDate, endDate } = replacement;
    
    // Para cada día de trabajo que caiga en el rango del reemplazo
    workDayStrings.forEach(dateStr => {
      if (isDateInRange(dateStr, startDate, endDate)) {
        const key = createReplacementKey(originalPersonId, dateStr);
        map.set(key, replacement);
      }
    });
  });
  
  return map;
}

/**
 * Aplica los reemplazos a las asignaciones usando lookup O(1)
 * 
 * @param assignments - Asignaciones base
 * @param replacementMap - Map pre-construido de reemplazos
 * @returns Asignaciones con reemplazos aplicados
 * 
 * Complejidad: O(n) donde n = número de asignaciones
 */
export function applyReplacements(
  assignments: Assignment[],
  replacementMap: ReplacementLookupMap
): Assignment[] {
  return assignments.map(assignment => {
    if (!assignment.personId) return assignment;
    
    // Lookup O(1) en lugar de find() O(m)
    const key = createReplacementKey(assignment.personId, assignment.date);
    const replacement = replacementMap.get(key);
    
    if (replacement) {
      return {
        ...assignment,
        originalPersonId: assignment.personId,
        personId: replacement.replacementPersonId,
        isReplacement: true,
        replacementReason: replacement.reason,
      };
    }
    
    return assignment;
  });
}

/**
 * Obtiene todos los reemplazos activos para un período
 * @param replacements - Lista de reemplazos
 * @returns Solo los reemplazos activos
 */
export function getActiveReplacements(replacements: Replacement[]): Replacement[] {
  return replacements.filter(r => r.status === ReplacementStatus.ACTIVE);
}

/**
 * Verifica si una persona tiene un reemplazo activo en una fecha
 * @param personId - ID de la persona
 * @param date - Fecha a verificar (YYYY-MM-DD)
 * @param replacementMap - Map de reemplazos
 * @returns Replacement si existe, undefined si no
 */
export function getReplacementForDate(
  personId: string,
  date: string,
  replacementMap: ReplacementLookupMap
): Replacement | undefined {
  const key = createReplacementKey(personId, date);
  return replacementMap.get(key);
}
