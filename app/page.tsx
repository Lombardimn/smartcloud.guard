'use client';

import MonthSelector from "@/components/MonthSelector";
import { useState, useCallback } from "react";
import { addMonths } from "@/lib/dateUtils";
import Calendar from "@/components/Calendar";

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
    <main className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <header className="flex flex-col items-start w-full max-w-5xl px-4 m-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Guardia de Bugs 🐞
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300">Aquí podrás verificar qué días te corresponden de guardia.</p>
      </header>

      <section className="max-w-5xl flex flex-col px-4 gap-4">
        {/* Selector de mes */}
        <div className="flex flex-col gap-4">
          <MonthSelector
            currentDate={currentDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />

          {/* Calendario */}
          <div className="bg-zinc-100 p-4 rounded-lg shadow">
            <Calendar
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
