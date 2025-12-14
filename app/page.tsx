'use client';

import MonthSelector from "@/components/MonthSelector";
import { useState, useCallback } from "react";
import { addMonths } from "@/lib/dateUtils";
import Calendar from "@/components/Calendar";
import { RotationControl } from "@/components/RotationControl";
import { CalendarLegend } from "@/components/CalendarLegend";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GitHub } from "@/components/icons/GitHub";

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
      <header className="flex items-center justify-between w-full max-w-5xl px-4 m-8 gap-4">
        {/* Título y descripción */}
        <div className="flex flex-col items-start flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Guardia de Bugs 🐞
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Aquí podrás verificar qué días te corresponden de guardia.
          </p>
        </div>

        {/* Controles: GitHub y Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
          <a
            href="https://github.com/Lombardimn/smartcloud.guard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:blur-none bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Ver repositorio en GitHub"
            title="Ver repositorio en GitHub"
          >
            <GitHub className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </a>
          <ThemeToggle />
        </div>
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
          <div className="bg-card p-4 rounded-lg shadow mb-4">
            <Calendar
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
            />

          {/* Nota al pie - Solo Desktop */}
          <p className="hidden sm:block mt-4 text-sm text-muted-foreground border-t border-border pt-2">
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
