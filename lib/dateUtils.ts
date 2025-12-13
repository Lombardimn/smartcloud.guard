/**
 * Utilidades para manejo de fechas
 * Funciones puras y optimizadas para trabajar con fechas en la aplicación
 */

import { isHolidayDate } from './holidayUtils';

/**
 * Verifica si una fecha es día de semana (lunes a viernes)
 * @param date - Fecha a verificar
 * @returns true si es día de semana (no fin de semana)
 */
export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 = Domingo, 6 = Sábado
}

/**
 * Verifica si una fecha es fin de semana
 * @param date - Fecha a verificar
 * @returns true si es sábado o domingo
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Verifica si una fecha es hoy
 * @param date - Fecha a verificar
 * @returns true si la fecha corresponde al día actual
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica si una fecha es feriado
 * Lee los feriados desde holidays.json
 * @param date - Fecha a verificar
 * @returns true si es feriado
 */
export function isHoliday(date: Date): boolean {
  return isHolidayDate(date);
}

/**
 * Formatea una fecha en formato ISO (YYYY-MM-DD)
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Compara dos fechas ignorando la hora
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns true si son el mismo día
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Obtiene el primer día del mes
 * @param date - Fecha de referencia
 * @returns Nueva fecha con el primer día del mes
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Obtiene el último día del mes
 * @param date - Fecha de referencia
 * @returns Nueva fecha con el último día del mes
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Agrega días a una fecha
 * @param date - Fecha base
 * @param days - Número de días a agregar (puede ser negativo)
 * @returns Nueva fecha con los días agregados
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Cuenta los días laborables entre dos fechas (excluyendo fines de semana y feriados)
 * @param startDate - Fecha inicial
 * @param endDate - Fecha final
 * @returns Número de días laborables
 */
export function countWorkDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isWeekday(current) && !isHoliday(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Obtiene el nombre del mes en español
 * @param monthIndex - Índice del mes (0-11)
 * @returns Nombre del mes
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex] || '';
}

/**
 * Agrega meses a una fecha
 * @param date - Fecha base
 * @param months - Número de meses a agregar (puede ser negativo)
 * @returns Nueva fecha con los meses agregados
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Verifica si una fecha corresponde al mes y año actual
 * @param date - Fecha a verificar
 * @returns true si es el mes y año actual
 */
export function isCurrentMonth(date: Date): boolean {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

/**
 * Obtiene información del mes anterior
 * @param date - Fecha de referencia
 * @returns Objeto con nombre del mes y año
 */
export function getPreviousMonthInfo(date: Date): { month: string; year: number } {
  const prevDate = addMonths(date, -1);
  return {
    month: getMonthName(prevDate.getMonth()),
    year: prevDate.getFullYear()
  };
}

/**
 * Obtiene información del mes siguiente
 * @param date - Fecha de referencia
 * @returns Objeto con nombre del mes y año
 */
export function getNextMonthInfo(date: Date): { month: string; year: number } {
  const nextDate = addMonths(date, 1);
  return {
    month: getMonthName(nextDate.getMonth()),
    year: nextDate.getFullYear()
  };
}

/**
 * Obtiene todos los días de un mes específico
 * @param year - Año
 * @param month - Mes (0-11)
 * @returns Array de fechas del mes
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

/**
 * Obtiene el número de celdas vacías al inicio del calendario
 * (días de la semana antes del primer día del mes)
 * @param year - Año
 * @param month - Mes (0-11)
 * @returns Número de celdas vacías (0-6)
 */
export function getEmptyCellsCount(year: number, month: number): number {
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay();
}

/**
 * Obtiene la fecha de hoy en formato ISO (YYYY-MM-DD)
 * Útil para comparaciones rápidas
 * @returns String con la fecha de hoy
 */
export function getTodayISO(): string {
  return toISODate(new Date());
}

/**
 * Formatea una fecha a string ISO (YYYY-MM-DD)
 * Alias de toISODate para compatibilidad
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return toISODate(date);
}

/**
 * Obtiene todos los días laborables de un mes (excluyendo fines de semana y feriados)
 * @param year - Año
 * @param month - Mes (0-11)
 * @returns Array de fechas laborables
 */
export function getWorkDaysInMonth(year: number, month: number): Date[] {
  const allDays = getDaysInMonth(year, month);
  return allDays.filter(day => isWeekday(day) && !isHoliday(day));
}
