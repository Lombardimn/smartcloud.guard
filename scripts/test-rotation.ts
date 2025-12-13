/**
 * Script de prueba para verificar el sistema de rotación continua
 * Ejecutar: tsx scripts/test-rotation.ts
 */

import { getTeamConfig } from '../lib/teamUtils';

// Simulación simplificada de las funciones necesarias
function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // No domingo ni sábado
}

function calculateWorkdaysSinceStart(startDate: string, targetYear: number, targetMonth: number): number {
  const start = new Date(startDate);
  const target = new Date(targetYear, targetMonth, 1);
  
  if (target <= start) return 0;
  
  let workDays = 0;
  const current = new Date(start);
  current.setDate(current.getDate() + 1); // Empezar desde el día siguiente
  
  while (current < target) {
    if (isWeekday(current)) {
      workDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
}

function calculateStartingPoint(
  year: number,
  month: number,
  rotationOrderLength: number,
  startDate: string
): { personIndex: number; dayType: 'day1' | 'day2' | 'complete' } {
  const workdaysSinceStart = calculateWorkdaysSinceStart(startDate, year, month);
  
  const daysPerPerson = 2;
  const totalCycles = Math.floor(workdaysSinceStart / daysPerPerson);
  const remainderDays = workdaysSinceStart % daysPerPerson;
  
  const personIndex = totalCycles % rotationOrderLength;
  
  let dayType: 'day1' | 'day2' | 'complete';
  if (remainderDays === 0) {
    dayType = 'complete';
  } else if (remainderDays === 1) {
    dayType = 'day2';
  } else {
    dayType = 'complete';
  }
  
  return { personIndex, dayType };
}

// Ejecutar prueba
console.log('\n🧪 Test del Sistema de Rotación Continua\n');
console.log('='.repeat(60));

const config = getTeamConfig();
const rotationOrder = ["gc", "rv", "mb", "mc", "mp", "fv"];

console.log(`\n📅 Fecha de inicio: ${config.startDate}`);
console.log(`👥 Orden de rotación: ${rotationOrder.join(' → ')}`);
console.log(`🔄 Días por guardia: ${config.daysPerGuard}\n`);

const monthsToTest = [
  { year: 2026, month: 0, name: 'Enero 2026' },
  { year: 2026, month: 1, name: 'Febrero 2026' },
  { year: 2026, month: 2, name: 'Marzo 2026' },
  { year: 2026, month: 3, name: 'Abril 2026' },
  { year: 2026, month: 6, name: 'Julio 2026' },
  { year: 2026, month: 11, name: 'Diciembre 2026' },
];

console.log('📊 Resultados:\n');
console.log('-'.repeat(60));

for (const { year, month, name } of monthsToTest) {
  const workdays = calculateWorkdaysSinceStart(config.startDate, year, month);
  const result = calculateStartingPoint(year, month, rotationOrder.length, config.startDate);
  const person = rotationOrder[result.personIndex];
  
  console.log(`\n${name}:`);
  console.log(`  Días laborables acumulados: ${workdays}`);
  console.log(`  Comienza con: ${person.toUpperCase()}`);
  console.log(`  Tipo de día: ${result.dayType}`);
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ Test completado\n');
