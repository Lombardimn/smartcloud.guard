import { Assignment, AssignmentType } from "../types/assignment.type";

export const ASSIGNMENT_COLORS = {
  [AssignmentType.REGULAR]:  'bg-guard-day1',
  [AssignmentType.SPECIAL]: 'bg-guard-day2',
  [AssignmentType. HOLIDAY]: 'bg-amber-100',
  noWorkDay: 'bg-gray-100',
  noAssignment: 'bg-white',
  replacement: 'bg-blue-50' // Opcional:  color para reemplazos
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
 * @returns La clase CSS de fondo
 */
export const getBackgroundClass = (
  isWorkDay: boolean,
  assignment?: Assignment
): string => {
  // Caso 1: No es día laboral
  if (!isWorkDay) {
    return ASSIGNMENT_COLORS.noWorkDay;
  }

  // Caso 2: No hay asignación o no tiene persona asignada
  if (!assignment || !assignment.personId) {
    return ASSIGNMENT_COLORS. noAssignment;
  }

  // Caso 3: Es un reemplazo
  if (assignment.isReplacement) {
    return `${ASSIGNMENT_COLORS.replacement} border-l-4 border-blue-400`;
  }

  // Caso 4: Determinar el tipo y retornar su color
  const type = determineAssignmentType(assignment, isWorkDay);
  
  if (! type) {
    return ASSIGNMENT_COLORS.noAssignment;
  }

  return ASSIGNMENT_COLORS[type];
};

/**
 * Verifica si una fecha es feriado
 * @param date - Fecha a verificar
 * @returns true si es feriado
 */
const isHoliday = (date: Date): boolean => {
  // Implementa tu lógica de feriados aquí
  // Ejemplo básico con algunos feriados fijos
  const holidays = [
    { month: 0, day: 1 },   // Año nuevo
    { month: 4, day: 1 },   // Día del trabajador
    { month: 11, day: 25 }, // Navidad
    // Agregar más feriados según tu país/región
  ];

  const month = date.getMonth();
  const day = date.getDate();

  return holidays.some(h => h.month === month && h.day === day);
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