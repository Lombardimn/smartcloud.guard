/**
 * Utilidades para manejo de feriados
 */

import holidaysData from '@/data/holidays.json';
import { toISODate } from './dateUtils';

export interface Holiday {
  date: string; // Formato YYYY-MM-DD
  name: string;
  type: 'public' | 'optional';
  icon?: string;
}

export interface HolidaysData {
  holidays: Holiday[];
}

/**
 * Obtiene todos los feriados cargados desde el JSON
 * @returns Array de feriados
 */
export function getAllHolidays(): Holiday[] {
  return (holidaysData as HolidaysData).holidays;
}

/**
 * Crea un Set de fechas de feriados para búsquedas O(1)
 * @returns Set con fechas en formato YYYY-MM-DD
 */
export function getHolidaySet(): Set<string> {
  const holidays = getAllHolidays();
  return new Set(holidays.map(h => h.date));
}

// Cache del Set de feriados para evitar recrearlo en cada llamada
let holidaySetCache: Set<string> | null = null;

/**
 * Obtiene el Set de feriados (con cache)
 * @returns Set con fechas de feriados
 */
function getCachedHolidaySet(): Set<string> {
  if (!holidaySetCache) {
    holidaySetCache = getHolidaySet();
  }
  return holidaySetCache;
}

/**
 * Verifica si una fecha es feriado
 * Optimizado con Set para búsqueda O(1)
 * @param date - Fecha a verificar (Date o string YYYY-MM-DD)
 * @returns true si es feriado
 */
export function isHolidayDate(date: Date | string): boolean {
  const dateStr = typeof date === 'string' ? date : toISODate(date);
  return getCachedHolidaySet().has(dateStr);
}

/**
 * Obtiene información de un feriado específico
 * @param date - Fecha a buscar
 * @returns Información del feriado o undefined
 */
export function getHolidayInfo(date: Date | string): Holiday | undefined {
  const dateStr = typeof date === 'string' ? date : toISODate(date);
  return getAllHolidays().find(h => h.date === dateStr);
}

/**
 * Obtiene todos los feriados de un mes específico
 * @param year - Año
 * @param month - Mes (0-11)
 * @returns Array de feriados del mes
 */
export function getHolidaysInMonth(year: number, month: number): Holiday[] {
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  
  return getAllHolidays().filter(h => h.date.startsWith(prefix));
}

/**
 * Obtiene todos los feriados de un año
 * @param year - Año
 * @returns Array de feriados del año
 */
export function getHolidaysInYear(year: number): Holiday[] {
  const prefix = `${year}-`;
  return getAllHolidays().filter(h => h.date.startsWith(prefix));
}

/**
 * Cuenta los feriados en un rango de fechas
 * @param startDate - Fecha inicial
 * @param endDate - Fecha final
 * @returns Número de feriados en el rango
 */
export function countHolidaysInRange(startDate: Date, endDate: Date): number {
  const start = toISODate(startDate);
  const end = toISODate(endDate);
  
  return getAllHolidays().filter(h => h.date >= start && h.date <= end).length;
}
