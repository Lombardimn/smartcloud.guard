import { isWeekday, isHoliday } from '@/lib/dateUtils';

const testDays = [
  '2026-01-03', // Sábado
  '2026-01-04', // Domingo  
  '2026-01-10', // Sábado
  '2026-01-17', // Sábado
  '2026-01-24', // Sábado
];

for (const dateStr of testDays) {
  const date = new Date(dateStr);
  console.log(`${dateStr} (${date.toLocaleDateString('es-ES', { weekday: 'long' })}): isWeekday=${isWeekday(date)}, isHoliday=${isHoliday(date)}`);
}
