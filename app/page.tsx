'use client';

import MonthSelector from "@/components/MonthSelector";
import { useState, useCallback } from "react";
import { addMonths } from "@/lib/dateUtils";
import Calendar from "@/components/Calendar";
import { RotationControl } from "@/components/RotationControl";
import { CalendarLegend } from "@/components/CalendarLegend";

export default function Home() {
  // Estado para la fecha del calendario
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Handlers memoizados para evitar re-renders innecesarios
  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <header className="flex flex-col items-start w-full max-w-5xl px-4 m-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Guardia de Bugs 🐞
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300">Aquí podrás verificar qué días te corresponden de guardia.</p>
      </header>

      <section className="max-w-5xl flex flex-col px-4 gap-4">
        {/* Control de rotación */}
        <RotationControl />
        
        {/* Selector de mes */}
        <div className="flex flex-col gap-4">
          <MonthSelector
            currentDate={currentDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />

          {/* Calendario */}
          <div className="bg-zinc-100 dark:bg-purple-950/20 p-4 rounded-lg shadow mb-4">
            <Calendar
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
            />

          {/* Nota al pie - Solo Desktop */}
          <p className="hidden sm:block mt-4 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-300 dark:border-zinc-700 pt-2">
            Nota: Los reemplazos se calculan con base en la rotación actual.
          </p>
          </div>

          {/* Leyenda del Calendario - Solo Móvil */}
          <CalendarLegend
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
          />
        </div>
      </section>
    </main>
  );
}
