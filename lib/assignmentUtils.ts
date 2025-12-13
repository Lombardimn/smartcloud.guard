import { Assignment, AssignmentType } from "../types/assignment.type";
import { isHoliday } from "@/lib/dateUtils";

export const ASSIGNMENT_COLORS = {
  [AssignmentType.REGULAR]:  'bg-guard-day1',
  [AssignmentType.SPECIAL]: 'bg-guard-day2',
  [AssignmentType.HOLIDAY]: 'bg-gray-200',
  noWorkDay: 'bg-gray-100',
  noAssignment: 'bg-white',
  replacement: 'bg-blue-50',
  holiday: 'bg-gray-200' // Color específico para feriados
} as const;

/**
 * Determina el tipo de asignación basado en la fecha y otros criterios
 * @param assignment - La asignación a evaluar
 * @param isWorkDay - Si es un día laboral
 * @returns El tipo de asignación determinado
 */
export const determineAssignmentType = (
  assignment: Assignment,
  isWorkDay: boolean
): AssignmentType | null => {
  if (!isWorkDay || !assignment.personId) {
    return null;
  }

  // Si ya tiene un tipo asignado, lo respetamos
  if (assignment.type) {
    return assignment.type as AssignmentType;
  }

  const date = new Date(assignment.date);
  const dayOfWeek = date.getDay();

  // Lógica para determinar el tipo automáticamente
  // Verificar si es feriado (puedes integrar con una API o lista de feriados)
  if (isHoliday(date)) {
    return AssignmentType.HOLIDAY;
  }

  // Fin de semana o días especiales
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return AssignmentType.SPECIAL;
  }

  // Día regular entre semana
  return AssignmentType.REGULAR;
};

/**
 * Obtiene la clase de fondo apropiada para una asignación
 * @param isWorkDay - Si es un día laboral
 * @param assignment - La asignación (opcional)
 * @param date - Fecha para verificar si es feriado
 * @returns La clase CSS de fondo
 */
export const getBackgroundClass = (
  isWorkDay: boolean,
  assignment?: Assignment,
  date?: Date
): string => {
  // Caso 1: Es un feriado (prioridad máxima)
  if (date && isHoliday(date)) {
    return ASSIGNMENT_COLORS.holiday;
  }

  // Caso 2: No es día laboral (fin de semana)
  if (!isWorkDay) {
    return ASSIGNMENT_COLORS.noWorkDay;
  }

  // Caso 3: No hay asignación o no tiene persona asignada
  if (!assignment || !assignment.personId) {
    return ASSIGNMENT_COLORS.noAssignment;
  }

  // Caso 4: Es un reemplazo
  if (assignment.isReplacement) {
    return `${ASSIGNMENT_COLORS.replacement} border-l-4 border-blue-400`;
  }

  // Caso 5: Determinar el tipo y retornar su color
  const type = determineAssignmentType(assignment, isWorkDay);
  
  if (!type) {
    return ASSIGNMENT_COLORS.noAssignment;
  }

  return ASSIGNMENT_COLORS[type];
};



/**
 * Obtiene un color de texto contrastante para el fondo
 * @param assignmentType - Tipo de asignación
 * @returns Clase CSS para el color de texto
 */
export const getTextColorClass = (assignmentType?:  AssignmentType | null): string => {
  if (!assignmentType) return 'text-gray-600';
  
  const textColors = {
    [AssignmentType.REGULAR]: 'text-gray-900',
    [AssignmentType.SPECIAL]: 'text-gray-900',
    [AssignmentType.HOLIDAY]: 'text-amber-900'
  };

  return textColors[assignmentType] || 'text-gray-900';
};

/**
 * Obtiene un badge o etiqueta para el tipo de asignación
 * @param assignment - La asignación
 * @returns Elemento con badge descriptivo
 */
export const getAssignmentBadge = (assignment: Assignment): string => {
  const badges = {
    [AssignmentType.REGULAR]: '📅 Regular',
    [AssignmentType.SPECIAL]: '⭐ Especial',
    [AssignmentType.HOLIDAY]: '🎉 Feriado'
  };

  if (assignment.isReplacement) {
    return '🔄 Reemplazo';
  }

  return assignment.type ? badges[assignment.type as AssignmentType] : '';
};

/**
 * Convierte un array de asignaciones a un Map para búsquedas O(1)
 * Útil para calendarios donde se necesita buscar por fecha frecuentemente
 * @param assignments - Array de asignaciones
 * @returns Map con fecha como key y asignación como valor
 */
export function createAssignmentMap(assignments: Assignment[]): Map<string, Assignment> {
  const map = new Map<string, Assignment>();
  assignments.forEach(assignment => {
    map.set(assignment.date, assignment);
  });
  return map;
}